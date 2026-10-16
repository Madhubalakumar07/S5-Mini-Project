import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  jwtSecret: process.env.JWT_SECRET || 'campusai_jwt_secret_default_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'campusai_refresh_secret_key_2026',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  orgEmailDomain: process.env.ORG_EMAIL_DOMAIN || 'bitsathy.ac.in',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:madhubalakumar0725@localhost:5432/Campus_AI',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  bcryptSaltRounds: 10,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
};


