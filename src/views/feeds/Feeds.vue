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
const buttonLabel = computed(() => webSocketWatcherActive.value ? 'off' : 'on');

const feedCount = computed(() => store.state.feed.feeds.meta?.total)
const activeRoom = computed(() => store.state.room.activeRoom)

let currentPage = Number(route.params.pageNumber) || 1
const webSocketWatcherActive = ref(false);

watch(
    () => route.params.pageNumber,
    (newPage) => {
        if (route.name === feedsRouteName || route.name === paginatedRouteName) {
            currentPage = Number(newPage) || 1;
        }
    }
)
const fetchFeeds = () => {
    store.dispatch('feed/fetchFeeds', currentPage);
}

const listenToEcho = () => {
    const redisPrefix = 'interactive_social_media_wall_database_';
    const channel = window.Echo.channel(`${redisPrefix}feed-event`);

    const stopListening = () => {
        channel.stopListening('.feed.updated');
    };

    channel.listen('.feed.updated', async (response) => {
        if (currentPage === 1) {
            fetchFeeds();
        }
    });

    return stopListening;
};

let stopListening;

const toggleWebSocketWatcher = () => {
    webSocketWatcherActive.value = !webSocketWatcherActive.value;
    if (webSocketWatcherActive.value) {
        stopListening = listenToEcho();
    } else {
        stopListening();
    }
};

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
            <br>
            <span class="font-normal text-lg">Toggle live feed update: </span>
            <jb-button
                :label="buttonLabel"
                @click="toggleWebSocketWatcher"
                class="toggle-btn"
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
<style lang="scss">
.toggle-btn{
    font-size: 1.125rem;
    line-height: 1.75rem;
    padding: 0px;
    font-weight: normal;
    margin-left: 10px;
}
</style>
