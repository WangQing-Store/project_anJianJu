<template>
  <div style="width:100%">
    <div class="a_flex">
      <a-button
        type="primary"
        @click="addUserInfo"
      >
        添加用户信息
      </a-button>
      <div style="width:50%">
        <a-input
          style="width:40%;margin:0 10px"
          text="text"
          placeholder="请输入搜索内容"
          v-model:value="UserObj.keyword"
        ></a-input>
        <a-button
          type="primary"
          @click="searchUser"
        >
          搜索
        </a-button>
      </div>
    </div>
    <!-- 用户表格 -->
    <tableComponent
      style="margin-top:10px;text-align:center"
      :data="records"
      :columns="columns"
      :isBordered="true"
      :rowKey="'id'"
      @btnSeletion="btnSeletion"
      @changeSwitch="changeSwitch"
    ></tableComponent>
    <!-- 分页器 -->
    <a-pagination
      style="text-align:right;margin-top:10px"
      show-size-changer
      show-quick-jumper
      :page-size-options="['10', '20', '30', '40', '50']"
      v-model:current="current"
      v-model:page="UserObj.page"
      :total="total"
      @showSizeChange="onShowSizeChange"
      @change="sizeChange"
    >
      <template v-slot:buildOptionText="props">
        <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
      </template>
    </a-pagination>
    <!-- 添加用户信息模态框 -->
    <a-modal
      :title="userTitle"
      width="800px"
      v-model:visible="userVisible"
      okText="保存"
      cancelText="取消"
      @ok="userHandleOk"
    >
      <formComponent
        :formData="formData"
        :formConfigure="formConfigure"
        :layout="'inline'"
        :optionData="optionData"
        :refName="'ruleForm'"
        :rules="rules"
        ref="addUserInfoRef"
      ></formComponent>
    </a-modal>
    <!-- 查看 -->
    <a-modal
      title="用户信息"
      width="800px"
      :footer="null"
      v-model:visible="lookOverVisible"
    >
      <a-card
        :title="CurrentRowUserData.username"
        style="width: 100%"
      >
        <h4>角色:{{CurrentRowUserData.roleName}}</h4>
        <h4>性别:{{CurrentRowUserData.personnel.sex ? "男" : "女"}}</h4>
        <h4>年龄:{{CurrentRowUserData.personnel.age}}</h4>
        <h4>单位类型:{{CurrentRowUserData.personnel.unitType==1 ? "政府" : "企业"}}</h4>
        <h4>单位名称:{{CurrentRowUserData.personnel.unitType==1 ? CurrentRowUserData.personnel.department : CurrentRowUserData.personnel.companyName}}</h4>
        <h4>是否执法人员:{{CurrentRowUserData.personnel.isOfficers ? "是" : "否"}}</h4>
        <h4 v-if="CurrentRowUserData.personnel.isOfficers">行政执法证号:{{CurrentRowUserData.personnel.officersNumber ? "是" : "否"}}</h4>
        <h4>联系电话:{{CurrentRowUserData.personnel.phone}}</h4>
        <h4>邮箱:{{CurrentRowUserData.personnel.email}}</h4>
        <h4>是否启用:{{CurrentRowUserData.isEnable ? '启用' : '不启用'}}</h4>
        <h4>创建时间:{{createTime}}</h4>
      </a-card>
    </a-modal>
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
} from 'vue';
import formComponent from '@/components/aForm/index.vue';
import tableComponent from '@/components/aTable/index.vue';
import {
  sysUserSearch,
  sysUserAddUser,
  sysUserUpdateUser,
  sysUserCheckRepeat,
  resetPassword,
} from '@/api/system/user';
import { RES_OK } from '@/api/config';
import { findEnableRole } from '@/api/system/role';
import { getEnablePersonnel } from '@/api/system/person';
import { message, Modal } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import { filterTime } from '@/api/filters/index';
import md5 from 'js-md5';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
export default defineComponent({
  components: { formComponent, tableComponent },
  setup() {
    const { ctx }: any = getCurrentInstance();
    // 搜索数据
    let UserObj = reactive({
      keyword: '',
      limit: 10,
      page: 1,
    });
    // 表格配置项
    let columns = ref([
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        customRender({ record }: any) {
          if (record.personnel.unitType == 1) {
            return record.personnel.department;
          } else if (record.personnel.unitType == 2) {
            return record.personnel.companyName;
          }
        },
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        customRender: ({ record }: any) => {
          return record.personnel.phone;
        },
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        customRender({ record }: any) {
          if (record.createTime == null) {
            return '';
          }
          let d = new Date(record.createTime);
          if (d.getHours() < 10) {
            var Hours: string | number = '0' + d.getHours();
          } else {
            var Hours: string | number = d.getHours();
          }
          if (d.getMinutes() < 10) {
            var Minutes: string | number = '0' + d.getMinutes();
          } else {
            var Minutes: string | number = d.getMinutes();
          }
          if (d.getSeconds() < 10) {
            var Seconds: string | number = '0' + d.getSeconds();
          } else {
            var Seconds: string | number = d.getSeconds();
          }
          let installtime =
            d.getFullYear() +
            '-' +
            (d.getMonth() + 1) +
            '-' +
            d.getDate() +
            '   ' +
            Hours +
            ':' +
            Minutes +
            ':' +
            Seconds;
          return installtime;
        },
      },
      {
        title: '是否启用',
        dataIndex: 'isEnable',
        key: 'isEnable',
        slots: { customRender: 'switch' },
      },
      {
        title: '操作',
        dataIndex: 'button',
        key: 'button',
        slots: { customRender: 'button' },
      },
    ]);
    // 表格数据
    let records = ref([]);
    // 用户总数
    let total: any = ref(0);
    // 当前页面
    let current: any = ref(0);
    // 点击搜索
    let searchUser = () => {
      getUserList();
    };
    // 分页获取用户列表
    let getUserList = async () => {
      const res = await sysUserSearch(UserObj);
      let number = 1;
      res.data.data.records.length > 0 &&
        res.data.data.records.map((item: any) => {
          item.number = number++;
          item.button = [
            { text: '查看', type: 'primary' },
            { text: '编辑', type: 'primary' },
            { text: '重置密码', type: 'danger' },
          ];
        });
      if (res.data.code == RES_OK) {
        records.value = res.data.data.records;
        UserObj.page = res.data.data.pages;
        total.value = res.data.data.total;
        UserObj.limit = res.data.data.size;
        current.value = res.data.data.current;
      }
    };
    // 改变分页显示大小
    let onShowSizeChange = (Current: any, size: any) => {
      UserObj.limit = size;
      UserObj.page = Current;
      getUserList();
    };
    let sizeChange = (page: any, pageSize: any) => {
      UserObj.page = page;
      UserObj.limit = pageSize;
      getUserList();
    };
    // 表单数据
    let formData: any = ref({
      createId: '',
      createTime: undefined,
      id: '',
      isEnable: '',
      password: '',
      confirmPassword: '',
      personnel: {},
      personnelId: '',
      roleId: '',
      roleName: '',
      updateTime: undefined,
      username: '',
    });
    // 模态框标题
    let userTitle = ref('');
    // 控制模态框显示隐藏
    let userVisible = ref(false);
    // 表单配置
    let formConfigure = ref([
      {
        label: '用户名',
        type: 'text',
        placeholder: '请输入用户名',
        value: 'username',
        width: 45,
      },
      {
        label: '角色',
        type: 'select',
        placeholder: '请选择角色',
        value: 'roleId',
        width: 45,
      },
      {
        label: '关联人员',
        type: 'select',
        placeholder: '请选择关联人员',
        value: 'personnelId',
        width: 45,
      },
      {
        label: '输入密码',
        type: 'text',
        placeholder: '请输入密码',
        value: 'password',
        inputType: 'password',
        width: 45,
      },
      {
        label: '确认密码',
        type: 'text',
        placeholder: '请确认密码',
        value: 'confirmPassword',
        inputType: 'password',
        width: 45,
      },
    ]);
    // 表单验证
    let validateUsername = async (rules: any, value: any, callback: any) => {
      if (value == '') {
        return Promise.reject('用户名不能为空');
      } else {
        if (value == username.value) {
          return Promise.resolve();
        } else {
          const { data }: any = await sysUserCheckRepeat(value);
          if (data.code == 500) {
            return Promise.reject('用户名重复');
          } else {
            return Promise.resolve();
          }
        }
      }
    };
    let validateConfirmPassword = (rules: any, value: any, callback: any) => {
      if (value != formData.value.password) {
        return Promise.reject('密码不正确');
      } else {
        return Promise.resolve();
      }
    };
    let validatePassword = (rules: any, value: any, callback: any) => {
      if (value == '') {
        return Promise.reject('密码不能为空');
      } else {
        return Promise.resolve();
      }
    };
    let validateRoleId = (rules: any, value: any, callback: any) => {
      if (value == null || value == '') {
        return Promise.reject('角色不能为空');
      } else {
        return Promise.resolve();
      }
    };
    let validatePersonnelId = (rules: any, value: any, callback: any) => {
      if (value == null || value == '') {
        return Promise.reject('关联人员不能为空');
      } else {
        return Promise.resolve();
      }
    };
    let rules = ref({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' },
      ],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      roleId: [{ validator: validateRoleId, trigger: 'change' }],
      personnelId: [{ validator: validatePersonnelId, trigger: 'change' }],
    });
    // 添加用户信息
    let addUserInfo = () => {
      userVisible.value = true;
      userTitle.value = '添加用户信息';
      formConfigure.value = [
        {
          label: '用户名',
          type: 'text',
          placeholder: '请输入用户名',
          value: 'username',
          width: 45,
        },
        {
          label: '角色',
          type: 'select',
          placeholder: '请选择角色',
          value: 'roleId',
          width: 45,
        },
        {
          label: '关联人员',
          type: 'select',
          placeholder: '请选择关联人员',
          value: 'personnelId',
          width: 45,
        },
        {
          label: '输入密码',
          type: 'text',
          placeholder: '请输入密码',
          inputType: 'password',
          value: 'password',
          width: 45,
        },
        {
          label: '确认密码',
          type: 'text',
          placeholder: '请确认密码',
          inputType: 'password',
          value: 'confirmPassword',
          width: 45,
        },
      ];
      btnAction.value = true;
      nextTick(() => {
        ctx.$refs.addUserInfoRef.resetFormFields();
      });
    };
    // 表单提交
    let userHandleOk = () => {
      if (btnAction.value) {
        ctx.$refs.addUserInfoRef.validateForm().then((res: any) => {
          if (res) {
            formData.value.password = md5(formData.value.password);
            sysUserAddUser(formData.value).then((res) => {
              if (res.data.code == RES_OK) {
                userVisible.value = false;
                message.success('添加成功');
                getUserList();
              } else {
                message.error('添加失败');
              }
            });
          }
        });
      } else {
        ctx.$refs.addUserInfoRef.validateForm().then((res: any) => {
          if (res) {
            sysUserUpdateUser(formData.value).then((res) => {
              if (res.data.code == RES_OK) {
                userVisible.value = false;
                message.success('编辑成功');
                getUserList();
              } else {
                message.error('编辑失败');
              }
            });
          }
        });
      }
    };
    let optionData: any = ref({});
    // 获取角色列表
    let getRoleList = async () => {
      let { data }: any = await findEnableRole();
      if (data.code == RES_OK) {
        optionData.value.roleId = data.data;
      }
    };
    // 获取关联人员列表
    let getPersonList = async () => {
      let { data }: any = await getEnablePersonnel();
      if (data.code == RES_OK) {
        optionData.value.personnelId = data.data;
      }
    };
    // 保存 当前行用户 数据
    let CurrentRowUserData = ref({});
    let createTime = ref('');
    let lookOverVisible = ref(false);
    let btnAction = ref(false);
    // 点击按钮
    let username = ref('');
    let btnSeletion = (obj: any) => {
      CurrentRowUserData.value = obj.record;
      switch (obj.text) {
        case '查看':
          createTime.value = filterTime(obj.record.createTime);
          lookOverVisible.value = true;
          break;
        case '编辑':
          userTitle.value = '编辑用户信息';
          userVisible.value = true;
          username.value = obj.record.username;
          formData.value = Object.assign(
            {},
            {
              id: obj.record.id,
              roleId: obj.record.roleId,
              username: obj.record.username,
              personnelId: obj.record.personnelId,
            }
          );
          formConfigure.value = [
            {
              label: '用户名',
              type: 'text',
              placeholder: '请输入用户名',
              value: 'username',
              width: 45,
            },
            {
              label: '角色',
              type: 'select',
              placeholder: '请选择角色',
              value: 'roleId',
              width: 45,
            },
            {
              label: '关联人员',
              type: 'select',
              placeholder: '请选择关联人员',
              value: 'personnelId',
              width: 45,
            },
          ];
          nextTick(() => {
            ctx.$refs.addUserInfoRef.clearFormFields();
          });
          btnAction.value = false;
          break;
        case '重置密码':
          Modal.confirm({
            title: '是否确定重置密码?',
            icon: createVNode(ExclamationCircleOutlined),
            content: '',
            cancelText: '取消',
            okText: '确定',
            onOk() {
              resetPassword(obj.record.id).then((res) => {
                if (res.data.code == RES_OK) {
                  message.success('修改成功');
                } else {
                  message.error(res.data.msg);
                }
              });
            },
            onCancel() {},
          });
          break;
      }
    };
    // 编辑switch
    let changeSwitch = async (obj: any) => {
      formData.value = Object.assign(
        {},
        {
          id: obj.record.id,
          roleId: obj.record.roleId,
          username: obj.record.username,
          personnelId: obj.record.personnelId,
        }
      );
      formData.value.isEnable = !obj.checked;
      formData.value.createTime = undefined;
      formData.value.updateTime = undefined;
      const res = await sysUserUpdateUser(formData.value);
      if (res.data.code == RES_OK) {
        getUserList();
        if (formData.value.isEnable) {
          message.success('成功启用');
        } else {
          message.success('取消启用');
        }
      } else {
        message.error('修改失败');
      }
    };
    onMounted(() => {
      getUserList();
      getRoleList();
      getPersonList();
    });
    return {
      UserObj,
      addUserInfo,
      searchUser,
      columns,
      records,
      current,
      total,
      onShowSizeChange,
      sizeChange,
      userTitle,
      userVisible,
      userHandleOk,
      formConfigure,
      formData,
      optionData,
      rules,
      btnSeletion,
      CurrentRowUserData,
      createTime,
      lookOverVisible,
      changeSwitch,
    };
  },
});
</script>

<style lang="scss" scoped>
.a_flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
}
</style>