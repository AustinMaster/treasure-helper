<template>
  <div class="header-wrapper">
    <div @click.prevent="goto99999">
      <Avatar class="avatar"
              src="https://apic.douyucdn.cn/upload/avatar_v3/201808/650168b922e4aae868b29fec672c4fa9_big.jpg"
              size="large" />
    </div>
    <p class="header-title">99999摸金助手 0.2.1</p>
    <a class="header-extra" href="#" @click.prevent="gotoMyHome">by vivym</a>
  </div>
</template>

<script>
import { Avatar } from 'iview';

export default {
  components: { Avatar },
  methods: {
    goto99999 () {
      this.createTab({ 'url': 'https://www.douyu.com/99999', 'selected' : true });
    },
    gotoMyHome () {
      this.createTab({ 'url': 'https://yuba.douyu.com/user/main/194634764', 'selected' : true });
    },
  },
}
</script>

<style scoped>
  .header-wrapper {
    padding: 15px 0px;
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
    font-size: 12px;
  }
  .avatar:hover {
    cursor: pointer;
  }
</style>
