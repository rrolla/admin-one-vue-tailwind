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
import {useTimeAgo} from "@vueuse/core";
import {checked, checkedRows} from "@/composables/table";
import {confirmDeleteModal, deleteModal, deleteModalReset} from "@/composables/delete";

const props = defineProps({
    checkable: Boolean
})
const store = useStore()

checkedRows.value = []

const showImage = ref(false)
const modalImage = ref(undefined)
store.dispatch('stream/fetchStreams')
const items = computed(() => store.state.stream.streams)
deleteModalReset()

const confirmedDelete = () => {
    axios.delete(`/api/streams/${deleteModal.id}`)
        .then(() => {
            store.dispatch('notification/addNotification', {color: 'success', text: 'Straume idzēsta'})
            store.dispatch('stream/fetchStreams')
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
      <th>Title</th>
      <th>Url</th>
      <th>Viewer count</th>
      <th>Live</th>
      <th>Recording</th>
      <th>Created</th>
      <th/>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="stream in items.data"
      :key="stream.id"
    >
      <checkbox-cell
        v-if="checkable"
        @checked="checked($event, stream)"
      />
        <td class="image-cel" style="padding: 0; width: 70px">
            <img
                v-if="stream.poster"
                :src="stream.poster"
                class="image cursor-image"
                @click="showImage=true; modalImage=stream.poster"
                alt="stream poster"
            />
        </td>
      <td data-label="ID">
        {{ stream.id }}
      </td>
      <td data-label="Title">
        {{ stream.title }}
      </td>
      <td data-label="Url">
        {{ stream.url }}
      </td>
      <td data-label="Viewer count">
        {{ stream.viewer_count }}
      </td>
      <td data-label="Live">
        {{ stream.is_live ? 'Yes' : 'No' }}
      </td>
      <td data-label="Recording">
        {{ stream.is_recording ? 'Yes' : 'No' }}
      </td>
      <td data-label="Created">
        <small
          class="text-gray-500 dark:text-gray-400"
          :title="stream.updated_at"
        >{{ useTimeAgo(stream.updated_at).value }}</small>
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
            :to="`${baseUrl}/streams/${stream.id}/edit`"
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
            @click="confirmDeleteModal(stream)"
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
