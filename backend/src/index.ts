import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/index.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import { sendSuccess, sendError } from './utils/responseUtils.js';

dotenv.config();

const app = express();

// ── Security & Parsing Middleware ───────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [config.frontendUrl, 'http://localhost:5173', 'http://localhost:3000'];
      // Allow requests with no origin (server-to-server, curl, etc.) in dev
      if (!origin || allowed.includes(origin) || config.nodeEnv === 'development') {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  sendSuccess(res, {
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CampusAI Backend API',
    environment: config.nodeEnv,
    orgDomain: config.orgEmailDomain,
  }, 'Service is healthy');
});

// 404 fallback
app.use((_req, res) => {
  sendError(res, 'Route not found.', 404);
});

// ── Global Error Handler ────────────────────────────────────────────────
app.use(globalErrorHandler);

// ── Start Server ────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 CampusAI Backend running at http://localhost:${config.port}`);
  console.log(`🔐 Auth API:    http://localhost:${config.port}/api/auth`);
  console.log(`👨‍🎓 Student API: http://localhost:${config.port}/api/student`);
  console.log(`👩‍🏫 Staff API:   http://localhost:${config.port}/api/staff`);
  console.log(`🤖 AI API:      http://localhost:${config.port}/api/ai`);
  console.log(`🏫 Org domain:  @${config.orgEmailDomain}`);
  console.log(`🌍 CORS origin: ${config.frontendUrl}`);
  console.log(`🔧 Mode:        ${config.nodeEnv}\n`);
});

export default app;
