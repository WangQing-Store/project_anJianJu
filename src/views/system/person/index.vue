<template>
  <div style="width:100%">
    <div class="a_flex">
      <a-button
        type="primary"
        @click="addPersonnel "
      >
        添加人员信息
      </a-button>
      <div style="width:50%">
        <a-input
          style="width:40%;margin:0 10px"
          text="text"
          placeholder="请输入搜索内容"
          v-model:value="PersonnelObj.keyword"
        ></a-input>
        <a-button
          type="primary"
          @click="searchPersonnel"
        >
          搜索
        </a-button>
      </div>
    </div>
    <!-- 表格 -->
    <tableComponent
      style="margin-top:10px;text-align:center"
      :columns="columns"
      :data="records"
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
      :page-size-options="['10', '20', '30', '40', '50']"
      v-model:current="current"
      v-model:page="page"
      :total="total"
      @showSizeChange="onShowSizeChange"
      @change="sizeChange"
    >
      <template v-slot:buildOptionText="props">
        <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
      </template>
    </a-pagination>
    <!-- 添加或编辑人员模态框 -->
    <a-modal
      :title="personnelTitle"
      width="800px"
      v-model:visible="PersonnelVisible"
      okText="确定"
      cancelText="取消"
      @ok="PersonnelHandleOk"
    >
      <formComponent
        :formData="formData"
        :formConfigure="formConfigure"
        :layout="'inline'"
        :optionData="options"
        :refName="'personnelForm'"
        ref="personnelName"
      ></formComponent>
    </a-modal>
    <!--查看人员模态框 -->
    <a-modal
      title="查看人员信息"
      width="800px"
      :footer="null"
      v-model:visible="viewPersonnelVisible"
    >
      <a-card
        :title="personnelDetails.name"
        style="width: 100%"
      >
        <h4>年龄:{{personnelDetails.age}}</h4>
        <h4>性别:{{personnelDetails.sex ? "男" : "女"}}</h4>
        <h4>电话:{{personnelDetails.phone}}</h4>
        <h4>邮箱:{{personnelDetails.email}}</h4>
        <h4>单位类型:{{personnelDetails.unitType==1 ? "政府" : "企业"}}</h4>
        <h4>单位名称:{{personnelDetails.unitType==1 ? personnelDetails.department : personnelDetails.companyName}}</h4>
        <h4>是否执法人员:{{personnelDetails.isOfficers ? "是" : "否"}}</h4>
        <h4 v-if="personnelDetails.isOfficers ">行政执法证号:{{personnelDetails.officersNamber}}</h4>
        <h4>是否启用:{{personnelDetails.isEnable ? "是" : "否"}}</h4>
        <h4>创建时间:{{filtersTime}}</h4>
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
  watch,
} from 'vue';
import {
  personnel,
  AddPersonnel,
  personnelSearch,
  updatePersonnel,
} from '@/api/system/person';
import { RES_OK } from '@/api/config';
import tableComponent from '@/components/aTable/index.vue';
import { getByKey } from '@/api/common/common';
import formComponent from '@/components/aForm/index.vue';
import { message } from 'ant-design-vue';
import { filterTime } from '@/api/filters/index';
import { companyFindList } from '@/api/company/index';

