/**
 * @fileOverview 工具方法
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-06 | sizhao  // 初始版本
*/

const os = require('os')
const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync

// 获取系统 home
function getUserHome () {
  return os.homedir()
}

// 获取 pandora home 目录
function getPandoraHome () {
  const home = getUserHome()
  const pandoraHome = path.join(home, '.pandora')
  if (!fs.existsSync(pandoraHome)) {
    fs.mkdirSync(pandoraHome)
  }
  return pandoraHome
}

// 获取 proxy 路径
function getProxyPath () {
  const pandoraHome = getPandoraHome()
  const proxyPath = path.join(pandoraHome, 'certificates')
  if (!fs.existsSync(proxyPath)) {
    fs.mkdirSync(proxyPath)
  }
  return proxyPath
}

// 执行脚本
function exec (cmd = '') {
  let stdout = ''
  let status = 0
  if (!cmd) {
    return null
  }
  try {
    stdout = execSync(cmd)
  } catch (error) {
    stdout = error.stdout
    status = error.status
  }

  return {
    stdout,
    status
  }
}

module.exports = {
  getUserHome,
  getPandoraHome,
  getProxyPath,
  exec
}
