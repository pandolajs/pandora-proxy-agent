/**
 * @fileOverview 安装后初始化代理
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-06 | sizhao  // 初始版本
*/

const certMgt = require('../src/certManger')

function init () {
  certMgt.generateRootCA().then(({ keyPath, certPath }) => {
    console.log('keyPath:', keyPath, 'certPath:', certPath)
    certMgt.trustRootCA(certPath)
  })
}

init()
