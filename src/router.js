import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/rankings',
      name: 'rankings',
      component: () => import(/* webpackChunkName: "rankings" */ './views/Rankings.vue')
    },
    {
      path: '/rankings/:season',
      component: () => import(/* webpackChunkName: "rankings" */ './views/Rankings.vue')
    },
    {
      path: '/player/:name',
      name: 'player',
      component: () => import(/* webpackChunkName: "rankings" */ './views/Player.vue')
    },
    {
      path: '/news/:article',
      name: 'article',
      component: () => import(/* webpackChunkName: "news" */ './views/Article.vue')
    },
    {
      path: '/news/tag/:tag',
      name: 'tag',
      component: Home
    },
    {
      path: '/tournaments',
      name: 'tournaments',
      component: () => import(/* webpackChunkName: "tournaments" */ './views/Tournaments.vue')
    },
    {
      path: '/tournaments/data',
      name: 'tournamentDataAll',
      component: () => import(/* webpackChunkName: "tournaments" */ './views/TournamentTable.vue')
    },
    {
      path: '/tournaments/data/:tournament',
      name: 'tournamentData',
      component: () => import(/* webpackChunkName: "tournaments" */ './views/TournamentTable.vue')
    }
  ]
})
