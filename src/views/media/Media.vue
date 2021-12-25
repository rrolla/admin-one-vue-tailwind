<script setup>
import {ref} from 'vue'
import MainSection from '../../components/MainSection.vue'
import CardComponent from '../../components/CardComponent.vue'
import TitleBar from '../../components/TitleBar.vue'
import HeroBar from '../../components/HeroBar.vue'
import MediaTable from '../../components/media/MediaTable.vue'
import {useStore} from "vuex";

const titleStack = ref(['Admin', 'Media'])
const store = useStore()
store.dispatch('fetchMedia')
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Media</hero-bar>
  <main-section>

    <card-component
      class="mb-6"
      has-table
    >
      <media-table checkable />
    </card-component>

  </main-section>
</template>
