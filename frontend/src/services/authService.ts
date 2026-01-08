import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'admin' | 'kitchen';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

class AuthService {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.success && response.data.token) {
      this.setAuthData(response.data.token, response.data.user);
    }
    return response.data;
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.success && response.data.token) {
      this.setAuthData(response.data.token, response.data.user);
    }
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.get('/auth/logout');
    } finally {
      this.clearAuthData();
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<{ success: boolean; data: User }>('/auth/me', data);
    const user = this.getUser();
    if (user) {
      this.setAuthData(this.getToken() || '', { ...user, ...response.data.data });
    }
    return response.data.data;
  }

  // Update password
  async updatePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    const response = await api.put<AuthResponse>('/auth/updatepassword', {
      currentPassword,
      newPassword,
    });
    if (response.data.success && response.data.token) {
      this.setAuthData(response.data.token, response.data.user);
    }
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get stored user
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Set auth data in localStorage
  private setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear auth data from localStorage
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export default new AuthService();
