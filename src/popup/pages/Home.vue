<template>
  <div class="home-wrapper">
    <div class="header-wrapper">
      <div @click.prevent="goto99999">
        <Avatar class="avatar"
                src="https://apic.douyucdn.cn/upload/avatar_v3/201808/650168b922e4aae868b29fec672c4fa9_big.jpg"
                size="large" />
      </div>
      <p class="header-title">99999摸金助手</p>
      <a class="header-extra" href="#" @click.prevent="gotoMyHome">by vivym</a>
    </div>
    <div class="row">
      <div class="col_2 row-title">开启摸金</div>
      <div class="col_5">
        <i-switch v-model="ghoulEnabled" size="large" />
        <Icon class="setting-btn" type="md-settings" size="22" @click="showSetting" />
      </div>
    </div>
    <div class="row">
      <div class="col_2 row-title">提示音量</div>
      <div class="col_5">
        <Slider v-model="vol" :max="100"></Slider>
      </div>
    </div>
    <div class="row">
      <Card dis-hover>
        <p slot="title">{{statTitle}}</p>
        <p slot="extra">{{totalValue > 0 ? `总价值${totalValue}鱼丸` : ''}}</p>
        <div class="row">
          <div class="pic-wrapper">
            <img class="pic" src="https://gfs-op.douyucdn.cn/dygift/1606/ecb0d4c424ff0bafbf4ba52a3284268b.png" />
            <div class="count">{{zan}}</div>
          </div>
          <div class="pic-wrapper margin_left_20">
            <img class="pic" src="https://gfs-op.douyucdn.cn/dygift/1612/9e8e5a8a3c442933926d877d62b08b1b.png" />
            <div class="count">{{wen}}</div>
          </div>
          <div class="pic-wrapper margin_left_20">
            <img class="pic" src="https://gfs-op.douyucdn.cn/dygift/1704/2f2d56c74487baaffd52e5c21c62b65e.png" />
            <div class="count">{{song}}</div>
          </div>
          <div class="pic-wrapper margin_left_20">
            <div class="no-pic"><span>丸</span></div>
            <div class="count">{{silver}}</div>
          </div>
        </div>
      </Card>
    </div>
    <Modal footer-hide v-model="settingModalShow" title="摸金设置" :styles="{ top: '20px' }">
      <CellGroup>
        <Cell title="干掉播放器">
          <Switch v-model="blockLiveStream" slot="extra" />
        </Cell>
        <Cell class="slider-cell-wrapper" title="宝箱延迟">
          <div class="slider-wrapper" slot="extra">
            <Slider v-model="delayRange" :max="2000" :step="10" :tip-format="sliderFormat" range></Slider>
          </div>
        </Cell>
      </CellGroup>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Avatar, Card, Switch, Icon, Slider, Modal, CellGroup, Cell } from 'iview';

export default {
  components: {
    'i-switch': Switch,
    Icon,
    Slider,
    Card,
    Modal,
    CellGroup,
    Cell,
    Avatar,
  },

  data: () => ({
    ghoulEnabled: true,
    vol: 60,
    blockLiveStream: false,
    settingModalShow: false,
    delayRange: [50, 800],
  }),

  computed: {
    ...mapState({
      box: state => state.stat.box,
      zan: state => state.stat.zan,
      wen: state => state.stat.wen,
      song: state => state.stat.song,
      silver: state => state.stat.silver,
      day: state => state.stat.day,
    }),
    statTitle() {
      const { box } = this;
      return box > 0 ? `今日已摸${box}个宝箱` : '今天还没开张';
    },
    totalValue() {
      const { zan, wen, song, silver } = this;
      return (zan + wen + song) * 100 + silver;
    }
  },

  watch: {
    ghoulEnabled(value) {
      this.$store.commit('SET_GHOUL_ENABLED', value);
    },
    vol(value) {
      this.$store.commit('SET_VOL', value);
    },
    blockLiveStream(value) {
      this.$store.commit('SET_BLOCK_LIVE_STREAM', value);
    },
    delayRange(value) {
      this.$store.commit('SET_DELAY_RANGE', value);
    }
  },

  created() {
    this.ghoulEnabled = this.$store.state.setting.ghoulEnabled;
    this.vol = this.$store.state.setting.vol;
    this.blockLiveStream = this.$store.state.setting.blockLiveStream;
    this.delayRange = this.$store.state.setting.delayRange;

    const today = this.getToday();
    this.$store.commit('SET_DAY', today);
  },

  methods: {
    goto99999 () {
      chrome.tabs.create({ 'url': 'https://www.douyu.com/99999', 'selected' : true });
    },
    gotoMyHome () {
      chrome.tabs.create({ 'url': 'https://yuba.douyu.com/user/main/194634764', 'selected' : true });
    },
    getToday() {
      const obj = new Date();
      return `${obj.getFullYear()}${obj.getMonth()}${obj.getDate()}`;
    },
    showSetting() {
      this.settingModalShow = true;
    },
    sliderFormat(value) {
      return `${value}毫秒`;
    },
  }
}
</script>

<style scoped>
  .home-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 15px;
    padding-right: 15px;
  }
  .header-wrapper {
    padding: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f2f3f4;
    margin-bottom: 20px;
  }
  .header-title {
    font-size: 20px;
    font-weight: bold;
  }
  .header-extra {
    font-size: 16px;
  }
  .avatar:hover {
    cursor: pointer;
  }
  .setting-btn {
    margin-left: 30px;
  }
  .setting-btn:hover {
    cursor: pointer;
  }
  .slider-cell-wrapper {
    overflow: visible;
  }
  .slider-wrapper {
    width: 150px;
    overflow: visible;
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .flex_end {
    justify-content: flex-end;
  }
  .col_1 {
    flex: 1;
    flex-direction: row;
  }
  .col_2 {
    flex: 2;
    flex-direction: row;
  }
  .col_3 {
    flex: 3;
    flex-direction: row;
  }
  .col_5 {
    flex: 5;
    flex-direction: row;
  }
  .col_7 {
    flex: 7;
    flex-direction: row;
  }
  .margin_left_20 {
    margin-left: 20px;
  }
  .row-title {
    font-size: 16px;
    font-weight: bold;
  }
  .pic-wrapper {
    position: relative;
    width: 52px;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pic {
    width: 52px;
    height: 52px;
  }
  .no-pic {
    width: 52px;
    height: 52px;
    background-color: #f2f3f4;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: 1px solid #d2d3d4;
  }
  .count {
    position: absolute;
    padding: 0 4px;
    right: 0;
    bottom: 0;
    background: #f60;
    color: #fff;
    border-radius: 4px 0 4px 0;
    font-size: 10px;
    text-align: center;
    min-width: 14px;
    line-height: 12px;
  }
</style>
