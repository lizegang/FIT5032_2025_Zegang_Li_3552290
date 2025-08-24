import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/views/EventPage.vue'), // 确保路径正确
  },
  {
    path: '/health-facilities',
    name: 'HealthFacilities',
    component: () => import('@/components/HealthFacilityMap.vue'),
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('@/views/FeedbackForm.vue'),
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

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (user) {
      const idTokenResult = await user.getIdTokenResult()
      if (idTokenResult.claims.role === 'admin') {
        next()
      } else {
        next('/') // 如果不是管理员，跳转到主页
      }
    } else {
      next('/login') // 如果未登录，跳转到登录页面
    }
  } else {
    next()
  }
})

export default router
