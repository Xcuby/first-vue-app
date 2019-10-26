import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import PageAccueille from './components/PageAccueille'
import PageConnexion from './components/PageConnexion'
import PageInscription from './components/PageInscription'
import PageProfile from './components/PageProfile'
import PageHistoriquePersonnel from './components/PageHistoriquePersonnel'
import PageClassementGeneral from './components/PageClassementGeneral'
import Quizz from './components/Quizz'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.use(VueAxios, axios)
Vue.use(VueRouter)

const routes = [
  { path: '/PageAccueille', component: PageAccueille, meta: { requiresAuth: true } },
  { path: '/', component: PageAccueille, meta: { requiresAuth: false } },
  { path: '/PageConnexion', component: PageConnexion, meta: { requiresAuth: true } },
  { path: '/PageInscription', component: PageInscription, meta: { requiresAuth: true } },
  { path: '/PageProfile', component: PageProfile, meta: { requiresAuth: true } },
  { path: '/PageHistoriquePersonnel', component: PageHistoriquePersonnel, meta: { requiresAuth: false } },
  { path: '/PageClassementGeneral', component: PageClassementGeneral, meta: { requiresAuth: false } },
  { path: '/Quizz', component: Quizz, meta: { requiresAuth: false } }
]

const router = new VueRouter({ routes,
  mode: 'history' })

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
