<script setup lang="ts">
import router from "@/router";

const props = defineProps(['task'])
const task = props.task;

function toShowTask(){
  router.push({ path: `/${task.id}` })
}
</script>

<template>
  <div class="col-4 mb-2">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ task.title }}</h5>
        <p>Estado: <span class="badge  " :class="[ task.done ? 'text-bg-success' : 'text-bg-warning' ]">{{ task.done ? 'Finalizada' : 'Pendiente' }}</span></p>
        <button type="button" class="btn btn-primary" @click="toShowTask">Ver</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
