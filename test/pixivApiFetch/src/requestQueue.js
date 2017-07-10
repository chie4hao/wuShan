const Queue = require('./queue');

const retryRequestQueue = fun => (concurrency, retryCount, retryMessage, retryTimeout) => {
  const q = Queue(concurrency);
  if (!Array.isArray(retryMessage)) {
    retryMessage = [retryMessage];
  }
  const req = async (url, options, ...args) => {
    for (let i = 0; i < retryCount; i += 1) {
      try {
        if (retryTimeout) {
          options.timeout = retryTimeout;
          return await q.push(fun, url, options, ...args);
        }
        return await q.push(fun, url, options, ...args);
      } catch (e) {
        console.log(e);
        if (retryMessage.every(a => e.message.indexOf(a) === -1)) {
          throw e;
        }
      }
    }
    throw new Error(`${url} timeOut retry ${concurrency} times`);
  };
  return req;
};

module.exports = retryRequestQueue;
