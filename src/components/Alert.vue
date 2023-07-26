<script setup lang="ts">
const { status,message } = defineProps(['status', 'message'])
</script>

<template>
  <div class="alert alert-dismissible" :class="[ status ? 'alert-success' : 'alert-danger' ]" role="alert">
    <div>{{ message }}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  </div>
</template>

<style scoped>

</style>
