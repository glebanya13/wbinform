import Vue from 'vue'
import App from './App.vue'
import router from './router' // router
import store from './store' // store
import vuetify from './plugins/vuetify' // vuetify
import firebase from 'firebase' // firebase
import 'firebase/firestore' // firestore
import VuetifyConfirm from 'vuetify-confirm' // confirm

Vue.config.productionTip = false

Vue.use(VuetifyConfirm, { // confirm modal settings
  vuetify,
  buttonTrueText: 'Да',
  buttonFalseText: 'Нет',
  color: 'warning',
  title: 'Предупреждение',
  width: 450,
  property: '$confirm'
})

const firebaseConfig = { // db config
  apiKey: "AIzaSyAaxnX9Vc1TD3UeOOQm5ySEMKrU6XePL1k",
  authDomain: "wbinform-4398f.firebaseapp.com",
  projectId: "wbinform-4398f",
  storageBucket: "wbinform-4398f.appspot.com",
  messagingSenderId: "910885086655",
  databaseURL: "https://wbinform-4398f-default-rtdb.firebaseio.com/",
  appId: "1:910885086655:web:568afe110c3104f2aaad0a"
};

const firebaseApp = firebase.initializeApp(firebaseConfig) // init
var db = firebaseApp.database();

var cdb = firebaseApp.firestore();

Vue.$db = db // realtime db
Vue.$cdb = cdb // firestore

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
