<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="register-card card shadow-lg">
            <div class="card-header bg-success text-white text-center py-4">
              <h1 class="display-5 mb-1">健康慈善平台</h1>
              <p class="mb-0">用户注册</p>
            </div>

            <div class="card-body p-4 p-md-5">
              <form @submit.prevent="handleRegister">
                <div class="mb-4">
                  <label for="name" class="form-label fs-5">姓名</label>
                  <input
                    type="text"
                    class="form-control form-control-lg py-3"
                    id="name"
                    v-model="formData.name"
                    placeholder="请输入您的姓名"
                    required
                  >
                </div>

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
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fs-5">密码</label>
                  <input
                    type="password"
                    class="form-control form-control-lg py-3"
                    id="password"
                    v-model="formData.password"
                    placeholder="请设置密码（至少6位）"
                    minlength="6"
                    required
                  >
                </div>

                <div class="mb-4">
                  <label for="confirmPassword" class="form-label fs-5">确认密码</label>
                  <input
                    type="password"
                    class="form-control form-control-lg py-3"
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    placeholder="请再次输入密码"
                    minlength="6"
                    required
                  >
                </div>

                <div class="mb-4 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="terms"
                    v-model="formData.agreeTerms"
                    required
                  >
                  <label class="form-check-label" for="terms">
                    我同意<a href="#" class="text-decoration-none">服务条款</a>和<a href="#" class="text-decoration-none">隐私政策</a>
                  </label>
                </div>

                <div class="d-grid mb-4">
                  <button type="submit" class="btn btn-success btn-lg py-3 fs-5">
                    <i class="fas fa-user-plus me-2"></i>注册账户
                  </button>
                </div>

                <div class="text-center">
                  <p class="mb-0">
                    <router-link to="/login" class="text-decoration-none fs-5">
                      已有账户？立即登录
                    </router-link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div class="register-benefits mt-5">
            <h2 class="text-center mb-4">注册成为会员，享受更多权益</h2>
            <div class="row">
              <div class="col-md-4 mb-4">
                <div class="benefit-item text-center p-4 rounded-3 bg-light">
                  <i class="fas fa-calendar-check fa-3x text-success mb-3"></i>
                  <h3>活动预约</h3>
                  <p>优先预约健康讲座和社区活动</p>
                </div>
              </div>
              <div class="col-md-4 mb-4">
                <div class="benefit-item text-center p-4 rounded-3 bg-light">
                  <i class="fas fa-file-medical fa-3x text-success mb-3"></i>
                  <h3>健康资源</h3>
                  <p>获取专属健康指南和资源</p>
                </div>
              </div>
              <div class="col-md-4 mb-4">
                <div class="benefit-item text-center p-4 rounded-3 bg-light">
                  <i class="fas fa-tags fa-3x text-success mb-3"></i>
                  <h3>专属优惠</h3>
                  <p>享受健康产品和服务折扣</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '../services/auth';

export default {
  name: 'RegisterPage',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      }
    };
  },
  methods: {
    async handleRegister() {
      const { name, email, password, confirmPassword } = this.formData;
      if (password !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
      }
      const isRegistered = await register(email, password, name);
      if (isRegistered) {
        alert('注册成功，请登录');
        this.$router.push('/login');
      } else {
        alert('该邮箱已被注册，请使用其他邮箱');
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px 0;
  background: linear-gradient(135deg, #f0f9f0 0%, #e3f2e3 100%);
}

.register-card {
  border-radius: 20px;
  overflow: hidden;
  border: none;
}

.benefit-item {
  transition: all 0.3s;
  height: 100%;
}

.benefit-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.form-check-input {
  width: 1.5em;
  height: 1.5em;
  margin-top: 0.2em;
}

@media (max-width: 768px) {
  .benefit-item {
    margin-bottom: 20px;
  }
}
</style>
