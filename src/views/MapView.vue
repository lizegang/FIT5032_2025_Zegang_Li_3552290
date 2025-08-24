<template>
  <div class="container mt-5">
    <h1 class="mb-4">Health Facilities Map</h1>
    <p class="lead mb-5">
      Find nearby health facilities and get directions. This map shows hospitals, clinics, and other
      medical services in your area.
    </p>
    <HealthFacilityMap />
  </div>
</template>

<script>
import HealthFacilityMap from '../components/map/HealthFacilityMap.vue'

export default {
  name: 'MapView',
  components: {
    HealthFacilityMap,
  },
}
</script>
