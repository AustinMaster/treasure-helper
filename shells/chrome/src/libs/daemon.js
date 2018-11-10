const { EventEmitter } = require('events');

async function sleep(timeout) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout));
}

class Daemon extends EventEmitter {
  constructor(agent, setting) {
    super();
    this.agent = agent;
    this.setting = setting;
    this.state = 'INIT';
    this.cnt = 0;
  }

  async start() {
    const { setting } = this;
    if (this.state !== 'INIT') {
      return ;
    }
    this.state = 'IDLE';
    while (true) {
      if (this.state === 'IDLE') {
        if(!window.PlayerAsideApp || !this.getCurTreasure() || this.getGeePanelsShow()) {
          // still IDLE
          if (setting.autoClose && this.cnt > 0 && !this.getCurTreasure()) {
            // no treasure anymore
            window.close();
          }
          await sleep(1000);
        } else {
          ++this.cnt;
          this.state = 'FOUND';
        }
      } else if (this.state === 'FOUND') {
        const treasure = this.getCurTreasure();
        const { delayRange } = setting; 
        const delay = Math.max(delayRange[1] - delayRange[0], 0) * Math.random() + delayRange[0];
        const timeout = Math.max(((treasure.surplusTime - treasure.delayTime) * 1000 - Date.now() + (delay || 0) + 5), 0);
        await sleep(timeout);
        await this.drawTreasure(treasure);
      }
    }
  }

  async drawTreasure(treasure) {
    console.log('picking up');
    if (this.state !== 'FOUND') {
      return;
    }
    const treasureData = this.getTreasureData();
    const curTreasure = this.getCurTreasure();
    while (treasureData && treasureData.isGeePanelsShow) {
      await sleep(1000);
    }
    if (curTreasure && curTreasure.treasureId === treasure.treasureId && !treasureData.isGeePanelsShow) {
      PlayerAsideApp.container.registry.store.dispatch({
        type: 'DRAW_TREASURE',
        payload: {
          data: curTreasure,
          type: 'init'
        }
      });

      while (true) {
        const treasureData = this.getTreasureData();
        const curTreasure = this.getCurTreasure();
        if (!curTreasure || curTreasure.treasureId !== treasure.treasureId) {
          break;
        }
        if (treasureData.isGeePanelsShow) {
          this.emit('got');
          await this.showGeeTestPanel();
          break;
        } else {
          await sleep(500);
        }
      }
    }
    this.state = 'IDLE';
  }

  async showGeeTestPanel() {
    let state = 'INIT';
    while (true) {
      if (state === 'INIT') {
        const elems = document.getElementsByClassName('geetest_radar_tip');
        if (elems && elems.length > 0) {
          elems[0].click && elems[0].click();
          state = 'GEE';
        }
      } else if (state === 'GEE') {
        const elems = document.getElementsByClassName('geetest_popup_box');
        if (elems && elems.length > 0) {
          elems[0].style['width'] = '347px';
          state = 'WAIT';
        }
      } else if(state === 'WAIT') {
        const elems = document.getElementsByClassName('geetest_popup_box');
        if (!elems || elems.length <= 0) {
          break;
        }
      }
      await sleep(333);
    }
  }

  getTreasureData() {
    if (window.PlayerAsideApp && window.PlayerAsideApp.container && 
        window.PlayerAsideApp.container.registry &&
        window.PlayerAsideApp.container.registry.store) {
      const { treasureData } = window.PlayerAsideApp.container.registry.store.getState();
      return treasureData;
    }
    return null;
  }

  getCurTreasure() {
    const treasureData = this.getTreasureData();
    return treasureData && treasureData.data && treasureData.data.length > 0 && treasureData.data[0];
  }

  getGeePanelsShow() {
    const treasureData = this.getTreasureData();
    return treasureData.isGeePanelsShow;
  }
}

module.exports = Daemon;
