import request from "@/utils/request";
import qs from "qs";

// 根据键值获取数据
export function getByKey(key:string) {
    return request({
        url: "apis/dict/getByKey",
        method: "get",
        params: {
            key
        }
    })
}