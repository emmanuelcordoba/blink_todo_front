<script setup lang="ts">
import {onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import router from '../router';
import Alert from "../components/Alert.vue";
import TaskResources from '../resources/TaskResources.js';

const route = useRoute()
const task = ref(null);
const message_alert = ref({ status: false, message: null});


onMounted(() => {
  const id = route.params.id;
  TaskResources.getTask(id)
      .then( async (res) => {
        console.log(res)
        if(res.ok)
        {
          task.value = (await res.json()).task
          console.log(task.value)
        } else {
          message_alert.value = { status: false, message: 'No se encontró la tarea.'};
        }
      }).catch( error => {
        message_alert.value = { status: false, message: 'Hubo un problema.'};
      }).finally(() => {
        if(message_alert.value.message)
        {
          setTimeout(() => router.push({ path: '/' }), 3000)
        }
      })
})

function toEditTask()
{
  router.push({ path: `/edit/${task.value.id}` })
}

function deleteTask()
{
  if (confirm("Press a button!")) {
    console.log('Borrar')
    TaskResources.delete(task.value.id)
      .then( async (res) => {
        console.log(res)
        message_alert.value = {
          status: res.ok,
          message: res.ok ? 'Se borró la tarea con éxito.' : 'Hubo un problema'
        };
        setTimeout(() => router.push({ path: '/' }), 3000)
      }).catch( error => {
        message_alert.value = { status: false, message: 'Hubo un problema.'};
      })
  }
}

function toggleDone() {
  task.value.done = !task.value.done
  TaskResources.edit(task.value)
    .then( async (res) => {
      message_alert.value = {
        status: res.ok,
        message: res.ok ? 'Se editó la tarea con éxito.' : 'Hubo un error'
      }
    })
    .catch( () => message_alert.value = { status: false, message: 'Hubo un error' })
    .finally(() => setTimeout(() => message_alert.value = { status: false, message: null },3000 ))

}
</script>

<template>
  <div class="row">
    <div class="col">
      <Alert v-if="message_alert.message != null" :status="message_alert.status" :message="message_alert.message" />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="card" v-if="task">
        <div class="card-header">
          <h4>{{ task.title }}</h4>
        </div>
        <div class="card-body">
          <h6 class="card-title">Descripción:</h6>
          <p class="card-text">{{ task.description }}</p>
          <div v-if="task.image != nul">
            <h6 class="card-title">Imágen:</h6>
            <img :src="task.image" class="img-fluid">
          </div>
          <div v-if="task.url_video != nul">
            <h6 class="card-title">Video:</h6>
            <div class="ratio ratio-16x9">
              <iframe :src="task.url_video" title="Video" allowfullscreen></iframe>
            </div>
          </div>
          <h6 class="card-title mt-2">Estado: <span class="badge  " :class="[ task.done ? 'text-bg-success' : 'text-bg-warning' ]">{{ task.done ? 'Finalizada' : 'Pendiente' }}</span></h6>
          <div class="btn-group btn-group-sm me-1" role="group">
            <button type="button" class="btn btn-primary" @click="toggleDone">Marcar {{ task.done ? 'pendiente' : 'finalizada' }}</button>
            <button type="button" class="btn btn-primary" @click="toEditTask">Editar</button>
            <button type="button" class="btn btn-primary" @click="deleteTask">Borrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
