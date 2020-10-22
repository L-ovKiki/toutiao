import axios from 'axios'

// 导入Nprogress对应的js和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const baseURL = 'http://vue-shop-api.itheima.net'

axios.interceptors.request.use(config => {
  Nprogress.start()
  // console.log(config)
  const token = sessionStorage.getItem('token')
  config.headers.Authorization = token

  return config
})

axios.defaults.baseURL = `${baseURL}/api/private/v1`
// 在request拦截器中展示进度条Nprogress.start()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

export { axios, baseURL }
