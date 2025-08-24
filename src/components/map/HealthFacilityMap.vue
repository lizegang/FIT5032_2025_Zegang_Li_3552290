/* global qq */
<template>
  <div class="health-map-container">
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">查找医疗设施</h5>

            <div class="mb-3">
              <label for="searchQuery" class="form-label">搜索:</label>
              <input
                type="text"
                class="form-control"
                id="searchQuery"
                v-model="searchQuery"
                placeholder="例如: 医院, 诊所"
                aria-label="搜索医疗设施"
              />
            </div>

            <button
              class="btn btn-primary w-100 mb-3"
              @click="searchFacilities"
              :disabled="loading"
            >
              {{ loading ? '搜索中...' : '搜索' }}
            </button>

            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>

            <hr />

            <h5 class="card-title">获取路线</h5>

            <div class="mb-3">
              <label for="origin" class="form-label">起点:</label>
              <input
                type="text"
                class="form-control"
                id="origin"
                v-model="origin"
                placeholder="你的位置（经纬度，例如: -37.8136, 144.9631）"
                aria-label="起点位置"
              />
            </div>

            <div class="mb-3">
              <label for="destination" class="form-label">终点:</label>
              <select
                class="form-select"
                id="destination"
                v-model="destination"
                aria-label="选择目的地"
              >
                <option value="">选择医疗设施</option>
                <option
                  v-for="(facility, index) in facilities"
                  :key="index"
                  :value="`${facility.latLng.lat},${facility.latLng.lng}`"
                >
                  {{ facility.name }}
                </option>
              </select>
            </div>

            <button
              class="btn btn-success w-100"
              @click="getDirections"
              :disabled="!origin || !destination"
            >
              获取路线
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div id="map" class="map" aria-label="医疗设施地图"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  initMap,
  searchHealthFacilities,
  addMarkers,
  calculateRoute,
} from '../../services/map.service'

export default {
  name: 'HealthFacilityMap',
  setup() {
    const searchQuery = ref('')
    const facilities = ref([])
    const loading = ref(false)
    const error = ref('')
    const origin = ref('')
    const destination = ref('')
    let mapInstance = null
    let markers = []

    // 初始化地图
    const initializeMap = async () => {
      try {
        const mapElement = document.getElementById('map')
        mapInstance = await initMap(mapElement)

        // 尝试获取用户位置
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = new qq.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude,
              )

              // 移动地图到用户位置
              mapInstance.setCenter(userLocation)

              // 添加用户位置标记
              new qq.maps.Marker({
                position: new qq.maps.LatLng(userLocation.lat, userLocation.lng), // 显式创建腾讯坐标对象
                map: mapInstance,
                title: 'Your Location',
                icon: {
                  url: 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="%230d6efd"%3e%3ccircle cx="12" cy="12" r="10"/%3e%3ccircle cx="12" cy="12" r="5" fill="white"/%3e%3c/svg%3e',
                  scaledSize: new qq.maps.Size(20, 20), // 修正：腾讯地图使用Size而非LatLng
                },
              })

              // 设置起点为用户位置
              origin.value = `${userLocation.lat},${userLocation.lng}`

              // 自动搜索附近的医疗设施
              searchQuery.value = '医院, 诊所'
              searchFacilities()
            },
            (err) => {
              console.warn(`获取位置失败: ${err.message}`)
              // 位置获取失败时仍进行默认搜索
              searchFacilities()
            },
          )
        } else {
          // 浏览器不支持地理定位
          searchFacilities()
        }
      } catch (err) {
        error.value = `地图加载失败: ${err.message}`
        console.error(err)
      }
    }

    // 搜索医疗设施
    const searchFacilities = async () => {
      if (!mapInstance) return

      loading.value = true
      error.value = ''

      try {
        // 清除现有标记
        clearMarkers()

        // 搜索设施
        const results = await searchHealthFacilities(searchQuery.value)
        facilities.value = results

        // 添加新标记
        markers = addMarkers(results, mapInstance)

        // 如果有结果，调整地图视野以显示所有标记
        if (results.length > 0) {
          const bounds = new qq.maps.LatLngBounds()
          results.forEach((place) => {
            bounds.extend(place.latLng) // 腾讯地图的位置属性是latLng
          })
          mapInstance.fitBounds(bounds)
        }
      } catch (err) {
        error.value = `搜索失败: ${err.message}`
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    // 获取路线
    const getDirections = async () => {
      if (!origin.value || !destination.value || !mapInstance) return

      try {
        await calculateRoute(origin.value, destination.value)
      } catch (err) {
        error.value = `路线获取失败: ${err.message}`
        console.error(err)
      }
    }

    // 清除标记
    const clearMarkers = () => {
      markers.forEach((marker) => marker.setMap(null))
      markers = []
    }

    onMounted(initializeMap)

    onUnmounted(() => {
      clearMarkers()
    })

    return {
      searchQuery,
      facilities,
      loading,
      error,
      origin,
      destination,
      searchFacilities,
      getDirections,
    }
  },
}
</script>

<style scoped>
.health-map-container {
  padding: 1rem;
}

.map {
  height: 600px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
