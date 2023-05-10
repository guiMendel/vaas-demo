import { createRouter, createWebHistory } from 'vue-router'
import Clients from '@/views/Clients.vue'
import Gallery from '@/views/Gallery.vue'
import Transaction from '@/views/Transaction.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import navigationGuards from './navigationGuards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/profile',
          name: 'profile',
          component: Profile
        },
        {
          path: '/',
          name: 'clients',
          component: Clients
        },
        {
          path: '/transaction/:selectedClientId',
          name: 'transaction',
          component: Transaction,
          props: true
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach(navigationGuards)

export default router
