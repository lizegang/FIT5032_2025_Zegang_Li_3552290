<!-- src/components/tables/UsersTable.vue -->
<template>
  <div class="card shadow-sm">
    <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
      <h5 class="mb-0">User Management</h5>
      <div class="d-flex gap-3">
        <input
          v-model="searchName"
          type="text"
          class="form-control form-control-sm"
          placeholder="Search by name..."
          @input="filterTable"
        />
        <input
          v-model="searchEmail"
          type="text"
          class="form-control form-control-sm"
          placeholder="Search by email..."
          @input="filterTable"
        />
        <select v-model="searchRole" class="form-select form-select-sm" @change="filterTable">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
    </div>
    <div class="card-body p-0">
      <table id="usersTable" class="table table-striped table-hover w-100">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Join Date</th>
            <th>Last Login</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import $ from 'jquery' // 仅导入 jQuery，无需导入 DataTables
import usersMock from '@/mock/users-mock.json'

export default {
  name: 'UsersTable',
  setup() {
    const searchName = ref('')
    const searchEmail = ref('')
    const searchRole = ref('')
    let usersTableInstance = null

    const initTable = () => {
      if (usersTableInstance) {
        usersTableInstance.destroy()
      }

      // 全局 DataTables 已可用
      usersTableInstance = $('#usersTable').DataTable({
        data: usersMock,
        columns: [
          { data: 'id' },
          { data: 'name' },
          {
            data: 'email',
            render: (data) => `<a href="mailto:${data}">${data}</a>`,
          },
          {
            data: 'role',
            render: (data) => {
              const roleClass = data === 'admin' ? 'badge bg-danger' : 'badge bg-primary'
              return `<span class="${roleClass}">${data}</span>`
            },
          },
          { data: 'joinDate' },
          { data: 'lastLogin' },
          {
            data: 'status',
            render: (data) => {
              const statusClass = data === 'Active' ? 'badge bg-success' : 'badge bg-danger'
              return `<span class="${statusClass}">${data}</span>`
            },
          },
        ],
        pageLength: 10,
        lengthMenu: [
          [10, 25, 50],
          [10, 25, 50],
        ],
        order: [[4, 'desc']],
        searching: true,
        responsive: true,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        language: {
          paginate: { first: 'First', last: 'Last', next: 'Next', previous: 'Previous' },
          info: 'Showing _START_ to _END_ of _TOTAL_ users',
          lengthMenu: 'Show _MENU_ users per page',
        },
      })
    }

    const filterTable = () => {
      usersTableInstance
        .column(1)
        .search(searchName.value, false, true)
        .column(2)
        .search(searchEmail.value, false, true)
        .column(3)
        .search(searchRole.value || '', true, false)
        .draw()
    }

    onMounted(() => {
      initTable()
    })

    onUnmounted(() => {
      if (usersTableInstance) {
        usersTableInstance.destroy()
      }
    })

    return {
      searchName,
      searchEmail,
      searchRole,
      filterTable,
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
a {
  color: #0d6efd;
  text-decoration: none;
}
a:hover {
  color: #0a58ca;
  text-decoration: underline;
}
</style>
