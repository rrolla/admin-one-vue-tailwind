<script setup>
import {computed, reactive, ref} from 'vue'
import {mdiBallot} from '@mdi/js'
import MainSection from '../../components/MainSection.vue'
import TitleBar from '../../components/TitleBar.vue'
import CardComponent from '../../components/CardComponent.vue'
import HeroBar from '../../components/HeroBar.vue'
import Field from '../../components/Field.vue'
import Control from '../../components/Control.vue'
import Divider from '../../components/Divider.vue'
import JbButton from '../../components/JbButton.vue'
import JbButtons from '../../components/JbButtons.vue'
import {useRouter} from 'vue-router'
import {useStore} from "vuex";
import axios from 'axios'
import {baseUrl} from "@/router";
import {useLaravelError} from "@/composables/errors";

const titleStack = ref(['Admin', 'Feeds', 'Create warning'])
const router = useRouter()
const store = useStore()

store.dispatch('room/fetchActiveRoom')

const activeRoom = computed(() => store.state.room.activeRoom)

const form = reactive({
    feed: {
        room_id: undefined,
        type: undefined,
        username: undefined,
        name: undefined,
        text: undefined,
        show: undefined,
        is_sticky: undefined,
    },
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

const findUserName = (user) => user.settings.find((setting) => setting.key === 'username').value

const activeUsernames = computed(
    () => activeRoom.value.users?.map(function (user) {
        return {id: user.id, label: findUserName(user)}
    })
)
</script>

<template>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>Create warning</hero-bar>

    <main-section>
        <card-component
            title=""
            :icon="mdiBallot"
            form
            @submit.prevent="submit"
        >
            <field label="Username">
                <control
                    v-model="form.feed.type"
                    type="select"
                    :options="activeUsernames"
                    autocomplete="on"
                    name="username"
                />
            </field>


            <field label="Message">
                <control
                    v-model="form.feed.type"
                    type="text"
                    autocomplete="on"
                    name="message"
                />
            </field>

            <field label="Expires">
                <control
                    v-model="form.feed.username"
                    type="text"
                    autocomplete="on"
                    name="expires"
                />
            </field>

            <divider/>

            <jb-buttons>
                <jb-button
                    type="submit"
                    color="info"
                    label="Create"
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
