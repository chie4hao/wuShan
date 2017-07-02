/**
 * Created by chie on 2016/5/5.
 */
const config = require('./config');

function RequestOptions(hostname, path, method, referer) {
    // 根据我自己浏览器伪造的headers,其实很多都用不上的
  const headers = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'Cache-Control': 'max-age=0',
    Connection: 'keep-alive',
    Cookie: `p_ab_id=0;login_ever=yes;a_type=0;PHPSESSID=${config.PHPSESSID};`,
    Host: 'www.pixiv.net',
    Referer: 'http://www.pixiv.net/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
  };
  headers.Referer = referer;
  headers.Host = hostname;
  // this.hostname = hostname;
  // this.path = path;
  this.method = method;
  this.headers = RequestHeaders(headers);
}

function RequestHeaders(b) {
  return Object.assign({}, b, {});
}

module.exports = RequestOptions;
