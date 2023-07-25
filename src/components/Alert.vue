<script setup lang="ts">
import { onMounted } from "vue";

const { status,message } = defineProps(['status', 'message'])

onMounted(() => {
  console.log(message);
})
</script>

<template>
  <div class="alert alert-dismissible" :class="[ status ? 'alert-success' : 'alert-danger' ]" role="alert">
    <div>{{ message }}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  </div>
</template>

<style scoped>

</style>
