const getters = {
  sidebar: (state:any) => state.app.sidebar,
  device: (state:any) => state.app.device,
  token: (state:any) => state.user.token,
  avatar: (state:any) => state.user.avatar,
  name: (state:any) => state.user.name,
  roles: (state: any) => state.user.roles,
  routers:(state:any)=>state.user.routers
};
export default getters;
