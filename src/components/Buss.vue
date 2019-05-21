<template>
  <div class="box" @click="linkTo()">
    <div class="lanren">
      <div class="approved-icon">
        <img v-if="bussInfo.processStatus4DD=='1'" src="@/assets/tg.png" />
        <img v-if="bussInfo.processStatus4DD=='2'" src="@/assets/jj.png" />
      </div>
      <div class="ribbon-lanren">
        <div class="ribbon ribbon-green" v-if="bussInfo.processName=='支出流程'">{{bussInfo.processName}}</div>
        <div class="ribbon ribbon-blue" v-else-if="bussInfo.processName=='回款流程'">{{bussInfo.processName}}</div>
        <div class="ribbon ribbon-red" v-else>{{bussInfo.processName}}</div>
      </div>
      <div class="content">
        <p>申请人：{{bussInfo.customerName}}</p>
        <p>报销类型：{{bussInfo.feeTerm}}</p>
        <p>业务类型：{{bussInfo.businessTypeName}}</p>
        <p>付款金额：{{bussInfo.feeMoney}}（{{bussInfo.feeMoney4Big}}）</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Buss',
  props: ['bussInfo'],
  methods: {
    linkTo() {
      let processName = this.bussInfo.processName;
      if (processName == '支出流程') {
        this.$router.push({ name: 'paymentDetail', params: { id: this.bussInfo.id } });
      }
      if (processName == '回款流程') {
        this.$router.push({ name: 'backDetail', params: { id: this.bussInfo.id } });
      }
    }
  }
};
</script>

<style lang='less'>
</style>