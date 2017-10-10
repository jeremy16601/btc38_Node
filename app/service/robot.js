const co = require('co');

module.exports = app => {
    class Robot extends app.Service {

        //得到最新价格
        * getPrice(coinname) {
            const result = yield this.ctx.curl('http://localhost:7001/getDepth?coinname=' + coinname, {
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
            return nowPrice[0];
        }

        //开启机器人
        * startRobot() {
            //获取价格
            let price = yield this.getPrice('INF');
            //开始时间
            let currentTime = Date.parse(new Date());
            //结束时间
            let endTime = parseInt(currentTime + (6* 1000));
            const self = this;
            //开启循环
            var interval = setInterval(
                function () {
                    co(function* () {
                        currentTime = Date.parse(new Date());
                        console.log('执行了循环currentTime=' + currentTime + '   endTime=' + endTime);
                        if (currentTime == endTime) {
                            //结束时候获取价格和之前的对比 
                            const currentPrice = yield self.getPrice('INF');
                            //如果原始价格跟当前价格相差2.2%  买入
                            const mPrice=parseFloat(price)-parseFloat(price*0.022); 
                            console.warn('结束：原始价格：' + price + '最新价格：' +  currentPrice+'一分钟后2.2% 的价格：'+mPrice.toFixed(5));
                            if(currentPrice<mPrice  ) {
                                console.error('买入！')
                            }                       
                            // console.log('价格没变化，重新开始。')
                            price = yield self.getPrice('INF');
                            endTime = parseInt(currentTime + (6* 1000));
                        };
                    })
                }, 1000);

            return price;
        }
    
    }
    return Robot;
};