<script setup lang="ts">
import {ref } from "vue";
import router from '../router';
import Alert from "../components/Alert.vue";
import TaskResources from '../resources/TaskResources.js';
const backend_url = import.meta.env.VITE_BACKEND_URL;

const task = ref({
  title: '',
  description: '',
  done: false,
  image: null,
  url_video: null
});
const message_alert = ref({ status: false, message: null });
const message_errors = ref({
  title: null,
  description: null,
  done: null,
  image: null,
  url_video: null
});

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
  resetMessageErrors();
  TaskResources.store( task.value )
    .then( async (res) => {
      const response = await res.json()
      if(res.status == 409)
      {
        message_errors.value = response.errors
      } else {
        message_alert.value = {
          status: response.status,
          message: response.status ? 'Se creo la tarea con éxito.' : 'Hubo un error'
        }
      }
      if(response.status)
      {
        setTimeout(() => router.push({ path: '/' }), 3000)
      }
    })
}

function resetMessageErrors()
{
  message_errors.value = {
    title: null,
    description: null,
    done: null,
    image: null,
    url_video: null
  }
}
</script>

<template>
  <h4>Nueva Tarea</h4>
  <Alert v-if="message_alert.message != null" :status="message_alert.status" :message="message_alert.message"/>
  <div class="row">
    <form @submit.prevent="storeTask">
      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <input type="text" class="form-control" id="title"
               :class="[ message_errors.title ? 'is-invalid' : '' ]"
               v-model="task.title" required>
          <div v-if="message_errors.title" class="invalid-feedback">
            <dl>
              <dd v-for="error in message_errors.title">{{ error }}</dd>
            </dl>
          </div>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea class="form-control" id="description"
                  :class="[ message_errors.description ? 'is-invalid' : '' ]"
                  v-model="task.description" required></textarea>
        <div v-if="message_errors.description" class="invalid-feedback">
          <dl>
            <dd v-for="error in message_errors.description">{{ error }}</dd>
          </dl>
        </div>
      </div>
      <div class="mb-3">
        <label for="file" class="form-label">Imágen</label>
        <input type="file" id="file" class="form-control"
               :class="[ message_errors.image ? 'is-invalid' : '' ]"
               @change="uploadFile" accept="image/jpeg,image/png">
        <div v-if="message_errors.image" class="invalid-feedback">
          <dl>
            <dd v-for="error in message_errors.image">{{ error }}</dd>
          </dl>
        </div>
      </div>
      <div class="mb-3">
        <label for="video" class="form-label">Video</label>
        <input type="text" class="form-control" id="video"
               placeholder="https://www.youtube.com/embed/..."
               :class="[ message_errors.url_video ? 'is-invalid' : '' ]"
               v-model="task.url_video">
        <div v-if="message_errors.image" class="invalid-feedback">
          <dl>
            <dd v-for="error in message_errors.url_video">{{ error }}</dd>
          </dl>
        </div>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="done" v-model="task.done">
        <label class="form-check-label" for="done">Realizada</label>
      </div>
      <button type="submit" class="btn btn-primary">Crear</button>
    </form>
  </div>
</template>

<style>

</style>

