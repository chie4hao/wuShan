module.exports = fun => (...arg) => new Promise((resolve, reject) => {
  fun(...arg, (err, stat) => {
    if (err === undefined) resolve();
    if (stat === undefined) resolve(err);
    if (err) reject(err);
    else resolve(stat);
  });
});
