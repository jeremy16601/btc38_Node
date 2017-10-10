'use strict';
const md5 = require('md5');
// const baseUrl = require('../../config/apiData');
module.exports = app => {
  class HomeController extends app.Controller {

    
    * index(ctx) {

    }

    /**
     * 账户余额API
     * @param {*} ctx 
     */
    * balance(ctx) {
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

    /**
     * 挂单
     * @param {*} ctx 
     */
    * submitOrder(ctx) {
      const tims = Date.parse(new Date());
      const result = yield ctx.curl('http://api.btc38.com/v1/submitOrder.php', {
        method: 'POST',
        data: {
          key: app.config.appkeys,
          skey: app.config.appskeys,
          time: tims,
          type: ctx.request.body.type, //1为买入挂单，2为卖出挂单，不可为空
          md5: md5(app.config.appkeys + '_' + app.config.UID + '_' + app.config.appskeys + '_' + tims),
          mk_type: 'cny',
          price: ctx.request.body.price,
          amount: ctx.request.body.amount,
          coinname: ctx.request.body.coinname,
        },

      });
      ctx.body = result;
    }

    /**
     * 撤单
     * @param {*} ctx 
     */
    * cancelOrder(ctx) {
      const tims = Date.parse(new Date());
      const result = yield ctx.curl('http://api.btc38.com/v1/cancelOrder.php', {
        method: 'POST',
        data: {
          key: app.config.appkeys,
          skey: app.config.appskeys,
          time: tims,
          type: ctx.request.body.type, //1为买入挂单，2为卖出挂单，不可为空
          md5: md5(app.config.appkeys + '_' + app.config.UID + '_' + app.config.appskeys + '_' + tims),
          mk_type: 'cny',
          price: ctx.request.body.price,
          amount: ctx.request.body.amount,
          coinname: ctx.request.body.coinname,
        },

      });
      ctx.body = result;
    }

    /**
     * 我的挂单API
     * @param {*} ctx 
     */
    * getOrderList(ctx) {
      const tims = Date.parse(new Date());
      const result = yield ctx.curl('http://api.btc38.com/v1/getOrderList.php', {
        method: 'POST',
        dataType: 'json',
        data: {
          key: app.config.appkeys,
          skey: app.config.appskeys,
          time: tims,
          md5: md5(app.config.appkeys + '_' + app.config.UID + '_' + app.config.appskeys + '_' + tims),
          mk_type: 'cny',
          coinname: ctx.request.body.coinname,
        },

      });
      ctx.body = result;
    }

    /**
     * 交易行情API
     * @param {*} ctx 
     */
    * getTicker(ctx) {
      const result = yield ctx.curl('http://api.btc38.com/v1/ticker.php?c=' + ctx.query.coinname + '&mk_type=cny', {
        method: 'GET',
        dataType: 'json',
      });
      ctx.body = result.data;
    }

    /**
     * 市场深度API
     * @param {*} ctx 
     */
    * getDepth(ctx) {
      const result = yield ctx.curl('http://api.btc38.com/v1/depth.php?c=' + ctx.query.coinname + '&mk_type=cny', {
        method: 'GET',
        dataType: 'json',
      });
      ctx.body = result.data;
    }

  }
  return HomeController;
};