/*
 * 评价点星组件
 * 在json引入
 * "usingComponents": {
 *  "star": "/components/star/star"
 * }
 * 在wxml引入
 * <star id='star'  index="0" type="1" score="5" star-box="star-box" star-img="star-img"> < /star>
 * 其中 class:stars、star-imgs名字可自定义，需要在其wxss里重新写样式（可copy star.wxss默认样式）
 * 可点击状态：type==1时为黄色,type==2时为灰色星；
 * 不可点击状态：type==3时为黄色,type==4时为灰色星；
 * index为一个页面内所有评价五星组件的数组里的索引值。
 * score为星的数量。最小为1，最大为5。商品评价默认5颗星。 服务评价默认没有星
 * @since 2018-10-15
 * @author Lilian
 */
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['star-box', 'star-img'],
  options: {
    // addGlobalClass: false,
    multipleSlots: true
  },
  properties: {
    type:{
      type:Number,
      value:0,
    },
    index: {
      type: Number,
      vaule: 0,
    },
    score:{
      type:Number,
      value:0,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/star-light.png',
    selectedSrc: '../../images/star-full.png',
    normalGreySrc:'../../images/star-grey.png',
    score: 5,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectStar: function(e) {
      let that = this,
        score = e.currentTarget.dataset.score,
        idx = e.currentTarget.dataset.idx,
        index = that.properties.index,
        scores = wx.getStorageSync('scores');
      scores[index] = score;
      wx.setStorageSync('scores', scores);
      that.setData({
        score: score,
      })
      console.log(wx.getStorageSync('scores'));

    },
  }
})