/**
 * 用于弹出错误提示
 * @param  {Object} opt [description]
 *                  opt.code    错误信息编码
 *                  opt.msg     错误提示信息
 *                  opt.data.path
 *                  opt.data.message
 * @return {Function}     
 */
$.extend({
    errorMask : function(opt) {
        var def = {
                    code:"10000",                                   /*错误代码*/
                    message:null,				/*新的错误提示信息*/
                    msg:"订单提交失败，网络延迟请稍后再试!",        			/*老的错误提示信息*/
                    data: {},
					shadow : false,									/*显示遮罩层*/
					refresh: false,									/*重新刷新页面*/
                    callback: function() {},						/*用于自定义弹出框内容*/
                    aftercallback: function() {}					/*后置callback*/
                };
        var errorInfo = [
            {code:'limitBuyTerminate',info:'您好：限时抢购活动已结束，请选择其它商品继续购物'},
            {code:'limitBuyStart',info:'您好：限时抢购活动还没开始，请选择其它商品继续购物'},
            {code:'limitBuyEnd',info:'您好：限时抢购已结束，请选择其它商品继续购物'},
            {code:'limitBuyState3',info:'您好：限时抢购已结束，请选择其它商品继续购物'},
            {code:'limitBuyState1',info:'您好：限时抢购还没开始，请选择其它商品继续购物'},
            {code:'limitBuyBudget',info:'您好：此商品已被抢完，请选择其它商品继续购物'},
            {code:'limitBuySku',info:'您好：此商品已非限时抢购活动商品，请选择其它商品继续购物'},
            {code:'promoCaseNotAvl',info:'您好：本次活动已结束（方案或者预算已结束）'},
            {code:'limitBuyUserGrade',info:'您好：您的等级不能抢购此商品，请选择其它商品继续购物'},
            {code:'limitBuyInvolvedNum',info:'您好：您参加抢购次数过多，请选择其它商品继续购物'},
            {code:'GROUPONTerminate',info:'您好：团购活动已结束，请选择其它商品继续购物'},
            {code:'GROUPONStart',info:'您好：团购活动还没开始，请选择其它商品继续购物'},
            {code:'GROUPONBuyEnd',info:'您好：团购已结束，请选择其它商品继续购物'},
            {code:'GROUPONState3',info:'您好：团购已结束，请选择其它商品继续购物'},
            {code:'GROUPONState1',info:'您好：团购还没开始，请选择其它商品继续购物'},
            {code:'GROUPONBudget',info:'您好：此商品已被抢完，请选择其它商品继续购物'},
            {code:'GROUPONSku',info:'您好：此商品已非团购活动商品，请选择其它商品继续购物'},
            {code:'GROUPONUserGrade',info:'您好：您的等级不能团购此商品，请选择其它商品继续购物'},
            {code:'GROUPONInvolvedNum',info:'您好：您参加团购次数过多，请选择其它商品继续购物'},
            {code:'amountOverLimit',info:'使用红券不能大于等于商品总金额（不包含运费）'},
            {code:'errorVerifyCode',info:'验证码输入错误,请重新输入'},
            {code:'countOverSize',info:'一个订单最多使用10张红券'},
            {code:'1001',info:'网络可能有延迟，请核对您的积分并稍后再试'},
            // {code:'1100',info:'用户名和密码错误'},
            {code:'1100',info:'移动系统繁忙，请重试'},
            // {code:'1101',info:'消息结构错'},
            {code:'1101',info:'移动系统繁忙，请重试'},
            // {code:'1102',info:'请求流水号重复'},
            {code:'1102',info:'电子券已添加'},
            // {code:'1103',info:'MD5加密验证错误'},
            {code:'1103',info:'移动系统繁忙，请重试'},
            // {code:'1200',info:'电子券卡没有消费申请'},
            {code:'1200',info:'移动系统繁忙，请重试'},
            // {code:'1201',info:'请求包中的零售商非法'},
            {code:'1201',info:'移动系统繁忙，请重试'},
            // {code:'1202',info:'电子券卡已被冻结'},
            {code:'1202',info:'电子券已冻结'},
            // {code:'1203',info:'电子券卡不存在'},
            {code:'1203',info:'电子券无效'},
            // {code:'1204',info:'电子券卡已过有效期'},
            {code:'1204',info:'电子券已过期'},
            // {code:'1205',info:'电子券卡此密码已经兑换'},
            {code:'1205',info:'电子券无效'},
            // {code:'1206',info:'电子券卡不能到此零售商消费'},
            {code:'1206',info:'电子券无效'},
            // {code:'1207',info:'电子券卡余额不足'},
            {code:'1207',info:'移动系统繁忙，请重试'},
            // {code:'1208',info:'电子券卡已兑换生成新密码'},
            {code:'1208',info:'电子券无效'},
            // {code:'1209',info:'电子券不满足优惠条件'},
            {code:'1209',info:'电子券不满足优惠条件'},
            // {code:'1210',info:'电子券卡密码为空'},
            {code:'1210',info:'密码不能为空'},
            // {code:'1211',info:'电子券卡不在有效使用范围内'},
            {code:'1211',info:'电子券有效期未开始'},
            // {code:'1212',info:'已达到￥123满额限制'},
            // {code:'1212',info:'已达到￥123满额限制'},
            // {code:'9999',info:'其他错误'},
            {code:'9999',info:'移动系统繁忙，请重试'},
            // {code:'0',info:'成功'}
            {code:'0',info:'成功'}
        ];

        var format = function(str,args) {
            var str = str.replace(/\s/g,'');
            for(var i = 0;i < args.length ; i ++ ) {
                var exp = new RegExp("\\{"+i+"\\}","g");
                if(!str.match(exp)) {
                    return '参数个数不对!';
                }
                var arg = args[i].replace('verifyCode','验证码');
                str = str.replace(exp, arg);
            }
            return str;
        }

        var opt = $.extend(def,opt);

        // opt.message = opt.message.replace('￥','¥')
        //                 .replace('.0','.00')

        if(opt.code) {
        	var strCode = String(opt.code);
            switch(strCode) {
            	case '10000':
            		opt.message = opt.msg;
            		break;
                case '-32602':
                    if(opt.data && opt.data.path) {
                        var args = opt.data.path.split('|');
                        var str = format(opt.message,args);
                        if(str.length > 0 ){
                            opt.message = str;
                        }
                    }
                    break;
                default :
                    for(var i = 0;i < errorInfo.length; i++) {
                        if((errorInfo[i].code).toLowerCase() == strCode.toLowerCase()) {
                            opt.message = errorInfo[i].info;
                            break;
                        }
                    }

                    break;
            }
        }
        
        // 获取定位对象
		var getViewPort = function() {
			var d = document.documentElement, b = document.body, w = window;
            var viewPort ={ left:0, top: 0, width:0, height:0};
            viewPort.top = b.scrollTop || d.scrollTop ; 
            viewPort.left = b.scrollLeft || d.scrollLeft ; 
            viewPort.height = w.innerHeight || d.clientHeight || b.clientHeight; 
            viewPort.width = w.innerWidth || d.clientWidth || b.clientWidth;
			return viewPort;
		}

        // 屏幕居中显示
        var setDivToCenter = function (obj) {
        	if(!obj) return;
            var isIE = $.browser.msie && !$.support.opacity,
			isIE6 = isIE && $.browser.version < 7;
            var viewPort = getViewPort();
 			if(isIE6) {
                obj.css('display', 'none').css({
                	'z-index':'99999',
                	'position':'absolute',
                	'top': (viewPort.top + viewPort.height/2 - obj.outerHeight()/2) + 'px',
                	'left': (viewPort.left + viewPort.width/2 - obj.outerWidth()/2) + 'px'
                }).css('display', 'block');
 			}else {
 				obj.css('display', 'none').css({
                	'z-index':'99999',
                	'position':'fixed',
                	'top': (viewPort.height/2 - obj.outerHeight()/2) + 'px',
                	'left': (viewPort.width/2 - obj.outerWidth()/2) + 'px'
                }).css('display', 'block');
 			}
        }

        var $errorMask = $('<div id="error" class="error-box"></div>');
        
        //执行前置回调函数
        opt.callback($errorMask,opt.message);
        if($errorMask.html().length == 0) {
            $(['<div class="error-bd">',
                    '<a class="close close-error-box j-errorEvent" href="javascript:;" title="关闭">X</a>',
                    '<p class="warning">' , opt.message || opt.msg , '</p>',
                    '<div class="addr-btn">',
                        '<a class="nBtn nBtn-r j-errorEvent" href="javascript:;">确定</a>&nbsp;&nbsp;&nbsp;&nbsp;',
                        '<a class="nBtn nBtn-w j-errorEvent" href="javascript:;">取消</a>',
                    '</div>',
                '</div>'].join('')).appendTo($errorMask);
        //} else {
        //	opt.callback($errorMask,opt.message || opt.msg);
        }
        //执行后置回调函数
        opt.aftercallback($errorMask);
        
        /*var isIE = $.browser.msie && !$.support.opacity,
			isNotIE9 = isIE && document.documentMode < 9;
        
        if(isNotIE9) {
        	$errorMask.css('border','1px solid #BBBBBB');
        }*/
        
		var hide = function () {
			$('#screen').animate({
				opacity: '0',
				filter: 'Alpha(Opacity=0)'
			},300,function() {
				$(this).remove();
			});
		}

        $errorMask.appendTo(document.body).find('a.close').click(function(e) {
            e.preventDefault();
            $errorMask.remove();
			if(opt.shadow) {
				hide();
			}
        }).end().find('.addr-btn a.nBtn').click(function(e) {
            e.preventDefault();
            var $this = $(this);
            var text = $this.html();
            if(text == '确定') {
                //刷新
                $errorMask.remove();
                if(opt.refresh) {
                	 window.location.reload();
                }
            }else{
                //关闭
                $errorMask.remove();
            }
			if(opt.shadow) {
				hide();
			}
        }).end();

		
		if(opt.shadow) { 
			var d = $(window);
			$('<div id="screen" class="fixed" style="_display:none;"></div>').css({
				opacity: 0.7,
				filter: 'Alpha(Opacity=70)',
				width: d.width(),
				height: d.height()
			}).show().appendTo(document.body);
		}

        /*
		$(window).scroll(function() {
            setDivToCenter($errorMask);
        });
		*/

        //callack function
        // opt.returnFun = function () {}
        //opt.returnFun && opt.returnFun()

        $(window).resize(function() {
            setDivToCenter($errorMask);
        }); 
        setDivToCenter($errorMask);
        return $;
    }

});