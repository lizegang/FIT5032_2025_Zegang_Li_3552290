<template>
  <div id="app">
    <!-- 可访问性控制 -->
    <AccessibilityControls />

    <!-- 导航栏 -->
    <Navbar />

    <!-- 主内容 -->
    <main class="container py-4">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="bg-light py-4 mt-5">
      <div class="container text-center">
        <p class="mb-0">&copy; 2023 Health Charity Platform</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import AccessibilityControls from './components/common/AccessibilityControls.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './store/authStore'

export default {
  name: 'App',
  components: {
    Navbar,
    AccessibilityControls,
  },
  setup() {
    const authStore = useAuthStore()

    onMounted(async () => {
      // 初始化认证状态
      await authStore.init()
    })
  },
}
</script>

<style>
/* 基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 高对比度模式 */
.high-contrast {
  --primary-color: #0033cc;
  --primary-text: #ffffff;
  --secondary-text: #000000;
  --background-color: #ffffff;
  --secondary-background: #f0f0f0;
}

.high-contrast body {
  background-color: var(--background-color) !important;
  color: var(--secondary-text) !important;
}

.high-contrast .btn-primary {
  background-color: var(--primary-color) !important;
  color: var(--primary-text) !important;
  border-color: var(--primary-color) !important;
}

.high-contrast .card {
  background-color: var(--secondary-background) !important;
  border: 2px solid var(--secondary-text) !important;
}

.high-contrast a {
  color: var(--primary-color) !important;
  text-decoration: underline !important;
}

/* 焦点样式 - 提高键盘导航可见性 */
:focus {
  outline: 3px solid #0d6efd !important;
  outline-offset: 2px !important;
}

/* 跳过导航链接 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0d6efd;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
</style>
