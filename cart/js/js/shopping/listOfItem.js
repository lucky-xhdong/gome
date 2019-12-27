/**配送方式*/
!function(exports,req,u,ui,uw,tpl,listMethod,listOfItemItems,meiDian,installRemind){
	var TYPE="7listOfItem7";

	function div(im){
		return im(0);
	}
	function datfn(im){
		return im(1);
	}
	function path(arr,im){
		return u.path(arr,datfn(im));
	}
	//获取商品清单中的所有商品数据数组
	function getAllItems(data){
		function mapcat(fn,da){
			return u.concats(u.map(fn,da));
		}
		var mapli =mapcat(function(item){
			return mapcat(u.path(["commerceItemsGroup"]),item.groups)
		},data);
		var mapzp = u.map(function(v){
			return u.assoc('itemPropCode','ZP',v)
		},mapcat(function(item){
			return mapcat(u.path(["gifts"]),mapli);
		},data));
		return {mapli:mapli,mapzp:mapzp}
	}
	function transData(data){
        for(var i =0; i<data.length; i++){
            if(data[i].groups && data[i].groups.length){
                for(var j =0; j<data[i].groups.length; j++){
                    var groupsItem = data[i].groups[j];
                    if(groupsItem.commerceItemsGroup && groupsItem.commerceItemsGroup.length) {
                        for (var k = 0; k < groupsItem.commerceItemsGroup.length; k++) {
                            groupsItem.commerceItemsGroup[k].profile = groupsItem.profile;
                        }
                    }
                }
            }
        }
		var mapdata = getAllItems(data)
		var mapassoc=u.curry(function (name,fn,da){
			return u.assoc(name,u.map(fn,da[name]),da);
		});
		function findItem(a){
			return u.find(function(item){
				return item.itemId==a;
			},u.concat(mapdata.mapli,mapdata.mapzp));
		}
    return u.map(mapassoc("shippinginfo", mapassoc("items", findItem)), data);
	}
	function render(im){
		div(im).html(tpl.listOfItem_main(datfn(im)));
		//延保配送信息
        div(im).find("#warrantyDilivery").html(tpl.listOfItem_method_warranty(datfn(im)));
		//配送信息
		div(im).find("[info-path]").each(function(){
			var el=$(this);
			var arr=el.attr("info-path").split(",");
			listMethod.make(el,path(arr,im));
		});
		//商品清单
		div(im).find("[list-path]").each(function(){
			var el=$(this);
			var arr=el.attr("list-path").split(",");
			listOfItemItems.make(el,path(arr,im));
		});
		
		div(im).find("#back-cart").click(function(){
			uw.emit(TYPE,"backCart",{});
		});
		//鼠标划过弹出
		div(im).find("[hoverup]").each(ui.jq(ui.hoverUpBySelector(u.__,"[hover]")));
        //鼠标划过弹出运费
        div(im).find("[hoverup-fee]").each(ui.jq(ui.hoverUpBySelector(u.__,"[hover-fee]")));

		//获取商品清单中的所有商品数据数组
		var mapli = getAllItems(datfn(im)).mapli
		showMeiDian(mapli);
		installRemind.callValues(function(data){
		    if(!data || data.length<1){
		        return ;
            }
             for(var i=0; i<data.length; i++){
                 var html = installRemind.getTpl(data[i]);
                 $('.js-install-remind-'+data[i].skuId).html(html);
             }
		});
		//订单中又不支持七天的将值和data存入配置文件，以后优化
		showSupportSeven(mapli)

	}
	function renderShopping(im){
		div(im).html(tpl.listOfItem_main(datfn(im).gvccis));
		//鼠标划过弹出
		div(im).find("[hoverup]").each(ui.jq(ui.hoverUpBySelector(u.__,"[hover]")));
	}
	function showSupportSeven(mapli){
		//设置$config.isSupportSeven
     	function isSupportSevenItems(data){
     		$config.isSupportSeven=false;
            return u.filter(function(item){
                if(item && $config.isNotI7n(item.serviceTagFlag)){
                	$config.isSupportSeven=true;
                    return true;
                }
            },data);
        }
        $config.isSupportSevenData = isSupportSevenItems(mapli)
	}
	function showMeiDian(data){
    	u.filter(function(item){
    		if(item.meidianId){
				meiDian.setId(item.meidianId);//将取到值赋值给meiDian
			}
			if(item.skuId){
				installRemind.put(item.skuId);
			}
			meiDian.callVlaues(function(data){
				readerMeiDian();
			});
			function readerMeiDian(){
				//TODO 当且 loadcart 和load 美店数据后 才执行，当下解决的方案是 渲染两次
				var list = meiDian.getMap();
				if(!list ){
					return;
				}
				for(var prop in list){
                    if (list[prop + '']) $('.mei-dian-' + prop).attr("title",'来自美店：' + list[prop + '']);
                    // if(list[prop+'']) $('.mei-dian-'+prop).text('来自美店:'+list[prop+'']);
				}

			}
    	},data)
	}
	//过滤主品
	function filterMainItem(data){
		return u.filter(function(item){
			return item.commerceitemVOFlag == "MAIN";
		},data)
	}

	function filterItems(fn,data){
		if(!$config.isGomeVirtualCardSite()){
			var allitem=u.map(u.pipe(u.prop("groups"),u.map(u.prop("commerceItemsGroup"))),data);
			function flatten(list){
				return u.reduce(u.concat,[],u.map(u.ifn(u.is(Array),flatten,u.of),list));
			}
			var data = u.filter(fn,flatten(allitem));
        }
		return data;
	}
	function arg2(a,b){
		return b;
	}
	
	//过滤所有商品
	//[配送清单]->[item]
	var filterAllItems=u.cond([
		[u.T,u.converge(filterItems,[u.identity,u.pipe(arg2,datfn)])]
	]);


	//根据商品获取店铺
	function getShopByItem(item,im){
		var fn1=u.find(u.eq(item));
		var fn2=u.find(u.pipe(u.prop("commerceItemsGroup"),fn1));
		var shop=u.find(u.pipe(u.prop("groups"),fn2),datfn(im));
		return shop;
	}
	//判断商品是否国美自营
	function isGome(item,im){
		return getShopByItem(item,im).shopId=="GOME";
	}

    function make(div, data) {
		function resultfn(flag,newdata){
			if(flag==0)return div;
			if(flag==1)return data;
			if(flag==3)data=newdata;
			return data;
		}
        render(resultfn);
		uw.emit(TYPE,"renderEnd",resultfn);
		//屏蔽埋码
		uw.emit($page.name,"rendertpmmEnd",resultfn);
		return resultfn;
	}
	function makeShopping(div,data){
		function resultfn(flag,newdata){
			if(flag==0)return div;
			if(flag==1)return data;
			if(flag==3)data=newdata;
			return data;
		}
		renderShopping(resultfn);
		uw.emit(TYPE,"renderEnd",resultfn);
		return resultfn;
	}

	function validateDx(im){
		var el = div(im);
		var velkeys=[];
		function errStylefn(tipel,textel){
			return function(err){
				function fn1(){
					tipel.hide();
					textel.removeClass("error");
				}
				function fn2(err){
					textel.addClass("error");
					tipel.html('<span style="color:#f00;">'+err+"</span>");
					tipel.show();
				}
				return u.ifn(u.isEmpty,fn1,fn2)(err);
			}
		}
		el.find("[dx-form] [g-validate]").each(function(){
			var vval=$(this).attr("g-validate");
			var fillel=el.find("[g-tip-validate="+vval+"]");
			var textel=el.find("[g-validate="+vval+"]");
			var vals=$(this).val()||$(this).attr("value");
			if(vals=='请输入机主姓名'){vals=''}
			if(vval=='dxsfzh' && el.find('[g-validate="dxsfzh"]').attr("no-modify")=='y'){}else{
				velkeys.push([vals,vval,errStylefn(fillel,textel)]);
			}
		});
		return validate.validate(velkeys);
	}
	exports.listOfItem={
		make:u.curry(make),
		makeShopping:u.curry(makeShopping),
		transData:transData,
		validateDx:validateDx,
		filterAllItems:filterAllItems,
		filterMainItem:filterMainItem,
		getShopByItem:getShopByItem,
		isGome:isGome,
		TYPE:TYPE
	};
}(this,request,util,util_ui,util_watch,GTPL,listOfItemMethod,listOfItemItems,MeiDian,InstallRemind);