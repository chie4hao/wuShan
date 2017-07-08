const PixivOption = require('./pixivOption.js');

const htmlFetch = require('./globalFetchQueue').htmlFetch();

// const retryRequestQueue = require('./requestQueue');

const searchUrl = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=63515757';
const q = new PixivOption('GET', 'http://www.pixiv.net/');

htmlFetch(searchUrl, q).then(res => res.text()).then((a) => console.log(a)).catch(e => console.log(e));
