/**
 * 授权优化需求更改
 * 用户点击我的，未登录显示未登录态
 * @since 2018-07-06
 * @author 杨莉莉
 * @产品  梁艳
 */
var app = getApp();
Page({
  data: {
    height: '',
  },
  onShow: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px'
        })
        wx.setStorageSync("windowHeight", res.windowHeight + 'px');
      }
    });
  },
  // onUnload:function(){
  //   wx.navigateBack({
  //     delta: 2
  //   })
  // },
  getUserInfo: function(e) {
    var that = this;
    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
      wx.navigateBack({
        delta: 1
      })
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
                  wx.setStorageSync("scn", data.data.SCN);
                  wx.setStorageSync('date', Date.now());
                  wx.setStorageSync("memberInfo", {
                    gradeNO: data.data.gradeNO || '',
                    gradeName: data.data.gradeName || '',
                    loginName: data.data.loginName || ''
                  });
                  wx.setStorageSync("detail", e.detail);
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (data.data.code == 105) {
                  wx.setStorageSync("scn", data.data.SCN);
                  wx.setStorageSync("dsessionId", data.data.DSESSIONID);
                  wx.setStorageSync("identifyLevel", data.data.identifyLevel); //控制等级，是否跳过绑定（1直接登录成功，2可以跳过，3不可以）
                  wx.setStorageSync("isShowWarning", data.data.isShowWarning); //是否弹提示框，Y表示弹框，N不弹框
                  wx.navigateTo({
                    url: '../oldUserAccount/oldUserAccount?code=106',
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

                }

              },
              fail: function(data) {
                wx.showToast({
                  title: '授权失败，请稍后再试~',
                  icon: 'none',
                  duration: 2000
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

})