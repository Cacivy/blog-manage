const host = 'http://localhost:8080/api/'

const apiBlog = {
    post: 'post',
    log: 'log',
    tag: 'tag',
    category: 'category'
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
    API[`get_${item}`] = (query) => instance.get(apiBlog[item], {params: query})
    API[`getById_${item}`] = (id) => instance.get(apiBlog[item] + `/${id}`)
    API[`post_${item}`] = (body) => instance.post(apiBlog[item], body)
    API[`put_${item}`] = (body) => instance.put(apiBlog[item], body)
    API[`delete_${item}`] = (id) => instance.delete(apiBlog[item] + `/${id}`)
}

export default API