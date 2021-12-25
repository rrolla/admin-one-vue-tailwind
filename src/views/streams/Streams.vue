<script setup>
import {ref} from 'vue'
import MainSection from '@/components/MainSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import StreamsTable from '../../components/StreamsTable.vue'
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
    </card-component>

  </main-section>
</template>
