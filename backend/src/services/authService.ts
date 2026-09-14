import { userRepository } from '../repositories/mockUserRepository.js';
import { validateOrgEmail } from '../utils/emailValidator.js';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/passwordUtils.js';
import { generateAccessToken } from '../utils/tokenUtils.js';
import { AuthResponseData, LoginDTO, RegisterDTO, SafeUser } from '../types/index.js';

export const authService = {
  /**
   * Validates credentials, verifies organization email, determines role from DB,
   * and generates access token. Role is NEVER taken from frontend input.
   */
  async login(dto: LoginDTO): Promise<AuthResponseData> {
    const { isValid, normalizedEmail, error: emailError } = validateOrgEmail(dto.email);
    if (!isValid) {
      const err = new Error(emailError || 'Invalid email.');
      (err as any).statusCode = 400;
      throw err;
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      // Generic message to prevent user enumeration
      const err = new Error('Invalid email or password.');
      (err as any).statusCode = 401;
      throw err;
    }

    const passwordMatch = await verifyPassword(dto.password, user.passwordHash);
    if (!passwordMatch) {
      const err = new Error('Invalid email or password.');
      (err as any).statusCode = 401;
      throw err;
    }

    const safeUser = userRepository.sanitizeUser(user);
    const token = generateAccessToken(safeUser);

    return { user: safeUser, token };
  },

  /**
   * Registers a new user account. Role is determined server-side based on
   * organization provisioning logic — cannot be set by the frontend.
   * Only STUDENT role may self-register; STAFF must be provisioned by admin.
   */
  async register(dto: RegisterDTO): Promise<AuthResponseData> {
    const { isValid, normalizedEmail, error: emailError } = validateOrgEmail(dto.email);
    if (!isValid) {
      const err = new Error(emailError || 'Invalid email.');
      (err as any).statusCode = 400;
      throw err;
    }

    const { isValid: pwValid, error: pwError } = validatePasswordStrength(dto.password);
    if (!pwValid) {
      const err = new Error(pwError || 'Password does not meet requirements.');
      (err as any).statusCode = 400;
      throw err;
    }

    if (!dto.name || dto.name.trim().length < 2) {
      const err = new Error('Full name is required (minimum 2 characters).');
      (err as any).statusCode = 400;
      throw err;
    }

    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      const err = new Error('An account with this email address already exists.');
      (err as any).statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(dto.password);

    // Role is determined SERVER-SIDE only — students self-register as STUDENT.
    // STAFF accounts are provisioned through admin/import processes only.
    const role: 'STUDENT' | 'STAFF' = 'STUDENT';

    const newUser = await userRepository.create({
      name: dto.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      department: dto.department || 'Computer Science',
      rollNumber: dto.rollNumber,
      phone: dto.phone,
      batch: dto.batch || '2026',
      cgpa: dto.cgpa,
    });

    const safeUser = userRepository.sanitizeUser(newUser);
    const token = generateAccessToken(safeUser);

    return { user: safeUser, token };
  },

  /**
   * Fetches the authenticated user's profile by their verified ID.
   */
  async getMe(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User account not found.');
      (err as any).statusCode = 404;
      throw err;
    }
    return userRepository.sanitizeUser(user);
  },
};
