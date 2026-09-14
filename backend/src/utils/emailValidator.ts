import { config } from '../config/index.js';

export class EmailValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailValidationError';
  }
}

/**
 * Normalizes email address by trimming whitespace and converting to lowercase.
 */
export const normalizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

/**
 * Validates that an email strictly belongs to the official organization domain (@bitsathy.ac.in).
 * Rejects public domains like gmail.com, yahoo.com, outlook.com, etc.
 */
export const validateOrgEmail = (email: string): { isValid: boolean; normalizedEmail: string; error?: string } => {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return { isValid: false, normalizedEmail: '', error: 'Email address is required.' };
  }

  // Basic RFC 5322 format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(normalized)) {
    return { isValid: false, normalizedEmail: normalized, error: 'Invalid email format.' };
  }

  const expectedDomain = config.orgEmailDomain.toLowerCase(); // 'bitsathy.ac.in'
  const domainPart = normalized.split('@')[1];

  if (!domainPart || domainPart !== expectedDomain) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      error: `Access restricted. Only official organization accounts (@${expectedDomain}) are permitted.`,
    };
  }

  return { isValid: true, normalizedEmail: normalized };
};
