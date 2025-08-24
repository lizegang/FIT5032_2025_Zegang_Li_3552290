let map
let placeService // 腾讯地图地点服务实例
let directionsService // 腾讯地图路线服务实例
let directionsRenderer // 腾讯地图路线渲染器实例

// 等待腾讯地图API加载完成
const waitForQQMaps = () => {
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(() => {
      if (window.qq && window.qq.maps && qq.maps.places) {
        clearInterval(checkInterval)
        console.log('腾讯地图API加载成功')
        resolve()
      }
    }, 100)

    setTimeout(() => {
      clearInterval(checkInterval)
      reject(
        new Error(
          '腾讯地图API加载超时，请检查网络连接或确保API密钥有效且已授权当前域名。' +
            '如果问题仍未解决，请检查是否正确加载了腾讯地图API的libraries=places参数。',
        ),
      )
    }, 90000) // 超时时间增加到90秒
  })
}

// 初始化地图
export const initMap = async (mapElement, options = {}) => {
  try {
    // 等待腾讯地图API加载完成
    await waitForQQMaps()

    if (!mapElement) {
      throw new Error('地图容器元素未提供')
    }

    // 腾讯地图使用LatLng对象作为坐标
    const mapOptions = {
      center: options.center || new qq.maps.LatLng(-37.8136, 144.9631), // 默认墨尔本坐标
      zoom: options.zoom || 12,
      mapTypeId: options.mapTypeId || qq.maps.MapTypeId.ROADMAP, // 默认地图类型
      ...options,
    }

    // 创建腾讯地图实例
    map = new qq.maps.Map(mapElement, mapOptions)

    // 初始化腾讯地图地点服务（需加载places库）
    placeService = new qq.maps.places.PlacesService(map)
    // 初始化路线服务和渲染器
    directionsService = new qq.maps.DirectionsService()
    directionsRenderer = new qq.maps.DirectionsRenderer({ map })

    console.log('地图初始化成功')
    return map
  } catch (error) {
    console.error('地图初始化失败:', error.message, error)
    throw error
  }
}

// 搜索医疗相关地点（适配腾讯地图参数）
export const searchHealthFacilities = async (query, location = null) => {
  if (!placeService) {
    throw new Error('地图未初始化，请先调用initMap')
  }

  if (!query) {
    console.warn('未提供搜索关键词，使用默认关键词: 医院,诊所,医疗中心')
  }

  return new Promise((resolve, reject) => {
    const request = {
      keyword: query || '医院,诊所,医疗中心', // 腾讯用keyword而非query
      location: location || map.getCenter(), // 腾讯位置为LatLng对象
      radius: 5000, // 搜索半径5公里
      page_size: 20,
      filter: 'category:医疗保健服务', // 腾讯地图类别筛选
    }

    // 腾讯地图搜索回调
    placeService.search(request, (results, status) => {
      // 腾讯地图成功状态为qq.maps.places.SearchStatus.OK
      if (status === qq.maps.places.SearchStatus.OK) {
        resolve(results)
      } else {
        reject(new Error(`搜索失败: ${status}`))
      }
    })
  })
}

// 计算路线（适配腾讯地图）
export const calculateRoute = async (origin, destination) => {
  if (!directionsService || !directionsRenderer) {
    throw new Error('地图未初始化，请先调用initMap')
  }

  if (!origin || !destination) {
    throw new Error('起点或终点未提供')
  }

  return new Promise((resolve, reject) => {
    try {
      // 解析经纬度为腾讯LatLng对象
      const [originLat, originLng] = origin.split(',').map(Number)
      const [destLat, destLng] = destination.split(',').map(Number)

      if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
        throw new Error('起点或终点坐标格式无效，应为"纬度,经度"')
      }

      const request = {
        origin: new qq.maps.LatLng(originLat, originLng),
        destination: new qq.maps.LatLng(destLat, destLng),
        travelMode: qq.maps.TravelMode.DRIVING,
      }

      directionsService.route(request, (result, status) => {
        // 腾讯路线成功状态为qq.maps.DirectionsStatus.OK
        if (status === qq.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result)
          resolve(result)
        } else {
          reject(new Error(`路线计算失败: ${status}`))
        }
      })
    } catch (error) {
      console.error('路线计算失败:', error.message)
      reject(error)
    }
  })
}

// 添加标记（适配腾讯地图）
export const addMarkers = (locations, mapInstance = map) => {
  if (!mapInstance) {
    throw new Error('地图未初始化，请先调用initMap')
  }

  if (!Array.isArray(locations) || locations.length === 0) {
    console.warn('未提供有效的地点列表，无法添加标记')
    return []
  }

  const markers = []

  locations.forEach((location) => {
    // 腾讯地图标记位置为latLng属性
    const marker = new qq.maps.Marker({
      position: location.latLng, // 替换谷歌的geometry.location
      map: mapInstance,
      title: location.name,
    })

    // 腾讯地图信息窗口内容（使用腾讯返回的address字段）
    const infowindow = new qq.maps.InfoWindow({
      content: `
        <strong>${location.name}</strong><br>
        ${location.address || '地址未知'}<br>
        ${location.tel ? `电话: ${location.tel}` : ''}
      `,
    })

    // 腾讯地图事件监听
    qq.maps.event.addListener(marker, 'click', () => {
      infowindow.open(mapInstance, marker)
    })

    markers.push(marker)
  })

  return markers
}
