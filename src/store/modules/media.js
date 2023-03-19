import axios from "axios";

const state = {
  mediaList: {},
  media: {},
}

const mutations = {
  UPDATE_MEDIA_LIST(state, mediaList) {
    state.mediaList = mediaList;
  },

  UPDATE_MEDIA(state, media) {
    state.media = media;
  },
}

const actions = {
  async fetchMedia({commit}) {
    const response = await axios.get(`/api/media`, {withCredentials: true});

    return commit("UPDATE_MEDIA_LIST", response.data);
  },

  async fetchMediaById({commit}, mediaId) {
    const response = await axios.get(`/api/media/${mediaId}`, {withCredentials: true});

    return commit("UPDATE_MEDIA", response.data.data);
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
