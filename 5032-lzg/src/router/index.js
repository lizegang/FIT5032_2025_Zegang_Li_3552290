import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore'; // 导入 useAuthStore

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: () => import('@/views/AdminLogin.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminPanel.vue'),
    meta: { requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫示例
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // 获取 authStore 实例
  if (to.meta.requiresAuth &&!authStore.isLoggedIn) {
    next('/login'); // 如果需要登录但未登录，重定向到登录页
  } else {
    next(); // 正常跳转
  }
});

export default router;
