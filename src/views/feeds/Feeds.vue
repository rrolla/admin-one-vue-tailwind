<script setup>

import {computed, ref, watch} from 'vue'
import MainSection from '../../components/MainSection.vue'
import CardComponent from '../../components/CardComponent.vue'
import TitleBar from '../../components/TitleBar.vue'
import HeroBar from '../../components/HeroBar.vue'
import JbButton from '../../components/JbButton.vue'
import JbButtons from '../../components/JbButtons.vue'
import {baseUrl} from "@/router";
import store from '../../store'
import FeedsTable from "@/components/feeds/FeedsTable.vue";
import {useRoute, useRouter} from "vue-router";
import {mdiReload} from "@mdi/js";
const route = useRoute()
const router = useRouter()

const feedsRouteName = 'feeds'
const paginatedRouteName = 'paginatedFeeds'

const titleStack = ref(['Admin', 'Feeds'])

const feedCount = computed(() => store.state.feed.feeds.meta?.total)
const activeRoom = computed(() => store.state.room.activeRoom)

let currentPage = Number(route.params.pageNumber) || 1

watch(
    () => route.params.pageNumber,
    (newPage) => {
        if (route.name === feedsRouteName || route.name === paginatedRouteName) {
            currentPage = Number(newPage) || 1;
        }
    }
)
const fetchFeeds = () => {
    console.log(currentPage)
    store.dispatch('feed/fetchFeeds', currentPage);
}

</script>

<template>
    <title-bar :title-stack="titleStack"/>
    <hero-bar class="relative">
        Feeds <span title="feed count">({{ feedCount }})</span>
        {{ activeRoom.name }} <span class="text-sm" title="active user count">👥 {{ activeRoom.users?.length }}</span>
        <div class="mt-4">
            <jb-button
                :icon="mdiReload"
                @click="fetchFeeds"
            />
        </div>
    </hero-bar>
    <main-section>
        <card-component
            class="mb-6"
            has-table
        >
            <feeds-table checkable/>
        </card-component>

        <jb-buttons>
            <jb-button
                color="info"
                label="Create"
                :to="`${baseUrl}/feeds/create`"
            />
            <jb-button
                color="warning"
                label="Create warning"
                outline
                :to="`${baseUrl}/user-penalties/warning/create`"
            />
            <jb-button
                color="danger"
                label="Create ban"
                outline
                :to="`${baseUrl}/user-penalties/ban/create`"
            />
        </jb-buttons>

    </main-section>
</template>
