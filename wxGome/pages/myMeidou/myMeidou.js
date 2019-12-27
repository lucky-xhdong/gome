var app = getApp();
var ourHost = app.ourHost;
var goHeader = app.goHeader;
var scn;

Page({
    data: {
        meidouNum: '', //用户美豆总量
        detailList: [], //用户美豆履历
        endFlag: false, //是否显示 ‘已到最后一页’
        currentPage: 1, //查询的当前页
        totalPage: 1, //查询的总页数
        noDetails: false, //是否有美豆明细
        showGoTop: false, //回到顶部
        scrollHeight: 0, //设备高度
        scrollTop: 0, //页面滚出高度
    },
    onLoad: function(options) {
        var that = this;
        that.setData({
            meidouNum: options.meidouNum,
        });
        wx.getSystemInfo({
            success(res) {
                let windowHeight = res.windowHeight;
                that.setData({
                    scrollHeight: windowHeight,
                });
            }
        });
    },

    onShow: function() {
        var that = this;
        scn = app.getScn();
        // scn = 'Pc0jlCMLaaglzokkZZHMSy5aa4aDBffCHjTV3svtxH%2BW%2FOoy1frRS7OpSwbnhX4lnjTXrP30tQwRTahUdsh%2FyB0BOwFHkog7lQMZ6CNv8aeSutOJLV7q%2FBoRrGRY4lGf0405148e07e515e78b5f1eb123b6d45c';
        that.checkMeidou();
    },

    loadMore: function(e) { //触底加载
        var that = this;
        if (that.data.currentPage <= that.data.totalPage) {
            that.checkMeidou();
        };
    },

    checkMeidou: function() { //检查美豆数量
        var that = this;
        wx.request({
            url: ourHost + '/userRights/gomedoHstList',
            data: {
                scn: scn,
                currentPage: that.data.currentPage,
                pageSize: 10,
            },
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader,
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    if (that.data.detailList.length == 0 && res.data.buessObj.gomedoHstList.length == 0) {
                        that.setData({
                            noDetails: true,
                            pageBackgroundColor: '#fff',
                        })
                    } else {
                        res.data.buessObj.gomedoHstList.forEach(item => {
                            if (String(item.changeGomedo).charAt(0) == '-') {
                                item.count = 1;
                            } else {
                                item.changeGomedo = '+' + item.changeGomedo
                                item.count = 0
                            }
                        });
                        that.setData({
                            detailList: that.data.detailList.concat(res.data.buessObj.gomedoHstList),
                            currentPage: that.data.currentPage + 1,
                            totalPage: res.data.buessObj.totalPageNum,
                        });
                        if (that.data.currentPage - 1 == that.data.totalPage) {
                            that.setData({
                                endFlag: true,
                            })
                        };
                    }
                };
            },
        })
    },

    backToTop: function(e) { //返回顶部
        this.setData({
            showGoTop: false,
            scrollTop: 0
        })
    },

    goToScroll: function(e) { //监听屏幕滚动  onPageScroll
        let that = this;
        console.log(1);
        if (e.detail.scrollTop > that.data.scrollHeight) {
            that.setData({
                showGoTop: true
            })
        } else {
            that.setData({
                showGoTop: false
            })
        }
    }
});