import { createRouter, RouteRecordRaw, createWebHistory, RouterView } from 'vue-router'
import { userStore } from '@/store/user'
import { h } from 'vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: import('@/views/Layout.vue'),
    children: [
      { path: '/', component: import('@/views/home/home.vue') },
      { path: '/category/:id', component: import('@/views/category/index.vue') },
      { path: '/category/sub/:id', component: import('@/views/category/sub.vue') },
      { path: '/product/:id', component: import('@/views/goods/index.vue') },
      { path: '/member/checkout', component: import('@/views/menmber/pay/checkout.vue') },
      { path: '/member/pay', component: import('@/views/menmber/pay/index.vue') },
      { path: '/pay/callback', component: import('@/views/menmber/pay/components/result.vue') },
      {
        path: '/member',
        component: import('@/views/menmber/Layout.vue'),
        children: [
          { path: '/member', component: import('@/views/menmber/home/index.vue') },
          {
            path: '/member/order/',
            // vue3.0 需要有嵌套关系才能模糊匹配
            component: { render: () => h(RouterView) },
            children: [
              { path: '', component: import('@/views/menmber/order/index.vue') },
              { path: ':id', component: import('@/views/menmber/order/detail.vue') }
            ]
          }
        ]
      }
    ]
  },
  { path: '/login', component: import('@/views/login/index.vue') },
  { path: '/cart', component: import('@/views/cart/index.vue') }
]
const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})
// 前置导航守卫
router.beforeEach((to, from, next) => {
  const store = userStore()
  // 用户信息
  const { token } = store.userInfo
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    // next({ path: '/login', query: { redirectUrl: to.fullPath } })
    next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})
export { router }
