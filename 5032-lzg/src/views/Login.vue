<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card login-card shadow-lg">
            <div class="card-header bg-primary text-white text-center py-4">
              <h2 class="mb-0">User Login</h2>
            </div>
            <div class="card-body p-5">
              <form @submit.prevent="handleLogin">
                <div class="mb-4">
                  <label for="email" class="form-label">Email address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="formData.email"
                    required
                    aria-required="true"
                    aria-describedby="emailHelp"
                  />
                  <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-4">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="formData.password"
                    required
                    aria-required="true"
                  />
                </div>
                
                <div v-if="authStore.error" class="alert alert-danger mb-4">
                  {{ authStore.error }}
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg w-100 py-3 mb-3"
                  :disabled="authStore.loading"
                >
                  <i class="fas fa-sign-in-alt me-2"></i>
                  {{ authStore.loading ? 'Logging in...' : 'Login' }}
                </button>
                
                <button 
                  type="button" 
                  class="btn btn-danger btn-lg w-100 py-3 mb-3"
                  @click="loginWithGoogle"
                  :disabled="authStore.loading"
                >
                  <i class="fab fa-google me-2"></i>
                  Login with Google
                </button>
                
                <div class="text-center">
                  <p class="mb-0">
                    Don't have an account? 
                    <router-link to="/register" class="text-decoration-none">
                      Register here
                    </router-link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../store/authStore';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const formData = reactive({
      email: '',
      password: ''
    });

    onMounted(() => {
      // 如果已登录，重定向到首页
      if (authStore.isAuthenticated) {
        router.push('/');
      }
    });

    const handleLogin = async () => {
      const success = await authStore.login(formData.email, formData.password);
      if (success) {
        router.push('/');
      }
    };

    const loginWithGoogle = async () => {
      const success = await authStore.loginWithGoogle();
      if (success) {
        router.push('/');
      }
    };

    return {
      formData,
      authStore,
      handleLogin,
      loginWithGoogle
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

.form-control {
  border: 2px solid #e0e6ed;
  border-radius: 12px;
  transition: all 0.3s;
  padding: 12px 15px;
  font-size: 16px;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.15);
  outline: none;
}
</style>