// src/storage-demo.js
// eslint-disable-next-line no-unused-vars
import { ref, computed, onMounted, watchEffect } from 'vue'
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './store/authStore'

export default {
  setup() {
    const newItem = ref('')
    const items = ref([])
    const loading = ref(true)
    const lastUpdated = ref('Never updated')
    const authStore = useAuthStore()

    const totalItems = computed(() => items.value.length)
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    // 加载用户的待办项
    const loadItems = async () => {
      if (!authStore.user) return
      loading.value = true
      try {
        const q = query(collection(db, `users/${authStore.user.uid}/todos`))
        const querySnapshot = await getDocs(q)
        items.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        if (items.value.length > 0) {
          const lastItemDate = new Date(items.value[items.value.length - 1].createdAt)
          lastUpdated.value = lastItemDate.toLocaleString()
        }
      } catch (error) {
        console.error('Error loading todos:', error)
      } finally {
        loading.value = false
      }
    }

    const addItem = async () => {
      if (!newItem.value.trim() || !authStore.user) return

      try {
        const docRef = await addDoc(collection(db, `users/${authStore.user.uid}/todos`), {
          text: newItem.value.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        })

        items.value.push({
          id: docRef.id,
          text: newItem.value.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        })

        newItem.value = ''
        lastUpdated.value = new Date().toLocaleString()
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    }

    const removeItem = async (id) => {
      try {
        await deleteDoc(doc(db, `users/${authStore.user.uid}/todos`, id))
        items.value = items.value.filter((item) => item.id !== id)
        lastUpdated.value = new Date().toLocaleString()
      } catch (error) {
        console.error('Error removing todo:', error)
      }
    }

    const toggleComplete = async (id) => {
      const item = items.value.find((i) => i.id === id)
      if (!item) return

      try {
        const docRef = doc(db, `users/${authStore.user.uid}/todos`, id)
        await updateDoc(docRef, {
          completed: !item.completed,
        })
        item.completed = !item.completed
        lastUpdated.value = new Date().toLocaleString()
      } catch (error) {
        console.error('Error updating todo:', error)
      }
    }

    const clearAll = async () => {
      if (!confirm('Are you sure you want to clear all items?') || !authStore.user) return

      try {
        const q = query(collection(db, `users/${authStore.user.uid}/todos`))
        const querySnapshot = await getDocs(q)
        // 使用Promise.all确保所有删除操作完成
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            await deleteDoc(doc.ref)
          }),
        )
        items.value = []
        lastUpdated.value = new Date().toLocaleString()
      } catch (error) {
        console.error('Error clearing todos:', error)
      }
    }

    // 监听认证状态变化，加载对应的待办项
    watchEffect(() => {
      if (authStore.isAuthenticated) {
        loadItems()
      } else {
        items.value = []
      }
    })

    return {
      newItem,
      items,
      totalItems,
      lastUpdated,
      loading,
      isAuthenticated,
      addItem,
      removeItem,
      toggleComplete,
      clearAll,
    }
  },
  template: `
    <div class="storage-demo container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg mb-4">
            <div class="card-header bg-primary text-white">
              <h2 class="mb-0">Firebase Todo Demo</h2>
            </div>
            <div class="card-body">
              <div class="input-group mb-4">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="newItem"
                  placeholder="Enter a to-do item..."
                  @keyup.enter="addItem"
                  :disabled="!isAuthenticated"
                >
                <button class="btn btn-primary btn-lg" @click="addItem" :disabled="!isAuthenticated">
                  <i class="fas fa-plus me-2"></i>Add
                </button>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="stats">
                  <span class="badge bg-info me-2">Total Items: {{ totalItems }}</span>
                  <span class="badge bg-secondary">Last Updated: {{ lastUpdated }}</span>
                </div>
                <button class="btn btn-danger btn-sm" @click="clearAll" :disabled="!isAuthenticated">
                  <i class="fas fa-trash me-1"></i>Clear All
                </button>
              </div>

              <div class="list-group">
                <div v-if="loading" class="text-center py-4">
                  <i class="fas fa-spinner fa-spin"></i> Loading items...
                </div>

                <div v-else-if="!isAuthenticated" class="text-center py-4 text-muted">
                  <p>Please log in to manage your todos</p>
                </div>

                <div
                  v-else-if="items.length > 0"
                  v-for="item in items"
                  :key="item.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div class="d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input me-3"
                      :checked="item.completed"
                      @change="toggleComplete(item.id)"
                    >
                    <span :class="{ 'text-decoration-line-through text-muted': item.completed }">
                      {{ item.text }}
                    </span>
                  </div>
                  <button class="btn btn-sm btn-outline-danger" @click="removeItem(item.id)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>

                <div v-else class="text-center py-4 text-muted">
                  <i class="fas fa-clipboard-list fa-3x mb-3"></i>
                  <h5>No to-do items</h5>
                  <p>Please add your first item</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-lg">
            <div class="card-header bg-info text-white">
              <h3 class="mb-0">Implementation Principle</h3>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  Uses Firebase Firestore for cloud storage
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  Real-time synchronization with cloud database
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  Data is securely tied to user accounts
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  All operations automatically update cloud storage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .storage-demo .card {
      border-radius: 15px;
      overflow: hidden;
    }

    .storage-demo .list-group-item {
      transition: all 0.3s;
    }

    .storage-demo .list-group-item:hover {
      background-color: #f8f9fa;
    }

    .storage-demo .form-check-input {
      width: 1.5em;
      height: 1.5em;
    }
  `,
}
