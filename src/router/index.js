import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import SignupPage from '../pages/SignupPage.vue'
import Store from '../store'
import ProfilePage from '../pages/ProfilePage.vue'
import BalancePage from '../pages/BalancePage.vue'
import CreateCampaingPage from '../pages/CreateCampaingPage.vue'
import CampaingsPage from '../pages/CampaingsPage.vue'
import CampaingPage from '../pages/CampaingPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home-page',
    component: HomePage,
    meta: { authRequired: true }
  },
  {
    path: '/signup',
    name: 'signup-page',
    component: SignupPage
  },
  {
    path: '/profile',
    name: 'profile-page',
    component: ProfilePage,
    meta: { authRequired: true }
  },
  {
    path: '/balance',
    name: 'balance-page',
    component: BalancePage,
    meta: { authRequired: true }
  },
  {
    path: '/campaing/create',
    name: 'create-campaign-page',
    component: CreateCampaingPage,
    meta: { authRequired: true }
  },
  {
    path: '/campaings',
    name: 'campaings',
    component: CampaingsPage,
    meta: { authRequired: true }
  },
  {
    path: '/campaings/:id',
    name: 'campaing-page:id',
    component: CampaingPage,
    props: true,
    meta: { authRequired: true }
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  Store.dispatch('INIT_AUTH')
    .then(user => {
      if (to.matched.some(route => route.meta.authRequired)) {
        if (user)
          next()
        else
          next('/signup')
      } else {
        next()
      }
    })
})

export default router
