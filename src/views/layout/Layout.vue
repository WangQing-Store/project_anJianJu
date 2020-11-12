<template>
  <a-layout
    id="components-layout-demo-side"
    style="min-height: 100vh"
  >
    <!-- 侧边导航栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
    >
      <div class="logo" />
      <amenuItem class="sider"></amenuItem>
    </a-layout-sider>
    <a-layout>
      <!-- 头部区域 -->
      <a-layout-header style="background: #fff; padding: 0;display:flex;justify-content: space-between;align-items: center;">
        <h3 style="text-align:left;font-weight: 600;margin-left:10px">
          安监局监控
        </h3>
        <div style="display:flex;align-items: center;">
          <h3 style="margin-right:10px;margin-bottom:0;font-weight: 600;">当前用户:{{userName}}{{roleName ? `(${roleName})` : ''}}</h3>
          <!-- 下拉选择框 -->
          <a-popover
            v-model:visible="visible"
            title="Title"
            trigger="click"
            arrow-point-at-center
            placement="topLeft"
          >
            <template v-slot:content>
              <p
                @click="changePwd"
                style="cursor:pointer;"
                class="dropDown"
              >
                修改密码
              </p>
              <p
                style="cursor:pointer;"
                class="dropDown"
                @click="confirmLoginout"
              >
                退出登录
              </p>
            </template>
            <img
              style="width:50px;height:50px;margin-right:10px"
              src="@\assets\slideDown.png"
            />
          </a-popover>
        </div>
      </a-layout-header>
      <a-breadcrumb style="margin: 16px 0"> </a-breadcrumb>
      <!-- 主体内容 -->
      <a-layout-content style="margin: 0 16px">
        <div :style="{
            padding: '24px',
            background: '#fff',
            minHeight: '360px',
            'margin-top': '10px',
            height: '100%',
          }">
          <router-view v-slot="{ Component }">
            <transition
              name="fade"
              mode="out-in"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
  <!-- 修改密码会话框 -->
  <a-modal
    title="修改密码"
    v-model:visible="changePwdModel"
    :confirm-loading="changePwdLoading"
    ok-text="确认"
    cancel-text="取消"
    @ok="changePwdOk"
  >
    <a-form
      ref="changePwdForm"
      :model="changePwdObj"
      :rules="rules"
    >
      <a-form-item
        label="原密码"
        name="password"
        labelAlign="right"
        class="changePwd"
      >
        <a-input
          type="password"
          v-model:value="changePwdObj.password"
        />
      </a-form-item>
      <a-form-item
        label="新密码"
        name="newPassword"
        labelAlign="right"
        class="changePwd"
      >
        <a-input
          type="password"
          v-model:value="changePwdObj.newPassword"
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        name="confirmPassword"
        labelAlign="right"
        class="changePwd"
      >
        <a-input
          type="password"
          v-model:value="changePwdObj.confirmPassword"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  computed,
  getCurrentInstance,
  ref,
  provide,
  reactive,
  nextTick,
} from 'vue';
import amenuItem from './components/aMenuItem.vue';
import {
  DownOutlined,
  DatabaseFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import { updatePwd } from '@/api/system/account';
import md5 from 'js-md5';
import { RES_OK } from '@/api/config';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { createVNode } from 'vue';
export default {
  name: 'Layout',
  components: {
    DatabaseFilled,
    amenuItem,
    DownOutlined,
    ExclamationCircleOutlined,
  },
  setup() {
    const { ctx }: any = getCurrentInstance();
    const $store = useStore();
    const $router = useRouter();
    // 控制收缩侧边栏
    const collapsed = ref(false);
    // 保存路由数组
    const routes: any = computed(() => ctx.$store.state.user.routers);
    provide('routes', routes);
    // 控制下拉框
    const visible = ref(false);
    const hide = () => {
      visible.value = false;
    };
    // 修改密码
    const changePwd = (): void => {
      changePwdModel.value = true;
      nextTick(() => {
        ctx.$refs['changePwdForm'].resetFields();
      });
    };
    // 控制显示修改密码会话框
    const changePwdModel = ref(false);
    const changePwdLoading = ref(false);
    const changePwdObj = reactive({
      password: '',
      newPassword: '',
      confirmPassword: '',
    });
    // 修改密码验证规则
    const dateIsEqual = (rule: any, value: any, callback: any) => {
      // console.log(value)
      if (value === '' || value === null) {
        return Promise.reject('请再次输入密码');
      } else if (value !== changePwdObj.newPassword) {
        return Promise.reject('两次输入密码不一致');
      } else {
        return Promise.resolve();
      }
    };
    // 修改密码验证规则
    const rules = reactive({
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      newPassword: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
      ],
      confirmPassword: [
        { required: true, validator: dateIsEqual, trigger: 'blur' },
      ],
    });
    const modelRef = reactive({
      password: '',
      newPassword: '',
      confirmPassword: '',
    });
    const { resetFields, validate, validateInfos } = useForm(modelRef, rules);
    // 提交密码
    const changePwdOk = () => {
      changePwdLoading.value = true;
      ctx.$refs['changePwdForm']
        .validate()
        .then((res: any) => {
          changePwdObj.newPassword = md5(changePwdObj.newPassword);
          changePwdObj.password = md5(changePwdObj.password);
          updatePwd({
            oldPwd: changePwdObj.password,
            newPwd: changePwdObj.newPassword,
          }).then((res) => {
            if (res.data.code == RES_OK) {
              changePwdModel.value = false;
              changePwdLoading.value = false;
              ctx.$message.info('修改成功，请重新登录');
              const info = {
                Authorization: localStorage.getItem('Authorization'),
              };
              $store.dispatch('FedLogOut', info).then(() => {
                $router.push({ path: '/login' });
              });
            } else {
              ctx.$message.info(res.data.msg);
              changePwdLoading.value = false;
            }
          });
        })
        .catch((error: any) => {
          changePwdLoading.value = false;
          ctx.$message.info('密码输入错误,修改失败');
        });
    };
    // 退出登录
    const confirmLoginout = () => {
      ctx.$confirm({
        title: '退出管理平台',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          'div',
          { style: 'color:red;font-size:18px' },
          '您是否退出登录'
        ),
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const info = {
            Authorization: localStorage.getItem('Authorization'),
          };
          $store.dispatch('FedLogOut', info).then(() => {
            $router.push({ path: '/login' });
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
    // 用户名
    let userName = ref($store.state.user.name);
    // 角色名
    let roleName = ref($store.state.user.roleName);
    return {
      collapsed,
      routes,
      hide,
      visible,
      changePwd,
      confirmLoginout,
      changePwdModel,
      changePwdLoading,
      changePwdOk,
      changePwdObj,
      rules,
      userName,
      roleName,
    };
  },
  beforeRouteEnter(to: any, from: any, next: any) {
    next((vm: any) => {
      // console.log('vm: ', vm);
      // 通过 `vm` 访问组件实例 vm.deleteScan();
    });
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.ant-layout {
  height: 100vh;
  #components-layout-demo-custom-trigger {
    .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }
    .logo {
      height: 32px;
      background: rgba(153, 56, 56, 0.2);
      margin: 16px;
    }
  }
  .sider {
    height: 100%;
    overflow-y: scroll;
  }
  .trigger {
    width: 50px;
    height: 50px;
    background-color: red;
  }
  .ant-layout-sider,
  .ant-menu-dark,
  .ant-layout-sider-trigger {
    background-color: #304156;
  }
  .ant-menu-item:hover {
    background-color: #263445;
  }
  .ant-menu.ant-menu-dark .ant-menu-item-selected {
    background-color: #001528;
  }
  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin: 0;
  }
  .ant-menu-inline .ant-menu-item {
    margin: 0;
  }
  .icons-list ::v-deep(.anticon) {
    margin-right: 6px;
    font-size: 28px;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .fade-after-leave {
    opacity: 0;
    transition: all 0.3;
  }
  .ant-layout-content {
    min-height: auto;
  }
}
.dropDown:hover {
  color: lightblue !important;
}
.ant-form-item {
  display: flex;
  // justify-content: start;
  // align-items: center;
}
.ant-form /deep/ .ant-form-item-label {
  width: 100px;
}
/deep/ .changePwd div:nth-child(2) {
  width: 100%;
}
</style>
