<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TaskCardPreview from '../components/TaskCardPreview.vue'

const tasks = ref([]);

onMounted(() => {
  console.log(`the component is now mounted.`)
  fetch('http://localhost:8765/api/tasks/', { headers: { "Accept": "application/json" }})
      .then( async (res) => {
        console.log(res)
        tasks.value = (await res.json()).tasks
        console.log(tasks)
      })
})
</script>

<template>
  <h4>Listado de Tareas</h4>
  <div class="row">
    <TaskCardPreview  v-for="task in tasks" :task="task"/>
  </div>
</template>
