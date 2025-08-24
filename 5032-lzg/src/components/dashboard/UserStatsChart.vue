<template>
  <div class="chart-container">
    <h3>User Registrations by Month</h3>
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
  name: 'UserStatsChart',
  setup() {
    const chartRef = ref(null)
    const chartStore = useChartStore()
    let chartInstance = null

    // 创建图表
    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      if (!chartRef.value || !chartStore.userRegistrationData.length) return

      const ctx = chartRef.value.getContext('2d')

      // 准备数据
      const labels = chartStore.userRegistrationData.map((item) => item.month)
      const data = chartStore.userRegistrationData.map((item) => item.users)

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Number of New Users',
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
              title: {
                display: true,
                text: 'Number of Users',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Month',
              },
            },
          },
          plugins: {
            accessibility: {
              enabled: true,
              description: 'Bar chart showing the number of new user registrations per month',
            },
          },
        },
      })
    }

    // 当数据变化时重新创建图表
    watch(
      () => chartStore.userRegistrationData,
      () => {
        createChart()
      },
    )

    onMounted(async () => {
      if (chartStore.userRegistrationData.length === 0) {
        await chartStore.fetchUserRegistrationData()
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
