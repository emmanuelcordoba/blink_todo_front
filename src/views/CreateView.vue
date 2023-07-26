<script setup lang="ts">
import {ref, registerRuntimeCompiler} from "vue";
import router from '../router';
import Alert from "../components/Alert.vue";

const task = ref({
  title: '',
  description: '',
  done: false,
  image: null,
  url_video: null
});
const message_alert = ref({ status: false, message: null });
const files = ref([]);

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

  /*
  input_files.forEach(file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      task.value.files.push({ name: file.name, type: 'image', file: reader.result?.toString() });
    }
  })*/
  /*
  console.log(file.value);
  const reader = new FileReader();
  if(file.value)
  {
    reader.readAsDataURL(file.value);
    reader.onload = async () => {
      task.value.file = reader.result?.toString()
      console.log('finished load file')
    }
  }*/
}

function storeTask() {
  console.log(task.value)
  const headers = {
    method:'POST',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task.value)
  }
  fetch('http://localhost:8765/api/tasks/', headers)
    .then( async (res) => {
      const response = await res.json()
      message_alert.value = {
        status: response.status,
        message: response.status ? 'Se creo la tarea con éxito.' : 'Hubo un error'
      }
      if(response.status)
      {
        setTimeout(() => router.push({ path: '/' }), 3000)
      }
    })
}
</script>

<template>
  <h4>Nueva Tarea</h4>
  <Alert v-if="message_alert.message != null" :status="message_alert.status" :message="message_alert.message"/>
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
      <div class="mb-3">
        <label for="file" class="form-label">Imágen</label>
        <input type="file" id="file" class="form-control" @change="uploadFile" accept="image/jpeg,image/png">
      </div>
      <div class="mb-3">
        <label for="video" class="form-label">Video</label>
        <input type="text" class="form-control" id="video"
               placeholder="https://www.youtube.com/embed/..."
               v-model="task.url_video">
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="done" v-model="task.done">
        <label class="form-check-label" for="done">Realizada</label>
      </div>
      <button type="button" class="btn btn-primary" @click="storeTask">Crear</button>
    </form>
  </div>
</template>

<style>

</style>

