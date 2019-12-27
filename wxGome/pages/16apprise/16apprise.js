/*
 * 16渠道订单商品评价
 * @since 2018-10-15
 * @author Lilian
 * @产品  周涛
 */
const app = getApp();
let scn;
Page({
  data: {
    height: '', //高
    orderId: '', //订单号
    shippingGroupId: '', //配送单号
    skuIds: '', //,分割的skuid集合
    scores: [], //星级列表
    list: [], //商品列表
    storeStatus: false, //显示门店服务
    logisticStatis: false, //显示物流服务
    installStatis: false, //显示安装服务
    items: '', //商品评论详情

  },
  onReady: function() {
    //获得dialog组件
    this.star = this.selectComponent("#star");
  },

  onLoad: function(options) {
    let that = this;
    let height = wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px'
        })
      },
    })
    if (options.orderId) {
      that.setData({
        orderId: options.orderId,
        shippingGroupId: options.shippingGroupId,
        skuIds: options.skuIds
      })
    }
    scn = app.getScn();
    wx.showLoading({
      title: '加载中...',

    })
    that.initApprise();
  },

  onShow: function() {
    let that = this;
    // scn = app.getScn();

  },
  onHide: function() {
    wx.removeStorageSync('scores');
  },
  // 初始化评价列表
  initApprise: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/sixteenAppraise/getWaitforAppraiseList',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        scn: scn,
        orderId: that.data.orderId,
        shippingGroupId: that.data.shippingGroupId,
        skuIds: that.data.skuIds
      },
      method: 'POST',
      success: function(res) {
        setTimeout(function() {
          wx.hideLoading();
          that.setData({
            loading: true
          })
        }, 10);

        if (res.data.success) {

          let list = res.data.result.commerceItemComments;
          let scores = [];
          if (list.length > 0) {

            for (var item of list) {
              scores.push(5);
              item.pics = [];
              item.show = true;
              item.apprise = '';
              item.appriseNum = 0;
              if (item.storeStatus == 0) {
                that.setData({
                  storeStatus: true
                })
              }
              // 	是否配送服务评价过
              if (item.deliverisAppraise == 'NOTDONE') {
                that.setData({
                  logisticStatis: true
                })
              }
              // 是否安装评价过
              if (item.installisAppraise == 'NOTDONE') {
                that.setData({
                  installStatis: true
                })
              }
            }
            scores = scores.concat(5, 5, 5);
            wx.setStorageSync('scores', that.data.scores);

            that.setData({
              list: list,
              scores: scores
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '没有待评价商品~',
              showCancel: false,
              confirmColor: '#f20c59',
              success: function() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }

        } else {
          wx.showModal({
            title: '温馨提示',
            content: '接口错误，请稍后再试~',
            showCancel: false,
            confirmColor: '#f20c59',
            success: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      fail: function(res) {
        setTimeout(function() {
          wx.hideLoading()
        }, 10);
        that.setData({
          loading: true,
          show: false,
          showDesc: '加载失败，请稍后再试'
        })
      }
    })
  },
  // 评论输入框
  getAppriseText: function(e) {
    let that = this,
      value = e.detail.value,
      list = that.data.list,
      idx = e.target.dataset.idx;
    list[idx].apprise = value;
    list[idx].appriseNum = list[idx].apprise.length;
    that.setData({
      list: list
    })
  },
  // 输入框失去焦点
  getAppriseTextBlur: function(e) {
    let that = this,
      value = e.detail.value,
      list = that.data.list,
      idx = e.target.dataset.idx;
    value = value.replace(/(^\s*)|(\s*$)/g, "");
    list[idx].apprise = value;
    list[idx].appriseNum = list[idx].apprise.length;
    that.setData({
      list: list
    })

  },
  // 点击增加图片
  addPhotoEvnet: function(e) {
    let that = this;
    let list = that.data.list;
    let index = e.currentTarget.dataset.index;
    let pics = list[index].pics;
    wx.chooseImage({
      count: 5, //最多选择的个数
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        const tempFile = res.tempFiles;

        let newPics = [];
        for (var item of tempFile) {
          if (item.size <= 20971520) {
            pics.push(item.path);
            let len = 5 - pics.length;
            if (len >= 0) {
              newPics.push(item.path);
            }

          } else {
            wx.showToast({
              title: '请上传小于5M的图片~',
              icon: 'none'
            })
          }
        }

        if (pics.length >= 5) {
          pics = pics.slice(0, 5);
          list[index].show = false;
        }

        let picsList = new Array();
        if (list[index].picsList && list[index].picsList.length > 0) {
          picsList = list[index].picsList;
        }
        for (var items of newPics) {
          wx.showLoading({
            mask: true,
            title: '上传中',
          })
          wx.uploadFile({
            url: app.ourHost + '/sixteenAppraise/uploadImg',
            filePath: items,
            name: 'pics',
            formData: {
              'scn': scn,
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
              'gome-header': 'wxa.gome.com.cn',
            },
            success: function(ress) {

              if (ress.statusCode == 200) {
                let data = ress.data;
                data = JSON.parse(data);
                if (data.success && data.result.urls[0] != '') {
                  picsList.push(data.result.urls[0]);
                }
                wx.hideLoading();
              } else {
                wx.showToast({
                  title: '上传失败，图片超过20M~',
                  icon: 'none'
                })
                list[index].show = true;
              }

            },

          })

        }

        list[index].picsList = picsList;
        list[index].pics = pics;
        that.setData({
          list: list
        })
        wx.setStorageSync('scores', that.data.scores);

      }
    })

  },
  //点击删除图片 
  delPhotoEvent: function(e) {
    let that = this;
    let list = that.data.list,
      index = e.currentTarget.dataset.index,
      idx = e.currentTarget.dataset.idx;
    list[index].pics.splice(idx, 1);
    list[index].picsList.splice(idx, 1);
    list[index].show = true;

    that.setData({
      list: list
    })

  },
  // 点击预览图片
  previewImgEvent: function(e) {
    let that = this;
    let list = that.data.list,
      index = e.currentTarget.dataset.index,
      url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: list[index].pics,
      current: url,
      success: function(res) {

      }
    })
  },
  // 选择星星
  selectStarEvent: function(e) {
    let that = this;
    let scoreList = wx.getStorageSync('scores');
    let scores = that.data.scores;
    if (scoreList.length > 0) {
      for (var index in scoreList) {
        if (scoreList[index] != null) {
          scores[index] = scoreList[index];
        }

      }
    }
    that.setData({
      scores: scores
    })
  },
  // 提交按钮
  confirmEvent: function() {
    let that = this;
    let scores = that.data.scores;
    let list = that.data.list;
    let deliverScore = ''; //配送评分
    let installScore = ''; //安装评分
    let salerScore = ''; //导购员评分
    let text = true; //评论输入默认不为空
    let items = new Array();
    for (var i in list) {
      items[i] = new Object();
      items[i].summary = list[i].apprise;
      if (list[i].apprise.length == 0 || list[i].apprise.replace(/\s+/g, "").length == 0) {
        text = false;
      }
      items[i].score = scores[i];
      items[i].skuId = list[i].skuId;
      items[i].pics = list[i].picsList;
    }

    if (that.data.storeStatus) {
      deliverScore = scores[(list.length)];
    }
    if (that.data.logisticStatis) {
      installScore = scores[(list.length + 1)];
    }
    if (that.data.installStatis) {
      salerScore = scores[(list.length + 2)];
    }
    /** 如果评论为空，提示输入评价内容。
     * 如果评论不为空，则传参*/
    if (text) {
      let datas = {
        scn: scn,
        orderId: that.data.orderId,
        shippingGroupId: that.data.shippingGroupId,
        items: items,
        deliverScore: deliverScore,
        installScore: installScore,
        salerScore: salerScore,
      };
      that.getConfirmEvent(datas);
    } else {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none',
        duration: 2000
      })
    }

  },
  getConfirmEvent: function(datas) {
    let that = this;


    wx.request({
      url: app.ourHost + '/sixteenAppraise/saveAppraise',
      header: {
        'content-type': 'application/json;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: datas,
      method: 'POST',
      success: function(res) {

        if (res.data.code == '200') {

          wx.showModal({
            title: '温馨提示',
            content: '评论成功~',
            showCancel: false,
            confirmColor: '#f20c59',
            success: function() {
              wx.removeStorageSync('scores');
              wx.navigateBack({
                delta: 1
              })
            }
          })

        } else if (res.data.code == '500') {
          // 全部失败
          wx.showModal({
            title: '温馨提示',
            content: '此商品已评价~',
            showCancel: false,
            confirmColor: '#f20c59',
            success: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          // 部分失败
          wx.showModal({
            title: '温馨提示',
            content: '部分评价失败，请重新评价',
            showCancel: false,
            confirmColor: '#f20c59',
            success: function() {
              wx.removeStorageSync('scores');
              that.initApprise();
            }
          })
        }
      }
    })
  },

})