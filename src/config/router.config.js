import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../page/index'
import login from '../page/user/login'
import post from '../page/post'
import postAdd from '../page/post/add'
import log from '../page/log'
import data from '../page/data'
import tag from '../page/tag'
import category from '../page/category'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/post',
      name: 'post',
      component: post
    },
    {
      path: '/post/add', 
      component: postAdd
    },
    {
      path: '/post/:id', 
      component: postAdd
    },
    {
      path: '/tag',
      component: tag
    },
    {
      path: '/category',
      component: category
    },
    {
      path: '/log',
      component: log
    },
    {
      path: '/data',
      component: data
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})