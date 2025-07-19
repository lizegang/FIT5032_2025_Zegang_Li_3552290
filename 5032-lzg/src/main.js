import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import Rating from '@/components/Rating.vue';


import * as userService from './services/userService';


if (!userService.readUsers()['admin@example.com']) {
  const users = userService.readUsers();
  users['admin@example.com'] = {
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    createdAt: new Date().toISOString()
  };
  userService.writeUsers(users);
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
// eslint-disable-next-line vue/multi-word-component-names
app.component('Rating', Rating);
app.mount('#app');
