<!-- eslint-disable vue/multi-word-component-names -->
<!-- views/Events.vue -->
<template>
  <div class="container py-5">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h1 class="display-5 fw-bold">健康慈善活动</h1>
      <p class="text-muted">参与有益的健康活动，为社区贡献力量</p>
    </div>

    <!-- 活动筛选器 -->
    <div class="card mb-5 shadow-sm">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input
              type="text"
              v-model="searchKeyword"
              class="form-control"
              placeholder="搜索活动名称..."
            >
          </div>
          <div class="col-md-4">
            <select v-model="filterDate" class="form-select">
              <option value="">所有日期</option>
              <option value="upcoming">即将开始</option>
              <option value="past">历史活动</option>
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="filterRating" class="form-select">
              <option value="">所有评分</option>
              <option value="4+">4分及以上</option>
              <option value="3+">3分及以上</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="row g-4">
      <!-- 无活动时显示 -->
      <div v-if="filteredEvents.length === 0" class="col-12 text-center py-5">
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>未找到符合条件的活动
        </div>
      </div>

      <!-- 活动卡片 -->
      <div
        class="col-md-6 col-lg-4"
        v-for="event in filteredEvents"
        :key="event.id"
      >
        <div class="card h-100 shadow-sm hover-shadow">
          <!-- 活动封面图 -->
          <div class="event-img-container">
            <img
              :src="event.imageUrl"
              :alt="event.title"
              class="card-img-top"
            >
          </div>

          <div class="card-body">
            <!-- 活动标题和日期 -->
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title">{{ event.title }}</h5>
              <span class="badge bg-primary">{{ formatDate(event.date) }}</span>
            </div>

            <!-- 评分 -->
            <div class="d-flex align-items-center mb-3">
              <Rating :score="eventRating(event.id).average" :readonly="true" />
              <span class="ms-2 text-muted small">({{ eventRating(event.id).count }})</span>
            </div>

            <!-- 活动简介 -->
            <p class="card-text text-muted">
              {{ event.description.substring(0, 80) }}...
            </p>

            <!-- 活动地点 -->
            <p class="card-text small">
              <i class="fas fa-map-marker-alt text-info me-1"></i>
              {{ event.location }}
            </p>
          </div>

          <!-- 查看详情按钮 -->
          <div class="card-footer bg-transparent">
            <router-link
              :to="`/event/${event.id}`"
              class="btn btn-outline-primary w-100"
            >
              查看详情
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
    // 活动数据（实际项目中可从API获取）
    const allEvents = ref([
      {
        id: 'event-1',
        title: '健康讲座：预防心血管疾病',
        date: '2023-06-15',
        location: '社区活动中心',
        description: '本次讲座将由心血管专家张教授主讲，内容包括心血管疾病的预防、早期症状识别以及健康生活方式建议。适合各年龄段人群参加。',
        imageUrl: 'https://picsum.photos/seed/health1/400/200' // 示例图片
      },
      {
        id: 'event-2',
        title: '社区义诊活动',
        date: '2023-06-20',
        location: '社区广场',
        description: '由市立医院组织的义诊活动，提供免费血压、血糖检测，以及内科、外科、眼科等基本检查。欢迎居民前来参加。',
        imageUrl: 'https://picsum.photos/seed/health2/400/200' // 示例图片
      },
      {
        id: 'event-3',
        title: '青少年心理健康讲座',
        date: '2023-07-05',
        location: '市青少年活动中心',
        description: '针对青少年常见心理问题（如学业压力、社交焦虑）的专题讲座，由专业心理咨询师主讲。',
        imageUrl: 'https://picsum.photos/seed/health3/400/200' // 示例图片
      }
    ]);

    // 筛选条件
    const searchKeyword = ref(''); // 搜索关键词
    const filterDate = ref(''); // 日期筛选（upcoming/past）
    const filterRating = ref(''); // 评分筛选（4+/3+）

    // 引入评分数据
    const reviewStore = useReviewStore();
    const eventRating = (eventId) => {
      return reviewStore.getEventRating(eventId);
    };

    // 格式化日期（仅显示月/日）
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    };

    // 筛选活动列表
    const filteredEvents = computed(() => {
      return allEvents.value.filter(event => {
        // 1. 搜索关键词筛选
        const matchesSearch = event.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                             event.description.toLowerCase().includes(searchKeyword.value.toLowerCase());

        // 2. 日期筛选
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 忽略时间，只比较日期
        let matchesDate = true;

        if (filterDate.value === 'upcoming') {
          matchesDate = eventDate >= today; // 即将开始（今天及以后）
        } else if (filterDate.value === 'past') {
          matchesDate = eventDate < today; // 历史活动（今天以前）
        }

        // 3. 评分筛选
        const rating = eventRating(event.id).average;
        let matchesRating = true;

        if (filterRating.value === '4+') {
          matchesRating = rating >= 4;
        } else if (filterRating.value === '3+') {
          matchesRating = rating >= 3;
        }

        // 所有条件都满足才显示
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
