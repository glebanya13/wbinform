import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Store from '../store'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'
import CreateCampaing from '../views/CreateCampaing.vue'
import Campaings from '../views/Campaings.vue'
import Campaing from '../views/Campaing.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { authRequired: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { authRequired: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { authRequired: true }
  },
  {
    path: '/campaign/create',
    name: 'create-campaign',
    component: CreateCampaing,
    meta: { authRequired: true }
  },
  {
    path: '/campaigns',
    name: 'campaigns',
    component: Campaings,
    meta: { authRequired: true }
  },
  {
    path: '/campaigns/:id',
    name: 'campaign:id',
    component: Campaing,
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
