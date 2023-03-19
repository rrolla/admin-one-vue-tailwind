<script setup>
import {computed} from 'vue'
import {useStore} from 'vuex'
import {mdiPencil, mdiTrashCan} from '@mdi/js'
import CheckboxCell from '../../components/CheckboxCell.vue'
import Level from '../../components/Level.vue'
import JbButtons from '../../components/JbButtons.vue'
import JbButton from '../../components/JbButton.vue'
import ModalBox from '../../components/ModalBox.vue'
import axios from 'axios'
import {baseUrl} from "@/router";
import {useTimeAgo} from "@vueuse/core";
import {confirmDeleteModal, deleteModal, deleteModalReset} from "@/composables/delete";
import {useLaravelError} from "@/composables/errors";
import {checked, checkedRows} from "@/composables/table";

const props = defineProps({
  checkable: Boolean
})
const store = useStore()

store.dispatch('socialPost/fetchSocialPosts')
const items = computed(() => store.state.socialPost.socialPosts)
deleteModalReset()

const confirmedDelete = () => {
  axios.delete(`/api/social-posts/${deleteModal.id}`)
    .then(() => {
        store.dispatch('notification/addNotification', {color: 'success', text: 'Sociālais ieraksts idzēsts'})
        store.dispatch('socialPost/fetchSocialPosts')
      }
    )
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
      <th>ID</th>
      <th>Title</th>
      <th>Text</th>
      <th>Updated</th>
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
          :title="socialPost.updated_at"
        >{{ useTimeAgo(socialPost.updated_at) }}</small>
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
