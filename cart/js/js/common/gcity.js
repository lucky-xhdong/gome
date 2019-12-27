/**购物车四级区域组件**/
(function(exports,req,u,ui,tpl){
	var globalCache={};
	var params={
		adress:"11011400|北京北京市东城区东城区|11010000|11000000|110114001",///* 存储地址解析：三级Code|全称|二级Code|一级Code|四级Code */
		adress:"11011400|北京北京市东城区东城区|11010000|11000000|110114001",///* 存储地址解析：三级Code|全称|二级Code|一级Code|四级Code */
		province:{"11000000":"北京","12000000":"天津","13000000":"河北省","14000000":"山西省","15000000":"内蒙古","21000000":"上海","22000000":"浙江省","23000000":"江苏省","24000000":"安徽省","25000000":"福建省","26000000":"山东省","31000000":"广东省","32000000":"广西","33000000":"海南省","41000000":"湖北省","42000000":"湖南省","43000000":"河南省","44000000":"江西省","51000000":"黑龙江省","52000000":"吉林省","53000000":"辽宁省","61000000":"宁夏","62000000":"新疆","63000000":"青海省","64000000":"陕西省","65000000":"甘肃省","71000000":"四川省","72000000":"云南省","73000000":"贵州省","74000000":"重庆","75000000":"西藏","81000000":"台湾省","82000000":"香港","83000000":"澳门","84000000":"钓鱼岛"},
        city:{"11000000":{"11010000":"北京市"},"12000000":{"12010000":"天津市"},"13000000":{"13010000":"保定市","13020000":"沧州市","13030000":"承德市","13040000":"邯郸市","13050000":"衡水市","13060000":"廊坊市","13070000":"秦皇岛市","13080000":"石家庄市","13090000":"唐山市","13100000":"邢台市","13110000":"张家口市"},"14000000":{"14010000":"长治市","14020000":"大同市","14030000":"晋城市","14040000":"晋中市","14050000":"临汾市","14060000":"吕梁市","14070000":"朔州市","14080000":"太原市","14090000":"忻州市","14100000":"阳泉市","14110000":"运城市"},"15000000":{"15010000":"阿拉善盟","15020000":"巴彦淖尔市","15030000":"包头市","15040000":"赤峰市","15050000":"鄂尔多斯市","15060000":"呼和浩特市","15070000":"呼伦贝尔市","15080000":"通辽市","15090000":"乌海市","15100000":"乌兰察布市","15110000":"锡林郭勒盟","15120000":"兴安盟"},"21000000":{"21010000":"上海市"},"22000000":{"22010000":"杭州市","22020000":"湖州市","22030000":"嘉兴市","22040000":"金华市","22050000":"丽水市","22060000":"宁波市","22070000":"衢州市","22080000":"绍兴市","22090000":"台州市","22100000":"温州市","22110000":"舟山市"},"23000000":{"23010000":"南京市","23020000":"淮安市","23030000":"连云港市","23040000":"常州市","23050000":"南通市","23060000":"苏州市","23070000":"宿迁市","23080000":"泰州市","23090000":"无锡市","23100000":"徐州市","23110000":"盐城市","23120000":"扬州市","23130000":"镇江市"},"24000000":{"24010000":"合肥市","24020000":"安庆市","24030000":"蚌埠市","24040000":"亳州市","24060000":"池州市","24070000":"滁州市","24080000":"阜阳市","24090000":"淮北市","24100000":"淮南市","24110000":"黄山市","24120000":"六安市","24130000":"马鞍山市","24140000":"宿州市","24150000":"铜陵市","24160000":"芜湖市","24170000":"宣城市"},"25000000":{"25010000":"福州市","25020000":"龙岩市","25030000":"南平市","25040000":"宁德市","25050000":"莆田市","25060000":"泉州市","25070000":"三明市","25080000":"厦门市","25090000":"漳州市"},"26000000":{"26010000":"滨州市","26020000":"德州市","26030000":"东营市","26040000":"菏泽市","26050000":"济南市","26060000":"济宁市","26070000":"莱芜市","26080000":"聊城市","26090000":"临沂市","26100000":"青岛市","26110000":"日照市","26120000":"泰安市","26130000":"威海市","26140000":"潍坊市","26150000":"烟台市","26160000":"枣庄市","26170000":"淄博市"},"31000000":{"31010000":"广州市","31020000":"深圳市","31030000":"潮州市","31040000":"河源市","31050000":"惠州市","31060000":"江门市","31070000":"揭阳市","31080000":"茂名市","31090000":"梅州市","31100000":"清远市","31110000":"汕头市","31120000":"汕尾市","31130000":"韶关市","31140000":"阳江市","31150000":"云浮市","31160000":"湛江市","31170000":"肇庆市","31180000":"珠海市","31190000":"东莞市","31200000":"中山市","31210000":"佛山市"},"32000000":{"32010000":"桂林市","32020000":"百色市","32030000":"北海市","32040000":"崇左市","32050000":"防城港市","32060000":"贵港市","32070000":"河池市","32080000":"贺州市","32090000":"来宾市","32100000":"柳州市","32110000":"南宁市","32120000":"钦州市","32130000":"梧州市","32140000":"玉林市"},"33000000":{"33010000":"海口市","33020000":"白沙县","33030000":"保亭县","33040000":"昌江县","33050000":"澄迈县","33060000":"儋州市","33070000":"定安县","33080000":"东方市","33090000":"乐东县","33100000":"临高县","33110000":"陵水县","33130000":"琼海市","33140000":"琼中县","33150000":"屯昌县","33160000":"万宁市","33170000":"文昌市","33180000":"五指山市","33210000":"三亚市","33220000":"三沙市"},"41000000":{"41010000":"武汉市","41020000":"鄂州市","41030000":"恩施州","41040000":"黄冈市","41050000":"黄石市","41060000":"荆门市","41070000":"荆州市","41080000":"十堰市","41090000":"随州市","41100000":"咸宁市","41110000":"襄阳市","41120000":"孝感市","41130000":"宜昌市","41140000":"仙桃市","41150000":"潜江市","41160000":"天门市","41170000":"神农架林区"},"42000000":{"42010000":"长沙市","42020000":"常德市","42030000":"郴州市","42040000":"衡阳市","42050000":"怀化市","42060000":"娄底市","42070000":"邵阳市","42080000":"湘潭市","42090000":"湘西州","42100000":"益阳市","42110000":"永州市","42120000":"岳阳市","42130000":"张家界市","42140000":"株洲市"},"43000000":{"43010000":"郑州市","43020000":"安阳市","43030000":"鹤壁市","43040000":"焦作市","43050000":"开封市","43060000":"洛阳市","43070000":"漯河市","43080000":"南阳市","43090000":"平顶山市","43100000":"濮阳市","43110000":"三门峡市","43120000":"商丘市","43130000":"新乡市","43140000":"信阳市","43150000":"许昌市","43160000":"周口市","43170000":"驻马店市","43180000":"济源市"},"44000000":{"44010000":"南昌市","44020000":"抚州市","44030000":"赣州市","44040000":"吉安市","44050000":"景德镇市","44060000":"九江市","44070000":"萍乡市","44080000":"上饶市","44090000":"新余市","44100000":"宜春市","44110000":"鹰潭市"},"51000000":{"51010000":"哈尔滨市","51020000":"大庆市","51030000":"大兴安岭","51040000":"鹤岗市","51050000":"黑河市","51060000":"鸡西市","51070000":"佳木斯市","51080000":"牡丹江市","51090000":"七台河市","51100000":"齐齐哈尔市","51110000":"双鸭山市","51120000":"绥化市","51130000":"伊春市"},"52000000":{"52010000":"长春市","52020000":"白城市","52030000":"白山市","52040000":"吉林市","52050000":"辽源市","52060000":"四平市","52070000":"松原市","52080000":"通化市","52090000":"延边州"},"53000000":{"53010000":"沈阳市","53020000":"鞍山市","53030000":"本溪市","53040000":"朝阳市","53050000":"大连市","53060000":"丹东市","53070000":"抚顺市","53080000":"阜新市","53090000":"葫芦岛市","53100000":"锦州市","53110000":"辽阳市","53120000":"盘锦市","53130000":"铁岭市","53140000":"营口市"},"61000000":{"61010000":"固原市","61020000":"石嘴山市","61030000":"吴忠市","61040000":"中卫市","61050000":"银川市"},"62000000":{"62010000":"乌鲁木齐市","62020000":"阿克苏地区","62030000":"阿勒泰地区","62040000":"巴音郭楞州","62050000":"博尔塔拉州","62060000":"昌吉州","62190000":"北屯市","62070000":"哈密地区","62080000":"和田地区","62090000":"喀什地区","62100000":"克拉玛依市","62110000":"克孜州","62120000":"塔城地区","62130000":"吐鲁番地区","62140000":"伊犁州","62150000":"石河子市","62160000":"阿拉尔市","62170000":"图木舒克市","62180000":"五家渠市"},"63000000":{"63010000":"西宁市","63020000":"果洛州","63030000":"海北州","63040000":"海东市","63050000":"海南州","63060000":"海西州","63070000":"黄南州","63080000":"玉树州"},"64000000":{"64010000":"西安市","64020000":"安康市","64030000":"宝鸡市","64040000":"汉中市","64050000":"商洛市","64060000":"铜川市","64070000":"渭南市","64080000":"咸阳市","64090000":"延安市","64100000":"榆林市"},"65000000":{"65010000":"兰州市","65020000":"白银市","65030000":"定西市","65040000":"甘南州","65050000":"嘉峪关市","65060000":"金昌市","65070000":"酒泉市","65080000":"临夏州","65090000":"陇南市","65100000":"平凉市","65110000":"庆阳市","65120000":"天水市","65130000":"张掖市","65140000":"武威市"},"71000000":{"71010000":"成都市","71020000":"阿坝州","71030000":"巴中市","71040000":"达州市","71050000":"德阳市","71060000":"甘孜州","71070000":"广元市","71080000":"乐山市","71090000":"凉山州","71100000":"泸州市","71110000":"眉山市","71120000":"绵阳市","71130000":"内江市","71140000":"南充市","71150000":"攀枝花市","71160000":"遂宁市","71170000":"雅安市","71180000":"宜宾市","71190000":"资阳市","71200000":"自贡市","71210000":"广安市"},"72000000":{"72010000":"昆明市","72020000":"保山市","72030000":"楚雄州","72040000":"大理州","72050000":"德宏州","72060000":"迪庆州","72070000":"红河州","72080000":"丽江市","72090000":"临沧市","72100000":"怒江州","72110000":"曲靖市","72120000":"普洱市","72130000":"文山州","72140000":"西双版纳","72150000":"玉溪市","72160000":"昭通市"},"73000000":{"73010000":"贵阳市","73020000":"安顺市","73030000":"毕节市","73040000":"六盘水市","73050000":"黔东南州","73060000":"黔南州","73070000":"黔西南州","73080000":"铜仁市","73090000":"遵义市"},"74000000":{"74010000":"重庆市"},"75000000":{"75010000":"拉萨市","75020000":"阿里地区","75030000":"昌都市","75040000":"林芝市","75050000":"那曲地区","75060000":"日喀则市","75070000":"山南市"},"81000000":{"81010000":"台湾省"},"82000000":{"82010000":"香港"},"83000000":{"83010000":"澳门"},"84000000":{"84010000":"钓鱼岛"}}
	}
	function div(im){
		return im("div");
	}
	function dfn(im){
		return im("data");
	}
	//入口函数
	function make(div,options,call){
		div.find('.gCity').html(tpl.comp_gcity({noreq:true}));
		var config=initParams(options,call)
		function r(flag){
			return {div:div,data:config}[flag];
		}
		render(r);
		return r;
	}
	function optionsFn(options){
		var options = options || $.cookie('atgregion') || params.adress;
	    if($page.site=='allowance' && options.split("|")[3]!="11000000"){ options=params.adress}
	    return options
	}
	//传入的参数处理
	function initParams(options,call){
	    cdata = optionsFn(options).split("|");
	    /* 如果没有第四级 则默认为第四级第一个城镇 9位 */
	    if(cdata.length!=5 || cdata[4]=="undefined")cdata[4] = cdata[0]+"1";
	    return {
	    	provinceCode:cdata[3],
	    	cityCode:cdata[2],
	    	areaCode:cdata[0],
	    	townCode:cdata[4],
	    	current:3,
	    	selectfn:call.selectfn,
	    	closefn:call.closefn,
	    	auto:call.auto || false
	    }
	}
	//缓存三级区域接口
	function ajaxArea(im){
		var cityCode=dfn(im).cityCode;
		function makeCache(){
			var r=req.cachePromise(req.reqp,"//ss"+cookieDomain+"/item/v1/region/"+cityCode+"/3/flag/item_web/gcity3",{},"gcity3")
			globalCache[cityCode]=r;
			return r;
		}
		return globalCache[cityCode]!=null?globalCache[cityCode]():makeCache()();
	}
	//缓存四级区域接口
	function ajaxTown(im){
		var areaCode=dfn(im).areaCode;
		function makeCache(){
			var r=req.cachePromise(req.reqp,"//ss"+cookieDomain+"/item/v1/region/"+areaCode+"/4/flag/item_web/gcity4",{},"gcity4")
			globalCache[areaCode]=r;
			return r;
		}
		return globalCache[areaCode]!=null?globalCache[areaCode]():makeCache()();
	}
	
	//头部区域是否可点击,延保站点必须是北京站点
	function getAvailable(real,cur){
		if($page.site=='allowance' && (real==0 || real==1)){
			return false;
		}
		return true
	}
	//省份头部
	function selectedProvince(im,data,cur){
		return {
			available:getAvailable(0,cur),
			label:u.prop(dfn(im).provinceCode,data),
			code:dfn(im).provinceCode
		}
	}
	//取所有省份数据
	function provinceChildrens(){
		return u.map(function(item){
			return u.fromPairs([["code",u.head(item)],["label",u.last(item)]])
		},u.toPairs(params.province))	
	}
	//城市头部
	function selectedCity(im,province,cur){
		return {
			available:getAvailable(1,cur),
			label:u.prop(dfn(im).cityCode,params.city[province.code]),
			code:dfn(im).cityCode
		}
	}
	//取当前省份下的所有城市
	function cityChildrens(province){
		return u.map(function(item){
			return u.fromPairs([["code",u.head(item)],["label",u.last(item)]])
		},u.toPairs(params.city[province.code]))
	}
	//取区头部
	function selectedArea(im,city,cur){
		var area=u.find(function(item){
				return u.eq(item.code,dfn(im).areaCode)
			},city)
		return area?u.assoc("available",getAvailable(2,cur),area):null;
	}
	//取县头部
	function selectedStore(im,area,cur){
		var town=u.find(function(item){
				return u.eq(item.code,dfn(im).townCode)
			},area)
		return town?u.assoc("available",getAvailable(3,cur),town):null;
	}
	function minNum(real,current){
		if(real<current)return real;
		return current;
	}
	//请求三四级的时候，数据返回false,加载错误模板
	function renderErr(im,message){
		return div(im).find('.gCity').html(tpl.comp_gcity({noreq:false,errRes:true,message:message}));
	}
	
	function selectedItem(im){
		//设置三四级头部
		function setTitles(data){
			if(data==null){
				titles.push({label:"请选择"});
			}else{
				titles.push(data)
			}
		}
		//获取当前title下区域数据
		function childernfn(current,data){
			if(current==0)return provinceChildrens()
			if(current==1)return cityChildrens(province);
			if(current==2)return data;
			if(current==3)return data;
		}
		var titles=[];
		var current=dfn(im).current;
		var province=selectedProvince(im,params.province,current);
		if(!(province.label)){
			titles.push({label:"请选择"});
			return {
				current:minNum(0,current),
				titles:titles,
				childrens:childernfn(minNum(0,current))
			}
		}
		titles.push(province);

		var city=selectedCity(im,province,current)
		if(!(city.label)){
			titles.push({label:"请选择"});
			return {
				current:minNum(1,current),
				titles:titles,
				childrens:childernfn(minNum(1,current))
			}
		}
		titles.push(city);

		var d=$.Deferred();
		if(dfn(im).cityCode && dfn(im).areaCode){
			req.parall(ajaxArea(im),ajaxTown(im)).then(req.res(function(res1,res2){
				var childVal=null;
				if(res1.success){
					var area=selectedArea(im,res1.result.division,current)
					setTitles(area)
				}else{
					setTitles()
				}
				if(res2.success){
					var store=selectedStore(im,res2.result.division,current)
					setTitles(store)
				}else{
					setTitles()
				}
				if(current==2){
					childVal=res1.success?childernfn(2,res1.result.division):''
				}else if(current==3){
					childVal= res2.success?childernfn(3,res2.result.division):''
				}else{
					childVal=childernfn(current)
				}
				d.resolve({
					current:current,
					titles:titles,
					childrens:childVal
				})
	    	}))
		}else if(dfn(im).cityCode){
			ajaxArea(im).then(function(data){
				if(data.success){
					var area=selectedArea(im,data.result.division,current)
					setTitles(area)
					d.resolve({
						current:minNum(2,current),
						titles:titles,
						childrens:childernfn(minNum(2,current),data.result.division)
					});
				}else{
					renderErr(im,data.message)
				}
			})
		}
		return d.promise();
	}
	function render(im){
		var obj=selectedItem(im);
		function innerhtmlfn(viewData){
			div(im).find('.gCity').html(tpl.comp_gcity({
				data:viewData,
				noreq:false,
				errRes:false
			}));
			alteraction(im,viewData);
		}
		if(obj.then){
			obj.then(innerhtmlfn)
		}else{
			innerhtmlfn(obj);
		}
	}
	function alteraction(im,viewData){
		var map={
			"0":"provinceCode",
			"1":"cityCode",
			"2":"areaCode",
			"3":"townCode"
		}
		function set(field,id){
			dfn(im)[map[field]]=id;
			dfn(im).current=field-0;
		}
		function set1(field,id,idx){
			if(field<3){
				var i=field;
				for(;i<4;i++){
					dfn(im)[map[i]]=null;
				}
				dfn(im).current=field-0 +1;
			}else{
				dfn(im).current=3
			}
			dfn(im)[map[field]]=id;
			
			//如果选择的是直辖市 跳过市的选择 
			if(field=="0"){
				if(id == "11000000"){//北京
					set1("1","11010000","0");
				}else if(id == "21000000"){//上海
					set1("1","21010000","0");
				}else if(id=="74000000"){ //重庆
					set1("1","74010000","0");
				}else if(id=="12000000"){ //天津
					set1("1","12010000","0");
				}
			}
			if(field=="3"){
				dfn(im).selectfn(getReturnParams(viewData.titles,id));
			}
		}
		function _render(){
			render(im);
		}
		//一到四级区域名称去重显示
		function uniqueChtm(name){
			//name格式：北京市,北京市,朝阳区,劲松街道
			return name.replace(/请选择/g,'').match(/([^,]+)(?!.*\1)/ig).join("")
		}
		//选择完第四级区域后组装返回的参数
		function getReturnParams(titles,id){
			function getTownName(){
				return u.find(function(item){return item.code==id},viewData.childrens)
			}
			if(id){
				var townName=getTownName();
				townName = townName?townName.label:'请选择'
			}else{
				var townName=viewData.childrens[0].label
			}
			return {
				"snam":titles[0].label,"sid":titles[0].code,
				"cnam":titles[1].label,"cid":titles[1].code,
				"xnam":titles[2].label,"xid":titles[2].code,
				"znam":townName,"zid":id,
				"chtm":uniqueChtm(titles[0].label+","+titles[1].label+","+titles[2].label+","+townName)
			}
		}
		div(im).find('[g-area-close]').on('click',function(){
			if(dfn(im).closefn){
				dfn(im).closefn()
			}else{
				div(im).find('.gCity').hide();
			}
		})
		if(dfn(im).auto){
			if(dfn(im).townCode){
				var val=getReturnParams(viewData.titles,dfn(im).townCode).chtm;
			}else{
				var val=getReturnParams(viewData.titles).chtm;
			}
			
			$(div(im).find('[show-label]')).attr('title',val).html(val)
			dfn(im).auto=false
		}
		ui.gpipes(div(im),{
			set:set,
			set1:set1,
			render:_render
		});
	}
	exports.gcity={
		make:u.curry(make)
	};
}(this,request,util,util_ui,GTPL));