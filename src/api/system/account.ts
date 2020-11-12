import request from "@/utils/request"
import qs from "qs"

// 修改密码
export function updatePwd(data:any) {
  return request({
    url: '/apis/sysUser/updatePwd',
    method: 'put',
    data:qs.stringify(data) 
  })
}