/**
 * Created by CAOYI on 2017/3/23.
 */
"use strict";
const Promise            = require('../../../lib/es6-promise').Promise;
const co                 = require('../../../lib/co/we-index');
const regeneratorRuntime = require("../../../lib/regenerator-runtime/runtime");

const config         = require('../../../common/config');
const MarkInfoConfig = require('../../../common/MarkInfoConfig');
const util           = require("./util");
const server         = require("./cartServer");
const parse          = require("./parseData");

/**
 *endTime       结束时间
 *currentTime   当前时间
 *countFunc     计时过程中的执行函数（比如更新时间变化）
 *endFunc       计时结束后的执行函数
 */
let CountDown = function (startTime, countFunc, endFunc, productId) {
    this.startTime = startTime;//开始时间
    this.countFunc = countFunc;//计时函数
    this.endFunc = endFunc;//结束函数
    this.productId = productId;//商品ID
    this.timeInterval = null;
};

CountDown.prototype = {
    //倒计时开始
    //如果抢购时间大于等于24小时，显示抢购开始时间
    //如果抢购时间小于24小时，显示倒计时
    start: function (clearTimeoutObj) {
        let self = this, month = '', day = '', hour = '', minute = '', second = '';
        this.currentTime = new Date().getTime();
        if (this.currentTime > this.startTime) return;
        this.newTime = Math.floor((this.startTime - this.currentTime) / 1000);
        this.timeInterval = setTimeout(function () {
            self.newTime--;
            clearTimeout(self.timeInterval);
            self.start(clearTimeoutObj);
        }, 1000);
        clearTimeoutObj.clearTime = this.timeInterval;
        this.productId = this.timeInterval;
        clearTimeoutObj.timeCounts = this.newTime;
        if (this.newTime <= 0) {
            //计时结束
            clearTimeoutObj.timeCounts = 0;
            self.stop();
        }
        if (Math.floor(this.newTime / 60 / 60 / 24) >= 1) {
            let date = new Date(parseInt(this.startTime));
            month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
            day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        } else {
            month = Math.floor(this.newTime / 60 / 60 / 24 / 30) < 10 ? '0' + Math.floor(this.newTime / 60 / 60 / 24 / 30) : Math.floor(this.newTime / 60 / 60 / 24 / 30);
            day = Math.floor(this.newTime / 60 / 60 / 24) < 10 ? '0' + Math.floor(this.newTime / 60 / 60 / 24) : Math.floor(this.newTime / 60 / 60 / 24);
            hour = Math.floor(this.newTime / 60 / 60 % 24) < 10 ? '0' + Math.floor(this.newTime / 60 / 60 % 24) : Math.floor(this.newTime / 60 / 60 % 24);
            minute = Math.floor(this.newTime / 60 % 60) < 10 ? '0' + Math.floor(this.newTime / 60 % 60) : Math.floor(this.newTime / 60 % 60);
            second = Math.floor(this.newTime % 60) < 10 ? '0' + Math.floor(this.newTime % 60) : Math.floor(this.newTime % 60);
        }
        //倒计时执行函数
        this.countFunc(month, day, hour, minute, second);
    },
    //倒计时结束
    stop: function () {
        this.timeInterval && clearInterval(this.timeInterval);
        this.endFunc();
        //倒计时跳出递归
        return false;
    }
};

let Page    = {};
let loading = false;//ajax重复提交
let hasStatus = true;//记录是否已登录有数据
/**
 * 加载page data 并渲染购物车
 * @param page Page对象
 */
