
'use strict';
const md5 = require('md5');
// const baseUrl = require('../../config/apiData');
module.exports = app => {
  class HomeController extends app.Controller {
    * index(ctx) {
      const tims = Date.parse(new Date());
      const result = yield ctx.curl('http://api.btc38.com/v1/getMyBalance.php', {
        // 自动解析 JSON response
        method: 'POST',
        dataType: 'json',
        data: {
          key: app.config.appkeys,
          skey: app.config.appskeys,
          time: tims,
          md5: md5(app.config.appkeys + '_' + app.config.UID + '_' + app.config.appskeys + '_' + tims),
        },

      });
      ctx.body = result;
    }
  }
  return HomeController;
};
