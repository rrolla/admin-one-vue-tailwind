import axios from "axios";

const state = {
  streams: {},
  stream: {},

  streamsStats: [],
}

const mutations = {
  UPDATE_STREAMS(state, streams) {
    state.streams = streams;
  },

  UPDATE_STREAM(state, stream) {
    state.stream = stream;
  },

  UPDATE_STREAMS_STATS(state, streamsStats) {
    state.streamsStats = streamsStats;
  },
}

const actions = {
  async fetchStreams({commit}) {
    const response = await axios.get(`/api/streams`, {withCredentials: true});

    return commit("UPDATE_STREAMS", response.data);
  },

  async fetchStream({commit}, streamId) {
    const response = await axios.get(`/api/streams/${streamId}`, {withCredentials: true});

    return commit("UPDATE_STREAM", response.data.data);
  },

  async fetchStreamsStats({commit}) {
    const response = await axios.get(`/api/streams/stats`, {withCredentials: true});

    return commit("UPDATE_STREAMS_STATS", response.data.data);
  },
}

const getters = {
  streamStatViewers: state => state.streamsStats.find((stat) => stat.users === 'viewers')?.count ?? 0,
  streamStatGuest: state => state.streamsStats.find((stat) => stat.users === 'guests')?.count ?? 0,
  streamStatTotal: (state, getters) => getters.streamStatViewers + getters.streamStatGuest,
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
