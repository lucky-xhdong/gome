// 导购-3
// 安装-2
// 配送-1
var app = getApp();
var ourHost = app.ourHost;
var goHeader = app.goHeader;
var scn;

Page({
    data: {
        courierImg: '', //人员图片
        courierName: '', //人员姓名
        courierNo: '', //人员编号
        courierPhone: '', //人员电话
        userType: '', //人员类型
        labels: [], //人员标签
        starLevel: '', //人员星级
        serviceSite: '', //人员服务站点
        isAppraise: '', //人员是否评价
        installid: '', //安装单号
        ordreid: '', //订单号
        deliverId: '', //配送单号
        price: '', //价格
        skuIds: '', //保存评价使用
        skuid: '', //查询分数使用
        storeId: '', //门店id
        storeName: '', //门店名称
        salerId: '', //门店员工id
        deliverFlag: '', //是否需要配送

        headLabelShow: true, //是否展示人员总评标签区域
        openLabel: false, //标签的收起与隐藏
        labelLength: true, //是否显示隐藏/显示标签
        pickLabel: false, //评价标签的选择与否
        starsArr: [2, 2, 2, 1, 0], //总评星星数

        evalStarsArr: [2, 2, 2, 2, 2], //评价成功之后显示的星星数
        evalLabels: '', //人员评价标签
        myEvalLabel: '', //个人未评价标签
        myScore: 5, //个人评分 - 默认5分
        myLabels: [], //个人已评价标签
        isEval: false, //用户是否已评价
        goodEval: 2, //用户评价 好评2/中评1/差评0
        evalDate: '', //用户评价时间
    },

    onLoad: function(options) {
        console.log(options);
        var that = this;
        if (options.userType == 3) {
            that.setData({
                userType: options.userType,
                courierNo: options.courierNo, //人员编号
                deliverId: options.shippingGroupId, //配送单号
                ordreid: options.orderId, //订单号
                isAppraise: options.isAppraise, //是否评价
                price: options.goodsPrice, //支付金额
                skuIds: options.skuId,
                skuid: options.skuId,
                storeId: options.storeId, //门店id
                storeName: options.storeName, //门店名称
                deliverFlag: options.deliverFlag, //是否需要配送
            });
        } else if (options.userType == 2) {
            that.setData({
                userType: options.userType,
                courierNo: options.courierNo,
                installid: options.installId,
                deliverId: options.deliverId,
                ordreid: options.orderId,
                isAppraise: options.isAppraise,
                price: options.price,
            });
        } else {
            that.setData({
                userType: options.userType,
                courierNo: options.courierNo,
                ordreid: options.orderId,
                deliverId: options.deliverId,
                isAppraise: options.isAppraise,
                price: options.price,
            });
        }
    },

    onShow: function() {
        var that = this;
        wx.setStorageSync('scores', [5]);
        scn = app.getScn();
        if (that.data.isAppraise == 'NOTDONE') { //人员未评价
            if (typeof(that.data.skuIds) == 'string') {
                var skuIdArr = that.data.skuIds.split(',');
                that.setData({
                    skuIds: skuIdArr,
                })
            }
            if (that.data.myEvalLabel == '') {
                that.initData(); //请求人员信息及返回对应的标签
            }
        } else { //人员已评价,展示已评价模块
            that.evalScore();
            that.initData();
        }
    },

    onHide: function() {
        wx.removeStorageSync('scores');
    },


    initData: function() { //获取人员信息
        var that = this;
        wx.request({
            url: ourHost + '/sixteenAppraise/getPeopleMessages',
            data: {
                courierNo: that.data.courierNo,
                userType: that.data.userType,
                storeId: that.data.storeId,
            },
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader,
            },
            success: function(res) {
                console.log(res.data);
                var myUrl;
                if (res.statusCode == 200) {
                    if (res.data.labels == '') { //没标签就不展示
                        that.setData({
                            headLabelShow: false,
                        });
                    };
                    res.data.labels.sort((a, b) => b.count - a.count); //将标签按照标签数量排序
                    if (that.data.userType == 3) { //导购员
                        myUrl = ourHost + '/sixteenAppraise/geShopTypeLabel ';
                        that.getAllLabels(myUrl);
                        that.setData({
                            courierName: res.data.courierName,
                            courierNo: res.data.courierNo,
                            labels: res.data.labels,
                            starLevel: res.data.starLevel,
                            courierPhone: res.data.courierPhone,
                            serviceSite: res.data.serviceSite,
                        });
                    } else if (that.data.userType == 2) { //安装员
                        myUrl = ourHost + '/sixteenAppraise/getInstallLabel';
                        that.getAllLabels(myUrl);
                        that.setData({
                            courierImg: app.protocol + res.data.courierImg,
                            courierName: res.data.courierName,
                            courierNo: res.data.courierNo,
                            labels: res.data.labels,
                            starLevel: res.data.starLevel,
                            courierPhone: res.data.courierPhone,
                            serviceSite: res.data.serviceSite,
                        });
                    } else { //配送员
                        myUrl = ourHost + '/sixteenAppraise/geDeliverLabel';
                        that.getAllLabels(myUrl);
                        that.setData({
                            courierImg: app.protocol + res.data.courierImg,
                            courierName: res.data.courierName,
                            courierNo: res.data.courierNo,
                            labels: res.data.labels,
                            starLevel: res.data.starLevel,
                            courierPhone: res.data.courierPhone,
                            serviceSite: res.data.serviceSite,
                        });
                    };
                    var query = wx.createSelectorQuery(); //创建节点选择器
                    query.select('.head-label').boundingClientRect().exec(function(res) {
                        if (res[0] && res[0].height > 52) { // 判断是否展示(显示/隐藏)标签-->看高度是否大于2-3行高度
                            that.setData({
                                labelLength: false,
                            });
                        };
                    });
                    that.methods.starSum(that); //计算总评展示星星数
                }
            },
        });
    },

    evalScore: function() { //获取评分和评价时间
        var that = this;
        var reqData = {};
        if (that.data.userType == 3) { //导购 
            reqData = {
                orderId: that.data.ordreid,
                userType: that.data.userType,
                skuIds: that.data.skuid,
                shippingGroupId: that.data.deliverId,
                userId: scn,
            }
        } else if (that.data.userType == 2) { //安装
            reqData = {
                orderId: that.data.ordreid,
                orderNo: that.data.installid,
                userType: that.data.userType,
            }
        } else { //配送
            reqData = {
                orderId: that.data.ordreid,
                orderNo: that.data.deliverId,
                userType: that.data.userType,
            }
        }
        wx.request({
            url: ourHost + '/sixteenAppraise/queryAppraiseById',
            data: reqData,
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader,
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    that.setData({
                        myScore: res.data.result.score,
                        evalDate: res.data.result.createDate,
                    });
                    that.methods.clickStarSum(that);
                }
            },
        })
    },

    getAllLabels: function(myUrl) { //请求导购/配送/安装员标签
        var that = this;
        wx.request({
            url: myUrl,
            data: {},
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader,
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    that.setData({
                        myEvalLabel: res.data.score5,
                        evalLabels: res.data,
                    })
                }
            },
        });
    },

    dialPhone: function() { //拨打电话--请求服务器时间
        var that = this;
        wx.request({
            url: ourHost + '/sixteenAppraise/getServerHour',
            data: {},
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader,
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    if (that.data.userType == 3) {
                        if (res.data > 9 && res.data < 18) {
                            wx.makePhoneCall({
                                phoneNumber: that.data.courierPhone,
                            })
                        } else {
                            wx.makePhoneCall({
                                phoneNumber: '400 870 8708',
                            })
                        }
                    } else {
                        wx.makePhoneCall({
                            phoneNumber: that.data.courierPhone,
                        })
                    }
                }
            },
        })
    },

    openCloseLabel: function() { //总评标签的展开/收起
        var that = this;
        that.setData({
            openLabel: !that.data.openLabel,
        })
    },

    starTap: function(e) { //点击星星->对应不同的标签
        var that = this;
        var starScores = wx.getStorageSync('scores')[0];
        var ELS = that.data.evalLabels;
        that.setData({
            myLabels: [],
            myScore: starScores,
        });
        for (var key in ELS) {
            if (ELS.hasOwnProperty(key)) {
                if (Number((key + '').slice(5, 6)) == starScores) {
                    that.setData({
                        myEvalLabel: ELS[key],
                    });
                }
            }
        };
    },

    pickUserLabel: function(e) { //点击用户评价的标签
        var that = this;
        that.data.myEvalLabel.forEach((item, index) => { //标签 count 0/1 未选中/选中
            if (e.target.dataset.id == index) {
                if (that.data.myEvalLabel[index].count == 0) {
                    that.data.myEvalLabel[index].count = 1;
                    that.setData({
                        myEvalLabel: that.data.myEvalLabel,
                    })
                } else {
                    that.data.myEvalLabel[index].count = 0;
                    that.setData({
                        myEvalLabel: that.data.myEvalLabel,
                    })
                }
            }
        });
        that.data.myLabels = that.data.myEvalLabel.filter(item => {
            return item.count == 1;
        });
    },

    submit: function() { //提交
        var that = this;
        var myEvalUrl;
        var myEvalData;
        if (that.data.userType == 3) { //导购员  
            myEvalUrl = ourHost + '/sixteenAppraise/addShopAppraise';
            if (that.data.deliverFlag == 2) {
                that.setData({
                    deliverFlag: 0,
                })
            } else {
                that.setData({
                    deliverFlag: 1,
                })
            }
            myEvalData = {
                scn: scn,
                salerId: that.data.courierNo,
                shippingGroupId: that.data.deliverId,
                orderId: that.data.ordreid,
                goodsPrice: that.data.price,
                skuIds: that.data.skuIds,
                storeId: that.data.storeId,
                storeName: that.data.storeName,
                deliverFlag: that.data.deliverFlag,
                orderSource: 1,
                score: that.data.myScore,
                labels: that.data.myLabels,
            };
            that.submitMyEval(myEvalUrl, myEvalData);
        } else if (that.data.userType == 2) { //安装员
            myEvalUrl = ourHost + '/sixteenAppraise/addInstall';
            myEvalData = {
                scn: scn,
                userid: scn,
                installUserid: that.data.courierNo,
                installid: that.data.installid,
                score: that.data.myScore,
                labels: that.data.myLabels,
                ordreid: that.data.ordreid,
                deliverId: that.data.deliverId,
            };
            that.submitMyEval(myEvalUrl, myEvalData);
        } else { //配送员
            myEvalUrl = ourHost + '/sixteenAppraise/addDeliver';
            myEvalData = {
                scn: scn,
                deliverUserid: that.data.courierNo,
                score: that.data.myScore,
                labels: that.data.myLabels,
                ordreid: that.data.ordreid,
                deliverid: that.data.deliverId,
                price: that.data.price,
            };
            that.submitMyEval(myEvalUrl, myEvalData);
        };
    },

    submitMyEval: function(myEvalUrl, myEvalData) {
        var that = this;
        console.log(JSON.stringify(myEvalData));
        wx.request({
            url: myEvalUrl,
            data: myEvalData,
            header: {
                'content-type': 'application/json;charset=utf-8',
                'gome-header': goHeader,
            },
            method: 'POST',
            success: function(res) {
                if (res.statusCode == 200) {
                    //导购员对应多商品--某一商品失败调用
                    if (that.data.userType == 3 && res.data.result.length > 0) {
                        that.setData({
                            skuIds: res.data.result,
                        })
                        wx.showToast({
                            title: '提交失败，请重试',
                            icon: 'none',
                            duration: 2000,
                        })
                    } else {
                        that.evalScore();
                        wx.showToast({
                            title: '感谢您的评价，我们会不断提升服务',
                            icon: 'none',
                            duration: 2000,
                        });
                    }
                } else {
                    let message = res.data.message;
                    if (message == null) {
                        message = '提交失败，请重试';
                    }
                    wx.showToast({
                        title: message,
                        icon: 'none',
                        duration: 2000,
                    })
                }
            },
        });
    },

    methods: {
        starSum(that) { //计算总评星星
            var quan = Math.floor(that.data.starLevel / 1);
            var ban = that.data.starLevel % 1;
            var arr = [];
            for (var i = 0; i < quan; i++) {
                arr[i] = 2;
            };
            if (ban >= 0.5) {
                arr[i] = 2
            } else if (ban < 0.5 && ban != 0) {
                arr[i] = 1
            } else {
                if (quan != 5) {
                    arr[i] = 0
                }
            };
            for (var j = i + 1; j <= 4; j++) {
                arr[j] = 0
            };
            that.setData({
                starsArr: arr,
            });
        },
        clickStarSum(that) { //计算用户评分星星
            var myScore = that.data.myScore;
            var quan = Math.floor(myScore / 1);
            var arr = [];
            for (var i = 0; i < quan; i++) {
                arr[i] = 2;
            };
            for (var j = i; j <= 4; j++) {
                arr[j] = 0
            };
            that.setData({
                isEval: true,
                evalStarsArr: arr,
            });
            if (myScore > 3) {
                that.setData({
                    goodEval: 2,
                })
            } else if (myScore == 2 || myScore == 3) {
                that.setData({
                    goodEval: 1,
                })
            } else {
                that.setData({
                    goodEval: 0,
                })
            }
        },
    }
});