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
import {useTimeAgo} from "@vueuse/core";
import {checked, checkedRows} from "@/composables/table";
import {confirmDeleteModal, deleteModal, deleteModalReset} from "@/composables/delete";
import {baseUrl} from "@/router";

const props = defineProps({
    checkable: Boolean
})
const store = useStore()

const showImage = ref(false)
const modalImage = ref(undefined)
store.dispatch('feed/fetchFeeds')
const items = computed(() => store.state.feed.feeds)
deleteModalReset()

const confirmedDelete = () => {
    axios.delete(`/api/feeds/${deleteModal.id}`)
        .then(() => {
            store.dispatch('notification/addNotification', {color: 'success', text: 'Ieraksts idzēsts'})
            store.dispatch('feed/fetchFeeds')
        })
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
      {{ checkedRow.id }}
    </span>
    </div>

    <table>
        <thead>
        <tr>
            <th v-if="checkable"/>
            <th/>
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
                @checked="checked($event, feed)"
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
                >{{ useTimeAgo(feed.updated_at) }}</small>
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
        <level>
            <jb-buttons>

            </jb-buttons>
            <small>Page {{ items.meta?.current_page }} of {{ items.meta?.last_page }}</small>
        </level>
    </div>

    <modal-box
        v-model="deleteModal.confirm"
        title="Please confirm action"
        button-label="Confirm"
        has-cancel
        @confirm="confirmedDelete"
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
</style>
