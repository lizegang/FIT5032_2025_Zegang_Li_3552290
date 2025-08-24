<!-- src/views/AdminUsersPage.vue -->
<template>
  <div class="container py-5">
    <h3 class="mb-4">User Management (Admin)</h3>
    <!-- 引入用户管理表格组件 -->
    <UsersTable />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
// 导入用户表格组件
import UsersTable from '@/components/tables/UsersTable.vue'

export default {
  components: {
    UsersTable, // 注册组件
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    // 验证管理员权限（非管理员跳转到首页）
    onMounted(() => {
      if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
        router.push('/')
        alert('Access denied: Only admins can view this page')
      }
    })
  },
}
</script>
