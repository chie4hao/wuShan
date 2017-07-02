const url = require('url');
const PixivOption = require('./pixivOption.js');
const nodeFetch = require('node-fetch');
const async = require('async');

const searchUrl = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=63515757';
const searchUrlParser = url.parse(searchUrl);
const q = new PixivOption(searchUrlParser.hostname, searchUrlParser.path, 'GET', 'http://www.pixiv.net/');

console.log(q);
// fetch(q);

nodeFetch(searchUrl, q)
  .then(res => res.text())
  .catch(e => console.log(e));
