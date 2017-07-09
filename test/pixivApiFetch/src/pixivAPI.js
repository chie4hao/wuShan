const $ = require('cheerio');

const PixivOption = require('./pixivOption.js');
const htmlFetch = require('./globalFetchQueue').htmlFetch();
const originalFetch = require('./globalFetchQueue').originalFetch();
const illustIdToOriginal = require('./illustIdToOriginal');
const config = require('./config');

const downloadAllSearch = async (searchStr) => {
  for (let page = 1; ;page += 1) {
    const searchUrl = `https://www.pixiv.net/search.php?word=${encodeURI(searchStr)}&order=date_d&p=${page}${config.R18 ? '&r18=1' : ''}`;
    const unit = $('#wrapper ._unit', await htmlFetch(searchUrl, new PixivOption('GET', 'http://www.pixiv.net/')));
    const imageWork = $('.column-search-result .image-item .work', unit);
    const illustIdArray = Array.prototype.map.call(imageWork, a => a.attribs.href.match(/\d*$/)[0]);
    Promise.all(illustIdArray.map(i => illustIdToOriginal(i))).then(a => console.log(a));
    const pager = $('.column-order-menu .pager-container ul li a', unit);
    if (Array.prototype.every.call(pager, a => page > a.children[0].data)) {
      return 1;
    }
  }
};

downloadAllSearch('cubase').then(a => console.log(a)).catch(e => console.log(e));
