<template>
  <div>
    queryId:{{ item.id }}
    <Child />
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import Child from "./Child";
import fooStoreModule from "../store/module/foo";
export default {
  name: "Root",
  components: { Child },
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    store.registerModule("foo", fooStoreModule);
    console.log("async" + route.query.id);
    return Promise.all([
      store.dispatch("fetchItem", route.query.id),
      store.dispatch("foo/inc"),
    ]);
  },
  serverCacheKey: props => 'Root1',
  computed: {
    ...mapGetters({storeItems:'storeItems'}),
    item() {
      return this.$store.state.items;
    },
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    this.$store.unregisterModule("foo");
  },
};
</script>
