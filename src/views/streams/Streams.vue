<script setup>

import {ref} from 'vue'
import MainSection from '../../components/MainSection.vue'
import CardComponent from '../../components/CardComponent.vue'
import TitleBar from '../../components/TitleBar.vue'
import HeroBar from '../../components/HeroBar.vue'
import StreamsTable from '../../components/streams/StreamsTable.vue'
import JbButton from '../../components/JbButton.vue'
import JbButtons from '../../components/JbButtons.vue'
import {useStore} from "vuex";

const titleStack = ref(['Admin', 'Streams'])
const store = useStore()
store.dispatch('fetchStreams')

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Streams</hero-bar>
  <main-section>

    <card-component
      class="mb-6"
      has-table
    >
      <streams-table checkable />
      <jb-buttons>
        <jb-button
          color="info"
          label="Create"
          to="/streams/create"
        />
      </jb-buttons>

    </card-component>

  </main-section>
</template>
