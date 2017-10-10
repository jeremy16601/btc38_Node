'use strict';

module.exports = app => {
  app.get('/', 'home.index');
  app.get('/balance', 'home.balance');
  //type //1为买入挂单，2为卖出挂单，不可为空
  app.post('/submitOrder', 'home.submitOrder');
  app.post('/getOrderList', 'home.getOrderList');
  //参数coinname
  app.get('/getTicker', 'home.getTicker')

  app.get('/getDepth', 'home.getDepth')

  app.get('/robot_INF', 'robot.robot_INF')
};