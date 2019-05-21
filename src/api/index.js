import Vue from 'vue'
import http from './http.js'
import api from './api.js'

import dd from 'dingtalk-jsapi';

let corpId = 'dingb9594db0ecde853a35c2f4657eb6378f';// 企业id
let agentId = '245365089';//微应用ID
let userCode = ''; // 通过该免登授权码可以获取用户身份
let isDebug = false;

// dd.ready(function () {
let getUserCode = async (fn) => {
  let userCode = '';
  await dd.runtime.permission.requestAuthCode({
    corpId: corpId,
    onSuccess: function (info) {
      userCode = info.code
    },
    onFail: function (err) {
      userCode = 'yuzunlong';
    }
  });
  return fn(userCode)
}



api.getDDSign({
  url: location.origin + '/',
})
  .then(res => {
    dd.config({
      agentId: agentId, // 必填，微应用ID
      corpId: corpId, //必填，企业ID
      timeStamp: res.data.timeStamp, // 必填，生成签名的时间戳
      nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
      signature: res.data.sign, // 必填，签名
      jsApiList: ['biz.util.uploadImage', 'biz.util.previewImage'] // 必填，需要使用的jsapi列表
    });
    dd.error(function (err) {
      alert('dd error: ' + JSON.stringify(err));
    });
  });



Vue.prototype.$getUserCode = getUserCode;
Vue.prototype.$corpId = corpId;
Vue.prototype.$agentId = agentId;
Vue.prototype.$isDebug = isDebug;
Vue.prototype.$http = http;
Vue.prototype.$api = api;




