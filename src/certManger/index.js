/**
 * @fileOverview 证书管理器
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-08-24 | sizhao  // 初始版本
*/

const os = require('os')
const path = require('path')
const EasyCert = require('node-easy-cert')
const Util = require('../utils')

const rootCertOptions = {
  rootDirPath: Util.getProxyPath(),
  inMemory: false,
  defaultCertAttrs: [
    { name: 'countryName', value: 'CN' },
    { name: 'organizationName', value: 'Pandolajs' },
    { shortName: 'ST', value: 'SH' },
    { shortName: 'OU', value: 'Pandora proxy agent SSL proxy' }
  ]
}

const certInst = new EasyCert(rootCertOptions)

// 生成根证书
function generateRootCA () {
  const options = {
    commonName: 'Pandora Proxy CA',
    overwrite: false
  }

  return new Promise((resolve, reject) => {
    certInst.generateRootCA(options, (error, keyPath, certPath) => {
      if (error !== 'ROOT_CA_EXISTED') {
        reject(error)
      } else {
        console.log('ROOT_CA_EXISTED')
        certPath = certInst.getRootCAFilePath()
        keyPath = path.join(certInst.getRootDirPath(), `${path.basename(certPath, '.crt')}.key`)
      }
      const result = {
        keyPath,
        certPath
      }
      resolve(result)
    })
  })
}

// 信任根证书
function trustRootCA (rootCAPath) {
  const platform = os.platform()
  if (!rootCAPath) {
    rootCAPath = certInst.getRootCAFilePath()
  }
  if(platform === 'darwin') {
    console.log(`Start trusting the root CA which located ${rootCAPath}`)
    const result = Util.exec(`sudo security add-trusted-cert -d -k /Library/Keychains/System.keychain ${rootCAPath}`)
    if (result === null) {
      console.log('Invalid root CA')
    } else if (result.status === 0) {
      console.log('Root CA installed!')
    } else {
      console.log('Failed install Root CA.')
    }
  } else {
    console.log('Please trust the Root CA manually.')
  }
}

// 获取根证书
function getCertificate (hostname = 'localhost') {
  return new Promise((resolve, reject) => {
    certInst.getCertificate(hostname, (error, key, cert) => {
      if (error) {
        reject(error)
      }
      resolve({
        key,
        cert
      })
    })
  })
}

module.exports = Object.assign({}, certInst, {
  generateRootCA,
  trustRootCA,
  getCertificate
})
