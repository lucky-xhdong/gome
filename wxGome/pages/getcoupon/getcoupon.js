let app = getApp();
const MarkInfoConfig = require('../../common/MarkInfoConfig');
var scn;
let riskAppid = '88065054626c0d3dc918afb75ea026a2';
Page({
  data: {
    coupon: [],
    hasStatus: true,
    noflag: '', //无优惠券
    options: {
      appId: riskAppid,
      style: 'popup'
    },
    captchaShow: false,
    captchaReload: false, // 此参数用于重置验证码
    curId: '',
    curIdx: 0
  },
  ourHost: app.ourHost,
  // gccHost: app.gccHost,
  onShow: function() {
     scn=wx.getStorageSync('scn') || '';
    var that=this;
    if(!scn){
      that.setData({
        hasStatus:false
      })
      // scn = app.getScn();
    }else{
      that.setData({
        hasStatus: true
      })
      that.initEvent();
    }
  },
  initEvent: function() {
    var that = this;
    wx.request({
      url: that.ourHost + '/ticket/query',
      data: {
        "scn": scn
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn'
      },
      success: function(res) {
        var result = res.data.result;
        for (var i = 0; i < result.length; i++) {
          result[i].indexId = i;
          result[i].couponValueNew = Number(result[i].couponValue).toFixed(2);
          result[i].startDateNew = that.timeChange(result[i].startDate);
          result[i].endDateNew = that.timeChange(result[i].endDate);
          //方案当前可领张数
          result[i].isNone = result[i].caseNowLimit == 0 ? true : false;
          result[i].isGetCoupon = result[i].userRemainCount > 0 ? true : false;
          if (result[i].isNone) {
            result[i].useTip = '已抢光';
            result[i].info_box_grey = 'loot-all';
          } else if (result[i].isGetCoupon) {
            result[i].useTip = '立即领取';
            result[i].info_box_grey = '';
          } else {
            result[i].useTip = '立即使用';
            result[i].info_box_grey = '';
          }

        }
        if (result.length == 0) {
          that.setData({
            noflag: true //无优惠券
          });
        }
        that.setData({
          coupon: result //初始化优惠券
        });
      },
      fail: function() {
        that.setData({
          noflag: true //加载失败
        });
        // fail
      },
      complete: function() {}
    });
    new app.WeToast();
  },
  /**
 * @description 获取用户等级信息，用户名，scn标识
 * @method getUserInfo
 * @since 2018-07-11
 * @author 杨莉莉
 */
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {

    } else {
      var rawData = JSON.stringify(e.detail.userInfo);
      wx.login({
        success: function (res) {
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
              success: function (data) {
                wx.setStorageSync("code", res.code);
                wx.setStorageSync("userInfo", e.detail.userInfo);
                if (data.data.code == 200) {
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
                  scn = data.data.SCN;
                  that.setData({
                    hasStatus: true
                  })
                  that.initEvent();
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

                }else{
                  wx.showToast({
                    title: data.data.message,
                    icon: 'none'
                  })
                }

              },
              fail: function (data) {
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
        fail: function (res) {

        }
      });

    }
  },
  /**
   * @description 时间格式转换，<br />
   * @method timeChange
   * @pram time 入参时间格式 2018-03-16 23:59:59
   * @return string 返回时间格式  2018.03.16
   * @since 2018-03-01
   * @author 谢俊梅
   */
  timeChange: function(time) {
    return time.split(' ')[0].replace(/-/g, '.');
  },
  /**
   * @description 跳转链接地址<br />
   * @method hrefLink
   * @since 2018-01-19
   * @author 谢俊梅
   */
  hrefLink: function(e) {
    var that = this,
      isNone = e.currentTarget.dataset.isnone,
      isGetCoupon = e.currentTarget.dataset.isgetcoupon,
      refPromotionId = e.currentTarget.dataset.refpromotionid,
      couponName = e.currentTarget.dataset.couponname,
      curId = e.currentTarget.dataset.id,
      curIdx = e.currentTarget.dataset.index;

    if (!isNone && isGetCoupon) { //如果可领取的，走领取ajax,没有被领光
      this.setData({
        curId: curId,
        curIdx: curIdx
      });
      this.captchaShowReload();
    } else if (!isGetCoupon && !isNone) {
      wx.navigateTo({
        url: '../listBlue/listBlue?data=' + refPromotionId + '&couponName=' + couponName,
      })
    }
  },
  getCoupon: function (token) {

    var that = this;
    var id = that.data.curId;
    var index = that.data.curIdx;
    var scn = app.getScn();
    wx.request({
      url: that.ourHost + '/ticket/acquire',
      data: {
        "scn": scn,
        "id": id,
        "token": token,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn'
      },
      success: function(res) {
        if (res.data.code == 500 && res.data.message == "券都被小伙伴领光啦！下次早点来哦！") {
          that.wetoast.toast({
            title: res.data.message,
            duration: 1000
          });
          var coupon = [];
          coupon = that.data.coupon;
          coupon[index].isNone = true;
          //领券完成后，直接变成立即使用
          coupon[index].isGetCoupon = false;
          coupon[index].useTip = '已抢光';
          coupon[index].info_box_grey = 'loot-all';

          that.setData({
            coupon: coupon
          });
        } else if (res.data.code == 500 && res.data.message == '您已领过该优惠券') {
          that.wetoast.toast({
            title: res.data.message,
            duration: 1000
          });
          var coupon = [];
          coupon = that.data.coupon;
          coupon[index].isNone = false;
          //领券完成后，直接变成立即使用
          coupon[index].isGetCoupon = false;
          coupon[index].useTip = '立即使用';
          coupon[index].info_box_grey = '';
          that.setData({
            coupon: coupon
          });
        } else if (res.data.code == 200) {
          if (res.data.result.userCanTryCount >= 0) {
            that.wetoast.toast({
              // title: res.data.message + "，还可以领" + res.data.result.userRemainCount + "张",
              title: "领券成功",
              duration: 1000
            });
            var coupon = [];
            coupon = that.data.coupon;
            coupon[index].isNone = false;
            //领券完成后，直接变成立即使用
            coupon[index].isGetCoupon = false;
            coupon[index].useTip = '立即使用';
            coupon[index].info_box_grey = '';
            that.setData({
              coupon: coupon
            });
          } else {
            that.wetoast.toast({
              title: "券都被小伙伴领光啦！下次早点来哦！",
              duration: 1000
            });
            var coupon = [];
            coupon = that.data.coupon;
            coupon[index].isNone = true;
            //领券完成后，直接变成立即使用
            coupon[index].isGetCoupon = false;
            coupon[index].useTip = '已抢光';
            coupon[index].info_box_grey = 'loot-all';
            that.setData({
              coupon: coupon
            });
          }
        } else {
          var message = null;
          if (res.data.message == null || res.data.message == '') {
            message = MarkInfoConfig.getCouponErrMsg;
          } else {
            message = res.data.message;
          }
          wx.showModal({
            title: '提示',
            content: message,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                return;
              }
            }
          });
        }
      },
      fail: function() {},
      complete: function() {}
    })
  },

  onPullDownRefresh: function() {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },

  captchaShowReload: function () {
    // captchaShow用来弹出验证码
    this.setData({
      captchaShow: true,
      captchaReload: true
    })
  },

  // 验证码成功回调
  captchaSuccess: function (token) {
    this.setData({
      captchaShow: false
    })
    this.getCoupon(token.detail);
  },

  // 验证码关闭回调
  captchaHide: function () {
    this.setData({
      captchaShow: false
    })
  }


});