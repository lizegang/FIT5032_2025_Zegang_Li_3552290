<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h3>Admin Menu</h3>
          </div>
          <div class="card-body">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-calendar-plus me-2"></i>Create Event
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link"> <i class="fas fa-users me-2"></i>User Management </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link"> <i class="fas fa-chart-line me-2"></i>Analytics </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h4>Platform Overview</h4>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="card bg-primary text-white">
                  <div class="card-body">
                    <h5 class="card-title">Total Users</h5>
                    <p class="card-text display-4">245</p>
                    <p class="card-text">12% increase from last month</p>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="card bg-success text-white">
                  <div class="card-body">
                    <h5 class="card-title">Total Events</h5>
                    <p class="card-text display-4">18</p>
                    <p class="card-text">5% increase from last month</p>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="card bg-info text-white">
                  <div class="card-body">
                    <h5 class="card-title">Average Rating</h5>
                    <p class="card-text display-4">{{ overallAverageRating.toFixed(2) }}</p>
                    <p class="card-text">Out of 5.0</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <h5>Recent Event Ratings</h5>
              <div class="chart-container">
                <div class="alert alert-warning">
                  <i class="fas fa-chart-bar me-2"></i>Chart will be displayed here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useReviewStore } from '@/store/reviewStore'

export default {
  setup() {
    const authStore = useAuthStore()
    const reviewStore = useReviewStore()

    const user = computed(() => authStore.user || {})

    const allEvents = [
      {
        id: 'event-1',
        title: 'Health Lecture: Preventing Cardiovascular Diseases',
        date: '2023-06-15',
        location: 'Community Activity Center',
        description:
          'This lecture will be given by Professor Zhang, a cardiovascular expert. The content includes prevention of cardiovascular diseases, early symptom recognition, and healthy lifestyle advice. Suitable for people of all ages.',
        imageUrl: 'https://picsum.photos/seed/health1/400/200',
      },
      {
        id: 'event-2',
        title: 'Community Free Medical Check-up',
        date: '2023-06-20',
        location: 'Community Square',
        description:
          'A free medical check-up organized by the Municipal Hospital, providing free blood pressure and blood sugar tests, as well as basic examinations in internal medicine, surgery, ophthalmology, etc. Welcome residents to participate.',
        imageUrl: 'https://picsum.photos/seed/health2/400/200',
      },
      {
        id: 'event-3',
        title: 'Adolescent Mental Health Lecture',
        date: '2023-07-05',
        location: 'City Youth Activity Center',
        description:
          'A special lecture on common psychological problems among adolescents (such as academic stress, social anxiety), presented by professional psychological counselors.',
        imageUrl: 'https://picsum.photos/seed/health3/400/200',
      },
    ]

    const overallAverageRating = computed(() => {
      let totalScore = 0
      let totalCount = 0

      allEvents.forEach((event) => {
        const { count, average } = reviewStore.getEventRating(event.id)
        totalScore += average * count
        totalCount += count
      })

      return totalCount > 0 ? totalScore / totalCount : 0
    })

    return {
      user,
      overallAverageRating,
    }
  },
}
</script>
