import request from '@/utils/request'
import qs from 'qs'

//  关键字(用户名，姓名，单位，联系方式，角色)分页查找所有角色
export function sysUserSearch(param:any) {
    return request({
        url: '/apis/sysUser/search',
        method: 'get',
        params:param
    })
}

//  添加用户
export function sysUserAddUser(param:any) {
    return request({
        url: '/apis/sysUser/addUser',
        method: 'post',
        data:qs.stringify(param)
    })
}

//  用户名查重
export function sysUserCheckRepeat(username:string) {
    return request({
        url: '/apis/sysUser/checkRepeat',
        method: 'get',
        params: {
            username
        }
    })
}

//  重置用户密码
export function sysUserResetPassword(param:any) {
    return request({
        url: '/apis/sysUser/resetPassword',
        method: 'put',
        data:qs.stringify(param) 
    })
}

//  编辑用户
export function sysUserUpdateUser(param:any) {
    return request({
        url: '/apis/sysUser/updateUser',
        method: 'put',
        data:qs.stringify(param) 
    })
}

// 重置用户密码
export function resetPassword(userId:any) {
    return request({
        url: "/apis/sysUser/resetPassword",
        method: "put",
        data:qs.stringify({userId})
    })
}
