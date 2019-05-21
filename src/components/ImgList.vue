<template>
  <div class="file">附件：
    <p v-for="(i,index) in imgList" :key="index"><span @click="showImg(index)">{{i.name}}</span>
      <icon v-if="isModify" type="clear" @click.native="deleteImg(index)"></icon>
    </p>
    <p v-if="isModify">
      <x-icon @click.native="addImg()" type="ios-plus" size="50"></x-icon>
    </p>
  </div>
</template>

<script>
import { Icon } from 'vux';
import dd from 'dingtalk-jsapi';
export default {
  name: 'ImgList',
  data() {
    return {};
  },
  props: ['imgList', 'isModify', 'detailInfo'],
  components: {
    Icon
  },
  watch: {
    imgList: function(curVal) {
      this.updateImg(curVal);
    }
  },
  // mounted() {
  //   this.imgList = [{ name: '1.jpg', url: '123.asdj' }, { name: '2.jpg', url: '123.asdj' }];
  // },
  methods: {
    showImg(index) {
      let imgList = this.imgList;
      let urls = [];
      imgList.forEach(x => {
        urls.push(x.url);
      });
      dd.biz.util.previewImage({
        urls: urls, //图片地址列表
        current: urls[index], //当前显示的图片链接
        onSuccess: function(result) {
          /**/
        },
        onFail: function(err) {}
      });
    },
    ddConfig(data, fn) {
      dd.config({
        agentId: this.$agentId, // 必填，微应用ID
        corpId: this.$corpId, //必填，企业ID
        timeStamp: data.timeStamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.sign, // 必填，签名
        jsApiList: ['biz.util.uploadImage', 'biz.util.previewImage'] // 必填，需要使用的jsapi列表
      });
      dd.error(function(err) {
        alert('dd error: ' + JSON.stringify(err));
      });
      fn();
    },
    getDDSign(fn) {
      this.$api
        .getDDSign({
          url: location.origin + '/',
          companyType: 'test'
        })
        .then(res => {
          this.ddConfig(res.data, fn);
        });
    },
    addImg() {
      let _this = this;
      // this.imgList.push({ name: new Date().getTime() + '.jpg', url: '123.ahsd' });
      dd.biz.util.uploadImage({
        multiple: false, //是否多选，默认false
        max: 3, //最多可选个数
        onSuccess: function(result) {
          this.imgList.push({name:new Date().getTime()+'.jpg',url:result[0]});
          //onSuccess将在图片上传成功之后调用
          /*
          [
            'http://gtms03.alicdn.com/tps/i3/TB1VF6uGFXXXXalaXXXmh5R_VXX-237-236.png'
          ]
          */
        },
        onFail: function(err) {
          _this.getDDSign();
          alert(JSON.stringify(err));
        }
      });
    },
    deleteImg(index) {
      this.imgList.splice(index, 1);
    },
    //更新上传附件的接口数据
    updateImg(list) {
      let params = {
        businessId: this.detailInfo.businessId,
        feeId: this.detailInfo.feeId,
        urls: list
      };
      this.$api.fileUpload(params).then(res => {
        this.$vux.toast.show({
          text: '操作成功'
        });
      });
    }
  }
};
</script>

<style lang='less' scoped="scoped">
.file .vux-x-icon {
  fill: #ccc;
}
.file .weui-icon-clear {
  margin-left: 30px;
  font-size: 12px;
}
.c-body .file > p {
  padding-left: 50px;
  cursor: pointer;
  word-break: break-all;
  span {
    color: #409eff;
  }
}
</style>