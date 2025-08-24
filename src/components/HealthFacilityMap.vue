<template>
  <div>
    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- 导出按钮 -->
    <div class="export-buttons">
      <button class="btn btn-primary" @click="exportCSV">导出为 CSV</button>
      <button class="btn btn-secondary" @click="exportPDF">导出为 PDF</button>
    </div>
  </div>
</template>

<script>
import { initMap } from '@/services/map.service'
import { exportToCSV, exportToPDF } from '@/services/export.service'

export default {
  name: 'HealthFacilityMap',

  data() {
    return {
      healthFacilities: [], // 存储医疗设施数据
    }
  },

  mounted() {
    this.initializeMap()
  },

  methods: {
    async initializeMap() {
      try {
        const map = await initMap(this.$refs.mapContainer, { zoom: 14 })
        console.log('地图初始化成功')

        // 示例数据：模拟搜索医疗设施
        this.healthFacilities = [
          { name: '医院A', address: '地址A', tel: '123456789' },
          { name: '医院B', address: '地址B', tel: '987654321' },
        ]
      } catch (error) {
        console.error('地图初始化失败:', error.message)
        alert(`地图加载失败，请检查网络连接或联系管理员。\n错误详情: ${error.message}`)
      }
    },

    // 导出为 CSV
    exportCSV() {
      exportToCSV('health_facilities', this.healthFacilities)
    },

    // 导出为 PDF
    exportPDF() {
      exportToPDF('health_facilities', this.healthFacilities)
    },
  },
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc; /* 添加边框便于调试 */
  background-color: #f9f9f9; /* 添加背景颜色 */
}

.export-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
