const pixiv = require('./pixivAPI');

// 根据illustId下载原图

/* pixiv.illustIdToOriginal('63606459').then(function (a) {
 console.log(a)
});*/


// 下载"博麗霊夢 10000users入り"搜索结果第一页的全部图片
/*
 pixiv.searchIllust('博麗霊夢 10000users入り', 1).then(function(a){
 console.log(a)
 })
 */
/*
pixiv.downloadAllIllust('ピアノ 1000users入り').then(function(a){
    console.log(a)
})
*/

// 下载作者id为915946第一页的全部图片
/*
 pixiv.authorIdIllust(915945, 1).then(function (a) {
 console.log(a);
 });
 */

// 查看某搜索结果有多少页
/*
 pixiv.searchPageCount('博麗霊夢 10000users入り').then(function(a){
 console.log(a)
 })*/

// 查看某作者作品有多少页
/*
 pixiv.authorIdPageCount(915945).then(function(a){
 console.log(a)
 })
 */

// 下载搜索结果的全部图片

 pixiv.downloadAllIllust('艦これ 10000users入り').then(function(a){
 console.log(a)
 })
 

// 下载某作者的全部图片,仅仅是参数类型不同
/*
 pixiv.downloadAllIllust(532462).then(function (a) {
 console.log(a)
 })
 */

