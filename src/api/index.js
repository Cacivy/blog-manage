const host = 'http://localhost:8080/api/'

const apiBlog = {
    post: 'post',
    log: 'log'
}

import Vue from 'vue'
import axios from 'axios'
import {toQueryString} from '../utils'

var instance = axios.create({
  baseURL: host,
  timeout: 3000,
  headers: {}
});

Vue.prototype.$http = instance

var API = {}

for (let item of Object.keys(apiBlog)) {
    API[`get_${item}`] = (query) => Vue.prototype.$http.get(apiBlog[item] + toQueryString(query))
    API[`getById_${item}`] = (id) => Vue.prototype.$http.get(apiBlog[item] + `/${id}`)
    API[`post_${item}`] = (body) => Vue.prototype.$http.post(apiBlog[item], body)
    API[`put_${item}`] = (body) => Vue.prototype.$http.put(apiBlog[item], body)
    API[`delete_${item}`] = (id) => Vue.prototype.$http.delete(apiBlog[item] + `/${id}`)
}

export default API