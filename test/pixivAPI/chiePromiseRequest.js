/**
 * Created by chie on 2016/5/13.
 */
/* eslint promise/always-return: 0, promise/catch-or-return: 0,*/
const async = require('async');
const https = require('https');
const fs = require('fs');
const config = require('./config');
const zlib = require('zlib');

const htmlGetQueue = async.queue((task, callback) => {
  task(callback);
}, config.HtmlGetCount);

const originalQueue = async.queue((task, callback) => {
  task(callback);
}, config.OriginalGetCount);

const request = function (method, options, parameters, uploadcount) {
  let uploadcount1 = uploadcount || 0;
  switch (method) {
    case 'html':
      return new Promise((resolve, reject) => {
        htmlGetQueue.push((cb) => {
          htmlGetPromise(options).then((a) => {
            cb();
            resolve(a);
          }, (a) => {
            cb();
            if (a === 'htmlGet超时' || a.indexOf('problem with request htmlGet') !== -1) {
              if (uploadcount1 < config.htmlGetRetransmissionCount) {
                console.log(a);
                                // 重传,重传次数为uploadcount
                uploadcount1 += 1;
                request(method, options, parameters, uploadcount1).then((ad) => {
                  resolve(ad);
                }, (at) => {
                  reject(at);
                }).catch((as) => {
                  throw as;
                });
              } else {
                reject(`${config.htmlGetRetransmissionCount}次htmlGet重传失败,网络问题`);
              }
            } else {
              reject(a);
            }
          });
        }, () => {
                    // 判断执行完毕的回调
        });
      });
    case 'originalOne':
      return new Promise((resolve, reject) => {
        originalQueue.push((cb) => {
          originalPromise(options, parameters).then((a) => {
            cb();
            resolve(a);
          }, (a) => {
            cb();
            if (a.indexOf('重传') !== -1) {
              if (uploadcount1 < config.originalOneRetransmissionCount) {
                console.log(a);
                uploadcount1 += 1;
                request(method, options, parameters, uploadcount1).then((ad) => {
                  resolve(ad);
                }, (b) => {
                  reject(b);
                }).catch((as) => {
                  throw as;
                });
              } else {
                                // 返回结果数组,不reject
                resolve(`${config.originalOneRetransmissionCount}次originalOne重传失败,网络问题`);
              }
            } else {                        // 其他未知错误
              reject(a);
            }
          });
        }, () => {
                    // 判断执行完毕的回调
        });
      });
    default :
      throw new Error('lksjdf');
  }
};

let originalPromise = function (options, parameters) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('base64');
      res.on('end', () => {
        resolve('写完');
      });
    });

    req.on('response', (response) => {
      const output = fs.createWriteStream('./resources/' + parameters.name.replace(/\\|\/|\?|\*|:|"|<|>/g, ''), { encoding: 'base64' });
      response.pipe(output);
    });

    req.on('error', (e) => {
      reject(`需重传2${e}`);
    });

    req.setTimeout(config.originalOneGetTimeOut, () => {
      req.abort();
      reject('需重传1');
    });
    req.end();
  });
};

let htmlGetPromise = function (options) {
  return new Promise((resolve, reject) => {

    const req = https.request(options, (res) => {
            // console.log('STATUS: ' + res.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
      let size = 0;
      const chunks = [];
            // res.setEncoding("utf8");

      res.on('data', (chunk) => {
        size += chunk.length;
        chunks.push(chunk);
      });

      res.on('end', () => {
        const data = Buffer.concat(chunks, size);
                // Content-Encoding为gzip
        // console.log(data);
        if (res.headers['content-encoding'] === 'gzip') {
          zlib.gunzip(data, (err, decoded) => {
            resolve(decoded);
          });
        } else {
          reject('htmlGet error content encoding');
        }
      });
    });

    req.on('error', (e) => {
      reject(`problem with request htmlGet: ${e.message}`);
    });

    req.setTimeout(config.htmlGetTimeout, () => {
      req.abort();
      reject('htmlGet超时');
    });

    req.end();
  });
};
module.exports = request;
