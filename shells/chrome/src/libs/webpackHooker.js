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
    this.noTs = true;
    this.muteService = null;
  }

  handlePendingBoxes (boxes) {
    if (boxes && boxes instanceof Array) {
      boxes.forEach(box => this.pendingBox.add(box));
    } else if (boxes) {
      this.pendingBox.add(boxes);
    }

    if (!this.pendingBox.isEmpty() && this.state === 'IDLE') {
      this.noTs = false;
      this.state = 'WAITING';
      const { delayRange } = this.setting;
      const delay = Math.max(delayRange[1] - delayRange[0], 0) * Math.random() + delayRange[0];
      const box = this.pendingBox.poll();
      setTimeout(() => this.handleTimeupBox(box), Math.max(box.surplusTime * 1000 - Date.now() + delay + 5, 0));
    }

    if (this.pendingBox.isEmpty() && this.state === 'IDLE') {
      this.noTs = true;
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

  getMuteService () {
    if (!this.muteService) {
      this.muteService = window.webpackJsonp([], null, ['6cb3']).a.prototype.muteService;
    }
    return this.muteService;
  }

  handleBarrages (t, n) {
    try {
      t.forEach(msg => {
        const { senderId, senderNick, userLevel, hasCard, fansMedal, barrageContent, uniqueIdentifier } = msg;
        if (barrageContent) {
          /*
          console.log(this.getMuteService().muteDYUser({
            blacktype: 1,
            limittime: "60",
            oid: 194634764,
            oreason: "",
            otype: 1,
            rid: 3010691,
            uid: 242853718,
          }));
          */
          this.emit('barrage', {
            senderId,
            senderNick,
            userLevel,
            hasCard,
            fansMedal,
            barrageContent,
            uniqueIdentifier,
          });
        }
      });
    } catch (e) {
      console.log('err:', e);
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
            if (self.setting.ghoulEnabled) {
              box.destroyTime -= box.delayTime;
              box.surplusTime -= box.delayTime;
              box.delayTime = 1;
            }
            return box;
          },
          dataMap (fn, t, n) { // RCV
            const boxes = fn.call(this, t, n);
            self.setting.ghoulEnabled && self.handlePendingBoxes(boxes);
            return boxes;
          },
          showDrawTips (fn, t) {
            if (self.state === 'WAITING' && parseInt(t.code, 10) !== 0) { // miss
              self.state = 'IDLE';
              self.handlePendingBoxes();
              self.emit('miss');
            } else if (self.state === 'GEE_SHOW' && parseInt(t.code, 10) !== 0) { // geetest error
              self.state = 'IDLE';
              self.handlePendingBoxes();
            } else if (parseInt(t.code, 10) === 0) { // got-res
              self.state = 'IDLE';
              self.handlePendingBoxes();
              self.emit('got_res', t);
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
      {
        name: 'b33f',
        path: ['a', 'prototype', ['render']],
        hooks: {
          render (fn) {
            if (self.setting.blockEnterEffect) {
              this.state.isRender = false;
            }
            return fn.call(this);
          },
        },
      },
      {
        name: '9ce9',
        path: ['a', 'prototype', ['init']],
        hooks: {
          init (fn, t) {
            try {
              const elem = document.getElementsByClassName('AnchorLevelTip-tipBarNum')[0];
              elem.appendChild(document.createTextNode(', '));
              elem.appendChild(document.createTextNode(t.$ROOM.levelInfo.experience));
            } catch (e) {
              console.log('err:', e);
            }
            return fn.call(this, t);
          },
        },
      },
      {
        name: '597a',
        path: ['a', 'WrappedComponent', 'prototype', ['render']],
        hooks: {
          render (fn) {
            try {
              this.props.ownerFansRank > 0 && (this.props.ownerFansRank = -this.props.ownerFansRank);
            } catch (e) {
              console.log('err:', e);
            }
            return fn.call(this);
          },
        },
      },
      {
        name: 'fd73',
        path: ['a', 'WrappedComponent', 'prototype', ['render']],
        hooks: {
          render (fn) {
            try {
              // console.log('here', this);
            } catch (e) {
              console.log('err:', e);
            }
            return fn.call(this);
          },
        },
      },
    ]);
  }
}

module.exports = WebpackHooker;
