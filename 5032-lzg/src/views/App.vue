<template>
  <div id="app">
    <!-- 根据路由判断是否显示导航 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" v-if="!isHomePage">
      <div class="container">
        <router-link to="/" class="navbar-brand">健康慈善平台</router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">首页</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link">仪表盘</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin" class="nav-link">管理员</router-link>
            </li>
          </ul>

          <div class="d-flex">
            <router-link to="/login" class="btn btn-outline-light me-2">登录</router-link>
            <router-link to="/register" class="btn btn-light">注册</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <router-view></router-view>
    </div>

    <!-- 根据路由判断是否显示页脚 -->
    <footer class="bg-dark text-white py-5" v-if="!isHomePage">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4 mb-md-0">
            <h5 class="mb-3">健康慈善平台</h5>
            <p>致力于提高澳大利亚老年人的健康、独立性和生活质量。</p>
            <p>为老年人提供专业的健康资源和社区支持。</p>
          </div>

          <div class="col-md-4 mb-4 mb-md-0">
            <h5 class="mb-3">快速链接</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><router-link to="/" class="text-white text-decoration-none">首页</router-link></li>
              <li class="mb-2"><router-link to="/login" class="text-white text-decoration-none">用户登录</router-link></li>
              <li class="mb-2"><router-link to="/register" class="text-white text-decoration-none">用户注册</router-link></li>
              <li class="mb-2"><router-link to="/admin-login" class="text-white text-decoration-none">管理员登录</router-link></li>
            </ul>
          </div>

          <div class="col-md-4">
            <h5 class="mb-3">联系我们</h5>
            <p><i class="fas fa-map-marker-alt me-2"></i> 澳大利亚墨尔本健康中心</p>
            <p><i class="fas fa-phone me-2"></i> +61 123 456 789</p>
            <p><i class="fas fa-envelope me-2"></i> info@healthcharity.org.au</p>
          </div>
        </div>

        <div class="text-center mt-4 pt-4 border-top border-secondary">
          <p>&copy; 2023 澳大利亚健康慈善机构 - 关爱老年健康</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const isHomePage = () => route.path === '/';
    return {
      isHomePage
    };
  }
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.navbar {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-link {
  font-size: 1.1rem;
  transition: all 0.3s;
}

.nav-link:hover, .nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
}

footer a {
  transition: all 0.3s;
}

footer a:hover {
  color: #3498db !important;
  text-decoration: underline;
}
</style>
