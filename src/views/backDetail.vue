<template>
  <div class="buss-detail" v-if="detailInfo.businessId">
    <img class="bounceIn" v-if="detailInfo.processStatus4DD=='1'" src="@/assets/tg.png" />
    <img class="bounceIn" v-if="detailInfo.processStatus4DD=='2'" src="@/assets/jj.png" />
    <div class="c-header">
      <div class="icon"><span>{{detailInfo.applicantUserName|filterSub}}</span></div>
      <p>{{detailInfo.applicantUserName}}</p>
      <p>{{detailInfo.applicantTime}}</p>
    </div>
    <div class="c-body">
      <p>业务编号：<span>{{detailInfo.businessId}}</span></p>
      <p>业务类型：<span>{{detailInfo.businessTypeName}}</span></p>
      <p>交易时间：<span>交易时间</span></p>
      <p>收支类型：<span>收支类型</span></p>
      <p>回款类型：<span>{{detailInfo.feeTerm}}</span></p>
      <p>收款单位：<span>{{detailInfo.payee}}</span></p>
      <p>收款开户行：<span>{{detailInfo.payeeOpenUnit}}</span></p>
      <p>收款账号：<span>{{detailInfo.payeeAccountNo}}</span></p>
      <p>交易金额(元)：<span>{{detailInfo.feeMoney}}（{{detailInfo.feeMoney4Big}}）</span></p>
      <p>备注：<span>{{detailInfo.remarks}}</span></p>
      <img-list :imgList="imgList" :isModify="isModify" :detailInfo="detailInfo"></img-list>
      <div v-if="detailInfo.processStatus4DD=='0'">
        <p>审批结果：
          <x-switch style="display: inline-block;vertical-align: middle;" title="" v-model="params.isAgree"></x-switch>
          {{params.isAgree?'同意':'拒绝'}}
        </p>
        <p>审批备注：
          <textarea rows="3" v-model="params.approveView"></textarea>
        </p>
        <p v-if="!isAgree&&rejectList&&rejectList.length!=0">退回节点：
          <select v-model="params.backNodeCode">
            <option :value=null>请选择</option>
            <option v-for="(i,index) in rejectList" :key="index" :value="i.id">{{i.name}}</option>
          </select>
        </p>
        <flexbox style="margin-top:20px;">
          <flexbox-item>
            <x-button type="primary" @click.native="submit()">提交</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="$router.go(-1)">取消</x-button>
          </flexbox-item>
        </flexbox>
        <BussResult v-if="result!==null" :result="result"></BussResult>
      </div>
      <p v-else class="f-warn">注：更详细的审批详情请登录诉讼系统查看！</p>
    </div>
  </div>
</template>

<script>
import { XSwitch, XButton, Flexbox, FlexboxItem } from 'vux';
import dd from 'dingtalk-jsapi';
export default {
  name: 'backDetail',
  data() {
    return {
      result: null,
      isAgree: false,
      params: {
        approveStatus: '1',
        approveNo: null,
        approveView: null,
        backNodeCode: null
      },
      detailInfo: {}, //详情
      imgList: [], //附件列表
      rejectList: null //退回节点列表
    };
  },
  props: ['id'],
  components: {
    ImgList: () => import('@/components/ImgList'),
    BussResult: () => import('@/components/BussResult'),
    XSwitch,
    XButton,
    Flexbox,
    FlexboxItem
  },
  filters: {
    filterSub: function(str) {
      if (str) {
        return str.substr(str.length - 2, str.length);
      }
    }
  },
  mounted() {
    this.setRight();
    this.getData();
  },
  methods: {
    getData() {
      this.$api
        .getFeeDetails({
          feeId: this.id
        })
        .then(res => {
          this.detailInfo = res.data.feeDetail;
          this.imgList = res.data.docs;
          this.rejectList = res.data.rejectList;
        });
    },
    setRight() {
      dd.biz.navigation.setRight({
        show: false //控制按钮显示， true 显示， false 隐藏， 默认true
      });
    },
    submit() {
      let params = this.params;
      params.approveNo = this.detailInfo.approveNo;
      //审批状态 1 同意 2 拒绝 3 定向打回
      if (this.isAgree) {
        params.approveStatus = '1';
      } else {
        if (params.backNodeCode) {
          params.approveStatus = '3';
        } else {
          params.approveStatus = '2';
        }
      }
      this.$api.processOperate(params).then(res => {
        this.result = res.data;
      });
    }
  },
  computed: {
    isModify() {
      if (this.detailInfo.processStatus4DD == '0') {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang='less'>
.c-body .weui-btn_primary {
  background-color: #409eff;
}
.c-body .weui-switch:checked {
  border-color: #409eff;
  background-color: #409eff;
}
</style>