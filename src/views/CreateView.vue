<template>
  <h4>Nueva Tarea</h4>
  <div v-if="message_alert != null" class="alert alert-dismissible" :class="[ message_alert.status ? 'alert-success' : 'alert-danger' ]" role="alert">
    <div>{{ message_alert.text }}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  </div>
  <div class="row">
    <form>
      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <input type="text" class="form-control" id="title" v-model="task.title" >
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea class="form-control" id="description" v-model="task.description"></textarea>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="done" v-model="task.done">
        <label class="form-check-label" for="done">Realizada</label>
      </div>
      <button type="button" class="btn btn-primary" @click="storeTask">Crear</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import router from '../router';

const task = ref({
  title: '',
  description: '',
  done: false,
  file: 'ejemplo.png'
});
const message_alert = ref(null);

function storeTask() {
  const data = new URLSearchParams({
    title: task.value.title,
    description: task.value.description,
    done: task.value.done ? '1' : '0',
    file: 'ejemplo.png'
  })
  const headers = {
    method:'POST',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
      //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: JSON.stringify(task.value)
  }
  console.log(JSON.stringify(task.value))
  fetch('http://localhost:8765/api/tasks/', headers)
      .then( async (res) => {
        res = await res.json()
        message_alert.value = {
          status: res.status,
          text: res.status ? 'Se creo la tarea con éxito.' : 'Hubo un error'
        }
        if(res.status)
        {
          setTimeout(() => router.push({ path: '/' }), 3000)
        }

      })
}
</script>

<style>

</style>

