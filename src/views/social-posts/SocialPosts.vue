<script setup>

import {computed, ref} from 'vue'
import MainSection from '../../components/MainSection.vue'
import CardComponent from '../../components/CardComponent.vue'
import TitleBar from '../../components/TitleBar.vue'
import HeroBar from '../../components/HeroBar.vue'
import JbButton from '../../components/JbButton.vue'
import JbButtons from '../../components/JbButtons.vue'
import {baseUrl} from "@/router";
import SocialPostsTable from "@/components/social-posts/SocialPostsTable.vue";
import {useStore} from "vuex";

const titleStack = ref(['Admin', 'Social posts'])
const store = useStore()
const socialPostsCount = computed(() => store.state.socialPost.socialPosts.meta?.total)
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Social posts ({{ socialPostsCount }})</hero-bar>
  <main-section>

    <card-component
      class="mb-6"
      has-table
    >
        <social-posts-table checkable/>

    </card-component>

    <jb-buttons>
      <jb-button
        color="info"
        label="Create"
        :to="`${baseUrl}/social-posts/create`"
      />
    </jb-buttons>

  </main-section>
</template>
