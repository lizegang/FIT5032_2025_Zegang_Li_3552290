// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// 确保路径正确
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // 如果需要 Bootstrap 的 JS 功能

// 1. 全局引入 jQuery（DataTables 依赖）
import $ from 'jquery'
window.$ = $
window.jQuery = $

// 2. 全局引入 DataTables 核心样式和 Bootstrap 适配样式
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

// 3. 全局引入 DataTables 核心脚本和 Bootstrap 适配脚本
import 'datatables.net/js/dataTables.min.js'
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js'

// 其他原有逻辑（认证监听、全局组件等）
import Rating from '@/components/Rating.vue'
import { useAuthStore } from './store/authStore'

import { auth } from './firebase/config'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router)

// 初始化认证监听
const authStore = useAuthStore()
authStore.initAuthListener()

// 注册全局组件
// eslint-disable-next-line vue/multi-word-component-names
app.component('Rating', Rating)

onAuthStateChanged(auth, (user) => {
  if (user) {
    // 用户已登录，检查角色
    user.getIdTokenResult().then((idTokenResult) => {
      const isAdmin = idTokenResult.claims.role === 'admin'
      if (isAdmin) {
        console.log('管理员登录')
      } else {
        console.log('普通用户登录')
      }
    })
  } else {
    console.log('用户未登录')
  }
})

// 挂载应用
app.mount('#app')
