// services/api.ts
import axios from 'axios';
import { getToken } from '../utils/storage';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

// ── Axios instance ────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ── Auth interceptor ──────────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const login = async (credentials: LoginCredentials) => {
  return await api.post<AuthResponse>('/auth/login', credentials);
};

export const register = async (credentials: RegisterCredentials) => {
  return await api.post<AuthResponse>('/auth/register', credentials);
};

export const forgotPassword = async (email: string) => {
  return await api.post('/auth/forgot-password', { email });
};

export const updatePassword = async (password: string) => {
  return await api.post('/auth/update-password', { password });
};

// ── Other endpoints ───────────────────────────────────────────────────────────
export const getTasks = async () => {
  // No need to pass token manually — interceptor handles it
  return await api.get('/tasks');
};

export default api;