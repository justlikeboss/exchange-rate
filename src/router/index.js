import { createRouter, createMemoryHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
  scrollBehavior (to, from) {
    return { top: 0 }
  }
})

export default router

if (import.meta.hot) { 
  handleHotUpdate(router) 
} 