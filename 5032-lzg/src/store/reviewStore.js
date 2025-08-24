// src/store/reviewStore.js
import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: {},
    loading: false,
  }),

  actions: {
    // 加载指定活动的评论
    async loadEventReviews(eventId) {
      this.loading = true
      try {
        const q = query(collection(db, 'reviews'), where('eventId', '==', eventId))
        const querySnapshot = await getDocs(q)

        const eventReviews = []
        querySnapshot.forEach((doc) => {
          eventReviews.push({ id: doc.id, ...doc.data() })
        })

        this.reviews[eventId] = eventReviews
      } catch (error) {
        console.error('Error loading reviews:', error)
      } finally {
        this.loading = false
      }
    },

    // 添加/更新评论
    async addReview(eventId, userId, score, comment) {
      this.loading = true
      try {
        // 检查是否已有评论
        const q = query(
          collection(db, 'reviews'),
          where('eventId', '==', eventId),
          where('userId', '==', userId),
        )
        const querySnapshot = await getDocs(q)

        const createdAt = new Date().toISOString()
        if (!querySnapshot.empty) {
          // 更新现有评论
          const reviewDoc = querySnapshot.docs[0]
          await updateDoc(doc(db, 'reviews', reviewDoc.id), {
            score,
            comment,
            createdAt,
          })

          // 更新本地状态
          const index = this.reviews[eventId]?.findIndex((r) => r.id === reviewDoc.id)
          if (index !== -1) {
            this.reviews[eventId][index] = {
              id: reviewDoc.id,
              eventId,
              userId,
              score,
              comment,
              createdAt,
            }
          }
        } else {
          // 添加新评论
          const docRef = await addDoc(collection(db, 'reviews'), {
            eventId,
            userId,
            score,
            comment,
            createdAt,
          })

          // 更新本地状态
          if (!this.reviews[eventId]) this.reviews[eventId] = []
          this.reviews[eventId].push({
            id: docRef.id,
            eventId,
            userId,
            score,
            comment,
            createdAt,
          })
        }
      } catch (error) {
        console.error('Error adding/updating review:', error)
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    getEventRating: (state) => (eventId) => {
      const eventReviews = state.reviews[eventId] || []
      const count = eventReviews.length
      const average =
        count > 0 ? eventReviews.reduce((sum, review) => sum + review.score, 0) / count : 0
      return { count, average: Math.round(average * 10) / 10 }
    },

    getUserReview: (state) => (eventId, userId) => {
      const eventReviews = state.reviews[eventId] || []
      return eventReviews.find((review) => review.userId === userId)
    },
  },
})
