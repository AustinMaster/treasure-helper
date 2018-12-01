const AutoDriver = require('./libs/autoDriver');
const util = require('./libs/util');

function checkLocalSettingStorage () {
  if (window.localStorage.setting) {
    const setting = JSON.parse(window.localStorage.setting);
    return setting && setting.setting && setting.setting.hasOwnProperty('ghoulEnabled') &&
      setting.setting.hasOwnProperty('vol') &&
      setting.setting.hasOwnProperty('blockLiveStream') &&
      setting.setting.hasOwnProperty('delayRange') && setting.setting.hasOwnProperty('autoClose') &&
      setting.setting.hasOwnProperty('autoDrive') && setting.setting.hasOwnProperty('minimalism') &&
      setting.setting.hasOwnProperty('autoOpenBox') &&
      setting.setting.hasOwnProperty('blockEnterEffect') &&
      setting.setting.hasOwnProperty('autoAnswerEnabled') &&
      setting.setting.hasOwnProperty('autoAnswerMode') &&
      setting.setting.hasOwnProperty('blockEnterBarrage') &&
      setting.setting.hasOwnProperty('previewClassName') &&
      setting.setting.hasOwnProperty('rocketOnly') ? window.localStorage.setting : false;
  } else {
    return false;
  }
}

function checkLocalStatStorage () {
  if (window.localStorage.stat) {
    const stat = JSON.parse(window.localStorage.stat);
    return stat && stat.stat && stat.stat.hasOwnProperty('box') && stat.stat.hasOwnProperty('zan') &&
      stat.stat.hasOwnProperty('wen') && stat.stat.hasOwnProperty('song') && stat.stat.hasOwnProperty('silver') &&
      stat.stat.hasOwnProperty('day') ? window.localStorage.stat : false;
  } else {
    return false;
  }
}

function initLocalStorage () {
  window.localStorage.setting = checkLocalSettingStorage() || JSON.stringify({
    setting: {
      ghoulEnabled: true,
      vol: 60,
      blockLiveStream: false,
      delayRange: [50, 800],
      autoClose: false,
      autoDrive: false,
      minimalism: false,
      autoOpenBox: true,
      blockEnterEffect: false,
      autoAnswerEnabled: false,
      autoAnswerMode: 'smart',
      blockEnterBarrage: false,
      previewClassName: 'answerPreview-43abcd',
      rocketOnly: false,
    },
  });
  window.localStorage.stat = checkLocalStatStorage() || JSON.stringify({
    stat: {
      box: 0,
      zan: 0,
      wen: 0,
      song: 0,
      silver: 0,
      day: null,
    },
  });
}
initLocalStorage();

const autoDriver = new AutoDriver();

chrome.webRequest.onBeforeRequest.addListener(details => {
  const { setting } = JSON.parse(window.localStorage.setting);
  const cancel = details.initiator === 'https://www.douyu.com' &&
                  (details.url.endsWith('.m4s') ||
                  details.url.endsWith('.wsv?type=3') ||
                  details.url.indexOf('.flv') !== -1) &&
                  setting.ghoulEnabled && setting.blockLiveStream;
  return { cancel };
}, { urls: ['<all_urls>'] }, ['blocking']);

// AdBlock
chrome.webRequest.onBeforeRequest.addListener(function () {
  return { cancel: true };
}, {
  urls: [
    '*://pubads.g.doubleclick.net/*',
    '*://staticlive.douyucdn.cn/common/simplayer/assets/gameAdversion.swf?*',
    '*://staticlive.douyucdn.cn/common/simplayer/assets/videoAd.swf?*',
  ],
}, [ 'blocking' ]);

function getToday () {
  const obj = new Date();
  return `${obj.getFullYear()}${obj.getMonth()}${obj.getDate()}`;
}

function resetStat (stat, today) {
  stat.day = today;
  stat.box = 0;
  stat.zan = 0;
  stat.wen = 0;
  stat.song = 0;
  stat.silver = 0;
}

chrome.runtime.onConnect.addListener(port => {
  const { setting } = window.localStorage;
  if (port.name === 'treasure') {
    if (setting) {
      port.postMessage({
        type: 'setting',
        data: JSON.parse(setting).setting,
      });
    }

    port.onMessage.addListener(msg => {
      const { type, data } = msg;
      if (type === 'got') {
        const { setting } = JSON.parse(window.localStorage.setting) || {};
        util.playAudio(chrome.extension.getURL('assets/ding.wav'), setting.vol / 100);
      } else if (type === 'got_res') {
        const { stat } = JSON.parse(window.localStorage.stat) || {};
        const today = getToday();
        if (stat.day !== today) {
          resetStat(stat, today);
        }
        ++stat.box;
        /* eslint-disable */
        const { award_type, silver, prop_count, prop_id, prop_name } = data;
        if (award_type === '1') {
          stat.silver += parseInt(silver, 10);
        } else if (award_type === '2') {
          if (prop_name === '赞') {
            stat.zan += parseInt(prop_count, 10);
          } else if (prop_name === '稳') {
            stat.wen += parseInt(prop_count, 10);
          } else if (prop_name === '怂') {
            stat.song += parseInt(prop_count, 10);
          } else {
            console.log('unknown prop_name:', data);
          }
        } else {
          console.log('unknown award_type:', data);
        }
        /* eslint-enable */
        window.localStorage.stat = JSON.stringify({ stat });
        port.postMessage({ type: 'sync' });
      }
    });
  } else if (port.name === 'xiaohulu' && JSON.parse(setting).setting.autoDrive) {
    port.postMessage({ type: 'enable' });

    port.onMessage.addListener(msg => {
      const { type, data } = msg;
      const { setting } = JSON.parse(window.localStorage.setting) || {};
      if (type === 'update_rooms') {
        setting.autoDrive && autoDriver.update(data);
      }
    });
  }
});
