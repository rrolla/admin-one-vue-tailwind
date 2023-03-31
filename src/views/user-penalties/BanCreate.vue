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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const titleStack = ref(['Admin', 'User penalties', 'Create ban'])
const router = useRouter()
const store = useStore()

store.dispatch('room/fetchActiveRoom')

const activeRoom = computed(() => store.state.room.activeRoom)

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const form = reactive({
    userPenalty: {
        room_id: undefined,
        type: undefined,
        username: undefined,
        message: undefined,
        expires: new Date(Date.now() + 10 * 60 * 1000),
        user_id: undefined,
    },
})

const submit = () => {
    const payload = {
        room_id: activeRoom.value.id,
        type: 'banned',
        username: form.userPenalty.username.label,
        message: form.userPenalty.message,
        expires: formatDate(form.userPenalty.expires),
        user_id: form.userPenalty.username.id,
    };

    axios.post(`/api/user-penalties/banned`, payload, {withCredentials: true})
        .then((response) => {
            store.dispatch('notification/addNotification', {color: 'success', text: 'Lietotājs atstādināts'})
            router.push({path: `${baseUrl}/feeds`});
        })
        .catch(useLaravelError);
}

const findUserName = (user) => {
    const username = user.settings.find((setting) => setting.key === 'username').value
    return ['.', '..', '...'].includes(username) ? null : username
}

const activeUsernames = computed(
    () => activeRoom.value.users
        ?.map(user => ({id: user.id, label: findUserName(user)}))
        .filter(user => user.label !== null && user.label !== undefined)
)
const reset = () => {
    form.userPenalty.username = null
    form.userPenalty.message = null
    form.userPenalty.expires = new Date(Date.now() + 10 * 60 * 1000)
}
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
                    required
                />
            </field>

            <field label="Message">
                <control
                    v-model="form.userPenalty.message"
                    type="text"
                    autocomplete="on"
                    name="message"
                    required
                />
            </field>

          <field label="Expires">
            <VueDatePicker v-model="form.userPenalty.expires" :min-date="new Date()" required/>
          </field>

            <divider/>

            <jb-buttons>
                <jb-button
                    type="submit"
                    color="info"
                    label="Create"
                />
                <jb-button
                    @click="reset()"
                    color="info"
                    outline
                    label="Reset"
                />
            </jb-buttons>
        </card-component>
    </main-section>

</template>
