<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white text-center">
            <h3>User Login</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  class="form-control"
                  placeholder="Enter your email"
                  required
                >
                <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  class="form-control"
                  placeholder="Enter your password"
                  required
                >
                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>

              <div class="mt-3 text-center">
                Don't have an account? <router-link to="/register" class="text-primary">Register now</router-link>
              </div>

              <div v-if="error" class="mt-3 alert alert-danger text-center">
                {{ error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

export default {
  setup() {
    const router = useRouter();
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
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!form.value.password) {
        newErrors.password = 'Password is required';
      } else if (form.value.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
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
        router.push('/dashboard');
      } else {
        error.value = authStore.error || 'Login failed. Please try again';
      }

      loading.value = false;
    };

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
