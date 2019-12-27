let app = getApp();
Page({
    data: {
        scrollHeight: 0,
        scrollTop: 0,
        tabList:[],
        itemList:null,
        tabIndex:0
    },

    ourHost:app.ourHost,
    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    scrollHeight: res.windowHeight - 65
                })
            }
        });
        this.getTabList(0);
    },
    codeClick:function(){
        app.QRScan();
    },
    getTabList:function(id){
        var that = this;
        var defaultTab;

        wx.request({
            url: that.ourHost + '/category/firstlevel',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': 'wxa.gome.com.cn'
            },
            method: 'POST',
            complete: function (sssres) {
                //console.log(sssres.data);
                that.setData({
                    tabList:sssres.data,
                    tabIndex:id
                });
                defaultTab = that.data.tabList[id].goodsTypeId;
                that.getiTemList(defaultTab);
            }
        });
    },
    getiTemList:function(defaultTab){
        var that = this;
        wx.request({
            url: that.ourHost + '/category/detail',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': 'wxa.gome.com.cn'
            },
            data: {
                categoryId: defaultTab
            },
            method: 'POST',
            complete: function (ssssres) {
                //console.log(ssssres.data);
                //过滤非法图片
                var itemList = ssssres.data;
                var secondLevelCategories = itemList.secondLevelCategories;
                for(var j =0; j<secondLevelCategories.length; j++){
                    var goodsTypeList = secondLevelCategories[j].goodsTypeList;
                    for(var k =0; k<goodsTypeList.length; k++){
                        goodsTypeList[k].goodsTypeImgUrl = goodsTypeList[k].goodsTypeImgUrl.replace("http:",'').replace("https:",'');
                    }
                }
                that.setData({
                    itemList:itemList
                });
            }
        });
    },
    tabClick:function(e){
        //this.getTabList(e.currentTarget.id);
        this.setData({
            tabIndex:e.currentTarget.id,
            itemList:null
        });
        this.getiTemList(this.data.tabList[e.currentTarget.id].goodsTypeId);
    }
});

