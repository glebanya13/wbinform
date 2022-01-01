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

const firebaseConfig = {
  apiKey: "AIzaSyCZsQfsWko0Pem76oPMvtEC_NgO9vSOQ0Y",
  authDomain: "wbinform-93078.firebaseapp.com",
  databaseURL: "https://wbinform-93078-default-rtdb.firebaseio.com",
  projectId: "wbinform-93078",
  storageBucket: "wbinform-93078.appspot.com",
  messagingSenderId: "320039449657",
  appId: "1:320039449657:web:936e47884a11c4220ec9e8"
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
