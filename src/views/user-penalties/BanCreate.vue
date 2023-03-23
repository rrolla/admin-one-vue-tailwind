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

const titleStack = ref(['Admin', 'User penalties', 'Create ban'])
const router = useRouter()
const store = useStore()

store.dispatch('room/fetchActiveRoom')

const activeRoom = computed(() => store.state.room.activeRoom)

const form = reactive({
    userPenalty: {
        room_id: undefined,
        type: undefined,
        username: undefined,
        message: undefined,
        expires: undefined,
        user_id: undefined,
    },
})

const submit = () => {
    const payload = {
        room_id: activeRoom.value.id,
        type: 'banned',
        username: form.userPenalty.username.label,
        message: form.userPenalty.message,
        expires: form.userPenalty.expires,
        user_id: form.userPenalty.username.id,
    };

    axios.post(`/api/user-penalties/banned`, payload, {withCredentials: true})
        .then((response) => {
            store.dispatch('notification/addNotification', {color: 'success', text: 'Lietotājs atstādināts'})
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
    <hero-bar>Create user penalty ban</hero-bar>

    <main-section>
        <card-component
            title=""
            :icon="mdiBallot"
            form
            @submit.prevent="submit"
        >
            <field label="Username">
                <control
                    v-model="form.userPenalty.username"
                    type="select"
                    :options="activeUsernames"
                    autocomplete="on"
                    name="username"
                />
            </field>

            <field label="Message">
                <control
                    v-model="form.userPenalty.message"
                    type="text"
                    autocomplete="on"
                    name="message"
                />
            </field>

            <field label="Expires">
                <control
                    v-model="form.userPenalty.expires"
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
