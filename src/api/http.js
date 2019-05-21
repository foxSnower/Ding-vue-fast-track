import Vue from 'vue'
import axios from 'axios'
import { ToastPlugin } from 'vux'

// Vue.use(ToastPlugin, { type: 'text', position: 'top' })
let vm = Vue;

const DEV = 'http://172.16.200.110:30111';
const SIT = 'http://172.16.200.112:30111';
const UAT = 'http://47.106.46.65:30111';
const PRD = 'http://120.78.25.128:30111';
const Test = 'http://172.16.202.214:30906';

const locationOrigin = location.origin;

// switch (locationOrigin) {
//   case 'http://172.16.202.215:32206':
//     console.log("-----当前环境-------：SIT" + SIT);
//     URL = SIT
//     break;
//   case 'http://120.79.154.198:32206':
//     console.log("-----当前环境-------：UAT" + UAT);
//     URL = UAT
//     break;
//   case 'http://120.79.162.165:32206':
//   case 'http://bm.hongte.info':
//     console.log("-----当前环境-------：PRD" + PRD);
//     URL = PRD
//     break;
//   default:
//     console.log("-----当前环境-------：DEV" + DEV);
//     URL = DEV
//     break;
// }

URL = process.env.GATEWAY_URL && process.env.GATEWAY_URL !== 'undefined' ? process.env.GATEWAY_URL : '';
// URL = 'http://127.0.0.1:30601';
//默认进件管理系统
const global_ = {
  BASE_URL: URL,
  SYSTEM_NAME: '快速审批',
  SYSTEM_SHORT_NAME: 'FASTTRACK',
}

Vue.prototype.$GLOBAL = global_;

const http = axios.create({
  timeout: 1000 * 10,
  baseURL: global_.BASE_URL,
  headers: {
    // 'app': Vue.prototype.$GLOBAL.APP,
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(async request => {
  let $getUserCode = Vue.prototype.$getUserCode;
  let isDebug = Vue.prototype.$isDebug;
  if (isDebug) {
    if (request.method == 'get') {
      request.params.ddUserId = 'yuzunlong';
    }
    if (request.method == 'post') {
      request.data.ddUserId = 'yuzunlong';
    }
  } else {
    await $getUserCode(ddUserId => {
      if (request.method == 'get') {
        // alert(ddUserId)
        request.params.ddUserId = ddUserId;
      }
      if (request.method == 'post') {
        // alert(ddUserId)
        request.data.ddUserId = ddUserId;
      }
    });
  }
  vm.$vux.loading.show();
  return request;
}, err => {
  return Promise.reject(err)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(res => {
  vm.$vux.loading.hide();
  if (res.data) {
    if (res.data.code == '1' || res.data.code == 0 || res.data.code == "0000") {
      return res.data
    } else {
      vm.$vux.toast.show({
        text: res.data.msg || res.data.code
      })
    }
  } else {
    vm.$vux.toast.show({
      text: '返回数据异常!'
    })
  }
}, error => {
  vm.$vux.loading.hide();
  alert(JSON.stringify(error))
  if (error.response) {
    if (error.response.status == 500) {
      vm.$vux.toast.show({
        text: "系统维护中,请稍后在试 !"
      })

    } else {
      vm.$vux.toast.show({
        text: error.response.data.msg || error.response.data.result_msg
      })

    }
  } else {
    vm.$vux.toast.show({
      text: '请求超时,请稍后在试 !'
    })
  }
  return Promise.reject(error)
})

export default http
