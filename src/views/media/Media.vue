<script setup>
import {computed, ref} from 'vue'
import MainSection from '../../components/MainSection.vue'
import CardComponent from '../../components/CardComponent.vue'
import TitleBar from '../../components/TitleBar.vue'
import HeroBar from '../../components/HeroBar.vue'
import MediaTable from '../../components/media/MediaTable.vue'
import {baseUrl} from "@/router";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import {useStore} from "vuex";

const titleStack = ref(['Admin', 'Media'])
const store = useStore()
const mediaCount = computed(() => store.state.media.mediaList.meta?.total)
</script>

<template>
  <title-bar :title-stack="titleStack"/>
  <hero-bar>Media ({{ mediaCount }})</hero-bar>
  <main-section>

    <card-component
      class="mb-6"
      has-table
    >
      <media-table checkable/>
    </card-component>

    <jb-buttons>
      <jb-button
        color="info"
        label="Create"
        :to="`${baseUrl}/media/create`"
      />
    </jb-buttons>

  </main-section>
</template>
