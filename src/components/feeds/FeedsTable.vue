<script setup>
import {computed, ref, watch} from 'vue'
import {useStore} from 'vuex'
import {mdiPencil, mdiTrashCan} from '@mdi/js'
import CheckboxCell from '../../components/CheckboxCell.vue'
import Level from '../../components/Level.vue'
import JbButtons from '../../components/JbButtons.vue'
import JbButton from '../../components/JbButton.vue'
import ModalBox from '../../components/ModalBox.vue'
import axios from 'axios'
import {useTimeAgo} from "@vueuse/core";
import {checked, checkedRows} from "@/composables/table";
import {confirmDeleteModal, confirmMassDeleteModal, deleteModal, deleteModalReset} from "@/composables/delete";
import {baseUrl} from "@/router";
import {useRoute, useRouter} from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()

const props = defineProps({
    checkable: Boolean
})

checkedRows.value = []

const feedsRouteName = 'feeds'
const paginatedRouteName = 'paginatedFeeds'
const checkAllBtn = 'checkAllBtn'

let currentPage = Number(route.params.pageNumber) || 1
const allChecked = ref(false)

watch(
    () => route.params.pageNumber,
    (newPage) => {
        if (route.name === feedsRouteName || route.name === paginatedRouteName) {
            const checkAllBtn = document.getElementById('checkAllBtn')
            checkAllBtn.checked = false;
            allChecked.value = false;
            checkedRows.value = []
            currentPage = Number(newPage) || 1;
            fetchFeeds();
        }
    }
)

const showImage = ref(false)
const modalImage = ref(undefined)

const fetchFeeds = () => {
    store.dispatch('feed/fetchFeeds', currentPage);
}

fetchFeeds()
const extractPageNumber = url => {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return parseInt(urlParams.get('page'));
}
const goToPage = (pageNumber) => {
    router.push({name: pageNumber === 1 ? 'feeds' : 'paginatedFeeds', params: {pageNumber}});
}

const items = computed(() => store.state.feed.feeds)
deleteModalReset()

const confirmedDelete = () => {
    axios.delete(`/api/feeds/${deleteModal.id}`)
        .then(() => {
            store.dispatch('notification/addNotification', {color: 'success', text: 'Ieraksts idzēsts'})
            fetchFeeds()
            checkedRows.value = []
        })
}

const confirmedMassDelete = () => {
    axios.delete(`/api/feeds/`, {data: {feedIds: deleteModal.id}})
        .then(() => {
            store.dispatch('notification/addNotification', {color: 'success', text: 'Ieraksti dzesti'})
            fetchFeeds()
            checkedRows.value = []
        })
}

const handleCheckboxChange = (event, item) => {
    checked(event.target.checked, item);
    const checkAllBtn = document.getElementById('checkAllBtn')

    if (!event.target.checked) {
        checkAllBtn.checked = false;
        allChecked.value = false;
    }
};

const checkAll = () => {
    allChecked.value = !allChecked.value;
    if (allChecked.value) {
        checkedRows.value = items.value.data;
    } else {
        checkedRows.value = [];
    }

    items.value.data.forEach(item => {
        const checkBox = document.getElementById(item.id);
        if (checkBox) {
            checkBox.checked = allChecked.value;
        }
    });
};

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
      {{ checkedRow.id }}
    </span>
        <br>
        <jb-button
            class="mt-3 mb-3"
            color="danger"
            :icon="mdiTrashCan"
            small
            @click="confirmMassDeleteModal(checkedRows.map(row => row.id))"
        />
    </div>

    <table>
        <thead>
        <tr>
            <th>
            <checkbox-cell
                @change="checkAll"
                :id="checkAllBtn"
                class="check-all"
            />
            </th>
            <th></th>
            <th>ID</th>
            <th>Type</th>
            <th>Name</th>
            <th>Text</th>
            <th>Show</th>
            <th>Sticky</th>
            <th>Date</th>
            <th/>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="feed in items.data"
            :key="feed.id"
        >
            <checkbox-cell
                v-if="checkable"
                @change="event => handleCheckboxChange(event, feed)"
                :id="feed.id"
            />
            <td class="image-cel" style="padding: 0; width: 70px">
                <img
                    v-if="feed.file_id"
                    :src="`/storage/feeds/${feed.file_id}`"
                    class="image cursor-image"
                    @click="showImage=true; modalImage=`/storage/feeds/${feed.file_id}`"
                    alt="feed poster"
                />
            </td>
            <td data-label="ID">
                {{ feed.id }}
            </td>
            <td data-label="Type">
                {{ feed.type }}
            </td>
            <td data-label="Name">
              <span :class="`text-${feed.color}-600`">
                {{ feed.username ? feed.username : feed.name }}
              </span>
            </td>
            <td data-label="Text">
                {{ feed.text }}
            </td>
            <td data-label="Show">
                {{ feed.show ? 'Yes' : 'No' }}
            </td>
            <td data-label="Sticky">
                {{ feed.is_sticky ? 'Yes' : 'No' }}
            </td>
            <td data-label="Created">
                <small
                    class="text-gray-500 dark:text-gray-400"
                    :title="feed.updated_at"
                >{{ useTimeAgo(feed.updated_at).value }}</small>
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
                        :to="`${baseUrl}/feeds/${feed.id}/edit`"
                    />
                    <!--            <jb-button-->
                    <!--              color="success"-->
                    <!--              :icon="mdiEye"-->
                    <!--              small-->
                    <!--              @click="isModalActive = true"-->
                    <!--            />-->
                    <jb-button
                        color="danger"
                        :icon="mdiTrashCan"
                        small
                        @click="confirmDeleteModal({...feed, ...{title: feed.text}})"
                    />
                </jb-buttons>
            </td>
        </tr>
        </tbody>
    </table>
    <div class="table-pagination">
        <level class="block">
            <jb-buttons>
                <div
                    v-for="link in items.meta?.links"
                    :key="link.label"
                    class="pagination-item"
                >
                    <jb-button
                        :label="link.label"
                        :active="link.active"
                        @click="goToPage(extractPageNumber(link.url))"
                        :disabled="!link.url"
                    />
                </div>
            </jb-buttons>
            <small>
                Page {{ items.meta?.current_page }} of {{ items.meta?.last_page }}
            </small>
        </level>
    </div>

    <modal-box
        v-model="deleteModal.confirm"
        title="Please confirm action"
        button-label="Confirm"
        has-cancel
        @confirm="deleteModal.id.length > 1 ? confirmedMassDelete() : confirmedDelete()"
    >
        <p>Really want to delete {{ deleteModal.title }}?</p>
    </modal-box>

    <modal-box
        v-model="showImage"
        title="Image"
        button-label="Confirm"
        :has-confirm="false"
    >
        <img :src="modalImage" class="image" alt="poster"/>
    </modal-box>
</template>
<style lang="scss">
.cursor-image {
    cursor: pointer;
}
.check-all{
    background-color: transparent !important;
}
</style>
