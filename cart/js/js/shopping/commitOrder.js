/**价格展示*/
!function(exports,req,u,ui,uw,tpl){
	var TYPE="7commit-order7";
    //shopping.js中 动态设置进来的东西
    var $$={
        updateOfflineCommerceItem:null
    };
	function div(im){
		return im('div');
	}
	function dfn(im){
		return im('data');
	}
	function render(im){
      var data=dfn(im);
	  if(data.ppcAmount==null)data.ppcAmount=null;
	  if(data.reduceHaulage==null)data.reduceHaulage=null;
		div(im).html(tpl.commitOrder_main(dfn(im)));
		alternation(im);
	}
	function _rendertgYzm(im){
		div(im).find('#tq-yzm').html(tpl.tqYzm({
			tqAtom:$config.tqAtom,
			groupOnImgcode:$config.URL.groupOnImgcode
		}))
		alternation(im)
	}
	function changeSubmitText(el){
		el.find("#id_commit_div").html("<span class=\"fontRed strong pr20\">提交中. . .</span>");
	}
	function isValidateYzmTrue(){
		if($config.tqAtom.tqyzm==""){
			$config.tqAtom.tqyzm_tip='请输入验证码'
		}else{
			if(/^[a-z|A-Z|0-9]{4}$/.test($config.tqAtom.tqyzm)){
				return true
			}else{
				$config.tqAtom.tqyzm_tip='请输入正确的验证码'
			}
		}
		return false
	}
	function alternation(im){
		var el=div(im);

		el.find('[name="tqyzm"]').blur(function(){
			if(isValidateYzmTrue()){
				$config.tqAtom.tqyzm_tip=''
			}
			_rendertgYzm(im)
		})
		el.find("#id_commit").off('click').on("click",function(){
            if($config.shoppingInstenceAtom.preferential){
                var datapref=dfn($config.shoppingInstenceAtom.preferential)
                if(datapref.verifyStatus=="NEED"){
                    if($config.shoppingAtom.yzm_tip){$config.shoppingAtom.yzm_tip=""}
                    if(!$config.shoppingAtom.yzm_pw){
                        $config.shoppingAtom.yzm_tip="请输入支付密码"
                        preferential.render($config.shoppingInstenceAtom.preferential)
                        return
                    }
                }
            }

			//预售站点,判断尾款手机是否有正确值，否则不提交
			if($page.site=="presell"){
				var im2=$config.shoppingInstenceAtom.payment;
				if(dfn(im2).presellModifyStatus=="modify" && dfn(im2).presellModifyTextNull){
					var phoneVal=div(im2).find('[presell-text-phone]').val()
					if(!(phoneVal && /^1[34578]\d{9}$/.test(phoneVal))){
						return
					}
				}
			}
			$config.tqAtom.tqet = new Date() - 0;
			/*团抢站点,再次提交*/
			if($config.tqAtom.tqneedYzm=="Y" && $config.istqSite()){
				if(isValidateYzmTrue()){
					commitYzm(im)
				}
				_rendertgYzm(im)
			}else{
				/*团抢站点,第一次提交,调用风控接口，判断是否需要显示验证码*/
				if($config.istqSite()){
					changeSubmitText(el)
        			uw.emit(TYPE,"commit",{
        				st: $config.tqAtom.tqet - $config.tqAtom.tqst,
        				soft:$config.tqIsUsedScalp()?1:0
        			})
				}else{
					changeSubmitText(el)
					uw.emit(TYPE,"commit","commit");
				}
			}
		});
		//订单中含有不支持七天的订单交互
		function renderIsSupSeven(){
	    	//鼠标划过弹出,并执行弹层的回调
	    	var $suptip=$('#isSupportSeven').find("[hoverup]"),$supbody=$('#isSupportSeven').find("[hover]");
	    	$supbody.gScroll({
	    		noCarousel:true,
	            stepLen:3,
	            moveDistance:216,
	            speed:300
	        });
	    	ui.hoverUp($suptip.add($supbody))($supbody)
		}
		renderIsSupSeven();
        //运费弹层
		function renderFreight(){
			//鼠标划过弹出,并执行弹层的回调
			var $frightBody = $('#freight-container').find(".fright-body");
            if(parseInt($frightBody.outerHeight(true)) > 317)  $frightBody.css("overflow-y","scroll");
			var $suptip=$('#freight-container').find("[hoverup]"),$supbody=$('#freight-container').find("[hover]"),$supbodyList=$supbody.find(".freight-list-box-in");
            $supbodyList.gScroll({
				noCarousel:true,
				stepLen:5,
				moveDistance:320,
				speed:300
			});
			ui.hoverUp($suptip.add($supbody))($supbody)
		}
        renderFreight();
		function setValueStage(name,el){
			 $config.tqAtom[name] = el.val();
		}
		function setImgcodeStage(name){
			$config.tqAtom[name] = new Date() - 1;
		}
		function renderyzm(){
			_rendertgYzm(im)
		}
		ui.gpipes(div(im), {
			renderyzm:renderyzm,
            setValueStage: setValueStage,
            setImgcodeStage: setImgcodeStage
        });
	}
	function commitYzm(im){
		$config.tqAtom.tqyzm_tip=''
		var param={
			st:$config.tqAtom.tqet - $config.tqAtom.tqst,  	//团抢:停留时间stayTime
			soft:$config.tqIsUsedScalp()?1:0,		//团抢:是否有插件
			captcha:$config.tqAtom.tqyzm, //团抢: 验证码
			cpcd:$config.tqAtom.tqyzm_imgCode     //团抢：请求验证码的标示
			,errorfn:function(data){
				$config.tqAtom.tqyzm_tip=data.errMsg;
				_rendertgYzm(im)
			},successfn:function(){}
		}
		changeSubmitText(div(im))
		$config.tqAtom.tqyzm_imgCode = new Date() - 1;
        uw.emit(TYPE,"commit",param)
	}

	/**
	 * 渲染赠品无库存提示
	 * @param   options 配置参数
	 * @returns btns数组
	 */
	function btnfn(options) {
		var btns = [{
			clazz: "btn btn-default btn-w83 mr50",
			btnName: "返回修改",
			click: options.callbacks[0]
		}];
		if(options.type == 0){
			btns.push({
				clazz: "btn btn-primary",
				btnName: "更换收货地址",
				click: options.callbacks[1]
			})
		}else if(options.type == 1){
			btns.push({
				clazz: "btn btn-primary",
				btnName: "不要赠品，继续提交",
				click: (function(data){
					var data = data || {};
					return function(){
						$(".g-panel.confirm .closebtn-new").click();
						changeSubmitText(div($config.shoppingInstenceAtom.commitOrder))
						uw.emit(TYPE,"commit","commit");
					}
				})(options.data)
			})
		}else if(options.type == 2){
            btns =  [{
                clazz: "btn btn-default btn-w83 mr50",
                btnName: "取消",
                click: function(){
                    $(".g-panel.confirm .closebtn-new").click();
                }
            },{
                clazz:"btn btn-primary btn-w83",
                btnName:"确定",
                click:function(){
                    $$.updateOfflineCommerceItem();
                    $(".g-panel.confirm .closebtn-new").click();
                }
            }];
		}else if(options.type == 4){
            btns = [{
                clazz: "btn btn-primary-center",
                btnName: "我知道了",
                click: function(){
                    $(".g-panel.confirm .closebtn-new").click();
                }
            }]
		}else if (options.type ==5) { //苹果特惠
			if (options.data.flag && options.data.flag==1) {
				btns =  [{
					clazz: "btn btn-default btn-w83 mr50",
					btnName: "重新购买",
					click: options.callbacks[0]
				},{
					clazz:"btn btn-primary",
					btnName:"更换收货地址",
					click:options.callbacks[1]
				}];
			}
			else {
				btns =  [{
					clazz: "btn btn-default btn-w83 mr50",
					btnName: "重新购买",
					click: options.callbacks[0]
				}];
			}
		}
		return btns;
	}

	/**
	 * 渲染赠品无库存提示
	 * @param modifycart     返回修改
	 * @param modifyAddress  更换收货地址
	 * @param gotoPay        不要赠品，继续提交
	 * @param data           apiCommit返回结果
	 * @returns {boolean}
	 */
	function offlineTip(options) {
		if(!options) return;
        panel.confirm({
            body:function(){
				return tpl.commitOrder_offlineTip({
					items:options.data,
					type:options.type
				})
			},
            btns: btnfn(options),
            close: ui.hide
        });
		return false;
    }

	function make(div,data){
		function r(a,data1){
			if(a=="div")return div;//操作范围
			if(data1!=null){
				data=data1;
				return r;
			}
			if(a=="data")return data;//最新数据
		}
		render(r);
		return r;
	}
	exports.commitOrder={
		make:u.curry(make),
        $$:$$,
		render:render,
		offlineTip: offlineTip,
		TYPE:TYPE
	};
}(this,request,util,util_ui,util_watch,GTPL);
