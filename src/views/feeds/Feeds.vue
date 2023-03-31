<script setup>

import {computed, ref} from 'vue'
import MainSection from '../../components/MainSection.vue'
import CardComponent from '../../components/CardComponent.vue'
import TitleBar from '../../components/TitleBar.vue'
import HeroBar from '../../components/HeroBar.vue'
import JbButton from '../../components/JbButton.vue'
import JbButtons from '../../components/JbButtons.vue'
import {baseUrl} from "@/router";
import store from '../../store'
import FeedsTable from "@/components/feeds/FeedsTable.vue";

const titleStack = ref(['Admin', 'Feeds'])

const feedCount = computed(() => store.state.feed.feeds.meta?.total)
const activeRoom = computed(() => store.state.room.activeRoom)
</script>

<template>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
        Feeds <span title="feed count">({{ feedCount }})</span>
        {{ activeRoom.name }} <span class="text-sm" title="active user count">👥 {{ activeRoom.users?.length }}</span>
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
