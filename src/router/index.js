import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Article from '../views/Article.vue'
import Space from '../views/Space.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/space',
      name: 'space',
      component: Space
    },
    {
      path: '/arcitle/:postId',
      name: 'article',
      component: Article
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
  ]
})

export default router
