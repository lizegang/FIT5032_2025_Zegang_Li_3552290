import { ref, computed } from 'vue'

// 创建一个响应式的用户状态
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const role = ref(localStorage.getItem('role') || 'user')

// 计算属性：用户是否已认证
export const isAuthenticated = computed(() => !!user.value)

// 计算属性：用户是否是管理员
export const isAdmin = computed(() => role.value === 'admin') // 确保正确导出

// 登录功能
export const login = (email, password) => {
  // 模拟登录逻辑
  if (email === 'admin@example.com' && password === 'admin123') {
    user.value = { email, name: 'Admin' }
    role.value = 'admin'
    // 保存到本地存储
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('role', role.value)
    return true
  } else if (email && password.length >= 6) {
    user.value = {
      email,
      name: email.split('@')[0] // 从邮箱生成用户名
    }
    role.value = 'user'
    // 保存到本地存储
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('role', role.value)
    return true
  }
  return false
}

// 注册功能
export const register = (email, password, name) => {
  if (!email || !password || !name) return false

  user.value = { email, name }
  role.value = 'user'

  // 保存到本地存储
  localStorage.setItem('user', JSON.stringify(user.value))
  localStorage.setItem('role', role.value)

  return true
}

// 登出功能
export const logout = () => {
  user.value = null
  role.value = 'user'

  // 清除本地存储
  localStorage.removeItem('user')
  localStorage.removeItem('role')
}

// 导出响应式状态
export { user, role }
