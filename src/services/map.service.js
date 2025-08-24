// 移除谷歌地图加载器，使用全局引入的腾讯地图API
let map
let placeService // 腾讯地图地点服务实例
let directionsService // 腾讯地图路线服务实例
let directionsRenderer // 腾讯地图路线渲染器实例

// 初始化地图
export const initMap = async (mapElement, options = {}) => {
  try {
    // 等待腾讯地图API加载完成
    if (!window.qq || !window.qq.maps) {
      throw new Error('腾讯地图API未加载，请检查index.html中的script标签')
    }

    // 配置默认选项（使用腾讯地图的LatLng对象）
    const mapOptions = {
      center: options.center || new qq.maps.LatLng(-37.8136, 144.9631), // 墨尔本坐标
      zoom: options.zoom || 12,
      ...options,
    }

    // 创建腾讯地图实例
    map = new qq.maps.Map(mapElement, mapOptions)

    // 初始化腾讯地图地点服务（修正：使用腾讯地图的PlacesService）
    placeService = new qq.maps.places.PlacesService(map)
    // 初始化路线服务和渲染器
    directionsService = new qq.maps.DirectionsService()
    directionsRenderer = new qq.maps.DirectionsRenderer({ map })

    return map
  } catch (error) {
    console.error('地图初始化失败:', error)
    throw error
  }
}

// 搜索医疗相关地点
export const searchHealthFacilities = async (query, location = null) => {
  if (!placeService) {
    throw new Error('地图未初始化，请先调用initMap')
  }

  return new Promise((resolve, reject) => {
    const request = {
      keyword: query || '医院,诊所,医疗中心', // 腾讯地图使用keyword参数
      location: location || map.getCenter(),
      radius: 5000, // 搜索半径5公里
      page_size: 20,
      filter: 'category:医疗保健服务', // 筛选医疗相关类别
    }

    placeService.search(request, (results, status) => {
      // 修正：使用腾讯地图的状态常量
      if (status === qq.maps.places.PlacesServiceStatus.OK) {
        resolve(results)
      } else {
        reject(new Error(`搜索失败: ${status}`))
      }
    })
  })
}

// 计算路线
export const calculateRoute = async (origin, destination) => {
  if (!directionsService || !directionsRenderer) {
    throw new Error('地图未初始化，请先调用initMap')
  }

  return new Promise((resolve, reject) => {
    // 解析经纬度字符串为腾讯地图LatLng对象
    const [originLat, originLng] = origin.split(',').map(Number)
    const [destLat, destLng] = destination.split(',').map(Number)

    const request = {
      origin: new qq.maps.LatLng(originLat, originLng),
      destination: new qq.maps.LatLng(destLat, destLng),
      travelMode: qq.maps.TravelMode.DRIVING, // 腾讯地图的驾车模式
    }

    directionsService.route(request, (result, status) => {
      // 修正：使用腾讯地图的路线状态常量
      if (status === qq.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result)
        resolve(result)
      } else {
        reject(new Error(`路线计算失败: ${status}`))
      }
    })
  })
}

// 在地图上添加标记
export const addMarkers = (locations, mapInstance = map) => {
  if (!mapInstance) {
    throw new Error('地图未初始化，请先调用initMap')
  }

  const markers = []

  locations.forEach((location) => {
    const marker = new qq.maps.Marker({
      position: location.latLng, // 腾讯地图返回的位置信息在latLng属性
      map: mapInstance,
      title: location.name,
    })

    // 创建信息窗口
    const infowindow = new qq.maps.InfoWindow({
      content: `
        <strong>${location.name}</strong><br>
        ${location.address || '地址未知'}<br>
        ${location.tel ? `电话: ${location.tel}` : ''}
      `,
    })

    // 腾讯地图的事件监听方式
    qq.maps.event.addListener(marker, 'click', () => {
      infowindow.open(mapInstance, marker)
    })

    markers.push(marker)
  })

  return markers
}
