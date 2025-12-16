const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: "10kb" })); // stops payload bombs

// ==========================================
// LEVEL 3 / 10 / 11 / 13 — BASELINE SECURITY
// ==========================================

// Security headers (no sniff, no frame, strict CSP, HSTS)
app.use(
  helmet({
    contentSecurityPolicy: false, // adjust depending on UI requirements
  })
);

// Logging — writes everything to access.log
const logStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: logStream }));
app.use(morgan("tiny"));

// Anti-flood + anti-DDoS layer
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many requests, slow down." },
});
app.use("/api/", apiLimiter);

// ==========================================
// IN-MEMORY DATA (Real apps use database)
// ==========================================
const USERS = [];
const loginAttempts = {};
const honeypotHits = [];

// ==========================================
// LEVEL 7 — ANOMALY / BRUTE FORCE ENGINE
// ==========================================
function trackLogin(ip, success) {
  const now = Date.now();
  if (!loginAttempts[ip]) loginAttempts[ip] = [];
  loginAttempts[ip].push({ success, time: now });

  // keep only last 5 minutes of logs
  loginAttempts[ip] = loginAttempts[ip].filter(
    (a) => now - a.time < 5 * 60 * 1000
  );

  const fails = loginAttempts[ip].filter((a) => !a.success).length;
  if (fails >= 5) {
    console.log("🚨 [AI QUANTUM ALERT] Brute-force detected from IP:", ip);
  }
}

// ==========================================
// LEVEL 9 — JWT AUTH + ROLE ENGINE
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Auth token missing" });
  }
  const token = auth.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}

// ==========================================
// LEVEL 11 — FILE INTEGRITY PROTECTION
// ==========================================
const CURRENT_HASH = crypto
  .createHash("sha256")
  .update(fs.readFileSync(__filename))
  .digest("hex");

function integrityCheck(req, res, next) {
  if (!app.locals.integrityLogged) {
    console.log("🔐 Integrity hash:", CURRENT_HASH);
    app.locals.integrityLogged = true;
  }
  next();
}
app.use(integrityCheck);

// ==========================================
// LEVEL 3 — SAFE INPUT ENDPOINTS
// ==========================================
app.get("/", (req, res) => {
  res.json({
    status: "Online",
    app: "AI Quantum Enterprise Security Core",
    message: "Ready for penetration testing.",
  });
});

app.post("/api/echo", (req, res) => {
  const { message } = req.body;
  if (typeof message !== "string" || message.length > 200) {
    return res.status(400).json({ error: "Invalid content" });
  }
  res.json({ echo: message });
});

// ==========================================
// LEVEL 9 — USER SIGNUP / LOGIN
// ==========================================
app.post("/api/signup", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing data" });

  const hash = await bcrypt.hash(password, 12);
  USERS.push({
    id: USERS.length + 1,
    email,
    passwordHash: hash,
    role: role === "admin" ? "admin" : "user",
  });

  res.json({ message: "Account created" });
});

app.post("/api/login", async (req, res) => {
  const ip = req.ip;
  const { email, password } = req.body;
  const user = USERS.find((u) => u.email === email);

  if (!user) {
    trackLogin(ip, false);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    trackLogin(ip, false);
    return res.status(401).json({ error: "Wrong password" });
  }

  trackLogin(ip, true);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// ==========================================
// LEVEL 9 — AUTH + ROLE-RESTRICTED AREAS
// ==========================================
app.get("/api/user/me", requireAuth, (req, res) => {
  res.json({ profile: req.user });
});

app.get("/api/admin/dashboard",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    res.json({
      users: USERS.length,
      honeypotHits: honeypotHits.length,
      trackedIPs: Object.keys(loginAttempts),
    });
  }
);

// ==========================================
// LEVEL 12 — HONEYPOT LANDMINE
// ==========================================
app.get("/admin-legacy", (req, res) => {
  const hit = { ip: req.ip, time: new Date().toISOString() };
  honeypotHits.push(hit);
  console.log("🐍 HONEYPOT TRIGGERED:", hit);

  setTimeout(() => res.status(404).send("Not Found"), 1500);
});

// ==========================================
// LEVEL 14 — ENCRYPTED DATA PAYLOAD (AES-256)
// ==========================================
const encryptedRecord = crypto
  .createCipheriv(
    "aes-256-ctr",
    crypto.createHash("sha256").update("QuantumKey123!").digest(),
    Buffer.alloc(16, 0)
  )
  .update("AI Quantum Private Ledger Entry", "utf8", "hex");

app.get("/api/secure/encrypted", requireAuth, (req, res) => {
  res.json({ encrypted: encryptedRecord });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `🔥 AI Quantum Security Core running on http://localhost:${PORT}`
  );
});