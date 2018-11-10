function getAllModules() {
  return new Promise((resolve) => {
    const id = 'fakeModule_';
    window['webpackJsonp'](
      [],
      {[id]: function(module, exports, __webpack_require__) {
        resolve(__webpack_require__.c);
      }},
      [id]
    );
  });
}

getAllModules().then(modules => {
  console.log('testtttt', modules);
});
