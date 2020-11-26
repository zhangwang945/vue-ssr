<template>
  <div class="xx" :class="$style.hellow">
    hell33ow{{item.id}}444
    <span class="tt" @click="tt">hel3434343low</span>
    <el-button type="primary" @click="tt">主要按钮</el-button>
    <img src="~assets/header1.png" alt />
  </div>
</template>
<script>

export default {
  name: "Hello",
  computed: {
    item() {
      return this.$store.state.items;
    },
  },
  mounted() {
    console.log(111, this.$route);
    // import('element-ui/lib/dialog')
    console.log(process.env.NODE_ENV);
  },
  methods: {
    tt() {
      this.$store.dispatch("fetchItem", 11)
      this.$message({
        message: "恭喜你，这是一条成功消息",
        type: "success",
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "global";
.hellow {
  background: url("~assets/jinnang.png");
}
</style>
