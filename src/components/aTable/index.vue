<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :rowKey="rowKey"
    :pagination="isPagination"
    :bordered="isBordered"
  >
    <!-- tag -->
    <template v-slot:tags="{ tags }">
      <span>
        <a-tag
          v-for="(tag,index) of tags"
          :key="index"
          :color="tag.color ? tag.color : '#61afef'"
        >
          {{ tag.content }}
        </a-tag>
      </span>
    </template>
    <!-- switch -->
    <template #switch="{ record }">
      <a-switch
        v-model:checked="record.isEnable"
        @change="changeSwitch(record.isEnable,record)"
      />
    </template>
    <!-- button -->
    <template #button="{ record }">
      <a-button
        style="margin-right:10px"
        v-for="(btn,index) of record.button"
        :key="index"
        :type="btn.type"
        @click="transferData(record,btn.text)"
      >{{btn.text}}</a-button>
    </template>
  </a-table>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    columns: {
      type: Array,
      default: []
    },
    data: {
      type: Array,
      default: []
    },
    isPagination: {
      type: Boolean,
      defult: false
    },
    isBordered: {
      type: Boolean,
      defult: false
    },
    disabled: {
      type: Boolean,
      defult: false
    },
    rowKey: {
      type: String,
      defult: ''
    }
  },
  setup(props,{ emit }) {
    let transferData=(record,text) => {
      emit("btnSeletion",{ record,text })
    }

    let changeSwitch=(checked,record) => {
      emit("changeSwitch",{ checked,record })
    }
    return {
      transferData,
      changeSwitch,
    }
  }
})
</script>

<style scoped>
.ant-table-wrapper /deep/ .ant-table-tbody {
  text-align: center !important;
}
.ant-table-wrapper /deep/ .ant-table-thead > tr > th {
  text-align: center !important;
}
</style>