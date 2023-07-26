

<script setup lang="ts">
import { onMounted ,ref } from "vue";
import { useRoute } from "vue-router";
import router from '../router';
import Alert from "../components/Alert.vue";
import * as url from "url";

const route = useRoute()
const task = ref({
  id: null,
  title: '',
  description: '',
  done: false,
  image: null,
  url_video: null
});
const message_alert = ref({status: false, message: null });
const imagen = ref(null);
const url_video = ref(null);


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
          imagen.value = task.value.image
          url_video.value = task.value.url_video
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

function uploadFile(event: any)
{
  const file = event.target.files[0];
  if(file)
  {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => { task.value.image = reader.result }
  } else {
    task.value.file = null;
  }
}

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
        const response = await res.json();
        message_alert.value = {
          status: response.status,
          message: response.status ? 'Se editó la tarea con éxito.' : 'Hubo un error'
        }
        if(response.status)
        {
          imagen.value = task.value.image
          url_video.value = task.value.url_video
        }
      })
      .catch( () => message_alert.value = { status: false, message: 'Hubo un error' })
      .finally(() => setTimeout(() => message_alert.value = { status: false, message: null },3000 ))

}
</script>

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
      <div class="mb-3">
        <label for="file" class="form-label">Imágen</label>
        <input type="file" id="file" class="form-control" @change="uploadFile" accept="image/jpeg,image/png">
      </div>
      <div v-if="task.image != nul" class="mb-3">
        <img :src="task.image" class="img-fluid">
      </div>
      <div class="mb-3">
        <label for="video" class="form-label">Video</label>
        <input type="text" class="form-control" id="video"
               placeholder="https://www.youtube.com/embed/..."
               v-model="task.url_video" >
      </div>
      <div v-if="url_video" class="ratio ratio-16x9 mb-2">
        <iframe :src="url_video" title="Video" allowfullscreen></iframe>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="done" v-model="task.done">
        <label class="form-check-label" for="done">Realizada</label>
      </div>
      <button type="button" class="btn btn-primary" @click="storeTask">Editar</button>
    </form>
  </div>
</template>

<style>

</style>

