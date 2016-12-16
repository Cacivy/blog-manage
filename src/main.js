import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './config/router.config'
import Vuex from 'vuex'
import './config/filter.config'
import ElementUI from 'element-ui'
import './assets/style/comman'
import './assets/style/reset'
import 'element-ui/lib/theme-default/index.css'
import App from './App'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUI)

Vue.config.devtools = true;

new Vue({
  el: '#app',
  router,
  // ...App,
  render: h => h(App)
})
