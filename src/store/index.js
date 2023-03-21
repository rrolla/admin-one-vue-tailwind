import {createStore} from 'vuex'
import axios from 'axios'
import {darkModeKey} from '@/config.js'
import media from "@/store/modules/media";
import stream from "@/store/modules/stream";
import socialPost from "@/store/modules/socialPost";
import notification from "@/store/modules/notification";
import feed from "@/store/modules/feed";
import room from "@/store/modules/room";

export default createStore({
  state: {
    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* fullScreen - fullscreen form layout (e.g. login page) */
    isFullScreen: false,

    /* Aside */
    isAsideMobileExpanded: false,
    isAsideLgActive: false,

    /* Dark mode */
    darkMode: false,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],

    user: {},
  },

  getters: {
    authUser: (state) => state.user,
  },

  mutations: {
    /* A fit-them-all commit */
    basic(state, payload) {
      state[payload.key] = payload.value
    },

    /* User */
    user(state, payload) {
      if (payload.name) {
        state.userName = payload.name
      }
      if (payload.email) {
        state.userEmail = payload.email
      }
      if (payload.avatar) {
        state.userAvatar = payload.avatar
      }
    },

    UPDATE_USER(state, user) {
      state.user = user;
    },
  },

  actions: {
    asideMobileToggle({commit, state}, payload = null) {
      const isShow = payload !== null ? payload : !state.isAsideMobileExpanded

      document.getElementById('app').classList[isShow ? 'add' : 'remove']('ml-60', 'lg:ml-0')

      document.documentElement.classList[isShow ? 'add' : 'remove']('m-clipped')

      commit('basic', {
        key: 'isAsideMobileExpanded',
        value: isShow
      })
    },

    asideLgToggle({commit, state}, payload = null) {
      commit('basic', {key: 'isAsideLgActive', value: payload !== null ? payload : !state.isAsideLgActive})
    },

    fullScreenToggle({commit, state}, value) {
      commit('basic', {key: 'isFullScreen', value})

      document.documentElement.classList[value ? 'add' : 'remove']('full-screen')
    },

    darkMode({commit, state}) {
      const value = !state.darkMode

      document.documentElement.classList[value ? 'add' : 'remove']('dark')

      localStorage.setItem(darkModeKey, value ? '1' : '0')

      commit('basic', {
        key: 'darkMode',
        value
      })
    },

    fetch({commit}, payload) {
      axios
        .get(`data-sources/${payload}.json`)
        .then((r) => {
          if (r.data) {
            if (r.data.data) {
              commit('basic', {
                key: payload,
                value: r.data.data
              })
            }
            if (r.data.status) {
              commit('basic', {
                key: `${payload}Status`,
                value: r.data.status
              })
            }
          }
        })
        .catch(error => {
          // alert(error.message)
        })
    },

    async fetchUser({commit}) {
      const response = await axios.get(`/api/users/me`, {withCredentials: true});
      const authUser = response.data.data;

      commit("UPDATE_USER", authUser);

      commit('user', {
        name: authUser.name,
        email: authUser.email,
        avatar: 'https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93'
      })
    },
  },
  modules: {
    media,
    stream,
    socialPost,
    notification,
    feed,
    room,
  }
})
