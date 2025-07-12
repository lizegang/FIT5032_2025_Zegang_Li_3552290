import { ref, computed, onMounted } from 'vue'
import { useStorage } from './services/storage'

export default {
  setup() {
    const newItem = ref('')
    const items = useStorage('todoItems', [])

    const totalItems = computed(() => items.value.length)

    const lastUpdated = ref('从未更新')

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
      if (confirm('确定要清除所有项目吗？')) {
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
              <h2 class="mb-0">响应式 localStorage 演示</h2>
            </div>
            <div class="card-body">
              <div class="input-group mb-4">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="newItem"
                  placeholder="输入待办事项..."
                  @keyup.enter="addItem"
                >
                <button class="btn btn-primary btn-lg" @click="addItem">
                  <i class="fas fa-plus me-2"></i>添加
                </button>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="stats">
                  <span class="badge bg-info me-2">总项目数: {{ totalItems }}</span>
                  <span class="badge bg-secondary">最后更新: {{ lastUpdated }}</span>
                </div>
                <button class="btn btn-danger btn-sm" @click="clearAll">
                  <i class="fas fa-trash me-1"></i>清除全部
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
                  <h5>没有待办事项</h5>
                  <p>请添加您的第一个项目</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-lg">
            <div class="card-header bg-info text-white">
              <h3 class="mb-0">实现原理</h3>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  使用 <code>useStorage</code> 自定义 hook 创建响应式 localStorage 引用
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  Vue 的 <code>watch</code> 函数监听数据变化并自动同步到 localStorage
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  组件加载时从 localStorage 初始化数据
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  所有操作自动更新 localStorage 和 UI
                </li>
                <li class="list-group-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  响应式设计确保在不同设备上完美显示
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
