'use strict'
/**
 * 获得npm run XX -- GATEWAY_URL 的参数
 */
let GATEWAY_URL = process.argv.splice(2)[0] || process.env.GATEWAY_URL;
console.log("当前环境：" + GATEWAY_URL);

module.exports = {
  NODE_ENV: '"production"',
  GATEWAY_URL: '"' + GATEWAY_URL + '"'
}
