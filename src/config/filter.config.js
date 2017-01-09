import Vue from 'vue'
import moment from 'moment'

Vue.filter('date', (value) => {
  return moment(value).format('YYYY-MM-DD')
})

Vue.filter('time', (value) => {
  return moment(value).format('YYYY-MM-DD hh:mm:ss')
})
