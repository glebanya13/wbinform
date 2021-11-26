import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import 'firebase/firestore'
import VuetifyConfirm from 'vuetify-confirm'

Vue.config.productionTip = false

Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Да',
  buttonFalseText: 'Нет',
  color: 'warning',
  title: 'Предупреждение',
  width: 450,
  property: '$confirm'
})

const firebaseConfig = {
  apiKey: "AIzaSyAaxnX9Vc1TD3UeOOQm5ySEMKrU6XePL1k",
  authDomain: "wbinform-4398f.firebaseapp.com",
  projectId: "wbinform-4398f",
  storageBucket: "wbinform-4398f.appspot.com",
  messagingSenderId: "910885086655",
  databaseURL: "https://wbinform-4398f-default-rtdb.firebaseio.com/",
  appId: "1:910885086655:web:568afe110c3104f2aaad0a"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
var db = firebaseApp.database();

var cdb = firebaseApp.firestore();

Vue.$db = db
Vue.$cdb = cdb

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
