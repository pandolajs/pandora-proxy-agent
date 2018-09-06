/**
 * @fileOverview HTTPS 代理服务
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-06 | sizhao  // 初始版本
*/

const event = require('events')
const https = require('https')
const tls = require('tls')
const url = require('url')
const http = require('http')
const fs = require('fs')
const net = require('net')
const certMgt = require('../certManger')

certMgt.getCertificate('127.0.0.1').then(({ key, cert }) => {
  https.createServer({
    async SNICallback (servername, callback) {
      console.log('servername:', servername)
      const hostCert = await certMgt.getCertificate(servername)
      callback(null, tls.createSecureContext({
        cert: hostCert.cert,
        key: hostCert.key
      }))
    },
    cert,
    key
  }).on('request', (request, response) => {
    console.log('request:', request.url)
    response.writeHead(200)
    response.end('Hello, World')
  }).listen(9999, '0.0.0.0')

  console.log('https: start ....')
})

http.createServer()
  .on('connect', (request, socket) => {
    const [, reqPort] = request.url.split(':')
    let proxyPort = +reqPort === 443 ? 9999 : 8889

    const conn = net.connect(proxyPort, '127.0.0.1', () => {
      socket.write(
        'HTTP/' + request.httpVersion + ' 200 OK\r\n\r\n',
        'UTF-8',
        () => {
          conn.pipe(socket)
          socket.pipe(conn)
        }
      )
    })
  }).listen(8889, '0.0.0.0')
