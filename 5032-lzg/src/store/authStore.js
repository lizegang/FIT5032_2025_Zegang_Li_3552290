import { defineStore } from 'pinia';


// 模拟用户数据库（实际项目应使用后端API）
const users = {
  'admin@example.com': { password: 'admin123', role: 'admin', name: '管理员' },
  'user@example.com': { password: 'user123', role: 'user', name: '普通用户' }
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || '未登录'
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!users[email] || users[email].password !== password) {
          throw new Error('用户名或密码错误');
        }

        const user = { email, role: users[email].role, name: users[email].name };
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));

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
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800));

        if (users[email]) {
          throw new Error('邮箱已被注册');
        }

        // 添加新用户到模拟数据库
        users[email] = { password, role: 'user', name };

        const user = { email, role: 'user', name };
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));

        return true;
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
