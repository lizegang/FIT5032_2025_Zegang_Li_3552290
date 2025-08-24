// src/env.d.ts
declare global {
  interface Window {
    qq: any // 临时使用 any，也可引入更精确的类型
  }
}

// 确保文件被视为模块
export {}