export default defineComponent({
  components: {
    tableComponent,
    formComponent,
  },
  setup() {
    interface page {
      page: number;
      limit: number;
      keyword: string;
    }
    // 获取当前实例
    const { ctx }: any = getCurrentInstance();
    let PersonnelObj: page = reactive({
      page: 1,
      limit: 10,
      keyword: '',
    });
    // 人员信息数组
    let records: any = ref([]);
    // 人员页数
    let page: any = ref(0);
    // 人员总数
    let total: any = ref(0);
    // 页面显示个数
    let size: any = ref(0);
    // 当前页面
    let current: any = ref(0);
    // 分页获取人员信息
    let getPersonnelInfo = async () => {
      let { data } = await personnel(PersonnelObj);
      let number = 1;
      data.data.records.length > 0 &&
        data.data.records.map((item: any) => (item.number = number++)); // 处理data
      data.data.records.length > 0 &&
        data.data.records.map(
          (item: any) =>
            (item.button = [
              { text: '查看', type: 'primary' },
              { text: '编辑', type: 'primary' },
            ])
        );
      if (data.code == RES_OK) {
        records.value = data.data.records;
        page.value = data.data.page;
        total.value = data.data.total;
        size.value = data.data.size;
        current.value = data.data.current;
      }
    };
    // 获取政企类型
    let unitTypeList = ref([]);
    const unitType = async () => {
      let { data } = await getByKey('t_unit_type');
      if (data.code == RES_OK) {
        unitTypeList.value = data.data;
      }
    };
    // 表格配置项
    let columns = ref([
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        customRender({ record }: any) {
          if (record.sex === false) {
            return '女';
          } else {
            return '男';
          }
        },
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '单位类型',
        dataIndex: 'unitType',
        key: 'unitType',
        customRender({ record }: any) {
          let unitType = '';
          unitTypeList.value.forEach((item: any) => {
            if (item.value == record.unitType) {
              unitType = item.name;
            }
          });
          return unitType;
        },
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        customRender({ record }: any) {
          if (record.unitType == 1) {
            return record.department;
          } else if (record.unitType == 2) {
            return record.companyName;
          }
        },
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '是否执法人员',
        dataIndex: 'isOfficers',
        key: 'isOfficers',
        customRender({ record }: any) {
          if (record.isOfficers == false) {
            return '否';
          } else if (record.isOfficers == true) {
            return '是';
          }
        },
      },
      {
        title: '行政执法证号',
        dataIndex: 'officersNumber',
        key: 'officersNumber',
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
    // 修改页面显示个数
    let onShowSizeChange = (Current: any, size: any) => {
      PersonnelObj.limit = size;
      PersonnelObj.page = Current;
      getPersonnelInfo();
    };
    // 页面改变
    let sizeChange = (page: any, pageSize: any) => {
      PersonnelObj.page = page;
      PersonnelObj.limit = pageSize;
      getPersonnelInfo();
    };
    // 控制添加人员信息模态框显示
    let PersonnelVisible = ref(false);
    // 添加人选信息数据
    let formData = ref({
      age: '',
      companyId: '',
      companyName: '',
      createTime: undefined,
      department: '',
      email: '',
      id: '',
      isEnable: true,
      isOfficers: true,
      name: '',
      officersNumber: '',
      phone: '',
      sex: true,
      unitType: 1,
      updateTime: undefined,
    });
    // 人员信息标题
    let personnelTitle = ref('');
    let btnAction: any = ref('');
    // 点击添加人员信息按钮
    let addPersonnel = () => {
      PersonnelVisible.value = true;
      personnelTitle.value = '添加人员信息';
      btnAction.value = true;
      nextTick(() => {
        ctx.$refs.personnelName.resetFormFields();
      });
    };
    // 添加人员信息表单配置
    let formConfigure = ref([
      {
        label: '姓名',
        type: 'text',
        placeholder: '请输入姓名',
        value: 'name',
        width: 45,
      },
      {
        label: '性别',
        type: 'radio',
        value: 'sex',
        width: 45,
        radioList: [
          {
            value: true,
            text: '男',
          },
          {
            value: false,
            text: '女',
          },
        ],
      },
      {
        label: '单位类型',
        type: 'radio',
        value: 'unitType',
        width: 45,
        radioList: [
          {
            value: 1,
            text: '政府',
          },
          {
            value: 2,
            text: '企业',
          },
        ],
      },
      {
        type: 'textOrSelect',
        width: 45,
        key: 'unitType',
      },
      {
        label: '是否执法人员',
        type: 'radio',
        value: 'isOfficers',
        width: 45,
        radioList: [
          {
            value: true,
            text: '是',
          },
          {
            value: false,
            text: '否',
          },
        ],
      },
      {
        label: '年龄',
        type: 'text',
        placeholder: '请输入年龄',
        value: 'age',
        width: 45,
      },
      {
        label: '行政执法证号',
        type: 'text',
        placeholder: '请输入行政执法证号',
        value: 'officersNumber',
        width: 45,
      },
      {
        label: '是否启用',
        type: 'radio',
        value: 'isEnable',
        width: 45,
        radioList: [
          {
            value: true,
            text: '是',
          },
          {
            value: false,
            text: '否',
          },
        ],
      },
      {
        label: '联系电话',
        type: 'text',
        placeholder: '请输入联系电话',
        value: 'phone',
        width: 45,
      },
      {
        label: '邮箱',
        type: 'text',
        placeholder: '请输入邮箱',
        value: 'email',
        width: 45,
      },
    ]);
    // 确认添加人员信息
    let PersonnelHandleOk = async () => {
      if (btnAction.value) {
        const res = await AddPersonnel(formData.value);
        if (res.data.code == RES_OK) {
          PersonnelVisible.value = false;
          getPersonnelInfo();
          message.success('添加成功');
        } else {
          message.error('添加失败');
        }
      } else {
        formData.value.createTime = undefined;
        formData.value.updateTime = undefined;
        const res = await updatePersonnel(formData.value);
        if (res.data.code == RES_OK) {
          PersonnelVisible.value = false;
          getPersonnelInfo();
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      }
    };
    // 搜索人员
    let searchPersonnel = async () => {
      PersonnelObj.page = 1;
      let { data } = await personnelSearch(PersonnelObj);
      let number = 1;
      data.data.records.length > 0 &&
        data.data.records.map((item: any) => (item.number = number++)); // 处理data
      data.data.records.length > 0 &&
        data.data.records.map(
          (item: any) =>
            (item.button = [
              { text: '查看', type: 'primary' },
              { text: '编辑', type: 'primary' },
            ])
        );
      if (data.code == RES_OK) {
        records.value = data.data.records;
        page.value = data.data.page;
        total.value = data.data.total;
        size.value = data.data.size;
        current.value = data.data.current;
      }
    };
    // 控制查看模态框
    let viewPersonnelVisible = ref(false);
    // 接受表格组件返回的数据
    let personnelDetails = ref({});
    let filtersTime = ref('');
    let btnSeletion = (obj: any) => {
      switch (obj.text) {
        case '查看':
          personnelDetails.value = obj.record;
          viewPersonnelVisible.value = true;
          filtersTime.value = filterTime(obj.record.createTime);
          break;

        case '编辑':
          btnAction.value = false;
          personnelDetails.value = obj.record;
          personnelTitle.value = '编辑人员信息';
          PersonnelVisible.value = true;
          formData.value = Object.assign({}, obj.record);
          break;
      }
    };
    // 获取企业列表
    let options: any = ref({});
    let companyList = async () => {
      let { data } = await companyFindList('');
      if (data.code == RES_OK) {
        options.value.companyId = data.data;
      }
    };
    // 切换启用
    let changeSwitch = async (obj: any) => {
      formData.value = Object.assign({}, obj.record);
      formData.value.isEnable = !obj.checked;
      formData.value.createTime = undefined;
      formData.value.updateTime = undefined;
      const res = await updatePersonnel(formData.value);
      if (res.data.code == RES_OK) {
        getPersonnelInfo();
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
      getPersonnelInfo();
      unitType();
      companyList();
    });
    return {
      records,
      PersonnelObj,
      page,
      size,
      total,
      columns,
      current,
      onShowSizeChange,
      sizeChange,
      PersonnelHandleOk,
      PersonnelVisible,
      addPersonnel,
      formData,
      formConfigure,
      searchPersonnel,
      btnSeletion,
      viewPersonnelVisible,
      personnelDetails,
      filtersTime,
      personnelTitle,
      btnAction,
      options,
      changeSwitch,
    };
  },
});
</script>

<style lang="scss" scope>
.a_flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
}
</style>