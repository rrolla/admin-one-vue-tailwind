import axios from "axios";

const state = {
    activeRoom: {},
}

const mutations = {
    UPDATE_ACTIVE_ROOM(state, activeRoom) {
        state.activeRoom = activeRoom;
    },
}

const actions = {
    async fetchActiveRoom({commit}) {
        const response = await axios.get(`/api/guest/rooms/active?include=users,users.settings`, {withCredentials: true});

        return commit("UPDATE_ACTIVE_ROOM", response.data.data);
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
