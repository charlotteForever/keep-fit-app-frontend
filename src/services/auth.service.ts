import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  nickname?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goalType?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};
