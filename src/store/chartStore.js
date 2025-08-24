import { defineStore } from 'pinia'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useChartStore = defineStore('charts', {
  state: () => ({
    userRegistrationData: [],
    eventCategoryData: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserRegistrationData() {
      this.loading = true
      this.error = null

      try {
        // 获取用户数据并按注册日期排序
        const usersQuery = query(
          collection(db, 'users'),
          // 假设你有createdAt字段
          // orderBy('createdAt', 'asc')
        )
        const usersSnapshot = await getDocs(usersQuery)

        // 按月份统计注册用户
        const monthlyData = {}

        usersSnapshot.forEach((doc) => {
          const user = doc.data()
          // 假设你有createdAt字段
          // const date = new Date(user.createdAt.toDate());
          const date = new Date() // 临时使用当前日期进行演示
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

          if (monthlyData[monthYear]) {
            monthlyData[monthYear]++
          } else {
            monthlyData[monthYear] = 1
          }
        })

        // 转换为图表所需格式
        this.userRegistrationData = Object.entries(monthlyData).map(([month, count]) => ({
          month,
          users: count,
        }))
      } catch (error) {
        this.error = error.message
        console.error('Error fetching user registration data:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchEventCategoryData() {
      this.loading = true
      this.error = null

      try {
        // 获取所有事件
        const eventsQuery = query(collection(db, 'events'))
        const eventsSnapshot = await getDocs(eventsQuery)

        // 按类别统计事件
        const categoryData = {}

        eventsSnapshot.forEach((doc) => {
          const event = doc.data()
          // 假设事件有category字段，如果没有则使用默认类别
          const category = event.category || 'General'

          if (categoryData[category]) {
            categoryData[category]++
          } else {
            categoryData[category] = 1
          }
        })

        // 转换为图表所需格式
        this.eventCategoryData = Object.entries(categoryData).map(([category, count]) => ({
          category,
          events: count,
        }))
      } catch (error) {
        this.error = error.message
        console.error('Error fetching event category data:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAllChartData() {
      await Promise.all([this.fetchUserRegistrationData(), this.fetchEventCategoryData()])
    },
  },
})
