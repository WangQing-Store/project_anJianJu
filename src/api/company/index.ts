import request from "@/utils/request";
import qs from "qs";

// 模糊搜索全企业列表
export function companyFindList(content:any) {
    return request({
        url: '/apis/company/findList',
        method: 'get',
        params: {
            content
        }
    })
}