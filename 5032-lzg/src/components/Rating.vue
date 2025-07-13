<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="rating">
    <span
      v-for="i in 5"
      :key="i"
      class="rating-star"
      :class="{ 'text-warning': i <= score }"
      @click="update(i)"
      @mouseover="hover(i)"
      @mouseout="hover(0)"
      :style="{ cursor: readonly ? 'default' : 'pointer' }"
    >
      <i class="fas fa-star"></i>
    </span>
  </div>
</template>

<script>
import { ref } from 'vue';
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

    const getDisplayScore = () => {
      return hoverScore.value > 0 ? hoverScore.value : props.score;
    };

    const update = (newScore) => {
      if (!props.readonly) {
        emit('update', newScore);
      }
    };

    const hover = (score) => {
      if (!props.readonly) {
        hoverScore.value = score;
      }
    };

    return {
      getDisplayScore,
      update,
      hover
    };
  }
};
</script>

<style scoped>
.rating {
  display: inline-flex;
}

.rating-star {
  font-size: 1.5rem;
  transition: color 0.2s;
}
</style>
