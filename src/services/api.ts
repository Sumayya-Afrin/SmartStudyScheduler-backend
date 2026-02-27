import axios from 'axios';

// 1. Define types to avoid "unknown" errors
export interface LoginResponse {
  token: string;
}

const API_BASE_URL = 'http://localhost:5000/api'; // Use your actual local IP

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 2. Export the typed login function
export const login = async (credentials: any) => {
  return await api.post<LoginResponse>('/login', credentials);
};

// 3. Keep your existing getTasks
export const getTasks = async (token: string) => {
  return await api.get('/tasks', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export default api;