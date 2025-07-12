<template>
  <div class="home-container">
    <div class="hero-banner">
      <h1 class="display-4">欢迎来到澳大利亚健康慈善服务平台</h1>
      <p class="lead">我们致力于提升老年人的健康、独立性与生活质量。</p>
      <div class="divider"></div>
    </div>


    <div class="actions">
      <!-- 未登录用户显示登录和注册按钮 -->
      <router-link to="/login" class="btn btn-primary btn-lg" v-if="!isAuthenticated">
        <i class="fas fa-user-circle mr-2"></i>用户登录
      </router-link>

      <router-link to="/register" class="btn btn-secondary btn-lg" v-if="!isAuthenticated">
        <i class="fas fa-user-plus mr-2"></i>用户注册
      </router-link>

      <!-- 无论是否登录，只要不是管理员都显示管理员登录按钮 -->
      <router-link to="/admin-login" class="btn btn-dark btn-lg" v-if="!isAdmin">
        <i class="fas fa-lock mr-2"></i>管理员登录
      </router-link>

      <!-- 已登录的普通用户显示仪表盘按钮 -->
      <router-link to="/dashboard" class="btn btn-success btn-lg" v-if="isAuthenticated && !isAdmin">
        <i class="fas fa-tachometer-alt mr-2"></i>前往仪表盘
      </router-link>

      <!-- 管理员用户显示管理面板按钮 -->
      <router-link to="/admin" class="btn btn-warning btn-lg" v-if="isAdmin">
        <i class="fas fa-cog mr-2"></i>前往管理面板
      </router-link>
    </div>

    <!-- 平台特点介绍 -->
    <div class="features mt-5">
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="feature-icon bg-primary text-white rounded-circle p-3 mb-3">
                <i class="fas fa-heartbeat fa-2x"></i>
              </div>
              <h3 class="card-title">健康资源</h3>
              <p class="card-text">提供专业的健康咨询和资源，帮助老年人维持健康生活方式。</p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="feature-icon bg-secondary text-white rounded-circle p-3 mb-3">
                <i class="fas fa-users fa-2x"></i>
              </div>
              <h3 class="card-title">社区支持</h3>
              <p class="card-text">建立互助社区，连接老年人与志愿者，减少孤独感。</p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="feature-icon bg-success text-white rounded-circle p-3 mb-3">
                <i class="fas fa-hands-helping fa-2x"></i>
              </div>
              <h3 class="card-title">慈善服务</h3>
              <p class="card-text">提供免费或低成本的健康服务，确保每个人都能获得适当照顾。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/authStore';

export default {
  name: 'HomePage',
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isLoggedIn;
    },
    isAdmin() {
      const authStore = useAuthStore();
      return authStore.userRole === 'admin';
    },
    authStore() {
      return useAuthStore();
    }
  },
  created() {
    // 页面加载时可以添加一些初始化逻辑
    console.log('Home page initialized');
  }
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.hero-banner {
  margin-bottom: 40px;
}

.display-4 {
  font-weight: 300;
  margin-bottom: 20px;
}

.lead {
  font-size: 1.25rem;
  margin-bottom: 30px;
}

.divider {
  width: 100px;
  height: 3px;
  background-color: #007bff;
  margin: 0 auto 40px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 60px;
}

.btn {
  min-width: 200px;
  padding: 12px 20px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.debug-info {
  text-align: left;
  border: 1px solid #ddd;
}

.features .card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.features .card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.feature-icon {
  display: inline-block;
}
</style>
