var app = getApp();
var pageCur = 1;
var appList = [];
var productId;
Page({
    data: {
        height: '',
        currentTab: 0,
        hasMore: true,
        hasOver: false,
        scrollTop: 0,//返回顶部
        scroll: false,
        appr: {},
        isappr: false,
        apprList: [],
        praiseGood: '',//好评数量
        praiseMide: '',//中评数量
        praiseBad: '',//差评数量
    },
    ourHost: app.ourHost,
    goHeader: app.goHeader,
    onLoad: function (options) {
        productId = options.productId;
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight + 'px'
                })
            }
        });
    


    },
    onShow:function(){
      var that=this;
      appList = [];
      that.setData({
        apprList: appList
      })
      that.choiceTap();
    },
    // 全部
    allTap: function (options) {
        var that = this;
        appList = [];
        pageCur = 1;
        that.setData({
            currentTab: 0,
            apprList: appList
            
        })
        that.choiceTap();
    },
    // 好评
    goodTap: function (options) {
        var that = this;
        appList = [];
        pageCur = 1;
        that.setData({
            currentTab: 1,
            apprList: appList
        })
        that.choiceTap();
    },
    // 中评
    midTap: function (options) {
        var that = this;
        appList = [];
        pageCur = 1;
        that.setData({
            currentTab: 2,
            apprList: appList
        })
        that.choiceTap();
    },
    // 差评
    badTap: function (options) {
        var that = this;
        appList = [];
        pageCur = 1;
        that.setData({
            currentTab: 3,
            apprList: appList
        })
        that.choiceTap();
    },
    // 不看默认评价
    // noDefault: function (options) {
    //     var that = this;
    //     appList = [];
    //     that.setData({
    //         currentTab: '4'
    //     })
    //     that.choiceTap();
    // },
    // 网络传输
    choiceTap: function () {
        var that = this;
        var pageType = that.data.currentTab;
        wx.request({
            url: that.ourHost + '/evaluate/query',
            data: {
                productId: productId,
                pageCur: pageCur,
                pageType: pageType
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': that.goHeader
            },
            success: function (res) {
                if (res.data.code == 500) {
                    that.setData({
                        hasMore: false,
                        hasOver: true
                    })
                } else {
                    // 当好评、中评、差评大于999时显示999+
                    var praiseGood, praiseMide, praiseBad;
                    if (res.data.apprPrd.praiseGood > 999) {
                        praiseGood = '999+';
                    } else {
                        praiseGood = res.data.apprPrd.praiseGood;
                    }
                    if (res.data.apprPrd.praiseMide > 999) {
                        praiseMide = '999+';
                    } else {
                        praiseMide = res.data.apprPrd.praiseMide;
                    }
                    if (res.data.apprPrd.praiseBad > 999) {
                        praiseBad = '999+';
                    } else {
                        praiseBad = res.data.apprPrd.praiseBad;
                    }
                    for (var i = 0; i < res.data.apprList.length; i++) {
                        appList.push(res.data.apprList[i]);
                    }
                    that.setData({
                        appr: res.data,
                        apprList: appList,
                        praiseGood: praiseGood,
                        praiseMide: praiseMide,
                        praiseBad: praiseBad,
                        hasMore: true,
                        hasOver: false
                    })
                    if (res.data.apprList.length < 20) {
                        if (pageCur == 1) {
                            that.setData({
                                hasMore: false,
                                hasOver: false
                            })
                        } else {
                            that.setData({
                                hasMore: false,
                                hasOver: true
                            })
                        }
                    }
                }

            },
            fail: function () {
                console.log('失败啦');
            },
            complete: function () {
                // complete
            }
        })
    },
    //加载更多
    loadMore: function (e) {
        var that = this;
        pageCur = pageCur + 1;
        that.choiceTap();
    },
    // 超过300时显示返回顶部按钮
    scrollTopFun: function (e) {
        var that = this;
        if (e.detail.scrollTop > 500) {
            that.setData({
                scroll: true
            })
        } else {
            that.setData({
                scroll: false
            })
        }
    },
    //触碰返回顶部按钮回到顶部 
    toTop: function (e) {
        var that = this;
        var top = that.data.scrollTop;
        if (top == 0) {
            top = 1;
        } else {
            top = 0;
        }
        that.setData({
            scrollTop: top
        })
    }
})