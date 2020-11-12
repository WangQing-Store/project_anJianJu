<template>
  <div class="home">
    <div class="d_flex">
      <h2 style="color:#fff">安 监 局 监 控 系 统</h2>
      <a-form
        class="loginForm"
        ref="loginFormRules"
        :model="loginForm"
        :rules="rules"
      >
        <a-form-item
          name="username"
          labelAlign="right"
          class="input"
        >
          <a-input
            type="text"
            placeholder="请输入用户名"
            v-model:value="loginForm.username"
          >
            <template v-slot:prefix>
              <user-outlined type="user" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          name="password"
          labelAlign="right"
        >
          <a-input
            :type="inputType"
            placeholder="请输入密码"
            @keydown.enter="signin"
            v-model:value="loginForm.password"
            class="a_input"
          >
            <template v-slot:prefix>
              <LockOutlined />
            </template>
            <template v-slot:suffix>
              <EyeOutlined
                v-show="isEye"
                @click="setIsEye"
              />
              <EyeInvisibleOutlined
                v-show="!isEye"
                @click="setIsEye"
              />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
      <div
        class="login_btn"
        @click="signin"
      >登录</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue';
import md5 from 'js-md5';
import { RES_OK } from '@/api/config';
import {
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';

export default defineComponent({
  name: 'Home',
  components: {
    UserOutlined,
    LockOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
  },
  setup(prop, context) {
    const { ctx }: any = getCurrentInstance();
    let loginForm = reactive({
      username: '',
      password: '',
    });
    const signin = () => {
      ctx.$refs['loginFormRules']
        .validate()
        .then(() => {
          loginForm.password = md5(loginForm.password);
          ctx.$store.dispatch('Login', loginForm).then((res: any) => {
            //登录成功 跳转
            if (res.data.code == RES_OK) {
              ctx.$router.push({ path: '/' });
            } else {
              ctx.$message.error(res.data.msg);
            }
          });
        })
        .catch((err: any) => {
          console.log('error', err);
        });
    };
    onMounted(() => {});
    // 控制是否显示密码
    let isEye = ref(false);
    // input类型
    let inputType = ref('password');
    // 控制是否显示密码的点击方法
    let setIsEye = () => {
      isEye.value = !isEye.value;
      if (inputType.value == 'password') {
        inputType.value = 'text';
      } else {
        inputType.value = 'password';
      }
    };
    // 登录表单验证规则
    let unerNameRule = async (rule: any, value: any, callback: any) => {
      if (value == '') {
        return Promise.reject('用户名不能为空');
      } else {
        return Promise.resolve();
      }
    };
    let passwordRule = async (rule: any, value: any, callback: any) => {
      if (value == '') {
        return Promise.reject('密码不能为空');
      } else {
        return Promise.resolve();
      }
    };
    let rules = reactive({
      username: [{ validator: unerNameRule, trigger: 'blur' }],
      password: [{ validator: passwordRule, trigger: 'blur' }],
    });
    const { resetFields, validate, validateInfos } = useForm(loginForm, rules);
    return {
      loginForm,
      signin,
      isEye,
      inputType,
      setIsEye,
      rules,
    };
  },
});
</script>

<style scoped lang="scss">
@mixin login_btn {
  width: 40%;
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  border-radius: 4px;
  outline: none;
  border: none;
}
@mixin d_flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.home {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #2d3a4b;
  .d_flex {
    margin-top: 15rem;
    @include d_flex;
  }
  .loginForm {
    @include login_btn;
    padding: 0;
  }
  .login_btn {
    @include login_btn;
    color: azure;
    font-weight: 600;
    background-color: #334499;
    border: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  /deep/ .ant-input {
    height: 40px;
  }
}
</style>
