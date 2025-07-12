import { createApp } from 'vue'
import App from '@/views/App.vue' // 使用正确的路径
import router from './router'
import './assets/styles/base.css'
import './assets/styles/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
