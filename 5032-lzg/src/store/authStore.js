import { defineStore } from 'pinia'

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
    // 获取用户角色（示例）
    userRole: (state) => state.userDetails.role || 'guest',
    // 获取完整用户信息
    getFullUser: (state) => ({
      username: state.user,
      ...state.userDetails,
    }),
  },
  actions: {
    /**
     * 登录方法（带密码验证）
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {boolean} 登录是否成功
     */
    login(username, password) {
      // 示例：模拟密码验证逻辑（实际应调用后端 API）
      if (password === 'correctPassword') {
        this.user = username
        this.userDetails = { role: 'user' } // 示例存储角色
        localStorage.setItem('user', username)
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails))
        return true
      }
      return false
    },

    /**
     * 注册方法
     * @param {string} username 用户名
     * @param {string} password 密码
     * @param {Object} [additionalInfo={}] 其他用户信息（如邮箱、角色）
     * @returns {boolean} 注册是否成功
     */
    register(username, password, additionalInfo = {}) {
      // 示例：检查用户名是否已存在
      if (this.user === username) {
        console.error('用户名已存在')
        return false
      }

      // 模拟密码加密（实际应使用加密算法）
      const encryptedPassword = btoa(password)

      // 存储用户信息
      this.user = username
      this.userDetails = {
        role: 'user',
        password: encryptedPassword,
        ...additionalInfo,
      }

      localStorage.setItem('user', username)
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails))
      return true
    },

    /**
     * 退出登录
     */
    logout() {
      this.user = null
      this.userDetails = {}
      localStorage.removeItem('user')
      localStorage.removeItem('userDetails')
      // 清除所有本地存储（根据需求选择）
      // localStorage.clear()
    },

    /**
     * 更新用户信息
     * @param {Object} newInfo 新信息（如邮箱、角色）
     */
    updateUser(newInfo) {
      this.userDetails = { ...this.userDetails, ...newInfo }
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails))
    },
  },
})
