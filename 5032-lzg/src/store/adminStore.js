import { defineStore } from 'pinia'
import { collection, getDocs, query, where, count } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    userStats: {
      total: 0,
      admins: 0,
      regularUsers: 0,
      recentUsers: [],
    },
    eventStats: {
      total: 0,
      upcoming: 0,
      past: 0,
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserStats() {
      this.loading = true
      this.error = null

      try {
        // 获取用户总数
        const usersQuery = query(collection(db, 'users'))
        const userCountSnapshot = await getDocs(usersQuery)
        this.userStats.total = userCountSnapshot.size

        // 获取管理员数量
        const adminsQuery = query(collection(db, 'users'), where('role', '==', 'admin'))
        const adminCountSnapshot = await getDocs(adminsQuery)
        this.userStats.admins = adminCountSnapshot.size

        // 普通用户数量
        this.userStats.regularUsers = this.userStats.total - this.userStats.admins

        // 获取最近注册的用户（按创建日期排序）
        const recentUsersQuery = query(
          collection(db, 'users'),
          // 这里假设你有一个createdAt字段
          // orderBy('createdAt', 'desc'),
          // limit(5)
        )
        const recentUsersSnapshot = await getDocs(recentUsersQuery)
        this.userStats.recentUsers = recentUsersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      } catch (error) {
        this.error = error.message
        console.error('Error fetching user stats:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchEventStats() {
      this.loading = true
      this.error = null

      try {
        // 获取所有事件
        const eventsQuery = query(collection(db, 'events'))
        const eventsSnapshot = await getDocs(eventsQuery)
        this.eventStats.total = eventsSnapshot.size

        // 计算即将到来和过去的事件
        const today = new Date()
        let upcoming = 0
        let past = 0

        eventsSnapshot.forEach((doc) => {
          const event = doc.data()
          const eventDate = new Date(event.date)

          if (eventDate >= today) {
            upcoming++
          } else {
            past++
          }
        })

        this.eventStats.upcoming = upcoming
        this.eventStats.past = past
      } catch (error) {
        this.error = error.message
        console.error('Error fetching event stats:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAllStats() {
      await Promise.all([this.fetchUserStats(), this.fetchEventStats()])
    },
  },
})
