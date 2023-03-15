<script setup>
import {reactive, ref} from 'vue'
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

const titleStack = ref(['Admin', 'Social posts', 'Social post create'])
const router = useRouter()
const store = useStore()

const form = reactive({
    socialPost: {
        title: undefined,
        text: undefined,
        generated_text: undefined,
        ask: undefined,
    },
})

const submit = () => {
    const payload = {
        title: form.socialPost.title,
        text: form.socialPost.text,
        generated_text: form.socialPost.generated_text,
    };

    axios.post(`/api/social-posts/`, payload).then((response) => {
        // router.push({path: `${baseUrl}/streams`});
    });
}

const generate = () => {
    const payload = {
        prompt: form.socialPost.ask,
    };

    axios.post(`/api/social-posts/ask-chat-gpt`, payload).then((response) => {
        console.log('response', response)

        const message = response.data.choices[0].message.content

        form.socialPost.text = message
        // router.push({path: `${baseUrl}/streams`});
    });
}

</script>

<template>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>Social post create</hero-bar>

    <main-section>
        <card-component
            title=""
            :icon="mdiBallot"
            form
            @submit.prevent="submit"
        >
            <field label="Title">
                <control
                    v-model="form.socialPost.title"
                    type="text"
                    autocomplete="on"
                    name="title"
                />
            </field>

            <field label="Enter some keywords to generate beautiful text">
                <control
                    v-model="form.socialPost.ask"
                    type="text"
                    autocomplete="on"
                    name="title"
                />
            </field>

            <divider/>

            <field
                label="Your text"
                help="Your keywords. Max 255 characters"
            >
                <control
                    v-model="form.socialPost.text"
                    type="textarea"
                    autocomplete="on"
                    placeholder="Your text"
                    name="description"
                />
            </field>

            <divider/>

            <jb-buttons>
                <jb-button
                    color="info"
                    outline
                    label="Generate"
                    @click="generate"
                />
                <jb-button
                    type="submit"
                    color="info"
                    label="Save"
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
