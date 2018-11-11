const WebpackHooker = require('./libs/webpackHooker');
const installSharkLoaderHook = require('./libs/installSharkLoaderHook');

async function sleep (timeout) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout));
}

async function setDocTitle () {
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

function setup (setting) {
  console.log('setup backend');
  installSharkLoaderHook({ setting });
  const webpackHooker = new WebpackHooker({ setting });
  webpackHooker.install();
  webpackHooker.on('got', () => {
    setDocTitle();
    window.postMessage({ source: 'treasure_got' }, '*');
  });
  webpackHooker.on('got_res', data => {
    window.postMessage({ source: 'treasure_got_res', data }, '*');
  });
}

window.postMessage({ source: 'backend_installed' }, '*');
window.addEventListener('message', (evt) => {
  if (evt.source === window && evt.data && evt.data.source === 'setting') {
    setup(evt.data.data);
  }
});
