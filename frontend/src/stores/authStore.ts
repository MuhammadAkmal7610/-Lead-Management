 import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';   

interface User {
  userId: string;
  email: string;
  role: 'admin' | 'broker' | 'marketer';
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const API_URL = 'http://localhost:3001';  

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<User>(token);
    set({ user: decoded, token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        set({ user: decoded, token });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem('token');
      }
    }
  },
}));

export default useAuthStore;