function getLoadCart(page) {
    var message = MarkInfoConfig.loginErrMsg;
    var isScn = getApp().getScn();
    if(!isScn){
        hasStatus = false;
        return;
    }else{
        hasStatus = true;
    }

    Page        = page;
    let data    = {},
        meiDian = {};
    let gen     = function*() {
        data    = yield server.getLoadCart();
        data    = yield _parseData(data.data);
        meiDian = yield _getMeiDian(data);//有坑，将查询美店的id 存在carts中每个子元素中
        return data;
    };
//
    data.hasStatus = hasStatus;
    page.setData(data);

    co(gen).then(function (data) {
        data.meiDians = meiDian.data || [];

        data.singleProductObj = {};
        //如果singleProductObj对象为空也就是没有执行倒计时的情况渲染商品数据
        if (Object.keys(data.singleProductObj).length === 0) {
            page.setData(data);
        }
        //预约待开抢时显示倒计时
        if (!(data && data.carts)) return;
        if (data && data.carts) {
            for (let i = 0, len1 = data.carts.length; i < len1; i++) {
                for (let j = 0, len2 = data.carts[i].commerceItemsGroups.length; j < len2; j++) {
                    for (let m = 0; m < data.carts[i].commerceItemsGroups[j].commerceItemsGroup.length; m++) {
                        let product = data.carts[i].commerceItemsGroups[j].commerceItemsGroup[m];
                        let startTime, cart, productId = '';
                        //QGQ抢购前
                        if (product.reserveStatus && product.reserveStatus == 'QGQ') {
                            if (product.reserveStartTime) {
                                startTime = product.reserveStartTime;//开始时间
//                            startTime = new Date('2018-03-30 10:33:30').getTime();
                                productId = product.itemId;
                                //调用倒计时
                                cart = new CountDown(startTime, function (month, day, hour, minute, second) {
                                    product._countDown = [month, day, hour, minute, second];
                                    //将每个倒计时与对应的商品相关联，放在Data下面
                                    data.singleProductObj[product.itemId].times = product._countDown;
                                    //渲染倒计时
                                    page.setData(data);
                                }, function () {
                                    //倒计时结束，调用getLoadCart方法重新加载loadCart渲染数据
                                    clearTimeout(data.singleProductObj[product.itemId].getNewCartData);
                                    data.singleProductObj[product.itemId].getNewCartData = setTimeout(function () {
                                        server.getLoadCart().then(function(newData){
                                            data = _parseData(newData.data);
                                            page.setData(data);
                                        });
                                    }, 1000)
                                }, productId);
                                //times，倒计时秒数
                                //clearTime，为了退出程序或者标签切换的时候清除定时器
                                //timeCounts，倒计时结束之后隐藏页面上的提示信息
                                //getNewCartData，因前端跟后端服务器开始时间不一致，倒计时结束之后间隔200毫秒去后台请求新的loadCart数据
                                if (!data.singleProductObj[product.itemId]) {
                                    data.singleProductObj[product.itemId] = {
                                        times: [],
                                        clearTime: '',
                                        timeCounts: '',
                                        getNewCartData: null
                                    };
                                }
                                cart.start(data.singleProductObj[product.itemId]);
                            }
                        }
                    }
                }
            }
        }

    }).catch(function (e) {
        console.error(e);
        //集中处理异常
        wx.showToast({
            title   : e.message || e.errMsg || '后台异常',
            icon    : 'none',
            duration: 8000
        });
        if (!data || !data.carts) {
            data.status = "empty";
        }
        page.setData(data);
    });
}
/**
 * 解析处理 数据
 * @param data
 * @returns {*}
 * @private
 */
function _parseData(data) {
    /**
     * 判断购物车整体状态
     * @param data
     * @returns {*}
     * @private
     */
    function __getStatus(data) {
        const STATUS = ['empty', 'normal', 'notLogin'];
        if (!data.siVOs || data.siVOs.length < 1) {
            return STATUS[0];
        }
        //TODO 判断登陆状态
        return STATUS[1];
    }
    function __parseProfile(profile) {
        if(!profile){
            return {};
        }
        profile.selected    = data.allItemsSelected;
        profile._totalPrice = util.parsePrice(profile.totalAmount);
        profile._discPrice  = util.parsePrice(profile.discAmount);
        profile._notClass   = (profile.itemCount < 1) ? 'carts-footer-account--no' : '';
        profile._showDisabledClass = (profile.showDisabled)? 'check-box--gray' :'';
        return profile;
    }

    return {
        status : __getStatus(data),
        carts  : parse.parseCarts(data.siVOs,Page,data),
        profile: __parseProfile(data.cartProfile)
    };
}

