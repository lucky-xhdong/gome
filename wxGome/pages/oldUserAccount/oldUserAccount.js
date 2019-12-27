/**
 * 老用户绑定手机号
 * @since 2018-08-07
 * @author Lilian
 * @产品  张欠欠
 */
let app = getApp();
let scn;
Page({
  data: {
    height: 0,
    title: '',
    isShowWarning: true, //是否弹提示框，Y表示弹框，N不弹框
    identifyLevel: false, //控制等级，
    showLayer: false, //默认不显示弹层
    phone: '', //手机号
    code: '', //验证码值
    codeTxt: '获取验证码', //验证码提示
    codeIsClick: false,
    codeHide: false, //验证码是否隐藏，true隐藏，false显示
    countdownHide: true, //是否隐藏倒计时按钮，true隐藏，false显示
    phoneClear: false, //清除手机号码
    codeClear: false, //清除验证码
    showInfo: false, //默认收起原因
    countdown: 120, //倒计时时间
    phoneFocus: false
  },
  countdown: 120,
  onLoad: function(options) {
    let that = this;
    let height = wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px'
        })
      },
    })
    if (options.code == 105) {
      wx.setNavigationBarTitle({
        title: '绑定国美账号'
      })
      that.setData({
        title: '请绑定一个国美账号，此手机号可用于登录和找回密码。'
      })

    } else if (options.code == 106) {
      wx.setNavigationBarTitle({
        title: '完善手机号'
      })
      that.setData({
        title: '为了保障您的账号安全，请完善手机号，此手机号可用于登录和找回密码。'
      })
    } else {

    }
  },
  onShow: function() {
    let that = this,
      identifyLevel = wx.getStorageSync('identifyLevel'), //是否跳过绑定（1直接登录成功，2可以跳过，3不可以）
      isShowWarning = wx.getStorageSync('isShowWarning'); //是否弹提示框
    if (identifyLevel == 2 || identifyLevel == 1 ) {
      that.setData({
        identifyLevel: true
      })
    }else{
      that.setData({
        identifyLevel: false
      })
    }
    if (isShowWarning == 'Y') {
      that.setData({
        isShowWarning: true
      })
    }

  },
  //手机号码键盘输入时触发
  bindPhoneInput: function(e) {
    let that = this,
      codeIsClick = false,
      value = e.detail.value,
      len = value.length;

    if (len == 11) {
      codeIsClick = true;
    }
    that.setData({
      phone: value,
      codeIsClick: codeIsClick,
      phoneClear: (len ? true : false)
    })

  },
  //手机号码获取焦点
  bindPhoneFocus: function(e) {
    let that = this,
      len = e.detail.value;
    that.setData({
      phoneClear: (len ? true : false)
    })

  },

  //手机号码失去焦点
  bindPhoneBlur: function(e) {
    let that = this,
      value = e.detail.value,
      len = value.length;
    that.setData({
      phoneClear: (len ? true : false)
    })

  },
  //验证码输入
  bindCodeInput: function(e) {
    let that = this,
      value = e.detail.value,
      len = value.length;
    let phone = that.data.phone;
    if (phone.length == 11 && !/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(phone)) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    } else {
      that.setData({
        code: value,
        codeClear: (len ? true : false)
      })
    }
  },
  //获取焦点
  bindCodeFocus: function(e) {
    let that = this,
      len = e.detail.value;
    that.setData({
      codeClear: (len ? true : false)
    })

  },
  // 清除手机
  bindClearPhone: function() {
    wx.hideKeyboard();
    this.setData({
      phone: '',
      phoneClear: false,
      codeIsClick: true
    })
  },
  //清除验证码
  bindClearCode: function() {
    wx.hideKeyboard();
    console.log(11);
    this.setData({
      code: '',
      codeClear: false
    })
  },
  //验证码失去焦点
  bindCodeBlur: function(e) {
    let that = this,
      value = e.detail.value,
      len = value.length;
    that.setData({
      codeClear: (len ? true : false)
    })

  },
  // 点击获取验证码
  getCodeEvent: function() {
    let that = this;

    if (that.data.codeIsClick) {
      let phone = that.data.phone;
      if (!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(phone)) {
        wx.showToast({
          title: '手机号错误',
          icon: 'none'
        })
      } else {
        wx.request({
          url: app.vipHost + '/identifyLogin/SendSMSOnBind.no',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'gome-header': 'wxa.gome.com.cn',
            'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
          },
          data: {
            mobile: that.data.phone,
            isValidatePhone: 1,
            whereFrom: 'weApp'
          },
          method: 'POST',
          success: function(res) {
            console.log(res)
            if (res.data.isShow == 1) {
              that.setData({
                showLayer: true
              })
            } else {
              if (res.data.code == 3000) {
                that.setData({
                  countdownHide: false
                })
                that.dealCountdown();
              } else if (res.data.code == 403) {
                wx.redirectTo({
                  url: '../loginEmpower/loginEmpower',
                })
              } else if (res.data.code == 1009 || res.data.code == 600 || res.data.code == 1301 || res.data.code == 1300 || res.data.code == 1011 || res.data.code == 1012) {
                wx.showModal({
                  title: '提示',
                  content: res.data.message,
                  cancelText: "更换号码",
                  confirmText: "联系客服",
                  confirmColor: "#F66A6B",
                  success: function(data) {
                    if (data.confirm) {
                      wx.makePhoneCall({
                        phoneNumber: '400-811-3333'
                      })
                    } else if (data.cancel) {
                      console.log('用户点击取消');
                      that.setData({
                        phone: '',
                        code:'',
                        phoneClear: false,
                        codeClear:false,
                        codeTxt: '获取验证码',
                        codeIsClick: false,
                        phoneFocus: true
                      })

                    }
                  },

                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }

            }

          },
          fail: function(res) {
            wx.showToast({
              title: '获取验证码失败，请稍后再试',
              icon: 'none'
            })
          }
        })

      }

    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })

    }

  },
  //处理倒计时
  dealCountdown: function() {
    let that = this;

    if (that.countdown == 0) {
      that.resetCountdown();
      return false;
    } else {
      that.setData({
        countdown: that.countdown
      })
      that.countdown--;
    }

    setTimeout(function() {
      that.dealCountdown();
    }, 1000);
  },

  //重置倒计时
  resetCountdown: function() {
    let that = this;
    that.countdown = 120;
    that.setData({
      countdown: that.countdown,
      codeHide: false,
      codeTxt: '重新获取',
      countdownHide: true
    })
  },
  //验证码倒计时

  /**
   * 关闭弹窗
   */
  closeLayer: function() {
    let that = this;
    that.setData({
      showLayer: false
    })
  },
  // 查看原因
  closeInfoEvent: function() {
    let that = this;
    that.setData({
      showInfo: !that.data.showInfo
    })
  },
  //继续绑定
  getBindPhone: function() {
    let that = this;
    that.setData({
      showLayer: false
    })
    let phone = that.data.phone;
    if (!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(phone)) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })

    } else {
      wx.request({
        url: app.vipHost + '/identifyLogin/SendSMSOnBind.no',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': 'wxa.gome.com.cn',
          'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
        },
        data: {
          mobile: that.data.phone,
          whereFrom: 'weApp'
        },
        method: 'POST',
        success: function(res) {
          console.log(res)
          if (res.data.code == 3000) {
            that.setData({
              countdownHide: false
            })
            that.dealCountdown();
          } else if (res.data.code == 403) {
            wx.navigateTo({
              url: '../loginEmpower/loginEmpower',
            })
          } else if (res.data.code == 1009 || res.data.code == 600 || res.data.code == 1301 || res.data.code == 1300 || res.data.code == 1011 || res.data.code == 1012) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              cancelText: "更换号码",
              confirmText: "联系客服",
              confirmColor: "#F66A6B",
              success: function(data) {
                if (data.confirm) {
                  wx.makePhoneCall({
                    phoneNumber: '400-811-3333'
                  })
                } else if (data.cancel) {
                  console.log('用户点击取消');
                  that.setData({
                    phone: '',
                    code: '',
                    phoneClear: false,
                    codeClear: false,
                    codeTxt: '获取验证码',
                    codeIsClick: false,
                    phoneFocus: true
                  })
                }
              },

            })
          } else {
            wx.showToast({
              title: '获取验证码失败，请稍后再试',
              icon: 'none'
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '获取验证码失败，请稍后再试',
            icon: 'none'
          })
        }
      })

    }

  },
  // 跳过
  skipEvnet: function() {
    let that = this;
    wx.request({
      url: app.vipHost + '/stepoverBind.no',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
        'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
      },
      data: {
        whereFrom: 'weApp'
      },
      method: 'POST',
      success: function(res) {
        console.log(res);
        if (res.data.code == 200) {
          wx.setStorageSync("scn", res.data.SCN);
          wx.setStorageSync('date', Date.now());
          wx.setStorageSync("memberInfo", {
            gradeNO: res.data.gradeNO || '',
            gradeName: res.data.gradeName || '',
            loginName: res.data.loginName || ''
          });
          wx.navigateBack({
            delta: 2
          })
        } else if (res.data.code == 403) {
          wx.redirectTo({
            url: '../loginEmpower/loginEmpower',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail: function(res) {

      }

    })
  },
  // 拨打电话
  callPhone: function(e) {
    console.log(e);
    let phone = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  //完成
  doneEvent: function() {
    let that = this;
    if (!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(that.data.phone) || that.data.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    } else if (that.data.code.length != 6) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else {
      wx.request({
        url: app.vipHost + '/identifyLogin/activeMobile.no',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': 'wxa.gome.com.cn',
          'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
        },
        data: {
          mobile: that.data.phone,
          msgCode: that.data.code,
          whereFrom: 'weApp'
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 200) {
            wx.setStorageSync("scn", res.data.SCN);
            wx.setStorageSync('date', Date.now());
            wx.setStorageSync("memberInfo", {
              gradeNO: res.data.gradeNO || '',
              gradeName: res.data.gradeName || '',
              loginName: res.data.loginName || ''
            });
            wx.navigateBack({
              delta: 2
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        },
        fail: function(res) {

        }

      })
    }


  },

})