<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="home-container">
    <h1>欢迎来到澳大利亚健康慈善服务平台</h1>
    <p>我们致力于提升老年人的健康、独立性与生活质量。</p>

    <div class="actions">
      <router-link to="/login" class="btn">用户登录</router-link>
      <router-link to="/register" class="btn">用户注册</router-link>
      <router-link to="/admin-login" class="btn admin">管理员登录</router-link>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}

.btn:hover {
  background-color: #369f75;
}

.btn.admin {
  background-color: #35495e;
}

.btn.admin:hover {
  background-color: #2c3e50;
}
</style>
