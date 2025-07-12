// src/main.js

import { createApp } from 'vue';
import App from '@/views/App.vue';
import { createPinia } from 'pinia';
import router from './router';
import './assets/styles/base.css';
import './assets/styles/main.css';

const app = createApp(App);
const pinia = createPinia();

// 先安装 Pinia
app.use(pinia);

// 再安装路由
app.use(router);

app.mount('#app');
