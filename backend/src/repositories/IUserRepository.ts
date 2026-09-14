import { User, SafeUser } from '../types/index.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, updateData: Partial<User>): Promise<User | null>;
  sanitizeUser(user: User): SafeUser;
}
