<template>
  <div>
    child
    <div>::{{ item.id }}--{{fooCount}}</div>
  </div>
</template>
<script>

export default {
  name: "Child",
  computed: {
    item() {
      return this.$store.state.items;
    },
    fooCount () {
      return this.$store.state.foo.count
    }
  },
};
</script>
