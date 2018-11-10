const installGlobalHook = require('./libs/installGlobalHook');

let lastDetectionResult;

// We want to detect when a renderer attaches, and notify the "background
// page" (which is shared between tabs).
// Currently we are in "content script" context, so we can't listen
// to the hook directly (it will be injected directly into the page).
// So instead, the hook will use postMessage() to pass message to us here.
// And when this happens, we'll send a message to the "background page".
window.addEventListener('message', (evt) => {
  if (evt.source === window && evt.data && evt.data.source === 'react-detector') {
    lastDetectionResult = {
      hasDetectedReact: true,
      reactBuildType: evt.data.reactBuildType,
    };
    chrome.runtime.sendMessage(lastDetectionResult);

    const script = document.createElement('script');
    script.src = chrome.extension.getURL('build/backend.js');
    document.documentElement.appendChild(script);
    script.parentNode.removeChild(script);
  }
});

// NOTE: Firefox WebExtensions content scripts are still alive and not re-injected
// while navigating the history to a document that has not been destroyed yet,
// replay the last detection result if the content script is active and the
// document has been hidden and shown again.
window.addEventListener('pageshow', (evt) => {
  if (!lastDetectionResult || evt.target !== window.document) {
    return;
  }
  chrome.runtime.sendMessage(lastDetectionResult);
});

const port = chrome.runtime.connect({ name: 'treasure' });
port.onMessage.addListener(msg => {
  const { type, data } = msg;
  if (type === 'setting') {
    const { ghoulEnabled, vol, blockLiveStream } = data;
    if (blockLiveStream) {
      const videoElem = document.getElementById('js-player-video');
      if (videoElem) {
        videoElem.parentNode.removeChild(videoElem);
      } else {
        window.addEventListener('load' ,() => {
          const videoElem = document.getElementById('js-player-video');
          videoElem && videoElem.parentNode.removeChild(videoElem);
        });
      }
    }
    window.postMessage({ source: 'setting', data }, '*');
  }
});

window.addEventListener('message', (evt) => {
  if (evt.source === window && evt.data && evt.data.source === 'treasure-got') {
    console.log('got');
    port && port.postMessage({ type: 'got' });
  } else if (evt.source === window && evt.data && evt.data.source === 'treasure-got-res') {
    console.log('got-res');
    port && port.postMessage({ type: 'got-res', data: evt.data.data });
  }
});

const saveNativeValues = `
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeObjectCreate = Object.create;
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeMap = Map;
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeWeakMap = WeakMap;
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeSet = Set;
`;

const detectReact = `
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on('renderer', function(evt) {
  window.postMessage({
    source: 'react-detector',
    reactBuildType: evt.reactBuildType,
  }, '*');
});
`;

const setupBackend = `
window.addEventListener('message', evt => {
  if (evt.source === window && evt.data && evt.data.source === 'setting') {
    function checkSetup() {
      if (window.setup) {
        window.setup(window.__REACT_DEVTOOLS_GLOBAL_HOOK__, evt.data.data);
      } else {
        setTimeout(checkSetup, 1000);
      }
    }
    checkSetup();
  }
});
`;

const loaderConfigHook = `
Object.defineProperty(window, 'SHARK_LOADER_CONFIG', {
  get: () => ({
    "P0": [
      {
          "name": "vendor",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/lib/vendor-room_ec0828f.js"
          ]
      }
    ],
    "P1": [
      {
          "name": "sdk",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/lib/sdk-room_f50223a.js"
          ]
      }
    ],
    "P2": [
      {
          "name": "page",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/page_8a8550f.js"
          ]
      }
    ],
    "P3": [
      {
          "name": "player",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/player_8a8550f.js"
          ]
      }
    ],
    "P4": [
      {
          "name": "common",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/common_8a8550f.js"
          ]
      }
    ],
    "T0": [
      {
          "name": "login",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/login_d236533.js"
          ]
      }
    ],
    "T3": [
      {
          "name": "playerAside",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/playerAside_3b54694.js"
          ]
      },
    ],
    "Tasync": [
      {
          "name": "menu",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/menu_b854873.js"
          ]
      },
      {
          "name": "superMenu",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/superMenu_5972533.js"
          ]
      },
      {
          "name": "kingGlorySummerComponent",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/kingGlorySummerComponent_bb867b6.js"
          ]
      },
      {
          "name": "accountSecurity",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/accountSecurity_e46f0f2.js"
          ]
      },
      {
          "name": "pubgInfoComponent",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/pubgInfoComponent_91cb9bc.js"
          ]
      },
      {
          "name": "actAnnual10",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/actAnnual10_5575719.js"
          ]
      },
      {
          "name": "wzryAnchor1811",
          "url": [
              "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/wzryAnchor1811_2340928.js"
          ]
      }
    ]
  }),
  set: value => {
    console.log('hooked:', value);
  }
});
`;

const js = (
  ';(' + installGlobalHook.toString() + '(window))' +
  saveNativeValues +
  detectReact +
  setupBackend +
  loaderConfigHook
);

// This script runs before the <head> element is created, so we add the script
// to <html> instead.
const script = document.createElement('script');
script.textContent = js;
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);
