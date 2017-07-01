/**
 * Created by chie on 2016/5/8.
 */

const chiePixiv = require('./chiePixiv');
const chieRequest = require('./chiePromiseRequest.js');
const PixivOption = require('./pixivOption.js');
const $ = require('cheerio');
const url = require('url');
const config = require('./config');

const pixivAPI = {
    // 下载搜索结果一页的全部图片
  searchIllust(searchStr, page) {
    return new Promise((resolve) => {
      const searchUrl = `http://www.pixiv.net/search.php?word=${encodeURI(searchStr)}&order=date_d&p=${page}${config.R18 ? '&r18=1' : ''}`;
      const searchUrlParser = url.parse(searchUrl);
      chieRequest('html', new PixivOption(searchUrlParser.hostname, searchUrlParser.path, 'GET', 'http://www.pixiv.net/'), {}).then((decoded) => {
        const imageWork = $('.column-search-result .image-item .work', decoded.toString());

        illustIdWordArraySearch(imageWork, page, resolve);
      }, (b) => {
        resolve(`error:搜索页解析失败${b}`);
      }).catch((a) => {
        throw a;
      });
    });
  },

    // 下载某id作者一页中所有图片
  authorIdIllust(id, page) {
    return new Promise((resolve) => {
      const idUrl = `http://www.pixiv.net/member_illust.php?id=${id}&type=all&p=${page}`;
      const idUrlParser = url.parse(idUrl);

      chieRequest('html', new PixivOption(idUrlParser.hostname, idUrlParser.path, 'GET', 'http://www.pixiv.net/'), {}).then((decoded) => {
        const imageWork = $('#wrapper ._image-items .image-item .work', decoded.toString());

        illustIdWordArraySearch(imageWork, page, resolve);
      }, (b) => {
        resolve(`error:搜索页解析失败${b}`);
      }).catch((a) => {
        throw a;
      });
    });
  },

    // 查找文字搜索结果页数
  searchPageCount(searchStr, page) {
    return new Promise((resolve, reject) => {
      const pageCount = page || 1;
      const searchUrl = `http://www.pixiv.net/search.php?word=${encodeURI(searchStr)}&order=date_d&p=${pageCount}${config.R18 ? '&r18=1' : ''}`;
      const searchUrlParser = url.parse(searchUrl);
      chieRequest('html', new PixivOption(searchUrlParser.hostname, searchUrlParser.path, 'GET', 'http://www.pixiv.net/'), {}).then((decoded) => {
        const current = $('#wrapper .column-order-menu .pager-container ul .current', decoded.toString());
                //  ul
        if (current.length !== 0) {
          const pager = $('#wrapper .column-order-menu .pager-container', decoded.toString());
          if ($('.next a', pager).length !== 0) {
            const pageList = $('ul li a', pager);
            let maxPage = 0;
            Array.prototype.forEach.call(pageList, (a) => {
              const pageItem = parseInt(a.children[0].data);
              if (pageItem > maxPage) maxPage = pageItem;
            });
                        // 递归找到最后一页
            pixivAPI.searchPageCount(searchStr, maxPage).then((a) => {
              resolve(a);
            }, (b) => {
              reject(b);
            });
          } else {
            resolve(pageCount);
          }
        } else if ($('#wrapper .column-search-result .image-item', decoded.toString()).length !== 0) {
          resolve(1);
        } else {
          resolve(0);
        }
      }, (a) => {
        reject(`search页数解析失败${a}`);
      });
    });
  },

    // 和上一个差不多，暂时放着
  authorIdPageCount(id, page) {
    return new Promise((resolve, reject) => {
      const pageCount = page || 1;
      const searchUrl = `http://www.pixiv.net/member_illust.php?id=${id}&type=all&p=${pageCount}`;
      const searchUrlParser = url.parse(searchUrl);
      chieRequest('html', new PixivOption(searchUrlParser.hostname, searchUrlParser.path, 'GET', 'http://www.pixiv.net/'), {}).then((decoded) => {
        const current = $('#wrapper .column-order-menu .pager-container ul .current', decoded.toString());
                //  ul
        if (current.length !== 0) {
          const pager = $('#wrapper .column-order-menu .pager-container', decoded.toString());
          if ($('.next a', pager).length !== 0) {
            const pageList = $('ul li a', pager);
            let maxPage = 0;
            Array.prototype.forEach.call(pageList, (a) => {
              const pageItem = parseInt(a.children[0].data);
              if (pageItem > maxPage) maxPage = pageItem;
            });
            pixivAPI.authorIdPageCount(id, maxPage).then((a) => {
              resolve(a);
            }, (b) => {
              reject(b);
            });
          } else {
            resolve(pageCount);
          }
        } else if ($('#wrapper .column-search-result .image-item', decoded.toString()).length !== 0) {
          resolve(1);
        } else {
          resolve(0);
        }
      }, (a) => {
        reject(`author页数解析失败${a}`);
      }).catch((a) => {
        throw a;
      });
    });
  },
  downloadAllIllust(a) {
    return new Promise((resolve) => {
      (typeof (a) === 'string' ? pixivAPI.searchPageCount(a) : pixivAPI.authorIdPageCount(a)).then((count) => {
        console.log(`${count}页`);
        const pageArray = [];
        for (let i = 0; i < count; i += 1) pageArray[i] = i + 1;
        return Promise.all(pageArray.map((i) => typeof (a) === 'string' ? pixivAPI.searchIllust(a, i) : pixivAPI.authorIdIllust(a, i))).then((a) => {
          let successCount = 0,
            errorCount = 0,
            allCount = 0;
          let errorlog = '';
          a.forEach((b) => {
            b.forEach((c) => {
              if (c.indexOf('写完') !== -1 || c.indexOf('全部完成') !== -1) {
                successCount++;
              } else if (c.indexOf('error') !== -1) {
                errorCount++;
                errorlog += (`${c} `);
              }
              allCount++;
            });
          });
          resolve(`成功数量:${successCount} 失败数量:${errorCount} 过滤数量:${allCount - successCount - errorCount}${errorlog === '' ? '   ' : `   ${ errorlog}`}`);
        });
      }, (b) => {
        resolve(b);
      });
    });
  },
    // 下载所有搜索结果！！！
  searchAllIllust(searchStr) {
    return new Promise((resolve, reject) => {
      pixivAPI.searchPageCount(searchStr).then((count) => {
        console.log(`${count}页`);
        const pageArray = [];
        for (let i = 0; i < count; i++) pageArray[i] = i + 1;
        return Promise.all(pageArray.map((i) => pixivAPI.searchIllust(searchStr, i))).then((a) => {
          let successCount = 0,
            errorCount = 0,
            allCount = 0;
          let errorlog = '';
          a.forEach((b) => {
            b.forEach((c) => {
              if (c.indexOf('写完') !== -1 || c.indexOf('全部完成') !== -1) {
                successCount += 1;
              } else if (c.indexOf('error') !== -1) {
                errorCount += 1;
                errorlog += (`${c} `);
              }
              allCount += 1;
            });
          });
          resolve(`成功数量:${successCount} 失败数量:${errorCount} 过滤数量:${allCount - successCount - errorCount}${errorlog === '' ? '   ' : `   ${errorlog}`}`);
        });
      }, (b) => {
        resolve(b);
      });
    });
  },
    // 一个封装
  illustIdToOriginal(illustId) {
    return new Promise((resolve, reject) => {
      chiePixiv.illustIdToOriginal(illustId).then((a) => {
        resolve(a);
      }, (b) => {
        reject(b);
      }).catch((err) => {
        throw (new Error(`CHIEERROR:${err}`));
      });
    });
  }
};

let illustIdWordArraySearch = function (imageWork, page, resolve) {
  if (imageWork.length !== 0) {
    const imageIdArray = [];
    Array.prototype.forEach.call(imageWork, (a) => {
      imageIdArray.push(a.attribs.href.match(/\d*$/)[0]);
    });
    return Promise.all(imageIdArray.map((i) => chiePixiv.illustIdToOriginal(i))).then((a) => {
      console.log(a);
      resolve(a);
    }, (b) => {              // 未知错误
      throw (b);
    });
  }

  resolve(`${page}error:此页么找到图片`);
};

module.exports = pixivAPI;
