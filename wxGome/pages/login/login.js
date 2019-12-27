//登陆
let app = getApp();
Page({
  data: {
    phoneCursor: 2,
    showPhoneError: true, //是否展示手机号错误提示，true隐藏，false显示
    codeIsClick: true, //验证码是否可以点击，true表示不能点击，false表示能点击
    codeHide: false, //验证码是否隐藏，true隐藏，false显示
    codeError: '', //验证码错误提示内容，如果内容为空则隐藏
    countdownHide: true, //是否隐藏倒计时按钮，true隐藏，false显示
    countdown: 120, //倒计时时间
    confirmIsClick: true, //完成按钮是否可以点击，true表示不能点击，false表示能点击
    confirmMask: true, //true隐藏，false显示
    relationCode: '', //主要用于判断是去关联已有用户，还是关联新用户
    relationNewUserCode: 1001, //关联新用户的code
    passwordError: '', //密码错误图提示内容 ，如果内容为空则隐藏
    phone: '', //手机号
    code: '', //验证码值
    password: '', //密码
    phoneClear: false,
    codeClear: false,
    phoneFocus: false,//获取焦点
    passwordClear: false,
    codeTxt: '获取验证码'
  },

  countdown: 120, // 倒计时,

  onLoad: function(options) {},

  //手机输入input事件
  bindPhoneInput: function(ev) {

    let val = ev.detail.value,
      codeIsClick = true,
      len = val.length;


    //手机号输入11位时让验证码可以点击
    if (len == 11) {
      codeIsClick = false;
    }

    this.setData({
      codeIsClick: codeIsClick,
      phone: val,
      codeError: false,
      phoneClear: (len ? true : false)
    })
    this.dealConfirmIsClick();

  },

  //手机号获取焦点事件，让手机号错误提示隐藏
  bindPhoneFocus: function(ev) {
    let len = ev.detail.value;
    this.setData({
      showPhoneError: true,
      phoneClear: (len ? true : false)
    })
  },

  //手机号失去焦点事件
  bindPhoneBlur: function(ev) {
    this.setData({
      phoneClear: false,
      codeError: false
    })
  },

  bindClearPhone: function() {
    wx.hideKeyboard();
    this.setData({
      phone: '',
      phoneClear: false,
      codeIsClick: true
    })

    this.dealConfirmIsClick();
  },

  //验证码输入input事件
  bindCodeInput: function(ev) {
    let val = ev.detail.value,
      len = val.length;
    this.setData({
      code: val,
      codeClear: (len ? true : false)
    })

    this.dealConfirmIsClick();
  },

  //验证码获取焦点事件
  bindCodeFocus: function(ev) {
    let len = ev.detail.value;
    this.setData({
      codeError: '',
      codeClear: (len ? true : false)
    })
  },

  //验证码失去焦点事件
  bindCodeBlur: function(ev) {
    this.setData({
      codeClear: false
    })
  },

  bindClearCode: function() {
    wx.hideKeyboard();
    this.setData({
      code: '',
      codeClear: false
    })
    this.dealConfirmIsClick();
  },

  //获取验证码，并校验手机号
  bindGetCode: function() {
    let that = this,
      phone = this.data.phone,
      isChecked = app.checkPhone(phone),
      snsUserId = wx.getStorageSync("openId");

    if (isChecked) { //为真表示手机号前端校验不通过
      that.setData({
        showPhoneError: false
      })
    } else {

      //请求验证码
      wx.request({
        url: app.vipHost + '/relation/getRelationPhoneCode.no',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': 'wxa.gome.com.cn',
          'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
        },
        data: {
          phoneNum: phone,
          snsUserId: snsUserId,
          whereFrom: 'weApp'
        },
        method: 'POST',
        success: function(data) {
          let code = data.data.code,
            str = '';

          /*返回2000的时候点下面的完成请求的是relationPhoneBind.no，返回1001的时候，展示出设置密码的选项，此时点击下方完成请求的是relationPhoneReg.no*/

          /*2004,"系统忙请刷新后重试" ——请求非法
          1001,"用户不存在" —— 需要展示设置密码
          2000,"成功" —— 发送成功
          2001,"短信发送失败"
          1002,"账号冲突 "
          0000,"系统内部异常"*/

          that.setData({
            relationCode: code
          })

          
          if (code != 2000 && code != that.data.relationNewUserCode) {
            if (code ==1009 || code == 600 || code == 1301 || code == 1300 || code == 1012 || code==1013) {
              wx.showModal({
                title: '提示',
                content: data.data.message,
                cancelText: "更换号码",
                confirmText: "联系客服",
                confirmColor:"#F66A6B",
                success: function (res) {
                  if (res.confirm) {
                    wx.makePhoneCall({
                      phoneNumber: '400-811-3333'
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
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
              str = data.data.message;
              that.setData({
                codeError: str
              })

            }

          }else{
            //展示倒计时，隐藏验证码，隐藏验证码错误提示
            that.setData({
              showPhoneError: true,
              codeHide: true,
              countdownHide: false,
              codeError: ''
            })
            that.dealConfirmIsClick();
          }
        },
        fail: function() {}
      })

      //倒计时
      that.dealCountdown();
    }
  },

  //密码获取焦点事件，让密码错误提示隐藏
  bindPasswordFocus: function(ev) {
    let len = ev.detail.value;
    this.setData({
      passwordError: '',
      passwordClear: (len ? true : false)
    })
  },

  //密码输入input事件
  bindPasswordInput: function(ev) {
    let val = ev.detail.value,
      len = val.length;
    this.setData({
      password: val,
      passwordClear: (len ? true : false)
    })
    this.dealConfirmIsClick();
  },

  //密码失去焦点事件
  bindPasswordBlur: function(ev) {
    this.checkPassword();
    this.setData({
      passwordClear: false
    })
  },

  bindClearPassword: function() {
    wx.hideKeyboard();
    this.setData({
      password: '',
      passwordClear: false
    })
    this.dealConfirmIsClick();
  },

  //完成事件
  bindConfirm: function(e) {
    let that = this,
      phone = this.data.phone,
      code = this.data.code,
      password = this.data.password,
      isChecked = app.checkPhone(phone),
      snsUserId = wx.getStorageSync("openId"),
      url = '/relation/relationPhoneBind.no',
      param = {
        phoneNum: phone,
        msgCode: code,
        snsUserId: snsUserId,
        whereFrom: 'weApp'
      };
    if (isChecked) { //为真表示手机号前端校验不通过
      that.setData({
        showPhoneError: false
      })

      return false;
    }


    //需要校验密码
    if (that.data.relationCode == that.data.relationNewUserCode) {
      url = '/relation/relationPhoneReg.no';
      param.pwd = password;

      if (that.checkPassword()) {
        return false;
      }
    }
    // return false;

    // let userInfo = JSON.stringify(e.detail.userInfo),
    let userInfo = wx.getStorageSync('userInfo'),
      nickName = userInfo.nickName;
    param.snsUserName = nickName;

    that.setData({
      confirmMask: false
    })
    wx.request({
      url: app.vipHost + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
        'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
      },
      data: param,
      method: 'POST',
      success: function(data) {
        let code = data.data.code,
          extParams = data.data.extParams,
          str = '';
        that.setData({
          confirmMask: true
        })


        let loginBackUrl = wx.getStorageSync('loginBackUrl');


        if (code == 2000) { //问后端要scn

          //scn存入cookie
          if (extParams && extParams.SCN) {
            let scn = extParams.SCN;
            wx.setStorageSync("scn", scn);
            app.scn = scn;
            wx.setStorageSync("memberInfo", {
              gradeNO: extParams.gradeNO || '',
              gradeName: extParams.gradeName || '',
              loginName: extParams.loginName || ''
            });

            //跳转
            let re = /pages\/index\/index|pages\/profile\/profile|pages\/cart\/cart|pages\/shopList\/shopList/;
            if (re.test(loginBackUrl)) {
              wx.switchTab({
                url: loginBackUrl
              })
            } else {
              wx.reLaunch({
                url: loginBackUrl
              })
            }

          }
        } else {
          if (code == 1003) {
            str = '关联失败，请重试';
          } else if (code == 1004) {
            str = '您的密码安全性较低，请重新设置';
          } else if (code == 1005) {
            str = '很抱歉，注册失败，请重试';
          } else if (code == 1006) {
            str = '您已提交，请稍后';
          } else if (code == 2003) {
            str = '您输入的验证码有误，请重新输入';
            that.setData({
              code: ''
            })
            that.dealConfirmIsClick();
          } else if (code == 2004) {
            str = '系统忙，请稍后再试';
          } else {
            str = '系统异常';
          }
          wx.showToast({
            title: str,
            icon: 'none',
            mask: true,
            duration: 2000
          })
        }
      },
      fail: function() {
        that.setData({
          confirmMask: true
        })
      }
    })

  },

  //处理倒计时
  dealCountdown: function() {
    let that = this;

    if (this.countdown == 0) {
      this.resetCountdown();
      return false;
    } else {
      this.setData({
        countdown: this.countdown
      })
      this.countdown--;
    }

    setTimeout(function() {
      that.dealCountdown();
    }, 1000);
  },

  //重置倒计时
  resetCountdown: function() {
    this.countdown = 120;
    this.setData({
      countdown: this.countdown,
      codeHide: false,
      codeTxt: '重新获取',
      countdownHide: true
    })
  },

  //完成按钮是否可点击
  dealConfirmIsClick: function() {
    let re = /^\d+$/g,
      phoneLen = this.data.phone.length,
      checkedCode = !re.test(this.data.code),
      passwordLen = this.data.password.length,
      confirmIsClick = true,
      relationCode = this.data.relationCode,
      relationNewUserCode = this.data.relationNewUserCode;
    if (phoneLen == 11 && !checkedCode) {
      confirmIsClick = false;
    }

    if (!confirmIsClick) { //手机和短信校验不通过

      if (relationCode == 2000 || relationCode == relationNewUserCode) {
        confirmIsClick = false;
      } else {
        confirmIsClick = true;
      }
      if (relationCode == relationNewUserCode) {

        confirmIsClick = (passwordLen < 6 ? true : false);
      }
    }

    this.setData({
      confirmIsClick: confirmIsClick
    })
  },

  //密码校验
  checkPassword: function() {
    let password = this.data.password,
      error = '';

    if (!password) {
      error = '不能为空';
      this.setData({
        passwordError: error
      })
      return true;
    }
    if (!password.match('.{6,20}')) {
      error = '长度应为6-20个字符';
      this.setData({
        passwordError: error
      })
      return true;
    }
    if (/^(.)\1+$/.test(password)) {
      error = '不能为同一字符';
      this.setData({
        passwordError: error
      })
      return true;
    }

    if (password.match('^[0-9]{1,}$')) {
      error = '不能全为数字';
      this.setData({
        passwordError: error
      })
      return true;
    }

    if (!password.match('[A-Za-z0-9~!@#$%^&*()_+\\-=\\[\\];\',\\./\\\\]+') || password.match('[A-Za-z0-9~!@#$%^&*()_+\\-=\\[\\];\',\\./\\\\]+')[0].length < password.length) {
      error = '非法字符，请使用字母加数字或符号的组合，6-20个字符';
      this.setData({
        passwordError: error
      })
      return true;
    }

    return false; //校验通过
  }


})