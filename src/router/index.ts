import { createRouter, createWebHistory } from 'vue-router'
import Note from '../views/Note.vue'
import Notes from '../views/Notes.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/notes',
      name: 'notes',
      component: Notes
    },
    {
      path: '/note/:id?',
      name: 'note',
      component: Note
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})

export default router