<script setup lang="ts">
import { onMounted ,ref } from "vue";
import { useRoute } from "vue-router";
import router from '../router';
import Alert from "../components/Alert.vue";
import TaskResources from '../resources/TaskResources.js';

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
const message_errors = ref({
  title: null,
  description: null,
  done: null,
  image: null,
  url_video: null
});


onMounted(() => {
  const id = route.params.id;
  TaskResources.getTask(id)
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
  resetMessageErrors();
  TaskResources.edit(task.value)
      .then( async (res) => {
        const response = await res.json();
        if(res.status == 409)
        {
          message_errors.value = response.errors
          console.log(response.errors);
        } else {
          message_alert.value = {
            status: response.status,
            message: response.status ? 'Se editó la tarea con éxito.' : 'Hubo un error'
          }
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
  <h4>Editar Tarea</h4>
  <div class="row">
    <div class="col">
      <Alert v-if="message_alert.message != null" :status="message_alert.status" :message="message_alert.message" />
    </div>
  </div>
  <div class="row">
    <form v-if="task.id != null" @submit.prevent="storeTask">
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
               accept="image/jpeg,image/png"
               :class="[ message_errors.image ? 'is-invalid' : '' ]"
               @change="uploadFile" >
        <div v-if="message_errors.image" class="invalid-feedback">
          <dl>
            <dd v-for="error in message_errors.image">{{ error }}</dd>
          </dl>
        </div>
      </div>
      <div v-if="task.image" class="mb-3">
        <img :src="task.image" class="img-fluid">
      </div>
      <div class="mb-3">
        <label for="video" class="form-label">Video</label>
        <input type="text" class="form-control" id="video"
               placeholder="https://www.youtube.com/embed/..."
               :class="[ message_errors.url_video ? 'is-invalid' : '' ]"
               v-model="task.url_video" >
        <div v-if="message_errors.url_video" class="invalid-feedback">
          <dl>
            <dd v-for="error in message_errors.url_video">{{ error }}</dd>
          </dl>
        </div>
      </div>
      <div v-if="url_video" class="ratio ratio-16x9 mb-2">
        <iframe :src="url_video" title="Video" allowfullscreen></iframe>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="done"
               :class="[ message_errors.done ? 'is-invalid' : '' ]"
               v-model="task.done">
        <label class="form-check-label" for="done">Realizada</label>
        <div v-if="message_errors.done" class="invalid-feedback">
          <dl>
            <dd v-for="error in message_errors.done">{{ error }}</dd>
          </dl>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Editar</button>
    </form>
  </div>
</template>

<style>

</style>

