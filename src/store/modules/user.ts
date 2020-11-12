import { login, getInfo } from "@/api/login/login";
import { getToken,setToken, removeToken} from "@/utils/auth"; // setDict,// setRoleType,// setWorkFlow
import { getSide, generaMenu } from "@/api/system/role";
import router,{ constantRouterMap }  from "@/router";

const user = {
  state: {
    token: getToken(),
    name: "",
    roleName:"",
    avatar: "",
    roles: [],
    routers: [],
    addRouters:[]
  },
   mutations: {
    SET_TOKEN: (state:any, token:any) => {
      state.token = token;
    },
    SET_NAME: (state:any, name:any) => {
      state.name = name;
     },
    SET_ROLENAME: (state:any, name:any) => {
      state.roleName = name;
     },
    SET_AVATAR: (state:any, avatar:any) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state:any, roles:any) => {
      state.roles = roles;
    },
    SET_ROUTER: (state:any, routers:any) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
      router.options.routes = state.routers;
      for (let item of routers) {
        router.addRoute(item);
      }
    },
    CLEAR_ROUTER: (state:any, routers:any) => {
      router.options.routes = routers;
    }
  },
  actions: {
    // 登录
    Login({ commit }:any, userInfo:any) {
      commit("SET_ROLES", [], { root: true });
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            const data = response.data;
            if (data.msg) {
              // Message.error({
              //   message: data.msg
              // });
            }
            // console.log(response)
            setToken(data.data.jws);
            localStorage.setItem("ExpirationTime", data.data.expirationTime);
            commit("SET_TOKEN", data.data.jws);
            // setDict()
            // setRoleType()
            // setWorkFlow()
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit }:any) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(response => {
            const data = response.data;
            // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            //   commit('SET_ROLES', data.roles)
            // } else {
            //   reject('getInfo: roles must be a non-null array !')
            // }
            commit("SET_NAME", data.data.username);
            commit("SET_ROLENAME", data.data.roleName);
            // commit('SET_AVATAR', data.avatar)
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    // LogOut({ commit, state }:any) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token)
    //       .then(() => {
    //         commit("SET_TOKEN", "");
    //         // commit('SET_ROLES', [])
    //         removeToken();
    //         resolve();
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },
    GenerateRoutes({ commit, state }:any) {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem("Router") == null) {
          getSide()
            .then(response => {
              const data = response.data.data;
              if (data.length == 0) {
                // alert('此账号关联权限出错,请联系管理员')
                // Message.error({
                //   message: "此账号关联权限出错,请联系管理员"
                // });
                removeToken();
                resolve();
              } else {
                let routers:Array<any> = [];
                generaMenu(routers, data);
                commit("SET_ROUTER", routers);
                localStorage.setItem("Router", JSON.stringify(routers));
                resolve(routers);
              }
            })
            .catch(error => {
              reject(error);
            });
        } else {
          commit("SET_ROUTER", JSON.parse(localStorage.getItem("Router") || '{}'));
          resolve();
        }
      });
    },
    // 前端 登出
    FedLogOut({ commit }:any) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        commit("CLEAR_ROUTER", "");
        removeToken();
        localStorage.removeItem("ExpirationTime");
        localStorage.removeItem("Router");
        localStorage.removeItem("Dict");
        localStorage.removeItem("workflow");
        localStorage.removeItem("RoleType");
        localStorage.removeItem("editPidData");
        localStorage.removeItem("pageId");
        resolve();
      });
    }
  }
}
export default user