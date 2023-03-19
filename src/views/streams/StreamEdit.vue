<script setup>
import {computed, reactive, ref} from 'vue'
import {mdiBallot} from '@mdi/js'
import MainSection from '../../components/MainSection.vue'
import TitleBar from '../../components/TitleBar.vue'
import CardComponent from '../../components/CardComponent.vue'
import CheckRadioPicker from '../../components/CheckRadioPicker.vue'
import HeroBar from '../../components/HeroBar.vue'
import Field from '../../components/Field.vue'
import Control from '../../components/Control.vue'
import Divider from '../../components/Divider.vue'
import JbButton from '../../components/JbButton.vue'
import JbButtons from '../../components/JbButtons.vue'
import {useRoute} from 'vue-router'
import {useStore} from "vuex";
import axios from 'axios'
import {useLaravelError} from "@/composables/errors";

const titleStack = ref(['Admin', 'Streams', 'Stream edit'])
const route = useRoute()
const store = useStore()

const streamId = route.params.streamId;
store.dispatch('stream/fetchStream', streamId)
// const stream = computed(() => store.state.stream)

const form = reactive({
  stream: computed(() => store.state.stream.stream),
})

const switches = reactive({
  live_switch: computed(() => [form.stream.is_live ? 'live' : undefined]),
  recording_switch: computed(() => [form.stream.is_recording ? 'recording' : undefined]),
})

const changeLive = (element) => {
  form.stream.is_live = !form.stream.is_live;
};
const changeRecording = (element) => {
  form.stream.is_recording = !form.stream.is_recording;
};

const submit = () => {
  const payload = {
    title: form.stream.title,
    url: form.stream.url,
    slug: form.stream.slug,
    secret_key: form.stream.secret_key,
    description: form.stream.description,
    is_live: form.stream.is_live,
    is_recording: form.stream.is_recording,
  };

  axios.patch(`/api/streams/${streamId}`, payload, {withCredentials: true})
    .then((response) => {
      store.dispatch('notification/addNotification', {color: 'success', text: 'Stream atjaunota'})
    })
    .catch(useLaravelError);
}
</script>

<template>
  <title-bar :title-stack="titleStack"/>
  <hero-bar>Stream edit</hero-bar>

  <main-section>
    <card-component
      title=""
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <field label="Title">
        <control
          v-model="form.stream.title"
        />
      </field>

      <field label="Url">
        <control
          v-model="form.stream.url"
          type="url"
        />
      </field>

      <field label="Slug">
        <control
          v-model="form.stream.slug"
          type="text"
        />
      </field>

      <field label="Secret key">
        <control
          v-model="form.stream.secret_key"
          type="text"
        />
      </field>

      <divider/>

      <field
        label="Description"
        help="Your description. Max 255 characters"
      >
        <control
          v-model="form.stream.description"
          type="textarea"
          placeholder="Stream description"
        />
      </field>

      <field label="Live">
        <check-radio-picker
          v-model="switches.live_switch"
          name="is_live"
          type="switch"
          :options="{ live: 'Yes' }"
          @change="changeLive"
        />
      </field>

      <field label="Recording">
        <check-radio-picker
          v-model="switches.recording_switch"
          name="is_recording"
          type="switch"
          :options="{ recording: 'Yes' }"
          @change="changeRecording"
        />
      </field>

      <divider/>

      <jb-buttons>
        <jb-button
          type="submit"
          color="info"
          label="Submit"
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
