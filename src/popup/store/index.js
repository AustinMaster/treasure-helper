import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocalSetting = new VuexPersistence({
  key: 'setting',
  storage: window.localStorage,
  modules: ['setting'],
  filter: mutation => (mutation.type === 'SET_GHOUL_ENABLED' ||
                       mutation.type === 'SET_VOL' ||
                       mutation.type === 'SET_BLOCK_LIVE_STREAM' ||
                       mutation.type === 'SET_DELAY_RANGE' ||
                       mutation.type === 'SET_AUTO_CLOSE' ||
                       mutation.type === 'SET_MINIMALISM' ||
                       mutation.type === 'SET_AUTO_OPEN_BOX' ||
                       mutation.type === 'SET_BLOCK_ENTER_EFFECT' ||
                       mutation.type === 'SET_AUTO_ANSWER_ENABLED' ||
                       mutation.type === 'SET_AUTO_ANSWER_MODE' ||
                       mutation.type === 'SET_BLOCK_ENTER_BARRAGE' ||
                       mutation.type === 'SET_PREVIEW_CLASS_NAME' ||
                       mutation.type === 'SET_ROCKET_ONLY'),
});

const vuexLocalStat = new VuexPersistence({
  key: 'stat',
  storage: window.localStorage,
  modules: ['stat'],
  filter: mutation => (mutation.type === 'SET_ZAN' || mutation.type === 'SET_WEN' ||
                       mutation.type === 'SET_SONG' || mutation.type === 'SET_SILVER' ||
                       mutation.type === 'SET_DAY' || mutation.type === 'SET_BOX'),
});

const settingStore = {
  state: {
    ghoulEnabled: true,
    vol: 60,
    blockLiveStream: false,
    delayRange: [50, 800],
    autoClose: false,
    minimalism: false,
    autoOpenBox: true,
    blockEnterEffect: false,
    autoAnswerEnabled: false,
    autoAnswerMode: 'smart',
    blockEnterBarrage: false,
    previewClassName: 'answerPreview-43abcd',
    rocketOnly: false,
  },

  mutations: {
    SET_GHOUL_ENABLED (state, value) {
      state.ghoulEnabled = value;
    },
    SET_VOL (state, value) {
      state.vol = value;
    },
    SET_BLOCK_LIVE_STREAM (state, value) {
      state.blockLiveStream = value;
    },
    SET_DELAY_RANGE (state, value) {
      state.delayRange = value;
    },
    SET_AUTO_CLOSE (state, value) {
      state.autoClose = value;
    },
    SET_MINIMALISM (state, value) {
      state.minimalism = value;
    },
    SET_AUTO_OPEN_BOX (state, value) {
      state.autoOpenBox = value;
    },
    SET_BLOCK_ENTER_EFFECT (state, value) {
      state.blockEnterEffect = value;
    },
    SET_AUTO_ANSWER_ENABLED (state, value) {
      state.autoAnswerEnabled = value;
    },
    SET_AUTO_ANSWER_MODE (state, value) {
      state.autoAnswerMode = value;
    },
    SET_BLOCK_ENTER_BARRAGE (state, value) {
      state.blockEnterBarrage = value;
    },
    SET_PREVIEW_CLASS_NAME (state, value) {
      state.previewClassName = value;
    },
    SET_ROCKET_ONLY (state, value) {
      state.rocketOnly = value;
    },
  },
};

const statStore = {
  state: {
    box: 0,
    zan: 0,
    wen: 0,
    song: 0,
    silver: 0,
    day: null,
  },

  mutations: {
    SET_BOX (state, value) {
      state.box = value;
    },
    SET_ZAN (state, value) {
      state.zan = value;
    },
    SET_WEN (state, value) {
      state.wen = value;
    },
    SET_SONG (state, value) {
      state.song = value;
    },
    SET_SILVER (state, value) {
      state.silver = value;
    },
    SET_DAY (state, value) {
      if (state.day !== value) {
        state.box = 0;
        state.zan = 0;
        state.wen = 0;
        state.song = 0;
        state.silver = 0;
        state.day = value;
      }
    },
  },
};

const store = new Vuex.Store({
  modules: { setting: settingStore, stat: statStore },
  plugins: [ vuexLocalSetting.plugin, vuexLocalStat.plugin ],
});

export default store;
