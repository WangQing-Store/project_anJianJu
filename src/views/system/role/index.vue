<template>
  <div style="width:100%">
    <div class="a_flex">
      <a-button
        type="primary"
        @click="clickAddRole"
      >
        添加角色
      </a-button>
      <div style="width:50%">
        <a-input
          style="width:40%;margin:0 10px"
          text="text"
          placeholder="请输入搜索内容"
          v-model:value="roleObj.keyword"
        ></a-input>
        <a-button
          type="primary"
          @click="searchRole"
        >
          搜索
        </a-button>
      </div>
    </div>
    <!-- 表格 -->
    <tableComponent
      style="margin-top:10px;text-align:center"
      :columns="columns"
      :data="roleList"
      :isBordered="true"
      :rowKey="'id'"
      @btnSeletion="btnSeletion"
      @changeSwitch="changeSwitch"
    />

    <!-- 分页器 -->
    <a-pagination
      style="text-align:right;margin-top:10px"
      show-size-changer
      show-quick-jumper
      :show-total="total => `共 ${total} 条`"
      :page-size-options="['10','20', '30', '40', '50']"
      v-model:current="current"
      v-model:page="roleObj.page"
      :total="total"
      @showSizeChange="onShowSizeChange"
      @change="sizeChange"
    >
      <template v-slot:buildOptionText="props">
        <span v-if="props.value !== '50'"> {{ props.value }} 条/页</span>
      </template>
    </a-pagination>
    <!-- 添加或编辑人员模态框 -->
    <a-modal
      :title="roleTitle"
      width="800px"
      v-model:visible="roleVisible"
      okText="确定"
      cancelText="取消"
      @ok="roleHandleOk"
    >
      <formComponent
        :formData="formData"
        :formConfigure="formConfigure"
        :layout="'inline'"
        :optionData="optionData"
        ref="roleName"
        :refName="'roleForm'"
      ></formComponent>
    </a-modal>
    <!-- 模块 -->
    <a-modal
      title="权限管理"
      width="800px"
      v-model:visible="roleModuleVisible"
      okText="确定"
      cancelText="取消"
      @ok="roleModuleHandleOk"
    >
      <a-tree
        v-if="roleModuleVisible"
        v-model:checkedKeys="checkedKeys"
        checkable
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        @check="onCheck"
      />
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
import {
  sysRoleSearch,
  updateRole,
  addRole,
  getRoleModule,
  addDelRoleModule,
} from '@/api/system/role';
import { getEnablePersonnel } from '@/api/system/person';
import { RES_OK } from '@/api/config';
import tableComponent from '@/components/aTable/index.vue';
import formComponent from '@/components/aForm/index.vue';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';

