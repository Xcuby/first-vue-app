import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import PageAccueilleProfile from './components/PageAccueilleProfile'
import Quizz from './components/Quizz'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.use(VueAxios, axios)
Vue.use(VueRouter)

const routes = [
  { path: '/PageAccueilleProfile', component: PageAccueilleProfile, meta: { requiresAuth: true } },
  { path: '/', component: PageAccueilleProfile, meta: { requiresAuth: false } },
  { path: '/Quizz', component: Quizz, meta: { requiresAuth: false } }
]

const router = new VueRouter({ routes,
  mode: 'history' })

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
