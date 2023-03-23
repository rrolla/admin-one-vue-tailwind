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
import {useRoute, useRouter} from 'vue-router'
import {useStore} from "vuex";
import axios from 'axios'
import {baseUrl} from "@/router";
import {useLaravelError} from "@/composables/errors";

const titleStack = ref(['Admin', 'Feeds', 'Edit feed'])
const route = useRoute()
const router = useRouter()
const store = useStore()

const feedId = route.params.feedId;
store.dispatch('feed/fetchFeed', feedId)

const activeRoom = computed(() => store.state.room.activeRoom)

const form = reactive({
    feed: computed(() => store.state.feed.feed),
})

const switches = reactive({
    show_switch: computed(() => [form.feed.show ? 'show' : undefined]),
    is_sticky_switch: computed(() => [form.feed.is_sticky ? 'is_sticky' : undefined]),
})

const changeIsShow = (element) => {
    form.feed.show = !form.feed.show;
};
const changeIsSticky = (element) => {
    form.feed.is_sticky = !form.feed.is_sticky;
};

const submit = () => {
    const payload = {
        room_id: activeRoom.value.id,
        type: form.feed.type,
        username: form.feed.username,
        name: form.feed.name,
        text: form.feed.text,
        show: form.feed.show,
        is_sticky: form.feed.is_sticky,
    };

    axios.post(`/api/feeds`, payload, {withCredentials: true})
        .then((response) => {
            store.dispatch('notification/addNotification', {color: 'success', text: 'Ieraksts pievienots'})
            router.push({path: `${baseUrl}/feeds`});
        })
        .catch(useLaravelError);
}
</script>

<template>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>Edit feed</hero-bar>

    <main-section>
        <card-component
            title=""
            :icon="mdiBallot"
            form
            @submit.prevent="submit"
        >
            <field label="Type">
                <control
                    v-model="form.feed.type"
                    type="text"
                    autocomplete="on"
                    name="type"
                />
            </field>

            <field label="Name">
                <control
                    v-model="form.feed.username"
                    type="text"
                    autocomplete="on"
                    name="username"
                />
            </field>

            <field label="Text">
                <control
                    v-model="form.feed.text"
                    type="textarea"
                    name="text"
                />
            </field>

            <divider/>

            <field label="Show">
                <check-radio-picker
                    v-model="switches.show_switch"
                    name="show"
                    type="switch"
                    :options="{ show: 'Yes' }"
                    @change="changeIsShow"
                />
            </field>

            <field label="Is sticky">
                <check-radio-picker
                    v-model="switches.is_sticky_switch"
                    name="is_sticky"
                    type="switch"
                    :options="{ is_sticky: 'Yes' }"
                    @change="changeIsSticky"
                />
            </field>

            <divider/>

            <jb-buttons>
                <jb-button
                    type="submit"
                    color="info"
                    label="Update"
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
