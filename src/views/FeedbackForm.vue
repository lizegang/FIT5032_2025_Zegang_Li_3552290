<template>
  <div class="feedback-form">
    <h3>Submit Feedback</h3>
    <textarea
      v-model="feedbackContent"
      placeholder="Please enter your feedback..."
      rows="4"
      class="form-control mb-3"
      required
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
import { sendEmail } from '../services/email.service' // 使用云函数服务

export default {
  setup() {
    const feedbackContent = ref('')
    const userEmail = ref('')
    const isSubmitting = ref(false)
    const message = ref('')
    const messageType = ref('')
    const router = useRouter()

    const submitFeedback = async () => {
      if (!feedbackContent.value.trim()) {
        message.value = 'Please enter your feedback'
        messageType.value = 'alert-danger'
        return
      }

      isSubmitting.value = true
      message.value = ''

      try {
        // 使用云函数发送反馈到管理员邮箱
        const adminEmail = 'admin@healthplatform.com'
        const result = await sendEmail(
          adminEmail,
          'New User Feedback',
          `<p>From: ${userEmail.value || 'Anonymous'}</p><p>${feedbackContent.value}</p>`,
        )

        if (result.success) {
          message.value = 'Feedback submitted successfully! Thank you.'
          messageType.value = 'alert-success'
          feedbackContent.value = ''
          userEmail.value = ''

          // 3秒后跳回首页
          setTimeout(() => router.push('/'), 3000)
        } else {
          message.value = 'Failed to submit feedback: ' + result.error
          messageType.value = 'alert-danger'
        }
      } catch (error) {
        message.value = 'Error: ' + error.message
        messageType.value = 'alert-danger'
      } finally {
        isSubmitting.value = false
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
