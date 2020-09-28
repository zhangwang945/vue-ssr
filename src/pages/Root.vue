<template>
  <div>
    root{{ item.id }}4455
    <Child />
  </div>
</template>
<script>
import Child from "./Child";
import fooStoreModule from "../store/module/foo";
console.log(999);
export default {
  name: "Root",
  components: { Child },
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    store.registerModule("foo", fooStoreModule);
    console.log("async" + route.query.id);
    return Promise.all([
      store.dispatch("fetchItem", 999),
      store.dispatch("foo/inc"),
    ]);
  },
  computed: {
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
