import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

// 用 ESM 方式获取 __dirname（避免依赖 Node.js 内置变量）
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 关键修复：移除 require，直接映射到全局引入的 jQuery
  define: {
    'window.jQuery': 'window.$',
    'window.$': 'window.$', // 不再使用 require，直接指向全局 $
  },
  optimizeDeps: {
    include: ['jquery', 'datatables.net', 'datatables.net-bs5'],
  },
})
