<template>
  <div class="container mt-5">
    <h1 class="mb-4">Send Bulk Email</h1>
    <p class="lead mb-5">
      Send emails to multiple users. Only administrators can access this feature.
    </p>
    <BulkEmailForm />
  </div>
</template>

<script>
import BulkEmailForm from '../components/email/BulkEmailForm.vue'

export default {
  name: 'BulkEmail',
  components: {
    BulkEmailForm,
  },
}
</script>
