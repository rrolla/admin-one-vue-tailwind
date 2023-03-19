import {reactive} from "vue";

export const confirmDeleteModal = (item) => {
  deleteModal.confirm = 'confirm';
  deleteModal.id = item.id;
  deleteModal.title = item.title;
}

export const deleteModal = reactive({
  confirm: undefined,
  id: undefined,
  title: undefined,
})

export const deleteModalReset = () => {
  deleteModal.confirm = undefined;
  deleteModal.id = undefined;
  deleteModal.title = undefined;
}
