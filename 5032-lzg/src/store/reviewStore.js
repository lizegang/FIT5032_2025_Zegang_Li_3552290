import { defineStore } from 'pinia'

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: JSON.parse(localStorage.getItem('reviews')) || {},
  }),

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

  actions: {
    addReview(eventId, userId, score, comment, createdAt) {
      if (!this.reviews[eventId]) {
        this.reviews[eventId] = []
      }

      const index = this.reviews[eventId].findIndex((review) => review.userId === userId)

      if (index !== -1) {
        this.reviews[eventId][index] = { userId, score, comment, createdAt }
      } else {
        this.reviews[eventId].push({ userId, score, comment, createdAt })
      }

      localStorage.setItem('reviews', JSON.stringify(this.reviews))
    },
  },
})
