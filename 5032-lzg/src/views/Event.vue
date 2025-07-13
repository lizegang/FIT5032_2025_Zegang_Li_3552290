<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card shadow-lg">
          <!-- 活动标题区域 -->
          <div class="card-header bg-info text-white">
            <h2>{{ event.title }}</h2>
          </div>

          <!-- 活动详情区域 -->
          <div class="card-body">
            <div class="mb-4">
              <!-- 活动评分展示 -->
              <div class="d-flex align-items-center mb-3">
                <span class="me-2">平均评分：</span>
                <span class="badge bg-warning text-dark">
                  {{ eventRating.average || '暂无评分' }}
                </span>
                <span class="ms-2 text-muted">({{ eventRating.count }} 人评价)</span>
              </div>

              <!-- 活动基本信息 -->
              <p class="text-muted">
                <i class="fas fa-calendar-alt me-2"></i>活动日期: {{ event.date }}
              </p>

              <p class="text-muted">
                <i class="fas fa-map-marker-alt me-2"></i>活动地点: {{ event.location }}
              </p>

              <!-- 活动详情描述 -->
              <div class="mt-4">
                <h4>活动详情</h4>
                <p class="mt-2">{{ event.description }}</p>
              </div>
            </div>

            <!-- 评分表单 (仅登录用户可见) -->
            <div v-if="isAuthenticated" class="mb-4 p-4 bg-light rounded">
              <h4 class="mb-3">发表您的评价</h4>

              <!-- 评分选择区域（下拉列表） -->
              <div class="mb-4">
                <label class="form-label fw-medium">请选择评分：</label>
                <select
                  v-model="newRating"
                  class="form-select w-50 mt-1"
                  :disabled="submitting"
                >
                  <option value="">-- 选择评分 --</option>
                  <option value="1">1星（很差）</option>
                  <option value="2">2星（一般）</option>
                  <option value="3">3星（良好）</option>
                  <option value="4">4星（优秀）</option>
                  <option value="5">5星（极佳）</option>
                </select>

                <!-- 评分选择反馈 -->
                <div v-if="newRating > 0" class="mt-2 text-success small">
                  <i class="fas fa-check-circle"></i> 已选择 {{ newRating }} 星
                </div>
                <div v-if="submitError && !newRating" class="mt-2 text-danger small">
                  <i class="fas fa-exclamation-circle"></i> 请先选择评分
                </div>
              </div>

              <!-- 评论输入区域 -->
              <div>
                <label class="form-label fw-medium">评价内容：</label>
                <textarea
                  v-model="newComment"
                  class="form-control mt-1"
                  rows="3"
                  placeholder="分享您参加活动的体验和感受..."
                  :disabled="submitting"
                ></textarea>
              </div>

              <!-- 提交按钮 -->
              <button
                class="btn btn-primary mt-3"
                @click="submitRating"
                :disabled="!newRating || submitting"
              >
                {{ submitting ? '提交中...' : '提交评价' }}
              </button>
            </div>

            <!-- 未登录提示 -->
            <div v-else class="mb-4 p-4 bg-light rounded">
              <p class="text-muted">
                <i class="fas fa-info-circle me-2"></i>
                <router-link to="/login" class="text-primary">登录</router-link> 后可以发表评价
              </p>
            </div>

            <!-- 评价列表 -->
            <div class="mt-5">
              <h4>用户评价 ({{ eventRating.count }})</h4>

              <!-- 无评价时显示 -->
              <div v-if="eventReviews.length === 0" class="mt-3 p-3 bg-light rounded text-center">
                <p class="text-muted mb-0">暂无评价，快来成为第一个评价的人吧！</p>
              </div>

              <!-- 评价列表 - 添加空值检查 -->
              <div
                v-for="(review, index) in eventReviews"
                :key="index"
                class="mt-3 p-3 border rounded"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <!-- 添加空值检查 -->
                    <strong>{{ review.user ? review.user.split('@')[0] : '匿名用户' }}</strong>
                    <span class="ms-2 badge bg-warning text-dark">
                      {{ review.score }}星
                    </span>
                  </div>
                  <span class="text-muted small">
                    {{ formatReviewDate(review.createdAt) }}
                  </span>
                </div>
                <p class="mt-2">{{ review.comment || '无评价内容' }}</p>
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
    // 状态管理
    const authStore = useAuthStore();
    const reviewStore = useReviewStore();
    const route = useRoute();
    const eventId = route.params.id; // 获取当前活动ID

    // 评价表单状态
    const newRating = ref(''); // 评分（1-5，初始为空）
    const newComment = ref(''); // 评论内容
    const submitting = ref(false); // 提交状态
    const submitError = ref(false); // 提交错误提示

    // 获取活动详情（模拟数据）
    const event = computed(() => {
      const events = {
        'event-1': {
          id: 'event-1',
          title: '健康讲座：预防心血管疾病',
          date: '2023-06-15',
          location: '社区活动中心一楼大厅',
          description: '本次讲座将由市医院心血管专家张教授主讲，内容包括心血管疾病的预防知识、早期症状识别方法以及健康生活方式建议。讲座适合各年龄段人群参加，现场将提供免费血压测量服务，并发放健康宣传手册。'
        },
        'event-2': {
          id: 'event-2',
          title: '社区义诊活动',
          date: '2023-06-20',
          location: '社区广场',
          description: '由市立医院组织的大型义诊活动，将有内科、外科、眼科、儿科等多个科室的医生现场坐诊，提供免费血压、血糖检测，以及常见疾病的咨询和诊断服务。'
        }
      };
      return events[eventId] || {
        id: eventId,
        title: '活动信息',
        date: '2023-06-01',
        location: '未知',
        description: '暂无活动详情'
      };
    });

    // 获取活动评分
    const eventRating = computed(() => {
      const eventReviews = reviewStore.reviews[eventId] || [];
      const count = eventReviews.length;
      const average = count > 0
        ? (eventReviews.reduce((sum, review) => sum + Number(review.score), 0) / count).toFixed(1)
        : '0';
      return { count, average };
    });

    // 获取活动评价列表
    const eventReviews = computed(() => {
      return reviewStore.reviews[eventId] || [];
    });

    // 格式化评价日期
    const formatReviewDate = (dateStr) => {
      if (!dateStr) return '未知时间';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    // 提交评价 - 关键修改：将评分转换为数字类型
    const submitRating = () => {
      // 验证评分
      if (!newRating.value) {
        submitError.value = true;
        // 3秒后自动隐藏错误提示
        setTimeout(() => submitError.value = false, 3000);
        return;
      }

      submitting.value = true;
      submitError.value = false;

      // 关键修改：将评分转换为数字类型
      reviewStore.addReview(
        eventId,
        authStore.user.email,
        Number(newRating.value), // 确保评分是数字类型
        newComment.value,
        new Date().toISOString() // 添加评价时间
      );

      // 重置表单
      setTimeout(() => {
        newRating.value = '';
        newComment.value = '';
        submitting.value = false;
        alert('评价提交成功，感谢您的反馈！');
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
/* 评价列表悬停效果 */
.border {
  transition: all 0.2s ease;
}
.border:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
