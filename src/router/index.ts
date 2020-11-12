import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from "@/views/layout/Layout.vue"

export let constantRouterMap: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name:'login',
    component: () => import('@/views/login.vue'),
    // hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: "Layout",
    meta: { title: '首页', icon: 'home'},
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'home'}
      },
      {
        path: 'security',
        component: () => import('@/views/security/index.vue'),
        meta: { title: '日常安全监督', icon: 'home'}
      },
    ]
  },
    ]
  


const router = createRouter({
  history: createWebHashHistory(),
  routes:constantRouterMap
})

export default router
