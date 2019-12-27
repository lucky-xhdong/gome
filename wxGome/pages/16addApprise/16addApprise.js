/*
 * 16渠道订单商品追加评价
 * @since 2018-10-17
 * @author Lilian
 * @产品  周涛
 */
const app = getApp();
let scn;
Page({
  data: {
    height: 0,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/star-light.png',
    selectedSrc: '../../images/star-full.png',
    score: 2,
    appriseId: '', //评论ID
    info: {}, //评论信息
    apprise: '', //评论
    appriseNum: 0, //评论数字
    show: true, //显示上传图片
    pics: [], //商品上传list
    picsList: [], //商品上传list
    protocol: app.protocol
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
    if (options.appriseId) {
      that.setData({
        appriseId: options.appriseId
      })
    }
    scn = app.getScn();
    wx.showLoading({
      title: '加载中...',
    })
    that.initEvent();
  },

  onShow: function() {

  },
  initEvent: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/sixteenAppraise/getAppraiseById',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        scn: scn,
        appraiseId: that.data.appriseId
      },
      method: 'POST',
      success: function(res) {
        setTimeout(function() {
          wx.hideLoading();
          that.setData({
            loading: true
          })
        }, 10);
        if (res.data.code == 200) {
          let info = res.data.result.goodsAppraise;
          that.setData({
            info: info,
            score: info.score,
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '接口异常,请稍后再试~',
            showCancel: false,
            confirmColor: '#f20c59',
            success: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }

      }
    })

  },
  // 选择星星
  selectStar: function(e) {
    let that = this,
      score = e.currentTarget.dataset.score,
      idx = e.currentTarget.dataset.idx;
    let initScore = that.data.info.score;
    if (score >= initScore) {
      that.setData({
        score: score,
      })
    }

  },
  // 评论输入框
  getAppriseText: function(e) {
    let that = this,
      apprise = e.detail.value,
      appriseNum = apprise.length;
    that.setData({
      apprise: apprise,
      appriseNum: appriseNum
    })
  },
  // 输入框失去焦点
  getAppriseTextBlur: function(e) {
    let that = this,
      apprise = e.detail.value,
      appriseNum = apprise.length;
    apprise = apprise.replace(/(^\s*)|(\s*$)/g, "");
    appriseNum = apprise.length;
    that.setData({
      apprise: apprise,
      appriseNum: appriseNum
    })

  },
  // 点击增加图片
  addPhotoEvnet: function(e) {
    let that = this;
    let pics = that.data.pics;
    let index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 5, //最多选择的个数
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFiles = res.tempFiles;
        let newPics = [];
        for (var item of tempFiles) {
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
        }
        let picsList = new Array();
        if (that.data.picsList.length > 0) {
          picsList = that.data.picsList;
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
                if (data.success) {
                  picsList.push(data.result.urls[0]);
                  that.setData({
                    pics: pics,
                    picsList: picsList
                  })
                }
                wx.hideLoading();
              } else {
                wx.showToast({
                  title: '上传失败，图片超过20M~',
                  icon: 'none'
                })
                that.setData({
                  show: true
                })

              }

            }
          })


        }

      }
    })

  },
  // 点击预览图片
  previewImgEvent: function(e) {
    let that = this;
    let pics = that.data.pics,
      types = e.currentTarget.dataset.types,
      url = e.currentTarget.dataset.url;
    let urls = new Array();
    if (types == 0) {
      let info = that.data.info.showPicture.pictures;
      for (var item of info) {
        urls.push(app.protocol + item);
      }
    } else {
      urls = pics;
    }


    wx.previewImage({
      current: url,
      urls: urls,

    })
  },
  // 删除图片
  delPhotoEvent: function(e) {
    let that = this;
    let pics = that.data.pics,
      picsList = that.data.picsList,
      index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    picsList.splice(index, 1);
    that.setData({
      pics: pics,
      picsList: picsList,
      show: true
    })
  },
  // 追加评论确定按钮
  confirmEvent: function() {
    let that = this;
    let info = that.data.info;
    let apprise = that.data.apprise;
    let newApprise = apprise.replace(/\s+/g, "");
    if (apprise.length == 0 || newApprise.length == 0) {
      that.setData({
        apprise: ''
      })
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: app.ourHost + '/sixteenAppraise/addAppraise',
        header: {
          'content-type': 'application/json;charset=utf-8',
          'gome-header': 'wxa.gome.com.cn',
        },
        data: {
          scn: scn,
          appraiseId: that.data.appriseId,
          content: that.data.apprise,
          skuId: that.data.info.skuId,
          orderId: that.data.info.orderId,
          shippingGroupId: that.data.info.shippingGroupId,
          productId: that.data.info.productId,
          shopno: that.data.info.shopno,
          pics: that.data.picsList,
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == '200') {
            wx.showModal({
              title: '温馨提示',
              content: '评论成功~',
              showCancel: false,
              confirmColor: '#f20c59',
              success: function() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            let message = res.data.message;
            if (message == null || message == '') {
              message = '评价失败，请重新评价~';
            }
            wx.showModal({
              title: '温馨提示',
              content: message,
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
          wx.showModal({
            title: '温馨提示',
            content: '系统正忙，请稍后再试~',
            showCancel: false,
            confirmColor: '#f20c59',
            success: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })
    }

  },

})