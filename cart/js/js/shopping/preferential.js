/**促销优惠*/
!function(exports, req, u, ui, uw, tpl, validate){
    var TYPE = "7preferential7"
        ,emit = uw.emit(TYPE)
        ,checkeditemid=null;

    //将使用优惠最优方案状态存入cookie
    if($.cookie('yhj_com')){
        $config.shoppingAtom.yhj_com = $.cookie('yhj_com');
    }else{
        $.cookie('yhj_com','Y', {expires:30,path:'/',domain:cookieDomain});
        $config.shoppingAtom.yhj_com = $.cookie('yhj_com');
    }
    //埋cookie为是否有优惠券增加开关
    var transDataPointFlag = $.cookie("transDataPointFlag") || "1";

    function div(im){
        return im('div');
    }

    function dfn(im){
        return im('data');
    }

    function set(path, val, im){
        return im('data', transData(u.assocPath(path, val, dfn(im))));
    }

    //获取本次最多可使用 门店积分
    function maxUseJF(im){
        return dfn(im).vrbsos.sp.availablePoint;
    }

    //用户未开启支付密码
    function isNotUnsealPwd(im){
        return dfn(im).verifyStatus == "VERIFY_NOT_ACTIVATED";
    }

    //用户未开启手机验证
    function isNotMobileActive(im){
        return dfn(im).verifyStatus == "MOBILE_NOT_ACTIVATED";
    }
    function isNum(str){
        return (/^[0-9]+$/.test(str));
    }  
    //返劵不用劵
    function getUnvaibleCouponfn(data,ucvs,dsgs){
        //status=2为不可用券的场景
        var flag = u.find(function(item){
            return item.status==2
        },ucvs)

        if(flag){
            var shopIds = u.map(function(item){
                return item.shopId
            },dsgs)
            //线上自营
            var x=u.find(function(a){
              if(a=="GOME"){return true}
            },shopIds)
            //线下联营 
            var y=u.find(function(a){
              return isNum(a)
            },shopIds)
            //线下商品
            var z=u.find(function(a){
              return $config.isbrand(a)
            },shopIds)
            //自营+联营+线下 或者 自营+ 联营
            if((x && y && z) || (x && y && !z)) {
                data.unvaibleCouponStatus = 3
            }else if((!x && y && !z) ||(!x && y && z)){
                //联营 或者 联营+线下商品
                data.unvaibleCouponStatus =  2
            }else if((x && !y && !z) || (x && !y && z)){
                //自营 或者 自营+ 线下商品
                data.unvaibleCouponStatus =  1
            }
        }
    }

    function transData(data){
        var vbs = data.vrbsos;
        if(transDataPointFlag == "1"){
            transDataPoint(data);
        }
        //单独处理美通卡 红点（是否有可用美通卡） 显示(这里做一遍处理是为了展示最下面的金额抵用)
        if(vbs && vbs.pcs && vbs.pcs.pcs && vbs.pcs.pcs.length){
            $config.shoppingAtom.ecard_jh = "N";
            var n = 0;
            for(var i=0; i<vbs.pcs.pcs.length; i++){
                if(vbs.pcs.pcs[i].use == true){
                    vbs.pcs.use = true;
                }else{
                    vbs.pcs.use = false;
                }
                if(vbs.pcs.pcs[i].checked == true){
                    n++;
                }
            }
            vbs.pcs.checkedNum = n;
        }else{
            $config.shoppingAtom.ecard_jh = "Y";
        }
        //存cookie
        $config.shoppingAtom.yhj = $.cookie("yhj") || "N";
        $config.shoppingAtom.mdjf = $.cookie("mdjf") || "N";
        $config.shoppingAtom.sygmek = $.cookie("sygmek") || "N";
        $config.shoppingAtom.syzhye = $.cookie("syzhye") || "N";
        $config.shoppingAtom.syjf = $.cookie("syjf") || "N";
        $config.shoppingAtom.sytjh = $.cookie("sytjh") || "N";
        $config.shoppingAtom.symkl = $.cookie("symkl") || "N";

        $config.shoppingAtom.userAsset = $.cookie("userAsset") || "N";
        if(vbs && vbs.ucvs && vbs.ucvs.length){
            getUnvaibleCouponfn(data,vbs.ucvs,$config.shoppingInstenceAtom.listOfItem(1))
        }
        return data;
    }

    function transDataPoint(data){
        var vbs = data.vrbsos;
        if((vbs && vbs.cvs && vbs.cvs.length) || (vbs.gd && vbs.gd.canUseGomedos && vbs.gd.canUseGomedos>0) || (vbs.pcs && vbs.pcs.pcs && vbs.pcs.pcs.length)){
            $.cookie("userAsset","Y", {expires:30,path:'/',domain:cookieDomain});//如果有数据 激活优惠券展开
            //单独处理美通卡 红点（是否有可用美通卡） 显示
            var ifPcs = vbs && vbs.pcs && vbs.pcs.pcs && vbs.pcs.pcs.length;
            if(ifPcs){
                var n = 0;
                for(var i=0; i<vbs.pcs.pcs.length; i++){
                    if(vbs.pcs.pcs[i].use == true){
                        vbs.pcs.use = true;
                    }else{
                        vbs.pcs.use = false;
                    }
                    if(vbs.pcs.pcs[i].checked == true){
                        n++;
                    }
                }
                vbs.pcs.checkedNum = n;
            }
            if(vbs && vbs.cvs && vbs.cvs.length){//判断优惠券
                $.cookie("yhj","Y", {expires:30,path:'/',domain:cookieDomain});//优惠券
                $.cookie("syjf","N", {expires:30,path:'/',domain:cookieDomain});//美豆
                $.cookie("sygmek","N", {expires:30,path:'/',domain:cookieDomain});//美通卡
            }else{
                if(ifPcs && vbs.pcs.use == true){//判断美通卡
                    $.cookie("yhj","N", {expires:30,path:'/',domain:cookieDomain});//优惠券
                    $.cookie("syjf","N", {expires:30,path:'/',domain:cookieDomain});//美豆
                    $.cookie("sygmek","Y", {expires:30,path:'/',domain:cookieDomain});//美通卡
                    $config.shoppingAtom.ecard_jh = "N";
                }else{
                    $config.shoppingAtom.ecard_jh = "Y";
                    if(vbs.gd && vbs.gd.canUseGomedos && vbs.gd.canUseGomedos>0){//判断美豆
                        $.cookie("yhj","N", {expires:30,path:'/',domain:cookieDomain});//优惠券
                        $.cookie("syjf","Y", {expires:30,path:'/',domain:cookieDomain});//美豆
                        $.cookie("sygmek","N", {expires:30,path:'/',domain:cookieDomain});//美通卡
                    }else{
                        $.cookie("yhj","N", {expires:30,path:'/',domain:cookieDomain});//优惠券
                        $.cookie("syjf","N", {expires:30,path:'/',domain:cookieDomain});//美豆
                        $.cookie("sygmek","N", {expires:30,path:'/',domain:cookieDomain});//美通卡
                        $.cookie("userAsset","N", {expires:30,path:'/',domain:cookieDomain});
                    }
                }
            }
            $config.shoppingAtom.yhj = $.cookie("yhj");
            $config.shoppingAtom.syjf = $.cookie("syjf");
            $config.shoppingAtom.sygmek = $.cookie("sygmek");
        }else{
            $.cookie("userAsset","N", {expires:30,path:'/',domain:cookieDomain});//如果没有数据 激活优惠券收起
        }
        $config.shoppingAtom.userAsset = $.cookie("userAsset");
    }

    function render(im){
        div(im).html(tpl.preferential_main(dfn(im)));
        alternation(im);
    }
    //获得当前时间戳防止缓存
    function get_time() {
        return new Date().getTime();
    }
    function YYTShoppingPay(){
        var sKey = "wlbmv43e4c8hn6dzqik6tir40t4xgcp9";//设置默认随机因子
        var enStr = "asUdENwiXyOjYfamD0JZcGtYk13fL+JvLJRdf/cMjvI=";
        var pgeditor = new $.pge({
            pgePath : "http://10.112.179.27:10106/ocx/",//控件下载目录，可以指定绝对路径，如"http://www.baidu.com/download/"
            //pgePath : "http://127.0.0.1:80/ocx/",//控件下载目录，可以指定绝对路径，如"http://www.baidu.com/download/"
            pgeId : "_ocx_password",//控件id
            pgeEdittype : 0,//控件显示类型,0(星号),1(明文)
            //pgeEreg1 : "[0-9]*",//输入过程中字符类型限制，只能输入数字
            //pgeEreg2 : "[0-9]{6,12}",//输入完毕后字符类型判断条件，与pgeditor.pwdValid()方法对应
            pgeMaxlength : 12,//允许最大输入长度
            pgeTabindex : 2,//tab键顺序
            pgeClass : "yyt-shopping",//控件css样式
            pgeInstallClass : "ocx_style",//针对安装或升级的css样式
            //pgeOnkeydown :"payRegAction",//回车键响应函数，需焦点在控件中才能响应
            tabCallback : "input2",//火狐tab键回调函数,设置要跳转到的对象ID
            //windows10 edge&Chrome42+相关
            pgeWindowID:"password"+new Date().getTime()+1,
            pgeRZRandNum:sKey,
            pgeRZDataB:enStr
        });
        window.pgeCtrl = pgeditor;
        $("#_ocx_password_str").html(pgeditor.load());
        pgeditor.pgInitialize();
    }
    function alternation(im){
        YYTShoppingPay();
        div(im).find('.bind-e-card-wrap').each(function(i, v){
            var divitem = $(this);
            divitem.find("input.e-num")
            .on("keyup", function(e){
                var val = $(this).val().replace(/[^a-zA-Z0-9]/g, '');
                if(val.length >= 4){
                    $(this).val(u.take(4, val));
                    var next = $(this).nextAll("input.e-num").eq(0);
                    if(val.length == 4)return next.focus();
                    next.val(u.drop(4, val)).focus().trigger("keyup");
                }else{
                    $(this).val(val);
                }
                if(e && e.keyCode == 8){
                    if(val.length == 0){
                        var prev = $(this).prev().prev("input.e-num");
                        prev.focus();
                    }
                }
            })//黏贴时清空输入框
            .on("paste", function(){
                $(this)
                    .val('')
                    .nextAll("input.e-num")
                    .val('');
            });
            divitem.find(".ver-code").focus(function(){
                $(this).attr("placeholder","").css("border","1px solid #a5a5a5");
            }).blur(function(){
                $(this).attr("placeholder","请输入验证码").css("border","1px solid #ccc");
            });
        });
        //优惠券激活码
        div(im).find('.redCard-box').each(function(i, v){
            var divitem = $(this);
            divitem.find("input.yhj_bm").on("keyup",function(){
                var val = $(this).val().replace(' ', '');
                $(this).val(val);
            });
            divitem.find("input.yhq-code")
            .on("keyup", function(e){
                var val = null;
                if($(this).hasClass("e-num-yhq")){
                    val = $(this).val().replace(/[^a-zA-Z0-9]/g, '');
                    if(val.length >= 6){
                        $(this).val(u.take(6, val));
                        var next = $(this).parent().next().find("input.e-num-yhq");
                        if(val.length == 6)return next.focus();
                        next.val(u.drop(6, val)).focus().trigger("keyup");
                    }else{
                        $(this).val(val);
                    }
                }else{
                    val = $(this).val();
                }
                if(e && e.keyCode == 8){
                    if(val.length == 0){
                        var prev = $(this).parent().prev().find("input.yhq-code");
                        prev.focus();
                    }
                }
            }).focus(function(){
                $(this).attr("placeHolder","");
            }).blur(function(){
                if($(this).hasClass("yhq-code-bm")){
                    $(this).attr("placeHolder","请输入激活码");
                }else if($(this).hasClass("yhq-code-jhm")){
                    $(this).attr("placeHolder","请输入激活码");
                }else if($(this).hasClass("yhq-code-yzm")){
                    $(this).attr("placeHolder","请输入验证码");
                }
            });
        });
        //美口令焦点事件
        div(im).find('.mdtjh').each(function(i, v){
            var divitem = $(this);
            divitem.find(".mkl_code").focus(function(){
                $(this).attr("placeholder","").css("border","1px solid #a5a5a5");
            }).blur(function(){
                $(this).attr("placeholder","请输入美口令").css("border","1px solid #ccc");
            });
        });
        //推荐号焦点事件
        div(im).find('.mdtjh').each(function(i, v){
            var divitem = $(this);
            divitem.find(".tjh_code").focus(function(){
                $(this).attr("placeholder","").css("border","1px solid #a5a5a5");
            }).blur(function(){
                $(this).attr("placeholder","请输入推荐员工编号").css("border","1px solid #ccc");
            });
        });
        div(im).find("[more-btn]").each(function(){
            $(this).hover(function(){
                $(this).find(".line_up").css({"border-color": "#f00"});
                $(this).find(".moreyhq").css({
                    "border-color": "#f00",
                    "color": "#f00"
                });
                var icon = $(this).find(".moreyhq").find("i");
                if(icon.is(".arrowdown"))icon.removeClass("arrowdown").addClass("arrowdown_red");
                else icon.removeClass("arrowup2").addClass("arrowup_red");
            }, function(){
                $(this).find(".line_up").css("border-color", "");
                $(this).find(".moreyhq").css({
                    "border-color": "",
                    "color": ""
                });
                var icon = $(this).find(".moreyhq").find("i");
                if(icon.is(".arrowdown_red"))icon.removeClass("arrowdown_red").addClass("arrowdown");
                else icon.removeClass("arrowup_red").addClass("arrowup2");
            });
        });
        //点击使用说明，显示说明详情
        div(im).find(".useInfoT").each(function(){
            var $this = $(this)
                ,$useInfoCons = $(".useInfoCon")
                ,$useInfoCon = $this.next(".useInfoCon")
                ,$useLists = $(".useList");
            $this.on("click",function(){
                $useInfoCons.hide();
                $useLists.hide();
                $useInfoCon.show();
            });
            $useInfoCon.find(".closebtn").on("click",function(){
                $useInfoCons.hide();
                $useLists.hide();
            });
        });
        //点击可用商品，显示可用商品列表
        div(im).find(".useListT").each(function(){
            var $this = $(this)
                ,$wrap = $(".coupon-group-wrap")
                ,$useLists = $(".useList")
                ,$useInfoCons = $(".useInfoCon")
                ,$closebtn = $(this).next().find(".closebtn")
                ,pos = {}
                ,space = {};
            $closebtn.on("click",function(){
                $useInfoCons.hide();
                $useLists.hide();
            });
            $this.on("click",function(){
                $useLists.hide();
                $useInfoCons.hide();
                var $useList = $this.next(".useList");
                var $useListArrow = $useList.find(".white-arrow");
                $useList.show();
                pos.left = $this.offset().left - $wrap.offset().left;
                pos.top = $this.offset().top - $wrap.offset().top;
                space.W = $wrap.outerWidth()/2;
                space.H = $wrap.outerHeight() - pos.top + $this.outerHeight();
                //左上
                if(pos.left < space.W && pos.top <= space.H){
                    $useList.css({"left":"80px", "top":"28px","bottom":"initial"});
                    $useListArrow.css({"left":"17px", "top":"-8px","bottom":"initial"});
                //右上
                }else if(pos.left > space.W && pos.top <= space.H){
                    $useList.css({"left":"initial",right:"-1px", "top":"28px","bottom":"initial"});
                    $useListArrow.css({"left":"initial",right:"97px", "top":"-8px","bottom":"initial"});
                //左下
                }else if(pos.left < space.W && pos.top > space.H){
                    $useList.css({"left":"80px","top":"initial","bottom":"30px"});
                    $useListArrow.find("em").removeClass("arrowup_gray").addClass("arrowdown_gray");
                    $useListArrow.css({"left":"17px", "top":"initial","bottom":"-20px"});
                //右下
                }else if(pos.left > space.W && pos.top > space.H){
                    $useList.css({"left":"initial",right:"-1px","top":"initial","bottom":"30px"});
                    $useListArrow.find("em").removeClass("arrowup_gray").addClass("arrowdown_gray");
                    $useListArrow.css({"left":"initial",right:"97px", "top":"initial","bottom":"-20px"});
                }
            });
        });

        //美通卡点击查看卡号，显示卡号
        div(im).find(".card-num-t").each(function(){
            var $this = $(this)
                ,$cardNumCons = $(".cardNumCon")
                ,cardNumCon = $this.parent().next(".cardNumCon")
                ,closebtn = cardNumCon.find(".closebtn");
            $this.on("click",function(){
                $cardNumCons.hide();
                cardNumCon.show();
            });
            closebtn.on("click",function(){
                $cardNumCons.hide();
            });
        });

        //渲染推荐号
        if(u.eq($config.shoppingAtom.sytjh, "Y") && !$config.shoppingAtom.renderRefPFlag){
           /* emit("renderRefP", null);*/
        }
        //查找选中的元素设置滚动条位置
        //renderflag = u.inc(renderflag);
        if(u.eq($config.shoppingAtom.yhj, "Y") && !u.isNil(checkeditemid)){
            var $parent = $(".coupon-group-wrap")
                , $checkedel = $(".coupon-group").find("[couponid='" + checkeditemid + "']")
                , parentOffset = $parent.offset()
                , checkedelOffset = $checkedel.offset();
            if(!u.isNil(parentOffset) && !u.isNil(checkedelOffset)){
                $parent.animate({scrollTop: checkedelOffset.top - parentOffset.top}, 500);
            }
        }

        function setStage(a, b){
            $config.shoppingAtom.mkl_code = "";
            $config.shoppingAtom.mkl_tip = "";
            $config.shoppingAtom.yhj = "N";
            $config.shoppingAtom.mdjf = "N";
            $config.shoppingAtom.sygmek = "N";
            $config.shoppingAtom.syzhye = "N";
            $config.shoppingAtom.syjf = "N";
            $config.shoppingAtom.sytjh = "N";
            $config.shoppingAtom.symkl = "N";
            $config.shoppingAtom[a] = b;
            $config.shoppingAtom.renderRefPFlag = false;

            //每次点击记录cookie
            $.cookie('transDataPointFlag',"-1", {expires:30,path:'/',domain:cookieDomain});
            transDataPointFlag = "-1";
            $.cookie('userAsset',"Y", {expires:30,path:'/',domain:cookieDomain});
            $.cookie("yhj","N", {expires:30,path:'/',domain:cookieDomain});
            $.cookie("mdjf","N", {expires:30,path:'/',domain:cookieDomain});
            $.cookie("sygmek","N", {expires:30,path:'/',domain:cookieDomain});
            $.cookie("syzhye","N", {expires:30,path:'/',domain:cookieDomain});
            $.cookie("syjf","N", {expires:30,path:'/',domain:cookieDomain});
            $.cookie("sytjh","N", {expires:30,path:'/',domain:cookieDomain});
            $.cookie("symkl","N", {expires:30,path:'/',domain:cookieDomain});
            $.cookie(a,b, {expires:30,path:'/',domain:cookieDomain});
        }

        function setOrState(a, b){
            $config.shoppingAtom[a] = b;
        }

        function _render(){
            render($config.shoppingInstenceAtom.preferential);
        }

        //选中数据
        function assocPathSelected(pathstr, value, flag){
            req.deferredReq(function(){
                var keyPre = value == "true" ? "" : "canel";
                emit(keyPre + "select" + flag, u.path(pathstr.split("."), dfn(im)));
                var path = u.concat(pathstr.split("."), ["checked"]);
                var pathSelected = u.concat(pathstr.split("."), ["selected"]);
                set(path, value == "true" ? true : false, im);
                set(pathSelected, value == "true" ? true : false, im);
                //晴空支付密码错误提示
                $config.shoppingAtom.yzm_tip = "";
            });
        }

        //设置值
        function setValueStage(name, el){
            $config.shoppingAtom[name] = el.val();
        }

        //这是最新时间long值
        function setTimeLongStage(name){
            $config.shoppingAtom[name] = new Date - 0;
        }

        //使用国美门电器门店会员积分 兑换
        function changeInto(){
            if(!validate.validate([[{
                    txt: $config.shoppingAtom.mdhyjf,
                    max: maxUseJF(im)
                }, "mdhyjf", function(msg){
                    $config.shoppingAtom.mdhyjf_tip = msg
                }]])){
                _render();
                return;
            }
            req.deferredReq(function(){
                $config.shoppingAtom.mdhyjf_tip = "";
                emit("changeInto", {
                    text: $config.shoppingAtom.mdhyjf,
                    errorfn: function(data){
                        $config.shoppingAtom.mdhyjf_tip = data.errMsg;
                        _render();
                    },
                    okfn: function(){
                        $config.shoppingAtom.mdhyjf = "";
                    }
                });
            });
        }

        //激活优惠券
        function activeYCode(){
            if(u.isEmpty($config.shoppingAtom.yhj_bm)){
                $config.shoppingAtom.yhj_tip = "请输入激活码";
                _render();
                return;
            }
            if(u.isEmpty($config.shoppingAtom.yhj_yzm)){
                $config.shoppingAtom.yhj_tip = "请输入验证码";
                _render();
                return;
            }
            if($config.shoppingAtom.yhj_bm.length<6){
                $config.shoppingAtom.yhj_tip = "亲，您的激活码不正确";
                _render();
                return;
            }
          
        
            // if(u.isEmpty($config.shoppingAtom.yhj_jhm)){
            //     $config.shoppingAtom.yhj_tip = "请输入激活码";
            //     _render();
            //     return;
            // }
           

            var __reqd = $config.shoppingAtom.yhj_bm;
            var _reqD = [__reqd.slice(0,-6),__reqd.slice(-6)];

            req.deferredReq(function(){
                $config.shoppingAtom.yhj_tip = "";
                var temp = [ $config.shoppingAtom.yhj_bm, $config.shoppingAtom.yhj_yzm];
                emit("activeYCode", {
                    cpno:  _reqD[0],
                    acode:  _reqD[1],
                    c: $config.shoppingAtom.yhj_yzm,
                    capCd: $config.shoppingAtom.yhj_img,
                    errorfn: function(data){
                        $config.shoppingAtom.yhj_tip = data.errMsg;
                        $config.shoppingAtom.yhj_bm = temp[0];
                        // $config.shoppingAtom.yhj_jhm =  temp[0] ;
                        $config.shoppingAtom.yhj_yzm = temp[1];
                        _render();
                    },
                    successfn: function(){
                        panel.success2s('兑换成功，请到商品优惠券里查看并使用');
                        $config.shoppingAtom.yhj_jh = "N";
                        _render();
                    }
                });
                $config.shoppingAtom.yhj_bm = "";
                $config.shoppingAtom.yhj_jhm = "";
                $config.shoppingAtom.yhj_yzm = "";
                $config.shoppingAtom.yhj_tip = "";
            });
        }

        //使用电子券
        function dzqAction(){
            if($config.shoppingAtom.dzqma == "")return panel.alert("请输入电子券密码");
            emit("dzqAction", {txt: $config.shoppingAtom.dzqma});
            $config.shoppingAtom.dzqma = "";
        }

        //推荐人员工号
        function ryghAction(){
            if(u.isEmpty($config.shoppingAtom.rygh)){
                $config.shoppingAtom.rygh_tip = "请输入门店推荐人员工号！";
                _render();
                return;
            }
            req.deferredReq(function(){
                emit("ryghAction", {
                    txt: ($config.shoppingAtom.rygh).replace(/\s/g,""),
                    errfn: function(data){
                        $config.shoppingAtom.rygh_tip = data.errMsg;
                        _render();
                    }
                });
                $config.shoppingAtom.rygh = "";
                $config.shoppingAtom.rygh_tip = "";
            });
        }

        //美口令
        function mklAction(){
            if(u.isEmpty($config.shoppingAtom.mkl_code)){
                //panel.error("请输入美口令！");
                $config.shoppingAtom.mkl_tip = "请输入美口令！";
                _render();
                return;
            }
            req.deferredReq(function(){
                $config.shoppingAtom.mkl_tip = "";
                emit("mklAction", {
                    key: $config.shoppingAtom.mkl_code,
                    errfn: function(data){
                        //panel.error(data.errMsg);
                        $config.shoppingAtom.mkl_tip = data.errMsg;
                        _render();

                    },
                    successfn: function(data){
                        $config.shoppingAtom.rygh = "";
                        $config.shoppingAtom.mkl_code = "";
                        _render();
                    }
                });
                $config.shoppingAtom.mkl_code= "";
            });
        }

        //取消推荐人员
        function ryghCanel(){
            $config.shoppingAtom.referrerInfo=null;
            req.deferredReq(function(){
                emit("ryghCanel", null);
                _render();
            });
        }

        //绑定国美E卡
        function bindECard(){
            if(!($config.shoppingAtom.ecard_1) || !($config.shoppingAtom.ecard_2) || !($config.shoppingAtom.ecard_3) || !($config.shoppingAtom.ecard_4)){
                //panel.error('请输入正确的16位密码');
                $config.shoppingAtom.dzqma_tip = "请输入正确的16位密码";
                _render();
                return
            }
            if(!($config.shoppingAtom.ecard_yzm)){
                //panel.error("请输入验证码");
                $config.shoppingAtom.dzqma_tip = "请输入验证码";
                _render();
                return
            }
            req.deferredReq(function(){
                emit("bindECard", {
                    //参数，在shopping发ajax 并且把此函数名，写在shopping最下面，前且定义此函数值为发请求的新建函数名
                    "ecartNumber": $config.shoppingAtom.ecard_1 + $config.shoppingAtom.ecard_2 + $config.shoppingAtom.ecard_3 + $config.shoppingAtom.ecard_4,
                    "imageCode": $config.shoppingAtom.ecard_yzm,
                    "capcd": $config.shoppingAtom.yhj_img,
                    errfn:function(data){
                        $config.shoppingAtom.dzqma_tip = data.error.message;
                        _render();
                    }
                })
            });
        }

        //支付密码验证
        function payRegAction(){
            var pwdTime = JSON.stringify(get_time()).substring(0,10);
            var pwdMD5 = md5(md5(pwdTime).toUpperCase()+pwdTime).toUpperCase();
            window.pgeCtrl.pwdSetSk(pwdMD5);//给控件设置随机因子
            var pwdResult = window.pgeCtrl.pwdResultSM4();//获取密码AES密文
            $config.shoppingAtom.yzm_pw = window.pgeCtrl.pwdResultSM4();//获取密码AES密文
            if($config.shoppingAtom.yzm_pw){
                req.deferredReq(function(){
                    $config.shoppingAtom.yzm_tip = "";
                    emit("payRegAction", {
                        captcha: $config.shoppingAtom.yzm,
                        capcd: $config.shoppingAtom.yzm_img,
                        //paypasswd: $config.shoppingAtom.yzm_pw,
                        payPasswd: pwdResult,
                        timeStamp: pwdTime,
                        siteId:$page.site,
                        errorfn: function(data){
                            $config.shoppingAtom.yzm_tip = data.errMsg;
                            _render();
                        }
                    });
                    $config.shoppingAtom.yzm = "";
                    $config.shoppingAtom.yzm_pw = "";
                });
            }else{
                $config.shoppingAtom.yzm_tip="请输入支付密码"
                _render();
            }
        }
        //优惠券使用最优组合
        function useBestCom(){
            req.deferredReq(function(){
                emit("useBestCom", {
                    errorfn: function(data){
                        //$.cookie('yhj_com','N', {expires:30,path:'/',domain:cookieDomain});
                        //$config.shoppingAtom.yhj_com = "N";
                        panel.error(data.errMsg);
                        _render();
                    },
                    successfn: function(){
                        $.cookie('yhj_com','Y', {expires:30,path:'/',domain:cookieDomain});
                        $config.shoppingAtom.yhj_com = "Y";
                        _render();
                    }
                });
            });
        }
        //取消优惠券使用最优组合
       function  useBestComCanel(){
           req.deferredReq(function(){
               emit("useBestComCanel", {
                   errorfn: function(data){
                       //$.cookie('yhj_com','N', {expires:30,path:'/',domain:cookieDomain});
                       //$config.shoppingAtom.yhj_com = "N";
                       panel.error(data.errMsg);
                       _render();
                   },
                   successfn: function(){
                       $.cookie('yhj_com','N', {expires:30,path:'/',domain:cookieDomain});
                       $config.shoppingAtom.yhj_com = "N";
                       _render();
                   }
               });
           });
       }

        //设置优惠券选中状态
        function changeCvsitem(pathstr, state, price){
            //此取值是为了提示运费券使用总额超过运费实际总额
            var total = 0;
            $('._alert_gome_total').each(function(){
                var $this = $(this);
                if ($this.attr("is-gome") =="GOME" || 
                    $this.attr("is-gome") =="guomeidianqi" || 
                    $this.attr("is-gome") =="dazhongdianqi" || 
                    $this.attr("is-gome") =="yongledianqi" || 
                    $this.attr("is-gome") =="beifangdianqi" || 
                    $this.attr("is-gome") =="heitianedianqi" || 
                    $this.attr("is-gome") =="tengdadianqi" || 
                    $this.attr("is-gome") =="fengxingdianqi" || 
                    $this.attr("is-gome") =="sanxingdianqi"
                ) {
                    total += parseInt($this.attr('gome-total'));
                }
            });
            var rehaulage = parseInt($('._alert_rehaulage').attr('rehaulage')),
                flag = total - rehaulage - parseInt(price);
            req.deferredReq(function(){
                var data = dfn(im)
                    , path = u.split('.', pathstr)
                    , item = u.path(path, data)
                    , lables = $config.labels
                    , checked = state == "Y" ? true : false;
                if(u.eq(Boolean(checked), Boolean(u.T))){
                    checkeditemid = item.id;
                    if (item.type == lables.COUPON_TYPE_FEE &&  flag <0) {
                        panel.fail2s('用劵额度大于抵扣运费 ，超出部分不退款哦');
                    }  
                    emit(item.type == lables.COUPON_TYPE_FEE ? "selectYf"
                            : (item.type == lables.COUPON_TYPE_RED ? "selectR"
                            : (item.type == lables.COUPON_TYPE_BLUE ? "selectB"
                            : (item.type == lables.COUPON_TYPE_SHOP || item.type == lables.COUPON_TYPE_PRODUCT ||  item.type == lables.COUPON_TYPE_GOU? "selectD"
                            : "selectO")))
                        , item); 
                }else{
                    checkeditemid = null;
                    emit(item.type == lables.COUPON_TYPE_FEE ? "cancelselectYf"
                            : (item.type == lables.COUPON_TYPE_RED ? "canelselectR"
                            : (item.type == lables.COUPON_TYPE_BLUE ? "canelselectB"
                            : (item.type == lables.COUPON_TYPE_SHOP || item.type == lables.COUPON_TYPE_PRODUCT ||  item.type == lables.COUPON_TYPE_GOU? "canelselectD"
                            : "canelselectO")))
                        , item);
                }
            });
        }

        ui.gpipes(div(im), {
            setStage: setStage,
            setOrState: setOrState,
            render: _render,
            changeCvsitem: changeCvsitem,
            assocPathSelected: assocPathSelected,
            setValueStage: setValueStage,
            setTimeLongStage: setTimeLongStage,
            changeInto: changeInto,
            activeYCode: activeYCode,
            ryghAction: ryghAction,
            mklAction:mklAction,
            payRegAction: payRegAction,
            useBestCom :useBestCom,
            useBestComCanel:useBestComCanel,
            ryghCanel: ryghCanel,
            bindECard: bindECard
        });
    }

    function make(div, data){
        function r(a, data1){
            if(a == "div")return div;//操作范围
            if(data1 != null){
                data = data1;
                return r;
            }
            if(a == "data")return data;//最新数据
        }
        render(r);
        return r;
    }

    exports.preferential = {
        make: u.curry(make),
        TYPE: TYPE,
        transData: transData,
        render: render,
        isNotUnsealPwd: isNotUnsealPwd,
        YYTShoppingPay:YYTShoppingPay
    };
}(this, request, util, util_ui, util_watch, GTPL, validate);