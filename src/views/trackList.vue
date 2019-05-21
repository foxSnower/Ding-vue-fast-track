<template>
  <div id="app" v-cloak>
    <div class="tab">
      <div class="tab-item" :class="{active:active==0||active==null}" @click="linkTo(0);">待审业务</div>
      <div class="tab-item" :class="{active:active==1}" @click="linkTo(1);">已审业务</div>
    </div>
    <template v-if="active==0||active==null">
      <Buss v-for="(i,index) in listForNeed" :key="index" :bussInfo="i"></Buss>
    </template>
    <template v-if="active==1">
      <Buss v-for="(i,index) in listForApproved" :key="index" :bussInfo="i"></Buss>
    </template>
    <load-more tip="正在加载" v-if="loading"></load-more>
    <load-more :show-loading="false" tip="没有更多" v-if="!loading"></load-more>
  </div>
</template>

<script>
import { LoadMore } from 'vux';
import dd from 'dingtalk-jsapi';
export default {
  name: 'trackList',
  data() {
    return {
      loading: false,
      listParams: {
        limit: 10,
        page: 1,
        queryType: 'needApprove'
      },
      listForNeed: [],
      listForApproved: []
    };
  },
  props: ['active'],
  watch: {
    active: function(curVal) {
      if (curVal == 0) {
        this.$set(this.listParams, 'queryType', 'needApprove');
        this.$set(this.listParams, 'limit', 10);
        this.$set(this.listParams, 'page', 1);
        if (!this.listForNeed.length) {
          this.getData(this.listParams);
        }
      }
      if (curVal == 1) {
        this.$set(this.listParams, 'queryType', null);
        this.$set(this.listParams, 'limit', 10);
        this.$set(this.listParams, 'page', 1);
        if (!this.listForApproved.length) {
          this.getData(this.listParams);
        }
      }
    },
    'listParams.page': function(curVal) {
      console.log(this.listParams);
      this.getData(this.listParams);
    }
  },
  components: {
    Buss: () => import('@/components/Buss'),
    LoadMore
  },
  mounted() {
    let _this = this;
    let params = this.listParams;

    this.setRight(params);
    this.getData(params);
    window.onscroll = function() {
      //文档内容实际高度（包括超出视窗的溢出部分）
      var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      //滚动条滚动距离
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      //窗口可视范围高度
      var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
      if (clientHeight + scrollTop >= scrollHeight) {
        console.log('===加载更多内容……===');
        if (_this.loading) {
          _this.$set(_this.listParams, 'page', params.page + 1);
        }
      }
    };
  },
  methods: {
    getData(params) {
      this.loading = true;
      if (this.active == '1') {
        params.queryType = null;
      } else {
        params.queryType = 'needApprove';
      }
      this.$api
        .getFeeListForMobile(params)
        .then(res => {
          if (!params.queryType) {
            if (params.page == 1) {
              this.listForApproved = res.data;
              this.loading = false;
            } else {
              this.listForApproved = this.listForApproved.concat(res.data);
              if (res.data && res.data.length == 0) {
                this.loading = false;
              }
            }
          } else {
            if (params.page == 1) {
              this.listForNeed = res.data;
              this.loading = false;
            } else {
              this.listForNeed = this.listForNeed.concat(res.data);
              if (res.data && res.data.length == 0) {
                this.loading = false;
              }
            }
          }
        })
        .catch(err => {
           this.loading = false;
        });
    },
    setRight(params) {
      let _this = this;
      dd.biz.navigation.setRight({
        show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
        id: 1,
        iconId: 'search',
        control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
        text: '搜索', //控制显示文本，空字符串表示显示默认文本
        onSuccess: function(result) {
          _this.search(params);
        },
        onFail: function(err) {}
      });
    },
    search(params) {
      let _this = this;
      dd.device.notification.prompt({
        message: '报销类型、申请人姓名',
        title: '搜索',
        buttonLabels: ['取消', '搜索'],
        onSuccess: function(result) {
          if (result.buttonIndex == 1) {
            params.keyword = result.value;
            _this.getData(params);
          }
        },
        onFail: function(err) {}
      });
    },
    linkTo(active) {
      this.$router.push({ name: 'trackList', query: { active: active } });
    }
  }
};
</script>

<style lang='less'>
</style>