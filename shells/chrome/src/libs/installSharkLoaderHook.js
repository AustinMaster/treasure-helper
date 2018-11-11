module.exports = ({ setting }) => {
  const { minimalism } = setting;
  minimalism && Object.defineProperty(window, 'SHARK_LOADER_CONFIG', {
    get: () => window._SHARK_LOADER_CONFIG,
    set: value => {
      value = {
        P0: [
          {
            name: 'vendor',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/lib/vendor-room_ec0828f.js',
            ],
          },
        ],
        P1: [
          {
            name: 'sdk',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/lib/sdk-room_f50223a.js',
            ],
          },
        ],
        P2: [
          {
            name: 'page',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/page_8a8550f.js',
            ],
          },
        ],
        P3: [
          {
            name: 'player',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/player_8a8550f.js',
            ],
          },
        ],
        P4: [
          {
            name: 'common',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/common_8a8550f.js',
            ],
          },
        ],
        T0: [
          {
            name: 'login',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/login_d236533.js',
            ],
          },
        ],
        T3: [
          {
            name: 'playerAside',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/playerAside_3b54694.js',
            ],
          },
        ],
        Tasync: [
          {
            name: 'menu',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/menu_b854873.js',
            ],
          },
          {
            name: 'superMenu',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/superMenu_5972533.js',
            ],
          },
          {
            name: 'kingGlorySummerComponent',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/kingGlorySummerComponent_bb867b6.js',
            ],
          },
          {
            name: 'accountSecurity',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/accountSecurity_e46f0f2.js',
            ],
          },
          {
            name: 'pubgInfoComponent',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/pubgInfoComponent_91cb9bc.js',
            ],
          },
          {
            name: 'actAnnual10',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/actAnnual10_5575719.js',
            ],
          },
          {
            name: 'wzryAnchor1811',
            url: [
              'https://sta-op.douyucdn.cn/front-publish/live-master/js/room/wzryAnchor1811_2340928.js',
            ],
          },
        ],
      };
      window._SHARK_LOADER_CONFIG = value;
    },
  });
};
