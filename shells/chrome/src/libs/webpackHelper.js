async function sleep (timeout) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout));
}

async function getWebpackModules() {
  while (!window.webpackJsonp) {  // dirty
    await sleep(333);
  }
  return new Promise((resolve) => {
    const id = 'fakeModule';
    const fakeModule = {
      [id]: (module, exports, __webpack_require__) => {
        resolve(__webpack_require__.c);
      }
    }
    window.webpackJsonp([], fakeModule, [id]);
  });
}

function hookWalk(obj, path, hooks) {
  if (path.length <= 0) {
    return;
  }
  let key = path.shift();

  if (key === 'prototype') {
    key = path.shift();
    const length = path.length;
    const backup = [];
    if (!(key instanceof Array)) {
      key = [].push(key);
    }
    key.forEach(key => backup[key] = obj.prototype[key]);
    const props = {};
    key.forEach(key => {
      props[key] = {
        get: () => {
          if (length > 0) {
            return obj.prototype[`_${key}`];
          } else {
            return function (...args) {
              return hooks[key].call(this, obj.prototype[`_${key}`], ...args);
            }
          }
        },
        set: value => {
          hookWalk(value, path, hooks);
          obj.prototype[`_${key}`] = value;
        },
      };
    });
    Object.defineProperties(obj.prototype, props);
    key.forEach(key => obj.prototype[key] = backup[key]);
  } else {
    const length = path.length;
    const backup = obj[key];
    Object.defineProperty(obj, key, {
      get: () => {
        if (length > 0) {
          return obj[`_${key}`];
        } else {
          return function (...args) {
            return hooks[key].call(this, obj[`_${key}`], ...args);
          }
        }
      },
      set: value => {
        hookWalk(value, path, hooks);
        obj[`_${key}`] = value;
      },
    });
    backup && (obj[key] = backup);
  }
}

function hookImpl(modules, arg) {
  const { name, path, hooks } = arg;

  Object.defineProperty(modules, name, {
    get: () => modules[`_${name}`],
    set: module_ => {
      const exports = module_.exports;
      Object.defineProperty(module_, 'exports', {
        get: () => module_._exports,
        set: exports => {
          hookWalk(exports, path, hooks);
          module_._exports = exports;
        }
      })
      module_.exports = exports;
      modules[`_${name}`] = module_;
    }
  });
}

async function hook(args) {
  const modules = await getWebpackModules();
  args.forEach(arg => {
    hookImpl(modules, arg);
  });
}

module.exports = {
  hook,
};
