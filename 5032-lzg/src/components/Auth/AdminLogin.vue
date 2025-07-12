<template>
  <div class="auth-form">
    <h2>Admin Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Admin Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login as Admin</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleLogin = () => {
  if (email.value !== 'admin@example.com') {
    alert('Invalid admin credentials')
    return
  }
  auth.login({ email: email.value, role: 'admin' })
  router.push('/admin')
}
</script>
