<template>
  <div class="container py-5">
    <h3 class="mb-4">Upcoming Health Charity Events</h3>
    <!-- 引入活动列表表格 -->
    <EventsTable />
  </div>
  <div class="container mt-5">
    <h1 class="mb-4">Admin Dashboard</h1>
    <p class="lead mb-5">Overview of system statistics and management tools.</p>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mb-4">
      {{ error }}
    </div>

    <div v-if="!loading && !error">
      <!-- 统计卡片 -->
      <div class="row mb-5">
        <div class="col-md-3 mb-3">
          <div class="card text-center h-100">
            <div class="card-body">
              <h5 class="card-title">Total Users</h5>
              <p class="card-text display-4">{{ userStats.total }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center h-100">
            <div class="card-body">
              <h5 class="card-title">Admins</h5>
              <p class="card-text display-4">{{ userStats.admins }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center h-100">
            <div class="card-body">
              <h5 class="card-title">Total Events</h5>
              <p class="card-text display-4">{{ eventStats.total }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center h-100">
            <div class="card-body">
              <h5 class="card-title">Upcoming Events</h5>
              <p class="card-text display-4">{{ eventStats.upcoming }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表行 -->
      <div class="row mb-5">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <UserStatsChart />
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <EventStatsChart />
            </div>
          </div>
        </div>
      </div>

      <!-- 最近用户表格 -->
      <div class="card mb-5">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2>Recent Users</h2>
          <ExportButton
            :data="userStats.recentUsers"
            filename="recent_users"
            :headers="['name', 'email', 'role', 'createdAt']"
          />
        </div>
        <div class="card-body">
          <DataTable :data="userStats.recentUsers" :columns="userColumns" />
        </div>
      </div>

      <!-- 管理工具 -->
      <div class="card">
        <div class="card-header">
          <h2>Administration Tools</h2>
        </div>
        <div class="card-body">
          <div class="list-group">
            <router-link to="/admin/bulk-email" class="list-group-item list-group-item-action">
              <i class="fas fa-envelope me-2"></i> Send Bulk Email to Users
            </router-link>
            <router-link to="/admin/events" class="list-group-item list-group-item-action">
              <i class="fas fa-calendar-alt me-2"></i> Manage Events
            </router-link>
            <router-link to="/admin/users" class="list-group-item list-group-item-action">
              <i class="fas fa-users me-2"></i> Manage Users
            </router-link>
            <router-link to="/data-tables" class="list-group-item list-group-item-action">
              <i class="fas fa-table me-2"></i> View Data Tables
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { onMounted, computed } from 'vue'
import { useAdminStore } from '../store/adminStore'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'vue-router'
import UserStatsChart from '../components/dashboard/UserStatsChart.vue'
import EventStatsChart from '../components/dashboard/EventStatsChart.vue'
import DataTable from '../components/common/DataTable.vue'
import ExportButton from '../components/common/ExportButton.vue'
import EventsTable from '@/components/tables/EventsTable.vue'
export default {
  name: 'AdminDashboard',
  components: {
    UserStatsChart,
    EventStatsChart,
    DataTable,
    ExportButton,
    EventsTable,
  },
  setup() {
    const adminStore = useAdminStore()
    const authStore = useAuthStore()
    const router = useRouter()

    // 用户表格列定义
    const userColumns = [
      { label: 'Name', field: 'name' },
      { label: 'Email', field: 'email' },
      { label: 'Role', field: 'role' },
      {
        label: 'Registration Date',
        field: 'createdAt',
        render: (row) => {
          return row.createdAt
            ? new Date(row.createdAt?.toDate?.() || row.createdAt).toLocaleDateString()
            : 'N/A'
        },
      },
    ]

    onMounted(async () => {
      // 检查用户是否已登录且是管理员
      if (!authStore.isAuthenticated) {
        router.push('/login')
      } else if (!authStore.isAdmin) {
        router.push('/')
      } else {
        await adminStore.fetchAllStats()
      }
    })

    return {
      userStats: adminStore.userStats,
      eventStats: adminStore.eventStats,
      loading: adminStore.loading,
      error: adminStore.error,
      userColumns,
    }
  },
}
</script>
