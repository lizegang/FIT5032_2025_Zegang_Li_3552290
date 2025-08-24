import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'

// 导入视图组件
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import Events from '../views/Events.vue'
import Event from '../views/Event.vue'
import MapView from '../views/MapView.vue'
import DataTablesView from '../views/DataTablesView.vue'
import BulkEmail from '../views/BulkEmail.vue'
import FeedbackForm from '@/views/FeedbackForm.vue'
import EventsPage from '@/views/EventsPage.vue'
import AdminUsersPage from '@/views/AdminUsersPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { guestOnly: true },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/admin/bulk-email',
    name: 'BulkEmail',
    component: BulkEmail,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/events',
    name: 'Events',
    component: Events, // 保留原有Events组件
  },
  {
    path: '/events-page', // 修复重复路由，将EventsPage改为独立路径
    name: 'EventsPage',
    component: EventsPage,
  },
  {
    path: '/events/:id',
    name: 'Event',
    component: Event,
    props: true,
  },
  {
    path: '/map',
    name: 'MapView',
    component: MapView,
  },
  {
    path: '/data-tables',
    name: 'DataTablesView',
    component: DataTablesView,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsersPage,
    meta: { requiresAuth: true, adminOnly: true }, // 补充管理员权限
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: FeedbackForm,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫（保持原有逻辑）
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.adminOnly && !authStore.isAdmin) {
    next('/')
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router
