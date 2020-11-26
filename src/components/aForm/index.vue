<template>
  <a-form
    :model="formData"
    :layout="layout"
    :rules="rules"
    :ref="refName"
  >
    <template
      v-for="(item,index) of formConfigure"
      :key="index"
    >
      <!-- 自定义插槽 -->
      <template v-if="item.type=='slot'">
        <slot :name="'form'+item.slotName"></slot>
      </template>

      <!-- 文本框 -->
      <a-form-item
        :label="item.label"
        v-if="item.type=='text'"
        :style="{'width':item.width+'%'}"
        :name="item.value"
      >
        <a-input
          :placeholder="item.placeholder"
          :type="item.inputType ? item.inputType : 'text'"
          v-model:value="formData[item.value]"
        />
      </a-form-item>

      <!-- textarea -->
      <a-form-item
        :label="item.label"
        v-if="item.type=='textarea'"
        :style="{'width':item.width+'%'}"
        :name="item.value"
      >
        <a-textarea
          v-model:value="formData[item.value]"
          :placeholder="item.placeholder"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </a-form-item>

      <!-- 下拉选择框 -->
      <a-form-item
        :label="item.label"
        v-if="item.type=='select'"
        :style="{'width':item.width+'%'}"
        :name="item.value"
      >
        <a-select
          v-model:value="formData[item.value]"
          :placeholder="item.placeholder"
        >
          <a-select-option
            v-for="val of optionData[item.value]"
            :key="val.id"
            :value="val[item.selectValue]"
          >
            {{val.name}}
          </a-select-option>
        </a-select>
      </a-form-item>

      <!-- 时间选择框 -->
      <a-form-item
        v-if="item.type=='date'"
        :label="item.label"
        :style="{'width':item.width+'%'}"
        :name="item.value"
      >
        <a-date-picker
          v-model:value="formData[item.value]"
          show-time
          type="date"
          :placeholder="item.placeholder"
        />
      </a-form-item>

      <!-- 开关 -->
      <a-form-item
        v-if="item.type=='switch'"
        :label="item.label"
        :style="{'width':item.width+'%'}"
        :name="item.value"
      >
        <a-switch v-model:checked="formData[item.value]" />
      </a-form-item>

      <!-- 复选框 -->
      <a-form-item
        v-if="item.type=='checkbox'"
        :label="item.label"
        :style="{'width':item.width+'%'}"
        :name="item.value"
      >
        <a-checkbox-group v-model:value="formData[item.value]">
          <a-checkbox
            v-for="(val,index) of item.checkBoxList"
            :key="index"
            :value="val.value"
            name="type"
          >
            {{val.text}}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>

      <!-- 单选框 -->
      <a-form-item
        v-if="item.type=='radio'"
        :label="item.label"
        :style="{'width':item.width+'%'}"
        :name="item.value"
      >
        <a-radio-group v-model:value="formData[item.value]">
          <a-radio
            v-for="(val,index) of item.radioList"
            :key="index"
            :value="val.value"
          >
            {{val.text}}
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 文本框或者下拉框 -->
      <template v-if="item.type=='textOrSelect'">
        <!-- 文本框 -->
        <a-form-item
          :label="item.label()"
          :style="{'width':item.width+'%'}"
          v-if="formData[item.key]==1"
          :name="item.value"
        >
          <a-input
            :placeholder="item.placeholder()"
            type="text"
            v-model:value="formData[item.value()]"
          />
        </a-form-item>
        <!-- 下拉框 -->
        <a-form-item
          :label="item.label()"
          :style="{'width':item.width+'%'}"
          v-if="formData[item.key]==2"
          :name="item.value"
        >
          <a-select
            v-model:value="formData[item.value()]"
            :placeholder="item.placeholder()"
          >
            <a-select-option
              v-for="val of optionData[item.value()]"
              :key="val.id"
              :value="val[item.selectValue]"
            >
              {{val.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
    </template>
  </a-form>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  watch,
  ref,
  getCurrentInstance,
  nextTick,
  onMounted,
} from 'vue';
import { useForm } from '@ant-design-vue/use';
export default defineComponent({
  props: {
    formData: {
      // 表单数据
      type: Object,
    },
    formConfigure: {
      // 表单 配置
      type: Array,
    },
    optionData: {
      // 下拉选择框数据
      type: Object,
      default: {},
    },
    layout: {
      type: String,
    },
    rules: {
      // 表单验证
      type: Object,
      default: {},
    },
    refName: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { ctx }: any = getCurrentInstance();
    let formData = ref({
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
    let resetFormFields = () => {
      ctx.$refs[props.refName].resetFields();
    };
    let clearFormFields = () => {
      ctx.$refs[props.refName].clearValidate();
    };
    let validateForm = () => {
      return ctx.$refs[props.refName].validate();
    };
    return {
      resetFormFields,
      validateForm,
      clearFormFields,
    };
  },
});
</script>

<style lang="scss" scoped>
.ant-form /deep/ .ant-form-item-control-wrapper {
  width: 70%;
}
.ant-form /deep/ .ant-form-item {
  text-align: right;
  height: 60px;
  margin-bottom: 0;
}
.ant-form /deep/ .ant-form-item-control {
  text-align: left;
}
.ant-form /deep/ .has-feedback {
  padding-right: 0 !important;
}
</style>