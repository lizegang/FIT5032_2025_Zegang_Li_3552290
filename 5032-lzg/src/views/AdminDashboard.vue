<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h3>Admin Menu</h3>
          </div>
          <div class="card-body">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-calendar-plus me-2"></i>Create Event
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-users me-2"></i>User Management
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-chart-line me-2"></i>Analytics
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h4>Platform Overview</h4>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="card bg-primary text-white">
                  <div class="card-body">
                    <h5 class="card-title">Total Users</h5>
                    <p class="card-text display-4">245</p>
                    <p class="card-text">12% increase from last month</p>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="card bg-success text-white">
                  <div class="card-body">
                    <h5 class="card-title">Total Events</h5>
                    <p class="card-text display-4">18</p>
                    <p class="card-text">5% increase from last month</p>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="card bg-info text-white">
                  <div class="card-body">
                    <h5 class="card-title">Average Rating</h5>
                    <p class="card-text display-4">4.7</p>
                    <p class="card-text">Out of 5.0</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <h5>Recent Event Ratings</h5>
              <div class="chart-container">
                <div class="alert alert-warning">
                  <i class="fas fa-chart-bar me-2"></i>Chart will be displayed here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';

export default {
  setup() {
    const authStore = useAuthStore();

    const user = computed(() => authStore.user || {});

    return {
      user
    };
  }
};
</script>
