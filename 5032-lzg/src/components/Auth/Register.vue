<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="text-center mb-4">用户注册</h2>

      <form @submit.prevent="submitForm">
        <!-- Username & Email -->
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label for="username" class="form-label">用户名</label>
            <input type="text" class="form-control" id="username" v-model="formData.username" placeholder="请输入用户名" />
          </div>
          <div class="col-md-6">
            <label for="email" class="form-label">邮箱</label>
            <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="请输入邮箱" />
          </div>
        </div>

        <!-- Password & Confirm -->
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label for="password" class="form-label">密码</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="formData.password"
              placeholder="请输入密码"
            />
          </div>
          <div class="col-md-6">
            <label for="confirmPassword" class="form-label">确认密码</label>
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              placeholder="请再次输入密码"
            />
          </div>
        </div>

        <!-- Gender & Terms -->
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label for="gender" class="form-label">性别</label>
            <select class="form-select" id="gender" v-model="formData.gender">
              <option value="" disabled selected>请选择性别</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="col-md-6 d-flex align-items-center">
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="terms"
                v-model="formData.agreeTerms"
              />
              <label class="form-check-label" for="terms">我同意服务条款</label>
            </div>
          </div>
        </div>

        <!-- Submit and Clear -->
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-success btn-lg">注册</button>
          <button type="button" class="btn btn-secondary" @click="clearForm">清空</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  agreeTerms: false,
})

const submitForm = () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('两次输入的密码不一致！')
    return
  }

  if (!formData.value.agreeTerms) {
    alert('请勾选同意服务条款')
    return
  }

  console.log('注册数据:', formData.value)
  router.push('/login') // 注册完成后跳转到登录页
}

const clearForm = () => {
  formData.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    agreeTerms: false,
  }
}
</script>

<style scoped>
.register-container {
  background: linear-gradient(to bottom right, #fbc2eb, #a1c4fd);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 800px;
  transition: all 0.3s ease-in-out;
}

.register-card:hover {
  transform: translateY(-5px);
}

.btn-success {
  background-color: #4cd264;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-success:hover {
  background-color: #3fa857;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(76, 210, 100, 0.25);
  border-color: #4cd264;
}

/* 新增样式：放大字体、增加输入框高度 */
.form-control {
  font-size: 1.2rem;
  padding: 15px;
}

.form-select {
  font-size: 1.2rem;
  padding: 15px;
}

.form-label {
  font-size: 1.1rem;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 30px;
}
</style>
