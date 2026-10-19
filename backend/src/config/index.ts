import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust candidate paths to locate .env across different execution working directories
const candidateEnvPaths = [
  path.resolve(__dirname, '../../.env'), // backend/.env
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(process.cwd(), 'S5-Mini-Project/backend/.env'),
  path.resolve(__dirname, '../../../.env'),
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }
}

// Clean API keys (remove accidental wrapping quotes or whitespace)
const cleanKey = (key: string | undefined): string => {
  if (!key) return '';
  return key.replace(/^["']|["']$/g, '').trim();
};

export const config = {
  get port(): number {
    return process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  },
  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'campusai_jwt_secret_default_key_2026';
  },
  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '7d';
  },
  get refreshTokenSecret(): string {
    return process.env.REFRESH_TOKEN_SECRET || 'campusai_refresh_secret_key_2026';
  },
  get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
  },
  get orgEmailDomain(): string {
    return process.env.ORG_EMAIL_DOMAIN || 'bitsathy.ac.in';
  },
  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  },
  get databaseUrl(): string {
    return process.env.DATABASE_URL || 'postgres://postgres:2525@localhost:5432/miniproject';
  },
  get geminiApiKey(): string {
    return cleanKey(process.env.GEMINI_API_KEY);
  },
  set geminiApiKey(val: string) {
    process.env.GEMINI_API_KEY = val;
  },
  get groqApiKey(): string {
    return cleanKey(process.env.GROQ_API_KEY);
  },
  set groqApiKey(val: string) {
    process.env.GROQ_API_KEY = val;
  },
  get groqModel(): string {
    return process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  },
  set groqModel(val: string) {
    process.env.GROQ_MODEL = val;
  },
  bcryptSaltRounds: 10,
  get googleClientId(): string {
    return cleanKey(process.env.GOOGLE_CLIENT_ID);
  },
  set googleClientId(val: string) {
    process.env.GOOGLE_CLIENT_ID = val;
  },
  get googleClientSecret(): string {
    return cleanKey(process.env.GOOGLE_CLIENT_SECRET);
  },
  set googleClientSecret(val: string) {
    process.env.GOOGLE_CLIENT_SECRET = val;
  },
  get googleCallbackUrl(): string {
    return process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';
  },
  set googleCallbackUrl(val: string) {
    process.env.GOOGLE_CALLBACK_URL = val;
  },

};



