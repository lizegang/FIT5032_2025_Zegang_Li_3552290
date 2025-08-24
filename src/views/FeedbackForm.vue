<template>
  <div class="feedback-form">
    <h3>Submit Feedback</h3>
    <textarea
      v-model="feedbackContent"
      placeholder="Please enter your feedback..."
      rows="4"
      class="form-control mb-3"
    ></textarea>

    <input
      v-model="userEmail"
      type="email"
      placeholder="Your email address (optional)"
      class="form-control mb-3"
    />

    <button @click="submitFeedback" class="btn btn-primary" :disabled="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
    </button>

    <div v-if="message" class="mt-3 alert" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const feedbackContent = ref('')
    const userEmail = ref('')
    const isSubmitting = ref(false)
    const message = ref('')
    const messageType = ref('')
    const router = useRouter()
    // 在 FeedbackForm.vue 的 submitFeedback 函数中，成功后添加跳转
    const submitFeedback = async () => {
      try {
        const response = await fetch('https://bookcoufunction-oluquikswb.cn-hongkong.fcapp.run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: feedbackContent.value, email: userEmail.value }),
        })
        const result = await response.json()

        if (result.success) {
          message.value = result.message
          messageType.value = 'alert-success'
          feedbackContent.value = ''
          userEmail.value = ''

          // 新增：3秒后自动跳转到首页
          setTimeout(() => {
            router.push('/') // 跳转到首页
          }, 3000)
        } else {
          message.value = result.message
          messageType.value = 'alert-danger'
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // 错误处理
      }
    }

    return {
      feedbackContent,
      userEmail,
      isSubmitting,
      message,
      messageType,
      submitFeedback,
    }
  },
}
</script>

<style scoped>
.feedback-form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
}
</style>
