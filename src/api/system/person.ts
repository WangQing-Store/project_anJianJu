import request from "@/utils/request"
import qs from "qs"

//  分页查找所有人员
export function personnel(param:Object) {
    return request({
        url: "/apis/personnel/getPage",
        method: "get",
        params: param
    })
}

// 添加人员信息
export function AddPersonnel(param:any) {
    return request({
        url: "/apis/personnel/addPersonnel",
        method: "post",
        data:qs.stringify(param) 
    })
}

// 关键字(姓名，性别，部门，电话，行政执法编号，单位名称)分页查找所有人员
export function personnelSearch(param:any) {
    return request({
        url: "/apis/personnel/search",
        method: "get",
        params:  param 
    })
}

// 编辑人员
export function updatePersonnel(param:any) {
    return request({
        url: "/apis/personnel/updatePersonnel",
        method: "put",
        data:qs.stringify(param)   
    })
}

//  查询所有启用人员
export function getEnablePersonnel() {
    return request({
        url: "/apis/personnel/getEnablePersonnel",
        method: "get",
    })
}
