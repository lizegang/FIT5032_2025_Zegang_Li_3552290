// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import AdminPanel from '../views/AdminPanel.vue';
import Login from '../components/Auth/Login.vue';
import Register from '../components/Auth/Register.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, adminOnly: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ 延迟加载 authStore（避免 Pinia 未激活）
router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('../store/authStore');
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login');
  } else if (to.meta.adminOnly && auth.user?.role !== 'admin') {
    next('/');
  } else {
    next();
  }
});

export default router;
