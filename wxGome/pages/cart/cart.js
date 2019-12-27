//cart.js
const Promise = require('../../lib/es6-promise').Promise;
const co = require('../../lib/co/we-index');
const regeneratorRuntime = require("../../lib/regenerator-runtime/runtime");

const config = require('../../common/config');
const util = require("./js/util");
const control = require("./js/cartController");

//获取应用实例
const app = getApp();

// 创建页面实例对象
Page({
  data: {
    hasStatus: true,
    height: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px'
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    "use strict";
    const that = this;
    var scn = wx.getStorageSync('scn') || '';
    if (!scn) {
      that.setData({
        hasStatus: false
      })
    } else {
      that.setData({
        hasStatus: true
      })
      control.getLoadCart(that);
      that.clearTimeOut();
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    "use strict";
    let that = this;
    that.clearTimeOut();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},
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
                  wx.setStorageSync("scn", data.data.SCN);
                  wx.setStorageSync('date', Date.now());
                  wx.setStorageSync("memberInfo", {
                    gradeNO: data.data.gradeNO || '',
                    gradeName: data.data.gradeName || '',
                    loginName: data.data.loginName || ''
                  });
                  wx.setStorageSync("detail", e.detail);
                  that.setData({
                    hasStatus: true
                  })
                  control.getLoadCart(that);
                  that.clearTimeOut();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    /*const that = this;
     control.getLoadCart(that);*/
  },

  /**
   * 将预约抢购前的清除定时器函数单独封装，在所有需要手动操作的地方调用，为避免页面闪烁--大写加粗的坑！！！
   */
  clearTimeOut() {
    "use strict";
    if (this.data && this.data.singleProductObj) {
      const objs = this.data.singleProductObj;
      for (let attr in objs) {
        objs[attr].clearTime && clearTimeout(objs[attr].clearTime);
      }
    }
  },
  /*******************************event start 页面绑定事件******************************/
  /**
   * 修改商品数量
   *    warn：套装数量修改也是此入口，只是在模板中将id值传对就ok，使用同一接口
   * @param e
   *        e.detail.value 表示数量
   *        e.target.dataset.id 表示id
   */
  modifyProductNum(e) {
    let that = this;
    that.clearTimeOut();
    const req = {
      pcount: parseInt(e.detail.value) + 1 || 1,
      cid: e.target.dataset.id
    };
    control.productEvent.modifyProductNum(req);
  },

  /**
   *
   * @param e
   */
  checkProduct(e) {
    let that = this;
    that.clearTimeOut();
    const id = e.currentTarget.dataset.id;
    const is = e.currentTarget.dataset.isSuit; //是否是套装
    const attr = e.currentTarget.dataset.attr; //参数
    if (is) {
      return;
    }
    if (!id) {
      util.log(new Error('id 为空'));
      return;
    }
    if (attr) {
      if (attr.notCheck) {
        return;
      }
    }

    const req = {
      id: id,
      isChecked: !e.currentTarget.dataset.checked //取反
    };
    control.productEvent.checkProduct(req);
  },
  checkCart(e) {
    let that = this;
    that.clearTimeOut();
    const id = e.currentTarget.dataset.id;
    const isNot = e.currentTarget.dataset.not;
    if (isNot) {
      return;
    }
    if (!id) {
      util.log(new Error('id 为空'));
      return;
    }
    const req = {
      id: id,
      isChecked: !e.currentTarget.dataset.checked //取反
    };
    control.cartEvent.checkCart(req);
  },
  checkAllCarts(e) {
    let that = this;
    that.clearTimeOut();
    //        const isNot = e.currentTarget.dataset.not;
    //        if(isNot){return;}
    const req = {
      isChecked: !e.currentTarget.dataset.checked //取反
    };
    control.footerEvent.checkAllCarts(req);
  },

  /**
   * 去结算
   * @param e
   */
  submitCarts(e) {
    let that = this;
    that.clearTimeOut();
    const count = e.currentTarget.dataset.count;
    if (count < 1) {
      /* wx.showToast({
           title: '请选择商品',
           icon : "loading"
       });*/
      return;
    }
    control.footerEvent.submitCarts();
  },

  deleteProduct(e) {
    let that = this;
    that.clearTimeOut();
    const id = e.currentTarget.dataset.id;
    const req = {
      'id': id
    };
    control.productEvent.deleteProduct(req);

  },
  /*******************************event end******************************/

  pickerOnGroupHead(e) {
    let that = this;
    that.clearTimeOut();
    if (!e.currentTarget.dataset.values || !e.currentTarget.dataset.values[e.detail.value]) {
      console.error('pickerOnGroupHead() 数据有问题');
      return;
    }
    const req = {
      'shopno': e.currentTarget.dataset.shopId,
      'prid': e.currentTarget.dataset.values[e.detail.value].proId
    };
    control.groupEvent.pickerOnGroupHead(req);
  },

});