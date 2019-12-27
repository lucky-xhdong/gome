//登陆引导页
Page({
    data: {
        avatarUrl: '',
        nickName: ''
    },

    onLoad: function (options) {
        var that = this;
      var userInfo = wx.getStorageSync('userInfo');
      that.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      })
    },
    bindConfirm: function () {
        wx.redirectTo({
            url: '../login/login'
        })
    }

})