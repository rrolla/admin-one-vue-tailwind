<script setup>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {mdiPencil, mdiTrashCan} from '@mdi/js'
import CheckboxCell from '../../components/CheckboxCell.vue'
import Level from '../../components/Level.vue'
import JbButtons from '../../components/JbButtons.vue'
import JbButton from '../../components/JbButton.vue'
import ModalBox from '../../components/ModalBox.vue'
import axios from 'axios'
import {baseUrl} from "@/router";

const props = defineProps({
    checkable: Boolean
})

const confirmDelete = ref(null)
const confirmDeleteId = ref(null)
const confirmDeleteTitle = ref(null)

const checkedRows = ref([])

const confirmDeleteModal = (socialPost) => {
    confirmDelete.value = 'confirm';
    confirmDeleteId.value = socialPost.id;
    confirmDeleteTitle.value = socialPost.title;
}

const confirmedDelete = () => {
    axios.delete(`/api/social-posts/${confirmDeleteId.value}`).then(() => store.dispatch('fetchSocialPosts'))
}

const perPage = ref(1)
const currentPage = ref(1)
const numPages = computed(() => 1)
// const itemsPaginated = computed(() => [])

const store = useStore()
store.dispatch('fetchSocialPosts').then(() => {
    perPage.value = items.value.meta?.per_page
    currentPage.value = items.value.meta?.current_page
    numPages.value = items.value.meta?.last_page
    // itemsPaginated.value = items.value.data?.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
})

const items = computed(() => store.state.socialPosts)

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
    const pagesList = []

    for (let i = 0; i < numPages.value; i++) {
        pagesList.push(i)
    }

    return pagesList
})

const remove = (arr, cb) => {
    const newArr = []

    arr.forEach(item => {
        if (!cb(item)) {
            newArr.push(item)
        }
    })

    return newArr
}

const checked = (isChecked, client) => {
    if (isChecked) {
        checkedRows.value.push(client)
    } else {
        checkedRows.value = remove(checkedRows.value, row => row.id === client.id)
    }
}
</script>

<template>
    <div
        v-if="checkedRows.length"
        class="bg-gray-50 p-3 dark:bg-gray-800"
    >
    <span
        v-for="checkedRow in checkedRows"
        :key="checkedRow.id"
        class="inline-block bg-gray-100 px-2 py-1 rounded-sm mr-2 text-sm dark:bg-gray-700"
    >
      {{ checkedRow.name }}
    </span>
    </div>

    <table>
        <thead>
        <tr>
            <th v-if="checkable"/>
            <th>ID</th>
            <th>Title</th>
            <th>Text</th>
            <th>Created</th>
            <th/>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="socialPost in items.data"
            :key="socialPost.id"
        >
            <checkbox-cell
                v-if="checkable"
                @checked="checked($event, socialPost)"
            />

            <td data-label="ID">
                {{ socialPost.id }}
            </td>
            <td data-label="Title">
                {{ socialPost.title }}
            </td>
            <td data-label="Text">
                {{ socialPost.text }}
            </td>
            <td data-label="Created">
                <small
                    class="text-gray-500 dark:text-gray-400"
                    :title="socialPost.created_at"
                >{{ socialPost.created_at }}</small>
            </td>
            <td class="actions-cell">
                <jb-buttons
                    type="justify-start lg:justify-end"
                    no-wrap
                >
                    <jb-button
                        color="info"
                        :icon="mdiPencil"
                        small
                        :to="`${baseUrl}/social-posts/${socialPost.id}/edit`"
                    />
                    <jb-button
                        color="danger"
                        :icon="mdiTrashCan"
                        small
                        @click="confirmDeleteModal(socialPost)"
                    />
                </jb-buttons>
            </td>
        </tr>
        </tbody>
    </table>
    <div class="table-pagination">
        <level>
            <jb-buttons>
                <jb-button
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :outline="darkMode"
                    small
                    @click="currentPage = page"
                />
            </jb-buttons>
            <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
        </level>
    </div>

    <modal-box
        v-model="confirmDelete"
        title="Please confirm action"
        button-label="Confirm"
        has-cancel
        @confirm="confirmedDelete"
    >
        <p>Really want to delete {{ confirmDeleteTitle }}?</p>
    </modal-box>
</template>
