<script setup>
import {computed} from 'vue'
import {useStore} from 'vuex'
import {mdiPencil, mdiTrashCan} from '@mdi/js'
import CheckboxCell from '../../components/CheckboxCell.vue'
import Level from '../../components/Level.vue'
import JbButtons from '../../components/JbButtons.vue'
import JbButton from '../../components/JbButton.vue'
import {baseUrl} from "@/router";
import {useTimeAgo} from "@vueuse/core";
import ModalBox from "@/components/ModalBox.vue";
import axios from "axios";
import {confirmDeleteModal, deleteModal, deleteModalReset} from "@/composables/delete";
import {useLaravelError} from "@/composables/errors";
import {checked, checkedRows} from "@/composables/table";

const props = defineProps({
  checkable: Boolean
})
const store = useStore()
const darkMode = computed(() => store.state.darkMode)

store.dispatch('media/fetchMedia')
const items = computed(() => store.state.media.mediaList)
deleteModalReset()

const confirmedDelete = () => {
  axios.delete(`/api/media/${deleteModal.id}`)
    .then(() => {
      store.dispatch('notification/addNotification', {color: 'success', text: 'Media idzēsta'})
      store.dispatch('media/fetchMedia')
    })
    .catch(useLaravelError)
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
      <th>Title</th>
      <th>Url</th>
      <th>Type</th>
      <th>Sort</th>
      <th>Updated</th>
      <th/>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="media in items.data"
      :key="media.id"
    >
      <checkbox-cell
        v-if="checkable"
        @checked="checked($event, media)"
      />
      <td class="image-cel" style="padding: 0; width: 70px">
        <img :src="media.poster" class="image" alt="media poster"/>
      </td>
      <td data-label="ID">
        {{ media.id }}
      </td>
      <td data-label="Title">
        {{ media.title }}
      </td>
      <td data-label="Url">
        {{ media.url }}
      </td>
      <td data-label="Type">
        {{ media.type }}
      </td>
      <td data-label="Sort">
        {{ media.sort }}
      </td>
      <td data-label="Created">
        <small
          class="text-gray-500 dark:text-gray-400"
          :title="media.updated_at"
        >{{ useTimeAgo(media.updated_at) }}</small>
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
            :to="`${baseUrl}/media/${media.id}/edit`"
          />
          <jb-button
            color="danger"
            :icon="mdiTrashCan"
            small
            @click="confirmDeleteModal(media)"
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
</template>