function _getMeiDian(data) {
    if (!data || !data.carts || data.carts.length < 1) {
        return data;
    }
    let ary = data.carts[0].meiDianIdArray;
    if (!ary || ary.length < 1) {
        return data;
    }
    return server.getMeiDian(ary);
}

/******************************event start******************************************/
/**
 * 调用ajax promise 封装回调后事件（if(成功)=>loadCart ,else 错误=> showToast）
 * @param serverFn
 * @param data
 * @private
 */
function __baseEvent(serverFn, data) {
    if (loading) return;
    loading = true;
    serverFn(data)
        .then(function (d) {
            getLoadCart(Page);//
        })
        .catch(function (err) {
          
            wx.showToast({
                title: err.message || err.errMsg,
                icon : "none",
                duration:3000
            });
        }).finally(function () {
        loading = false;
    });
}
function _modifyProductNum(data) {
    __baseEvent(server.modifyProductNum, data);
}
function _checkProduct(data) {
    if (data.isChecked) {
        __baseEvent(server.checkedProduct, data);
    } else {
        __baseEvent(server.unCheckedProduct, data);
    }

}

function _checkCart(data) {
    if (data.isChecked) {
        __baseEvent(server.checkedCart, data);
    } else {
        __baseEvent(server.unCheckedCart, data);
    }
}
function _checkAllCarts(data) {
    if (data.isChecked) {
        __baseEvent(server.checkedAllCarts, {});
    } else {
        __baseEvent(server.unCheckedAllCarts, {});
    }
}
function _submitCarts() {
    //TODO 优化
    // __baseEvent(server.submitCarts);
    /*function _toOrder(data){
     wx.navigateTo({
     url: '../../confirmOrder/confirmOrder'
     })
     }*/
    let gen = function*() {
        let data = yield server.submitCarts();
        // data     = yield _toOrder(data);
        return data;
    };
    co(gen).then(function (data) {
        wx.navigateTo({
            url: '../confirmOrder/confirmOrder'
        })
    }).catch(function (e) {
        //集中处理异常
       /* wx.showModal({
            content: e.message || '后台异常',
            showCancel: false,
            confirmColor: "#ff5c5c",
            confirmText:'',
            success: function(res) {
               /!* if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }*!/
            }
        });*/
//        if(e && e.code){
//            e.message = config.errMessage[e.code] || e.message;
//        }
//        wx.showToast({
//            title   : e.message || '后台异常',
//            icon    : 'loading',
//            duration: 2000
//        });
//        util.log(e);
    });
}
function _deleteProduct(data) {
    wx.showModal({
        title  : '提示',
        content: '您确认删除？',
        success: function (res) {
            if (res.confirm) {
                __baseEvent(server.deleteProduct, data);
            } else if (res.cancel) {

            }
        }
    });
    // __baseEvent(server._deleteProduct,data);

}
function _pickerOnGroupHead(req) {
    __baseEvent(server.pickerOnGroupHead, req);
}
/******************************event    end******************************************/

const ctl      = {
    //load 数据
    getLoadCart : getLoadCart,
    //product绑定事件
    productEvent: {
        modifyProductNum: _modifyProductNum,
        checkProduct    : _checkProduct,
        deleteProduct   : _deleteProduct //删除单个product
    },
    //cart绑定事件
    cartEvent   : {
        checkCart: _checkCart
    },
    groupEvent  : {
        pickerOnGroupHead: _pickerOnGroupHead
    },
    //底部事件
    footerEvent : {
        checkAllCarts: _checkAllCarts,//全选
        submitCarts  : _submitCarts //去结算
    }
};
module.exports = ctl;