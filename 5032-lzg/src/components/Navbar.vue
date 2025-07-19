<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <i class="fas fa-heartbeat me-2"></i>Health Charity Platform
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" :class="{ active: $route.name === 'Home' }">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/events" class="nav-link" :class="{ active: $route.name === 'Events' }">
              Events
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>

          <li class="nav-item dropdown" v-else>
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ userName }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li v-if="isAdmin">
                <router-link to="/admin" class="dropdown-item">
                  <i class="fas fa-cog me-2"></i>Admin Panel
                </router-link>
              </li>
              <li>
                <router-link to="/dashboard" class="dropdown-item">
                  <i class="fas fa-user me-2"></i>Dashboard
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a href="#" class="dropdown-item" @click="logout">
                  <i class="fas fa-sign-out-alt me-2"></i>Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';

export default {
  setup() {
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(() => authStore.isAdmin);
    const userName = computed(() => authStore.userName);

    const logout = () => {
      authStore.logout();
    };

    return {
      isAuthenticated,
      isAdmin,
      userName,
      logout
    };
  }
};
</script>
