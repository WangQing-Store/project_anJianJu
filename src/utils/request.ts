import axios from 'axios'
import store from '../store'
import {getToken,removeToken} from './auth'
// import router from 'vue-router'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改 Accept
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log(response)
    if (response.data.code === 401) {
      removeToken()
      localStorage.removeItem('ExpirationTime')
    //   resolve()
      // console.log(router)
      // router.replace({
      //   path: '/login'
      // })
    //   Message.warning(
    //     "token为空"
    //   )
      if(window.location.href.indexOf('login')==-1){
        window.location.href = "/";
      }

    }
    return response
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)
export default service
