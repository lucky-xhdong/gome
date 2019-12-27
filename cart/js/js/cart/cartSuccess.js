var addCartBase = {
    "getAjax":function(dat){
        /* _d:传递给callback方法中需要的数据*/
        /* _d:{data:"请求响应的信息",Param:"特殊参数"}*/
        var _d={};_d.data=undefined;
        try{
            var _ajax = $.ajax({
                type:'get',
                url:dat.Url,
                data:dat.RequestData||{},
                dataType:dat.dataType||'jsonp',
                jsonpName:dat.JsonpName||'',
                jsonpCallback:dat.JsonpName||'',
                timeout:5000,
                beforeSend:function(){
                    if(dat.BeforeSend){
                        dat.BeforeSend.apply();
                    }
                },
                success:function(data){
                    _d.data=data;
                    if(dat.Param)_d.Param=dat.Param;
                    if(dat.Callback){
                        dat.Callback.apply(_d);
                    }
                },
                error:function(req,error){
                  if(dat.ErrorSend){
                      dat.ErrorSend.apply();
                  }
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                    if(status=='timeout'){//超时,status还有success,error等值的情况
                     _ajax.abort(); //取消请求
                    if(dat.ErrorSend){
                        dat.ErrorSend.apply();
                    }
                    }
                }
            });
        }catch(ex){};
    }
}
var addCartApp = {
    init:function(){
    var _this = this;
    var url = window.location.href.split("?")[1];
    var initPargam = {}
    if(url){
      var urlPrama= url.split("&");
      $.each(urlPrama,function(i,value){
        initPargam[urlPrama[i].split("=")[0]] = urlPrama[i].split("=")[1] 
      })
    }
    //_this.site = (initPargam.homesite == "haiwaigou")?"home":initPargam.homesite
    _this.addCartFn(initPargam);
    _this.bindFn();
    _this.setScreen()
    addCartApp.itemInfo.sid=initPargam.sid;
    addCartApp.itemInfo.pid=initPargam.pid;
  },
  "site":"home",
  "setScreen":function(){
    var winWidth = window.screen.width,
      objb = document.body;
    if (winWidth<=1024) {
      objb.className += " " +"w990";
    }else {
      objb.className=objb.className.replace("w990", '');
    }
  },
  "getCartData":function(){
    var _this = this;
    var request_data = {
        dataType: 'jsonp',
        JsonpName: "rec",
        Url: "//cart"+cookieDomain+"/home/api/cart/loadSuccessCart",
        Callback: _this.renderCartData,
        BeforeSend:function(){
          $("#cartItemLists").addClass("cartLoading")
        }
    };
    addCartBase.getAjax(request_data);
  },
  "getCartNumber":function(){
    var requestCartNum_data = {
        JsonpName: "rec",
        Url: "//cart"+cookieDomain+"/home/api/cart/getCartItemCount",
        Callback: function(){
          if(this.data.success){
            $("#cartSuccessNum").text(this.data.data);
          } 
        },
        dataType: 'jsonp'
    };
    addCartBase.getAjax(requestCartNum_data);
  },
  "renderCartData":function(){
    var _data = this.data;//cdata
    if(this.data.success){
      $("#cartItemLists").removeClass("cartLoading");
      var renderData = $.extend(true, {}, _data.data, addCartApp.promotionsTypes)
      var listTpl = template.compile(addCartApp.templateCart());
      if(renderData.itemsGroups){var renderItemsGroups=renderData.itemsGroups;
        for(var i=0;i<renderItemsGroups.length;i++){
           if(renderItemsGroups[i].promotionHeads && renderItemsGroups[i].promotionHeads.length>0){
              renderItemsGroups[i].dataTrans={};
              for(var j=0;j<renderItemsGroups[i].promotionHeads.length;j++){
                  var itemGroupsij=renderItemsGroups[i].promotionHeads[j];
                  for(var k=0;k<itemGroupsij.length;k++){
                    if(itemGroupsij[k].shopId=='GOME'){
                       renderItemsGroups[i].dataTrans.isShowMHead=true;
                    }
                    if(itemGroupsij[k].shopId!='GOME' && itemGroupsij[k].selected && itemGroupsij[k].satisfied){
                       renderItemsGroups[i].dataTrans.isShowMHead=true;
                    }
                    renderItemsGroups[i].dataTrans.type=itemGroupsij[k].type;
                  }
              }
           }
        }
     }
      var htmlstr=listTpl(renderData);
      $("#cartItemLists").empty().css("background","none").append(htmlstr=="{Template Error}"?"":htmlstr);
      $("#cartSuccessTotals,#cartSuccessTotals_b").text(renderData.cartProfile.itemCount);
      var parseF = parseFloat(renderData.cartProfile.totalAmount);
      var parseI = parseInt(renderData.cartProfile.totalAmount);
      var totalPriceValue = (parseF === parseI)?(parseF + '.00'):parseF;
      $("#totalPrice_b").text(totalPriceValue);
    }
    if(addCartApp.renderReced ==null){
      addCartApp.getRecItems();
      addCartApp.renderReced=true;
    }
  },
  "getRecItems":function(){
    var _this = this;
    var _cdrgn = addCartApp.itemInfo._cdrgn;
    var _bdarea = "";
    if (_cdrgn && _cdrgn.length > 0) {
        _bdarea = _cdrgn.split("|")[0];
    }
    var request_data = {
          Url: "//bigd.gome.com.cn/gome/rec",
          JsonpName:"rec",
          RequestData:{
            boxid: 'box17',
            area: _bdarea,
            cid: addCartApp.itemInfo.cid,
            uid:addCartApp.itemInfo.uid,
            imagesize: 100,
            sid:addCartApp.itemInfo.sid,
            pid:addCartApp.itemInfo.pid
          },
          Callback: _this.renderRecItems,
          dataType: 'jsonp',
          Param:{"id":"d-tuijian"}
      };
    addCartBase.getAjax(request_data);
  },
  "renderRecItems":function(){
    var listTpl = template.compile(addCartApp.itemTemplate());
    $("#" + this.Param.id).empty().css("background","none").append(listTpl(this.data)).attr("op",true);
  },
  "getRecentItems":function(){
    var _this = this;
    var _cdrgn = addCartApp.itemInfo._cdrgn;
    var _bdarea = "";
    if (_cdrgn && _cdrgn.length > 0) {
        _bdarea = _cdrgn.split("|")[0];
    }
    var request_data = {
          Url: '//ss' +cookieDomain + '/item/v1/browse/prdreturn/' + addCartApp.itemInfo.recent_pid.replace(/[\[\]\"]/g,"") +'/100/flag/item/wp',
          JsonpName:"wp",
          Callback: _this.renderRecentItems,
          dataType: 'jsonp',
          Param:{"id":"d-liulan"}
      };
    addCartBase.getAjax(request_data);
  },
  "renderRecentItems":function(){
    if(this.data.result && this.data.result[0].url){
      var listTpl = template.compile(addCartApp.itemTemplate_recent());
      $("#" + this.Param.id).empty().css("background","none").append(listTpl(this.data)).attr("op",true);
    }else{
      $("#" + this.Param.id).empty().css("background","none").append("<p class='requesItemError'>暂无相关记录，<a style='color:#006699' href='//www"+cookieDomain+"/' target='_blank'>去逛逛</a>吧</p>");
    }
  },
  "getFavoriteItems":function(){
    var _this = this;
    var _cdrgn = addCartApp.itemInfo._cdrgn;
    var _bdarea = "";
    if (_cdrgn && _cdrgn.length > 0) {
        _bdarea = _cdrgn.split("|")[0];
    }
    var request_data = {
          Url: '//member'+cookieDomain+'/myaccount/myFavorites/getFavoritesGoodsForShopCart',
          JsonpName:"ckdata",
          RequestData:{
            currPageNum: 1,
            pageSize: 8,
            districtCode: _bdarea
          },
          Callback: _this.renderFavoriteItems,
          dataType: 'jsonp',
          Param:{"id":"d-shouchang"},
          ErrorSend:function(){
            $("#d-shouchang").empty().css("background","none").append("<p class='requesItemError'>请登录后查看“我的收藏”<a class='bnt' href='//login"+cookieDomain+"/login' target='_blank'>立即登录</a></p>");
          }
      };
    addCartBase.getAjax(request_data);
  },
  "renderFavoriteItems":function(){
    if(this.data.error){
      $("#" + this.Param.id).empty().css("background","none").append("<p class='requesItemError'>请登录后查看“我的收藏”<a class='bnt' href='//login"+cookieDomain+"/login' target='_blank'>立即登录</a></p>");
      return false;
    }
    var listTpl = template.compile(addCartApp.itemTemplate_favorite());
    $("#" + this.Param.id).empty().css("background","none").append(listTpl(this.data)).attr("op",true);
  }
}
//添加促销活动类型
addCartApp.promotionsTypes = {
  "promotionsType":{
    "GOME_MAN_JIAN":"满减",
    "GOME_MAN_FAN":"满返",
    "GOME_MAN_ZENG":"满赠",
    "GOME_JIA_JIA_HUAN_GOU":"加价购",
    "GOME_MAN_ZHE":"满折",
    "GOME_DA_PEI_GOU":"搭配购",
    "NPOP_SHOP_MAN_JIAN":"满减",
    "NPOP_SHOP_MAN_FAN":"满返",
    "NPOP_SHOP_MAN_FAN":"满返",
    "NPOP_SHOP_JIA_JIA_HUAN_GOU":"加价购",
    "NPOP_SHOP_MAN_ZENG":"满赠",
    "NPOP_SHOP_MAN_ZHE":"满折",
    "NPOP_SHOP_GOUWUQUAN":"购物券",
    "NO_USE":"",
    "NPOP_KDP_MJ":"跨店铺满减",
    "NPOP_KDP_MM":"跨店铺满免"
  }
}
//购物车中商品 sid pid 集合
addCartApp.itemInfo = {
  "sid":[],
  "pid":[],
  "_cdrgn":$.cookie("atgregion")||"11010200|北京市朝阳区(五环里)全部区域|11010000|11000000|110102001",
  "cid":$.cookie("__c_visitor"),
  "uid":$.cookie("DYN_USER_ID") ? $.cookie("DYN_USER_ID") : "",
  "recent_pid":$.cookie("proid120517atg")||'["0-0"]'
}

//购物车中商品模板
addCartApp.templateCart = function(){
  return '\
  <%if(itemsGroups){%>\
  <%var commerceItems = itemsGroups%>\
  <%for(var i = 0,j = commerceItems.length;i<j;i++){%>\
  <li class="clearfix">\
    <a class="i-pic" href="<%=commerceItems[i].itemsGroup.itemURL%>"><img class="img-suc-prd mr10 ml10" src="<%=commerceItems[i].itemsGroup.itemImageURL%>"></a>\
    <%if(commerceItems[i].promotionHeads && commerceItems[i].promotionHeads.length > 0){%>\
      <p class="i-name">\
        <%if(commerceItems[i].dataTrans.isShowMHead){%>\
           <span class="i-promotion">[<em><%=promotionsType[commerceItems[i].dataTrans.type]%></em>]</span>\
        <%}%>\
        <a title="<%=commerceItems[i].itemsGroup.itemName%>" href="<%=commerceItems[i].itemsGroup.itemURL%>"><%=commerceItems[i].itemsGroup.itemName%></a>\
      </p>\
      <span class="i-price">¥<%=commerceItems[i].subAmount.toFixed(2)%></span>\
      <%if(commerceItems[i].dataTrans.type=="GOME_MAN_JIAN" || commerceItems[i].dataTrans.type=="NPOP_KDP_MJ"){%>&nbsp;&nbsp;[&nbsp;<span class="cmain">满减总价</span>&nbsp;]<%}%>\
      <%if(commerceItems[i].dataTrans.type=="NPOP_KDP_MM"){%>&nbsp;&nbsp;[&nbsp;<span class="cmain">满免总价</span>&nbsp;]<%}%>\
    <%}else{%>\
        <p class="i-name"><a title="<%=commerceItems[i].itemsGroup.itemName%>" href="<%=commerceItems[i].itemsGroup.itemURL%>"><%=commerceItems[i].itemsGroup.itemName%></a></p>\
        <p class="i-price">¥<%=commerceItems[i].itemsGroup.salePrice.toFixed(2)%>X<%=commerceItems[i].itemsGroup.quantity%></p>\
      <%}%>\
  </li>\
  <%}%>\
  <%}%>\
  '
}
//购物车底部商品模板
addCartApp.itemTemplate = function(){
  return '\
  <%if(lst){%>\
    <%for(var i = 0,j=lst.length;i<j;i++){%>\
      <div class="d-item">\
         <p><a href="<%=lst[i].purl%>" \
           <%if(lst[i].maima_param){%>\
              maima_param="<%=lst[i].maima_param%>"\
           <%}%>\
              title="<%=lst[i].pn%>" target="_blank"><img src="<%=lst[i].iurl%>" alt="<%=lst[i].pn%>" class="pic"></a></p>\
         <p class="desc"><a href="<%=lst[i].purl%>"\
                    <%if(lst[i].maima_param){%>\
                      maima_param="<%=lst[i].maima_param%>"\
                   <%}%>\
                    class="name" target="_blank"><%=lst[i].pn%></a></p>\
         <p class="cmain fwb"><b>¥</b><%=lst[i].price%></p>\
         <p class="add">\
          <a sid="<%=lst[i].sid%>"\
             pid="<%=lst[i].pid%>"\
             <%if(lst[i].maima_param){%>\
               maima_param="<%=lst[i].maima_param%>"\
             <%}%>\
            href="javascript:void(0);" class="nBtn addToCart">加入购物车</a></p>\
         <p class="overlayer"></p>\
       </div>\
    <%}%>\
  <%}%>\
  '
}
//购物车底部商品最近浏览模板
addCartApp.itemTemplate_recent = function(){
  return '\
  <%if(result){%>\
    <%for(var i = 0,j=result.length;i<j;i++){%>\
      <div class="d-item">\
         <p><a href="<%=result[i].url%>" title="<%=result[i].name%>" target="_blank"><img src="<%=result[i].pic%>" alt="<%=result[i].name%>" class="pic"></a></p>\
         <p class="desc"><a href="<%=result[i].url%>" class="name" target="_blank"><%=result[i].name%></a></p>\
         <p class="cmain fwb"><b>¥</b><%=result[i].price%></p>\
         <p class="add"><a sid="<%=result[i].skuId%>" pid="<%=result[i].productId%>" href="javascript:void(0);" class="nBtn addToCart">加入购物车</a></p>\
         <p class="overlayer"></p>\
       </div>\
    <%}%>\
  <%}%>\
  '
}
//购物车底部商品我的收藏模板
addCartApp.itemTemplate_favorite = function(){
  return '\
  <%if(result){%>\
    <%var item = result.favoritesList.pagination.list%>\
    <%if(item.length>0){%>\
      <%for(var i = 0,j=item.length;i<j;i++){%>\
        <div class="d-item">\
           <p><a href="<%=item[i].productUrl%>" title="<%=item[i].skuName%>" target="_blank"><img src="<%=item[i].imageUrl%>" alt="<%=item[i].skuName%>" class="pic"></a></p>\
           <p class="desc"><a href="<%=item[i].productUrl%>" class="name" target="_blank"><%=item[i].skuName%></a></p>\
           <p class="cmain fwb"><b>¥</b><%=item[i].skuPrice%></p>\
           <p class="add"><a sid="<%=item[i].skuId%>" pid="<%=item[i].productId%>" href="javascript:void(0);" class="nBtn addToCart">加入购物车</a></p>\
           <p class="overlayer"></p>\
         </div>\
      <%}%>\
    <%}else{%>\
      <p style="padding: 10px 20px">暂无数据</p>\
    <%}%>\
  <%}%>\
  '
}

addCartApp.addCartFn = function(pargam,obj){
  var _this = this;
  delete pargam.homesite;
  
  var request_data = {
    JsonpName: "cart",
    Url: "//cart"+cookieDomain+"/"+_this.site+"/api/cart/addToCart",
    RequestData:pargam,
    dataType: 'jsonp',
    Callback: function(){
        if(this.data.data){
            _this.getCartData();
            _this.getCartNumber();
            if(obj){
              var overlayer = $(obj).parents(".d-item").find(".overlayer");
              overlayer.text("添加成功").fadeIn(function(){
                setTimeout(function(){overlayer.hide()},1000)
              });
            }
        }else{
            if(obj){
                if(this.data.status == "MTK_ITEM" ){
                   window.location.href='//card'+cookieDomain;           
                   return;
                }else{
                   var overlayer = $(obj).parents(".d-item").find(".overlayer");
                   overlayer.text("添加失败").fadeIn(function(){
                   setTimeout(function(){overlayer.hide()},1000)
                   });
                 }   
            }else{
              _this.getCartData();
              _this.getCartNumber();
            }
            if(this.data.errCode != "003001038"){
                  alert(this.data.errMsg)
            }
        }
    }
  };
  addCartBase.getAjax(request_data);
}

addCartApp.bindFn = function(){
  var _this = this;
  $("#bootbox-content").delegate(".addToCart","click",function(){
    
    var param = {
      "type":"0",
      "sid":$(this).attr("sid"),
      "pid":$(this).attr("pid"),
      "homesite":"home",
      "pcount":1,
      "_r":new Date().getTime()
    }
    _this.addCartFn(param,$(this))
    /*var request_data = {
        JsonpName: "cart",
        Url: "http://cart"+cookieDomain+"/home/api/cart/addToCart",
        RequestData:{
          "type":"0",
          "sid":$(this).attr("sid"),
          "pid":$(this).attr("pid"),
          "pcount":1,
          "_r":new Date().toString()
        },
        Callback: function(){
          if(this.data.success){
            _this.getCartData();
            overlayer.text("添加成功").fadeIn(function(){
                setTimeout(function(){overlayer.hide()},5000)
            });
          }else{
            overlayer.text("添加失败").fadeIn(function(){
                setTimeout(function(){overlayer.hide()},5000)
            });
            console.log(this.data.errMsg)
          }
        },
        dataType: 'jsonp'
    };
    addCartBase.getAjax(request_data);*/
  
  })

  $("#tuijian").bind('mouseover',function(){
    var f_id = $(this).attr("forid")
    var box = $("#"+f_id);
    $(this).addClass("cur").siblings().removeClass("cur")
    box.show().siblings().hide()
    if(!box.attr("op")){
      addCartApp.getRecItems()
    }
  })

  $("#liulan").bind('mouseover',function(){
    var f_id = $(this).attr("forid")
    var box = $("#"+f_id);
    $(this).addClass("cur").siblings().removeClass("cur")
    box.show().siblings().hide()
    if(!box.attr("op")){
      addCartApp.getRecentItems()
    }
  })

  $("#shouchang").bind('mouseover',function(){
    var f_id = $(this).attr("forid")
    var box = $("#"+f_id);
    $(this).addClass("cur").siblings().removeClass("cur")
    box.show().siblings().hide()
    if(!box.attr("op")){
      addCartApp.getFavoriteItems()
    }
  })

  $(".gotoCartPage").bind("click",function(){
    
    window.location.href = "//cart"+cookieDomain+"/"+_this.site+"/cart"
  })
  $("[maima_param]").live("click",function(){
    recTrack($(this).attr("maima_param"));
  });
}
addCartApp.init()