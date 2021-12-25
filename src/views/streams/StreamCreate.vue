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
import {useRouter} from 'vue-router'
import {useStore} from "vuex";
import axios from 'axios'

const titleStack = ref(['Admin', 'Streams', 'Stream create'])
const router = useRouter()
const store = useStore()

const form = reactive({
  stream: {
    title: undefined,
    url: undefined,
    slug: undefined,
    secret_key: undefined,
    is_live: undefined,
    is_recording: undefined,
  },
})

const switches = reactive({
  live_switch: computed(() =>  [form.stream.is_live ? 'live' : undefined]),
  recording_switch: computed(() =>  [form.stream.is_recording ? 'recording' : undefined]),
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

  axios.post(`/api/streams/`, payload).then((response) => {
    router.push({path: '/streams'});
  });
}
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Stream create</hero-bar>

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
          type="text"
          autocomplete="on"
          name="title"
        />
      </field>

      <field label="Url">
        <control
          v-model="form.stream.url"
          type="url"
          autocomplete="on"
          name="url"
        />
      </field>

      <field label="Slug">
        <control
          v-model="form.stream.slug"
          type="text"
          autocomplete="on"
          name="slug"
        />
      </field>

      <field label="Secret key">
        <control
          v-model="form.stream.secret_key"
          type="text"
          autocomplete="on"
          name="secret_key"
        />
      </field>

      <divider />

      <field
        label="Description"
        help="Your description. Max 255 characters"
      >
        <control
          v-model="form.stream.description"
          type="textarea"
          autocomplete="on"
          placeholder="Stream description"
          name="description"
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

      <divider />

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
