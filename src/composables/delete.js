import {reactive} from "vue";

export const confirmDeleteModal = (item) => {
    deleteModal.confirm = 'confirm';
    deleteModal.id = [item.id];
    deleteModal.title = item.title;
}

export const confirmMassDeleteModal = (items) => {
    deleteModal.confirm = 'confirm';
    deleteModal.id = items;
    deleteModal.title = 'selected items';
}

export const deleteModal = reactive({
    confirm: undefined,
    id: [],
    title: undefined,
})

export const deleteModalReset = () => {
    deleteModal.confirm = undefined;
    deleteModal.id = [];
    deleteModal.title = undefined;
}
