import { IUserRepository } from './IUserRepository.js';
import { postgresUserRepository } from './postgresUserRepository.js';
import { MockUserRepository } from './mockUserRepository.js';
import { User, SafeUser } from '../types/index.js';

const fallbackMockRepo = new MockUserRepository();

export class HybridUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await postgresUserRepository.findByEmail(email);
      if (user) return user;
    } catch (err: any) {
      console.warn(`[DB Warning] PostgreSQL query failed (${err.message}), checking fallback.`);
    }
    return fallbackMockRepo.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await postgresUserRepository.findById(id);
      if (user) return user;
    } catch (err: any) {
      console.warn(`[DB Warning] PostgreSQL query failed (${err.message}), checking fallback.`);
    }
    return fallbackMockRepo.findById(id);
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      return await postgresUserRepository.create(userData);
    } catch (err: any) {
      console.warn(`[DB Warning] PostgreSQL query failed (${err.message}), saving to fallback.`);
      return fallbackMockRepo.create(userData);
    }
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    try {
      const updated = await postgresUserRepository.update(id, updateData);
      if (updated) return updated;
    } catch (err: any) {
      console.warn(`[DB Warning] PostgreSQL query failed (${err.message}), checking fallback.`);
    }
    return fallbackMockRepo.update(id, updateData);
  }

  sanitizeUser(user: User): SafeUser {
    return postgresUserRepository.sanitizeUser(user);
  }
}

export const userRepository = new HybridUserRepository();
export { postgresUserRepository };
