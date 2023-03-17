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
import {useRoute} from 'vue-router'
import {useStore} from "vuex";
import axios from 'axios'

const titleStack = ref(['Admin', 'Social posts', 'Edit social post'])
const route = useRoute()
const store = useStore()

const socialPostId = route.params.socialPostId;
store.dispatch('fetchSocialPost', socialPostId)

const form = reactive({
    socialPost: computed(() => store.state.socialPost),
})

const submit = () => {
    const payload = {
        title: form.socialPost.title,
        text: form.socialPost.text,
        ask_text: form.socialPost.ask_text,
        generated_text: form.socialPost.generated_text,
    };

    axios.patch(`/api/social-posts/${socialPostId}`, payload, {withCredentials: true});
}
</script>

<template>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>Edit social post</hero-bar>

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
                    v-model="form.socialPost.ask_text"
                    type="text"
                    autocomplete="on"
                    placeholder="Ask chat gpt"
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
