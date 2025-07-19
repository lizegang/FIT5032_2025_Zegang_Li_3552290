<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <div class="avatar-container mb-3">
              <i class="fas fa-user-circle text-primary fa-5x"></i>
            </div>
            <h3 class="card-title">{{ user.name }}</h3>
            <p class="card-text text-muted">{{ user.email }}</p>
            <p class="card-text">
              <span class="badge bg-secondary">{{ user.role === 'admin' ? 'Administrator' : 'User' }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h4>My Events</h4>
          </div>
          <div class="card-body">
            <div class="alert alert-info" v-if="!events.length">
              You haven't joined any events yet. <router-link to="/">Browse Events</router-link>
            </div>

            <div class="table-responsive" v-else>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Event Name</th>
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
                      <router-link :to="`/event/${event.id}`" class="btn btn-sm btn-outline-primary">
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
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useReviewStore } from '@/store/reviewStore';
import Rating from '@/components/Rating.vue';

export default {
  components: { Rating },
  setup() {
    const authStore = useAuthStore();
    const reviewStore = useReviewStore();

    const user = computed(() => authStore.user || {});

    const events = computed(() => [
      {
        id: 'event-1',
        title: 'Health Lecture: Preventing Cardiovascular Diseases',
        date: '2023-06-15'
      },
      {
        id: 'event-2',
        title: 'Community Free Medical Check-up',
        date: '2023-06-20'
      }
    ]);

    const getEventRating = (eventId) => {
      return reviewStore.getEventRating(eventId);
    };

    return {
      user,
      events,
      getEventRating
    };
  }
};
</script>
