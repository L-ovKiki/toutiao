import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Login.vue')
// import Login from './components/Login.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Home.vue')
// import Home from './components/Home.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Welcome.vue')
// import Welcome from './components/Welcome.vue'
const Users = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '@/components/user/Users.vue')
// import Users from './components/user/Users.vue'
const Rights = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '@/components/power/Rights.vue')
// import Rights from './components/power/Rights.vue'
const Roles = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '@/components/power/Roles.vue')
// import Roles from './components/power/Roles.vue'
const Cate = () => import(/* webpackChunkName:"Cate_Params" */ '@/components/goods/Cate.vue')
// import Cate from './components/goods/Cate.vue'
const Params = () => import(/* webpackChunkName:"Cate_Params" */ '@/components/goods/Params.vue')
// import Params from './components/goods/Params.vue'
const List = () => import(/* webpackChunkName:"List_Add" */ '@/components/goods/List.vue')
// import List from './components/goods/List.vue'
const Add = () => import(/* webpackChunkName:"List_Add" */ '@/components/goods/Add.vue')
// import Add from './components/goods/Add.vue'
const Order = () => import(/* webpackChunkName:"Order_Report" */ '@/components/order/Order.vue')
// import Order from './components/order/Order.vue'
const Report = () => import(/* webpackChunkName:"Order_Report" */ '@/components/report/Report.vue')
// import Report from './components/report/Report.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: Login
},
{ path: '/', redirect: '/Login' }, {
  path: '/home',
  component: Home,
  redirect: '/Welcome',
  children: [{
    path: '/welcome', component: Welcome
  }, {
    path: '/users', component: Users
  }, {
    path: '/rights', component: Rights
  }, {
    path: '/roles', component: Roles
  }, {
    path: '/categories', component: Cate
  }, {
    path: '/params', component: Params
  }, {
    path: '/goods', component: List
  }, {
    path: '/goods/add', component: Add
  }, {
    path: '/orders', component: Order
  }, {
    path: '/reports', component: Report
  }]
}

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 代表从那个路径跳转而来的
  // next（）放行 next（'/login'）强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
