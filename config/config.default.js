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

  return config;
};