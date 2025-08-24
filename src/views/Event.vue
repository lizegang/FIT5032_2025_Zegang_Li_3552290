<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div v-if="isAuthenticated" class="mb-4 p-4 bg-light rounded">
      <h4 class="mb-3">Submit Your Review</h4>
      <div class="mb-4">
        <label class="form-label fw-medium">Select Rating:</label>
        <select v-model="newRating" class="form-select w-50 mt-1" :disabled="submitting">
          <option value="">-- Select Rating --</option>
          <option value="1">1 Star (Very Poor)</option>
          <option value="2">2 Stars (Average)</option>
          <option value="3">3 Stars (Good)</option>
          <option value="4">4 Stars (Excellent)</option>
          <option value="5">5 Stars (Outstanding)</option>
        </select>
        <div v-if="newRating > 0" class="mt-2 text-success small">
          <i class="fas fa-check-circle"></i> Selected {{ newRating }} Stars
        </div>
        <div v-if="submitError && !newRating" class="mt-2 text-danger small">
          <i class="fas fa-exclamation-circle"></i> Please select a rating first
        </div>
      </div>
      <div>
        <label class="form-label fw-medium">Review Content:</label>
        <textarea
          v-model="newComment"
          class="form-control mt-1"
          rows="3"
          placeholder="Share your experience and feelings about the event..."
          :disabled="submitting"
        ></textarea>
      </div>
      <button
        class="btn btn-primary mt-3"
        @click="submitRating"
        :disabled="!newRating || submitting"
      >
        {{ submitting ? 'Submitting...' : 'Submit Review' }}
      </button>
    </div>
    <div v-else class="mb-4 p-4 bg-light rounded">
      <p class="text-muted">
        <i class="fas fa-info-circle me-2"></i>
        <router-link to="/login" class="text-primary">Log in</router-link> to submit a review
      </p>
    </div>
    <div class="mt-5">
      <h4>User Reviews ({{ eventRating.count }})</h4>
      <div v-if="eventReviews.length === 0" class="mt-3 p-3 bg-light rounded text-center">
        <p class="text-muted mb-0">No reviews yet. Be the first to review!</p>
      </div>
      <div v-for="(review, index) in eventReviews" :key="index" class="mt-3 p-3 border rounded">
        <div class="d-flex justify-content-between">
          <div>
            <strong>{{ review.user ? review.user.split('@')[0] : 'Anonymous User' }}</strong>
            <span class="ms-2 badge bg-warning text-dark"> {{ review.score }} Stars </span>
          </div>
          <span class="text-muted small">
            {{ formatReviewDate(review.createdAt) }}
          </span>
        </div>
        <p class="mt-2">{{ review.comment || 'No review content' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useReviewStore } from '@/store/reviewStore'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const authStore = useAuthStore()
    const reviewStore = useReviewStore()
    const route = useRoute()
    const eventId = route.params.id
    const newRating = ref('')
    const newComment = ref('')
    const submitting = ref(false)
    const submitError = ref(false)

    const eventRating = computed(() => {
      const count = (reviewStore.reviews[eventId] || []).length
      const average =
        count > 0
          ? (
              reviewStore.reviews[eventId].reduce((sum, review) => sum + Number(review.score), 0) /
              count
            ).toFixed(1)
          : '0'
      return { count, average }
    })

    const eventReviews = computed(() => {
      return reviewStore.reviews[eventId] || []
    })

    const formatReviewDate = (dateStr) => {
      if (!dateStr) return 'Unknown Time'
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    }

    const submitRating = () => {
      if (!newRating.value) {
        submitError.value = true
        setTimeout(() => (submitError.value = false), 3000)
        return
      }
      submitting.value = true
      submitError.value = false
      reviewStore.addReview(
        eventId,
        authStore.user.email,
        Number(newRating.value),
        newComment.value,
        new Date().toISOString(),
      )
      setTimeout(() => {
        newRating.value = ''
        newComment.value = ''
        submitting.value = false
        alert('Review submitted successfully. Thank you for your feedback!')
      }, 500)
    }

    return {
      event,
      eventRating,
      eventReviews,
      isAuthenticated: computed(() => authStore.isAuthenticated),
      newRating,
      newComment,
      submitting,
      submitError,
      submitRating,
      formatReviewDate,
    }
  },
}
</script>

<style scoped>
.border {
  transition: all 0.2s ease;
}
.border:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
