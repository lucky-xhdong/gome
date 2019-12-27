var app = getApp();
var websiteUrl = ''; //不同站点请求的接口地址，有一个字段不一样，用以拼接地址
Page({
    data: {
       dsgs: {},
       icres:{
         'TZ': '套装',
         'NOR': '',
         'ZDZ': '整单折',
         'JJHG': '加价换购',
         'DPG':'搭配购',
         'MJ':'满减',
         'MZ':'满折',
         'MF':'满返',
         'POP_MZE':'满赠',  //满赠是gifts取数据
         'POP_MJ':'满减',
         'POP_MF':'满返', //满返是coupons取数据
         'POP_MZH':'满折',
         'POP_GWQ':'购物券'//满折、满减、购物券都是postC取数据
       },
        mId:[],//美店ID
        meiName:{}
    },
     _ourHost: app.ourHostCart,
     _goHeader: app.goHeader,

   _scn: '',

    _isPayOnOff: false,//不允许客户一直点击支付按钮，只有失败，或异常操作等才能再次点击

    onLoad: function (options) {//地址栏传递的参数在options里
        var that = this;
       
        that._isPayOnOff = false;
        websiteUrl = app.getCartWebsite(this._ourHost);
        that.init();
    },

    /**
     * @description 初事化<br />
     * @method init
     * @param {Object} opt 参数集 (必传)
     * @since 2017-01-20
     * @author liusuling
     */
    init: function() {

        var that = this;
        that._scn = app.getScn();
        var dsgs = wx.getStorageSync('dsgs');
        var dealDsgs = app._goodDeal(dsgs);
        that.setData({
         dsgs:dealDsgs.dsgs
       })
       if(dealDsgs.mId.length>0){
         that._meiStore(dealDsgs.mId);
       }
    },

    /**
     * @description 根据美店id获取美店名称<br />
     * @method _meiStore
     * @param mId 美店id (必传)
     * @since 2017-04-05
     * @author liusuling
     */
    _meiStore:function(mId){
        var that = this;
        var midArr = mId;
        var mid = midArr.join(",");
        var meiName = {};
        wx.request({
             url: websiteUrl + '/api/shop/getGomePlusShops',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': that._goHeader,
                'Cookie':'SCN='+that._scn
            },
            data: {
                ss:mid
            },
            method: 'GET',
            success:function(res){
                meiName = res.data.data;
                that.setData({
                     meiName:meiName
                })
            }
        })  
    }
})