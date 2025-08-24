<template>
  <div class="bulk-email-form">
    <div class="card">
      <div class="card-header">
        <h3>Bulk Email Sender</h3>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="emailSubject" class="form-label">Subject</label>
          <input
            type="text"
            class="form-control"
            id="emailSubject"
            v-model="emailSubject"
            required
            aria-required="true"
            aria-describedby="subjectHelp"
          />
          <div id="subjectHelp" class="form-text">Enter the email subject</div>
        </div>

        <div class="mb-3">
          <label for="emailContent" class="form-label">Email Content</label>
          <textarea
            class="form-control"
            id="emailContent"
            v-model="emailContent"
            rows="6"
            required
            aria-required="true"
            aria-describedby="contentHelp"
          ></textarea>
          <div id="contentHelp" class="form-text">Enter the email content (HTML supported)</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Recipients</label>
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="selectAll"
              v-model="selectAll"
              @change="toggleSelectAll"
              aria-label="Select all users"
            />
            <label class="form-check-label" for="selectAll"> Select all users </label>
          </div>

          <div class="mt-2 recipients-list">
            <div class="form-check" v-for="(user, index) in users" :key="index">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`user-${index}`"
                v-model="user.selected"
                aria-label="Select user"
              />
              <label class="form-check-label" :for="`user-${index}`">
                {{ user.name }} ({{ user.email }})
              </label>
            </div>
          </div>

          <div class="mt-2">
            <small class="text-muted"> Selected: {{ selectedCount }} of {{ users.length }} </small>
          </div>
        </div>

        <div
          v-if="message"
          class="alert"
          :class="message.type === 'success' ? 'alert-success' : 'alert-danger'"
        >
          {{ message.text }}
        </div>

        <button
          class="btn btn-primary"
          @click="sendBulkEmail"
          :disabled="!canSend || sending"
          aria-label="Send bulk email"
        >
          {{ sending ? 'Sending...' : `Send to ${selectedCount} Recipients` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { sendBulkEmail } from '../../services/email.service'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuthStore } from '../../store/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'BulkEmailForm',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const users = ref([])
    const selectAll = ref(false)
    const emailSubject = ref('')
    const emailContent = ref('')
    const sending = ref(false)
    const message = ref(null)

    // 检查是否可以发送邮件
    const canSend = computed(() => {
      return (
        emailSubject.value.trim() !== '' &&
        emailContent.value.trim() !== '' &&
        selectedCount.value > 0
      )
    })

    // 选中的用户数量
    const selectedCount = computed(() => {
      return users.value.filter((user) => user.selected).length
    })

    // 获取用户列表
    const fetchUsers = async () => {
      try {
        // 检查用户是否为管理员
        if (!authStore.isAdmin) {
          router.push('/')
          return
        }

        const usersSnapshot = await getDocs(collection(db, 'users'))
        users.value = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          selected: false,
        }))
      } catch (error) {
        console.error('Error fetching users:', error)
        message.value = {
          type: 'error',
          text: 'Failed to load users: ' + error.message,
        }
      }
    }

    // 全选/取消全选
    const toggleSelectAll = () => {
      users.value.forEach((user) => {
        user.selected = selectAll.value
      })
    }

    // 发送批量邮件
    const sendBulkEmail = async () => {
      if (!canSend.value) return

      const recipients = users.value.filter((user) => user.selected).map((user) => user.email)

      sending.value = true
      message.value = null

      try {
        const result = await sendBulkEmail(recipients, emailSubject.value, emailContent.value)

        if (result.success) {
          message.value = {
            type: 'success',
            text: `Successfully sent emails to ${recipients.length} recipients`,
          }

          // 重置表单
          emailSubject.value = ''
          emailContent.value = ''
          users.value.forEach((user) => {
            user.selected = false
          })
          selectAll.value = false
        } else {
          message.value = {
            type: 'error',
            text: 'Failed to send emails: ' + result.error,
          }
        }
      } catch (error) {
        message.value = {
          type: 'error',
          text: 'An error occurred: ' + error.message,
        }
        console.error(error)
      } finally {
        sending.value = false
      }
    }

    onMounted(() => {
      // 确保用户已登录且是管理员
      if (!authStore.isAuthenticated) {
        router.push('/login')
      } else if (!authStore.isAdmin) {
        router.push('/')
      } else {
        fetchUsers()
      }
    })

    return {
      users,
      selectAll,
      emailSubject,
      emailContent,
      sending,
      message,
      canSend,
      selectedCount,
      toggleSelectAll,
      sendBulkEmail,
    }
  },
}
</script>

<style scoped>
.bulk-email-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.recipients-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
}

.form-check {
  margin-bottom: 0.5rem;
}
</style>
