// src/store/authStore.js
import { defineStore } from 'pinia';

// 模拟用户数据库
const users = {
  'admin@example.com': { password: 'admin123', role: 'admin' },
  'user@example.com': { password: 'user123', role: 'user' }
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 从 localStorage 加载用户信息
    user: localStorage.getItem('user') || null,
    // 存储更多用户信息（如角色、邮箱等）
    userDetails: JSON.parse(localStorage.getItem('userDetails') || '{}'),
  }),

  getters: {
    // 判断是否已登录
    isLoggedIn: (state) => !!state.user,

    // 获取用户角色
    userRole: (state) => state.userDetails.role || 'guest',

    // 获取完整用户信息
    getFullUser: (state) => ({
      username: state.user,
      ...state.userDetails,
    }),
  },

  actions: {
    /**
     * 登录方法
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @returns {boolean} - 登录是否成功
     */
    login(username, password) {
      // 检查用户是否存在于模拟数据库中
      if (users[username] && users[username].password === password) {
        // 登录成功，更新状态并存储到 localStorage
        this.user = username;
        this.userDetails = { role: users[username].role };
        localStorage.setItem('user', username);
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        return true;
      }
      return false;
    },

    /**
     * 注册方法
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @param {Object} [additionalInfo={}] - 其他用户信息
     * @returns {boolean} - 注册是否成功
     */
    register(username, password, additionalInfo = {}) {
      // 检查用户名是否已存在
      if (users[username]) {
        console.error('用户名已存在');
        return false;
      }

      // 模拟密码加密（实际项目中应使用更安全的加密方法）
      const encryptedPassword = btoa(password);

      // 将新用户添加到模拟数据库
      users[username] = { password: encryptedPassword, ...additionalInfo };

      // 更新状态并存储到 localStorage
      this.user = username;
      this.userDetails = {
        role: 'user',
        password: encryptedPassword,
        ...additionalInfo,
      };

      localStorage.setItem('user', username);
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
      return true;
    },

    /**
     * 退出登录方法
     */
    logout() {
      // 清除状态和 localStorage
      this.user = null;
      this.userDetails = {};
      localStorage.removeItem('user');
      localStorage.removeItem('userDetails');
    },

    /**
     * 更新用户信息
     * @param {Object} newInfo - 要更新的用户信息
     */
    updateUser(newInfo) {
      // 更新用户信息并存储到 localStorage
      this.userDetails = { ...this.userDetails, ...newInfo };
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
    },
  },
});
