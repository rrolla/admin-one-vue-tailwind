import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue'

export const baseUrl = '/climbing-goose';

const routes = [
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: baseUrl,
    name: 'home',
    component: Home
  },
  {
    meta: {
      title: 'Feeds'
    },
    path: `${baseUrl}/feeds`,
    name: 'feeds',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "feeds-list" */ '../views/feeds/Feeds.vue')
  },
  {
    meta: {
      title: 'Create feed'
    },
    path: `${baseUrl}/feeds/create`,
    name: 'feedCreate',
    component: () => import(/* webpackChunkName: "feed-create" */ '../views/feeds/FeedCreate.vue')
  },
  {
    meta: {
      title: 'Create warning'
    },
    path: `${baseUrl}/feeds/warning/create`,
    name: 'warningCreate',
    component: () => import(/* webpackChunkName: "warning-create" */ '../views/feeds/WarningCreate.vue')
  },
  {
    meta: {
      title: 'Create ban'
    },
    path: `${baseUrl}/feeds/ban/create`,
    name: 'banCreate',
    component: () => import(/* webpackChunkName: "ban-create" */ '../views/feeds/BanCreate.vue')
  },
  {
    meta: {
      title: 'Media'
    },
    path: `${baseUrl}/media`,
    name: 'media',
    component: () => import(/* webpackChunkName: "media-list" */ '../views/media/Media.vue')
  },
  {
    meta: {
      title: 'Create media'
    },
    path: `${baseUrl}/media/create`,
    name: 'mediaCreate',
    component: () => import(/* webpackChunkName: "media-create" */ '../views/media/MediaCreate.vue')
  },
  {
    meta: {
      title: 'Edit media'
    },
    path: `${baseUrl}/media/:mediaId/edit`,
    name: 'mediaEdit',
    component: () => import(/* webpackChunkName: "media-edit" */ '../views/media/MediaEdit.vue')
  },
  {
    meta: {
      title: 'Streams'
    },
    path: `${baseUrl}/streams`,
    name: 'streams',
    component: () => import(/* webpackChunkName: "streams" */ '../views/streams/Streams.vue')
  },
  {
    meta: {
      title: 'Stream create'
    },
    path: `${baseUrl}/streams/create`,
    name: 'streamCreate',
    component: () => import(/* webpackChunkName: "stream-create" */ '../views/streams/StreamCreate.vue')
  },
  {
    meta: {
      title: 'Stream edit'
    },
    path: `${baseUrl}/streams/:streamId/edit`,
    name: 'streamEdit',
    component: () => import(/* webpackChunkName: "stream-edit" */ '../views/streams/StreamEdit.vue')
  },
  {
    meta: {
      title: 'Social posts'
    },
    path: `${baseUrl}/social-posts`,
    name: 'socialPosts',
    component: () => import(/* webpackChunkName: "social-posts" */ '../views/social-posts/SocialPosts.vue'),
  },
  {
    meta: {
      title: 'Create social post'
    },
    path: `${baseUrl}/social-posts/create`,
    name: 'socialPostCreate',
    component: () => import(/* webpackChunkName: "social-post-create" */ '../views/social-posts/SocialPostCreate.vue')
  },
  {
    meta: {
      title: 'Edit social post'
    },
    path: `${baseUrl}/social-posts/:socialPostId/edit`,
    name: 'socialPostEdit',
    component: () => import(/* webpackChunkName: "social-post-edit" */ '../views/social-posts/SocialPostEdit.vue')
  },
  {
    meta: {
      title: 'Tables'
    },
    path: `${baseUrl}/tables`,
    name: 'tables',
    component: () => import(/* webpackChunkName: "tables" */ '@/views/Tables.vue')
  },
  {
    meta: {
      title: 'Forms'
    },
    path: `${baseUrl}/forms`,
    name: 'forms',
    component: () => import(/* webpackChunkName: "forms" */ '@/views/Forms.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: `${baseUrl}/profile`,
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: `${baseUrl}/ui`,
    name: 'ui',
    component: () => import(/* webpackChunkName: "ui" */ '@/views/Ui.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: `${baseUrl}/responsive`,
    name: 'responsive',
    component: () => import(/* webpackChunkName: "responsive" */ '@/views/Responsive.vue')
  },
  {
    meta: {
      title: 'Login',
      fullScreen: true
    },
    path: `${baseUrl}/login`,
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    meta: {
      title: 'Error',
      fullScreen: true
    },
    path: `${baseUrl}/error`,
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/Error.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || {top: 0}
  }
})

export default router
