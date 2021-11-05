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
  apiKey: "AIzaSyBtzqiK1yFS0Y1nWRjJyqiLqtXicungYvI",
  authDomain: "wbinform-b5bd1.firebaseapp.com",
  projectId: "wbinform-b5bd1",
  storageBucket: "wbinform-b5bd1.appspot.com",
  messagingSenderId: "494463136344",
  appId: "1:494463136344:web:92faf5a71180e03ab1902d"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

Vue.$db = db

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
