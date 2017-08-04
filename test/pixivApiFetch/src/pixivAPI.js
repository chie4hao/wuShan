const $ = require('cheerio');

const PixivOption = require('./pixivOption.js');
const htmlFetch = require('./globalFetchQueue').htmlFetch();
const config = require('./config');
const illustIdToOriginal = require('./illustIdToOriginal');

class DownloadSearch {
  constructor(arg) {
    this.searchType = typeof (arg);
    if (this.searchType === 'string') {
      this.searchUrl = `https://www.pixiv.net/search.php?word=${encodeURI(arg)}&order=date_d${config.R18 ? '&r18=1' : ''}&p=`;
    } else if (this.searchType === 'number') {
      this.searchUrl = `https://www.pixiv.net/member_illust.php?id=${arg}&type=all&p=`;
    } else throw new TypeError(`The arg type '${this.searchType}' unaccepted`);
  }

  async searchStrMaximumPage(begin, end) {
    if (begin === end) return begin;
    const currentPage = Math.floor((begin + end) / 2);
    const unit = $('#wrapper ._unit', await htmlFetch(`${this.searchUrl}${currentPage}`, new PixivOption('GET', 'http://www.pixiv.net/')));
    const imageWorkCount = $('.column-search-result .image-item .work', unit).length;
    if (imageWorkCount === 40) {
      const pager = $('.column-order-menu .pager-container ul li a', unit);
      const currentMaxpage = Math.max(...Array.prototype.map.call(pager, a => a.children[0].data));
      if (currentMaxpage - currentPage < 4) return Math.max(currentMaxpage, currentPage);
      return this.searchStrMaximumPage(currentMaxpage, end);
    } else if (imageWorkCount === 0) {
      if (currentPage <= 1) return 0;
      return this.searchStrMaximumPage(begin, currentPage - 1);
    }
    return currentPage;
  }

  async authorIdMaxinumPage(currentPage) {
    const htmlDecoded = await htmlFetch(`${this.searchUrl}${currentPage}`, new PixivOption('GET', 'http://www.pixiv.net/'));
    const pager = $('#wrapper .column-order-menu .pager-container ul li a', htmlDecoded);
    if (pager.length === 0) {
      if (currentPage === 1 && $('#wrapper .layout-column-2 .image-item', htmlDecoded).length !== 0) return 1;
      return 0;
    }
    const currentMaxpage = Math.max(...Array.prototype.map.call(pager, a => a.children[0].data));
    if (currentMaxpage - currentPage < 4) return Math.max(currentMaxpage, currentPage);
    return this.authorIdMaxinumPage(currentMaxpage);
  }

  async downloadSearchStr(pager) {
    return Promise.all(Array.from({ length: pager }).map((value, index) => {
      const page = index + 1;
      return (async () => {
        const htmlDecoded = await htmlFetch(`${this.searchUrl}${page}`, new PixivOption('GET', 'http://www.pixiv.net/'));
        const imageWork = $('#wrapper ._unit .column-search-result .image-item', htmlDecoded);
        const illustIdArray = [];

        Array.from(imageWork).forEach(imageItem => {
          const illustId = $('.work', imageItem)[0].attribs.href.match(/\d*$/)[0];
          const bookmark = $('ul .bookmark-count', imageItem)[0];
          const bookmarkCount = bookmark ? bookmark.children[1].data : 0;
          if (bookmarkCount >= config.minimumBookmark) illustIdArray.push({ illustId });
        });

        return Promise.all(illustIdArray.map(illust =>
          (async () => illustIdToOriginal(illust.illustId))()
        ));
      })();
    }));
  }

  async downloadAuthorId(pager) {
    return Promise.all(Array.from({ length: pager }).map((value, index) => {
      const page = index + 1;
      return (async () => {
        const htmlDecoded = await htmlFetch(`${this.searchUrl}${page}`, new PixivOption('GET', 'http://www.pixiv.net/'));
        const imageWork = $('#wrapper ._unit ._image-items .image-item .work', htmlDecoded);
        return Promise.all(Array.from(imageWork).map(imageItem => {
          const illustId = imageItem.attribs.href.match(/\d*$/)[0];
          // console.log(illustId);
          return (async () => illustIdToOriginal(illustId))();
        }));
      })();
    }));
  }

  async begin() {
    let pager;
    switch (this.searchType) {
      case 'string':
        pager = await this.searchStrMaximumPage(1, 1000);
        return this.downloadSearchStr(pager);
      case 'number':
        pager = await this.authorIdMaxinumPage(1);
        return this.downloadAuthorId(pager);
      default:
        return 0;
    }
  }
}

const pixivDownload = async (arg) => new DownloadSearch(arg).begin();

module.exports = pixivDownload;
