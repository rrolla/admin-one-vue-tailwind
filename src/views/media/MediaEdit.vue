<script setup>
import {computed, reactive, ref} from 'vue'
import {mdiBallot} from '@mdi/js'
import MainSection from '../../components/MainSection.vue'
import TitleBar from '../../components/TitleBar.vue'
import CardComponent from '../../components/CardComponent.vue'
import HeroBar from '../../components/HeroBar.vue'
import Field from '../../components/Field.vue'
import Control from '../../components/Control.vue'
import Divider from '../../components/Divider.vue'
import JbButton from '../../components/JbButton.vue'
import JbButtons from '../../components/JbButtons.vue'
import {useRoute, useRouter} from 'vue-router'
import {useStore} from "vuex";
import axios from 'axios'
import {useLaravelError} from "@/composables/errors";
import {convertSecondsToHHMMSS, timeToSeconds} from "@/composables/time";
import {baseUrl} from "@/router";

const titleStack = ref(['Admin', 'Media', 'Edit media'])
const router = useRouter()
const route = useRoute()
const store = useStore()

const mediaId = route.params.mediaId;
store.dispatch('media/fetchMediaById', mediaId)

const form = reactive({
  media: computed(() => store.state.media.media),
})

const durationString = computed({
    get() {
      return convertSecondsToHHMMSS(form.media.duration)
    },
    set(newValue) {
      form.media.duration = timeToSeconds(newValue)
    }
  }
)

const submit = () => {
  axios.patch(`/api/media/${mediaId}`, form.media, {withCredentials: true})
    .then((response) => {
      store.dispatch('notification/addNotification', {color: 'success', text: 'Media atjaunota'})
      router.push({path: `${baseUrl}/media`});
    })
    .catch(useLaravelError)
}
</script>

<template>
  <title-bar :title-stack="titleStack"/>
  <hero-bar>Edit media</hero-bar>

  <main-section>

    <img class="m-1" :src="form.media.poster" alt="media poster">

    <card-component
      title=""
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <field label="Title">
        <control
          v-model="form.media.title"
          type="text"
          autocomplete="on"
          name="title"
        />
      </field>

      <field label="Url">
        <control
          v-model="form.media.url"
          type="text"
          autocomplete="on"
          name="url"
        />
      </field>

      <field label="Poster">
        <control
          v-model="form.media.poster"
          type="text"
          autocomplete="on"
          name="poster"
        />
      </field>

      <field label="Description">
        <control
          v-model="form.media.description"
          type="textarea"
          autocomplete="on"
          placeholder="Description"
          name="description"
        />
      </field>

      <field label="Type">
        <control
          v-model="form.media.type"
          type="text"
          autocomplete="on"
          name="type"
        />
      </field>

      <field label="Duration in format HH:MM:SS or MM:SS or SS">
        <control
          v-model="durationString"
          type="integer"
          autocomplete="on"
          name="duration"
        />
      </field>

      <field label="Sort">
        <control
          v-model="form.media.sort"
          type="integer"
          autocomplete="on"
          name="sort"
        />
      </field>

      <divider/>

      <jb-buttons>
        <jb-button
          type="submit"
          color="info"
          label="Update"
        />
        <jb-button
          type="reset"
          color="info"
          outline
          label="Reset"
        />
      </jb-buttons>
    </card-component>
  </main-section>

</template>
