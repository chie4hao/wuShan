const url = require('url');
const http = require('http');
const https = require('https');

function getNodeRequestOptions(fetchURL, opts) {
  return Object.assign({}, url.parse(fetchURL), {
    method: opts.method,
    headers: opts.headers,
    agent: opts.agent
  });
}

module.exports = function fetch(fetchURL, opts = {}) {
  return new Promise((resolve, reject) => {
    const options = getNodeRequestOptions(fetchURL, opts);

    const send = (options.protocol === 'https:' ? http : http).request;
    const req = send(options);

    req.setTimeout(opts.timeout, () => {
      req.abort();
      reject(new Error(`network timeout at: ${fetchURL}`));
    });

    req.on('error', err => {
      reject(new Error(`request to ${fetchURL} failed, reason: ${err.message}`));
    });

    req.on('reponse', res => {
      // 坑了坑了。。。。。
    });
  });
};

