import request from "@/utils/request";
import qs from "qs";
import Layout from "@/views/layout/Layout.vue";

export function getSide() {
  return request({
    url: "/apis/sysModule/getSide",
    method: "get",
  });
}

// 生成动态路由
export function generaMenu(routers: any, data: any) {
  data.forEach((item: any) => {
    const menu = {
      path: item.href,
      component:
        item.component == "Layout"
          ? Layout
          : () => import("@/views" + item.component + "/index"),
      children: [],
      meta: { title: item.name, id: item.id, icon: item.icon },
    };
    if (item.children && item.children[0].href != "editable") {
      generaMenu(menu.children, item.children);
    }
    routers.push(menu);
  });
  return routers;
}

//  查找所有可用的角色
export function findEnableRole() {
  return request({
    url: "/apis/sysRole/findEnableRole",
    method: "get",
  });
}

// 添加角色
export function addRole(param: any) {
  return request({
    url: "/apis/sysRole/addRole",
    method: "post",
    data: qs.stringify(param),
  });
}

// 关键字(名称，描述，创建者)查找
export function sysRoleSearch(param: any) {
  return request({
    url: "/apis/sysRole/search",
    method: "get",
    params: param,
  });
}

//  修改角色信息
export function updateRole(param: any) {
  return request({
    url: "/apis/sysRole/updateRole",
    method: "put",
    data: qs.stringify(param),
  });
}

//  根据角色ID获取模块
export function getRoleModule(roleId: any) {
  return request({
    url: "/apis/roleModule/getRoleModule",
    method: "get",
    params: {
      roleId,
    },
  });
}

//  添加/删除角色模块(全选时父子节点冲突，则只传子节点ID)
export function addDelRoleModule(param: any) {
  return request({
    url: "/apis/roleModule/adddel",
    method: "post",
    data: qs.stringify(param),
  });
}
