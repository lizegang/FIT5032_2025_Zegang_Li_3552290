import { defineStore } from 'pinia';
import { loginUser, registerUser } from '@/services/userService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || 'Guest'
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const result = loginUser(email, password);

        if (!result.success) {
          throw new Error(result.message);
        }

        this.user = result.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(email, password, name) {
      this.loading = true;
      this.error = null;

      try {
        const result = registerUser(email, password, name);

        if (!result.success) {
          throw new Error(result.message);
        }

        return await this.login(email, password);
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem('user');
    }
  }
});
