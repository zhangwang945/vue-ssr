<template>
  <div id="app">
    <div :class="$style.hhh">
      <div :class="$style.btn" @click="$router.push('/hellow')">
        点击到hellow组件
      </div>
      <div :class="$style.btn" @click="$router.push('/')">点击到/组件</div>
      <!-- <Aa>
        <div slot="hhh">1111</div>
      </Aa>
      <Bb /> -->
    </div>
    <router-view></router-view>
    <!-- <img src="~assets/1.jpg" alt=""> -->
  </div>
</template>
<script>
// import Aa from './Aa.vue'
// import Bb from './Bb.vue'
// import { Button } from 'element-ui'

export default {
  name: "App",
  // components: { Aa, Bb },

  data() {
    return {
      show: true,
      x:{tt:'xx'}
    };
  },
  computed: {

  },
  methods: {
    handle() {

      this.show = !this.show;
    },
  },
  mounted() {
    console.log(11111,process.env.IS_SSR,process.env.NODE_ENV);
    // fetch('/api/v5/home/index').then((a)=>{
    //   console.log(a.json());
    // }).catch(()=>{
    // })
    
  },
};
</script>
<style lang="scss" module>
// @import "math";

body,
html {
  height: 100%;
  margin: 0;
}
.hhh {
  font-weight: bold;
}

.btn {
  line-height: 30px;
  background: lightblue;
  width: 150px;
  cursor: pointer;
}
</style>
