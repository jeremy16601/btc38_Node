'use strict';
const md5 = require('md5');
// const baseUrl = require('../../config/apiData');
module.exports = app => {
    class RobotController extends app.Controller {

        * robot_coinname(ctx) {
            // const nowPrice = yield this.service.robot.getPrice('INF');
            const amount='100';
            const start = yield this.service.robot.startBuyRobot(ctx.query.coinname,ctx.query.amount);
            ctx.body = start
        }

    };
    return RobotController;
};