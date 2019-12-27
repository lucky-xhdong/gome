var app = getApp();
var goHeader = app.goHeader;
var selectedFilter = {};//已选择的筛选项
var ALL_ITEM = {
  "id": "0",
  "name": "全部",
  "select": true
};
Page({
  data: {
    classify: []
  },
  onShow: function () {
    var that = this;
    var classify = wx.getStorageSync("facets").hotCategory;
    that.setData({
      classify: classify
    })
    that._init();
  },
  _init: function () {
    var that = this;
    selectedFilter = wx.getStorageSync('selectedFilter') || {};
    var classify = wx.getStorageSync("facets").hotCategory;
    if (!classify) {
      selectedFilter.selectClassify = ALL_ITEM;
    } else {
      classify.unshift(ALL_ITEM);
      if (selectedFilter.selectClassify) {
        for (var i = 0; i < classify.length; i++) {
          if (classify[i].id == selectedFilter.selectClassify.id) {
            classify[i].select = true;
          } else {
            classify[i].select = false;
          }
        }
      }

    }

    that.setData({
      classify: classify
    })
  },

  /**
   * @description 点击后数据的变化<br />
   * @method _selectedClassifyEvt
   * @param {Number} option页面参数
   * @since 2018-02-06
   * @author lily
   */
  _selectedClassifyEvt: function (e) {
    var that = this;
    var classify = that.data.classify;
    var idx = e.currentTarget.dataset.index;

    var selectClassify;
    for (var i = 0; i < classify.length; i++) {
      if (i == idx) {
        classify[i].select = true;
        selectClassify = {
          "id": classify[i].id,
          "name": classify[i].name,
          "select": true
        };
      } else {
        classify[i].select = false;
      }
    }
    that.setData({
      classify: classify
    })


    selectedFilter.selectClassify = selectClassify;
    wx.setStorageSync("selectedFilter", selectedFilter);
    wx.navigateBack({
      delta: 1
    })

  }
});