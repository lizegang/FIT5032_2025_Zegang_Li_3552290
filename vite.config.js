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
      '@': path.resolve(__dirname, 'src'), // 确保别名指向 src 目录
    },
  },
  define: {
    'process.env': {}, // 显式定义 process.env，避免未定义错误
  },
  optimizeDeps: {
    include: ['jquery', 'datatables.net', 'datatables.net-bs5'],
  },
})
