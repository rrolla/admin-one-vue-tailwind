import axios from "axios";

const state = {
  socialPosts: {},
  socialPost: {},
}

const mutations = {
  UPDATE_SOCIAL_POSTS(state, socialPosts) {
    state.socialPosts = socialPosts;
  },

  UPDATE_SOCIAL_POST(state, socialPost) {
    state.socialPost = socialPost;
  },
}

const actions = {
  async fetchSocialPosts({commit}) {
    const response = await axios.get(`/api/social-posts`, {withCredentials: true});

    return commit("UPDATE_SOCIAL_POSTS", response.data);
  },

  async fetchSocialPost({commit}, socialPostId) {
    const response = await axios.get(`/api/social-posts/${socialPostId}`, {withCredentials: true});

    return commit("UPDATE_SOCIAL_POST", response.data.data);
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
