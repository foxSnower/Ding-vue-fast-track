<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  // mounted(){
  //   this.$api.gateway({}).then(res=>{
  //     console.log(res)
  //   })
  // }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
