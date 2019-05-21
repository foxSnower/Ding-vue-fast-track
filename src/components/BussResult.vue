/**
 * @author FoxSnower 2019-03-11 11:23:02
 * @describe 提交结果
 */

<template>
  <div class="result">
    <div class="cont">
      <img v-if="result==0||result==1" src="@/assets/yes.png">
      <img v-if="result==2" src="@/assets/no.png">
      <p v-if="result==0">已审批完成！</p>
      <p v-if="result==1">已审批拒绝！</p>
      <p v-if="result==0||result==1">具体审批详情请登录诉讼系统查看！</p>
      <p v-if="result==2">该业务已审批，无需重复审批！</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BussResult',
  data() {
    return {};
  },
   props: ['result'],
};
</script>

<style lang='less'>
</style>


