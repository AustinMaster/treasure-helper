const webpackHelper = require('./webpackHelper');

module.exports = function () {
  webpackHelper.hook([
    {
      name: '1c14',
      path: ['a', 'prototype', ['mapping', 'showDrawTips', 'showDrawFailTips']],
      hooks: {
        mapping(fn, t, n) {
          const ts = fn.call(this, t, n);
          console.log('ts:', ts);
          return ts
        },
        showDrawTips(fn, t) {
          console.log('showTips', t);
          fn.call(this, t);
        },
        showDrawFailTips(fn) {
          console.log('showDrawFailTips');
          fn.call(this);
        },
      }
    },
  ]); // 34e5 0947
}