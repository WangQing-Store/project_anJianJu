<template>
  <a-menu
    theme="dark"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
  >
    <template
      v-for="(item,index) of route"
      :key="index"
    >
      <a-menu-item
        v-if="item.children!=undefined && item.children.length<=1 || item.name=='Layout'"
        :key="item.path"
        @click="skip(item.path)"
      >
        <HomeOutlined />
        <span>{{item.meta.title!=undefined ? item.meta.title : ""}}</span>
      </a-menu-item>
      <a-sub-menu
        :key="item.path"
        v-if="item.children!=undefined && item.children.length>1 && item.name!='Layout'"
      >
        <template v-slot:title>
          <AppstoreOutlined />
          <span>
            <span>{{item.meta.title ? item.meta.title : ""}}</span>
          </span>
        </template>
        <a-menu-item
          v-for="val of item.children"
          :key="val.path"
          @click="skip(`${item.path}/${val.path}`)"
        >
          {{val.meta.title}}
        </a-menu-item>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
  props: {
    routes: {
      type: Object,
    },
  },
  components: {
    HomeOutlined,
    AppstoreOutlined,
  },
  setup(props) {
    const $router = useRouter();
    const route: any = ref({});
    const { ctx }: any = getCurrentInstance();
    const Route = reactive({
      routers: inject('routes'),
    });
    route.value = Route.routers;
    const skip = (path: any) => {
      $router.push(path);
    };
    const selectedKeys = ref(['1']);
    return {
      route,
      selectedKeys,
      skip,
    };
  },
});
</script>

<style scoped>
.ant-menu-submenu /deep/ .ant-menu-submenu-title {
  text-align: left;
}
.ant-menu-item {
  text-align: left;
}
</style>