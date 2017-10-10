'use strict';
const md5 = require('md5');
// const baseUrl = require('../../config/apiData');
module.exports = app => {
    class RobotController extends app.Controller {

        * robot_INF(ctx) {
            // const nowPrice = yield this.service.robot.getPrice('INF');
           
          
            const start=yield this.service.robot.startRobot();

            ctx.body = start
        }

    };
    return RobotController;
};