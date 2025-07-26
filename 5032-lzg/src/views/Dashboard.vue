<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white">
            <h2>Dashboard</h2>
          </div>
          <div class="card-body">
            <h4>Welcome, {{ user.name }}</h4>
            <p>Here are the upcoming events:</p>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in events" :key="event.id">
                    <td>{{ event.title }}</td>
                    <td>{{ event.date }}</td>
                    <td>
                      <Rating :score="getEventRating(event.id).average" :readonly="true" />
                    </td>
                    <td>
                      <router-link
                        :to="`/event/${event.id}`"
                        class="btn btn-sm btn-outline-primary"
                      >
                        Details
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
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
import Rating from '@/components/Rating.vue'

export default {
  components: { Rating },
  setup() {
    const authStore = useAuthStore()
    const reviewStore = useReviewStore()

    const user = computed(() => authStore.user || {})

    const events = computed(() => [
      {
        id: 'event-1',
        title: 'Health Lecture: Preventing Cardiovascular Diseases',
        date: '2023-06-15',
      },
      {
        id: 'event-2',
        title: 'Community Free Medical Check-up',
        date: '2023-06-20',
      },
    ])

    const getEventRating = (eventId) => {
      return reviewStore.getEventRating(eventId)
    }

    return {
      user,
      events,
      getEventRating,
    }
  },
}
</script>
