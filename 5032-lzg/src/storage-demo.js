import { ref, computed, onMounted } from 'vue'
import { useStorage } from './services/storage'

export default {
  setup() {
    const newItem = ref('')
    const items = useStorage('todoItems', [])

    const totalItems = computed(() => items.value.length)

    const lastUpdated = ref('Never updated')

    const addItem = () => {
      if (newItem.value.trim()) {
        items.value.push({
          id: Date.now(),
          text: newItem.value.trim(),
          completed: false,
          createdAt: new Date().toISOString()
        })
        newItem.value = ''
        lastUpdated.value = new Date().toLocaleString()
      }
    }

    const removeItem = (index) => {
      items.value.splice(index, 1)
      lastUpdated.value = new Date().toLocaleString()
    }

    const toggleComplete = (index) => {
      items.value[index].completed = !items.value[index].completed
      lastUpdated.value = new Date().toLocaleString()
    }

    const clearAll = () => {
      if (confirm('Are you sure you want to clear all items?')) {
        items.value = []
        lastUpdated.value = new Date().toLocaleString()
      }
    }

    onMounted(() => {
      if (items.value.length > 0) {
        const lastItemDate = new Date(items.value[items.value.length - 1].createdAt)
        lastUpdated.value = lastItemDate.toLocaleString()
      }
    })

    return {
      newItem,
      items,
      totalItems,
      lastUpdated,
      addItem,
      removeItem,
      toggleComplete,
      clearAll
    }
  },
  template: `
    <div class="storage-demo container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg mb-4">
            <div class="card-header bg-primary text-white">
              <h2 class="mb-0">Responsive localStorage Demo</h2>
            </div>
            <div class="card-body">
              <div class="input-group mb-4">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="newItem"
                  placeholder="Enter a to-do item..."
                  @keyup.enter="addItem"
                >
                <button class="btn btn-primary btn-lg" @click="addItem">
                  <i class="fas fa-plus me-2"></i>Add
                </button>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="stats">
                  <span class="badge bg-info me-2">Total Items: {{ totalItems }}</span>
                  <span class="badge bg-secondary">Last Updated: {{ lastUpdated }}</span>
                </div>
                <button class="btn btn-danger btn-sm" @click="clearAll">
                  <i class="fas fa-trash me-1"></i>Clear All
                </button>
              </div>

              <div class="list-group">
                <div
                  v-for="(item, index) in items"
                  :key="item.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div class="d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input me-3"
                      :checked="item.completed"
                      @change="toggleComplete(index)"
                    >
                    <span :class="{ 'text-decoration-line-through text-muted': item.completed }">
                      {{ item.text }}
                    </span>
                  </div>
                  <button class="btn btn-sm btn-outline-danger" @click="removeItem(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>

                <div v-if="items.length === 0" class="text-center py-4 text-muted">
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
                  Use the <code>useStorage</code> custom hook to create a responsive localStorage reference
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  Vue's <code>watch</code> function monitors data changes and automatically synchronizes them to localStorage
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  Initialize data from localStorage when the component is loaded
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  All operations automatically update localStorage and the UI
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  Responsive design ensures perfect display on different devices
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
  `
}
