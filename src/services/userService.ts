import api from './api';
import { type User } from './authService';

// Types for user operations
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserListResponse {
  success: boolean;
  count: number;
  statistics: {
    totalUsers: number;
    activeUsers: number;
    newThisMonth: number;
  };
  data: User[];
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

// User CRUD API functions
export const userService = {
  // Get all users with pagination and filters
  getUsers: async (filters: UserFilters = {}): Promise<UserListResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);

      const response = await api.get(`/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<User> => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Update user password
  updatePassword: async (id: string, passwordData: { currentPassword: string; newPassword: string }): Promise<void> => {
    try {
      await api.put(`/users/${id}/password`, passwordData);
    } catch (error) {
      throw error;
    }
  }
};
