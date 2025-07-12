<template>
  <div class="login-page">
    <!-- 页面布局 -->
    <form @submit.prevent="handleLogin">
      <!-- 电子邮箱输入框 -->
      <div class="mb-4">
        <label for="email" class="form-label fs-5">电子邮箱</label>
        <input
          type="email"
          class="form-control form-control-lg py-3"
          id="email"
          v-model="formData.email"
          placeholder="请输入您的邮箱地址"
          required
        >
        <div v-if="!formData.email && submitted" class="text-danger">邮箱不能为空</div>
        <div v-if="formData.email && !isValidEmail(formData.email) && submitted" class="text-danger">请输入有效的邮箱地址</div>
      </div>
      <!-- 密码输入框 -->
      <div class="mb-4">
        <label for="password" class="form-label fs-5">密码</label>
        <input
          type="password"
          class="form-control form-control-lg py-3"
          id="password"
          v-model="formData.password"
          placeholder="请输入您的密码"
          minlength="6"
          required
        >
        <div v-if="!formData.password && submitted" class="text-danger">密码不能为空</div>
        <div v-if="formData.password && formData.password.length < 6 && submitted" class="text-danger">密码长度不能少于6位</div>
      </div>
      <!-- 登录按钮 -->
      <div class="d-grid mb-4">
        <button type="submit" class="btn btn-primary btn-lg py-3 fs-5">
          <i class="fas fa-sign-in-alt me-2"></i>登录
        </button>
      </div>
      <!-- 注册和管理员登录提示 -->
      <div class="text-center">
        <p class="mb-2">
          <router-link to="/register" class="text-decoration-none fs-5">
            没有账户？立即注册
          </router-link>
        </p>
        <p class="mb-0">
          <router-link to="/admin-login" class="text-decoration-none fs-5">
            管理员登录
          </router-link>
        </p>
      </div>
    </form>
    <!-- 登录信息展示 -->
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      submitted: false
    };
  },
  methods: {
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    handleLogin() {
      this.submitted = true;
      if (this.isValidEmail(this.formData.email) && this.formData.password.length >= 6) {
        // 登录逻辑
        console.log('登录信息:', this.formData);
        this.$router.push('/dashboard');
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e3e8f7 100%);
}

.login-card {
  border-radius: 20px;
  overflow: hidden;
  border: none;
}

.card-header {
  border-radius: 0 !important;
}

.form-control {
  border: 2px solid #e0e6ed;
  border-radius: 12px;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.2);
}

.btn {
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-item {
  max-width: 200px;
}

@media (max-width: 768px) {
  .login-info .d-flex {
    flex-direction: column;
    gap: 20px;
  }

  .info-item {
    max-width: 100%;
  }
}
</style>
