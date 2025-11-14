import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
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

// Custom error interface
interface CustomError extends Error {
  status?: number;
  statusCode?: number;
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
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          scriptSrc: ["'self'"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "wss:", "ws:"]
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://quantumcharts.com', 'https://www.quantumcharts.com']
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5177'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Request logging
    this.app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

    // Compression for better performance
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
      message: {
        error: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use('/api/', limiter);

    // Stricter rate limiting for auth endpoints
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5, // 5 login attempts per 15 minutes
      message: {
        error: 'Too many authentication attempts, please try again later.'
      }
    });
    this.app.use('/api/auth/login', authLimiter);
    this.app.use('/api/auth/register', authLimiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/trading', tradingRoutes);
    this.app.use('/api/mining', miningRoutes);
    this.app.use('/api/chat', chatRoutes);
    this.app.use('/api/gaming', gameRoutes);
    this.app.use('/api/market', marketRoutes);
    this.app.use('/api/personalities', personalitiesRoutes);
  this.app.use('/api/rss', rssRoutes);

    // Minimal sample endpoint for ForecastCone during development
    this.app.get('/api/forecast/cone', (req: Request, res: Response) => {
      const n = 30;
      const base = Array.from({ length: n }, (_, i) => 100 + i * 0.5 + Math.sin(i / 2) * 2);
      const forecast = base.map((v, i) => v + i * 0.2);
      const upper = forecast.map((v, i) => v + 2 + i * 0.1);
      const lower = forecast.map((v, i) => v - 2 - i * 0.1);
      res.json({ forecast, upper, lower });
    });

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static('dist'));
      
      // Catch all handler for SPA
      this.app.get('*', (req: Request, res: Response) => {
        res.sendFile('index.html', { root: 'dist' });
      });
    }

    // 404 handler for API routes
    this.app.use('/api', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((error: CustomError, req: Request, res: Response, next: express.NextFunction) => {
      const status = error.status || error.statusCode || 500;
      const message = error.message || 'Internal Server Error';

      // Log error details
      console.error(`[${new Date().toISOString()}] Error ${status}:`, {
        message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Send error response
      res.status(status).json({
        error: {
          message,
          status,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        }
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't crash the process in production
      if (process.env.NODE_ENV === 'production') {
        console.error('Application would have crashed due to unhandled rejection, but continuing...');
      } else {
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      process.exit(0);
    });
  }

  public async start(): Promise<void> {
    try {
      // Try to initialize database connection, but don't fail if it's not available
      try {
        await initializeDatabase();
        console.log('📊 Database: Connected');
      } catch {
        console.warn('⚠️ Database: Not connected (MongoDB not running)');
        console.log('💡 Server will run without database features');
      }

      // Start server
      this.app.listen(this.port, () => {
        console.log(`
🚀 Quantum Charts Server Started Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Port: ${this.port}
🔗 API Base: http://localhost:${this.port}/api
🏥 Health Check: http://localhost:${this.port}/health
🔒 Security: Enabled (Helmet, CORS, Rate Limiting)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

export default QuantumChartsServer;