import { create } from 'zustand';
import { User } from '../types';
import { storageService } from '../services/storage.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: async (user, token) => {
    await storageService.setObject('user', user);
    await storageService.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await storageService.removeItem('user');
    await storageService.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadAuth: async () => {
    const user = await storageService.getObject('user');
    const token = await storageService.getItem('token');
    if (user && token) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
