<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import menu from '@/menu.js'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import Overlay from '@/components/Overlay.vue'
import Notification from "@/components/Notification.vue";
import {mdiAlertCircle, mdiOpenInNew} from "@mdi/js";
import JbButton from "@/components/JbButton.vue";

const store = useStore()
store.dispatch('fetchUser')

// store.commit('user', {
//   name: 'John Doe',
//   email: 'john@example.com',
//   avatar: 'https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93'
// })

const isAsideLgActive = computed(() => store.state.isAsideLgActive)

const overlayClick = () => {
  store.dispatch('asideLgToggle', false)
}

const notifications = computed(() => store.state.notification.notifications)

</script>

<template>
  <nav-bar />
  <aside-menu :menu="menu" />
  <router-view />
  <footer-bar />

  <notification
    v-for="notification in notifications"
    style="position: fixed; top: 60px; right: 14px;"
    :color="notification.color"
    :icon="mdiAlertCircle"
  >
    <b>{{ notification.text }}</b>
    <template #right>

    </template>
  </notification>

  <overlay
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
</template>
