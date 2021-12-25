<script setup>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {mdiPencil, mdiEye, mdiTrashCan} from '@mdi/js'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'

const props = defineProps({
  checkable: Boolean
})

const store = useStore()

const darkMode = computed(() => store.state.darkMode)

const items = computed(() => store.state.streams)

const isModalActive = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(10)

const currentPage = ref(0)

const checkedRows = ref([])

const itemsPaginated = computed(
  () => items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

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
        <th v-if="checkable" />
        <th />
        <th>ID</th>
        <th>Title</th>
        <th>Url</th>
        <th>Viewer count</th>
        <th>Live</th>
        <th>Recording</th>
        <th>Created</th>
        <th />
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
        <td class="image-cell">
          <img :src="stream.poster" class="image" width="64" height="64"/>
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
            :title="stream.created_at"
          >{{ stream.created_at }}</small>
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
              :to="`/streams/${stream.id}/edit`"
            />
            <jb-button
              color="success"
              :icon="mdiEye"
              small
              @click="isModalActive = true"
            />
            <jb-button
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
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
</template>
