
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

const app = express();
const port = 4000;

// --- CORE SECURITY MIDDLEWARE ---

// 1. Helmet for standard security headers
app.use(helmet());

// 2. Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// 3. Morgan for logging requests
app.use(morgan('dev'));

// --- PSYCHOLOGICAL WARFARE DECEPTION LAYER ---

// ==========================================
// HACKER TAUNT MESSAGES (BLACKLIST RESPONSE)
// 35 insecurity-based psychological stingers
// ==========================================
const HACKER_TAUNTS = [
  // Status / success / money
  "Quick question: for all this effort trying to break into strangers' servers, do you ever wonder why you’re still not where you thought you’d be in life?",
  "When you close this window, do you go back to a life you’re proud of, or just more things you’re avoiding?",
  "Be honest—do you feel more in control poking at code than you do handling your own bills and responsibilities?",
  "If this ‘hack’ fails, do you just move on to the next target, or does it quietly confirm what you already fear about your abilities?",
  "Does breaking other people’s stuff feel like the only place you can pretend you’re winning?",
  "If someone asked what you actually built instead of what you tried to break, would you have an answer that impresses even you?",
  "Are you more afraid of being caught right now, or of staying exactly where you are in life for the next 10 years?",

  // Competence / intelligence
  "Do you ever worry that the people you look up to in tech would see your methods and quietly think, ‘this is pretty basic’?",
  "When something doesn’t work on the first try, do you debug patiently—or rage and blame everyone but yourself?",
  "If you weren’t hiding behind a keyboard, would you still feel this confident about your skill level?",
  "Do you ever reread your own code and secretly wonder if you’re actually as good as you tell people you are?",
  "How many courses, books, and tutorials have you started but never finished because finishing would prove what you are—or aren’t—capable of?",

  // Relationships / trust / cheating
  "Are you married or in a relationship, or is this the closest thing you have to intimacy—arguing with firewalls at 3 a.m.?",
  "If you’re here trying to control my system, does it ever bother you that you can’t control what’s happening in your own relationships?",
  "Do you trust your partner as much as you expect them to trust you, or do you quietly suspect they hide things from you too?",
  "If your partner knew exactly how you spent your time online, would they be impressed—or quietly disappointed?",
  "While you’re here trying to break into someone else’s world, do you ever wonder what your partner is really doing in theirs?",
  "Is there a part of you that worries they talk about you the way you talk about your targets—weak, exploitable, easy to bypass?",

  // Body / aging / appearance
  "When you look in the mirror, do you like the person staring back, or just the screen that hides them?",
  "Do you ever zoom out from the monitor and notice how long it’s been since you actually took care of your body?",
  "Are you more worried about losing access to this system, or losing the health you’ve been trading away one all-nighter at a time?",
  "Does aging scare you because of the wrinkles—or because you’re not where you thought you’d be by now?",
  "Would you rather upgrade your hardware or your habits, and which one do you secretly know is harder?",

  // Social comparison / respect / legacy
  "If the people you respect the most could see this exact moment, would they see ‘clever operator’ or ‘stuck and trying to feel powerful’?",
  "Do you chase exploits because it’s exciting, or because it’s easier than building something that actually outlives you?",
  "How many of your ‘wins’ exist only in logs and screenshots that no one else has ever respected?",
  "If your name disappeared from the internet tomorrow, would anything you’ve done so far actually be missed?",
  "Do you want to be feared, respected, or understood—and which one are your actions really creating right now?",

  // Control / insecurity / loneliness
  "Do you feel more in control here because so much of your offline life feels out of control?",
  "Is this really about my system, or about proving something to yourself that you still haven’t said out loud?",
  "When was the last time you had a deep, honest conversation with someone who actually knows the real you—not just your handle?",
  "If you stepped away from all of this for a month, would anyone notice, or would that silence scare you more than any firewall?",
  "Do you ever wonder if all this effort to control other people’s systems is just a way to avoid fixing your own?",
  "Are you doing this because you’re curious and talented—or because feeling like a threat is easier than admitting you’re lonely?",
  "If this system stays locked and you walk away empty-handed, what uncomfortable truth about yourself does that confirm?",
  "You’ve learned how to probe other people’s defenses—when’s the last time you honestly examined your own?",
];

function getHackerTaunt() {
  const i = Math.floor(Math.random() * HACKER_TAUNTS.length);
  return HACKER_TAUNTS[i];
}

// IP blacklist
const ipBlacklist = new Set<string>();

// IP firewall - runs before everything else
function ipFirewall(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip;

  if (ipBlacklist.has(clientIp)) {
    console.log("🚫 BLACKLISTED REQUEST:", {
      ip: clientIp,
      time: new Date().toISOString(),
      path: req.originalUrl,
    });

    return res.status(403).json({
      error: "Access denied.",
      message: getHackerTaunt(),
    });
  }

  next();
}

app.use(ipFirewall);

// --- STANDARD ROUTES & SERVER START ---

app.get('/', (req: Request, res: Response) => {
  res.send('AI Quantum Security Core is active. All systems nominal.');
});

// Endpoint to manually trigger the firewall for testing
app.get('/professor-admin', (req: Request, res: Response) => {
    const clientIp = req.ip;
    ipBlacklist.add(clientIp);
    res.status(200).send(`IP ${clientIp} has been blacklisted. The psychological warfare begins now.`);
});

// Catch-all for any other routes to avoid information leakage
app.use((req: Request, res: Response) => {
  res.status(404).send("Endpoint not found. This attempt has been logged.");
});


app.listen(port, () => {
  console.log(`🔥 AI Quantum Security Core running on http://localhost:${port}.`);
  console.log(`🛡️  The bodyguard is now active.`);
});

export default app;
