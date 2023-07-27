<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TaskCardPreview from '../components/TaskCardPreview.vue'
import TaskResources from '../resources/TaskResources.js';

const tasks_todo = ref([]);
const tasks_done = ref([]);

onMounted(() => {
  TaskResources.getAll()
      .then( async (res) => {
        const tasks = (await res.json()).tasks;
        tasks_todo.value = tasks.filter((t) => !t.done);
        tasks_done.value = tasks.filter((t) => t.done);
      })
})
</script>

<template>
  <h4>Tareas Pendientes</h4>
  <div class="row">
    <TaskCardPreview  v-for="task in tasks_todo" :task="task"/>
    <p v-if="!tasks_todo.length">Sin tareas pendientes 🙂</p>
  </div>
  <h4 v-if="tasks_done.length" class="mt-3">Tareas Finalizadas</h4>
  <div v-if="tasks_done.length" class="row">
    <TaskCardPreview  v-for="task in tasks_done" :task="task"/>
  </div>
</template>