export default defineComponent({
  components: { tableComponent, formComponent },
  setup() {
    const { ctx }: any = getCurrentInstance();
    const store = useStore();
    let roleObj = reactive({
      keyword: '',
      limit: 10,
      page: 1,
    });
    //角色表格数据
    let roleList = ref([]);
    let optionData = ref({ createId: [] });
    let current = ref(0);
    let total = ref(0);
    // 分页获取所有角色
    let GetSysRoleList = async () => {
      let number = 1;
      let { data }: any = await sysRoleSearch(roleObj);
      if (data.code == RES_OK) {
        data.data.records.length > 0 &&
          data.data.records.map((item: any) => (item.number = number++));
        data.data.records.length > 0 &&
          data.data.records.map(
            (item: any) =>
              (item.button = [
                { text: '编辑', type: 'primary' },
                { text: '模块', type: 'primary' },
              ])
          );
        roleList.value = data.data.records;
        current.value = data.data.current;
        total.value = data.data.total;
      }
    };
    // 获取用户列表
    let GetSysPersonList = async () => {
      let { data }: any = await getEnablePersonnel();
      if (data.code == RES_OK) {
        optionData.value.createId = data.data;
      }
    };
    // 模态框标题
    let roleTitle = ref('');
    // 控制模态框显示
    let roleVisible = ref(false);
    let buttonSelect = ref(false);
    // 表单数据
    let formData: any = ref({
      createId: '',
      createName: '',
      createTime: undefined,
      id: '',
      isEnable: true,
      name: '',
      remark: '',
      type: '',
      updateTime: undefined,
    });
    // 重置表单数据
    let resetFormData = () => {
      formData.value = {
        createId: '',
        createName: '',
        createTime: undefined,
        id: '',
        isEnable: true,
        name: '',
        remark: '',
        type: '',
        updateTime: undefined,
      };
    };
    // 表单配置
    let formConfigure = ref([
      {
        label: '名称',
        type: 'text',
        value: 'name',
        placeholder: '请输入名称',
        width: 45,
      },
      {
        label: '描述',
        type: 'text',
        value: 'remark',
        placeholder: '请输入描述',
        width: 45,
      },
      {
        label: '是否启用',
        type: 'radio',
        value: 'isEnable',
        radioList: [
          {
            text: '是',
            value: true,
          },
          {
            text: '否',
            value: false,
          },
        ],
        width: 45,
      },
    ]);
    //   点击添加角色
    let clickAddRole = () => {
      roleTitle.value = '添加角色';
      roleVisible.value = true;
      buttonSelect.value = true;
      resetFormData();
    };
    // 确认
    let roleHandleOk = async () => {
      if (buttonSelect.value) {
        const { data }: any = await addRole(formData.value);
        if (data.code == RES_OK) {
          message.success('添加成功');
          roleVisible.value = false;
          GetSysRoleList();
        } else {
          message.error('添加失败');
        }
      } else {
        const { data }: any = await updateRole(formData.value);
        if (data.code == RES_OK) {
          message.success('修改成功');
          roleVisible.value = false;
          GetSysRoleList();
        } else {
          message.error('修改失败');
        }
      }
    };
    // 点击搜索
    let searchRole = () => {
      GetSysRoleList();
    };
    // 表格配置
    let columns = ref([
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '创建者',
        dataIndex: 'createName',
        key: 'createName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        customRender: ({ record }: any) => {
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
    //控制模块模态框显示
    let roleModuleVisible = ref(false);
    let autoExpandParent = ref(true);
    let selectedKeys = ref([]);
    let checkedKeys: any = ref([]);
    let treeData: any = ref([]);
    let onCheck = (checkedKey: any) => {
      addOrDelData.value.addList = [];
      addOrDelData.value.delList = [];
      checkedKey.forEach((item: any, index: any) => {
        if (getCurrmentRolemodule.value.indexOf(item) == -1) {
          addOrDelData.value.addList.push(item);
        }
      });
      getCurrmentRolemodule.value.forEach((item: any, index: any) => {
        if (checkedKey.indexOf(item) == -1) {
          addOrDelData.value.delList.push(item);
        }
      });
    };
    // 生成树形结构数据
    let generaMenu = (routers: any, data: any) => {
      data.forEach((item: any) => {
        const menu = {
          title: item.meta.title,
          key: item.meta.id,
          children: [],
        };
        if (item.children.length > 0) {
          generaMenu(menu.children, item.children);
        }
        routers.push(menu);
      });
      return routers;
    };
    // 添加或者刪除頁面權限數據
    let addOrDelData: any = ref({
      addList: [],
      delList: [],
      roleId: [],
    });
    // 点击按钮
    let btnSeletion = (obj: any) => {
      switch (obj.text) {
        case '编辑':
          roleVisible.value = true;
          buttonSelect.value = false;
          let { createId, id, isEnable, name, remark, type } = obj.record;
          formData.value = Object.assign(
            {},
            { createId, id, isEnable, name, remark, type }
          );
          break;
        case '模块':
          treeData.value = [];
          roleModuleVisible.value = true;
          addOrDelData.value.roleId = obj.record.id;
          generaMenu(treeData.value, store.state.user.addRouters);
          roleModule(obj.record.id);
          break;
      }
    };
    // 切换switch
    let changeSwitch = async (obj: any) => {
      let { createId, id, isEnable, name, remark, type } = obj.record;
      formData.value = Object.assign(
        {},
        { createId, id, isEnable, name, remark, type }
      );
      formData.value.isEnable = !obj.checked;
      const { data }: any = await updateRole(formData.value);
      if (data.code == RES_OK) {
        if (formData.value.isEnable) {
          message.success('成功启用');
        } else {
          message.success('取消启用');
        }
        GetSysRoleList();
      } else {
        message.error('修改失败');
      }
    };
    // 修改页面显示个数
    let onShowSizeChange = (Current: any, size: any) => {
      roleObj.limit = size;
      roleObj.page = Current;
      GetSysRoleList();
    };
    // 页面改变
    let sizeChange = (page: any, pageSize: any) => {
      roleObj.page = page;
      roleObj.limit = pageSize;
      GetSysRoleList();
    };
    let getCurrmentRolemodule: any = ref([]);
    // 获取当前角色模块
    let roleModule = async (roleId: number) => {
      const { data }: any = await getRoleModule(roleId);
      if (data.code == RES_OK) {
        let checkedKey: number[] = [];
        data.data.forEach((item: any) => {
          checkedKey.push(item.moduleId);
        });
        checkedKeys.value = checkedKey;
        getCurrmentRolemodule.value = checkedKey;
      }
    };
    // 确认模块
    let roleModuleHandleOk = async () => {
      const { data }: any = await addDelRoleModule(addOrDelData.value);
      if (data.code == RES_OK) {
        message.success('修改成功');
        roleModuleVisible.value = false;
      } else {
        message.error('修改失敗');
      }
    };
    onMounted(() => {
      GetSysRoleList();
      GetSysPersonList();
    });
    return {
      roleObj,
      clickAddRole,
      searchRole,
      roleList,
      columns,
      btnSeletion,
      onShowSizeChange,
      sizeChange,
      current,
      total,
      changeSwitch,
      roleTitle,
      roleVisible,
      roleHandleOk,
      formData,
      formConfigure,
      optionData,
      autoExpandParent,
      roleModuleVisible,
      selectedKeys,
      treeData,
      checkedKeys,
      onCheck,
      roleModuleHandleOk,
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