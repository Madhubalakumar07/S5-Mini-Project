// Frontend staff data service — fetches staff data from backend API endpoints.

import { apiClient } from './apiClient';

export const staffApiService = {
  async getDashboard() {
    const result = await apiClient.get('/staff/dashboard');
    return result.data || result;
  },

  async getStudents(filters?: { riskLevel?: string; department?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.riskLevel) params.set('riskLevel', filters.riskLevel);
    if (filters?.department) params.set('department', filters.department);
    if (filters?.search) params.set('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const result = await apiClient.get(`/staff/students${qs}`);
    return result.data || result;
  },

  async getStudentById(studentId: string) {
    const result = await apiClient.get(`/staff/students/${studentId}`);
    return result.data || result;
  },

  async getAttendance() {
    const result = await apiClient.get('/staff/attendance');
    return result.data || result;
  },

  async saveAttendance(session: object) {
    const result = await apiClient.post('/staff/attendance', session);
    return result.data || result;
  },

  async getAcademics(subject?: string) {
    const qs = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    const result = await apiClient.get(`/staff/academics${qs}`);
    return result.data || result;
  },

  async getPlacement() {
    const result = await apiClient.get('/staff/placement');
    return result.data || result;
  },

  async getSupport(status?: string) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    const result = await apiClient.get(`/staff/support${qs}`);
    return result.data || result;
  },

  async updateSupport(id: string, updateData: object) {
    const result = await apiClient.patch(`/staff/support/${id}`, updateData);
    return result.data || result;
  },

  async getAnnouncements() {
    const result = await apiClient.get('/staff/announcements');
    return result.data || result;
  },

  async createAnnouncement(announcement: object) {
    const result = await apiClient.post('/staff/announcements', announcement);
    return result.data || result;
  },

  async getReports() {
    const result = await apiClient.get('/staff/reports');
    return result.data || result;
  },

  async getProfile() {
    const result = await apiClient.get('/staff/profile');
    return result.data || result;
  },
};
