<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg">
          <div class="card-header bg-success text-white text-center">
            <h3>User Registration</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  class="form-control"
                  placeholder="Enter your name"
                  required
                >
                <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
              </div>

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
                  placeholder="Enter password (at least 6 characters)"
                  required
                >
                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  class="form-control"
                  placeholder="Confirm your password"
                  required
                >
                <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
              </div>

              <button
                type="submit"
                class="btn btn-success w-100"
                :disabled="loading"
              >
                {{ loading ? 'Registering...' : 'Register' }}
              </button>

              <div class="mt-3 text-center">
                Already have an account? <router-link to="/login" class="text-success">Login now</router-link>
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
import { useAuthStore } from '@/store/authStore';

export default {
  setup() {
    const authStore = useAuthStore();
    const form = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    const errors = ref({});
    const error = ref('');
    const loading = ref(false);

    const validateForm = () => {
      const newErrors = {};

      if (!form.value.name) {
        newErrors.name = 'Name is required';
      }

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

      if (!form.value.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (form.value.confirmPassword !== form.value.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
      if (!validateForm()) return;

      loading.value = true;
      error.value = '';

      const success = await authStore.register(
        form.value.email,
        form.value.password,
        form.value.name
      );

      if (success) {
        alert('Registration successful! Welcome to our Health Charity Platform');
        window.location.href = '/dashboard';
      } else {
        error.value = authStore.error || 'Registration failed. Please try again';
      }

      loading.value = false;
    };

    return {
      form,
      errors,
      error,
      loading,
      handleRegister
    };
  }
};
</script>
