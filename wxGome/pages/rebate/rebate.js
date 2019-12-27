var app = getApp();
var appKey = "003/01111";
var scn;
// var userId = '72003792771';//分享接口要用到\
// var userId = '12084350010';
var userId;
var pageNum = 1;
var interList = [];
var isLoad = false;
Page({
  data: {
    height: '',
    currentTab: 2,
    isShow: true,
    interList: {},
    infoNo: true
  },
  fanliUrl: app.fanliUrl + '/v3/ext/rebate/myRebateDetails_2',
  ourHost: app.ourHost,
  goHeader: app.goHeader,
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({ //获取系统信息
      success: function (res) {
        that.setData({
          height: res.windowHeight + 'px'  //窗口高度
        })
      }
    });
    wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
      duration: 300
    })
    scn = app.getScn();
    that.initUserId();
  },
  onShow: function () {
    var that = this;
  },
  onHide: function () {

  },
  /*根据SCN来求userId*/
  initUserId: function () {
    var that = this;
    wx.request({
      url: that.ourHost + '/shareKid',
      data: {
        scn: scn
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': 'SCN=' + scn
      },
      success: function (res) {
        if (res.data.userId) {
          userId = res.data.userId;
        }
        that.getAccount();
      },
      fail: function (res) {

      }
    })
  },
  /*待入账*/
  toInterAccount: function (e) {
    var that = this;
    var current = e.target.dataset.current;
    if (that.data.currentTab != current) {
      pageNum = 1;
      interList = [];
      that.setData({
        currentTab: current,
        interList: interList
      })
      that.getAccount();
    }

  },
  getAccount: function () {
    var that = this;
    isLoad = false;
    var statusType = that.data.currentTab;
    wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
      duration: 200
    })
    wx.request({
      url: that.fanliUrl,
      data: {
        userId: userId,
        statusType: statusType,
        pageNum: pageNum,
        pageSize: 10,
        app: appKey,
        SCN: scn
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': 'SCN=' + scn
      },
      success: function (res) {
        if (res.data.data) {
          isLoad = true;
        }
        if (res.data.data.rebateDetails && res.data.data.rebateDetails.length > 0) {
          var inter = res.data.data.rebateDetails;
          for (var i = 0; i < inter.length; i++) {
            if (inter[i].rebateType == 1) {
              interList.push(inter[i]);
              // interList[i].tips = true;
              var c = interList.length - 1;
              interList[c].amount = Math.round(inter[i].amount) / 100;
              if (inter[i].skuInfo) {
                interList[c].skuInfo.item.mainImage = inter[i].skuInfo.item.mainImage.split(".jpg", 1) + "_200.jpg";
              }
              if (that.data.currentTab == 1) {
                that.getTime(interList[c].rebateTime, c, 1);
              }
              that.getTime(interList[c].purchaseTime, c, 2);
            }

          }

          if (inter.length < 10) {
            that.setData({
              interList: interList,
              isShow: false,
              infoNo: true
            })
          } else {


            if (interList.length == 0) {
              that.setData({
                isShow: true,
                infoNo: false
              })
              that.loadMore();
            } else {
              that.setData({
                interList: interList,
                isShow: true,
                infoNo: true
              })
            }
          }






        } else {
          that.setData({
            isShow: false,
            infoNo: false
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /*获取时间*/
  getTime: function (timmer, i, parameter) {
    var that = this;
    var newDate = new Date();
    newDate.setTime(timmer);
    var Y = newDate.getFullYear()
    var M = newDate.getMonth() + 1;
    var d = newDate.getDate();
    var h = newDate.getHours();
    var m = newDate.getMinutes();
    if (M < 10) {
      M = "0" + M;
    }
    if (d < 10) {
      d = "0" + d;
    }
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    var newTime = Y + '.' + M + '.' + d + ' ' + h + ':' + m;
    if (parameter === 1) {
      interList[i].rebateTime = newTime;
    } else {
      interList[i].purchaseTime = newTime;
    }
  },
  /*加载更多*/
  loadMore: function () {
    var that = this;

    if (that.data.isShow && isLoad) {
      pageNum += 1;
      that.getAccount();
    } else {
      return false;
    }


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})