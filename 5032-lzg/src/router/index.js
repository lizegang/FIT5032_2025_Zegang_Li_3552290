import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/event/:id',
    name: 'Event',
    component: () => import('@/views/Event.vue')
  },
  {
  path: '/events',
  name: 'Events',
  component: () => import('@/views/Events.vue')
}


];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 检查是否需要登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }

  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard');
    return;
  }

  // 检查是否需要游客身份（未登录）
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
