import Vue from 'vue';
import moment from 'moment'

Vue.filter('date', function(value) {
    return moment(value).format('YYYY-MM-DD')
})

Vue.filter('time', function(value) {
    return moment(value).format('YYYY-MM-DD hh:mm:ss')
})