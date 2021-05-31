import {
  Router,
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/pages/Home/Home.vue'),
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('@/pages/About/About.vue'),
  },
]

export const createRouter = (): Router => {

  return _createRouter({
    /*
      @desc
      use appropriate history implementation for server/client
      import.meta.env.SSR is injected by Vite.
    */
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  })
}
