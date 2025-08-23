<template>
  <div class="chart-container">
    <h3>Events by Category</h3>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <canvas v-else ref="chartRef"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useChartStore } from '../../store/chartStore'
import Chart from 'chart.js/auto'

export default {
  name: 'EventStatsChart',
  setup() {
    const chartRef = ref(null)
    const chartStore = useChartStore()
    let chartInstance = null

    // 创建图表
    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      if (!chartRef.value || !chartStore.eventCategoryData.length) return

      const ctx = chartRef.value.getContext('2d')

      // 准备数据
      const labels = chartStore.eventCategoryData.map((item) => item.category)
      const data = chartStore.eventCategoryData.map((item) => item.events)

      // 生成随机颜色
      const backgroundColors = data.map(() => {
        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        return `rgba(${r}, ${g}, ${b}, 0.5)`
      })

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
            accessibility: {
              enabled: true,
              description: 'Doughnut chart showing the distribution of events by category',
            },
          },
        },
      })
    }

    // 当数据变化时重新创建图表
    watch(
      () => chartStore.eventCategoryData,
      () => {
        createChart()
      },
    )

    onMounted(async () => {
      if (chartStore.eventCategoryData.length === 0) {
        await chartStore.fetchEventCategoryData()
      } else {
        createChart()
      }
    })

    return {
      chartRef,
      loading: chartStore.loading,
      error: chartStore.error,
    }
  },
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  margin-bottom: 2rem;
}
</style>
