import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import 'firebase/firestore'
import VuetifyConfirm from 'vuetify-confirm'
import VueCrontab from 'vue-crontab'

Vue.config.productionTip = false

Vue.use(VueCrontab)

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
  apiKey: "AIzaSyBtzqiK1yFS0Y1nWRjJyqiLqtXicungYvI",
  authDomain: "wbinform-b5bd1.firebaseapp.com",
  projectId: "wbinform-b5bd1",
  storageBucket: "wbinform-b5bd1.appspot.com",
  messagingSenderId: "494463136344",
  databaseURL: "https://wbinform-b5bd1-default-rtdb.firebaseio.com/",
  appId: "1:494463136344:web:92faf5a71180e03ab1902d"
};

// Initialize Firebase
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
