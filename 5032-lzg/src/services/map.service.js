import { Loader } from '@googlemaps/js-api-loader'

let map
let service
let directionsService
let directionsRenderer

// 初始化地图
export const initMap = async (mapElement, options = {}) => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places', 'directions'],
  })

  try {
    const google = await loader.load()

    // 配置默认选项
    const mapOptions = {
      center: options.center || { lat: -37.8136, lng: 144.9631 }, // 默认墨尔本
      zoom: options.zoom || 12,
      ...options,
    }

    // 创建地图
    map = new google.maps.Map(mapElement, mapOptions)

    // 初始化服务
    service = new google.maps.places.PlacesService(map)
    directionsService = new google.maps.DirectionsService()
    directionsRenderer = new google.maps.DirectionsRenderer({ map })

    return map
  } catch (error) {
    console.error('Error initializing map:', error)
    throw error
  }
}

// 搜索医疗相关地点
export const searchHealthFacilities = async (query, location = null) => {
  if (!service) {
    throw new Error('Map not initialized. Call initMap first.')
  }

  return new Promise((resolve, reject) => {
    const request = {
      query: query || 'health clinic, hospital, medical center',
      location: location || map.getCenter(),
      radius: 5000, // 5公里范围内
      type: ['hospital', 'health', 'doctor', 'pharmacy'],
    }

    service.textSearch(request, (results, status) => {
      if (status === qq.maps.places.PlacesServiceStatus.OK) {
        resolve(results)
      } else {
        reject(new Error(`Search failed: ${status}`))
      }
    })
  })
}

// 计算路线
export const calculateRoute = async (origin, destination) => {
  if (!directionsService || !directionsRenderer) {
    throw new Error('Map not initialized. Call initMap first.')
  }

  return new Promise((resolve, reject) => {
    const request = {
      origin,
      destination,
      travelMode: qq.maps.TravelMode.DRIVING,
    }

    directionsService.route(request, (result, status) => {
      if (status === qq.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result)
        resolve(result)
      } else {
        reject(new Error(`Route calculation failed: ${status}`))
      }
    })
  })
}

// 在地图上添加标记
export const addMarkers = (locations, mapInstance = map) => {
  if (!mapInstance) {
    throw new Error('Map not initialized. Call initMap first.')
  }

  const markers = []

  locations.forEach((location) => {
    const marker = new qq.maps.Marker({
      position: location.geometry.location,
      map: mapInstance,
      title: location.name,
    })

    // 添加信息窗口
    const infowindow = new qq.maps.InfoWindow({
      content: `
        <strong>${location.name}</strong><br>
        ${location.formatted_address}<br>
        ${location.rating ? `Rating: ${location.rating} ★` : ''}
      `,
    })

    marker.addListener('click', () => {
      infowindow.open({
        anchor: marker,
        map: mapInstance,
      })
    })

    markers.push(marker)
  })

  return markers
}
