import Vue from 'vue'
import router from '../config/router.config'
import axios from 'axios'

const host = 'http://localhost:8085/api/'

var instance = axios.create({
  baseURL: host,
  timeout: 3000,
  withCredentials: true,
  headers: {},
  validateStatus: function (status) {
    return status >= 200 && status < 500; // default
  }
});

const apiBlog = {
    post: 'post',
    log: 'log',
    tag: 'tag',
    category: 'category',
    data: 'data',
    login: 'login',
    logout: 'logout'
}

instance.interceptors.response.use(function (response) {
    if (response.status === 403) {
        router.push({name: 'login'})
    }
    return response;
}, function (error) {
    return Promise.reject(error);
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

Vue.prototype.$api = API

export default instance