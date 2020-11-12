import request from '@/utils/request';
import qs from 'qs';

//  获取token
export function login(username: string, password: string) {
   return request({
        url: "/apis/sysUser/token",
        method: "get",
        params: {
            username,
            password
        }
    })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/apis/sysUser/info',
    method: 'get'
  })
}