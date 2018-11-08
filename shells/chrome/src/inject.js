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

const js = (
  ';(' + installGlobalHook.toString() + '(window))' +
  saveNativeValues +
  detectReact +
  setupBackend
);

// This script runs before the <head> element is created, so we add the script
// to <html> instead.
const script = document.createElement('script');
script.textContent = js;
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);
