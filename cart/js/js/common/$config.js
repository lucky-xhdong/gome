;(function(exports) {
    $page.cookieDomain=cookieDomain;
    //是否独立站点
    function isOnlySite(){
        if($page.site=="home") return false;
        return true;
    }
    //不同站点 显示不同的券
    function supportPre(){
        if($page.site=="home")return "红券/蓝券/店铺券";
        if($page.site=="haiwaigou")return "店铺券";
        return "红券";
    }
    //是否显示大家电配送时部分偏远地区需额外收取远程费 提示showTilteByShoppingList
    function listOfitemTipVisible(){
        if($page.site=="gomeVirtualCard")return false;
        if($page.site=="operator")return false;
        return true;
    }
    //是否显示返回购物车修改连接
    function backCardLink(){
        if($page.site=="jixin")return false;
        if($page.site=="operator")return false;
        if($page.site=="allowance")return false;
        if($page.site=="gomeEntityCard")return false;
        if($page.site=="gomeVirtualCard")return false;
        if($page.site=="presell")return false;
        return true;
    }
    //是否禁用设置默认地址
    function isDisabledDefaultAddress(a){
        if(a)return true;
        if($page.site=="allowance") return true;
        return false;
    }
    //是否禁用门店
    function isDisabledMD(){
        if($page.site=="home") return false;
        if($page.site=="allowance") return true;
        return true;
    }
    //禁用激活
    function isDisabledJH(){
        if($page.site=="haiwaigou") return true;
        if($page.site=="allowance") return true;
        if($page.site=="presell") return true;
        return false;
    }
    //收获人是否只读
    function isReadOnlyConsignee(){
        return $page.site=="allowance";
    }
    //格式化一段文本
    function renderText(data, text){
        text = (text || '').toString();
        return text.replace(/\{([^\}]+)\}/g, function(all, match){
            result = data;
            matchArr = match.split('.');
            for(var i=0,key; key=matchArr[i++]; ){
                var tmp=key.split("|");
                if(tmp.length==2){
                    result = $config[tmp[1]](result[tmp[0]]);
                }else{
                    result = result[key]
                        || eval('result.'+key);//添加处理数组
                }
                if(result===null){ 
                    return all;
                }
            }
            return result;
        });
    }
    function fromatDate(date1,yyyyMMdd){
        if(typeof date1 !=="object") date1=new Date(+date1);
        var month=date1.getMonth()+1
        ,date=date1.getDate()
        ,hours=date1.getHours()
        ,min=date1.getMinutes()
        ,sec=date1.getSeconds();

        return yyyyMMdd.replace(/yyyy/g,date1.getFullYear())
        .replace(/yy/g,String(date1.getFullYear()).substr(2,2))
        .replace(/MM/g,month>=10?month:"0"+month)
        .replace(/M\*/g,month)
        .replace(/dd/g,date>=10?date:"0"+date)
        .replace(/d\*/g,date)
        .replace(/hh/g,hours>=10?hours:"0"+hours)
        .replace(/h\*/g,hours)
        .replace(/m\*/g,min)
        .replace(/mm/g,min>=10?min:"0"+min)
        .replace(/ss/g,sec>=10?sec:"0"+sec)
        .replace(/s\*/g,sec)
    }
    //日期格式化
    function formathhmm(time){
        return fromatDate(new Date(time),"hh:mm");
    }
    //日期格式化
    function formatLong(time){
        return fromatDate(new Date(time),"yyyy-MM-dd hh:mm:ss");
    }
    function renderError(errorData){
        return renderText(
            errorData,
            $config.errorText[errorData.errCode]||errorData.errMsg
        );
    }
    function renderNotice(key,data){
        return $config.renderText(data,$config.notice[key]);
    }
    function renderlistNotice(key,data){
        var x=$config.renderText(data,$config.notice[key]);
        return "<span class='pair_tip' title="+divReplace(x)+">"+x+"</span>"
    }
    function divReplace(str){
      if(!str){return ''};
      return str.replace(/<[\s\S]*?>|<\/[\s\S]*?>/g,'');
    }
    //购物车促销提示语
    function renderCartPromtionNotice(data){
        var x="",cou="";
        if(data.type=="JJHG" && data.jjghs){
            var jjhgNum=util.filter(util.prop("selected"),data.jjghs).length;
            data.jjhgNum=jjhgNum;
            if(jjhgNum) data.type=data.type+"_HG";
        }
        if(data.satisfied){//促销生效
            x= $config.renderText(data,$config.notice["C$"+data.type+"_SATISFIED"]);
        }else{
            if(data.validKindNum){
                x = $config.renderText(data, $config.notice["C$"+data.type+"_VALID"]);
            }else{
                x= $config.renderText(data,$config.notice["C$"+data.type]);
            }
        }
        if(data.url){
            if(data.type == "MUL_ZE_DO" || data.type == "MUL_ZE_COUPONS" 
                || data.type =="MJ" || data.type =="MZ" || data.type == "ZDZ"){
                cou = '&nbsp;<a href='+ data.url+'?'+data.proId+ ' target="_blank">' 
                    +'去凑单&nbsp;<span class="jt">&gt;</span>'
                +'</a>';
            }
        }
        
        if(x)return "<span class='promtion_notice_tip' title="+divReplace(x)+">" +x +"</span>" + cou;
        return "";
    }
    function renderCartNotice(key,data){
        var x=$config.renderText(data,$config.notice["C$"+key]);
        if(x)return x;
        return "";
    }
    //格式化金额
    function formatAmount(amount){
        if(amount===null)return "";
        if(amount==="")return "";
        return Number(amount).toFixed(2);
    }
    //格式化金额(全球购百货)
    function formatAmountSuttle(amount){
        if(amount===null)return "";
        if(amount==="")return "";
        return Number(amount);
    }
    //保留小数点后面俩位 不四舍五入
    function formatAmountWithNoRound(amount){
        if(amount===null)return "";
        if(amount==="")return "";
        return Number(amount.toString().replace(/(\.\d{2})\d+$/,"$1")).toFixed(2);
    }
    //检验字符串是否为空值
    function isBlank(str){
        if(str == "" || str == null) return true;
        return false;
    }
    //null或空值均返回空
    function isNullToblank(str){
        if(str == "" || str == null) return "";
        return str;
    }
    //格式化券
    function formatCoupon(coupon){
        var r=[];

        if(!coupon || !coupon.length || coupon.length<1){
            return "";
        }
        for(var i=0;i<coupon.length;i++){
            var item=coupon[i]; 
            if(item.desc){
                r.push(formatAmount(item.couponUnitPrice)+"元"+item.desc+"x"+item.quantity);
            }else{
                r.push(formatAmount(item.couponUnitPrice)+"元"+$config.labels[item.couponType]+"x"+item.quantity);
            }
        }
        return "可返"+r.join(",");
    }
    //加价换购提示语
    function jjhgtip(temp){
        if(temp)return "您已换购了商品";
        return "您未换购商品";
    }
    function shopTip(shop){
        var tiparr=[];
        if(!$config.isbrand(shop.shopId)){
            if(shop.profile.zpCount&&shop.profile.zpCount!=0)tiparr.push("赠品x"+shop.profile.zpCount);
            if(shop.profile.couponNum&&shop.profile.couponNum!=0)tiparr.push("返优惠券x"+shop.profile.couponNum);
        }
        if(shop.profile.reduce&&shop.profile.reduce!=0)tiparr.push("已节省<span class='font-cursive'>¥</span>"+formatAmount(shop.profile.reduce));
        return tiparr.join("，");
        return tiparr.join("");
    }
    //运费提示语
    function shipTip(shop){
        if(shop.profile.freight && shop.profile.freight.total){
            return "¥"+formatAmount(shop.profile.freight.total);
        }else{
            return "¥0.00";
        }
    }
    //是否禁用电子券按钮(现已去掉这个功能如需打开模版注释即可)
    function isDisableDZQ(){
        if($page.site=="home")return false;
        return true;
    }
    //限制字符个数 超过后显示...
    function limitStr(str,n){
        if(str&&str.length<n)return str;
        return str.substr(0,n)+'...';
    }
    //使用国美在线积分是否禁用
    function isDisableSYGMZXJF(a){
        if(a.op.vase=="FREEZED")return true;
        if(a.op.vase=="EXCEPTION")return true;
        if(a.op.currentPoint==0)return true;
        return false;
    }
    //是否禁用美豆
    function isDisableSYGMZXMD(a){
        return !a.gd             ? false
        : a.gd.canUseGomedos==0  ? true
        :false;
    }
    //禁用提交订单
    function isDisabledTJDD(){
        if($page.site=="presell"){
            if($config.shoppingAtom.presell_tyzfdj){
                return payment.isTailPhoneStatusDone($config.shoppingInstenceAtom.payment)==false;
            }
            return true;
        }
        return false;
    }
    //密文手机号
    function pwdPhone(a){
        if(a==null)return "";
        var b=util.take(4,util.reverse(a));
        return util.take(3,a)+"****"+util.reverse(b);
    }
    //密文电话号码
    function pwdTelphone(a){
       if(a==null)return "";
       if(a.length < 5) return "****"
       var b=util.take(3,util.reverse(a));
       //var c = util.take(7,util.reverse(a));
       //var d = c.substr(3,4);
       //var e = util.reverse(d);
       var f = a.length -7;
       var g = a.substr(0,f);
       return g+"****"+util.reverse(b);
    }
    //清除数组中的空对象
    function transArray(arr){
        if(!arr) return [];
        for(var i=0,len=arr.length;i<len;i++){
            if(!arr[i]|| arr[i]==''){
                arr.splice(i,1);
                //剔除一个要将原数组和i的长度减1
                len--;
                i--;
            }
        }
        return arr;
    }
    //渲染购物车标签
    function renderCartLabel(type,defaultlabel){
        var x=$config.labels["C$"+type];
        if(x)return x;
        return defaultlabel;
    }
    //订单信息页是否团抢刷单，0没有使用刷单软件，1使用
    function tqIsUsedScalp(){
        function dcl(e){//dom内容加载时,检测存不存在web 自动化测试工具Selenium 2(又名 WebDriver),phantomjs,casperjs,nodejs 等
            var m="";
            try{
                m=e['documentElement']['getAttribute']&&e['documentElement']['getAttribute']('webdriver');
            }catch(e){

            }
            var ug=[
               window['spawn'],window['emit'],window['Buffer'],window['domAutomation'],window['webdriver'],window['phantom']
               ,window['callPhantom'],window['_phantom'],window['ClientUtils'],window['__fxdriver_unwrapped'],window['fxdriver_id'],
               e['__webdriver_script_fn'],m
                  ]
            //$i(ug)返回[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]，如果有1就是使用刷单软件
            return util.find(function(item){return item == 1},$i(ug));
        }
        function $i(r){
            for(var m=0,I = []; m < r['length'];m++){
                I.push(r[m]?1:0);
            }
            return I;
        }
        if(dcl(document))return true;
        return false;
    }
    //是否主站
    function isHome(){
        return $page.site=="home";
    }
    function isQyg(){
        return $page.site === "qiyegou"
    }
    //是否海外购
    function isHwgSite(){
        return $page.site=="haiwaigou";
    }
    //是否节能补贴
    function isAllowance(){
        return $page.site=="allowance";
    }
    //是否虚拟卡站点
    function isGomeVirtualCardSite(){
        return $page.site=="gomeVirtualCard";
    }
    //是否实体卡站点
    function isGomeEntityCardSite(){
        return $page.site=="gomeEntityCard";
    }
    //是否团购
    function isGroupOnSite(){
        return $page.site=="groupOn";
    }
    //是否抢购
    function isRushBuySite(){
        return $page.site=="rushBuy";
    }
    //是否二手
    function isSecondHand(){
        return $page.site=="secondHand";
    }
    //是否预售
    function isPresell(){
        return $page.site=="presell";
    }
    //是否延保
    function isWarranty(){
        return $page.site=="warranty";
    }
    //是否电信运营商站点
    function isDxSite(){
        return $page.site=="operator";
    }
    //是否是极信站点
    function isJixinSite(){
        return $page.site=="jixin";
    }
    //是否是团抢站点且是订单信息页
    function istqSite(){
        return $page.site=="groupOn" || $page.site=="rushBuy";
    }
    //是否是苹果特惠
    function isApplePc(){
		return $page.site=="applePc";
	}
    function isExpendZHYE(){
        return isPresell() || isGomeVirtualCardSite() || isGomeEntityCardSite() || isJixinSite();
    }

    //判断美券类型 1单品券 2品牌券 3品类券 4全品类券 5历史美券:品牌券(和前四个互斥) 6历史美券:全国券(和前四个互斥)
    /*function gomeCouponType(type){
        if(type == "1") return "单品券";
        if(type == "2") return "品牌券";
        if(type == "3") return "品类券";
        if(type == "4") return "全品类券";
        if(type == "5") return "品牌券";
        if(type == "6") return "全国券";
        return ""
    }*/
    function gomeCouponType(cvsitem){
        if(cvsitem.gomeCouponType == "1") return "单品券";
        if(cvsitem.gomeCouponType == "2") return "品牌券";
        if(cvsitem.gomeCouponType == "3") return "品类券";
        if(cvsitem.gomeCouponType == "4") return "全品类券";
        if(cvsitem.gomeCouponType == "5"){
            if(cvsitem.shopNo == "guomeidianqi"){
                return "国美电器";
            }else if(cvsitem.shopNo == "dazhongdianqi"){
                return "大中电器";
            }else{
                return ""
            }
        }
        if(cvsitem.gomeCouponType == "6"){
            return "全国券";
        }
        return ""
    }
    //单品赠数组处理
    function isSub(types){
        if(types.length < 1){
            return false
        }
        for(var i=0; i<types.length; i++){
            if(types[i] == "I_ZE_GIFTS"){//单品赠
                return true
            }
        }
        return false
    }

    //预约安装时间处理
    function getYYAZDate(tiDate){
        if(!tiDate) return "暂缓安装";
        if(tiDate == "暂缓安装") return tiDate;
        var str = tiDate.split(" ")[0];
        return str.substring(str.indexOf("-") + 1);
    }
    //预约安装获取安装时间
    function getCurDate(tiVOs){
        for(var i=0; i<tiVOs.length; i++){
            if(tiVOs[i].selected == true){
                if(tiVOs[i].tiDate == "暂缓安装"){
                    return tiVOs[i].tiDate;
                }
                var str = tiVOs[i].tiDate.split(" ")[0];
                return str.substring(str.indexOf("-") + 1) + "(" + tiVOs[i].week + ")";
            }
        }
    }
    //运费类别
    function getFreightType(type){
        if(type == "NBF"){return "非百货类"}
        else if(type == "BF"){return "百货类"}
        else if(type == "NFF"){return "运费"}
        else if(type == "FF"){return "免运费"}
        else {return ""}
    }
    //美店切取url域名
    function splitUrl(url,id){
        if(!url || !id) console.log("美店数据错误！");
        var indexStart =  url.indexOf("item") + 4
            ,indexEnd = url.indexOf(".com.cn/") + 8;
        return "http://meidian" + url.substring(indexStart, indexEnd) + "shop-" + id + ".html";
    }

    //控制页面中是否显示逻辑
    var VBLE={
        youhuiquan:function(){ //使用优惠券
            if(isQyg())return false;
            if(isGomeVirtualCardSite())return false;
            if(isGomeEntityCardSite())return false;
            /*if(isDxSite())return false;*/
            if(isJixinSite())return false;
            if(isPresell())return false;	
            return true;
        },
        shiyongMD:function(){//使用美豆
            if(isQyg())return false;
            if(isJixinSite())return false;//极信通
            if(isDxSite())return false;//电信
            if(isHwgSite())return false;//海外购
            if(isPresell())return false;//预售
            if(isAllowance())return false;//节能补贴
            if(isSecondHand())return false;//二手
            if(isWarranty())return false;//独立延保
            if(isGomeEntityCardSite())return false;//是否美通卡
            if(isGomeVirtualCardSite())return false;//是否美通卡
            //主站home 返回true
            return true;
        },
        shiyongzhanghuyue:function(){//使用账户余额
            if(isHwgSite())return false;
            return true;
        },
        shiyongtuijianhao:function(){//使用推荐号
            if(isQyg())return false;
            if(isGomeEntityCardSite())return false;
            if(isGomeVirtualCardSite())return false;
            if(isJixinSite())return false;
            if(isDxSite())return false;
            if(isPresell())return false;
            if(isWarranty())return false;
            if(isHwgSite())return false;
            if(isAllowance())return false;
            if(isSecondHand())return false;
            if(isGroupOnSite())return false;
            if(isRushBuySite())return false;
            return true;
        },
        songhuorenxinxi:function(){ //价格展示下面的 送货人信息
            if(isGomeVirtualCardSite())return false;
            return true;
        },
        shiyongguomeiE:function(){//美通卡
            if(isQyg())return true;
            if(isHome()) return true;
            if(isApplePc()) return true;
            if(isDxSite())return false;
            if(isJixinSite())return false;
            return false;
        },
         beizhu:function(){//送货清单-备注
            if(isGomeEntityCardSite())return false;
            return true;
        } ,
        //价格展示栏 优惠券
        youhuiquan2:function(){
            if(isGomeVirtualCardSite())return false;
            if(isGomeEntityCardSite())return false;
            if(isPresell())return false;
            return true;
        },
        //是否显示门店积分
        mendianjifen:function(){
            if(isHome()) return true;
            if(isGroupOnSite()) return true;
            if(isRushBuySite()) return true;
            return false;
        },
        //是否显示命令立减
        symeikouling:function(){
            if(isHome()) return true;
            return false;
        }
    }
    //URL银盈通配置 开关（如果是uat环境，添加端口号）
    var yytCookieDomain = null;
    if($page.cookieDomain == ".atguat.com.cn"){
        yytCookieDomain = "https://gcoin.atguat.com.cn:10104";
    }else{
        yytCookieDomain = "https://gcoin" +$page.cookieDomain;
    }
    //URL配置
    var URL={
        cart: "/",
        shopping: "/shopping",
        orderSuccess: "/order-success",
        authorization:"/haiwaigou/read/authorization",
        moblieActive:"//myhome"+$page.cookieDomain+"/member/accountSecurity?atc=atc",//手机认证
        discountUseRule:"//help.gome.com.cn/article/279-0-0.html",//优惠券使用规则
        electroniccouponsRule:"//help.gome.com.cn/question/23.html",//了解电子券
        integralRule:"//help.gome.com.cn/article/281-0-0.html", //了解积分
        accountbalanceRule:"//help.gome.com.cn/article/239-0-0.html",//了解账户余额
        homeinstallation:"//help.gome.com.cn/question/25.html",//安装说明
        invoiceRule:"//help.gome.com.cn/article/238-0-0.html",//了解发票制度
        //paymentpassword:"//myhome"+$page.cookieDomain+"/member/accountSecurity?atc=atc",//开启支付密码
        paymentpassword:yytCookieDomain+"/indenticalPassword/rebinding.dhtml",//银盈通=>开启支付密码
        dispatchQuery:"//help.gome.com.cn/question/9.html" //配送查询
        ,mineGome:"//myhome.gome.com.cn/member/addressPage"//我的国美
        ,imgcode:"//imgcode"+$page.cookieDomain+"/getimage.no?type=gome_cart"//验证码
        ,groupOnImgcode:"//imgcode"+$page.cookieDomain+"/getimage.no?type=cart_tq_commit"
        ,imgCodeMTK:"//imgcode"+$page.cookieDomain+"/getimage.no?type=gome_profile_center"
        //,forgetPassword:"//myhome"+$page.cookieDomain+"/member/accountSecurity?atc=42"//忘记密码
        ,forgetPassword:yytCookieDomain+"/paypassword/forgetPasswordPage.dhtml"//银盈通=>忘记密码
        ,setPassword:yytCookieDomain+"/indenticalPassword/rebinding.dhtml"//银盈通=>设置密码（未开户）
    };


    var _giftTypes = {
        "I_ZE_GIFTS":'{label}'//单品赠实物促销
        ,"I_ZE_COUPONS":'{label}'//单品赠券促销
        ,"I_ZE_DO":'{label}'//单品赠豆促销
        ,"MUL_ZE_GIFTS":'{label}'//多品满金额赠实物促销
        ,"MUL_ZE_COUPONS":'{label}'//多品满金额赠券促销
        ,"MUL_ZE_DO":'{label}'//多品满金额赠豆促销

        ,"I_ZE_GIFTS_SATISFIED":'{label}'//单品赠实物促销
        ,"I_ZE_COUPONS_SATISFIED":'{label}'//单品赠券促销
        ,"I_ZE_DO_SATISFIED":'{label}'//单品赠豆促销
        ,"MUL_ZE_GIFTS_SATISFIED":'{label}'//多品满金额赠实物促销
        ,"MUL_ZE_COUPONS_SATISFIED":'{label}'//多品满金额赠券促销
        ,"MUL_ZE_DO_SATISFIED":'{label}'//多品满金额赠豆促销
    };
    var notices = {
            "addressConfirm":"您的收货人信息已经超过20条，我们将替换您最早的一条收货信息！"
            ,"addressConfirmByStore":"您的自提地址已经超过5条，我们将替换您最早的一条收货信息！"
            //促销类型
            
            ,"DPG":'搭配购优惠组合'
            ,"MZ":'已购满{preC}件，<em class="fontRed">已减{postC|formatAmount}元</em>'
            ,"MJ":'已购满{preC|formatAmount}元，<em class="fontRed">已减{postC|formatAmount}元</em>'
            ,"MF":'已购满{preC|formatAmount}元，<em class="fontRed">下单{coupons|formatCoupon}</em>'
            ,"GOME_MAN_ZHENG":'已购满{preC|formatAmount}元，您已经领取了赠品'
            ,"JJHG":'<em class="fontRed">{subs|jjhgtip}</em>'
            ,"TZ":'<span class="fontRed mr10">&yen;{tzSubAmount|formatAmount}</span>(共{items[0].quantity}套)'
            ,"ZDZ":'已购满{preC}件，<em class="fontRed">已减{postC|formatAmount}元</em>'
            ,"MUL_ZE_DO":"{label}"
            ,"MUL_ZE_COUPONS":"{label}"
            ,"I_ZE_GIFTS":"{label}"
            ,"MUL_ZE_GIFTS":"{label}"
            ,"I_ZE_COUPONS":"{label}"
            ,"I_ZE_DO":"{label}"
        //***
        ,"YHQ":'（'+supportPre()+'/国美电器门店积分）<em class="squaer pr">{availableCouponNum}<i class="pabs c-i triangle_icon2">'
        /********购物车提示语**********/
        ,"C$MJ":"活动商品满{preC|formatAmount}元，即可享受满减"
        ,"C$MJ_VALID":"购买{preC|formatAmount}元不同种类商品，即可享受满减促销活动"
        ,"C$MJ_SATISFIED":'活动商品已满{preC|formatAmount}元（<span style="color:#e6060e;">已减{postC|formatAmount}</span>）'
        ,"C$MF":"活动商品满{preC|formatAmount}元，即可享受满返"
        ,"C$MF_SATISFIED":'活动商品已满{preC|formatAmount}元（<span style="color:#e6060e;">{coupons|formatCoupon}</span>）'
        ,"C$MZ":"活动商品满{preC}件，即可享受满折" //满折
        ,"C$MZ_VALID":"购买{preC}件不同种类商品，即可享受满折活动" //满折
        ,"C$MZ_SATISFIED":'活动商品已满{preC}件（<span style="color:#e6060e;">已减{postC|formatAmount}元</span>）'
        ,"C$ZDZ":"活动商品满{preC}件，即可享受满折" //满折
        ,"C$ZDZ_VALID":"购买{preC}件不同种类商品，即可享受满折活动" //满折
        ,"C$ZDZ_SATISFIED":'活动商品已满{preC}件（<span style="color:#e6060e;">已减{postC|formatAmount}元</span>）'
        ,"C$DPG":"搭配购优惠组合" //搭配购
        ,"C$DPG_SATISFIED":"搭配购优惠组合" //搭配购
        ,"C$JJHG":"{label}"//加价换购
        ,"C$JJHG_SATISFIED":'{label}（<span style="color:#e6060e;">可加价换购商品{maxNum}件</span>）'
        ,"C$POP_MZE":'{label}'  //满赠
        ,"C$POP_MZE_SATISFIED":'{label}'

        ,"C$POP_MZE"  : '{label}'
        ,"C$POP_MJ"   : '{label}'
        ,"C$POP_MF"   : '{label}'
        ,"C$POP_MZH"  : '{label}'
        ,"C$POP_GWQ"  : '{label}'
        ,"C$KDP_MJ"   : '{label}'
        ,"C$KDP_MM"   : '{label}'
        ,"C$POP_I_MZH": '{label}'

        ,"C$POP_MZE_SATISFIED"  : '{label}'
        ,"C$POP_MJ_SATISFIED"   : '{label}'
        ,"C$POP_MF_SATISFIED"   : '{label}'
        ,"C$POP_MZH_SATISFIED"  : '{label}'
        ,"C$POP_GWQ_SATISFIED"  : '{label}'
        ,"C$KDP_MJ_SATISFIED"   : '{label}'
        ,"C$KDP_MM_SATISFIED"   : '{label}'
        ,"C$POP_I_MZH_SATISFIED": '{label}'

        ,"GOME_SHDZ_UPGRADE_TIP":"您保存的收货地址已失效，请重新填写，或至&nbsp;<a href='" + URL.mineGome +"' target='_blank'>我的国美&gt;</a>&nbsp;升级。"
    };

    //notices 对象中添加满赠配置
    ;(function assignNotice(objs,types){
        for(attr in _giftTypes){
            objs['C$'+attr] = types[attr];
        }
    }(notices,_giftTypes));
    /**
     * 判读是否显示 选择赠品弹框
     * @param type
     * @returns {boolean}
     */
    function isShowGiftSelectPop(type){
        var giftTypes = ['I_ZE_GIFTS',//单品赠实物促销
            'MUL_ZE_GIFTS',//多品满金额赠实物促销
        ];
        if(!type){return false}
        for(var i=0; i<giftTypes.length; i++){
            if(type === giftTypes[i]){
                return true;
            }
        }
        return false;
    }

    var _couponType = {
        "RED":"红券"
        ,"BLUE":"蓝券"
        ,"GOME":"美券"
        ,"SHOP":"积分"
        ,"POINT":"购物券"
        ,"SHI_WU":"实物"
        ,"DO":"返豆"
    };

    var $config = exports.$config = {
        isGift: function isGift(group) {
            if (group && group.promotionHeads
                && group.promotionHeads[0] && group.promotionHeads[0][0].type != "DPG"
                && group.promotionHeads[0][0].type != "JJHG") {
                return true;
            }
            return false

        },
        zIndex: {
            general: 10, //普通级别
            mask: 100, //遮罩级别
            dialog: 1000 //对话框级别
        },
        URL:URL,
        notice:notices
        ,labelsCouponType: _couponType
        ,isQygSite: function(){
            return $page.site === "qiyegou";
        }
        ,isHomeSite: function(){
            return $page.site==="home";
        }
        ,labels:{
            /***********订单信息页****************/
            "cash":"现金",
            "pos":"pos刷卡",
            "counter":"柜台",
            "enterpriseBank":"企业银行",
            //促销类型 (订单商品清单促销标示)
            "I_ZE_COUPONS":"满返",
            "I_ZE_DO":"满返",
            "MUL_ZE_COUPONS":"满返",
            "MUL_ZE_DO":"满返",
            "I_ZE_GIFTS":"满赠",
            "MUL_ZE_GIFTS":"满赠",
            "MF":"满返",
            "MZ":"满折",
            "ZDZ":"满折",
            "MJ":"满减",
            "DPG":"搭配购",
            "JJHG":"加价购",
            "TZ":"套装价"
            //************
            ,"SOME_UP":"与上述商品付款方式一致"
            ,"ZKP":"折扣品"
            ,"ZP":"赠品"
            ,"HGP":"换购品"


            ,"WEEKDAY":"工作日送"
            ,"ALL":"工作日、双休日与假日送"
            ,"WEEKEND":"双休日、假日送"
            //券类型
            ,"REDCOUPON":"红券"
            ,"BLUECOUPON":"蓝券"
            ,"SHOPCOUPON":"店铺券"
            ,"POINT":"积分"
            ,"PLATFORMCOUPON":"店铺平台券"
            ,"SHI_WU":"实物"
            //库存状态
            ,"ON_THE_ROAD":"" //在途状态
            ,"NO_GOODS":'<span class="fontRed">无货</span>'
            ,"INVENTORY_TENSION":'<span class="fontRed">库存紧张</span>'
            ,"OFF":'<span class="fontRed">已下架</span>'
            ,"IN_STOCK":"有货"
            ,"DELIVERY_NOT_SUPPORTED":'<span class="fontRed">该区域暂不支持配送</span>'
            /********购物车页的标签*********/

            ,"C$MJ"       : "满减"
            ,"C$ZDZ"      : "满折"//整单折
            ,"C$MZ"       : "满折"
            ,"C$MF"       : "满返"
            ,"C$JJHG"     : "加价换购"
            ,"C$TZ"       : "套装"
            ,"C$POP_MZE"  : "满赠"
            ,"C$POP_MJ"   : "满减"
            ,"C$POP_MF"   : "满返"
            ,"C$POP_MZH"  : "多买优惠"
            ,"C$POP_GWQ"  : "购物券"
            ,"C$KDP_MJ"   : "跨店铺满减"
            ,"C$KDP_MM"   : "跨店铺满免"
            ,"C$POP_I_MZH": "单品满折"
            ,"C$DPG"      : "搭配购"
            ,"C$NO"       : "促销"// 不使用促销

            //新增
            ,"C$I_ZE_GIFTS": "满赠"//单品赠实物促销
            ,"C$I_ZE_COUPONS": "满返"//单品赠券促销
            ,"C$I_ZE_DO": "满返"//单品赠豆促销
            ,"C$MUL_ZE_GIFTS":"满赠"//多品满金额赠实物促销
            ,"C$MUL_ZE_COUPONS":"满返"//多品满金额赠券促销
            ,"C$MUL_ZE_DO":"满返"//多品满金额赠豆促销
            ,"assert_FEE_class": "coupon-fee"
            ,"assert_FEE_label": "运费"
            ,"assert_FEE_border": "coupon-border-fee"
            ,"assert_RED_class": "coupon-red"
            ,"assert_RED_label": "红"
            ,"assert_RED_border": "coupon-border-red"
            ,"assert_BLUE_class": "coupon-blue"
            ,"assert_BLUE_label": "蓝"
            ,"assert_BLUE_border": "coupon-border-blue"
            ,"assert_GOU_WU_class": "coupon-gou"
            ,"assert_GOU_WU_label": "购物"
            ,"assert_GOU_WU_border": "coupon-border-gou"
            ,"assert_SHOP_class": "coupon-shop"
            ,"assert_SHOP_label": "店铺"
            ,"assert_SHOP_border": "coupon-border-shop"
            ,"assert_PRODUCT_class": "coupon-shop"
            ,"assert_PRODUCT_label": "店铺"
            ,"assert_PRODUCT_border": "coupon-border-shop"
            ,"assert_GOME_class": "coupon-offline"
            ,"assert_GOME_label": "美"
            ,"assert_GOME_border": "coupon-border-offline"
            ,"COUPON_TYPE_FEE": "FEE"
            ,"COUPON_TYPE_RED": "RED"
            ,"COUPON_TYPE_GOU": "GOU_WU"
            ,"COUPON_TYPE_BLUE": "BLUE"
            ,"COUPON_TYPE_SHOP": "SHOP"
            ,"COUPON_TYPE_PRODUCT": "PRODUCT"
            ,"COUPON_TYPE_OFFLINE": "OFFLINE"
            ,"COUPON_NO_DESC": "暂无描述"
        }
        ,isListValue:function(list,value){
            return util.find(function(item){return item==value},list)
        }
        ,isGiftType: isShowGiftSelectPop
        /**
         * 线下赠品或者美豆不足情况下弹层显示
         */
        ,enoCart:function(promotionHead){
            if(promotionHead && promotionHead.budgetValue){
                if(promotionHead.type=='GOME_S_S_D'){
                    return '<div style="position:relative;width:300px"><div click-document-hide class="eno-cart-tip" >美豆不足，仅剩'+promotionHead.postC+'美豆可赠送</div></div>'
                }else if(promotionHead.type=='GOME_S_S_G'){
                    return '<div style="position:relative;width:300px"><div click-document-hide class="eno-cart-tip">赠品不足，仅剩'+promotionHead.postC+'件赠品可赠送</div></div>'
                }
            }
            return ''
        }
        ,formatAmountSuttle: formatAmountSuttle
        ,enoNum:function(num,type){
            return '<div style="position:relative;width:300px"><div click-document-hide class="eno-num-tip" >您最多能购买'+num+(type == 0 ? '件' : '套')+'</div></div>';
        }
        ,tuanNum:function(good){
            if(!$config.cartAtom.limitTuanIsShow){
                $config.cartAtom.limitTuanIsShow = {};
            }
            if(!$config.cartAtom.limitTuanIsShow[good.itemId]){
                $config.cartAtom.limitTuanIsShow[good.itemId] = {};
            }
            if (good && good.itemId && good.itemPromotionInfo && good.itemPromotionInfo.limitNum) {

                $config.cartAtom.limitTuanIsShow[good.itemId].num   = good.itemPromotionInfo.limitNum;
                $config.cartAtom.limitTuanIsShow[good.itemId].type = good.itemPromotionInfo.promotionType;
            }
            if(!$config.cartAtom.limitTuanIsShow || good.itemId != $config.cartAtom.limitTuanIsShow.currentCid){
                return ''
            }
            var num   = $config.cartAtom.limitTuanIsShow[good.itemId].num;
            var _type = ($config.cartAtom.limitTuanIsShow[good.itemId].type === 'TuanPrice') ?'团':'抢';
            if (!num) {
                return '';
            }
            if((good.quantity-1)== num){
                var _className = 'limitTuanIsShow-'+good.itemId;
                // clearTimeout($config.cartAtom.limitTuanIsShow.timeout);
                // $config.cartAtom.limitTuanIsShow.timeout = setTimeout(function(){
                //     $('.'+_className).hide();
                // },3000);
                return '<div class='+_className+' style="position:relative;width:320px"><div click-document-hide class="eno-num-tip" >'
                    +_type + '购商品限购'+num+'件,超出后将全部按国美价计算'+'</div></div>';
                }
            }
        ,isGomeShop:function(shopId){
            //是否是国美自营包含国美七大品牌
            var brand=["GOME","guomeidianqi","dazhongdianqi","beifangdianqi","yongledianqi","heitianedianqi","tengdadianqi","fengxingdianqi","sanxingdianqi"]
            if($.inArray(shopId,brand)>-1){
                return true
            }
            return false
        }
        /**
         * 判断是否七大品牌
         * @param code
         * @returns {boolean}
         */
        , isbrand: function (code) {
            var brand = ["guomeidianqi", "dazhongdianqi", "beifangdianqi", "yongledianqi", "heitianedianqi", "tengdadianqi", "fengxingdianqi", "sanxingdianqi"];
            if ($.inArray(code, brand) > -1) {
                return true
            }
            return false
        }
        /**
         * 则通过code参数来判断
         * @param express
         * @param shopId
         * @returns {*|string}
         */
        ,isGomeShopExpressName:function(express,shopId){
            var code       = express.code,
                expressObj = {
                    "Gome Express"      : "国美快递",
                    "Gome Picking Up"   : "门店自提",
                    "Store Picking Up"  : "门店自提",
                    "EMS"               : "EMS快递",
                    "Express Picking Up": "配送自提",
                    "Store Express"     : "普通快递",
                    "Express"           : "普通快递"
                };

            return expressObj[code] || "其他";
        }
        /**
         * 控制是否显示 配送时间 （【门店自提， 配送自提】不显示）
         * 如果是 【门店自提， 配送自提】返回false
         * @param express
         * @param shopId
         * @returns {boolean}
         */
        ,isShowDataByShoppingList:function (express) {
            var code = express.code;
            //门店自提 配送自提
               if(code == 'Store Picking Up' || code =='Express Picking Up'){
                   return false;
               }
            return true;
        }
        /**
         * 控制 【门店自提， 配送自提】显示title
         * @param express
         * @param shopId
         * @returns {string|string}
         */
        ,showTilteByShoppingList: function(express,shopId){
            var code = express.code,
                TITLE= {
                    mengDian: '下单可立即自提（9:00-20:00）',
                    peiSong: '收到国美在线发送短信后7个自然日内到门店提取。'
                },
                expressObj={
                    "Store Picking Up":TITLE.mengDian,
                    "Express Picking Up":TITLE.peiSong
                };
                if(express.selfPickupType == 2 &&　express.businessHours){
                    expressObj["Store Picking Up"]= '下单可立即自提('+express.businessHours +')';
                }
            return '自提时间：'+expressObj[code] ||"其他"
        }
        ,istqSite:istqSite
        ,tqIsUsedScalp:tqIsUsedScalp
        ,renderNotice:renderNotice
        ,renderlistNotice:renderlistNotice
        ,renderCartNotice:renderCartNotice
        ,renderCartPromtionNotice:renderCartPromtionNotice
        ,isDxSite:isDxSite
        ,isJixinSite:isJixinSite
        ,isHwgSite:isHwgSite
        ,renderText: renderText
        ,renderError: renderError
        ,formatLong:formatLong
        ,fromatDate:fromatDate
        ,formathhmm:formathhmm
        ,formatAmount:formatAmount
        ,isBlank:isBlank
        ,isNullToblank:isNullToblank
        ,formatAmountWithNoRound:formatAmountWithNoRound
        ,formatCoupon:formatCoupon
        ,defaultErrorText: '出错了'
        ,isDisableDZQ:isDisableDZQ
        ,isDisableSYGMZXJF:isDisableSYGMZXJF
        ,isOnlySite:isOnlySite
        ,backCardLink:backCardLink
        ,isDisableSYGMZXMD:isDisableSYGMZXMD
        ,listOfitemTipVisible:listOfitemTipVisible
        ,jjhgtip:jjhgtip
        ,isDisabledDefaultAddress:isDisabledDefaultAddress
        ,isReadOnlyConsignee:isReadOnlyConsignee
        ,shopTip :shopTip
        ,shipTip:shipTip
        ,isDisabledMD:isDisabledMD
        ,isDisabledJH:isDisabledJH
        ,limitStr:limitStr
        ,pwdPhone:pwdPhone
        ,pwdTelphone:pwdTelphone
        ,isGomeVirtualCardSite:isGomeVirtualCardSite
        ,isDisabledTJDD:isDisabledTJDD
        ,renderCartLabel:renderCartLabel
        ,transArray:transArray
        ,gomeCouponType:gomeCouponType
        ,isSub:isSub
        ,getYYAZDate:getYYAZDate
        ,getCurDate:getCurDate
        ,splitUrl:splitUrl
        ,VBLE:VBLE
        ,getFreightType:getFreightType
        ,errorText:{
            "003018000":'为保障您的账户资金安全，请先 [<a target="_blank" href="'+URL.moblieActive+'">验证手机号</a>]'
            ,"f1":'<p style="color:#e3101e;">为保障您的账户资金安全，国美币密码将作为支付密码使用，请&nbsp;&nbsp;&nbsp;<a target="_blank" href="'+URL.paymentpassword+'">输入国美币密码<span class="jt" style="padding-left:4px;">&gt;</span></a></p>'
            ,"f2":'<p style="color:#e3101e;">为保障资金安全，升级支付密码后可使用此优惠，请先&nbsp;&nbsp;&nbsp;<a target="_blank" href="'+URL.paymentpassword+'">升级支付密码<span class="jt" style="padding-left:4px;">&gt;</span></a></p>'
            ,"f3":'<p style="color:#e3101e;">为保障资金安全，设置支付密码后可使用此优惠，请先&nbsp;&nbsp;&nbsp;<a target="_blank" href="'+URL.setPassword+'">设置支付密码<span class="jt" style="padding-left:4px;">&gt;</span></a></p>'
            ,"f4":'<p style="color:#e3101e;">为保障资金安全，升级支付密码后可使用红劵，请先&nbsp;&nbsp;&nbsp;<a target="_blank" href="'+URL.paymentpassword+'">升级支付密码<span class="jt" style="padding-left:4px;">&gt;</span></a></p>'
            ,"f5":'<p style="color:#e3101e;">为保障资金安全，设置支付密码后可使用红劵，请先&nbsp;&nbsp;&nbsp;<a target="_blank" href="'+URL.setPassword+'">设置支付密码<span class="jt" style="padding-left:4px;">&gt;</span></a></p>'
            ,"f6":'<p style="color:#e3101e;">开小差了，请联系客服解决</p>'
            /*,"f1":'<p style="color:#f00;">为了保障您的账户资金安全，此优惠暂不可用，请先&nbsp;&nbsp;&nbsp;<a target="_blank" href="'+URL.paymentpassword+'">开启支付密码<span class="jt" style="padding-left:4px;">&gt;</span></a></p>'*/
        }
        ,tqAtom:{//团抢订单信息页防刷单
            tqst:new Date() - 0//订单信息页开始加载时间只限于团抢站点，给构架部统计
            ,tqet:new Date() - 0 //点击提交为结束时间
            ,tqneedYzm:"N"
            ,tqyzm:""
            ,tqyzm_tip:""
            ,tqyzm_imgCode:new Date() - 1
        }
        ,shoppingAtom:{//核对订单页->用户资产->全局状态
            mtksfyz:{ //实体卡信息
                mobile:null,//电话
                code:null//验证码
            },
            userAsset:"N", //用户资产展开与否
            yhj:"Y",//优惠券展开与否            
            yhj_jh:"N",//激活优惠券展开
            ecard_jh:"N",//激活美通卡展开
            hq_more:"Y",//红券更多
            syjf:"N",//美豆是否展开
            mdjf:"N",//门店积分是否展开
            sydzq:"N",//使用电子券展开
            sygmek:isQyg() ? "Y":"N",//使用国美E卡
            syzhye:isExpendZHYE() ? "Y" : "N",//使用账户余额展开
            sytjh:"N"//推荐号展开
            ,symkl:"N"//美口令展开
            ,yhj_bm:""//优惠券编码
            ,yhj_jhm:""//优惠券激活码
            ,yhj_tip:""//激活优惠券错误提示
            ,yhj_yzm:""//优惠券验证码
            ,yhj_img:new Date-1//优惠券验证码图片
            ,yhj_com:"N"//使用优惠最优方案
            ,mdhyjf:null//门店会员积分
            ,dzqma:""//电子券密码
            ,dzqma_tip:""//电子券错误提示
            ,rygh:""//人员工号
            ,rygh_tip:""
            ,mkl_code:""//美口令编码
            ,mkl_tip:""//美口令错误提示
            ,yzm:""//支付密码 验证码
            ,yzm_pw:""//支付密码
            ,yzm_img:new Date-0//支付密码 验证码
            ,yzm_tip:""//支付密码验证码错误提示
            ,mdhyjf_tip:""//门店会员积分 错误提示
            ,referrerInfo:null//门店推荐人员工号
            ,renderRefPFlag:false//是否第一次渲染标记
            // ,referrerInfo:{
            //     employeeId:1000,
            //     employeeName:"employeeName",
            //     structureName:"structureName"
            // }
            ,presell_tyzfdj:false//预售站点 提交订单旁边同意支付定金单选框
            ,deliveryPreSell:null//预售站点尾款手机号信息
            ,ecard_1:""//绑定国美E卡1
            ,ecard_2:""//绑定国美E卡2
            ,ecard_3:""//绑定国美E卡3
            ,ecard_4:""//绑定国美E卡4
            ,ecard_yzm:""//绑定国美E卡 验证码
            ,ecard_yzm_tip:""
            ,yhq_jhm:""//优惠券激活码
        }
        ,shoppingAddressAtom:{//核对订单页->收获地址->全局状态
            more:"Y"//收获地址更多按钮 展开与否
            ,ztmore:"Y"//自提地址更多按钮
            ,scrollY:0//收获地址滚动条
            ,novalidAddr:false//用户没有有效地址
            ,offlineToOnline:false //是否弹出线下飞线上框
            ,offlineStatus:0 //收货地址接口相关状态 0:默认展示线下飞线上框,1:操作收货地址接口展示线下飞线上框,2:不展示线下飞线上框
            ,errorStatus:-1   //0 线下转线上 1 接口异常 2提交订单时无货
            ,markedStatus:false
        }
        ,isSupportSeven:false  //提交订单页下方，文案为：“温馨提示：订单中含不支持7天无理由退货商品，请确认后提交”
        ,isSupportSevenData:[]
        ,shoppingInstenceAtom:{//核对订单页->实例
            address:null //收获地址
            ,payment:null //支付方式
            ,invoice:null //发票
            ,listOfItem:null //配送清单
            ,commitOrder:null//价格
            ,preferential:null //用户资产
        }
        ,warrantyAtom:[
            {
                displayName: "延长保修",
                lable: "【延保】",
                icon:"warranty"
            },{
                displayName: "屏碎保",
                lable: "【屏碎保】",
                icon:"warrantysb"
            },{
                displayName: "意外保",
                lable: "【意外保】",
                icon:"warrantyac"
            }
        ]
        ,cartAtom:{//购物车状态
            limitTip:null,
            deleteData:[] //购物车删除区数据备份
        }
        ,returnTaoZhuangMax: function(data){
            if(!data || !data.commerceItemsGroup){
                return 1;
            }
            var groups = data.commerceItemsGroup;
            var value = 1;
            for(var i=0,len=groups.length; i<len; i++){
                var item = groups[i];
                if(item && item.baseQuantity){
                    value<item.baseQuantity ? value=item.baseQuantity: value;
                }
            }
            return value;
        }
        ,isNotI7n: function(data){//是否不支持7天无理由退货
            var I7N = 'i7N';
            if(!data || !data.length || data.length<1){
                return false;
            }
            for(var i=0; i<data.length; i++){
                if(data[0] === I7N){
                    return true;
                }
            }
            return false;
        }
        ,isI7n: function(data){//是否支持7天无理由退货
            var I7N = 'i7Y';
            if(!data || !data.length || data.length<1){
                return false;
            }
            for(var i=0; i<data.length; i++){
                if(data[0] === I7N){
                    return true;
                }
            }
            return false;
        }
        //判断购物车中商品是否置灰|不可选
        ,isProductSelected: function (good,siteName){
            return (siteName!='secondHand' && good.inventoryState == "OFF")||(good.commerceItemStatus && good.commerceItemStatus[0] === 'presell')|| good.inventoryState == "NO_PERMISSION_BUY" || good.reserveStatus == "QGQWYY" || good.reserveStatus == "QGWYY" || good.reserveStatus == "QGCF";
        }
        ,freightThreshold:99
        /**
         *
         * @param good
         * @returns {*}
         * @private
         */
        ,countDownTitle:function countDownTitle(good){
            if(!good || !good.itemPromotionInfo || !good.itemPromotionInfo.promotionType){
                return '抢'
            }
            if(good.itemPromotionInfo.promotionType === 'RushbuyPrice'){
                return '抢'
            }else if(good.itemPromotionInfo.promotionType === 'TuanPrice'){
                return '团'
            }
            return '抢'
        }
        ,isShowTuanTitle: function(good){
            if(isHome()&&  good.itemPromotionInfo && good.itemPromotionInfo.limitNum && good._isCount){
                return true;
            }else{
                return false;
            }
        }
        ,jsSelectTime:"暂缓安装"
        ,yyqgStatusType:function(status){//提交订单时弹窗的预约安装的状态
            if(status == "OFF")return "已下架";
            if(status == "YY")return "预约中";
            if(status == "YS")return "预售中";
            if(status == "QGQ")return "预约待开抢";//抢购前
            if(status == "QGWYY")return "预约抢购中";//抢购中未预约
            if(status == "QGWDL")return "预约抢购中";//抢购中未登录
            if(status == "QGCF")return "预约抢购中";//抢购中重复下单
            if(status == "QGXG")return "预约抢购中";//抢购中商品数量不能大于1
            if(status == "QGOFFLINE")return "抢购中";//线下商品预约
            if(status == "NO_GOODS")return "无货";
            if(status == "OTHER")return "商品有误";//其他
            if(status == "RISK") return "限购"
            return "";
        }
        ,yyqgjjhgType:function(status){//购物车中加价换购的预约安装的状态
            if(status == "YY")return "预约中";
            if(status == "YYWYY")return "预约中";//预约期间未预约
            if(status == "QGQ")return "预约待开抢";//抢购前
            if(status == "QGQWYY")return "预约待开抢";//抢购前未预约
            if(status == "QG")return "抢购中";
            if(status == "QGWYY")return "预约抢购中";//抢购中未预约
            if(status == "QGCF")return "预约抢购中";//抢购期间重复购买
            if(status == "OFF")return "已下架";
            return "";
        },
        yyqgjjhgTypeOff:function(status){
            if(status == "YY" || status == "YYWYY" || status == "QGQ" || status == "QGQWYY" || status == "QGWYY" || status == "QGCF" || status == "OFF"){
                return false;
            }
            return true;
        }
        ,isNotYyqg:function(state){
            return (state == "YY" || state == "YYWYY" || state == "QG" || state == "QGWYY" || state == "QGQWYY" || state == "QGQ" || state == "QGCF") ? false : true;
        }
    }; 
}(this));
