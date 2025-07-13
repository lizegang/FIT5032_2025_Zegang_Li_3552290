<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="hero-section text-center mb-5">
      <h1 class="display-4 fw-bold">健康慈善平台</h1>
      <p class="lead text-muted mb-4">连接爱心，共享健康</p>
      <div class="d-flex justify-content-center gap-3">
        <router-link to="/register" class="btn btn-primary btn-lg">
          立即加入
        </router-link>
        <router-link to="/events" class="btn btn-outline-secondary btn-lg">
          浏览活动
        </router-link>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="icon-container mb-3">
              <i class="fas fa-heartbeat text-primary fa-3x"></i>
            </div>
            <h3 class="card-title">健康活动</h3>
            <p class="card-text">参与各类健康讲座、义诊活动，获取专业医疗建议。</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="icon-container mb-3">
              <i class="fas fa-hands-helping text-success fa-3x"></i>
            </div>
            <h3 class="card-title">慈善捐助</h3>
            <p class="card-text">为有需要的人群提供帮助，共同建设健康社区。</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="icon-container mb-3">
              <i class="fas fa-users text-info fa-3x"></i>
            </div>
            <h3 class="card-title">社区互动</h3>
            <p class="card-text">与志同道合的朋友交流健康心得，分享生活经验。</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="text-center mb-4">近期活动</h2>
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
                <span class="badge bg-primary">{{ event.date }}</span>
              </div>
              <p class="card-text">{{ event.description.substring(0, 100) }}...</p>

              <!-- 评分组件 -->
              <div v-if="isAuthenticated" class="mt-3">
                <div class="d-flex align-items-center">
                  <span class="me-2">评价活动:</span>
                  <Rating
                    @update="updateRating(event.id, $event)"
                    :score="getUserReview(event.id)?.score || 0"
                  />
                </div>
                <div v-if="getUserReview(event.id)" class="mt-2 text-success small">
                  <i class="fas fa-check-circle"></i> 您已评价
                </div>
              </div>

              <router-link to={’/event/${event.id}‘} class="btn btn-outline-primary mt-3">
                查看详情
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useReviewStore } from '@/store/reviewStore';
import Rating from '@/components/Rating.vue';

export default {
  components: { Rating },
  setup() {
    const authStore = useAuthStore();
    const reviewStore = useReviewStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const events = computed(() => [
      {
        id: 'event-1',
        title: '健康讲座：预防心血管疾病',
        date: '2023-06-15',
        description: '本次讲座将由心血管专家张教授主讲，内容包括心血管疾病的预防、早期症状识别以及健康生活方式建议。适合各年龄段人群参加。'
      },
      {
        id: 'event-2',
        title: '社区义诊活动',
        date: '2023-06-20',
        description: '由市立医院组织的义诊活动，提供免费血压、血糖检测，以及内科、外科、眼科等基本检查。欢迎居民前来参加。'
      }
    ]);

    const getEventRating = (eventId) => {
      return reviewStore.getEventRating(eventId);
    };

    const getUserReview = (eventId) => {
      if (!isAuthenticated.value) return null;
      return reviewStore.getUserReview(eventId, authStore.user?.email || '');
    };

    const updateRating = (eventId, score) => {
      if (!isAuthenticated.value) {
        alert('请先登录再评价');
        return;
      }

      reviewStore.addReview(
        eventId,
        authStore.user.email,
        score,
        '' // 简化版本，不带评论
      );
    };

    return {
      events,
      getEventRating,
      getUserReview,
      updateRating,
      isAuthenticated
    };
  }
};
</script>
