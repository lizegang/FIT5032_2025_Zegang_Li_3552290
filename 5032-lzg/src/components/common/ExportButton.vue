<!-- src/components/ExportButton.vue -->
<template>
  <button class="btn btn-outline-secondary" @click="handleExport" :disabled="loading">
    <i class="fas fa-download me-2"></i>
    {{ loading ? 'Exporting...' : `Export ${fileName}` }}
  </button>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ExportButton',
  props: {
    // 需要导出的数据（数组格式，每个元素为一行数据对象）
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    // 导出文件名称（不带后缀）
    fileName: {
      type: String,
      default: 'export-data',
    },
    // 自定义CSV表头映射（键为数据字段名，值为表头显示文本）
    headerMap: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const loading = ref(false)

    // 处理CSV导出逻辑
    const handleExport = () => {
      if (props.data.length === 0) {
        alert('No data to export')
        return
      }

      loading.value = true

      // 生成CSV内容
      const csvContent = convertToCSV(props.data, props.headerMap)
      // 创建下载链接
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `${props.fileName}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      loading.value = false
    }

    // 转换数据为CSV格式
    const convertToCSV = (data, headerMap) => {
      // 获取表头（优先使用headerMap的键，否则使用数据对象的键）
      const headers = headerMap ? Object.keys(headerMap) : Object.keys(data[0] || {})
      // 表头显示文本（使用headerMap的值，否则直接用键名）
      const headerText = headers.map((key) => headerMap[key] || key)
      let csv = headerText.join(',') + '\n'

      // 处理每行数据
      data.forEach((item) => {
        const row = headers.map((key) => {
          // 处理包含逗号或引号的内容（CSV格式需要转义）
          const value = item[key] !== undefined ? item[key].toString() : ''
          return value.includes(',') || value.includes('"')
            ? `"${value.replace(/"/g, '""')}"`
            : value
        })
        csv += row.join(',') + '\n'
      })

      return csv
    }

    return {
      loading,
      handleExport,
    }
  },
}
</script>

<style scoped>
.btn {
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
