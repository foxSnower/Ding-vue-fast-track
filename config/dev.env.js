'use strict'
console.log("当前环境：" + process.env.GATEWAY_URL);
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GATEWAY_URL: '"' + process.env.GATEWAY_URL + '"'
})


