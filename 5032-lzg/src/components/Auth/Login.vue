<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container mt-5">
    <h2 class="text-center">Login</h2>
    <form @submit.prevent="handleLogin" class="col-md-6 offset-md-3">
      <div class="mb-3">
        <label>Email</label>
        <input v-model="email" type="email" required class="form-control" />
      </div>
      <div class="mb-3">
        <label>Password</label>
        <input v-model="password" type="password" required class="form-control" />
      </div>
      <button class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import { ref } from 'vue';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const auth = useAuthStore();

    const handleLogin = () => {
      if (auth.login(email.value, password.value)) {
        router.push(auth.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        alert('Invalid credentials');
      }
    };

    return { email, password, handleLogin };
  }
};
</script>
