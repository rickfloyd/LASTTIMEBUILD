import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { initializeDatabase } from '../database/config';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import tradingRoutes from './routes/trading';
import miningRoutes from './routes/mining';
import chatRoutes from './routes/chat';
import gameRoutes from './routes/gaming';
import marketRoutes from './routes/market';
import personalitiesRoutes from './routes/personalities';
import rssRoutes from './routes/rss';

// ==========================================
// DECEPTION LOCKDOWN LAYER - GLOBAL STATE
// ==========================================
const ipBlacklist = new Set<string>(); // IPs that are locked out
export let jwtVersion = 1; // Used to instantly invalidate all tokens

// Shared JWT Secret
export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

// Helper: trigger lockdown + rotate JWT version
function triggerLockdown(reason: string, req: Request) {
  const clientIp = req.ip;
  if (clientIp) {
    jwtVersion += 1; // all old tokens die
    ipBlacklist.add(clientIp); // this IP gets banned
    console.log("🧨 LOCKDOWN TRIGGERED:", {
      reason,
      ip: clientIp,
      newJwtVersion: jwtVersion,
      time: new Date().toISOString(),
    });
  }
}

// IP firewall - runs before everything else
function ipFirewall(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip;
  if (clientIp && ipBlacklist.has(clientIp)) {
    return res.status(403).json({
      error: "Access temporarily blocked from this address.",
    });
  }
  next();
}

// Custom error interface
interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

// In-memory data for security monitoring
const loginAttempts: { [ip: string]: { success: boolean, time: number }[] } = {};
const honeypotHits: { ip: string | undefined, time: string }[] = [];

export function trackLogin(ip: string, success: boolean): void {
  const now = Date.now();
  if (!loginAttempts[ip]) loginAttempts[ip] = [];
  loginAttempts[ip].push({ success, time: now });
  loginAttempts[ip] = loginAttempts[ip].filter(a => now - a.time < 5 * 60 * 1000);
  const fails = loginAttempts[ip].filter(a => !a.success).length;
  if (fails >= 5) {
    console.log("🚨 [AI QUANTUM ALERT] Brute-force detected from IP:", ip);
    triggerLockdown('Brute-force detection', { ip } as Request);
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}

function requireAuth(req: Request, res: Response, next: express.NextFunction) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Auth token missing" });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!payload.v || payload.v !== jwtVersion) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

class QuantumChartsServer {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(ipFirewall);
    const CURRENT_HASH = crypto.createHash("sha256").update(fs.readFileSync(__filename)).digest("hex");
    this.app.use((req, res, next) => {
      if (!this.app.locals.integrityLogged) {
        console.log("🔐 Integrity hash:", CURRENT_HASH);
        this.app.locals.integrityLogged = true;
      }
      next();
    });
    this.app.use(helmet());
    this.app.use(cors());
    const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
    this.app.use(morgan("combined", { stream: logStream }));
    this.app.use(morgan("dev"));
    this.app.use(compression());
    const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
    this.app.use('/api/', limiter);
    const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
    this.app.use('/api/auth/login', authLimiter);
    this.app.use('/api/auth/register', authLimiter);
    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.get('/health', (req: Request, res: Response) => res.status(200).json({ status: 'OK' }));
  }

  private initializeRoutes(): void {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/trading', tradingRoutes);
    this.app.use('/api/mining', miningRoutes);
    this.app.use('/api/chat', chatRoutes);
    this.app.use('/api/gaming', gameRoutes);
    this.app.use('/api/market', marketRoutes);
    this.app.use('/api/personalities', personalitiesRoutes);
    this.app.use('/api/rss', rssRoutes);

    this.app.get("/admin-legacy", (req, res) => {
      const hit = { ip: req.ip, time: new Date().toISOString() };
      honeypotHits.push(hit);
      console.log("🐍 HONEYPOT TRIGGERED:", hit);
      triggerLockdown('Legacy admin honeypot', req);
      setTimeout(() => res.status(404).send("Not Found"), 1500);
    });

    this.app.post("/api/admin/override", (req, res) => {
      const { masterKey } = req.body || {};
      if (typeof masterKey === "string" && masterKey.length > 0) {
        triggerLockdown("Deception override trap fired", req);
        return res.json({ success: true, message: "Admin override accepted." });
      }
      return res.status(404).json({ error: "Not found" });
    });

    const encryptedRecord = crypto.createCipheriv("aes-256-ctr", crypto.createHash("sha256").update("QuantumKey123!").digest(), Buffer.alloc(16, 0)).update("AI Quantum Private Ledger Entry", "utf8", "hex");
    this.app.get("/api/secure/encrypted", requireAuth, (req, res) => {
      res.json({ encrypted: encryptedRecord });
    });

    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static('dist'));
      this.app.get('*', (req: Request, res: Response) => res.sendFile('index.html', { root: 'dist' }));
    }

    this.app.use('/api', (req: Request, res: Response) => res.status(404).json({ error: 'API endpoint not found' }));
  }

  private initializeErrorHandling(): void {
    this.app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';
      res.status(status).json({ error: { message, status } });
    });
  }

  public async start(): Promise<void> {
    try {
      await initializeDatabase();
      console.log('📊 Database: Connected');
    } catch { console.warn('⚠️ Database: Not connected'); }
    this.app.listen(this.port, () => console.log(`🚀 Server running on http://localhost:${this.port}`));
  }

  public getApp(): Application {
    return this.app;
  }
}

export default QuantumChartsServer;
