<template>
  <h4>Editar Tarea</h4>
  <div class="row">
    <div class="col">
      <Alert v-if="message_alert.message != null" :status="message_alert.status" :message="message_alert.message" />
    </div>
  </div>
  <div class="row">
    <form v-if="task.id != null">
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
      <button type="button" class="btn btn-primary" @click="storeTask">Editar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted ,ref } from "vue";
import { useRoute } from "vue-router";
import router from '../router';
import Alert from "../components/Alert.vue";

const route = useRoute()
const task = ref({
  id: null,
  title: null,
  description: null,
  done: null,
  file: null
});
const message_alert = ref({status: false, message: null });


onMounted(() => {
  const id = route.params.id;
  const headers = {
    method:'GET',
    headers: {
      'Accept': 'application/json',
    }
  }
  fetch(`http://localhost:8765/api/tasks/${id}`, headers)
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

function storeTask() {
  const headers = {
    method:'PATCH',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task.value)
  }
  fetch(`http://localhost:8765/api/tasks/${task.value.id}`, headers)
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

<style>

</style>

