const attachRenderer = require('./libs/attachRenderer');
const Agent = require('./libs/agent');
const Daemon = require('./libs/daemon');

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

function setup(hook, setting) {
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
