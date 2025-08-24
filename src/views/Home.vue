<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="hero-section text-center mb-5">
      <h1 class="display-4 fw-bold">Health Charity Platform</h1>
      <p class="lead text-muted mb-4">Connect Love, Share Health</p>
      <div class="d-flex justify-content-center gap-3">
        <router-link to="/register" class="btn btn-primary btn-lg"> Join Now </router-link>
        <router-link to="/events" class="btn btn-outline-secondary btn-lg">
          Browse Events
        </router-link>
        <!-- 新增：地图快捷入口 -->
        <router-link to="/map" class="btn btn-success btn-lg">
          <i class="fas fa-map-marker-alt me-1"></i>Find Health Facilities
        </router-link>
      </div>
    </div>

    <!-- 原有三个功能卡片 -->
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="icon-container mb-3">
              <i class="fas fa-heartbeat text-primary fa-3x"></i>
            </div>
            <h3 class="card-title">Health Activities</h3>
            <p class="card-text">
              Participate in various health lectures and free medical check-ups to get professional
              medical advice.
            </p>
            <router-link to="/events" class="btn btn-outline-primary mt-2">
              View Activities
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="icon-container mb-3">
              <i class="fas fa-hands-helping text-success fa-3x"></i>
            </div>
            <h3 class="card-title">Charitable Donations</h3>
            <p class="card-text">
              Provide assistance to those in need and build a healthy community together.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="icon-container mb-3">
              <i class="fas fa-users text-info fa-3x"></i>
            </div>
            <h3 class="card-title">Community Interaction</h3>
            <p class="card-text">
              Exchange health experiences and share life stories with like-minded friends.
            </p>
            <router-link to="/feedback" class="btn btn-outline-primary mt-2">
              Share Feedback
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 原有近期活动区域 -->
    <div class="mt-6">
      <h2 class="text-center mb-4">Recent Events</h2>
      <div class="row g-4">
        <div class="col-md-6" v-for="event in events" :key="event.id">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h3 class="card-title">{{ event.title }}</h3>
                  <div class="d-flex align-items-center mb-2">
                    <Rating :score="getEventRating(event.id).average" :readonly="true" />
                    <span class="ms-2 text-muted">({{ getEventRating(event.id).count }})</span>
                  </div>
                </div>
                <span class="badge bg-primary">{{ formatDate(event.date) }}</span>
              </div>
              <p class="card-text">{{ event.description.substring(0, 100) }}...</p>

              <div v-if="isAuthenticated" class="mt-3">
                <div class="d-flex align-items-center">
                  <span class="me-2">Rate this event:</span>
                  <Rating
                    @update="updateRating(event.id, $event)"
                    :score="getUserReview(event.id)?.score || 0"
                  />
                </div>
                <div v-if="getUserReview(event.id)" class="mt-2 text-success small">
                  <i class="fas fa-check-circle"></i> You have rated this event
                </div>
              </div>

              <router-link :to="`/events/${event.id}`" class="btn btn-outline-primary mt-3">
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useReviewStore } from '@/store/reviewStore'

export default {
  setup() {
    const authStore = useAuthStore()
    const reviewStore = useReviewStore()

    const events = ref([
      {
        id: 'event-1',
        title: 'Health Lecture: Preventing Cardiovascular Diseases',
        date: '2023-06-15',
        description:
          'This lecture will be given by Professor Zhang, a cardiovascular expert. The content includes prevention of cardiovascular diseases, early symptom recognition, and healthy lifestyle advice. Suitable for people of all ages.',
      },
      {
        id: 'event-2',
        title: 'Community Free Medical Check-up',
        date: '2023-06-20',
        description:
          'A free medical check-up organized by the Municipal Hospital, providing free blood pressure and blood sugar tests, as well as basic examinations in internal medicine, surgery, ophthalmology, etc. Welcome residents to participate.',
      },
    ])

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }

    const getEventRating = (eventId) => {
      return reviewStore.getEventRating(eventId)
    }

    const getUserReview = (eventId) => {
      if (!isAuthenticated.value) return null
      return reviewStore.getUserReview(eventId, authStore.user?.email || '')
    }

    const updateRating = (eventId, score) => {
      if (!isAuthenticated.value) {
        alert('Please log in to rate this event')
        return
      }

      reviewStore.addReview(eventId, authStore.user.email, score, '')
    }

    const isAuthenticated = computed(() => authStore.isAuthenticated)

    return {
      events,
      getEventRating,
      getUserReview,
      updateRating,
      isAuthenticated,
      formatDate,
    }
  },
}
</script>
