<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'td'
  },
  id: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['checked'])

const checked = ref(false)

watch(checked, newVal => {
  emit('checked', newVal)
})
</script>

<template>
  <component
    :is="type"
    class="checkbox-cell"
  >
    <label class="checkbox">
      <input
        v-model="checked"
        type="checkbox"
        :id="id"
      >
      <span class="check" />
    </label>
  </component>
</template>
