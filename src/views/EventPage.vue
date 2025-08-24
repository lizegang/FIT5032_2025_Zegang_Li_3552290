<!-- src/components/tables/EventsTable.vue -->
<template>
  <div class="card shadow-sm">
    <div
      class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
    >
      <h5 class="mb-0">Health Charity Events</h5>
      <div class="d-flex gap-3">
        <input
          v-model="searchTitle"
          type="text"
          class="form-control form-control-sm"
          placeholder="Search by title..."
          @input="filterTable"
        />
        <input
          v-model="searchLocation"
          type="text"
          class="form-control form-control-sm"
          placeholder="Search by location..."
          @input="filterTable"
        />
        <select v-model="searchStatus" class="form-select form-select-sm" @change="filterTable">
          <option value="">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
    <div class="card-body p-0">
      <table id="eventsTable" class="table table-striped table-hover w-100">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Event Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Organizer</th>
            <th>Participants</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <!-- 导出按钮 -->
    <div class="card-footer d-flex justify-content-end gap-2">
      <button class="btn btn-primary btn-sm" @click="exportCSV">exportCSV</button>
      <button class="btn btn-secondary btn-sm" @click="exportPDF">exportPDF</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import $ from 'jquery' // 仅导入 jQuery，无需导入 DataTables
import eventsMock from '@/mock/events-mock.json'
import { exportToCSV, exportToPDF } from '@/services/export.service'

export default {
  name: 'EventsTable',
  setup() {
    const searchTitle = ref('')
    const searchLocation = ref('')
    const searchStatus = ref('')
    let eventsTableInstance = null

    const initTable = () => {
      if (eventsTableInstance) {
        eventsTableInstance.destroy()
      }

      // 此时 $.fn.DataTable 已全局可用（来自 main.js 全局引入）
      eventsTableInstance = $('#eventsTable').DataTable({
        data: eventsMock,
        columns: [
          { data: 'id' },
          { data: 'title' },
          { data: 'date' },
          { data: 'location' },
          { data: 'organizer' },
          { data: 'participants' },
          {
            data: 'status',
            render: (data) => {
              const statusClass =
                {
                  Upcoming: 'badge bg-primary',
                  Ongoing: 'badge bg-success',
                  Completed: 'badge bg-secondary',
                }[data] || 'badge bg-dark'
              return `<span class="${statusClass}">${data}</span>`
            },
          },
        ],
        pageLength: 10,
        lengthMenu: [
          [10, 25, 50],
          [10, 25, 50],
        ],
        order: [[2, 'desc']],
        searching: true,
        responsive: true,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        language: {
          paginate: { first: 'First', last: 'Last', next: 'Next', previous: 'Previous' },
          info: 'Showing _START_ to _END_ of _TOTAL_ events',
          lengthMenu: 'Show _MENU_ events per page',
        },
      })
    }

    const filterTable = () => {
      eventsTableInstance
        .column(1)
        .search(searchTitle.value, false, true)
        .column(3)
        .search(searchLocation.value, false, true)
        .column(6)
        .search(searchStatus.value || '', true, false)
        .draw()
    }

    const exportCSV = () => {
      const data = eventsTableInstance.rows({ search: 'applied' }).data().toArray()
      exportToCSV('events', data)
    }

    const exportPDF = () => {
      const data = eventsTableInstance.rows({ search: 'applied' }).data().toArray()
      exportToPDF('events', data)
    }

    onMounted(() => {
      initTable()
    })

    onUnmounted(() => {
      if (eventsTableInstance) {
        eventsTableInstance.destroy()
      }
    })

    return {
      searchTitle,
      searchLocation,
      searchStatus,
      filterTable,
      exportCSV,
      exportPDF,
    }
  },
}
</script>

<style scoped>
.card-body {
  overflow-x: auto;
}
.badge {
  padding: 0.35em 0.65em;
  font-size: 0.85em;
}
.card-footer {
  padding: 10px;
  background-color: #f8f9fa;
}
</style>
