window.addEventListener('message', (evt) => {
  if (evt.source === window && evt.data && evt.data.source === 'backend_installed') {
    setup();
  }
});

function installBackend (setting) {
  const script = document.createElement('script');
  script.src = chrome.extension.getURL('build/backend.js');
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}
installBackend();

function setup () {
  const port = chrome.runtime.connect({ name: 'treasure' });
  port.onMessage.addListener(msg => {
    const { type, data } = msg;
    if (type === 'setting') {
      const { ghoulEnabled, blockLiveStream } = data;
      if (ghoulEnabled && blockLiveStream) {
        const videoElem = document.getElementById('js-player-video');
        if (videoElem) {
          videoElem.parentNode.removeChild(videoElem);
        } else {
          window.addEventListener('load', () => {
            const videoElem = document.getElementById('js-player-video');
            videoElem && videoElem.parentNode.removeChild(videoElem);
          });
        }
      }
      window.postMessage({ source: 'setting', data }, '*');
    }
  });

  window.addEventListener('message', (evt) => {
    if (evt.source === window && evt.data && evt.data.source === 'treasure_got') {
      console.log('got');
      port && port.postMessage({ type: 'got' });
    } else if (evt.source === window && evt.data && evt.data.source === 'treasure_got_res') {
      console.log('got_res');
      port && port.postMessage({ type: 'got_res', data: evt.data.data });
    }
  });
}
