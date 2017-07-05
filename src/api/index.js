import Vue from 'vue'
import router from '../config/router.config'
import axios from 'axios'

const host = `http://${process.env.NODE_ENV === 'production' ? '172.93.43.118' : 'localhost'}:8085/api/`

var instance = axios.create({
  baseURL: host,
  timeout: 3000,
  withCredentials: true,
  headers: {},
  validateStatus: function (status) {
    return status >= 200 && status < 500 // default
  }
})

const apiBlog = {
  post: [],
  log: [],
  tag: [],
  category: [],
  data: [],
  user: [{
    name: 'login',
    method: 'post'
  }, {
    name: 'logout',
    method: 'get'
  }]
}

instance.interceptors.response.use(function (response) {
  if (response.status === 403) {
    router.push({ name: 'login' })
  }
  return response
}, function (error) {
  return Promise.reject(error)
})

Vue.prototype.$http = instance

var API = {}

for (let key of Object.keys(apiBlog)) {
  let list = apiBlog[key]
  if (list.length) {
    list.forEach(item => {
      let name = item.name
      switch (item.method) {
        case 'get': {
          API[`get_${key}_${name}`] = (query) => instance.get(`${key}/${name}`, { params: query })
          break
        }
        case 'post': {
          API[`post_${key}_${name}`] = (body) => instance.post(`${key}/${name}`, body)
          break
        }
      }
    })
  }
  API[`get_${key}`] = (query) => instance.get(key, { params: query })
  API[`getById_${key}`] = (id) => instance.get(key + `/${id}`)
  API[`post_${key}`] = (body) => instance.post(key, body)
  API[`put_${key}`] = (body) => instance.put(key, body)
  API[`delete_${key}`] = (id) => instance.delete(key + `/${id}`)
}

Vue.prototype.$api = API

export default API
