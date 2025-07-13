<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white text-center">
            <h3>用户登录</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">电子邮箱</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  class="form-control"
                  placeholder="请输入您的邮箱"
                  required
                  name="email"
                >
                <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">密码</label>
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  class="form-control"
                  placeholder="请输入您的密码"
                  required
                  name="password"
                >
                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                {{ loading ? '登录中...' : '登录' }}
              </button>

              <!-- 其余代码保持不变 -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';

export default {
  setup() {
    const authStore = useAuthStore();
    const form = ref({
      email: '',
      password: ''
    });
    const errors = ref({});
    const error = ref('');
    const loading = ref(false);

    const validateForm = () => {
      const newErrors = {};

      if (!form.value.email) {
        newErrors.email = '邮箱不能为空';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        newErrors.email = '请输入有效的邮箱地址';
      }

      if (!form.value.password) {
        newErrors.password = '密码不能为空';
      } else if (form.value.password.length < 6) {
        newErrors.password = '密码长度至少为6位';
      }

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
      if (!validateForm()) return;

      loading.value = true;
      error.value = '';

      const success = await authStore.login(form.value.email, form.value.password);

      if (success) {
        // 登录成功，重定向到仪表盘
        window.location.href = '/dashboard';
      } else {
        error.value = authStore.error || '登录失败，请重试';
      }

      loading.value = false;
    };

    onMounted(() => {
      // 清除之前的错误
      authStore.error = null;
    });

    return {
      form,
      errors,
      error,
      loading,
      handleLogin
    };
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
