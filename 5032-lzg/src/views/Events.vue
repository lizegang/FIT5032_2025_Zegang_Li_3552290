<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="text-center mb-6">
      <h1 class="display-5 fw-bold">Health Charity Events</h1>
      <p class="text-muted">Participate in beneficial health activities and contribute to the community</p>
    </div>

    <div class="card mb-5 shadow-sm">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input
              type="text"
              v-model="searchKeyword"
              class="form-control"
              placeholder="Search for events..."
            >
          </div>
          <div class="col-md-4">
            <select v-model="filterDate" class="form-select">
              <option value="">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="filterRating" class="form-select">
              <option value="">All Ratings</option>
              <option value="4+">4+ Stars</option>
              <option value="3+">3+ Stars</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div v-if="filteredEvents.length === 0" class="col-12 text-center py-5">
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>No events found that match your criteria
        </div>
      </div>

      <div
        class="col-md-6 col-lg-4"
        v-for="event in filteredEvents"
        :key="event.id"
      >
        <div class="card h-100 shadow-sm hover-shadow">
          <div class="event-img-container">
            <img
              :src="event.imageUrl"
              :alt="event.title"
              class="card-img-top"
            >
          </div>

          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title">{{ event.title }}</h5>
              <span class="badge bg-primary">{{ formatDate(event.date) }}</span>
            </div>

            <div class="d-flex align-items-center mb-3">
              <Rating :score="eventRating(event.id).average" :readonly="true" />
              <span class="ms-2 text-muted small">({{ eventRating(event.id).count }})</span>
            </div>

            <p class="card-text text-muted">
              {{ event.description.substring(0, 80) }}...
            </p>

            <p class="card-text small">
              <i class="fas fa-map-marker-alt text-info me-1"></i>
              {{ event.location }}
            </p>
          </div>

          <div class="card-footer bg-transparent">
            <router-link
              :to="`/event/${event.id}`"
              class="btn btn-outline-primary w-100"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useReviewStore } from '@/store/reviewStore';
import Rating from '@/components/Rating.vue';

export default {
  components: { Rating },
  setup() {
    const allEvents = ref([
      {
        id: 'event-1',
        title: 'Health Lecture: Preventing Cardiovascular Diseases',
        date: '2023-06-15',
        location: 'Community Activity Center',
        description: 'This lecture will be given by Professor Zhang, a cardiovascular expert. The content includes prevention of cardiovascular diseases, early symptom recognition, and healthy lifestyle advice. Suitable for people of all ages.',
        imageUrl: 'https://picsum.photos/seed/health1/400/200'
      },
      {
        id: 'event-2',
        title: 'Community Free Medical Check-up',
        date: '2023-06-20',
        location: 'Community Square',
        description: 'A free medical check-up organized by the Municipal Hospital, providing free blood pressure and blood sugar tests, as well as basic examinations in internal medicine, surgery, ophthalmology, etc. Welcome residents to participate.',
        imageUrl: 'https://picsum.photos/seed/health2/400/200'
      },
      {
        id: 'event-3',
        title: 'Adolescent Mental Health Lecture',
        date: '2023-07-05',
        location: 'City Youth Activity Center',
        description: 'A special lecture on common psychological problems among adolescents (such as academic stress, social anxiety), presented by professional psychological counselors.',
        imageUrl: 'https://picsum.photos/seed/health3/400/200'
      }
    ]);

    const searchKeyword = ref('');
    const filterDate = ref('');
    const filterRating = ref('');

    const reviewStore = useReviewStore();
    const eventRating = (eventId) => {
      return reviewStore.getEventRating(eventId);
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const filteredEvents = computed(() => {
      return allEvents.value.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                             event.description.toLowerCase().includes(searchKeyword.value.toLowerCase());

        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let matchesDate = true;

        if (filterDate.value === 'upcoming') {
          matchesDate = eventDate >= today;
        } else if (filterDate.value === 'past') {
          matchesDate = eventDate < today;
        }

        const rating = eventRating(event.id).average;
        let matchesRating = true;

        if (filterRating.value === '4+') {
          matchesRating = rating >= 4;
        } else if (filterRating.value === '3+') {
          matchesRating = rating >= 3;
        }

        return matchesSearch && matchesDate && matchesRating;
      });
    });

    return {
      allEvents,
      searchKeyword,
      filterDate,
      filterRating,
      filteredEvents,
      eventRating,
      formatDate
    };
  }
};
</script>

<style scoped>
.event-img-container {
  height: 180px;
  overflow: hidden;
}

.event-img-container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-img-container img:hover {
  transform: scale(1.05);
}

.hover-shadow {
  transition: box-shadow 0.3s ease;
}

.hover-shadow:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
