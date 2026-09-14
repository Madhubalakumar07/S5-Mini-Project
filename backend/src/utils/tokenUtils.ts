import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';
import { SafeUser, JwtPayload } from '../types/index.js';

/**
 * Generates an authenticated JWT token containing minimal, non-sensitive payload.
 */
export const generateAccessToken = (user: SafeUser): string => {
  const payload: JwtPayload = {
    sub: user.id,
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    department: user.department,
  };

  const options: SignOptions = {
    expiresIn: (config.jwtExpiresIn || '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.jwtSecret, options);
};

/**
 * Verifies JWT token and extracts decoded payload.
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
