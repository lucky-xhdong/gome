/*
 * 上传、删除、预览图片组件
 * @param-showState:默认为显示,为false时只做预览。
 * @since 2018-10-15
 * @author Lilian
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showState: {
      type: Number,
      value: 1
    },
    idx: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    show: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击增加图片
    addPhotoEvnet: function() {
      let that = this;
      let list = that.data.list;

      wx.chooseImage({
        count: 5, //最多选择的个数
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          for (var item of tempFilePaths) {
            list.push(item);
          }
          if (list.length >= 5) {
            list = list.slice(0, 5);
            that.setData({
              show: false
            })
          }
          that.setData({
            list: list
          })
          let pics = wx.getStorageSync('pics');
          pics[that.properties.idx].pics = that.data.list;
          wx.setStorageSync('pics', pics);
          console.log(wx.getStorageSync('pics'))
       
        }
      })
      
    },
    //点击删除图片 
    delPhotoEvent: function(e) {
      let that = this;
      let list = that.data.list,
        index = e.currentTarget.dataset.index;
      list.splice(index, 1);
      let pics = wx.getStorageSync('pics');
      pics[that.properties.idx].pics = list;
      wx.setStorageSync('pics', pics);
      that.setData({
        list: list,
        show: true
      })

    },
    // 点击预览图片
    previewImgEvent: function(e) {
      let that = this;
      let list = that.data.list,
        url = e.currentTarget.dataset.url;
      wx.previewImage({
        urls: list,
        current: url,
        success: function(res) {
          console.log(res)
        }
      })
    },
  }
})