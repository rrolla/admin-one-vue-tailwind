import axios from "axios";

const state = {
    feeds: {},
    feed: {},
}

const mutations = {
    UPDATE_FEEDS(state, streams) {
        state.feeds = streams;
    },

    UPDATE_FEED(state, stream) {
        state.feed = stream;
    },
}

const actions = {
    async fetchFeeds({commit}, page = 1) {
        const response = await axios.get(`/api/feeds?page=${page}`, {withCredentials: true});

        return commit("UPDATE_FEEDS", response.data);
    },

    async fetchFeed({commit}, feedId) {
        const response = await axios.get(`/api/feeds/${feedId}`, {withCredentials: true});

        return commit("UPDATE_FEED", response.data.data);
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
