import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from) {
    return { top: 0 }
  }
})

router.afterEach((to, from) => {
  document.title = to.meta.name ? `${to.meta.name} | Exchange Rate Pro` : 'Exchange Rate Pro'
})

export default router

if (import.meta.hot) { 
  handleHotUpdate(router) 
} 