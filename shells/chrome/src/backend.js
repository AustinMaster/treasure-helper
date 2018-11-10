const attachRenderer = require('./libs/attachRenderer');
const Agent = require('./libs/agent');
const Daemon = require('./libs/daemon');
const webpackHelper = require('./libs/webpackHelper');

async function sleep(timeout) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout));
}

async function setDocTitle() {
  if (!document.title_src) {
    document.title_src = document.title;
    document.title = '[新箱子验证] ' + document.title;
    while (true) {
      if (!document.hidden) {
        document.title = document.title_src;
        delete document.title_src;
        break;
      }
      await sleep(1000);
    }
  }
}

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

async function testWebpackJsonp(url) {
  // window.SHARK_LOADER_CONFIG.T0[0].url.push(url);
  // console.log(window.SHARK_LOADER_CONFIG);
  const modules = await getAllModules();
  Object.defineProperty(modules, '1c14', {
    get: () => {
      return modules['_1c14'];
    },
    set: (value) => {
      console.log(value);
      
      const old = value.exports;
      Object.defineProperty(value, 'exports', {
        get: () => value._exports,
        set: v => {
          console.log('v:', v);
          Object.defineProperty(v, 'a', {
            get: () => v._a,
            set: s => {
              console.log('s:', JSON.stringify(s.prototype.mapping));
              const oldFunc = s.prototype.mapping;
              Object.defineProperty(s.prototype, 'mapping', {
                get: () => (function(t, n) {
                  console.log(t, n, this.global.get("$ROOM.room_id"));
                  return s.prototype._mapping(t, n);
                }),
                set: (func) => {
                  console.log('func:', func);
                  s.prototype._mapping = func;
                }
              });
              s.prototype.mapping = oldFunc;
              v._a = s;
            }
          });
          value._exports = v;
        }
      });
      value.exports = old;
      modules['_1c14'] = value;
    }
  });
}

function setup(hook, setting, url) {
  webpackHelper.hook([
    {
      name: '1c14',
      path: ['a', 'prototype', ['mapping', 'showDrawTips']],
      hooks: {
        mapping(fn, t, n) {
          const ts = fn.call(this, t, n);
          console.log('ts:', ts);
          return ts
        },
        showDrawTips(fn, t) {
          console.log('showTips');
          fn.call(this, t);
        },
      }
    },
  ]);
  // testWebpackJsonp(url);

  const { ghoulEnabled, vol, blockLiveStream } = setting;
  if (!ghoulEnabled) {
    return;
  }

  const agent = new Agent(hook, setting);
  const daemon = new Daemon(agent, setting);

  agent.on('treasure-mounted', () => daemon.start());
  daemon.start();
  daemon.on('got', () => {
    setDocTitle();
    window.postMessage({ source: 'treasure-got' }, '*');
  });

  const subs = [
    hook.sub('renderer-attached', ({ id, renderer, helpers }) => helpers.walkTree()),
    hook.sub('mount', (evt) => agent.onMounted(evt)),
    hook.sub('unmount', (evt) => agent.onUnmounted(evt)),
    hook.sub('update', (evt) => agent.onUpdated(evt))
  ];

  for(const rid in hook._renderers) {
    hook.helpers[rid] = attachRenderer(hook, rid, hook._renderers[rid]);
    hook.emit('renderer-attached', {
      id: rid,
      renderer: hook._renderers[rid],
      helpers: hook.helpers[rid]
    });
  }

  hook.on('renderer', ({ id, renderer }) => {
    hook.helpers[id] = attachRenderer(hook, id, renderer);
    hook.emit('renderer-attached', { id, renderer, helpers: hook.helpers[id] });
  });
}

window.setup = setup;
