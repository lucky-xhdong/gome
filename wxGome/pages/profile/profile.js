/**
 * 授权优化需求更改
 * 用户点击我的，未登录显示未登录态
 * @since 2018-07-11
 * @author 杨莉莉
 * @产品  梁艳
 */

var app = getApp();
var scn;
Page({
  data: {
    userSrc: "", //用户头像地址
    userName: "", //用户微信昵称
    userId: "", //用户编号
    grade: "", //用户等级
    totalCouponCount: 0, //优惠券数量
    hasStatus: true, //是否有数据
    isPay: false, //是否是付费会员
    payVersion: '', //会员版本
    meidouNum: '', //剩余美豆余额
    memberHour: false, //客服时间
    status: '', //会员状态
    orderNameArry: [{
      icon: "../../images/1.png",
      title: "全部订单",
      number: 0
    }, {
      icon: "../../images/2.png",
      title: "待付款",
      number: 0
    }, {
      icon: "../../images/3.png",
      title: "待收货",
      number: 0
    }]
  },
  onLoad: function(options) {
    // scn = app.getScn();
  },
  onShow: function() {
    var that = this;
    scn = wx.getStorageSync('scn') || '';
    if (!scn) {
      that.setData({
        hasStatus: false
      })
    } else {
      var userInfo = wx.getStorageSync('userInfo');
      var memberInfo = wx.getStorageSync('memberInfo');
      that.setData({
        userName: userInfo.nickName || '',
        userSrc: userInfo.avatarUrl || '',
        userId: memberInfo.loginName,
        grade: memberInfo.gradeName,
        hasStatus: true
      });
      that.getStatusNumber();
      that.getCouponNumber();
      that.getMemberInfo(); //获取付费会员信息
      that.getMeidouNum(); //获取用户美豆数量
    };
  },

  /**
   * @description 获取用户等级信息，用户名，scn标识
   * @method getUserInfo
   * @since 2018-07-11
   * @author 杨莉莉
   */
  getUserInfo: function(e) {
    var that = this;
    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {

    } else {
      var rawData = JSON.stringify(e.detail.userInfo);
      wx.login({
        success: function(res) {
          if (res.code) {
            wx.request({
              url: app.vipHost + '/quicklogin/weAppLogin.no',
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
              data: {
                userInfo: rawData,
                rawData: e.detail.rawData,
                signature: e.detail.signature,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                code: res.code
              },
              method: 'POST',
              success: function(data) {
                wx.setStorageSync("code", res.code);
                wx.setStorageSync("userInfo", e.detail.userInfo);
                if (data.data.code == 200) {
                  scn = data.data.SCN;
                  wx.setStorageSync("scn", data.data.SCN);
                  wx.setStorageSync('date', Date.now());
                  wx.setStorageSync("memberInfo", {
                    gradeNO: data.data.gradeNO || '',
                    gradeName: data.data.gradeName || '',
                    loginName: data.data.loginName || ''
                  });
                  wx.setStorageSync("detail", e.detail);
                  that.setData({
                    userName: e.detail.userInfo.nickName || '',
                    userSrc: e.detail.userInfo.avatarUrl || '',
                    userId: data.data.loginName || '',
                    grade: data.data.gradeName || '',
                    hasStatus: true
                  });
                  that.getStatusNumber();
                  that.getCouponNumber();
                  that.getMemberInfo(); //获取付费会员信息
                  that.getMeidouNum(); //获取用户美豆数量
                } else if (data.data.code == 105) {
                  wx.setStorageSync("scn", data.data.SCN);
                  wx.setStorageSync("dsessionId", data.data.DSESSIONID);
                  wx.setStorageSync("identifyLevel", data.data.identifyLevel); //控制等级，是否跳过绑定（1直接登录成功，2可以跳过，3不可以）
                  wx.setStorageSync("isShowWarning", data.data.isShowWarning); //是否弹提示框，Y表示弹框，N不弹框
                  wx.navigateTo({
                    url: '../oldUserAccount/oldUserAccount?code=105',
                  })

                } else if (data.data.code == 106) {
                  wx.setStorageSync("scn", data.data.SCN);
                  wx.setStorageSync("dsessionId", data.data.DSESSIONID);
                  wx.setStorageSync("identifyLevel", data.data.identifyLevel); //控制等级，是否跳过绑定（1直接登录成功，2可以跳过，3不可以）
                  wx.setStorageSync("isShowWarning", data.data.isShowWarning); //是否弹提示框，Y表示弹框，N不弹框
                  wx.navigateTo({
                    url: '../oldUserAccount/oldUserAccount?code=106',
                  })
                } else if (data.data.code == 6001) { //表示新用户
                  wx.setStorageSync("openId", data.data.snsUserId);
                  wx.setStorageSync("dsessionId", data.data.DSESSIONID);
                  app.getSkipLoginUrl();
                  wx.reLaunch({
                    url: '/pages/accountGuide/accountGuide'
                  })

                } else {
                  wx.showToast({
                    title: data.data.message,
                    icon: 'none'
                  })
                }

              },

              fail: function(data) {
                wx.showToast({
                  title: data.data.message,
                  icon: 'none'
                })
              }
            });

          } else {
            console.log('登录失败！' + res.errMsg)
          }

        },
        fail: function(res) {

        }
      });

    }
  },
  /**
   * @description 获取各订单数量<br />
   * @method getStatusNumber
   * @param {object} app 表示全局接口app，有对应的数据
   * @param {object} app.ourHost 表示4344域名
   * @since 2017-02-09
   * @author 谢俊梅
   */
  getStatusNumber: function() {
    var _this = this;
    wx.request({
      url: app.ourHost + '/order/summary',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn'
      },
      data: {
        scn: scn
      },
      method: 'POST',
      success: function(data) {
        if (data.statusCode == 200) {
          if (data.data.result.orderremindinfo) {
            _this.setData({
              orderNameArry: [{
                icon: "../../images/1.png",
                title: "全部订单",
                number: 0
              }, {
                icon: "../../images/2.png",
                title: "待付款",
                number: data.data.result.orderremindinfo.pendingPayOrders
              }, {
                icon: "../../images/3.png",
                title: "待收货",
                number: data.data.result.orderremindinfo.pendingConfirmOrders
              }]
            });
          }
        }
      }
    });
  },
  /**
   * @description 获取待使用优惠券数量<br />
   * @method getCouponNumber
   * @param {object} app 表示全局接口app，有对应的数据
   * @param {object} app.ourHost 表示4344域名
   * @since 2017-02-09
   * @author 谢俊梅
   */
  getCouponNumber: function() {
    var _this = this;
    wx.request({
      url: app.ourHost + '/ticket/summary',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn'
      },
      data: {
        scn: scn,
        t: 1
      },
      method: 'POST',
      success: function(data) {
        if (data.statusCode == 200) {
          var resultList = data.data.buessObj.result;
          var number = 0;
          for (var i in resultList) {
            if (i != 'totalCouponCount' && i != 'oneWeek') {
              number += Number(resultList[i]);
            }
          }
          _this.setData({
            totalCouponCount: number
          });
        }
      }
    });
  },

  //获取付费会员信息
  getMemberInfo: function() {
    var that = this;
    wx.request({
      url: app.ourHost + '/userRights/query',
      data: {
        scn: scn,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': app.goHeader,
      },
      success: function(res) {
        if (res.data.code == 200) {

          if (res.data.buessObj.isPay) {
            that.setData({
              isPay: true,
              payVersion: res.data.buessObj.payVersion,
              status: res.data.buessObj.status,
            });
            that.getMemberRight();
          };
        }
      },
    })
  },

  //查看会员是否享有权益
  getMemberRight: function() {
    var that = this;
    wx.request({
      url: app.ourHost + '/userRights/queryRight',
      data: {
        scn: scn,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': app.goHeader,
      },
      success: function(res) {
        if (res.data.code == 200) {
          if (res.data.buessObj.isEnjoy) {
            that.setData({
              memberHour: true,
            })
          }
        }
      },
    })
  },

  //获取美豆余额
  getMeidouNum: function() {
    var that = this;
    wx.request({ //请求美豆余额
      url: app.ourHost + '/userRights/gomedoInfo',
      data: {
        scn: scn,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': app.goHeader,
      },
      success: function(res) {
        if (res.statusCode == 200) {
          that.setData({
            meidouNum: res.data.result.usableGomedoText,
          })
        }
      },
    });
  },

  // 拨打电话
  callPhone: function() {
    let phone = '400-811-3333';
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
});