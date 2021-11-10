import Vue from 'vue'
import Vuex from 'vuex'
import generalModule from './modules/general'
import userModule from './modules/user'
import userDataModule from './modules/userData'
import apiModule from './modules/api'
import wbDataModule from './modules/wbData'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    generalModule,
    userModule,
    userDataModule,
    apiModule,
    wbDataModule
  }
})
