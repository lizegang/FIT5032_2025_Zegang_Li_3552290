<template>
  <div class="rating-system">
    <div class="stars mb-2">
      <span
        v-for="star in 5"
        :key="star"
        @click="rate(star)"
        :class="['star', { 'filled': star <= currentRating }]"
        aria-hidden="true"
      >★</span>
    </div>
    <p v-if="averageRating > 0" class="text-muted">
      Average Rating: {{ averageRating.toFixed(1) }} ({{ ratingCount }} ratings)
    </p>
    <p v-else class="text-muted">No ratings yet</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  itemId: String
})

const ratings = ref(JSON.parse(localStorage.getItem(props.itemId) || [])
const currentRating = ref(0)

// 计算平均分
const averageRating = computed(() => {
  if (ratings.value.length === 0) return 0
  return ratings.value.reduce((sum, rating) => sum + rating, 0) / ratings.value.length
})

const ratingCount = computed(() => ratings.value.length)

// 用户评分
function rate(rating) {
  currentRating.value = rating
  ratings.value.push(rating)
  localStorage.setItem(props.itemId, JSON.stringify(ratings.value))
}

// 防止XSS攻击的清理函数
function sanitizeInput(input) {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}
</script>

<style scoped>
.star {
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}
.star.filled {
  color: #ffc107;
}
.star:hover {
  color: #ffc107;
}
</style>
