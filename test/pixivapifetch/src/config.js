module.exports = {
    // 此项为必需,请根据自己浏览器Cookie中的PHPSESSID更改,不更改或者不正确的PHPSESSID程序无法工作
  PHPSESSID: '8318723_1ad2f75057169507bc751fd4bf7cdce8',

    // 是否下载多图的illustId,默认true基本不需要改
  mangaModel: true,

    // 筛选掉的tags,基本都是些女性向的,应该没女生用吧...
  tagNotExistsFilter: ['BL', '腐', '漫画', '講座', '刀剣乱', '松', '黒子', '弱虫ペダル', '世界一初恋', '進撃の巨人', 'ハイキュー', '銀魂', 'アザゼルさん'],

    // 选择的tags,最好还是把想要的tags直接放到搜索文本中
  tagExistsFilter: [],

    // 最大并行原画请求数量和Html请求数量,网速好可以适当调高一点,太高可能会被封IP？
  OriginalGetCount: 1,
  HtmlGetCount: 3,

    // 请求超时时间(ms)
  htmlGetTimeout: 30000,
  originalOneGetTimeOut: 30000,

    // 最大重传次数(超时或者网络错误时重传)
  htmlGetRetransmissionCount: 3,
  originalOneRetransmissionCount: 4,

    // 是否只下载R18？！！
  R18: true
};
