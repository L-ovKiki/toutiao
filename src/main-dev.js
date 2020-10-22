import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'

import './plugins/element.js'

import './assets/css/global.css'
import '@/assets/fonts/iconfont.css'

import { axios } from '@/plugins/axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import dayjs from 'dayjs'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入vue-quill-editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

dayjs().format()
Vue.filter('fongst', function (v, age) { // 使用了moment框架跟中文包
  return dayjs(v).format(age) // 使用了这个事件导入时间加 format的配置样式
})
// 手动配置element

Vue.use(ElementUI)

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 全局注册富文本组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
