/**门店选择**/
(function(exports,$,req,$page,u,ui,tpl){
	var globalreq=null;
	var globalCache={}; //根据acode缓存门店
	//接口后期变更 由一个接口拆分成两个接口所以增加下面函数
	//根据省市区查询门店
	function queryStore(pcode,ccode,acode){
		function makeCache(){
			var r = req.cachePromise(req.postApi,$page.site
				,"payment/getStoresByRegion"
				,{
					p:pcode,
					c:ccode,
					a:acode
				});
			globalCache[acode]=r;
			return r;
		}
		/*return globalCache[acode] != null ? globalCache[acode]()
		: makeCache()();*/
        return makeCache()();
	}
	function div(im){
		return im("div");
	}
	function datafn(im){
		return im("data");
	}
	function selectedProvice(im,data){
		var item = u.find(u.pipe(u.prop("id"),u.eq(datafn(im).provice)),data);
		return item;
	}
	function selectedCity(im,provice){
		var item = u.find(u.pipe(u.prop("id"),u.eq(datafn(im).city)),provice.childerns);
		return item;
	}
	function selectedArea(im,city){
		var item =  u.find(u.pipe(u.prop("id"),u.eq(datafn(im).area)),city.childerns);
		return item;
	}
	//当前已经选中的门店
	function selectedStore(im,storeList){
		return u.find(u.pipe(u.prop("id"),u.eq(datafn(im).area)),storeList)
	}
	function minNum(real,current){
		if(real<current)return real;
		return current;
	}
	//由于接口调整 导致原先同步的数据改为异步
	//im->data->Promise
	function selectedItem(im,data){
		function childernfn(current,storeList){
			if(current==0)return data;
			if(current==1)return provice.childerns;
			if(current==2)return city.childerns;
			if(current==3)return storeList;
		}
		var titles=[];
		var provice=selectedProvice(im,data);
		var current=datafn(im).current;
		if(provice==null){
			titles.push({name:"请选择"});
			return {
				current:minNum(0,current),
				titles:titles,
				childerns:childernfn(minNum(0,current))
			}
		}
		titles.push({name:provice.name,id:provice.id});
		var city=selectedCity(im,provice);
		if(city==null){
			titles.push({name:"请选择"});
			return {
				current:minNum(1,current),
				titles:titles,
				childerns:childernfn(minNum(1,current))
			}
		}
		titles.push({name:city.name,id:city.id});
		var area=selectedArea(im,city);
		if(area==null){
			titles.push({name:"请选择"});
			return {
				current:minNum(2,current),
				titles:titles,
				childerns:childernfn(minNum(2,current))
			}
		}
		titles.push({name:area.name,id:area.id});
		var d=$.Deferred();
		queryStore(provice.id,city.id,area.id).then(function(res){
			var store = selectedStore(im,res.data);
			if(store==null){
				titles.push({name:"请选择"});
			}else{
				titles.push({name:store.name,id:store.id});

			}
			d.resolve({
				current:minNum(3,current),
				titles:titles,
				childerns:childernfn(minNum(3,current),res.data)
			});
		});
		return d.promise();
		
	}
	function init(im){
		div(im).html(tpl.comp_gstore({noreq:true}));
		globalreq().then(function(data){
			render(im,data)
		});
	}
	//门店付款的交互
	function divaction(im,data,viewData){
		var map={
			"0":"provice",
			"1":"city",
			"2":"area",
			"3":"store"
		}
		function set(field,id){
			datafn(im)[map[field]]=id;
			datafn(im).current=field-0;
		}
		function set1(field,id,sidx){
			datafn(im)[map[field]]=id;
			datafn(im).current=field-0+1;

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
			if(field=="3")datafn(im).selectfn(viewData.childerns[sidx]);
		}
		function _render(){
			render(im,data);
		}
		ui.gpipes(div(im),{
			set:set,
			set1:set1,
			render:_render
		});
	}
	function render(im,data){
		var obj=selectedItem(im,data.data);
		function innerhtmlfn(viewData){
			div(im).html(tpl.comp_gstore({
				data:viewData,
				noreq:false
			}));
			divaction(im,data,viewData);
		}
		if(obj.then){
			obj.then(innerhtmlfn);
		}else{
			innerhtmlfn(obj);
		}
	}
	function make(div,config){
		/*if(globalreq==null)*/globalreq=req.cachePromise(req.postApi,$page.site,"payment/getStoreRegion");
		function r(flag){
			return {div:div,data:config}[flag];
		}
		init(r);
		return r;
	}
	exports.gstore={
		make:u.curry(make)
	};
}(this,$,request,$page,util,util_ui,GTPL));