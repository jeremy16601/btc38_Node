const co = require('co');

module.exports = app => {
    class Robot extends app.Service {

        //得到最新价格
        * getPrice(coinname) {
            const result = yield this.ctx.curl('http://localhost:7002/getDepth?coinname=' + coinname, {
                method: 'GET',
                dataType: 'json',
            });
            // bids 是委买单
            const bids = result.data.bids;
            //asks 是委卖单
            const asks = result.data.asks;
            //当前最新价格
            const nowPrice = bids[0];
            console.log('最新价格INF：' + nowPrice[0]);
            return nowPrice;
        }

        //开启机器人
        * startRobot() {
            //获取价格
            const nowPrice = yield this.getPrice('INF');
            //开始时间
            let currentTime = Date.parse(new Date());
            //结束时间
            const endTime = parseInt(currentTime + (60 * 1000));
            const self = this;
            //开启循环
            var interval = setInterval(
                function () {
                    co(function* () {
                        currentTime = Date.parse(new Date());

                        console.log('执行了循环currentTime=' + currentTime + '   endTime=' + endTime);
                        if (currentTime == endTime) {
                            //结束时候获取价格和之前的对比
                            const newData = yield self.getPrice('INF');
                            
                            console.log('结束。。。原始价格：' + nowPrice + '最新价格：' + JSON.stringify(newData));
                            //停止循环
                            clearInterval(interval);
                        };
                    })
                }, 1000);

            return nowPrice;
        }

    }
    return Robot;
};