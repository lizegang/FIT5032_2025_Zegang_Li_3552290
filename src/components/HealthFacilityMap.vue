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
// 确保只导入一次
import { initMap, addMarkers } from '@/services/map.service'
import { exportToCSV, exportToPDF } from '@/services/export.service'
import { getFunctions, httpsCallable } from 'firebase/functions'

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

        // 调用云函数获取医疗设施数据
        const functions = getFunctions()
        const getHealthFacilities = httpsCallable(functions, 'getHealthFacilities')
        const response = await getHealthFacilities()
        if (response.data.success) {
          this.healthFacilities = response.data.data
          addMarkers(
            this.healthFacilities.map((facility) => ({
              latLng: new qq.maps.LatLng(facility.latitude, facility.longitude), // 使用实际坐标
              name: facility.name,
              address: facility.address,
              tel: facility.tel,
            })),
            map,
          )
        } else {
          console.error('获取医疗设施数据失败:', response.data.error)
        }
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
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}

.export-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
