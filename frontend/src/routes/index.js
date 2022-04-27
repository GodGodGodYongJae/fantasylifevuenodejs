import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/MovieIndexPage'
import Show from '@/components/MovieShowPage'
import Main from '@/components/main'
import ImageUpload from '@/components/imageuploadpage'

Vue.use(Router)
export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },

    {
      path: '/main',
      name: 'mains',
      component: Main
    },
    
    {
      path:'/img',
      name:'img',
      component: ImageUpload
    },
  ]
})