const fs = require('fs');
const nodeFetch = require('node-fetch');

const config = require('./config');
const retryRequestQueue = require('./requestQueue');
const promisify = require('./promisify');

const htmlFetchText = async (url, options) => (await nodeFetch(url, options)).text();

const originalFetchText = async (url, options, filepath) => {
  if (!await promisify(fs.exists)(filepath)) {
    const res = await nodeFetch(url, options);
    const dest = fs.createWriteStream(filepath, { encoding: 'base64' });
    res.body.pipe(dest);
    await res.text();
    return `${filepath} 成功`;
  }
  return `${filepath} 已存在`;
};

const htmlFetchQueue = retryRequestQueue(htmlFetchText)(config.HtmlGetCount, config.htmlGetRetransmissionCount, ['network timeout at', 'failed, reason:'], config.htmlGetTimeout);
const originalFetchQueue = retryRequestQueue(originalFetchText)(config.OriginalGetCount, config.originalOneRetransmissionCount, ['network timeout at', 'failed, reason:'], config.originalOneGetTimeOut);

function htmlFetch() {
  return htmlFetchQueue;
}

function originalFetch() {
  return originalFetchQueue;
}

module.exports = { htmlFetch, originalFetch };
