import http from './http.js'

const SYSTEM = '/lawService';//网关
// const SYSTEM = '';//网关


const api = {
  //网关
  gateway(params) { return comAPI('get', SYSTEM + '/gateway/get', params) },
  //获取钉钉签名
  getDDSign(params) { return comAPI('get', SYSTEM + '/upload/getDDSign', params) },
  //审批列表
  getFeeListForMobile(params) { return comAPI('post', SYSTEM + '/upload/getFeeListForMobile', params) },
  //费用详情
  getFeeDetails(params) { return comAPI('get', SYSTEM + '/upload/getFeeDetails', params) },
  //流程操作
  processOperate(params) { return comAPI('post', SYSTEM + '/upload/processOperate', params) },
  //上传附件
  fileUpload(params) { return comAPI('post', SYSTEM + '/upload/fileUpload', params) },
}

const comAPI = (method, url, params) => {
  params == null ? {} : params;
  switch (method) {
    case 'post':
      // alert(url);
      // alert(JSON.stringify(params));
      return http.post(url, params).then(res => {
        return res
      })
      break;
    case 'get':
      return http.get(url, {
        params
      }).then(res => {
        return res
      })
      break;
    default:
      break;
  }
}
export default api