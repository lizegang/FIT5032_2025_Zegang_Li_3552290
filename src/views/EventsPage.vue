<!-- src/views/EventsPage.vue -->
<template>
  <div class="container py-5">
    <h3 class="mb-4">Upcoming Health Charity Events</h3>
    <!-- 引入活动列表表格组件 -->
    <EventsTable />
  </div>
</template>

<script>
// 导入活动表格组件
import EventsTable from '@/components/tables/EventsTable.vue'

export default {
  components: {
    EventsTable, // 注册组件
  },
}
</script>
