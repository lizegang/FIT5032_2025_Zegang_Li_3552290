<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div class="data-table-container">
    <!-- 搜索框 -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Search all columns..."
            v-model="globalSearch"
            aria-label="Search all columns"
          />
        </div>
      </div>
    </div>

    <!-- 按列搜索 -->
    <div class="row mb-4" v-if="columns.length">
      <div class="col-md-12">
        <div class="row g-3">
          <div
            class="col"
            v-for="(column, index) in columns"
            :key="index"
            
            v-if="column.searchable !== false"
          >
            <input
              type="text"
              class="form-control"
              :placeholder="`Search ${column.label}...`"
              v-model="columnSearch[index]"
              :aria-label="`Search ${column.label}`"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              @click="sortBy(index)"
              class="sortable-header"
              :aria-sort="
                sortColumn === index
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              "
            >
              {{ column.label }}
              <i
                class="fas"
                :class="
                  sortColumn === index
                    ? sortDirection === 'asc'
                      ? 'fa-sort-up'
                      : 'fa-sort-down'
                    : 'fa-sort'
                "
              ></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
            <td v-for="(column, colIndex) in columns" :key="colIndex">
              <template v-if="column.render">
                <component :is="column.render" :row="row" :column="column"></component>
              </template>
              <template v-else>
                {{ getCellValue(row, column.field) }}
              </template>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td :colspan="columns.length" class="text-center">No data available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="d-flex justify-content-between align-items-center mt-4">
      <div class="text-muted">
        Showing {{ paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of
        {{ filteredData.length }} results
      </div>
      <nav>
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage = 1" aria-label="First">
              <span aria-hidden="true">&laquo;&laquo;</span>
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li
            class="page-item"
            :class="{ active: currentPage === page }"
            v-for="page in pageNumbers"
            :key="page"
          >
            <button class="page-link" @click="currentPage = page">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage = totalPages" aria-label="Last">
              <span aria-hidden="true">&raquo;&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'DataTable',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    columns: {
      type: Array,
      required: true,
      default: () => [],
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  setup(props) {
    // 状态
    const globalSearch = ref('')
    const columnSearch = ref({})
    const sortColumn = ref(null)
    const sortDirection = ref('asc')
    const currentPage = ref(1)

    // 初始化列搜索
    watch(
      () => props.columns,
      (newColumns) => {
        const newColumnSearch = {}
        newColumns.forEach((_, index) => {
          newColumnSearch[index] = ''
        })
        columnSearch.value = newColumnSearch
      },
      { immediate: true },
    )

    // 获取单元格值
    const getCellValue = (row, field) => {
      if (typeof field === 'function') {
        return field(row)
      }

      // 处理嵌套字段
      return field.split('.').reduce((obj, key) => {
        return obj && obj[key] !== undefined ? obj[key] : ''
      }, row)
    }

    // 过滤数据
    const filteredData = computed(() => {
      return props.data.filter((row) => {
        // 全局搜索
        const matchesGlobal =
          globalSearch.value === '' ||
          // eslint-disable-next-line no-unused-vars
          props.columns.some((column, colIndex) => {
            const value = getCellValue(row, column.field).toString().toLowerCase()
            return value.includes(globalSearch.value.toLowerCase())
          })

        if (!matchesGlobal) return false

        // 按列搜索
        return props.columns.every((column, colIndex) => {
          const searchTerm = columnSearch.value[colIndex] || ''
          if (searchTerm === '' || column.searchable === false) return true

          const value = getCellValue(row, column.field).toString().toLowerCase()
          return value.includes(searchTerm.toLowerCase())
        })
      })
    })

    // 排序数据
    const sortedData = computed(() => {
      if (sortColumn.value === null) return filteredData.value

      const column = props.columns[sortColumn.value]
      return [...filteredData.value].sort((a, b) => {
        const valueA = getCellValue(a, column.field)
        const valueB = getCellValue(b, column.field)

        // 处理日期
        if (column.type === 'date') {
          return new Date(valueA) - new Date(valueB)
        }

        // 处理数字
        if (column.type === 'number') {
          return Number(valueA) - Number(valueB)
        }

        // 默认字符串比较
        const strA = valueA.toString().toLowerCase()
        const strB = valueB.toString().toLowerCase()

        if (strA < strB) return sortDirection.value === 'asc' ? -1 : 1
        if (strA > strB) return sortDirection.value === 'asc' ? 1 : -1
        return 0
      })
    })

    // 分页数据
    const paginatedData = computed(() => {
      const startIndex = (currentPage.value - 1) * props.itemsPerPage
      return sortedData.value.slice(startIndex, startIndex + props.itemsPerPage)
    })

    // 总页数
    const totalPages = computed(() => {
      return Math.ceil(filteredData.value.length / props.itemsPerPage) || 1
    })

    // 生成页码
    const pageNumbers = computed(() => {
      const pages = []
      const maxVisiblePages = 5

      if (totalPages.value <= maxVisiblePages) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        // 显示当前页附近的页码
        let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
        let endPage = startPage + maxVisiblePages - 1

        if (endPage > totalPages.value) {
          endPage = totalPages.value
          startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }
      }

      return pages
    })

    // 排序方法
    const sortBy = (columnIndex) => {
      if (sortColumn.value === columnIndex) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortColumn.value = columnIndex
        sortDirection.value = 'asc'
      }
    }

    // 监听数据变化，重置分页
    watch(
      () => filteredData.value,
      () => {
        currentPage.value = 1
      },
    )

    return {
      globalSearch,
      columnSearch,
      sortColumn,
      sortDirection,
      currentPage,
      getCellValue,
      filteredData,
      sortedData,
      paginatedData,
      totalPages,
      pageNumbers,
      sortBy,
    }
  },
}
</script>

<style scoped>
.sortable-header {
  cursor: pointer;
  user-select: none;
}

.sortable-header i {
  margin-left: 5px;
  opacity: 0.7;
}

.data-table-container {
  padding: 1rem;
}

.page-link {
  cursor: pointer;
}

.table-responsive {
  overflow-x: auto;
}
</style>
