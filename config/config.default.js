'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1507554705848_2118';
  config.UID = '346809';
  config.appkeys = 'f7008f0375f85bdd2ac85a539cd539a7';
  config.appskeys = '5ef8bcbc0f60f610871ac88cf60baf6734ea8550a7301d5e5c1edd52508f3903';
  // add your config here
  config.middleware = [];
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };
  config.mysql = {
    client: {
      host: '594e17250df88.sh.cdb.myqcloud.com',
      port: '11820',
      user: 'cdb_outerroot',
      password: 'lixueqing1127##',
      database: 'mybtc',
    },
    app: true,
    agent: false,
  };
  exports.dingtalkRobot = {
    // 机器人的accessToken
    accessToken: '0985fb30747b95f5dce596d4c39a89c756deb76e22fbbf3e608d305e86071d6c',
  };

  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };
  return config;
};