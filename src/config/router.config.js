import VueRouter from 'vue-router'
import index from '../page/index'
import post from '../page/post'
import postAdd from '../page/post/add'
import log from '../page/log'
import data from '../page/data'

export default new VueRouter({
  mode: 'history',  
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/post',
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