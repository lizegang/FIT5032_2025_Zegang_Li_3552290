<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card shadow-lg">
          <div class="card-header bg-info text-white">
            <h2>{{ event.title }}</h2>
          </div>

          <div class="card-body">
            <div class="mb-4">
              <div class="d-flex align-items-center mb-3">
                <span class="me-2">Average Rating:</span>
                <span class="badge bg-warning text-dark">
                  {{ eventRating.average || 'Not yet rated' }}
                </span>
                <span class="ms-2 text-muted">({{ eventRating.count }} reviews)</span>
              </div>

              <p class="text-muted">
                <i class="fas fa-calendar-alt me-2"></i>Event Date: {{ event.date }}
              </p>

              <p class="text-muted">
                <i class="fas fa-map-marker-alt me-2"></i>Location: {{ event.location }}
              </p>

              <div class="mt-4">
                <h4>Event Details</h4>
                <p class="mt-2">{{ event.description }}</p>
              </div>
            </div>

            <div v-if="isAuthenticated" class="mb-4 p-4 bg-light rounded">
              <h4 class="mb-3">Leave Your Review</h4>

              <div class="mb-4">
                <label class="form-label fw-medium">Select Rating:</label>
                <select
                  v-model="newRating"
                  class="form-select w-50 mt-1"
                  :disabled="submitting"
                >
                  <option value="">-- Select Rating --</option>
                  <option value="1">1 Star (Poor)</option>
                  <option value="2">2 Stars (Fair)</option>
                  <option value="3">3 Stars (Good)</option>
                  <option value="4">4 Stars (Very Good)</option>
                  <option value="5">5 Stars (Excellent)</option>
                </select>

                <div v-if="newRating > 0" class="mt-2 text-success small">
                  <i class="fas fa-check-circle"></i> {{ newRating }} stars selected
                </div>
                <div v-if="submitError && !newRating" class="mt-2 text-danger small">
                  <i class="fas fa-exclamation-circle"></i> Please select a rating
                </div>
              </div>

              <div>
                <label class="form-label fw-medium">Review Content:</label>
                <textarea
                  v-model="newComment"
                  class="form-control mt-1"
                  rows="3"
                  placeholder="Share your experience and feelings about this event..."
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
                Please <router-link to="/login" class="text-primary">log in</router-link> to leave a review
              </p>
            </div>

            <div class="mt-5">
              <h4>User Reviews ({{ eventRating.count }})</h4>

              <div v-if="eventReviews.length === 0" class="mt-3 p-3 bg-light rounded text-center">
                <p class="text-muted mb-0">No reviews yet. Be the first to leave a review!</p>
              </div>

              <div
                v-for="(review, index) in eventReviews"
                :key="index"
                class="mt-3 p-3 border rounded"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>{{ review.user ? review.user.split('@')[0] : 'Anonymous User' }}</strong>
                    <span class="ms-2 badge bg-warning text-dark">
                      {{ review.score }} Stars
                    </span>
                  </div>
                  <span class="text-muted small">
                    {{ formatReviewDate(review.createdAt) }}
                  </span>
                </div>
                <p class="mt-2">{{ review.comment || 'No comment' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useReviewStore } from '@/store/reviewStore';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const reviewStore = useReviewStore();
    const route = useRoute();
    const eventId = route.params.id;

    const newRating = ref('');
    const newComment = ref('');
    const submitting = ref(false);
    const submitError = ref(false);

    const event = computed(() => {
      const events = {
        'event-1': {
          id: 'event-1',
          title: 'Health Lecture: Preventing Cardiovascular Diseases',
          date: '2023-06-15',
          location: 'Community Activity Center Hall',
          description: 'This lecture will be given by Professor Zhang, a cardiovascular expert from the City Hospital. The content includes prevention knowledge of cardiovascular diseases, early symptom recognition methods, and healthy lifestyle advice. The lecture is suitable for people of all ages. Free blood pressure measurement services will be provided on site, and health brochures will be distributed.'
        },
        'event-2': {
          id: 'event-2',
          title: 'Community Free Medical Check-up',
          date: '2023-06-20',
          location: 'Community Square',
          description: 'A large-scale free medical check-up organized by the Municipal Hospital. Doctors from multiple departments including internal medicine, surgery, ophthalmology, and pediatrics will be on site to provide free blood pressure and blood sugar tests, as well as consultation and diagnosis services for common diseases.'
        }
      };
      return events[eventId] || {
        id: eventId,
        title: 'Event Information',
        date: '2023-06-01',
        location: 'Unknown',
        description: 'No event details available'
      };
    });

    const eventRating = computed(() => {
      const eventReviews = reviewStore.reviews[eventId] || [];
      const count = eventReviews.length;
      const average = count > 0
        ? (eventReviews.reduce((sum, review) => sum + Number(review.score), 0) / count).toFixed(1)
        : '0';
      return { count, average };
    });

    const eventReviews = computed(() => {
      return reviewStore.reviews[eventId] || [];
    });

    const formatReviewDate = (dateStr) => {
      if (!dateStr) return 'Unknown time';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    const submitRating = () => {
      if (!newRating.value) {
        submitError.value = true;
        setTimeout(() => submitError.value = false, 3000);
        return;
      }

      submitting.value = true;
      submitError.value = false;

      reviewStore.addReview(
        eventId,
        authStore.user.email,
        Number(newRating.value),
        newComment.value,
        new Date().toISOString()
      );

      setTimeout(() => {
        newRating.value = '';
        newComment.value = '';
        submitting.value = false;
        alert('Review submitted successfully. Thank you for your feedback!');
      }, 500);
    };

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
      formatReviewDate
    };
  }
};
</script>

<style scoped>
.border {
  transition: all 0.2s ease;
}
.border:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
