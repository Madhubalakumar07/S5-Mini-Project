// Frontend student data service — fetches student data from backend API.
// All data is scoped to the authenticated user by the backend (no studentId param needed).

import { apiClient } from './apiClient';

export const studentService = {
  async getDashboard() {
    try {
      const result = await apiClient.get('/student/dashboard');
      return result.data || result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to load dashboard data');
    }
  },

  async getAttendance() {
    try {
      const result = await apiClient.get('/student/attendance');
      return result.data || result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to load attendance data');
    }
  },

  async getAcademics() {
    try {
      const result = await apiClient.get('/student/academics');
      return result.data || result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to load academics data');
    }
  },

  async getPlacement() {
    try {
      const result = await apiClient.get('/student/placement');
      return result.data || result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to load placement data');
    }
  },

  async getProfile() {
    try {
      const result = await apiClient.get('/student/profile');
      return result.data || result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to load profile');
    }
  },
};
