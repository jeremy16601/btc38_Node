const co = require('co');
const queue = require('async-promise-queue');
const md5 = require('md5')
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
            console.log(coinname + '最新价格：' + nowPrice[0]);
            return result.data;
        }

        /**
         * 挂单
         * @param {*} ctx 
         */
        * submitOrder(type, price, amount, coinname) {
            const self = this;
            const tims = Date.parse(new Date());
            //console.log('类型'+type+' =='+price+' --'+amount+'---'+coinname)
            const result = yield self.ctx.curl('http://api.btc38.com/v1/submitOrder.php', {
                method: 'POST',
                data: {
                    key: app.config.appkeys,
                    skey: app.config.appskeys,
                    time: tims,
                    type: type, //1为买入挂单，2为卖出挂单，不可为空
                    md5: md5(app.config.appkeys + '_' + app.config.UID + '_' + app.config.appskeys + '_' + tims),
                    mk_type: 'cny',
                    price: price,
                    amount: amount,
                    coinname: coinname,
                },

            });
            // ctx.body = result;
        }

        //开启机器人
        * startBuyRobot(coinname, amount) {
            let data = yield this.getPrice(coinname); //获取价格
            let price = data.bids[0][0];
            let old_price = price; //原始价格
            //开始时间
            let currentTime = Date.parse(new Date());
            //结束时间
            let endTime = parseInt(currentTime + (60 * 1000));
            const self = this;

            //开启循环
            let interval = setInterval(
                function () {
                    co(function* () {
                        currentTime = Date.parse(new Date());
                        // console.log('执行了循环currentTime=' + currentTime + '   endTime=' + endTime);
                        if (currentTime == endTime) {
                            //结束时候获取价格和之前的对比 
                            const currentData = yield self.getPrice(coinname);
                            const currentPrice = currentData.bids[0][0];
                            //如果原始价格跟当前价格相差2.2%  买入
                            const mPrice = parseFloat(price) + parseFloat(price * 0.018);
                            console.warn('买单价格：' + price + '结束价格：' + currentPrice);
                            if (currentPrice > mPrice.toFixed(5)) {
                                console.log('----------------------------买入------------------------------！')
                                yield self.app.dingtalkRobot.sendText(coinname + '挂单成功！价格：' + currentPrice);
                                yield self.submitOrder('1', currentPrice, amount, coinname);
                                //保存数据库
                                let params = {};
                                params.amount = amount;
                                params.coinname = coinname;
                                params.price = price;
                                params.buy_price = currentPrice;
                                params.type = '1';
                                params.order_id = currentTime;
                                yield self.saveToDB(params);
                                //加入卖出任务
                                yield self.sellCoin(currentTime, currentPrice, coinname, amount, currentTime);
                            }
                            //
                            if (parseFloat((currentPrice * 0.006) + currentPrice) < price) {
                                yield self.app.dingtalkRobot.sendText(coinname + '警告！！！降了！原价：' + price + '当前价格：' + currentPrice);
                                console.log(coinname + '-警告！！！降了！原价：' + price + '当前价格：' + currentPrice);
                            }

                            console.log('买单价格没变化，重新开始。' + price);
                            //重置价格
                            price = currentPrice;
                            // yield self.app.dingtalkRobot.sendText('买单价格没变化，重新开始。' +price);
                            //price = yield self.getPrice(coinname);
                            endTime = parseInt(currentTime + (60 * 1000));
                        };
                    })
                }, 1000);

            return price;
        }

        //卖出任务
        * sellCoin(id, price, coinname, amount, order_id) {
            console.log(coinname + '订单ID：' + id + '开启卖单监控');
            //开始时间
            let currentTime = Date.parse(new Date());
            //结束时间
            let endTime = parseInt(currentTime + (60 * 1000));
            const self = this;

            //开启循环
            let interval = setInterval(
                function () {
                    co(function* () {
                        currentTime = Date.parse(new Date());
                        // console.log('执行了循环currentTime=' + currentTime + '   endTime=' + endTime);
                        if (currentTime == endTime) {
                            //结束时候获取价格和之前的对比 
                            const currentData = yield self.getPrice(coinname);
                            const currentPrice = currentData.asks[0][0];
                            //如果原始价格跟当前价格相差2.2%  卖出
                            let mPrice = 0;

                            if (coinname == 'INF') {
                                //如果是迅链 ，直接挂单
                                mPrice = parseFloat(price) + parseFloat(price * 0.016);
                            } else {
                                mPrice = parseFloat(price + (price * 0.022))
                            }
                            console.log('卖单开始价格：' + price + '结束价格：' + currentPrice + '一分钟后2% 的价格：' + mPrice.toFixed(5));
                            if (currentPrice > mPrice.toFixed(5)) {
                                console.log('----------------------------卖出------------------------------！')
                                yield self.app.dingtalkRobot.sendText(coinname + '卖出。原价' + price + '现价：' + currentPrice);
                                yield self.submitOrder('2', currentPrice, amount, coinname);
                                //保存数据库
                                let params = {};
                                params.amount = amount;
                                params.sell_price = currentPrice;
                                params.type = '2';

                                yield self.updateToDB(currentPrice, order_id);
                                //加入卖出任务
                                clearInterval(interval);
                            }
                            // if (currentPrice < price) {
                            //     console.log('----------------------------警告！！！降了！原价：' + price + '当前价格：' + currentPrice);
                            // }
                            //重置价格
                            price = currentPrice;
                            console.log('卖单价格没变化，重新开始。' + price);
                            // yield self.app.dingtalkRobot.sendText('卖单价格没变化，重新开始。' +price);
                            //price = yield self.getPrice(coinname);
                            endTime = parseInt(currentTime + (60 * 1000));
                        };
                    })
                }, 1000);
        }

        //根据原始价格判断，启动后如果跌幅超过3%，发送警告，停止。
        * checkPrice(old_price) {

        }

        //保存挂单到数据库
        * saveToDB(params) {
            console.log('调用create')
            params.created_at = this.app.mysql.literals.now;
            const result = yield this.app.mysql.insert('btc_order', params);
            return result;
        }

        //更新挂单到数据库
        * updateToDB(sell_price, order_id) {
            console.log('调用update')
            const result = yield this.app.mysql.query('update btc_order set sell_price = ? ,type = 2, sell_at = ? where order_id = ?', [sell_price, this.app.mysql.literals.now, order_id]);;
            return result;
        }

    }
    return Robot;
};