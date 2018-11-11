const { EventEmitter } = require('events');
const FastPriorityQueue = require('fastpriorityqueue');
const webpackHelper = require('./webpackHelper');

async function sleep (timeout) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout));
}

class WebpackHooker extends EventEmitter {
  constructor ({ setting }) {
    super();
    this.setting = setting;
    this.state = 'IDLE';
    this.pendingBox = new FastPriorityQueue((a, b) => a.surplusTime < b.surplusTime);
  }

  handlePendingBoxes (boxes) {
    if (boxes && boxes instanceof Array) {
      boxes.forEach(box => this.pendingBox.add(box));
    } else if (boxes) {
      this.pendingBox.add(boxes);
    }

    if (!this.pendingBox.isEmpty() && this.state === 'IDLE') {
      this.state = 'WAITING';
      const { delayRange } = this.setting;
      const delay = Math.max(delayRange[1] - delayRange[0], 0) * Math.random() + delayRange[0];
      const box = this.pendingBox.poll();
      setTimeout(() => this.handleTimeupBox(box), Math.max(box.surplusTime * 1000 - Date.now() + delay + 5, 0));
    }

    if (this.pendingBox.isEmpty() && this.state === 'IDLE') {
      const { autoClose } = this.setting;
      autoClose && window.close();
    }
  }

  handleTimeupBox (box) {
    if (this.state === 'WAITING') {
      console.log('picking');
      PlayerAsideApp.container.registry.store.dispatch({
        type: 'DRAW_TREASURE',
        payload: { data: box, type: 'init' },
      });
    }
  }

  async showGeeTestPanel () { // dirty
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
      } else if (state === 'WAIT') {
        const elems = document.getElementsByClassName('geetest_popup_box');
        if (!elems || elems.length <= 0) {
          break;
        }
      }
      await sleep(200);
    }
  }

  install () {
    const self = this;
    webpackHelper.hook([
      {
        name: '1c14',
        path: ['a', 'prototype', ['mapping', 'dataMap', 'showDrawTips', 'drawTreasure']],
        hooks: {
          mapping (fn, t, n) {
            const box = fn.call(this, t, n);
            box.destroyTime -= box.delayTime;
            box.surplusTime -= box.delayTime;
            box.delayTime = 1;
            return box;
          },
          dataMap (fn, t, n) { // RCV
            const boxes = fn.call(this, t, n);
            self.handlePendingBoxes(boxes);
            return boxes;
          },
          showDrawTips (fn, t) {
            if (self.state === 'WAITING' && parseInt(t.code, 10) !== 0) { // miss
              self.state = 'IDLE';
              self.handlePendingBoxes();
            } else if (self.state === 'GEE_SHOW'  && is_error_message) { // geetest error
              self.state = 'IDLE';
              self.handlePendingBoxes();
            } else if (parseInt(t.code, 10) === 0) { // got-res
              self.state = 'IDLE';
              self.emit('got_res', t);
              self.handlePendingBoxes();
            }
            return fn.call(this, t);
          },
          drawTreasure (fn, t, n) {
            if (self.state === 'GEE_SHOW' && n === 'check') { // geetest checking request
              self.state = 'GEE_CHECKING';
            }
            return fn.call(this, t, n);
          },
        },
      },
      {
        name: '9408',
        path: ['a', 'WrappedComponent', 'prototype', ['componentWillReceiveProps']],
        hooks: {
          componentWillReceiveProps (fn, t) {
            const { treasureDrawResult } = t;
            if (self.state === 'WAITING' && treasureDrawResult && treasureDrawResult.data && treasureDrawResult.data.geetest) { // show gee panel
              self.emit('got');
              const { autoOpenBox } = self.setting;
              autoOpenBox && self.showGeeTestPanel();
              self.state = 'GEE_SHOW';
            }
            return fn.call(this, t);
          },
        },
      },
    ]);
  }
}

module.exports = WebpackHooker;
