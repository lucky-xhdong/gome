var app = getApp();
var websiteUrl = ''; //不同站点请求的接口地址，有一个字段不一样，用以拼接地址
var goHeader = app.goHeader;
Page({
    data: {
        information: {},//后台传过来的数据放在此字段里
        modifyAdress:{},
        loading: true,//初始化的loding
        lastX: 0,
        lastY: 0,
        screenWidth:0,//屏幕宽
        leftRight:[],
        leftRight:false,
        isSelected:""
    },

    _ourHost: app.ourHostCart,

    _scn: '',
    onLoad: function () {

        websiteUrl = app.getCartWebsite(this._ourHost);
        //获取屏幕宽高
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                //console.log(res.windowWidth);
                _this.setData({
                    screenWidth: res.windowWidth + 495
                });
            }
        });
    },

    onShow: function (options) {
        var that = this;
        options = this.data.information;

        that.init();
    },

    /**
     * @description 初事化<br />
     * @method init
     * @since 2017-01-20
     * @author liusuling
     */
    init: function() {
        var that = this;
        that._scn = app.getScn();
        var para = {
            url: websiteUrl,
            scn: that._scn
        };
        //2.调用初始化ajax，获取数据，执行回调函数
        app.initConfirmOrder(para,that._resetConfirmOrderData);

    },

    /**
     * @description 初事化<br />
     * @method _resetConfirmOrderData
     * @param {Object} opt 参数集 (必传)，后台传递确认订单页的数据
     * @since 2017-01-20
     * @author liusuling
     */
    _resetConfirmOrderData: function(opt) {
        var that = this;

        that.setData({
            information: opt,
            loading: false
        });

        that.initDeal();//设置数据处理页面
    },

    /**
     * @description 初事化数据后的处理页面结构<br />
     * @method init
     * @since 2017-01-20
     * @author liusuling
     */
    initDeal: function() {
        var that = this;

        //1.配送地址的展示和逻辑处理
        that._deliveryAddress();
    },
    /**
     * @description 配送地址的展示和逻辑处理<br />
     * @method _deliveryAddress
     * @since 2017-02-07
     * @author liusuling
     */
    _deliveryAddress: function() {

        var that = this,
            addressInfo = {},//用以存放要显示的地址信息
            cis = that.data.information.data.consig,//获取地址信息
            consigneeInfos = cis.consigneeInfos,
            num = cis.consigneeCount;//获取配送地址数量
            //console.log(num)

        /**
        * 1.如果普通配送地址数量为0则显示请填写收货地址，否则显示收货地址
        * 2.如果显示收货地址，则需判断具体显示哪个地址
        *   1）如果地址列表里的selected值为真表示当前选择的地址
        * 3.每次地址变化后，当前所在地区会自动变化价格
        * 4.判断当前所在区域是否有货、下架等？
        */

        //1.如果普通配送地址数量为0则显示请填写收货地址，否则显示收货地址
        if(num == 0) {
            that.setData({
                addressInfo: {
                    num : num
                }
            })

            return false;
        }

        //2.1如果地址列表里的selected值为真表示当前选择的地址
        for(var i=0 ; i<num; i++) {
            if(consigneeInfos[i].selected) {
                addressInfo = consigneeInfos[i];
                break;
            }
        }

        addressInfo.num = num;

        that.setData({
            addressInfo: addressInfo
        })

    },
    newAddress:function(){
        if(this.data.information.data.consig.consigneeInfos.length >= 20){
            wx.showModal({
                content: '您的收货人信息已经超过20条，我们将替换您最早的一条收货信息！',
                success: function(res) {
                    if (res.confirm) {
                        wx.redirectTo({
                            url:"../newAddress/newAddress"
                        });
                    }
                }
            });
        }else{
            wx.redirectTo({
                url:"../newAddress/newAddress"
            })
        }
    },
    radioTap:function(e){//如果点击的地址无变化
        if(this.data.information.data.consig.consigneeInfos && this.data.information.data.consig.consigneeInfos[e.currentTarget.id].selected == true){
            wx.navigateBack({
                delta: 1
            });
        }
    },
    radioChange: function(e) {
        var that = this;
        var para = {
            url: websiteUrl,
            scn: that._scn
        };
        var value = e.detail.value;

        wx.request({
            url: websiteUrl + "/api/consignee/selectAddress",
            data: {
                id: that.data.information.data.consig.consigneeInfos[e.detail.value].owerId,
                //scn:that._scn
            },
            method:'GET',
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader,
                'Cookie':'SCN='+that._scn
            },
            success: function(ress) {
                wx.navigateBack({
                    delta: 1
                })
            }
        });
    },
    //滑动事件
    handletouchmove: function(event) {
        let currentX = event.touches[0].pageX;
        let currentY = event.touches[0].pageY;

        var eIndex = event.currentTarget.id;

        //console.log(event);
        //console.log(this.data.lastX);
        var information = this.data.information;
        var consigneeInfos = information.data.consig.consigneeInfos;
        for(var i=0; i<consigneeInfos.length; i++){
            consigneeInfos[i].leftRight = false;
            if ((currentX - this.data.lastX) < 0 && (currentX - this.data.lastX) > (currentY - this.data.lastY)){
                //"向左滑动";
                consigneeInfos[eIndex].leftRight = false;
            }else if ((currentX - this.data.lastX) > 0 && (currentX - this.data.lastX) > (currentY - this.data.lastY)){
                //"向右滑动";
                consigneeInfos[eIndex].leftRight = true;
            }
            this.setData({
                information:information
            });
        }
        //console.log(this.data.consigneeInfos);

        //将当前坐标进行保存以进行下一次计算
        this.data.lastX = currentX;
        this.data.lastY = currentY;
    },
    //删除地址
    deleteCheck:function(e){
        var that = this;
        var eId = e.currentTarget.id;
        var information = this.data.information;
        var consigneeInfos = information.data.consig.consigneeInfos;
        //只有一条地址的时候不可以删除
        if(consigneeInfos[eId].selected == true){
            wx.showToast({
                title: '当前选择的地址不能删除哦',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(consigneeInfos[eId].selected == false){
            wx.showModal({
                title: '确认要删除当前地址吗？',
                success: function(res) {
                    if (res.confirm) {
                        wx.request({
                            url: websiteUrl + "/api/cart/removeAddress",
                            header: {
                                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                                'gome-header':goHeader,
                                'Cookie':'SCN='+that._scn
                            },
                            data:{
                                id:consigneeInfos[eId].owerId,
                                //scn:that._scn
                            },
                            method:'GET',
                            complete:function(res){
                                that.onShow();
                            }
                        });
                    }
                }
            });
        }
    },

    handletouchtart:function(event){
        this.data.lastX = event.touches[0].pageX;
        this.data.lastY = event.touches[0].pageY;
    },
});
