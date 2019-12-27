/*!
 * 详情页自营商品节能补贴函数
 * gmEnergy - v1.0.0 (2015-12-07) WangPingQi
 * //www.gome.com.cn/ | Released under MIT license
 */
var gmEnergy={
    /**
     * result 表示商品有无货,"Y" or "N"
     */
    result : null,
    /**
     * 初始化
     */
    init : function(data){
        var self=this;
        self.result=data;
        //如果energyState为1,那么代表支持节能减排
        /*//ss.gome.com.cn/item/v1/browse/energy/1121210101/flag/item/gmEnergyJson?callback=gmEnergyJson&_=1476258191129
        '//ss' + cookieDomain + '/item/v1/browse/energy/'+prdInfo.sku+'/flag/item/gmEnergyJson',
        */
        if(prdInfo.energyState == "1" ){
            $.ajax({
                type:'get',
                url: '//ss' + cookieDomain + '/item/v1/browse/energy/'+prdInfo.sku+'/flag/item/gmEnergyJson',
                dataType: 'jsonp',
                jsonpName: 'gmEnergyJson',
                success: function (data) {
                    if(data && data.energyState){
                        self.formatEnergyNowTime(data);
                        self.initEnergy();
                    }
                }
            })
        }
    },
    /**
     * 商品状态，如果无货或者下架，返回true
     */
    prdHuiTag : function(){
        return (this.result=="N" || prdInfo.prdType == 2) ? true : false;
    },
    /**
     * 选择的区域是否北京
     */
    isCheckedBJ : function(){
        return g.cityCode(1)==="11000000" ? true :false;
    },
    /**
     * 当前sku是否支持节能补贴
     */
    isSupportEnergy : function(){
        return this.data.energyState=="1" ? true :false;
    },
    /**
     * 处理服务器返回来的时间
     */
    formatEnergyNowTime  : function(data){
        this.data=data;
        var self=this
            , energyNowTime=data.energyNowTime;
        self.data.energyCurrentDate=energyNowTime.substring(0,8);
        self.data.energyCurrentTime=energyNowTime.substring(8,16);
        self.data.energyStartDate=data.energyStartDate.substring(0,8);
        self.data.energyEndDate=data.energyEndDate.substring(0,8);
        return self.data;
    },
    /**
     * 节能补贴是否有效
     * @return {Boolean}
     */
    isEnergyEffective : function(){
        var currentDate=this.data.energyCurrentDate;
        return parseInt(this.data.energyStartDate)<=currentDate && currentDate<parseInt(this.data.energyEndDate) ? true : false;
    },
    /**
     * 当前sku的北京区域价是否<=报备价
     * @return {Boolean}
     */
    isPriceLtRecordPrice : function(){
        return parseFloat(prdInfo.price)<=parseFloat(this.data.recordPrice);
    },
    /**
     * 几个条件同时满足时，处理节能补贴
     */
    initEnergy : function(){
        var self=this;
        if(self.isCheckedBJ() && self.isSupportEnergy() && self.isEnergyEffective() &&  self.isPriceLtRecordPrice() ){
            self.initEnergyTipAfterCount();
            self.initBtnEnergy();
            self.warmTips();
            //如果商品支持节能减排，则需要处理用户停留在这个页面时间段内，是否到了节能减排的结束时间，如果到了，按钮任然需要自动置灰。
            self.autoEnergyTimer();
        }
    },
    /**
     * 温馨提示处理
     */
    warmTips : function(){
        var energyStandard=parseInt(parseFloat(this.data.energyStandard)*100);
        $(".wenxinti").addClass("supportEnergy").prepend('<li class="energy-tip">本商品参加北京市节能减排政策，补贴标准为<strong>'+energyStandard+'%</strong><a href="//help.gome.com.cn/question/5140.html" target="_blank" class="viewDetails">查看详情</a></li>');
        $('.wenxintishi_wrap').removeClass('dn');
      },
    /**
     * 购买数量之后提示文案
     * 节能提示文字："仅限首件享受节能补贴"
     */
    initEnergyTipAfterCount : function(){
        var self=this;
        /*$("#btnCount").after('<span>仅限首件享受节能补贴</span>');*/
        //商品无货或者下架不添加节能提示文字
        if( self.prdHuiTag()){
            $(".energyTips").show();
        }else{
            //如果"仅剩X件显示"或者"限购X件"显示,则节能提示文字不显示
            if($('.wrap_remain').is(":visible") || $(".limitBuy").is(":visible") )
                $(".energyTips").hide();
            else
                $(".energyTips").show();
        }
    },
    /**
     * 增加按钮“参加节能补贴”
     */
    initBtnEnergy : function(){
        var self=this
            , hrefStr='//cart'+cookieDomain+'/save/energy/allowance';
        $('#easyShopping').hide();
        $("#addCart").after('<a href="'+hrefStr+'" data-href="'+hrefStr+'" class="btn-product btn-stages" id="btnJoinEnergy" target="_blank">参加节能补贴</a>');
        if(self.prdHuiTag()){
            self.btnEnergyDisable();
            $("#btnJoinEnergy").attr('href','javascript:;').removeAttr('target');
            return;
        }
        self.actionBtnEnergy();
        self.btnEnergyHover();
    },
    /**
     * 按钮"参加节能补贴"点击事件
     */
    actionBtnEnergy : function(){
        storedef.done(function () {
            setTimeout(function () {
                $("#btnJoinEnergy").off("click").on("click",function(){
                    var _this=$(this);
                    g.login(function () {
                        if(_this.hasClass("disabled"))
                            return false;
                        var href=_this.attr("data-href");
                        var reg = new RegExp("(^|&)rebatekid=([^&]*)(&|$)"); //美信分享返利
                        var r = window.location.search.substr(1).match(reg);
                        var k="";
                        if(r!=null){k=unescape(r[2])};
                        /* var formstring= '<form target="_blank" action="'+href+'" method="get">'+
                         '<input name="productId" value="'+prdInfo.prdId+'" type="hidden">'+
                         '<input name="skuId" type="hidden" value="'+prdInfo.sku+'">'+
                         '</form>' ;
                         $(formstring).appendTo('body').submit().remove();*/
                        //window.open (href+'?productId='+prdInfo.prdId+"&skuId="+prdInfo.sku) ;
                        window.location.href=href+'?productId='+prdInfo.prdId+"&skuId="+prdInfo.sku+"&rebatekid="+k;
                    });
                    return false;
                })
            });
        });
    },
    /**
     * 鼠标经过"参加节能补贴"按钮，显示节能详情
     */
    btnEnergyHover: function () {
        var btn = $("#btnJoinEnergy");
        var pop = $(".pop-energy-saving");
        var str = "<i class='btn-arrow-top'>左箭头</i><div class='pop-inner'><ol><li data-before='1.'>点击参加“节能补贴”按钮，最高可减免800元！</li><li data-before='2.'>用户参加节能补贴活动应提供本人真实有效证件，如冒用、盗用、伪造相关证件，用户应承担相应法律责任！</li><li data-before='3.'>节能补贴活动规则详见帮助中心-购物流程-特色服务-节能补贴！点击“参加节能补贴”按钮，快来体验吧！</li></ol></div>";
        btn.hover(function () {
            pop.removeClass('hide').css('left',btn.position().left).html(str);
        }, function () {
            pop.addClass('hide').removeAttr('style');
        })
    },
    /**
     * 按钮"参加节能补贴"置灰,不可点击；并且按钮的href属性值设为空，
     * 杜绝用户非法操作进入节能减排的提交登记页面
     */
    btnEnergyDisable : function(){
        var self = this;
        $("#btnJoinEnergy").addClass("disabled");
        $("#btnJoinEnergy").attr({"href":"","data-href":""});
        self.btnEnergyHover();
    },
    /**
     * 如果商品支持节能减排，则需要处理用户停留在这个页面时间段内，
     * 是否到了节能减排的结束时间，如果到了，按钮任然需要自动置灰。
     */
    autoEnergyTimer : function(){
        var self=this;
        var durationDate= Math.abs(parseInt(self.data.energyEndDate) - parseInt(self.data.energyCurrentDate));
        if(durationDate>1){
            return ;
        }else{
            //定时器每隔1秒刷新一次
            var durationTime=self.getDurationTime();
            self.EnergyTimer=window.setInterval(function(){
                durationTime-=1;
                if(durationTime<=1){
                    self.btnEnergyDisable();
                    self.EnergyTimer=null;
                }
            },1000);
        }
    },
    /**
     * 获取当前时间到午夜0点整的总秒数
     * @method getDurationTime
     * @return {Number} 返回整形数据
     */
    getDurationTime : function(){
        return this.formatTimeToSecond("240000")-this.formatTimeToSecond(this.data.energyCurrentTime);
    },
    /**
     * 将时间转换为秒
     * @method formatTimeToSecond
     * @param {String} date 时间,格式为时分秒(如155629)
     * @return {Number} 返回整形数据
     */
    formatTimeToSecond : function(date){
        var hours=date.substring(0,2)
            , minutes=date.substring(2,4)
            , seconds=date.substring(4,6);
        return parseInt(hours)*3600+parseInt(minutes)*60+parseInt(seconds);
    }
}

