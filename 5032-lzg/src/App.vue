<template>
  <div id="app">
    <Navbar />

    <main class="py-5">
      <router-view />
    </main>

    <PageFooter />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import PageFooter from '@/components/PageFooter.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    PageFooter
  }
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
}

.avatar-container {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.rating {
  display: inline-flex;
  font-size: 1.5rem;
}

.rating-star {
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}

.rating-star:hover {
  transform: scale(1.1);
}

.text-warning {
  color: #ffc107 !important;
}
</style>
