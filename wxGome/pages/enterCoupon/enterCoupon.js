/**
   * 线下入场券-不涉及后端，用户输入姓名、电话，保存活动图到用户本地相册。
   * author: Lily
   * 2018-03-20
   */
Page({
  data: {
    height: '',
    width: '',
    name: '',
    phone: '',
    num: '',
    nameFocus: true,//姓名框获得焦点
    phoneFocus: false,//电话框获得焦点
    numFocus: false,//推荐人编号框获得焦点
    cardId: '',//入场券号
    status: true,//领取状态为true,保存为false
    shareUrl:'',
    photoUrl: '',
    canvaShow: false//是否显示canvas
   

  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight + 'px',
          width: res.windowWidth
        })
      },
    })
  },
  onShow: function () {
    var that = this;
    var photoUrl=wx.getStorageSync('userInfo').avatarUrl;
    that.setData({
      photoUrl: photoUrl
    })
    that.getShareCanvasEvent();
  },
  //输入名字
  nameInputEvent: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  //点击名字完成
  nameConfirmEvent: function () {
    var that = this;
    that.setData({
      nameFocus: false,
      phoneFocus: true
    })
  },
  //输入电话
  phoneInputEvent: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  //点击电话完成
  phoneConfirmEvent: function () {
    var that = this;
    that.setData({
      phoneFocus: false,
      numFocus: true
    })
  },
  //输入推荐人编号
  numInputEvent: function (e) {
    var that = this;
    that.setData({
      num: e.detail.value
    })
  },
  //领取入场券 
  submitEvent: function () {
    var that = this;
    if (that.data.name.length == 0) {
      that.showTitle('姓名不能为空哦~');
    } else if (that.data.name.length > 0 && that.data.name.length < 2) {
      that.showTitle('姓名不正确，请重新输入~');
    } else {
      if (that.data.phone.length == 0) {
        that.showTitle('电话号码不能为空哦~');
      } else if (that.data.phone.length != 11) {
        that.showTitle('电话号码输入错误哦~');
      } else {
        if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) {
          that.showTitle('电话号码输入错误哦~');
        } else {
          if (that.data.num.length > 0 && that.data.num.length < 8) {
            that.showTitle('请输入正确的推荐人编号~');
          } else {
            var data = Date.parse(new Date());
            var datas = String(data).slice(2,9);
            that.setData({
              status: false,
              cardId: 'X9999' + datas
            })
            that.getCanvasEvent();
          }
        }

      }

    }
  },
  showTitle: function (tit) {
    wx.showToast({
      title: tit,
      icon: 'none',
      duration: 2000
    })
  },
  // 生成canvas
  getCanvasEvent: function () {
    var that = this;
    var width = that.data.width;
    const ctx = wx.createCanvasContext('myCanvas');
    ctx.setFillStyle('rgb(255, 198, 0)');
    ctx.fillRect(0, 0, width, 480);
    ctx.drawImage('../../images/entrance-top.png', 0, 0, width, 265);
    ctx.setFillStyle('rgb(222, 68, 0)');
    ctx.drawImage('../../images/entrance-tit2.png', 40, 270, 110, 20);
    ctx.setFontSize(18);
    ctx.setTextBaseline('middle');
    ctx.fillText(that.data.cardId, 160, 280);
    ctx.setFillStyle('rgb(104, 81, 0)');
    ctx.setFontSize(14);
    ctx.fillText('姓名：' + that.data.name, 45, 310);
    ctx.fillText('电话：' + that.data.phone, 160, 310);
    if (that.data.num.length == 8) {
      ctx.fillText('推荐人编号：' + that.data.num, 45, 330);
    }
    ctx.drawImage('../../images/entrance-btn3.png', 0, 350, width, 90);
    ctx.draw();
    that.setData({
      canvaShow: true
    })

  },

  //点击取消展示图片
  cancelCanvas: function () {
    var that = this;
    that.setData({
      canvaShow: false
    })
  },
  saveEvent: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.width,
      height: 480,
      canvasId: 'myCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              canvaShow:false
            })
          }
        })
      }
    })
  },
  getShareCanvasEvent:function(){
    var that = this;
    var width = that.data.width;
    console.log(that.data.photoUrl);
    const ctx = wx.createCanvasContext('share');
    ctx.setFillStyle('rgb(255, 255, 255)');
    ctx.fillRect(0, 0, width, 480);
    ctx.drawImage('../../images/1.jpg', 0, 0, width, 265);
    ctx.setFillStyle('rgb(222, 68, 0)');
    ctx.drawImage(that.data.photoUrl, 0, 0, width, 100);
    ctx.draw();
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.width,
      height: 750,
      canvasId: 'share',
      success: function (res) {
        console.log(res.tempFilePath, 1)
        that.setData({
          shareUrl: res.tempFilePath
        })
      },
      fail:function(res){
        console.log(2,res)
      }
    })
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
   
    that.getShareCanvasEvent();

    return {
      title: '【3.31国美门店内购会入场券】爆款低价，不止五折',
      path: 'pages/enterCoupon/enterCoupon',
      imageUrl: that.data.shareUrl
    }

  }
})