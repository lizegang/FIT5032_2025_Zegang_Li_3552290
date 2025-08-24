<template>
  <div class="container mt-5">
    <h1 class="mb-4">Data Tables</h1>

    <div class="card mb-5">
      <div class="card-header">
        <h2>Users</h2>
      </div>
      <div class="card-body">
        <DataTable :data="users" :columns="userColumns" />
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Events</h2>
      </div>
      <div class="card-body">
        <DataTable :data="events" :columns="eventColumns" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import DataTable from '../components/common/DataTable.vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'DataTablesView',
  components: {
    DataTable,
  },
  setup() {
    const users = ref([])
    const events = ref([])

    // 用户表格列定义
    const userColumns = [
      { label: 'Name', field: 'name', searchable: true },
      { label: 'Email', field: 'email', searchable: true },
      { label: 'Role', field: 'role', searchable: true },
      {
        label: 'Registration Date',
        field: 'createdAt',
        type: 'date',
        searchable: false,
        render: (row) => {
          return new Date(row.createdAt?.toDate?.() || row.createdAt).toLocaleDateString()
        },
      },
    ]

    // 事件表格列定义
    const eventColumns = [
      { label: 'Title', field: 'title', searchable: true },
      { label: 'Date', field: 'date', type: 'date', searchable: true },
      { label: 'Location', field: 'location', searchable: true },
      {
        label: 'Description',
        field: 'description',
        searchable: true,
        render: (row) => {
          return row.description.length > 100
            ? `${row.description.substring(0, 100)}...`
            : row.description
        },
      },
    ]

    // 获取数据
    const fetchData = async () => {
      try {
        // 获取用户数据
        const usersSnapshot = await getDocs(collection(db, 'users'))
        users.value = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // 获取事件数据
        const eventsSnapshot = await getDocs(collection(db, 'events'))
        events.value = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    onMounted(fetchData)

    return {
      users,
      events,
      userColumns,
      eventColumns,
    }
  },
}
</script>
