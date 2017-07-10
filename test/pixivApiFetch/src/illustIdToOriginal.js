const $ = require('cheerio');
const fs = require('fs');
const PixivOption = require('./pixivOption.js');
const htmlFetch = require('./globalFetchQueue').htmlFetch();
const originalFetch = require('./globalFetchQueue').originalFetch();
const config = require('./config');
const fetch = require('node-fetch');

// const originalFetch = require('./globalFetchQueue').originalFetch();

const illustIdOriginal = async (illustId) => {
  const mediumUrl = `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illustId}`;
  // return await htmlFetch(mediumUrl, new PixivOption('GET', 'http://www.pixiv.net/'));
  const wrapper = $('#wrapper', await htmlFetch(mediumUrl, new PixivOption('GET', 'http://www.pixiv.net/')));
  const worksDisplay = $('.works_display', wrapper);
  const tagsArray = $('.work-tags dl dd ul li .text', wrapper);

  let tagsStr = '';
  Array.prototype.forEach.call(tagsArray, a => {
    tagsStr += ` ${a.children[0].data}`;
  });
  if (config.tagExistsFilter.every(a => tagsStr.indexOf(a) !== -1)
    && config.tagNotExistsFilter.every(b => tagsStr.indexOf(b) === -1)) {
    if ($('img', worksDisplay).length !== 0) {
      if ($('.player', worksDisplay).length !== 0) {
        const ugoiraUrl = `https://www.pixiv.net/member_illust.php?mode=ugoira_view&illust_id=${illustId}`;
        const ugoiraText = await htmlFetch(ugoiraUrl, new PixivOption('GET', mediumUrl));
        const a = ugoiraText.match(/https:\\\/\\\/i2.pixiv.net\\\/img-zip-ugoira\\\/img.+zip/)[0].replace(/\\/g, '');
        fetch(a, new PixivOption('GET', ugoiraUrl))
          .then(res => {
            const dest = fs.createWriteStream('./test/pixivApiFetch/resources/q.zip');
            res.body.pipe(dest);
        });
        return a;
        return `${illustId} a player`;
      } else if ($('a', worksDisplay).length !== 0) {
        // 漫画模式
        if (config.mangaModel) {
          const mangaUrl = `https://www.pixiv.net/member_illust.php?mode=manga&illust_id=${illustId}`;
          const mangaText = await htmlFetch(mangaUrl, new PixivOption('GET', mediumUrl));
          // const count = $('.page-menu .total', mangaText).text();
          const urlList = Array.prototype.map.call($('#main .manga .item-container a', mangaText), a => `https://www.pixiv.net${a.attribs.href}`);
          const a = await Promise.all(urlList.map((mangaOriginal =>
            (async () => {
              const mangaOriginalUrl = $('img', await htmlFetch(mangaOriginal, new PixivOption('GET', mangaUrl))).attr('src');
              // 这句不安全
              const mangaOriginalType = mangaOriginalUrl.match(/_p\d*\.\w*$/)[0];
              const name = $('.title', wrapper)[0].children[0].data;
              const filepath = './test/pixivApiFetch/resources/';
              const filename = `${illustId}_${name}${mangaOriginalType}`.replace(/\\|\/|\?|\*|:|"|<|>/g, '');
              const res = await originalFetch(mangaOriginalUrl, new PixivOption('GET', mangaOriginal), filepath + filename);
              return res;
            })()
          )));
          return a;
        }
        return `${illustId} manga 已过滤`;
      }
      // 单图
      const imageUrl = $('._illust_modal img', wrapper).attr('data-src');
      const imageType = imageUrl.match(/\.\w*$/)[0];
      const name = $('.title', wrapper)[0].children[0].data;
      const filepath = './test/pixivApiFetch/resources/';
      const filename = `${illustId}_${name}${imageType}`.replace(/\\|\/|\?|\*|:|"|<|>/g, '');
      const res = await originalFetch(imageUrl, new PixivOption('GET', mediumUrl), filepath + filename);
      return res;
    }
    return `${illustId} 图片地址未找到`;
  }
  return `${illustId} 已过滤`;
};

module.exports = illustIdOriginal;

illustIdOriginal(51012701).then(a => console.log(a)).catch(e => console.log(e));
