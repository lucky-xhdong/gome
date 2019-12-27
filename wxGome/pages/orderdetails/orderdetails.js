// pages/orderdetails/orderdetails.js
var app = getApp();
var goHeader = app.goHeader;
Page({
    data: {
        orderId: '', //订单编号
        cancelOrder: false, //取消按钮
        payOrderNow: false, //立即支付按钮
        isPayOnOff: false, //不允许客户一直点击支付按钮，只有失败，或异常操作等才能再次点击
        orderHeadInfo: {}, //头部状态信息
        nodes: [], //订单跟踪信息
        orderInfo: {}, //订单相关信息
        deliveryInfo: {}, //配送信息
        addressInfo: {}, //收货人信息
        invoiceInfo: {}, //发票信息
        productDetailInfo: [], //商品详情信息
        orderHistories: [], //订单跟踪信息
        shippingGroupInfor: {}, //配送单相关信息
        shippingGroupId: 'null', //配送单号，默认没有拆单的为null
        shipPackageShowModelFlag: '0', //默认不开启包裹展示模式
        gomeState: '', //商品状态 PEX 商品部分出库 EX 商品全部出库或正常出库
        shipPackageNumber: 0, //配送单包裹数量,配送单包裹展示模式标记为1时，才有用
        goodNumber: 0, //默认订单详情页商品数量为0，不包含赠品数量，内容也没有展示赠品
        isShowShipCouponAmount: false, //是否展示运费券
        shipCouponAmount: '', //展示运费券为运费券的金额
    },
    /* 页面加载时只传过来参数*/
    onLoad: function(options) {
        var _this = this;
        var app = getApp();

        //当前页面的订单号、配送单号、是否展示包裹信息
        if (options) {
            _this.setData({
                orderId: options.orderId,
                shippingGroupId: options.shippingGroupId ? options.shippingGroupId : '',
                shipPackageShowModelFlag: options.shipPackageShowModelFlag
            });
        }
        _this.init();
    },
    init: function() {
        var _this = this;

        //获取订单详情信息
        _this.getOrderDetail();

        //获取订单跟踪信息
        _this.getOrderTracking();
    },
    /**
     *
     * @description  获取订单详情信息
     * @method getOrderDetail
     * @since 2017-02-17
     * @author 谢俊梅
     */
    getOrderDetail: function() {
        var _this = this;
        var app = getApp();
        //发送详情页接口前，整理需传过去的参数
        var reqData = {
            scn: app.getScn(),
            orderId: _this.data.orderId
        };
        //如果是拆单的存在配送单号
        if (_this.data.shippingGroupId != 'null') {
            reqData.shippingGroupId = _this.data.shippingGroupId;
        }

        wx.request({
            url: app.ourHost + '/order/detail',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            data: reqData,
            method: 'POST',
            success: function(data) {
                console.log(data.data);
                if (data.statusCode == 200) {
                    var productDetailInfo = data.data.product.productInfos.productDetailInfo,
                        freeGiftForOrder = data.data.product.productInfos.freeGiftForOrder,
                        num = 0; //计算商品总件数
                    //商品数量   
                    for (var i = 0; i < productDetailInfo.length; i++) {
                        productDetailInfo[i].price = Number(productDetailInfo[i].price).toFixed(2);
                        num += Number(productDetailInfo[i].quantity);
                    }
                    //赠品数量
                    if (freeGiftForOrder && freeGiftForOrder.length > 0) {
                        for (var i = 0; i < freeGiftForOrder.length; i++) {
                            freeGiftForOrder[i].couponAmount = Number(freeGiftForOrder[i].couponAmount).toFixed(2);
                            num += Number(freeGiftForOrder[i].couponQuantity);
                        }

                    }

                    _this.setData({
                        orderHeadInfo: data.data.top.orderHeadInfo,
                        nodes: data.data.top.nodes,
                        orderInfo: data.data.right.orderRightInfo && data.data.right.orderRightInfo.orderInfo || {},
                        deliveryInfo: data.data.right.orderRightInfo && data.data.right.orderRightInfo.deliveryInfo || {},
                        addressInfo: data.data.right.orderRightInfo && data.data.right.orderRightInfo.addressInfo || {},
                        productDetailInfo: productDetailInfo,
                        freeGiftForOrder: freeGiftForOrder,
                        shippingGroupInfor: data.data.product.productInfos.shippingGroupInfor,
                        invoiceInfo: data.data.right.orderRightInfo && data.data.right.orderRightInfo.invoiceInfo || {},
                        cancelOrder: data.data.top.orderHeadInfo.cancelOrder,
                        payOrderNow: data.data.top.orderHeadInfo.payOrderNow,
                        gomeState: data.data.top.orderHeadInfo.gomeState,
                        shipPackageNumber: data.data.top.orderHeadInfo.shipPackageNumber,
                        goodNumber: num,
                        isShowShipCouponAmount: data.data.right.orderRightInfo.orderInfo.isShowShipCouponAmount == 'N' ? false : true,
                        shipCouponAmount: data.data.right.orderRightInfo.orderInfo.shipCouponAmount,
                    });
                }
            }
        });
    },
    /**
     *
     * @description  获取订单跟踪信息
     * @method getOrderTracking
     * @since 2017-02-17
     * @author 谢俊梅
     */
    getOrderTracking: function() {
        var _this = this;
        var app = getApp();
        wx.request({
            url: app.ourHost + '/order/history',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            data: {
                scn: app.getScn(),
                orderId: _this.data.orderId,
                shippingGroupId: _this.data.shippingGroupId
            },
            method: 'POST',
            success: function(data) {
                if (data.statusCode == 200) {
                    _this.setData({
                        orderHistories: data.data.result.orderHistories
                    });
                }
            }
        });
    },
    //去支付
    toPlay: function() {
        var app = getApp();
        var _this = this;

        if (_this.data.isPayOnOff) {
            return false;
        }
        _this.setData({
            isPayOnOff: true
        });

        wx.login({
            success: function(ress) {
                if (ress.code) {
                    //发起网络请求
                    wx.getSystemInfo({
                        success: function(res) {
                            wx.request({
                                url: app.ourPay + '/api/wechat/cashier/pay',
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                                    'gome-header': goHeader,
                                    'Cookie': 'SCN=' + app.getScn()
                                },
                                data: {
                                    // scn: app.scn,
                                    // orderId: _this.data.orderId,
                                    // code: ress.code,
                                    // mobileSysVersion: res.model
                                    type: 1,
                                    orderId: _this.data.orderId,
                                    msv: res.model,
                                    code: ress.code
                                },
                                method: 'GET',
                                success: function(res) {
                                    var data = res.data;
                                    _this.payResult(data);
                                }
                            });
                        }
                    });

                } else {
                    _this.setData({
                        isPayOnOff: false
                    });
                    wx.showToast({
                        title: '获取用户登录态失败，请稍后重试！',
                        duration: 2000
                    });
                }
            }
        });
    },
    //支付请求发送后的操作
    payResult: function(data) {
        var _this = this;
        _this.setData({
            isPayOnOff: false
        });

        if (data.success) {
            //成功后，后续操作
            var sdkInfo = data.data;
            if (sdkInfo) { //微信支付
                wx.requestPayment({
                    'timeStamp': sdkInfo.timeStamp,
                    'nonceStr': sdkInfo.nonceStr,
                    'package': sdkInfo.package,
                    'signType': sdkInfo.signType,
                    'paySign': sdkInfo.paySign,
                    'success': function(res) {
                        //微信支付成功后，页面重新加载,做一个延时，保障数据同步过来
                        wx.showToast({
                            title: '支付成功',
                            duration: 500,
                            success: function() {
                                _this.init();
                            }
                        });
                    },
                    'fail': function(res) {
                        //失败后能继续点击立即支付
                        _this.setData({
                            isPayOnOff: false
                        });

                        wx.showToast({
                            title: '支付失败',
                            duration: 2000,
                            success: function() {

                            }
                        })
                    }
                })
            }

        } else {
            //支付失败后 弹出提示语
            if (!data.status) {
                wx.showToast({
                    title: data.errMsg || data.message || "对不起！系统繁忙，请稍后重试！",
                    duration: 2000
                })
            }
        }
    },
    //取消订单
    cancelOrder: function() {
        var _this = this;
        var app = getApp();
        //弹出提示框
        wx.showModal({
            title: '是否申请取消订单？',
            confirmColor: '#e4393c',
            success: function(res) {
                if (res.confirm) {
                    //点击确认后发起 取消订单请求
                    wx.request({
                        url: app.ourHost + '/order/cancel',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                            'gome-header': goHeader
                        },
                        data: {
                            scn: app.getScn(),
                            orderId: _this.data.orderId,
                            cancelReason: 'qxyy1',
                            shippingGroupId: _this.data.shippingGroupId
                        },
                        method: 'POST',
                        success: function(data) {
                            if (data.data.success) {
                                var reponseInfo = data.data.result.cancelOrderRepInfo.reponseInfo;
                                //取消成功后，弹出提示语句
                                wx.showToast({
                                    title: reponseInfo,
                                    width: '550rpx',
                                    icon: 'success',
                                    duration: 600,
                                    success: function() {
                                        //取消完成后，重新加载详情页信息，做一个延时，保障数据同步过来
                                        setTimeout(function() {
                                            _this.init();
                                        }, 500);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    //显示遮罩层
    showModal: function() {
        // 显示遮罩层  
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    //点击按钮  
    clickbtn: function() {
        if (this.data.showModalStatus) {
            this.hideModal();
        } else {
            this.showModal();
        }
    },
    //隐藏遮罩层
    hideModal: function() {
        // 隐藏遮罩层  
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },
    //弹层取消按钮
    click_cancel: function() {
        this.hideModal();
    },
    //点击弹出层确定按钮  
    click_ok: function() {
        this.hideModal();
    }
})