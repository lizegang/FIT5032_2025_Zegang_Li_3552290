<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container my-5">
    <h2 class="text-center">欢迎回来，{{ username }}！</h2>
    <p class="text-center">这是您的个人仪表盘。</p>
  </div>
</template>

<script setup>
const username = '张三' // 后续可以用 Pinia store 替换
</script>
