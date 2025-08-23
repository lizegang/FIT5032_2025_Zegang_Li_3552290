<template>
  <div class="accessibility-controls">
    <button
      class="btn btn-outline-secondary"
      @click="toggleHighContrast"
      aria-pressed="highContrast"
      aria-label="Toggle high contrast mode"
    >
      <i class="fas fa-adjust me-1"></i>
      {{ highContrast ? 'Normal Contrast' : 'High Contrast' }}
    </button>

    <button
      class="btn btn-outline-secondary ms-2"
      @click="increaseFontSize"
      :disabled="fontSize >= 1.5"
      aria-label="Increase font size"
    >
      <i class="fas fa-text-height me-1"></i>
      Larger Text
    </button>

    <button
      class="btn btn-outline-secondary ms-2"
      @click="decreaseFontSize"
      :disabled="fontSize <= 0.8"
      aria-label="Decrease font size"
    >
      <i class="fas fa-text-height fa-flip-vertical me-1"></i>
      Smaller Text
    </button>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'AccessibilityControls',
  setup() {
    const highContrast = ref(false)
    const fontSize = ref(1) // 基础字体大小倍数

    // 应用高对比度模式
    watch(highContrast, (value) => {
      if (value) {
        document.documentElement.classList.add('high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
      }

      // 存储到localStorage
      localStorage.setItem('highContrast', value)
    })

    // 应用字体大小
    watch(fontSize, (value) => {
      document.documentElement.style.fontSize = `${value * 100}%`

      // 存储到localStorage
      localStorage.setItem('fontSize', value)
    })

    // 从localStorage加载设置
    const loadSettings = () => {
      const savedContrast = localStorage.getItem('highContrast')
      if (savedContrast !== null) {
        highContrast.value = savedContrast === 'true'
      }

      const savedFontSize = localStorage.getItem('fontSize')
      if (savedFontSize !== null) {
        fontSize.value = parseFloat(savedFontSize)
      }
    }

    // 增加字体大小
    const increaseFontSize = () => {
      fontSize.value += 0.1
    }

    // 减小字体大小
    const decreaseFontSize = () => {
      fontSize.value -= 0.1
    }

    // 切换高对比度
    const toggleHighContrast = () => {
      highContrast.value = !highContrast.value
    }

    // 初始化
    loadSettings()

    return {
      highContrast,
      fontSize,
      toggleHighContrast,
      increaseFontSize,
      decreaseFontSize,
    }
  },
}
</script>

<style scoped>
.accessibility-controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  flex-wrap: wrap;
}
</style>
