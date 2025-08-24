<!-- eslint-disable no-undef -->

<template>
  <div class="health-map-container">
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Find Health Facilities</h5>

            <div class="mb-3">
              <label for="searchQuery" class="form-label">Search:</label>
              <input
                type="text"
                class="form-control"
                id="searchQuery"
                v-model="searchQuery"
                placeholder="e.g. hospital, clinic"
                aria-label="Search health facilities"
              />
            </div>

            <button
              class="btn btn-primary w-100 mb-3"
              @click="searchFacilities"
              :disabled="loading"
            >
              {{ loading ? 'Searching...' : 'Search' }}
            </button>

            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>

            <hr />

            <h5 class="card-title">Get Directions</h5>

            <div class="mb-3">
              <label for="origin" class="form-label">From:</label>
              <input
                type="text"
                class="form-control"
                id="origin"
                v-model="origin"
                placeholder="Your location"
                aria-label="Origin location"
              />
            </div>

            <div class="mb-3">
              <label for="destination" class="form-label">To:</label>
              <select
                class="form-select"
                id="destination"
                v-model="destination"
                aria-label="Select destination"
              >
                <option value="">Select a facility</option>
                <option
                  v-for="(facility, index) in facilities"
                  :key="index"
                  :value="facility.formatted_address"
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
              Get Directions
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div id="map" class="map" aria-label="Health facilities map"></div>
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
    const mapElement = ref(null)
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
        mapElement.value = document.getElementById('map')
        mapInstance = await initMap(mapElement.value)

        // 尝试获取用户位置
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }

              // 移动地图到用户位置
              mapInstance.setCenter(userLocation)

              // 添加用户位置标记
              // eslint-disable-next-line no-undef
              new qq.maps.Marker({
                position: userLocation,
                map: mapInstance,
                title: 'Your Location',
                icon: {
                  url: 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="%230d6efd"%3e%3ccircle cx="12" cy="12" r="10"/%3e%3ccircle cx="12" cy="12" r="5" fill="white"/%3e%3c/svg%3e',
                  scaledSize: new qq.maps.LatLng(20, 20),
                },
              })

              // 设置起点为用户位置
              origin.value = `${userLocation.lat}, ${userLocation.lng}`

              // 自动搜索附近的医疗设施
              searchQuery.value = 'hospital, clinic'
              searchFacilities()
            },
            (err) => {
              console.warn(`Error getting location: ${err.message}`)
              // 位置获取失败时仍进行默认搜索
              searchFacilities()
            },
          )
        } else {
          // 浏览器不支持地理定位
          searchFacilities()
        }
      } catch (err) {
        error.value = `Failed to load map: ${err.message}`
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
            bounds.extend(place.geometry.location)
          })
          mapInstance.fitBounds(bounds)
        }
      } catch (err) {
        error.value = `Search failed: ${err.message}`
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
        error.value = `Failed to get directions: ${err.message}`
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
