const state = {
  notifications: [],
}

const mutations = {
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push(notification);
    setTimeout(() => state.notifications.shift(), 8000)
  },
}

const actions = {
  async addNotification({commit}, notification) {
    return commit('ADD_NOTIFICATION', notification);
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
