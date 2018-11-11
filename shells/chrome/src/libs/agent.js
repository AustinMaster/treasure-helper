const { EventEmitter } = require('events');

class Agent extends EventEmitter {
  constructor (hook, setting) {
    super();
    this._hook = hook;
    this.setting = setting;
    this._fnMouseDown = null;
    this._fnMouseUp = null;
    this._fnClick = null;
    this.state = 'INIT';
  }

  onMounted (evt) {
    const { data, internalInstance } = evt;
    const { props } = data;
    if (props && props.className) {
      const { className } = props;
      if (className && className.startsWith('Treasure ')) {
        this._fnClick = props.onClick;
        this._fnMouseDown && this.emit('treasure-mounted');
      } else if (className === 'TreasureDetail') {
        this._fnMouseDown = props.onMouseDown;
        this._fnMouseUp = props.onMouseUp;
        this._fnClick && this.emit('treasure-mounted');
      } else if (className === 'TreasureWrap') {
        const { store } = internalInstance.child.stateNode.context;
        store.subscribe(() => this.storeHandler(store));
      }
    } else if (this.setting.blockLiveStream && props && props.hasOwnProperty('autoplay')) {
      props.autoplay = false;
    }
  }

  onUnmounted (evt) {
  }

  onUpdated (evt) {
  }

  storeHandler (store) {
    const { treasureDrawResult } = store.getState();
    if (treasureDrawResult && Object.keys(treasureDrawResult.data).length > 0) {
      if (treasureDrawResult.data.hasOwnProperty('geetest')) {
        this.state = 'VALIDATE';
      } else if (treasureDrawResult.data.hasOwnProperty('award_type')) {
        if (this.state !== 'RESULT') {
          window.postMessage({ source: 'treasure-got-res', data: treasureDrawResult.data }, '*');
        }
        this.state = 'RESULT';
      }
    }
  }

  drawTreasure () {
    this._fnMouseDown && this._fnMouseDown();
    this._fnMouseUp && this._fnMouseUp();
    this._fnClick && this._fnClick();
  }
}

module.exports = Agent;
