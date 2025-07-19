<!-- eslint-disable vue/multi-word-component-names -->
<!-- components/Rating.vue -->
<template>
  <div class="rating">
    <span
      v-for="i in 5"
      :key="i"
      class="rating-star"
      :class="{ 'text-warning': i <= score }"
      @click="updateRating(i)"
      @mouseover="hoverRating(i)"
      @mouseout="hoverRating(0)"
      :title="`${i} Stars`"
    >
      <i class="fas fa-star"></i>
    </span>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  props: {
    score: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const hoverScore = ref(0);

    const displayScore = computed(() => {
      return hoverScore.value > 0 ? hoverScore.value : props.score;
    });

    const updateRating = (newScore) => {
      if (!props.readonly) {
        emit('update', newScore);
      }
    };

    const hoverRating = (score) => {
      if (!props.readonly) {
        hoverScore.value = score;
      }
    };

    return {
      displayScore,
      updateRating,
      hoverRating
    };
  }
};
</script>

<style scoped>
.rating {
  display: inline-flex;
  font-size: 1.5rem;
}

.rating-star {
  cursor: pointer;
  transition: color 0.2s;
}

.rating-star:hover {
  transform: scale(1.1);
}
</style>
