/**
 * Created by chie on 2016/5/6.
 */
/* eslint promise/always-return: 0, promise/catch-or-return: 0,*/

const $ = require('cheerio');
const url = require('url');
const fs = require('fs');

const PixivOption = require('./pixivOption.js');
const chieRequest = require('./chiePromiseRequest.js');
const config = require('./config');

const chiePixiv = {
    // 通过illust_id下载原图,分支有点多,并且多次引用外外层作用域存储对象,很多promise就不return了
  illustIdToOriginal: (illustId) =>
    new Promise((resolve, reject) => {
      const mediumUrl = `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illustId}`;
      const urlm = url.parse(mediumUrl);
      chieRequest('html', new PixivOption(urlm.hostname, urlm.path, 'GET', 'http://www.pixiv.net/'), {}).then((decoded) => {
        const wrapper = $('#wrapper', decoded.toString());
        const worksDisplay = $('.works_display', wrapper);

        let tagsStr = '';
        const tagsArray = $('.work-tags dl dd ul li .text', wrapper);

        Array.prototype.forEach.call(tagsArray, (a) => {
          tagsStr += ` ${a.children[0].data}`;
        });

        if (config.tagExistsFilter.every((a) => tagsStr.indexOf(a) !== -1)
          && config.tagNotExistsFilter.every((b) =>
          tagsStr.indexOf(b) === -1
        )) {
          if ($('img', worksDisplay).length !== 0) {
            if ($('.player', worksDisplay).length !== 0) {
              resolve(`${illustId} a player`);
            } else if ($('a', worksDisplay).length !== 0) {
                            // Multi 漫画模式
              if (config.mangaModel) {
                const mangaUrl = `http://www.pixiv.net/member_illust.php?mode=manga&illust_id=${illustId}`;
                const mangaUrlParser = url.parse(mangaUrl);
                                // 此段代码有mediumUrl依赖，不能return
                chieRequest('html', new PixivOption(mangaUrlParser.hostname, mangaUrlParser.path, 'GET', mediumUrl), {}).then((a) => {
                                    // 得到漫画数量开始搜索原画地址
                  const mangaArray = [];
                  const count = parseInt($('.page-menu .total', a.toString()).text());
                  for (let i = 0; i < count; i += 1) {
                    mangaArray.push(i);
                  }
                  return Promise.all(mangaArray.map((i) => {
                    const mangaBigUrl = `http://www.pixiv.net/member_illust.php?mode=manga_big&illust_id=${illustId}&page=${i}`;
                    const mangaBigUrlParser = url.parse(mangaBigUrl);
                                        // 同上
                    return chieRequest('html', new PixivOption(mangaBigUrlParser.hostname, mangaBigUrlParser.path, 'GET', mangaUrl), {}).then((decoded2) => {
                      const imgsrc = $('img', decoded2.toString());
                      if (imgsrc.length !== 0) {
                        const imageBigUrl = url.parse(imgsrc.attr('src'));
                        const imageBigType = imageBigUrl.path.match(/\.\w*$/)[0];
                        const name = $('.title', wrapper)[0].children[0].data;
                        return chieRequest('originalOne', new PixivOption(imageBigUrl.hostname, imageBigUrl.path, 'GET', mangaBigUrl), { name: `${illustId}_${i}_${name}${imageBigType}` });
                      }
                      return Promise.resolve(`${illustId} error:manga其中有图没找到`);
                    }, (b) => Promise.resolve(`${illustId} error:第三次htmlGet ${b}`)
                    );
                  })).then((ag) => {
                    let errPage = '';
                    let errorflag = false;
                    ag.forEach((b, i) => {
                      if (b !== '写完') {
                        errorflag = true;
                        errPage += (` ${i}`);
                      }
                    });
                    if (errorflag) {               // 没有全部成功
                      resolve(`${illustId} error:errorPage:${errPage}`);
                    } else {                       // 全部成功
                      resolve(`${illustId} 全部完成count:${mangaArray.length}`);
                    }
                  }, ((b) => {                // 错误
                    reject(b);
                  }));
                }, (b) => {
                  resolve(`${illustId} error:第一次htmlGet${b}`);
                });
              } else {
                resolve(`${illustId} 请开启manga模式 已过滤`);
              }
            } else {
                            // 单图 通过_illust_modal img找到原图真实地址，看了pixiv源代码才找到
              const imageUrl = url.parse($('._illust_modal img', wrapper).attr('data-src'));
              const imageType = imageUrl.path.match(/\.\w*$/)[0];
              const name = $('.title', wrapper)[0].children[0].data;
              if (!fs.existsSync(`./resources/${(`${illustId}_${name}${imageType}`).replace(/\\|\/|\?|\*|:|"|<|>/g, '')}`)) {
                chieRequest('originalOne', new PixivOption(imageUrl.hostname, imageUrl.path, 'GET', mediumUrl), { name: `${illustId}_${name}${imageType}` }).then((a) => {
                  resolve(`${illustId.toString()} ${a}`);
                }, (c) => {
                  resolve(`${illustId} error:${c}`);
                });
              } else {
                resolve(`${illustId} 已存在`);
              }
            }
          } else {
            resolve(`${illustId} error:图片没找到`);
          }
        } else {
          resolve(`${illustId} 已过滤`);
        }
      }, (b) => {
        resolve(`${illustId} error:第一次htmlGet${b}`);
      }).catch((err) => {
        throw new Error(`illustIdToOriginal未知${err}`);
      });
    })
};

module.exports = chiePixiv;
