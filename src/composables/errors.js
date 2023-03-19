import store from "@/store";

export const useLaravelError = (error) => {
  let errorMessages;
  if (error.response?.status) {
    errorMessages = `${error.response.status} ${error.response.statusText} ${error.response.data?.message} `
  }

  if (error.response?.data?.errors) {
    errorMessages += Object.values(error.response.data.errors).flat().join()
  }

  if (!errorMessages) {
    errorMessages = error.toString()
  }

  store.dispatch('notification/addNotification', {color: 'danger', text: errorMessages})
}
