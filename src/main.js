import Vue from 'vue'
import router from './config/router.config'
import store from './vuex'
import { sync } from 'vuex-router-sync'
import './config/filter.config'
import API from './api'
import ElementUI from 'element-ui'
import './assets/style/comman'
import 'element-ui/lib/theme-default/index.css'
import App from './App'

Vue.use(ElementUI)
sync(store, router)

// getUser
API.get_user().then(res => {
  if (!res.error) {
    store.dispatch('setUser', res.data.result)
  }
})

// router valid user
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && (!store.state.userinfo || !store.state.userinfo.username)) {
    next({name: 'login'})
  }
  next()
})

Vue.config.devtools = true;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
