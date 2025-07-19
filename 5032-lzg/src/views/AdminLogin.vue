<template>
  <div class="admin-login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="admin-login-card card shadow-lg">
            <div class="card-header bg-primary text-white text-center py-4">
              <h1 class="display-5 mb-1">Health Charity Platform</h1>
              <p class="mb-0">Admin Login</p>
            </div>

            <div class="card-body p-4 p-md-5">
              <form @submit.prevent="login">
                <div class="mb-4">
                  <label for="email" class="form-label fs-5">Email Address</label>
                  <input
                    type="email"
                    class="form-control form-control-lg py-3"
                    id="email"
                    v-model="formData.email"
                    placeholder="Enter your email"
                    required
                  >
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fs-5">Password</label>
                  <input
                    type="password"
                    class="form-control form-control-lg py-3"
                    id="password"
                    v-model="formData.password"
                    placeholder="Enter your password"
                    minlength="6"
                    required
                  >
                </div>

                <div class="d-grid mb-4">
                  <button type="submit" class="btn btn-primary btn-lg py-3 fs-5">
                    <i class="fas fa-sign-in-alt me-2"></i>Login
                  </button>
                </div>

                <div class="text-center">
                  <p class="mb-0">
                    <router-link to="/login" class="text-decoration-none fs-5">
                      User Login
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

export default {
  name: 'AdminLoginPage',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    login() {
      const authStore = useAuthStore();
      if (authStore.login(this.formData.email, this.formData.password)) {
        this.$router.push('/admin');
      } else {
        alert('Incorrect email or password');
      }
    }
  }
};
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e3e8f7 100%);
}

.admin-login-card {
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
</style>
