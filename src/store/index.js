import Vue from 'vue'
import Vuex from 'vuex'
import generalModule from './general'
import userModule from './user'
import userDataModule from './userData'
import apiModule from './api'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    generalModule,
    userModule,
    userDataModule,
    apiModule
  }
})
