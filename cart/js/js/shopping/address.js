!function(exports,u,ui,uw,req,panel,tpl,validate,installRemind){
    var TYPE="7address7";
    var emit=uw.emit(TYPE);
    //shopping.js中 动态设置进来的东西
    var $$={
        getPickingUpStores:null
    },
        cacheStoreLists = {};//门店自提列表缓存
    var addressDialogFn;
    function datafn(im){
        return im("data");
    }
    function div(im){
        return im('div');
    }
    //是否节能补贴
    function isAllowance(){
        return $page.site=="allowance";
    }
    function emitAddressSummary(div,data){
        emit("getAddressSummary",{
            errorfn:function(data1){
                init(div,data);
            },
            successFn:function(data1){
                if(data1.data.invalid){
                    $config.shoppingAddressAtom.novalidAddr=true
                }
                init(div,data);
            }
        })
    }
    function make(div,data){
        function r(flg){
            return {div:div,data:data}[flg]
        }
        if(isAllowance()){
            init(div,data);
        }else{
            //initOrder接口收货人无信息就请求辅助接口
            if(!data.list.length || data.isdefaultF){
                emitAddressSummary(div,data)
            }else{
                init(div,data);
            }
        }
        emit("renderEnd",r);
        return r;
    }
    function uniqueAddress(name){
        return name.match(/([^,]+)(?!.*\1)/ig).join("")
    }
    function transData(data){
        function trans(data){
            var r={},originAddress=data.address;
            r.uniqueAddress=uniqueAddress(originAddress.provinceName+","+originAddress.cityName+","+originAddress.countyName+","+originAddress.townName);
            r.name=data.name;
            r.nameArea=data.address.provinceName;
            r.areas=[
                data.address.cityName,
                data.address.countyName,
                data.address.townName,
                data.address.detailedAddress
            ];

            r.isdefault=data.address['default'];
            r.selected=data.selected;
            r.origin=data;
            return r;
        }
        function filterDefaultFalseFn(data){
            return data.address['default']==false
        }
        function isdefaultF(filterData){
            return data.consigneeCount == filterData.length
        }
        function mdTrans(data){
            data.ismdzt=true
            return data
        }
        if(data.consigneeInfos){
            var addressData={
                selectedList:u.filter(function(item){return item.selected==true},data.consigneeInfos),
                list: u.take(data.consigneeInfos.length,u.map(trans,data.consigneeInfos)),//普通地址
                mdList:u.take(data.gomeStoreStockInfos.length,u.map(mdTrans,data.gomeStoreStockInfos)),//门店地址
                isSupportGomeStore:data.supportGomeStore || false
                ,isdefaultF:isdefaultF(u.filter(filterDefaultFalseFn,data.consigneeInfos))
                ,open:data.open
            }
        }else{
            var addressData={
                selectedList:[],
                list: [],//普通地址
                mdList:u.take(data.gomeStoreStockInfos.length,u.map(mdTrans,data.gomeStoreStockInfos)),//门店地址
                isSupportGomeStore:data.supportGomeStore || false
                ,isdefaultF:false
                ,open:data.open
            }  
        }
        return addressData;
    }
    function setScrollAction(div){
        $config.shoppingAddressAtom.scrollY=div.find("#address_scroll_div").scrollTop();
    }
    function scrollAction(div){
        div.find("#address_scroll_div").scrollTop($config.shoppingAddressAtom.scrollY);
    }
    function init(div,data){
        ;(function(data){
            //上门服务——获取三级地址code
            var _selectedArea = u.find(u.prop("selected"),data.list);
            if(_selectedArea && _selectedArea.origin.address.countyCode){
                installRemind.setThreeArea(_selectedArea.origin.address.countyCode);
            }
        })(data);
        if(data.open){
            var selectedAddress=u.find(u.prop("selected"),data.list)||{};
            selectedAddress.close=false;
            selectedAddress.type="noAddress";
            newAddress(div,selectedAddress);
        }
        /**
         * 给地址添加 【isShow】
         * @param is 判断条件 值为['Y','N']
         * @param list
         */
        function addressIsShow(is,list){
            var isSelected = false;
            u.map(function(address){
                /*data添加【isShow】判断是否显示*/
                if(is ==='Y'){
                    if(address.selected){
                        address.isShow = true;
                        isSelected = true;
                    }else{
                        address.isShow = false;
                    }
                }else{
                    address.isShow = true;
                    isSelected = true;
                }
            },list);
            if(!isSelected ){
                if(list&& list[0]) list[0].isShow = true;
            }

        }
        // 给地址添加 【isShow】
        if(data.list) addressIsShow($config.shoppingAddressAtom.more,data.list);
        if(data.mdList) addressIsShow($config.shoppingAddressAtom.ztmore,data.mdList);

        //渲染收货地址主模块
        if(window.location.hash=='#ksg'){
            data.isShowksg=true
        }
        div.html(tpl.address_main(data));
        scrollAction(div);
        div.find("#address_scroll_div").scroll(function(){setScrollAction(div)});
        //鼠标划过 其下方操作按钮显示
        div
            .find("[g-hover-up]")
            .each(function(){
                $(this).hover(findAndShow("[g-hover]"),findAndHide("[g-hover]"))
            });
        //点击新增按钮
        div.find("#id_newAddress_btn").click(u.partial(newAddress,[div,{close:true,type:"new",data:data}]));
        //点击更多
        div.find("[g-more-path]").on("click",function(){
            var el=$(this);
            var value=el.attr("g-value");
            $config.shoppingAddressAtom.more=value;
            init(div,data);
        });
        //点击更多自提
        div.find("[g-zt-more-path]").on("click", function() {
            $config.shoppingAddressAtom.ztmore = $(this).attr("g-value");
            init(div, data);
        });
        //选中收获地址
        div.find("[g-sbtn-path]").on("click",function(){
            var div1=$(this);
            var path=div1.attr("g-sbtn-path").split(",");
            function selectfn(data){
                var item=u.path(path,data);
                emit("selected",item);
                return u.map(function(a){
                    if(a==item)return u.assoc("selected",true,a);
                    return u.assoc("selected",false,a);
                },data.list);
            }
            init(div,u.pipe(u.assoc("list", selectfn(data)))(data));
        });

        //设为默认地址
        div.find("[g-default-path]").on("click"
            ,ui.jqpipe(ui.attr("g-default-path")
                ,u.split(",")
                ,u.converge(reqDefaultAddress,[u.path(u.__,data),u.always(data)])
                ,u.partial(init,[div])));
        //删除
        div.find("[g-delete-path]").on("click"
            ,ui.jqpipe(ui.attr("g-delete-path")
                ,u.split(",")
                ,u.path(u.__,data)
                ,reqDeleteAddress));
        //修改
        div.find("[g-modify-path]").on("click"
            ,ui.jqpipe(
                ui.attr("g-modify-path")
                ,u.split(",")
                ,u.path(u.__,data)
                ,u.assoc("type","modify")
                ,u.assoc("close",true)
                ,u.partial(newAddress,[div])));
        //门店自提修改|添加
        div.find("[g-picking-up]").on("click",function(){
            var index = $(this).attr("g-picking-up");
            var item  = data.mdList[index] || {},
                selectedAddress = {},
                type  = 'EDIT';//类型为 "ADD","EDIT"
            //转换数据 将店铺数据转换为插件需要的数据结构
            !(function mappingData(data){
                item  = {
                     city      : data.cityCode  ||''//城市code
                    ,stateName : data.stateName ||''//省份name
                    ,cityName  : data.cityName  ||''//城市name
                    ,storeId   : data.storeCode ||''//店铺id
                    ,id:data.id|| ''
                }
            })(item);

            //处理 添加
            if(!item.city){
                type = 'ADD';
                selectedAddress = u.pipe(u.find(u.prop("selected")) || {},u.path(['origin','address']))(data.list);
                item.city       = selectedAddress.cityCode || -1;
                item.stateName  = selectedAddress.provinceName || '';
                item.cityName   = selectedAddress.cityName || '';
            }

            if(cacheStoreLists[item.city]){
                _dialogPackingUp(cacheStoreLists[item.city]);
            }else if(item.city){
                //调用接口并渲染弹框
                $$.getPickingUpStores(item.city).then(function(data){
                    if(data.success==false) return panel.alert(data.errMsg);
                    cacheStoreLists[item.city]= data;

                    //渲染弹框
                    _dialogPackingUp(data);
                });
            }

            function _dialogPackingUp(data) {

                function filterStores(area){
                    var enabledStorefn=u.pipe(u.prop("enabled"),u.eq("1"));
                    var stores = u.filter(enabledStorefn,area.gomeStoreList);
                    area.gomeStoreSet=stores;
                    return area;
                }
                function areaStorelengthGt0(a){
                    return a.gomeStoreSet&&a.gomeStoreSet.length>0;
                }
                var doFilter=u.pipe(u.map(filterStores),u.filter(areaStorelengthGt0));
                dialogPickingUp(div, {pickingUP: item, list: doFilter(data.data), type: type});
            }
        });
        /**
         * 门店 选取
         */
        div.find('[g-meidian-on]').on("click",function(){
            if($(this).hasClass('btn-checked')){
                //TODO 门店选取
                emit("removeGomeStore",{storeAddressId:$(this).attr('g-meidian-on')});
            }else{
                //TODO 门店选取
                emit("selectedGomeStore",{storeAddressId:$(this).attr('g-meidian-on')});
            }
        })
    }
    var findAnd = u.curry(function(selector,fn){
        return ui.jq(u.pipe(ui.find(selector),fn));
    });
    function findEmAddClass(clazz){
        return ui.jqpipe(ui.find("em"),ui.addClass(clazz));
    }
    function findEmRemoveClass(clazz){
        return ui.jqpipe(ui.find("em"),ui.removeClass(clazz));
    }
    function findBAddRemoveClass(clazz,rclazz){
        return ui.jqpipe(ui.find("b"),ui.addClass(clazz),ui.removeClass(rclazz));
    }
    var findAndShow = findAnd(u.__,ui.show);
    var findAndHide = findAnd(u.__,ui.hide);

    function reqDefaultAddress(item,data){
        emit("setDefaultAddress",item);
        function isdefault(a){
            return a.isdefault;
        }
        function defaultAddressfn(item){
            return u.map(u.ifn(u.eq(item),u.assoc("isdefault",true),u.assoc("isdefault",false)))
        }
        function defaultToTop(arr){
            return u.concat(u.filter(isdefault,arr),u.reject(isdefault,arr));
        }
        return u.assoc("list"
            ,u.pipe(defaultAddressfn(item),defaultToTop)(data.list)
            ,data);
    }
    function reqDeleteAddress(item){
        var options = u.ifn(u.pipe(u.prop("ismdzt"), u.eq(true)), function() {
            return {
                title: "删除地址?",
                event: "removeGomeStore",
                body: "您确定要删除该门店自提地址吗?"
            }
        }, function() {
            return {
                title: "删除地址?",
                event: "removeAddress",
                body: "您确定要删除该收货地址吗?"
            }
        })(item);
        panel.confirmOk({ title: options["title"], body: options["body"] }, function(dialog) {
            dialog.hide();
            emit(options["event"], item);
        });
    }

    //当前选中的收货地址
    function selectedAddress(im){
        var data=datafn(im);
        return u.find(u.prop("selected"),data.list);
    }
    //修改选中的收获地址
    function modify(im){
        var data=selectedAddress(im);

        data=u.assoc("close",true,data);
        data=u.assoc("type","modify",data);
        return newAddress(div(im),data);
    }
    function newAddress(div,data){
        var storesLength = data.data && data.data.mdList.length || 0;
        if(data.type=="new"){
            if(data.data.list.length>=20 ){
                panel.confirmOk($config.notice.addressConfirm,function(dialog){
                    data.type="confirm-new";
                    dialog.hide();
                    return newAddress(div,data);
                });
                return;
            }
        }
        var dialog = addressDialogFn = $.gDialog({
            html: tpl.address_new(data),
            modal:{}
        });
        dialog.show();
        ui.gpipes(dialog.$dialog,{
        });
        var uncheckbox=u.pipe(ui.removeClass("checkbox_chose"),ui.addClass("checkboxs"),ui.setAttr("value","0"));
        var checkbox=u.pipe(ui.removeClass("checkboxs"),ui.addClass("checkbox_chose"),ui.setAttr("value","1"));
        var defaltAddressCheckboxCallback=ui.jq(u.ifn(ui.is(".checkbox_chose"), uncheckbox, checkbox));

        //设置默认地址
        $("#id_newAddress [name=defaultAddress]").click(defaltAddressCheckboxCallback);

        //新增收货人tab签切换，自提地址模板处理
        $('#id_addtab').find('li').off('click').on('click',function(){
            var idx=$(this).index(),selectedconsignee=[];
                //获取普通收货人中已选中地址信息，与门店地址一二级联动
            if(data.data.selectedList && data.data.selectedList.length){
                selectedconsignee=data.data.selectedList[0].address;
            }
            $('#id_addtab').find('li').removeClass('active')
            $(this).addClass('active')
           $('.consigneeContentTab').hide().eq(idx).show();
           //如果为自提门店
           if(idx==1){
                loadListOfItem_pickingUp($('.consigneeContentTab').eq(1),selectedconsignee)
           }

        })
        function loadListOfItem_pickingUp(div,item){
            //赋值给模板
            item.stateName=item.provinceName;
            //调用接口并渲染弹框
            if(item.cityCode) $$.getPickingUpStores(item.cityCode).then(function(data){
                if(data.success==false) return panel.alert(data.errMsg);
                function filterStores(area){
                    var enabledStorefn=u.pipe(u.prop("enabled"),u.eq("1"));
                    var stores = u.filter(enabledStorefn,area.gomeStoreList);
                    area.gomeStoreSet=stores;
                    return area;
                }
                function areaStorelengthGt0(a){
                    return a.gomeStoreSet&&a.gomeStoreSet.length>0;
                }
                var doFilter=u.pipe(u.map(filterStores),u.filter(areaStorelengthGt0));

                //渲染弹框
                var datas = {pickingUP:item,list:doFilter(data.data),type:'ADD'};
                datas =  addEventOnArea(datas);
                var fatherDom = div.find('#add-address-stores');
                fatherDom.html(tpl.listOfItem_pickingUp(datas));
                fatherDom.hideF = addressDialogFn;
                addressFtlByStore(fatherDom,datas,storesLength||0);
            });
        }
        function errStylefn(err,tipel,textel){
            function fn1(){
                tipel.hide();
                textel.removeClass("error")
            }
            function fn2(err){
                textel.addClass("error");
                tipel.html('<span style="color:#f00;">'+err+"</span>");
                tipel.show();
            }
            return u.ifn(u.isEmpty,fn1,fn2)(err);
        }
        //手机号
        if(data.type=="modify"){
            dialog.$dialog.find("input[g-validate=phone]").one("focus",function(){
                $(this)
                    .val('')
                    .attr("m","true");
            });
        }

        dialog.$dialog.find("[g-validate]").blur(function(){
            var vval=$(this).attr("g-validate");
            var fillel=dialog.$dialog.find("[g-tip-validate="+vval+"]");
            var textel=dialog.$dialog.find("[g-validate="+vval+"]");
            var vals=$(this).val()||$(this).attr("value");
            function errcbk(err){
                return errStylefn(err,fillel,textel);
            }
            var vas=[[vals,vval,errcbk]];
            /*if(vval=="phone"||vval=="call"){
             var vals2=[dialog.$dialog.find("[name=phone]").val(),
             dialog.$dialog.find("[name=call]").val()];
             vas.push([vals2,"phone-call",function(err){
             var textel=dialog.$dialog.find('[g-validate=phone-call]');
             var tipel=dialog.$dialog.find('[g-tip-validate=phone-call]');
             return errStylefn(err,tipel,textel);
             }]);
             }*/
            validate.validate(vas);
        });
        //保存地址
        $("#id_saveAddress").on("click",function(){
            var velkeys=[];
            function getPhoneValidatStr(el){
                if(data.type=="modify"){
                    if(el.attr("m")!="true"){
                        //如果点击修改，并且没有被修改过手机号
                        return "17090114267";
                    }
                }
                return el.val();
            }
            dialog.$dialog.find("[g-validate]").each(function(){
                var vval=$(this).attr("g-validate");
                var fillel=dialog.$dialog.find("[g-tip-validate="+vval+"]");
                var textel=dialog.$dialog.find("[g-validate="+vval+"]");
                var vals=$(this).val()||$(this).attr("value");
                if(vval=="phone"){
                    vals=getPhoneValidatStr(textel);
                }
                function errcbk(err){
                    return errStylefn(err,fillel,textel);
                }
                if(vval=="phone-call"){
                    var phonetxt=dialog.$dialog.find("[name=phone]");
                    var vals=[getPhoneValidatStr(phonetxt), dialog.$dialog.find("[name=call]").val()];
                }
                velkeys.push([vals,vval,errcbk]);

            });
            if(validate.validate(velkeys)){
                $config.shoppingAddressAtom.novalidAddr=false
                var pobj=ui.searForm($("#id_newAddress"));
                if(data.type=="modify"){
                    emit("updateAddress",u.assoc("id",data.origin.owerId,pobj));
                }else{
                    emit("newAddress",pobj);
                }
                dialog.hide();
            }
        });
        var dialogHideCallBack=ui.cbk(dialog,ui.hide);
        //关闭
        $("#closeaddress").click(dialogHideCallBack);
        //选择地区
        var gcdat=(function(data){
            if(data.type!="modify")return null;
            return [
                data.origin.address.countyCode,
                data.origin.address.provinceName+data.origin.address.cityName+data.origin.address.countyName+data.origin.address.townName,
                data.origin.address.cityCode,
                data.origin.address.provinceCode,
                data.origin.address.townCode
            ].join("|");
        }(data));
        gcity.make($("#id_address_select"),gcdat,{
            selectfn:function(data){
                var value=data.sid+"."+data.cid+"."+data.xid+"."+data.zid;
                $("#id_address_select").find("[name=address]").attr("value",value);
                $("#id_address_select").find("[show-label]").html(data.chtm);
                $("#id_address_select").find(".add_out,.gCity").hide();
                dialog.$dialog.find("[g-tip-validate=address]").html("");
            },
            closefn:function(){
                dialog.$dialog.find(".add_out,.gCity").hide();
            }
        })
        ui.hoverUpBySelector($("#id_address_select"),".add_out,.gCity");
    }
    //open字段判断是否展开地址
    function notPupup(im) {
        return !datafn(im).open
    }

    /**********************************门店 start**************************************/

    var dialogs = [];//存储当前已经打开的dialog  在dialogPickingUp方法中只能得到当前的dialong，所以只能添加一个dialogs 的属性，在外面
    /**
     * 添加门店地址独立弹框
     * @param im
     * @author caoyi
     * @param data
     */
    function dialogPickingUp(im,data){
        "use strict";
        clearDialog();
        data.isDialog = true;
        data = addEventOnArea(data);
        var dialog = $.gDialog({
                            html:tpl.listOfItem_pickingUp(data)
                            ,modal:{}
                        }).show() //显示dialog及选择区域
            ,div    = dialog.$dialog;

        dialogs.push(dialog);
        addressFtlByStore(div,data);
        addEvent();

        /**
         * 清空前面的dialong，
         * 因为 在dialogPickingUp方法中只能得到当前的dialong，所以只能添加一个dialogs 的属性，在外面
         * @returns {boolean}
         */
        function clearDialog(){
            if(!dialogs || dialogs.length<1){
                return false;
            }
            for(var i=0,len=dialogs.length; i<len; i++){
                dialogs[i].hide();
            }
            dialogs = [];
        }
        function addEvent(){
            //点击关闭
            div
                .find("[g-close]")
                .on("click",function(){
                    dialog.hide();
                });
        }
    }

    /**
     * 向data中添加选择区域的方法，供模板中使用
     * @param data
     * @author caoyi
     * @returns {*}
     */
    function addEventOnArea(data){
        "use strict";
        var storeId = data.pickingUP.storeId;//storeId 为整体变量，选择店铺时改变值

        data.selectedArea=selectedArea;
        data.isSelectArea=isSelectArea;

        /***添加到选择地区事件***/
        function isSelectArea(area){
            if(area.gomeStoreSet)
                return u.find(u.pipe(u.prop("storeCode"),u.eq(storeId)),area.gomeStoreSet);
            return false;
        }

        /**
         * 返回选中的，如果没有被选中，则返回第一个
         * @param list
         * @returns {*}
         */
        function selectedArea(list){
            var r = u.find(isSelectArea,list);
            return r==null?list[0]:r;//如果为空，默认显示为第一个
            //return r==null?false:r;//如果为空，默认为false
        }
        return data;
    }
    /**
     * 渲染显示 选择门店 模板，并将模板显示到【div】中
     * @todo 有坑 后期重构
     * @author caoyi
     * @param div 父节点 模板展示父节点
     * @param data.type 类型为 "ADD","EDIT" --类型 保存时，不同的类型走不同的接口
     *        data.pickingUP 选中状态数据 {city：城市code； stateName：省份name； cityName：城市name; storeId: 店铺id,id:xxxxx};
     *        data.list 所有数据
     */
    function addressFtlByStore(div,data,storesLength){
        "use strict";
        /*
         *使用状态模式
         * 在该方法内，使用闭包存放 【data】，【area】,【storeId】全局改变状态
         */
        var data = data
            ,area = {} //整体变量
            ,storeId = data.pickingUP.storeId
                            ||(data.list[0] && data.list[0].gomeStoreSet[0] && data.list[0].gomeStoreSet[0].storeCode)  //storeId 为整体变量，选择店铺时改变值
            ,type   = data.type || 'ADD'//类型为 "ADD","EDIT"

        /***添加到选择店铺事件***/
        function isSelectStore(store){
            return store.storeCode==storeId;
        }

        //渲染自提门店
        function renderStores(div){
            if(!data.list || data.list.length<1){
                div.find("#pks-saveStore").removeClass('btn-primary').addClass('btn-minor');
                addEventByStores();
                div.find("#pks-saveStore").unbind('click');
                div.find(".js_isStores").hide();
                div.find("#store-content").children().css({marginLeft:"67px"});
                return ;
            }
            div.find(".js_isStores").show();
            area.isSelectStore=isSelectStore;
            selectedFirst(area.gomeStoreSet);
            div.find("#pks-saveStore").removeClass('btn-minor').addClass('btn-primary');
            //显示选择自提门店html
            div.find("#store-content").html(tpl.listOfItem_pickingUp_stores(area));
            addEventByStores();
        }

        function selectedFirst(arry){
            if(!arry || arry.length<1){
                return arry;
            }
            for(var i=0,len=arry.length; i<len; i++){
                var item = arry[i];
                if(isSelectStore(item)){
                    arry.unshift(item);
                    arry.splice(i+1,1);
                    return arry;
                }
            }
            return arry;
        }

        //添加事件
        function addEvnet(){
            //下拉框设置
            div.find("[g-select]").on("click",function(){
                div.find("[g-select-body]").toggle();
                return false;
            });
            div.on("click",function(){
                // if($(this).is("[g-select]"))return;
                div.find("[g-select-body]").hide();
            });
            //点击下拉框选项
            div.find("[s-idx]").on("click",function(){
                var idx=$(this).attr("s-idx");
                area = data.list[idx];
                renderStores(div);
                div.find("[g-title]").html($(this).html());
            });
            //保存门店自提
            div.find("#pks-saveStore").on("click",function(){
                //TODO 接口未定，通过不同的类来走不同的接口 type 类型为 "ADD","EDIT"
                function _addEmit() {
                    emit("newGomeStore", {
                        storeCode: storeId
                    });
                }
                function _updataEmit() {
                    emit("updateGomeStore", {
                        id: data.pickingUP.id,
                        storeCode: storeId
                    });
                }
                function _hide() {
                    div.hide();
                    if (dialogs && dialogs[0]) dialogs[0].hide();
                    if (div.hideF)  div.hideF.hide();
                }

                if(type=="ADD"){
                    if(storesLength && storesLength>=5 ){
                        panel.confirmOk($config.notice.addressConfirmByStore,function(dialog){
                            dialog.hide();
                            _addEmit();
                            _hide();
                        });
                        return;
                    }
                    _addEmit();
                    _hide();
               }else{
                    _updataEmit();
                    _hide();
               }
            });
            //点击关闭
            div
                .find("[g-close]")
                .on("click",function(){
                    div.hide();
                    if(dialogs && dialogs[0]) dialogs[0].hide();
                    if(div.hideF) div.hideF.hide();
                });
            addEventByStores();
        }

        /**
         * 门店选取事件
         */
        function addEventByStores(){
            //自提门店选择事件
            div.on("click","[store-idx]",function(e){
                var idx = $(this).attr("store-idx");
                var lists = $(this).parents('.js-stores-lists');
                $(lists).find('[store-idx]').removeClass(' btn-checked');
                $(lists).find('[store-idx]').find('i').remove();
                $(this).addClass('btn-checked');
                $(this).append('<i class="c-i chose_icon"></i>');
                var store=area.gomeStoreSet[idx];
                storeId=store.storeCode;
                // renderStores(div,area);
            });
        }

        !(function _init(){
            area = data.selectedArea(data.list);
            addEvnet();
            renderStores(div);

        })();

    }

    /**********************************门店 end**************************************/

    exports.address={
        make:u.curry(make),
        $$:$$,
        TYPE:TYPE,
        modify:modify,
        selectedAddress:selectedAddress,
        notPupup:notPupup,
        transData:transData
    };
}(this,util,util_ui,util_watch,request,panel,GTPL,validate,InstallRemind);