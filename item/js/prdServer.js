var prdMainNew = {};//定义这个对象是因为套装下拉框加入购物车需要调用加入购物车的方法
!function(exports,prdInfo,$,templateSimple){
    /*
    处理feedback

    返回值有三种情况 
    1.未登录 
    2.已登录 $.cookie("feedback") 没有值
    3.已登录 $.cookie("feedback") 有值
    */
        function feedbackt() {
          
            if ($.trim($.cookie("memberNo")).length == 0) {//1未登录
                return '';
            }
            if ($.trim($.cookie("feedback")).length == 0) { //2.已登录 $.cookie("feedback") 没有值
                return window.loginData.loginId;
            }
                      
            //以下是$.cookie("feedback") 有值
            var feedback_cookie = $.cookie("feedback") + '|' + window.loginData.loginId;

            var feedback = feedback_cookie.split('|');
            
            for (var i = 0; i < feedback.length; i++) {
                if (feedback[i] == '') {
                    feedback.splice(i, 1); i--;
              }
          }
          feedback.length > 5 && (feedback.length = 5);

            var feedback_new = [feedback[0]]; //去重后的feedback
            
            var flag = true;//没有重复

            for (var i = 1 ; i < feedback.length; i++) {
                flag = true;

                for (var j = 0 ; j < feedback_new.length; j++) {
                    if (feedback[i] == feedback_new[j]) {
                        flag = false;
                        break;
                    }
                }
                flag && feedback_new.push(feedback[i]);
            }         
            return  feedback_new.join('|');
        }
        
    /*心愿单埋码 */
    var omniture_wish = {
        show_wish: function () {//弹出心愿单   埋码
          /* var s = s_gi(s_account);
            s.linkTrackVars = "prop22,products,events";
            s.linkTrackEvents = "event67";
            s.linkTracking = true;
            s_objectID = "详情页_向好友提出心愿_3_点击触发";
            //根据实际追踪的控件进行命名 
            s.products = ";" + prdInfo.prdId + ";;;;evar23="+prdInfo.prdSign+"|evar24="+prdInfo.shopNo;
            s.events = "event67";
            s.tl(this, 'o', 'interaction');
            s.linkTracking = false;*/
        },
        bdshare: function (bdcmd, share_text) {
            if (share_text != document.title) {//更多发送愿望的方式：
                this.share('weibo');          
            } else {
                this.weibo_weichat(bdcmd);
            }
        },
        weibo_weichat: function (bdshareName) { //百度分享
            var shareName;
            if (bdshareName == 'tsina')
            {
                shareName = 'weibo';
            } else if (bdshareName == 'weixin')
            {
                shareName = 'weixin';
            }

           /* var s = s_gi(s_account);
            s.linkTrackVars = "prop22";
            s.linkTracking = true;
            s_objectID = "详情页_" + shareName + "_4_点击触发";
            //根据实际追踪的控件进行命名 
            s.tl(this, 'o', 'interaction');
            s.linkTracking = false;*/
        },
        wish_submit: function () { //发送按钮
            /*var s = s_gi(s_account);
            s.linkTrackVars = "prop22,products,events";
            s.linkTrackEvents = "event68";
            s.linkTracking = true;
            s_objectID = "心愿单弹窗_发送_1_点击触发";
            //根据实际追踪的控件进行命名
            s.products = ";" + prdInfo.prdId + ";;;;evar23=coo8|evar24=12345";
            s.events = "event68";
            s.tl(this, 'o', 'interaction');
            s.linkTracking = false;*/
        },
        share: function (shareName) {
            //链接名称: shareName(复制连接 微信扫一扫)                
           /* var s = s_gi(s_account);
            s.linkTrackVars = "prop22";
            s.linkTracking = true;
            s_objectID = "心愿单弹窗_" + shareName + "_2_点击触发";
            //根据实际追踪的控件进行命名 
            s.tl(this, 'o', 'interaction');
            s.linkTracking = false;*/
        }
    }
    var dialogContent={
        /*提心愿模板*/
        wish:'<div id="wish_wrap" class="wish_wrap">\
            <div id="wish_form">\
                <div class="wish_header">\
                    马上对TA说出心愿，等待惊喜吧！\
                </div>\
                <div class="wish_title">\
                    您可以免费给TA发短信\
                </div>\
                <div class="wish_form">\
                    <div class="item my_mobilePhone_wrap ">\
                        <div class="item_title">\
                            <span class="must_flag">*</span>我的手机号：\
                        </div>\
                        <div class="item_boder v_border">\
                            <input id="my_mobilePhone" class="_ie6_input wish_mobilePhoneNumber " type="text" value="" maxlength="11" tabindex="1"/>\
                        </div>\
                        <div class="verify_info">\
                            <div class="v_e">\
                                手机号码错误\
                            </div>\
                            <div class="v_r">\
                            </div>\
                        </div>\
                    </div>\
                    <div class="item verificationCode_wrap">\
                        <div class="item_title">\
                            <span class="must_flag">*</span>短信验证码：\
                        </div>\
                        <div class="item_boder v_border item_v_boder">\
                            <input id ="wish_verifyNum" type="text" class="_ie6_input wish_verifyNum" value="" maxlength="6" tabindex="2"/>\
                        </div>\
                        <div class="fl">\
                            <span id ="wish_verify_btn" class="wish_verify_btn ">免费获取验证码</span>\
                        </div>\
                        <div class="verify_info">\
                            <div class="v_e">\
                                验证码错误\
                            </div>\
                            <div class="v_send">\
                                验证码已发送,请查收短信\
                            </div>\
                        </div>\
                    </div>\
                    <div class="item his_mobilePhone_wrap">\
                        <div class="item_title">\
                            <span class="must_flag">*</span>TA的手机号：\
                        </div>\
                        <div class="item_boder v_border">\
                            <input id="his_mobilePhone" class="_ie6_input wish_mobilePhoneNumber " type="text" value="" maxlength="11" tabindex="3"/>\
                        </div>\
                        <div class="verify_info">\
                            <div class="v_e">\
                                手机号码错误\
                            </div>\
                            <div class="v_r">\
                            </div>\
                        </div>\
                        <div class="verify_double">\
                            手机号码重复\
                        </div>\
                    </div>\
                    <div class="item wish_text_wrap">\
                        <div class="item_title">\
                            给TA留言：\
                        </div>\
                        <div class="fl pr">\
                            <textarea id ="wish_text" class="wish_text" tabindex="4"></textarea>\
                            <div class="wish_text_e">\
                                留言最多140个字\
                            </div>\
                            <div class ="wish_text_presentation">\
                                例如：我是Tina，我想要这款商品，你愿意送给我吗？\
                            </div>\
                        </div>\
                    </div>\
                    <div class="item">\
                        <div class="item_title">\
                        </div>\
                        <div class="fl">\
                            <button id ="submit_wish" class="submit_wish">发送</button><span class="submit_wish_text">短信的内容包括：留言+您的手机号+商品标题+网址</span>\
                        </div>\
                        <div style="clear:both;">\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div id="wish_weixin" style ="display:none;">\
                <div class="wish_header">\
                    马上对TA说出心愿，等待惊喜吧！\
                </div>\
                <div>\
                    <p class ="tc">\
                        <img class ="qrcode_img" width="200" height="200"/>\
                    </p>\
                    <p class ="weixin_text">\
                        打开手机微信客户端，点击“发现”使用“扫一扫”，选择您要发送的朋友，TA就能看到您提出心愿的商品啦~~\
                    </p>\
                </div>\
            </div>\
            <div id="send_wish_success" class="send_wish_success">\
                <div class ="send_wish_success_flag">\
                </div>\
                <div class ="send_wish_success_text">\
                    短信已发送成功!\
                </div>\
                <div class ="c333">\
                    <span>你可以继续 </span><span class="tichu_wish">提出心愿</span>\
                </div>\
            </div>\
            <div id="send_wish_error" class="send_wish_error">\
                <div class ="send_wish_error_flag">\
                </div>\
                <div class ="send_wish_error_text">\
                    短信已发送失败!\
                </div>\
                <div class ="c333">\
                    <span>你可以</span><span class="try_again">再试一次 </span>\
                </div>\
            </div>\
            <div id="wish_share_wrap" class ="wish_share_wrap">\
                <div class ="c5e">\
                    更多发送愿望的方式：\
                </div>\
                <div id ="wish_share" class="wish_share oh">\
                    <div class ="fleft">\
                        <span id="copy_link" class ="copy_link" href="javascript:;"><i></i><span>复制链接</span></span>\
                        <span class ="weixin_saoyisao" id="wish_show_weixin"><i></i><span>微信扫一扫</span></span>\
                    </div>\
                </div>\
                <div id ="copy_link_success">\
                          成功复制到剪切板\
                    <div class ="c_l_s">\
                    </div>\
                </div>\
            </div>\
    </div>',
    /*弹框出错*/
    Er:'<ul class="dialogError">\
        <li class="dgIcon"></li>\
        <li class="errorBox"></li></ul>',
    /*已经收藏过*/
    dialogAdd:'<ul class="dialogAdd">\
        <li class="up clearfix">\
            <div class="left">\
                <i class="dgIcon" id="dgIcon"></i>\
            </div>\
            <div class="right">\
                <div id="dgMsg" class="dgMsg">添加成功！</div>\
                <div id="dgTxt" class="dgTxt"></div>\
                <div id="dgLnk" class="dgLnk">\
                    <a href="//g.atguat.com.cn/ec/homeus/cart/cart.jsp" target="_self" class="redlink">去购物车结算&nbsp;></a>\
                    <a href="javascript:;" class="stages">继续购物</a>\
                    <a href="//g.atguat.com.cn/ec/homeus/myaccount/gome/menupage/myFavorites.jsp" target="_blank" class="arrange"></a>\
                </div>\
            </div>\
        </li>\
        <li class="collect_dingyue clearfix">\
                   <div class="txt">\
                       订阅商品降价促销提醒\
                   </div>\
                   <div class="price-area" style="display: list-item;">\
                       <em class="pdtl-red">&nbsp;&nbsp;</em>&nbsp;价格低于：\
                       <span class="price-box"><i class="">¥</i>\
                       <input type="text" id="min-price"></span>\
                       <span>时，通知我</span>\
                       <span id="error-price"></span>\
                    </div>\
                    <div class="inp">&nbsp;&nbsp;&nbsp;手机号码：\
                       <input type="text" id="tell" maxlength="11" data-value="">\
                       <em class="pdtl-red">*</em>\
                       <span class="error" id="errorTell" style="display:block"></span>\
                   </div>\
                   <div class="inp">\
                       &nbsp;&nbsp;&nbsp;邮箱地址：\
                       <input type="text" id="mail" maxlength="50"><em class="pdtl-red">&nbsp;&nbsp;</em>\
                       <span class="error" id="errorMail"><i></i></span>\
                   </div>\
                   <div class="smt"><a href="javascript:;" class="redlinks">订阅提醒</a></div>\
          </li>\
        <li class="dn1 clearfix" style="clear: both;width: 410px;">\
            <div class="tit">购买了此商品的用户还购买了：</div>\
            <div id="buyMbox" class="andBuyOut" style="display:none"></div>\
        </li>\
    </ul>',
    /*到货通知和降价通知*/
    dialogTZ:'<ul class="dialogTZ">\
        <li class="sicon"></li>\
        <li class="tit">到货通知</li>\
        <li class="txt">一旦该商品<i>到货</i>，我们会通过手机短信或邮件通知您</li>\
        <li class="price-area" style="display:none">\
            <em class="pdtl-red">&nbsp;&nbsp;</em>&nbsp;价格低于：<span class="price-box"><i class="">¥</i><input type="text" id="min-price" /></span>\
            <span>时，通知我</span>\
            <span id="error-price"></span>\
        </li>\
        <li class="inp">&nbsp;&nbsp;&nbsp;手机号码：<input type="text" id="tell" maxlength="11" /><em class="pdtl-red">*</em><span class="error" id="errorTell"></span></li>\
        <li class="inp">&nbsp;&nbsp;&nbsp;邮箱地址：<input type="text" id="mail" maxlength="50" /><em class="pdtl-red">&nbsp;&nbsp;</em><span class="error"  id="errorMail"><i></i></span></li>\
        <li class="add"><input type="checkbox" checked="checked" id="chk" /><label for="chk">同时加入收藏夹</label></li>\
        <li class="smt"><a href="javascript:;" class="redlink">确定</a></li>\
    </ul>'

    };
/* 详情页首屏所有点击逻辑 */
    var prdMain = function(){
        this.dgObj=$("#innerBox");
    };
    prdMain.prototype={
         
        /*绑定事件*/
        bind:function(){
            var _this = this;


            /*苹果特惠绑定事件appleAddcart*/
            $('#applebtn').on('click',function(){
                _this.appleAddcart($(this));
            });


            //联系我享优惠   已下架
            $('#bargain').on('click',function(){
                var openUrl=$(this).attr('data-url');
                var data=$(this).attr('data');
                if(data){
                    window.open('//group.gome.com.cn/shtml/gome/201611/20161101115403CAUE.shtml')
                    return false;
                }
                //是否登陆
                if (loginData.loginStatus !=3) {
                    location.href = '//login'+cookieDomain + '/login?tableName=login&orginURI=' + location.href;
                    return;
                } 
                window.open(openUrl,"",'toolbar=0,scrollbars=0,location=0,menubar=0,resizable=1,width=1120,height=700');
            });

            //心愿单
            $('#showWish').click(function () {
                if ($('#showWish').attr('disabled') == '1') {
                    return false;
                }
                _this.wish();
            });
            /* 收藏商品 */
            $("#collect").click(function (event) {
                if(prdInfo.prdType == 2){
                    return false;
                }
                _this.collect();
            });
         
            /* 降价通知、到货通知 */
            $("#reduce,#arrival").click(function (evt) {
                
                
                    if(prdInfo.prdType=='2'){
                        return false;
                    };
                    var _id = $(this).attr("id");
                    _this.lgCall = "prdMain.prdNotice('" + _id + "')";
                    _this.prdNotice(_id);
              
            });
          
            /*绑定加入购物车*/
            _this.bindCart();

            //快速购
            $('#easyShopping').click(function (evt) {
                if ($(this).hasClass("disabled")) {
                    return;
                }
                if(loginData.loginStatus!=3){
                    g.login(function () {});
                    return;
                }
                _this.easyShopping();
                
            });

            
            //分期购
            $("#pay_fenQi").click(function (evt) {      
                if($(this).hasClass('pay_fenQi') || $(this).hasClass("disabled")){
                    return false;
                } 
                 g.login(function () {
                    _this.easyShopping('pay_fenQi');
                 });
            });
            
            //收藏店铺
            $('.btn-collect').click(function (evt) {
                if($(this).hasClass('disabled')){
                    return false;
                }
                if(prdInfo.shopNo == '' && $(this).data('shopid')){
                    _this.collectShop($(this).data('shopid'), 'QJ');
                }else  {
                    _this.collectShop( prdInfo.shopNo, prdInfo.sapSkuType);
                }
            });



            $('.shareGold').on('click', function (event) {
                event.stopPropagation();
                if(event.target!==this){
                    return false;
                }
                var  tsharejs;    
                if (!$(this).data('loadcss')) {
                    
                    $(this).data('loadcss', true);


                    tsharejs = $.ajax('//js.gomein.net.cn/channels/jsshare/share.js', {
                        dataType: "script",
                        cache: true,
                        success:function(){
                             _this.sharejs();
                        }
                    })
                }else{
                    _this.sharejs();
                }  
               
            });

            $('#mfprice_box_url').on('click',function(){
                /*返利分享美信*/
                var _url="//help.gome.com.cn/article/431-0-0.html";
                    $.createProgress({
                        Jump:true,
                        openJump:true,
                        url:_url
                    });
            });
            /*合约机*/
            $('#telecom').click(function(){
                if(!$(this).attr('data')){
                   $.ajax('//js'+cookieDomain+'/??/gmpro/1.0.0/item/2.0.0/item/1.0.1/js/telecom.min.js',{
                               dataType: "script",
                               cache: true
                           });
                }
                
            });

            /*点击购买按钮*/
            $('#telecom_buy').click(function(){
                var str=$('#telecom').text();
                if($('#btnLink').hasClass('disabled')){
                    return;
                }
                if(str=="选择号码"){
                    $('#btnLink').addClass('disabled');
                    $('#telecom').addClass('telecom_phone_noselect');
                    $('.telecom_pic').removeClass('telecom_pic_hide');
                    return
                }else{
                    g.login(function(){
                        _this.easyShopping('telecom');
                    });
                }
            })
            /*自营电信卡*/
            $('#zi_telecom').on('click','a',function(evt){
                        
                if($(this).hasClass('select')){
                    return false;
                }
                $(this).addClass('select').parent().siblings().find('a').removeClass('select');

               //点击完其他套餐之后 再绑定事件
                if ($('#telecom').attr('data')) {
                   $('#telecom').off().on('click',function(etv){
                       Telecom.telecom_num=0;
                       Telecom.telecom1();
                   });
                };
                $('#telecom').html('选择号码').removeClass('telecom_phone_select');
                $('.replay_sel').addClass('dn');


                if($(this).attr('Tskuid')){
                     EventManager.fireEvent('ZI_TELECOM_PLAN');
                }
            })

            /*绑定城市选择器*/
            $('#address').gCity({
                gc_ads: 'chtm',
                gc_evt: function () {

                    var $domain=cookieDomain;
                    if(location.host.indexOf("hk")!=-1){
                        $domain=location.host.replace("item","");
                    }
                    $.cookie('atgregion', this.xid + "|" + this.chtm + "|" + this.cid + "|" + this.sid + "|" + this.zid, { expires: 30, path: '/', domain: $domain });
                    //fnUtil.city = this.snam;
                    window.location.reload();
                    showStoreStorage.del('showStore');//切换区域，清除上一个地区的门店导购信息
                }
            });

            /* 多少人评价跳转至评价模块 */
            $("#goappr").click(function(){
                var _h = $("#prd_tbox").offset().top - 20;
                if (prdInfo.threeDflag == true)
                {
                    $("#prd_tbox").children().eq(3).click();
                } else {
                    $("#prd_tbox").children().eq(2).click();
                }
                $('html,body').animate({scrollTop:_h+'px'},200);
            });
            /*纠错跳转*/
            $('.j-corr').on('click',function(){
                // g.login(function () {
                    window.open("//jiucuo" + cookieDomain + "/"+prdInfo.prdId+"-"+prdInfo.sku+".html");
                 // });
            });

            /*联营评分点击伸缩*/
            $('#showScoreMore').toggle(function () {
                $(this).removeClass("down").addClass("up");
                $('.services-score-single').removeClass("hide");
                $('.services-score-detail').addClass("hide");
            }, function () {
                $(this).removeClass("up").addClass("down");
                $('.services-score-single').addClass("hide");
                $('.services-score-detail').removeClass("hide");
            })

            /*蓝卷点击*/
            $('#lanjuan').on('click',' .blue-label',function(event){
                event.stopPropagation();
                $('.gome-bar-btn-coupon').click()
            });

            // 限购和剩余
            $('.j-gACbtnA').mouseenter(function(evt){
                evt.stopPropagation();
                $('.remainbox').removeClass('dn');
            }).mouseleave(function(){
                $('.remainbox').addClass('dn');;
            });


            $('#mobtn').mouseenter(function(evt){
               evt.stopPropagation();
               var  lbotom=$(this).offset().top;
               var scrnH=$(window).height();
               var st=$(window).scrollTop();
               var s=scrnH+st-lbotom;
               if(s<100){
                $(this).addClass('mobtnshowtop').loadsrc();
               }else{
                $(this).addClass('mobtnshow').loadsrc();
               }
               
           }).mouseleave(function(){
               $(this).removeClass('mobtnshow').removeClass('mobtnshowtop');
           });

            //增值服务:延保、屏碎保、意外保
            /* .prdmodLists有下拉列表的鼠标进入、离开事件 */
            $('#addedService').on('mouseenter','.prdmod.prdmodLists',function(evt){
                var $this=$(this);
                $this.addClass("prdmodHover");
                /*下拉列表点击事件 */
                $this.find('.drop-list').off("click").on("click",".li",function(event){
                    event.stopPropagation();
                    _this.listItemClick($(this));
                });
            }).on('mouseleave','.prdmod.prdmodLists',function(evt){
                $(this).removeClass("prdmodHover");
            });

            $('#addedService').on('mouseenter','.li',function(){
                $(this).siblings().find('.xq').hide();
                $(this).find('.xq').show();
            }).on('mouseleave','.li',function(evt){
                $(this).find('.xq').hide();
            });


            //增值服务列表项点击事件
            $('#addedService').off("click").on("click",".prdmod",function(evt){
                evt.preventDefault();
                _this.serviceItemClick($(this));
            });

            //"?"查看信息的鼠标进入、移出事件
            $('#addedService .more').mouseenter(function(evt){
                $(this).find('.tips').removeClass('hide');
            }).mouseleave(function(){
               $(this).find('.tips').addClass('hide');;
            });


            $('.shareGold').on('mouseenter',function(event){
                $('.mfprice_box ').removeClass('hide');
            }).on('mouseleave',function(event){
                $('.mfprice_box ').addClass('hide');
            })
            //了解预约抢购按钮滑过
            $('#yuye_more').mouseenter(function(){
                $('#yuye_more_msg').show();
            }).mouseleave(function(){$('#yuye_more_msg').hide();});

            //购买返利
            $('.cuxiaobox').on('mouseenter','.rebateWen',function(event){
                $('.rebateCont').removeClass('hide');
            }).on('mouseleave','.rebateWen',function(event){
                $('.rebateCont ').addClass('hide');
            })

            //快速购优化
            $('#easyShopping').mouseenter(function (evt) {
				if ($(this).hasClass("disabled") || (allStore && allStore.userStore && allStore.userStore.phase=="1") || (allStore && allStore.userStore && allStore.userStore.phase=="2")) {
					return false;
				}
				_this.easyShoppinghover();
			}).mouseleave(function(){
				$('.easyShopping_box').addClass('hide');
			});

            /*滑动促销*/
            $('.prd-cuxiao-other').mouseenter(function (e) {
                e.stopPropagation();
                $('.prd-cuxiao-other').height($('.prd-cuxiao-other').height());
                $(".cuxiaobox").addClass("open").find('.dn').addClass('addn').removeClass('dn');
                $(".promotions-collapse").find('.prd-promotions-globel').addClass('dn');
            }).mouseleave(function () {
                $(".cuxiaobox").removeClass("open").find('.addn').addClass('dn').removeClass('addn');
                $(".promotions-collapse").find('.prd-promotions-globel').removeClass('dn');
            });

            /*手机专享价扫一扫滑过事件*/
            $('.prd-promotions').on('mouseenter','#shoujizhuanxiang_saosao',function () {
                $('#shoujizhuanxiang_wrap').loadsrc().show();
                $('.prd-cuxiao-other').height($('.prd-cuxiao-other').height());
                $(".cuxiaobox").addClass("open").find('.dn').addClass('addn').removeClass('dn');
                $(".promotions-collapse").find('.prd-promotions-globel').addClass('dn');
            }).on('mouseleave','#shoujizhuanxiang_saosao',function(){
                $(".cuxiaobox").removeClass("open").find('.addn').addClass('dn').removeClass('addn');
                $(".promotions-collapse").find('.prd-promotions-globel').removeClass('dn');
              $('#shoujizhuanxiang_wrap').hide();
            });

            /*大图点击*/
            $(".jqzoom").click(function () {
                //保存cookie，供大图页使用
                $.cookie('addItemCount', 1 , { expires: 1, path: '/', domain: cookieDomain });
                $.cookie('purchaseCounts',$("#enterQty").val() , { expires: 1, path: '/', domain: cookieDomain });
                //大图页使用的是普通详情页的prdInfo(后端没有改过来),闪购商品vipShopFlag、activityId和普通商品不一致，需要传过去
                $.cookie('vipShopFlag', prdInfo.vipShopFlag ? true : false, { expires: 1, path: '/', domain: cookieDomain });
                $.cookie('activityId', prdInfo.programId , { expires: 1, path: '/', domain: cookieDomain });
                window.open($(".pic-l-b").attr("href") );
            });
            //大图视频播放
            if(prdInfo.isvideo){
               _this.videoplayer(); 
            };
            /** 放大镜结束 **/
            /*运费说明滑过事件*/
            /*111111111*/
            if (prdInfo.isStore) {
                $('body').on('mouseenter','.freightnote',function(){
                    var price= parseInt(prdInfo.price) > 0 ? prdInfo.price : 1;
                    g.ajax('/item/v1/d/shippingfee/'+prdInfo.sku+'/'+g.cityCode(2)+'/'+ price+'/flag/item/allStore', {
                        site:'s',
                        callback :  'allStore'
                    }).done(function (data) {
                        if(data.success && !$.isEmptyObject(data.result) ){
                            var data=data.result;
                            $('#show_xiangqing')
                                .removeClass("hide").css({'left': $('.freightnote').position().left})
                                .html('<i class="btn-arrow-top">左箭头</i>' +
                                (function () {
                                    var html = '';
                                    for (var i in data) {
                                        html +=
                                            '<p  style="max-width:400px">' +
                                            '<b>' + i + '</b>：' +data[i] +
                                            '</p>';
                                    };
                                    return html;
                                })() );
                        }
                    });
                }).on('mouseleave','.freightnote',function(){
                    $('#show_xiangqing').addClass("hide").removeAttr('style');
                });
            }
        },
        videoplayer:function(){
            var videopic = new MeixinPlayer();
            var videotime;//记录暂停时间
            //大图页展示视频
            $('.video-btn').off().on('click',function(){
                $('.video-status,.pic-video').show(); 
                if(!videotime){
                   videopic.init(prdInfo.videoid, "pic-video",{"autoplay":1,"env":prdInfo.meixinshiping});
                   return;
                }
                videopic.playFromLastPlayTime(videotime);
                
            });
            $('.video-status').off().on('click',function(){
                $('.video-status,.pic-video').hide();
                videotime=videopic.currentTime();
                videopic.stopVideo();
            });
        },
        serviceItemClick : function(obj){
            var self=obj
                , aLink=self.find("a.mod-link");
            if(aLink.hasClass("select")){
                aLink.removeClass("select");
                if(self.hasClass("prdmodLists")){
                    var itemFirst=self.find(".drop-list .li").eq(0);
                    self.find(".mod-link .years").html(itemFirst.find(".name").html());
                    self.find(".mod-link .price").html(itemFirst.find(".price").html());
                    self.find(".drop-list .checkbox").removeClass("checked");
                }
            }else{

                aLink.addClass("select");
                if(self.hasClass("prdmodLists")){
                    self.find(".drop-list .li").eq(0).find(".checkbox").addClass("checked");
                }
            }

           
        },
        /*延保*/
        listItemClick : function(obj,evt){
            var self=obj
                , parentNode=self.parents(".prdmod")
                , dropList=parentNode.find(".drop-list")
                , checkbox=self.find(".checkbox");
            if(checkbox.hasClass("checked")){
                checkbox.removeClass("checked").nextAll('span').removeClass('e3red');
                parentNode.find(".mod-link").removeClass("select");
            }else{
                self.siblings().find(".checkbox").removeClass("checked").nextAll('span').removeClass('e3red');
                checkbox.addClass("checked").nextAll('span').addClass('e3red');
                parentNode.find("a .years").html( self.find(".name").html());
                parentNode.find("a .price").html('¥'+self.attr("price"));
                parentNode.find(".mod-link").addClass("select");
            }
            parentNode.attr({
                "pid" : self.attr("pid"),
                "sid" : self.attr("sid"),
                "title" : self.find(".name").attr("title")
            });
            //触发下拉列表的收起事件
            parentNode.mouseleave();
            //显示选中选项
            

        },
        sharejs:function(tsharejs){
           
        var tshare_tit="";
        var tshare_img="";
        var arr = [];
        var html = $(".hgroup h1").html();
            if (html == "") {
                return '';
            }
            arr.push(html);
            prdInfo.price && arr.push('国美价￥' + prdInfo.price);
            $("#J-smart-buy").attr('jdprice') && arr.push($("#J-smart-buy").attr('jdprice'));
            $("#J-smart-buy").attr('suningLower') && arr.push($("#J-smart-buy").attr('suningLower'));
            tshare_tit= arr.join('，');
            $('.pic-small ul li').each(function(){
                var this_img_str=$(this).find('img').attr('src');
                tshare_img+=this_img_str+',';
            });
            tshare_img=tshare_img.substring(0,tshare_img.length-1);
            tshare_img=tshare_img.replace(/_50/g,'_360');
            var parentkid=this.GetQueryString('kid');
            var mid='';
            this.GetQueryString('mid')?mid='&mid='+this.GetQueryString('mid'):''
            this.GetQueryString('stid')?mid+='&stid='+this.GetQueryString('stid'):''
            if(prdInfo.meixinp=="1" && loginData.loginStatus==3 && prdInfo.prdType != 2){ //返利美信1支持返利2登录状态3不是下架
               var locationHref=location.href.split('?')[0];
               $.ajax({
                    url:prdInfo.gomePlus+'/v3/ext/rebate/shareChain/kid',
                    data:{
                            "itemId":prdInfo.prdId,
                            "skuId":prdInfo.sku,
                            "flow":1,
                            "userId":loginData.loginId,
                            "parentKid":parentkid,
                            "callfrom":0,
                            "jsonp":"meixin_kid"
                    },
                    type:'get',
                    dataType:'jsonp',
                    jsonpName:'meixin_kid',
                    success:function(msg){
                        if(msg && msg.data && msg.data.__code && msg.data.__code==200){
                            if(msg.data.kid){
                                locationHref+='?kid='+msg.data.kid+mid;
                            };   
                        };
                        _GmFxb.FxbDiv(1,locationHref,tshare_tit,tshare_img,"","","","","","","","","","");  
                    }

                })
            }else{
                var mid="";
                 if(this.GetQueryString('kid') || this.GetQueryString('mid') || this.GetQueryString('stid')){
                                        var kidobj={
                                            "kid":this.GetQueryString('kid'),
                                            "mid":this.GetQueryString('mid'),
                                            "stid":this.GetQueryString('stid')
                                        };
                                        for(i in kidobj){
                                            kidobj[i]?mid+=i+'='+kidobj[i]+'&':''
                                        }
                                        mid='?'+mid
                                    }
                mid=mid.substring(0,mid.length-1);
                _GmFxb.FxbDiv(1,location.href.split('?')[0]+mid,tshare_tit,tshare_img,"","","","","","","","","","");
            }
        },
        GetQueryString :function(name){
            /*取地址栏*/
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
                if(r!=null)return  unescape(r[2]); return "";
        },
        objToUrlStr : function(obj){
            var str="",key;
            for(key in obj){
                str+='&'+key+'='+obj[key]
            }
            return str;
        },
        /* 绑定购物车按钮事件 */
        bindCart:function(){
            var _this = this;
            var _tim;
            /*添加购物车*/
            $("#addCart,#addCartLink").click(function(evt){
                //如果悬浮按钮拥有类名btnYuQiang,表示按钮改为了预约抢购按钮
                if(this.id==="addCartLink" && $(this).hasClass("btnYuQiang")){
				}else{
                    _this.addCart();
                }
                return false;
            });
            /* 浮动小购物车 */
            $("#addCartLink,#floatToCart").unbind("hover").hover(function(){
                window.clearTimeout(_tim);
                $("#miniPrice").html( "¥"+prdInfo.price);
                var minC = $("#floatToCart");minP = minC.find("img");minC.show();_this.imgSrc(minP);
            },function(){
                _tim = window.setTimeout(function(){$("#floatToCart").hide();},200);
            });
          
        },
        addedParamsfn: function(){//延保//如果页面中有 增值服务(0延保、1屏碎保、2意外保)var parentkid=this.GetQueryString('kid');
            var addedParams = "";
            if($(".added-service").is(":visible")){
                    $(".added-service .mod-link").each(function(k,v){
                        if($(this).hasClass("select")){
                            addedParams+=','+$(this).parent().attr('cartype')+','+$(this).parent().attr("sid")+','+$(this).parent().attr("pid")+','+$(this).parent().attr("skuno");
                        }
                    })
            }
            
            return  addedParams.substr(1);
        },
        /*苹果特惠加入购物车*/
        appleAddcart: function($this){

             /* 无货 && 下架 状态 不执行添加购物车 */
            if($("#addCart").hasClass("disabled")){
                return false;
            }


            
            var appleNum = $("#enterQty").val()
            , _this=this
            , appleAddcartData={
              "activityid": $this.attr('promId'),
              "threeactivityid":$this.attr('threeActivityId'),
              "threeproductid":$this.attr('threeProductId'),
              "sid":prdInfo.sku,
              "pid":prdInfo.prdId,
              "is":_this.addedParamsfn()
            },
            time = new Date().getTime(),//设置时间戳，实时调用接口，避免倒计时当前时间有缓存
            applecartUrl = "//cart"+ cookieDomain +"/apple/profile?"+this.objToUrlStr(appleAddcartData).substr(1);
              //请求苹果特惠https://ss.atguat.com.cn/item/v1/price/promogen/iphoneSale/%7bskuNo%7d
                   
             /*选延保之后需要变更参数*/ 
              g.login(function(){ //登录之后执行

                if(appleNum>1){

                   var _err = "教育特惠商品仅能购买一件商品!",
                      _htm = '<div class="applerrorTxt">' +  _err + '</div>';
                      _this.dialog({ inner: dialogContent.Er, cssname: "dialogBox Er", errIco: "warn", errMsg: _htm });


                      return;
                  }

                  /*再次判断促销*/
                    $.ajax({
                        type: 'get',
                        url: "//ss" + cookieDomain + '/item/v1/price/promogen/iphoneSale/' + prdInfo.skuNo + '/flag/item/apple' + time,
                        dataType: 'jsonp',
                        jsonpName: "apple" + time
                    }).done(function(resData){

                        if (resData && resData.result){ // 有信息

                            var appleData=resData.result;
                            if(appleData.state=="onSale"){
                                   
                                 $.createProgress({
                                        Jump:true,
                                        openJump:false,
                                        url:applecartUrl
                                    })

                            }else{
                            /*终止或者过期*/
                            var _err = "苹果特惠活动已结束!",
                              _htm = '<div class="applerrorTxt">' +  _err + '</div>';
                              _this.dialog({ inner: dialogContent.Er, cssname: "dialogBox Er", errIco: "warn", errMsg: _htm,closeCall:function(){

                                  window.location.href = window.location.href;

                              } });
                            
                              return false;
                            }

                        }else{
                            /*待定*/

                            /*终止或者过期*/
                            var _err = "苹果特惠活动已结束!",
                              _htm = '<div class="applerrorTxt">' +  _err + '</div>';
                              _this.dialog({ inner: dialogContent.Er, cssname: "dialogBox Er", errIco: "warn", errMsg: _htm,closeCall:function(){

                                  window.location.href = window.location.href;

                              } });
                            
                              return false;
                            
                            }
                    })       
              

              });
                
        },
        /* 加入购物车 */
        addCart: function () {
            /*maima 25-4-10  4-21去掉多出来的一个请求，在购买了还购买了处*/
           /* if ($.addCartCode) {
                $.addCartCode();
            }*/

            /* 无货 && 下架 状态 不执行添加购物车 */
            if($("#addCart").hasClass("disabled")){
                return false;
            }
            var _that=this;
            var _url=""
                , addCartData={
                    "homesite":"home",
                    "type":"0",
                    "sid":prdInfo.sku,
                    "pid":prdInfo.prdId,
                    "pcount":$("#enterQty").val(),
                    "k":_that.GetQueryString('kid'),
                    "m":_that.GetQueryString('mid'),
                    "s":_that.GetQueryString('stid'),
                    "is":_that.addedParamsfn()
                }
                , _r=new Date().getTime()
                , cardType=prdInfo.sapSkuType;          
        
            if( prdInfo.productType=='hwg-prd'  ){
                addCartData.type=16;
                addCartData.homesite="haiwaigou"
            };

            if(prdInfo.sapSkuType=="ECTZ"){
                addCartData.type=24;
            };

            var cardType=prdInfo.sapSkuType
                , _url='//cart'+cookieDomain+'/addsuccess?'+this.objToUrlStr(addCartData).substr(1)+'&cr=0&_r='+_r;
            if(cardType=="ZSTK" || cardType=='ZDZK'){
                g.login(function(){
                    var _url='//card'+cookieDomain+'?skuType='+cardType+'&productId='+addCartData.pid+'&skuId='+addCartData.sid+'&count='+addCartData.pcount;
                    $.createProgress({
                        Jump:true,
                        openJump:false,
                        url:_url
                    })
                });
            }else{
                $.createProgress({
                    Jump:true,
                    openJump:true,
                    url:_url
                })
                try {
                    beheActiveEvent({at:"buy",src:"1697000073",cid:"",sid:"1112.959"});
                } catch (e) {
                }
            }
        },
        easyShoppinghover:function(){
             var easyShopping_box=$('.easyShopping_box');
             var data_easy=$('#easyShopping').attr("data_easy");
             var easyBox_str={
                 newuser:"<i class='btn-arrow-top'>左箭头</i><div class='pop-inner'><p><strong>快速下单，直接到达支付页面！</strong></p><p>初次使用需确认收货地址和联系方式，<br>后续使用即可完成快速购买！</p></div>"
             }
             easyShopping_box.removeClass('hide');
             easyShopping_box.css('left',($('#easyShopping').position().left));
             if(loginData.loginStatus!=3){
                 
             }else{
                 if(data_easy==1){
                     $.ajax({
                         url:"//member"+cookieDomain+"/myaccount/address/getQuicklyBuyAddress",
                         type:"get",
                         dataType:"jsonp",
                         jsonpName:"ckdata",
                         success:function(data){
                             
                             $('#easyShopping').attr("data_easy","2");
                             if(data.result && data.result.gomeAddress && data.result.gomeAddress.countyName && data.result.gomeAddress.townName){
                                 var data=data.result.gomeAddress;
                                 var mobiles=data.mobile?data.mobile:data.phoneNumber
                                 var str='<i class="btn-arrow-top">左箭头</i><div class="pop-inner"><div class="userinfo"><p class="name"><strong>'+data.firstName+'</strong>&nbsp;'+mobiles+'</p><p class="address">'+data.countyName+data.townName+data.address+'</p><p class="payway"><strong>在线支付 国美快递</strong></p><p class="tip">使用快速购，将按照上述信息直接提交订单</p></div>';
                                 easyShopping_box.html(str);
                             }else{
                                 if(data.error && data.error.code){
                                     var _dat = data;
                                     var _err = _dat.error.message, _cde = _err.error.code,
                                     _htm = '<div class="errorTxt">' +  _err + '</div>';
                                     _this.dialog({ inner: "#dialogEr", cssname: "dialogBox Er", errIco: "warn", errMsg: _htm });
                                     return
                                 }
                                  easyShopping_box.html(easyBox_str.newuser);
                             }
                         }
                     })
                 }
             }
        },
       easyShopping: function (_dat) {
            var _this = this;
            

            //电信合约机的套餐
            var saleId="";
            $('#gm-prd-main .prdLeft').each(function(){ //非常坑的操作  因为无法区分销售属性的
                if($(this).html() == "合约套餐"){
                    saleId=$(this).next().find('a.select').attr('saleid');
                }
            })

            var addCartData = {
                type: 22,
                pid: prdInfo.prdId,
                sid: prdInfo.sku,
                pcount: $("#enterQty").val(),
                k:_this.GetQueryString('kid'),
                is:_this.addedParamsfn(),
                _r: new Date().getTime()
            }
            , url='//cart'+cookieDomain+'/home/api/cart/quickBuy'
            , hwgstr='';    
            
            if(_dat=="pay_fenQi"){
                addCartData.type=20;
            }
            if(_dat=="telecom"){
                addCartData.mobileNumber=$('#telecom').attr('title');
                addCartData.setMeal=saleId;
                if(prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ"){
                    addCartData.type=23;
                    addCartData.netInArea=g.cityCode(2);
                    hwgstr='/operator';
                    url='//cart'+cookieDomain+'/operator/api/cart/quickBuy';
                }else if(prdInfo.sapSkuType =="ZJXK"){
                    addCartData.type=25;
                    addCartData.pid = "";
                    addCartData.sid = "";
                    addCartData.netInArea = $('#telecom').attr('curearecode');
                    addCartData.setMealProId = prdInfo.prdId;
                    addCartData.setMealSkuId = prdInfo.sku;
                    addCartData.whiteProId = $('#zi_telecom a').eq(0).attr('Wpid');
                    addCartData.whiteSkuId = $('#zi_telecom a').eq(0).attr('Wskuid');
                    url='//cart'+cookieDomain+'/jixin/api/cart/addToCart';
                }else if(prdInfo.sapSkuType =="ZJXJ"){
                    addCartData.type=25;
                    addCartData.netInArea = $('#telecom').attr('curearecode');
                    addCartData.setMealProId = $('#zi_telecom .prd-properties-other').eq(0).find('a.select').attr('Tpid');
                    addCartData.setMealSkuId = $('#zi_telecom .prd-properties-other').eq(0).find('a.select').attr('Tskuid');
                    addCartData.whiteProId = $('#zi_telecom .prd-properties-other').eq(0).find('a.select').attr('Wpid');
                    addCartData.whiteSkuId = $('#zi_telecom .prd-properties-other').eq(0).find('a.select').attr('Wskuid');
                    url='//cart'+cookieDomain+'/jixin/api/cart/addToCart';
                }
            }

            /*localhost/OperatorSite/shopping  电信卡跳转的*/
            $.createProgress({
                Jump:false,
                url:url,
                data:addCartData ,
                callback:function(data){
                    $('#easyShopping').data('running', false);
                    if (data.success) {//添加成功
                            //window.location.href = '//cart'+cookieDomain+hwgstr+'/shopping';
                        if(prdInfo.sapSkuType =="ZJXK" || prdInfo.sapSkuType =="ZJXJ"){  //自营电信卡
                            window.location.href = '//cart'+cookieDomain+'/save/jixin/authorization';
                            return;
                        }
                        var data=data.data;
                            if(data==true){
                                window.location.href = '//cart'+cookieDomain+hwgstr+'/shopping';
                                return;
                            }
                            if(data && data.jumpPage=="commitOrderPage"){
                                window.location.href = '//cart'+cookieDomain+hwgstr+'/shopping?#ksg';
                            }else if(data && data.jumpPage!="commitOrderPage"){
                            window.location.href= '//success'+cookieDomain+'/order/paymentInfo?orderIdsStr='+data.cartId+'&userId='+loginData.loginId+'&isCommittedPage=true';
                            }

                    }  else {
                        var _dat = data;
                        if (_dat.errCode && _dat.errMsg) {
                             $('#replay_sel').attr('error','2');
                            var _err = _dat.errMsg, _cde = _err.errCode,
                            _htm = '<div class="errorTxt">' +  _err + '</div>';
                            _this.dialog({ inner: dialogContent.Er, cssname: "dialogBox Er", errIco: "warn", errMsg: _htm });

                        }
                    }
                }
            });
           
          },
        /* 降价通知 到货通知 */
        prdNotice:function(_id){
            var _this = this;
            g.login(function () {
                $('#dialogTZ .sicon').addClass('.sicon_bgimg');
                _this.dialog({
                    inner: dialogContent.dialogTZ, cssname: "dialogBox wp", callback: function () {
                        //降价通知
                        if (_id == "reduce") {
                            var minPrice= $.trim( $("#prdPrice").text().toString().replace("¥",'') );
                            _this.dgObj.find(".tit").html("降价通知");
                            //_this.dgObj.find(".txt i").html("降价");
                            _this.dgObj.find(".txt").html("当商品<i>降价</i>时，我们会通过邮件、短信和手机客户端来通知您哦~");
                            _this.dgObj.find(".price-area").show();
                            _this.dgObj.find(".price-box input").val( minPrice );
                            _this._getTellAndEmail({userId:loginData.loginId,formAppName:'item'});
                        }
                        //到货通知去掉自动手机、邮箱赋值功能
                        //到货通知
                        if (_id == "arrival") {
                            _this._getTellAndEmail({userId:loginData.loginId,formAppName:'item'});
                        }
                        _this.dgObj.find(".redlink").click(function () {
                            _this.addNotic(_id);
                        });
                        _this.dgObj.find("#tell").focus();
                        _this.dgObj.find("#mail,#tell").keydown(function (e) {
                            if (e.keyCode == 13) _this.addNotic(_id);
                        })
                    }
                });
            });
        },
        /* 添加到货通知、降价通知 */
        addNotic:function(_id){
            var _this = this,
                _minPrice=_this.dgObj.find("#min-price"),
                _eml = _this.dgObj.find("#mail"),
                _tel = _this.dgObj.find("#tell"),
                _rprice = _this.dgObj.find("#error-price"),
                _rml = _this.dgObj.find("#errorMail"),
                _rel = _this.dgObj.find("#errorTell"),
                _evl = $.trim(_eml.val()),
                _tvl = $.trim(_tel.val());
            var dataTell=_tel.attr("data-value"),
                dataEmail=_eml.attr("data-value");

            var ckEml = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            var tellReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            var priceVal=$.trim(_minPrice.val());
            _rprice.hide();
            _rml.hide();
            _rel.hide();
            if(_id=="reduce"){
                if(priceVal==''){
                    _minPrice.focus();
                    _rprice.text("价格不能为空！").css("display","block").show();
                    return false;
                }
                if(isNaN(priceVal)){
                    _minPrice.focus();
                    _rprice.text("价格必须是数值！").css("display","block").show();
                    return false;
                }
                if(priceVal<0 || priceVal>999999){
                    _minPrice.focus();
                    _rprice.text("价格数值不合适！").css("display","block").show();
                    return false;
                }
            }
            if(_tvl==""){
                _rml.hide();
                _tel.focus();
                _rel.html("<i></i>请输入您的手机号码！").css("display","block").show();
                return false;
            }
            if(!tellReg.test(_tvl) && _tvl!==dataTell){
                _rml.hide();
                _tel.focus();
                _rel.html("<i></i>手机号码格式有误！").show();
                return false;
            }
            if(!_evl=="" && !ckEml.test(_evl) && _evl!==dataEmail){
                _eml.focus();
                _rml.html("<i></i>邮件地址格式有误！").css("display","block").show();
                return false;
            }

            //对邮箱为空值时的特殊处理
            if(_evl==""){
                var newEmailVal= $.trim($("#mail").attr("data-value"));
                _evl=(newEmailVal!="" ? newEmailVal :'*****');
            }
            //是否加入收藏夹
            var isSyn = _this.dgObj.find("#chk").attr("checked") ? "true" : "false";
            if(_id=="reduce"){
                /* 降价通知 */
                var wpAjaxUrl='//ss'+cookieDomain+'/item/v1/user/notice/'+prdInfo.prdId+'/'+prdInfo.skuNo+'/'+loginData.loginId+'/'+priceVal+'/'+$.trim(_tel.val())+'/'+_evl+'/'+isSyn+'/flag/item/callbackName';
                $.ajax({
                    type : "get",
                    url :  wpAjaxUrl,
                    dataType : "jsonp",
                    jsonp: "callback",
                    jsonpName : "callbackName",
                    success : function(data){
                        _this.data=data;
                        _this.reducePriceNotice();
                    },
                    error : function(x,y,z){
                    }
                });
            }
            /* 到货通知 */
            if(_id=="arrival"){
                var _dat = {
                    'productId':prdInfo.prdId,
                    'skuNo':prdInfo.skuNo,
                    'userId':loginData.loginId,
                    "cityId":g.cityCode(),
                    "mobile":_tvl,
                    "email":_evl,
                    "sync" : isSyn
                };
                var ajaxUrlParam=_dat.productId+'/'+_dat.skuNo+'/'+_dat.userId+'/'+_dat.cityId+'/'+_dat.mobile+'/'+_dat.email+'/'+_dat.sync;
                var ajaxUrl= "//ss" + cookieDomain + '/item/v1/notice/arrival/'+ajaxUrlParam+'/flag/wp/notice';
                $.ajax({type:'get',dataType:'jsonp',url:ajaxUrl,jsonpName:"notice",success:function(data){ _this.data=data;_this.addNoticDom();}});
            }
        },
        //降价提交按钮提示
        reducePriceNotice :function(){
            var self=this;
            if(self.data!=undefined){
                if(self.data.success==false){
                    self.dialog({inner:dialogContent.Er,cssname:"dialogBox Er",errIco:"warn",errMsg: self.data.message});
                }else{
                    //self.dgObj.html('<div class="dialogOk dialog-message"><i class="dgIcon"></i><span class="text">'+self.data.message+'</span></div>');
                    self.dgObj.html('<div class="noticOk"><i class="dgIcon"></i>提交成功！</div>');
                }
                window.setTimeout(function(){self.dialogClose();},1000);
            }
        },
        //到货通知提示
        addNoticDom:function(){
            var self=this;
            if(self.data!=undefined){
                var _this=this.obj,_dat=self.data;
                if(_dat.success==false){
                    self.dialog({inner:dialogContent.Er,cssname:"dialogBox Er",errIco:"warn",errMsg:_dat.message});
                }
                if(_dat.success==true){
                    //_this.dgObj.html('<div class="dialogOk dialog-message"><i class="dgIcon"></i><span class="text">'+_dat.msg+'</span></div>');
                    self.dgObj.html('<div class="noticOk"><i class="dgIcon"></i>提交成功！</div>');
                }
                window.setTimeout(function(){self.dialogClose();},1000);
            }
        },
        
        /*提心愿*/
        wish:function(){
            var _this = this;
            var _bd_share_config={
                "common":{
                            
                        "bdSnsKey":{},
                        "bdText":document.title,//详情页心愿单 可能更改这个这个属性
                        "bdMini":"2",
                        "bdMiniList":false,
                        "bdPic":"",
                        "bdStyle":"0",
                        "bdSize":"16",
                        "bdUrl":"//cps.gome.com.cn/home/JoinUnion?sid=123&wid=123&feedback="+(window.loginData.loginId||0)+"&to="+window.location.href,
                        "onBeforeClick":function(bdcmd,bdconfig){
                                    
                             //bdconfig.bdUrl = "http://cps.gome.com.cn/home/JoinUnion?sid=123&wid=123&feedback=" + (window.loginData.loginId || 0) + "&to=" + window.location.href;
                                    var _href = window.location.href;

                                    if (_href.indexOf('?') != -1) {
                                        _href = _href.substr(0, _href.indexOf('?'));                            
                                    }
                                    bdconfig.bdUrl = _href + "?sid=123&wid=123&feedback=" + feedbackt() + "&temp=1";
                                    
                                    bdconfig.bdText =window._bd_share_config.common.bdText;
                                    //omniture_wish.bdshare(bdcmd ,bdconfig.bdText);
                                     
                                    
                                    return bdconfig;
                            }
                        },
                "share":{}
        };
            g.login(function () {
                $.ajax({
                    type: "GET",
                    url: '//ss'+cookieDomain+'/item/v1/user/contact/'+loginData.loginId+'/flag/item/getMobile',
                    dataType: "jsonp",
                    jsonpName: "getMobile",
                    success: function (data) {
                        if( !$.isEmptyObject(data) ){
                            $('#innerBox').attr('mobile', data.mobile);//获取到的手机号
                            $('#showWish').removeAttr('disabled');
                            _this.dialog({
                                inner: dialogContent.wish, cssname: "dialogBox Wish",
                                beforClose: function () {
                                    if ($('#innerBox').find('#wish_weixin').css('display') == 'block') {
                                        var innerBox = $('#innerBox');

                                        innerBox.find('#wish_weixin').hide();

                                        innerBox.find('#my_mobilePhone').val($('#innerBox').attr('mobile') || '');
                                        innerBox.find('.my_mobilePhone_wrap').removeClass('verify_r');
                                        innerBox.find('.my_mobilePhone_wrap').removeClass('verify_e');

                                        innerBox.find('#wish_verifyNum').attr('value', '');
                                        innerBox.find('.verificationCode_wrap').removeClass('verify_r');
                                        innerBox.find('.verificationCode_wrap').removeClass('verify_e');

                                        innerBox.find('#his_mobilePhone').attr('value', '');
                                        innerBox.find('.his_mobilePhone_wrap').removeClass('verify_r');
                                        innerBox.find('.his_mobilePhone_wrap').removeClass('verify_e');

                                        innerBox.find('#wish_text').val('');
                                        innerBox.find('.his_mobilePhone_wrap').removeClass('wish_verify_btn_disabled');

                                        innerBox.find('#wish_form').show();

                                        //重置获取验证码
                                        clearInterval(window.wish_timer);
                                        window.sec = 61;
                                        innerBox.find('#wish_verify_btn').removeClass('wish_verify_btn_disabled');
                                        innerBox.find('#wish_verify_btn').html('免费获取验证码');
                                        return false;
                                    }
                                },
                                closeCall: function () {
                                    $('#wish_weibo').appendTo($('#showWishWrap'));
                                    $('#wish_weibo').hide();
                                    _bd_share_config.common.bdText = document.title;

                                    clearInterval(window.wish_timer);
                                    window.sec = 61;
                                },
                                callback: function () {
                                    _bd_share_config.common.bdText = "我想要“" + document.title + "”，你愿意买给我吗？";
                                    _this.wishDom();
                                }
                            });
                        }
                    }
                });
            })
        },
        wishDom: function () {

            var _this = this;
            var innerBox = $('#innerBox');

            var reg_mobilePhoneNumber = /((1[3|8][0-9])|(14[5|7])|(15[^4,\D])|(17[0|5|6|7|8]))\d{8}$/;
            window.sec = 61;//变灰的重新发送验证码的时间
            var sendTimes = 6;//发送次数
            var full_mobilePhoneNumber = []; //超过发送次数的手机号

            $('#wish_weibo').appendTo(innerBox.find('#wish_share'));
            $('#wish_weibo').show();

            var my_mobilePhone = innerBox.find('#my_mobilePhone'); //第一个手机号
            var my_mobilePhone_wrap = innerBox.find('.my_mobilePhone_wrap');

            var verificationCode_wrap = innerBox.find('.verificationCode_wrap');

            var his_mobilePhone = innerBox.find('#his_mobilePhone');//他的手机号
            var his_mobilePhone_wrap = innerBox.find('.his_mobilePhone_wrap');

            var wish_verifyNum = innerBox.find('#wish_verifyNum');  //验证码

            var wish_text = innerBox.find('#wish_text'); //发送的文本
            var wish_text_wrap = innerBox.find('.wish_text_wrap');

            //var wish_verify_btn = innerBox.find('#wish_verify_btn');

            my_mobilePhone.attr('value', $('#innerBox').attr('mobile'));


            innerBox.find('#my_mobilePhone,#wish_verifyNum,#his_mobilePhone').focus(function () { $(this).parent().addClass('focus'); });
            innerBox.find('#my_mobilePhone,#wish_verifyNum,#his_mobilePhone').blur(function () { $(this).parent().removeClass('focus'); });
            wish_text.focus(function () {
                //my_mobilePhone_wrap.removeClass('verify_r');
                //my_mobilePhone_wrap.removeClass('verify_e');

                $(this).addClass('wish_text_focus');
            });
            wish_text.blur(function () { $(this).removeClass('wish_text_focus'); });

            //第一个手机号
            my_mobilePhone.blur(function () {

                my_mobilePhone_wrap.removeClass('verify_r');
                my_mobilePhone_wrap.removeClass('verify_e');

                if ($(this).val() == $('#innerBox').attr('mobile')) {
                    return;
                }

                if (reg_mobilePhoneNumber.test($(this).attr('value'))) {
                    my_mobilePhone_wrap.addClass('verify_r');
                } else {
                    my_mobilePhone_wrap.addClass('verify_e');
                }

                if ($.trim($(this).val()).length == 0) {
                    my_mobilePhone_wrap.removeClass('verify_r');
                    my_mobilePhone_wrap.removeClass('verify_e');
                }
            });

            my_mobilePhone.keyup(function () {

                my_mobilePhone_wrap.removeClass('verify_r');
                my_mobilePhone_wrap.removeClass('verify_e');

                if ($(this).val() == '') {
                    return;
                }

                if ($(this).val() == $('#innerBox').attr('mobile')) {
                    return;
                }

                //if (reg_mobilePhoneNumber.test($(this).attr('value'))) {
                //    my_mobilePhone_wrap.addClass('verify_r');
                //} else {
                //    my_mobilePhone_wrap.addClass('verify_e');
                //}
            });

            //第二个手机号
            his_mobilePhone.blur(function () {
                his_mobilePhone_wrap.removeClass('verify_r');
                his_mobilePhone_wrap.removeClass('verify_e');
                his_mobilePhone_wrap.removeClass('verify_double_wrap');

                if ($(this).val() == my_mobilePhone.val() && $(this).val() != '') {
                    his_mobilePhone_wrap.addClass('verify_double_wrap');
                    return;
                }
                if (reg_mobilePhoneNumber.test($(this).attr('value'))) {
                    his_mobilePhone_wrap.addClass('verify_r');
                } else {
                    his_mobilePhone_wrap.addClass('verify_e');
                }

                if ($.trim($(this).val()).length == 0) {
                    his_mobilePhone_wrap.removeClass('verify_r');
                    his_mobilePhone_wrap.removeClass('verify_e');
                }
            });

            his_mobilePhone.keyup(function () {
                his_mobilePhone_wrap.removeClass('verify_r');
                his_mobilePhone_wrap.removeClass('verify_e');
                his_mobilePhone_wrap.removeClass('verify_double_wrap');

                return;

                if ($(this).val() == my_mobilePhone.val()) {
                    his_mobilePhone_wrap.addClass('verify_double_wrap');
                    return;
                }

                if (reg_mobilePhoneNumber.test($(this).attr('value'))) {
                    his_mobilePhone_wrap.addClass('verify_r');
                } else {
                    his_mobilePhone_wrap.addClass('verify_e');
                }
            });

            //验证码
            wish_verifyNum.blur(function () {
                verificationCode_wrap.removeClass('verify_e');
                verificationCode_wrap.removeClass('verify_r');

                if ($(this).attr('value').length != 6) {
                    verificationCode_wrap.addClass('verify_e');
                }

                if ($.trim($(this).val()).length == 0) {
                    verificationCode_wrap.removeClass('verify_r');
                    verificationCode_wrap.removeClass('verify_e');
                }
            });
            //验证码
            wish_verifyNum.change(function () {
                verificationCode_wrap.removeClass('verify_r');
                verificationCode_wrap.removeClass('verify_e');
            });

            wish_verifyNum.keyup(function () {
                verificationCode_wrap.removeClass('verify_r');
                verificationCode_wrap.removeClass('verify_e');
            });

            innerBox.find('#wish_verify_btn').click(function () {

                var _this = $(this);
                _this.attr('send', '1');

                //检测手机号 是否达到发送次数
                var flag = false;
                for (var i = 0 ; i < full_mobilePhoneNumber.length; i++) {
                    if (full_mobilePhoneNumber[i] == my_mobilePhone.val()) {
                        flag = true;
                        break;
                    }
                }

                if (flag) {
                    alert('该手机号今日验证次数已满，请明日再试')
                    clearInterval(window.wish_timer);
                    window.sec = 61;

                    _this.html('免费获取验证码');
                    _this.removeClass('wish_verify_btn_disabled');

                    verificationCode_wrap.removeClass('verify_r');
                    verificationCode_wrap.removeClass('verify_e');
                    return false;
                }

                if (window.sec <= 60) {
                    return false;
                }

                //验证
                if( $('#innerBox').attr('mobile')){
                    if (!($('#innerBox').attr('mobile').length == 11 && my_mobilePhone.val() == $('#innerBox').attr('mobile'))) {  //如果返回的号码不是初始号码
                        if (!reg_mobilePhoneNumber.test(my_mobilePhone.val())) {
                            my_mobilePhone.focus();
                            alert('请输入手机号码');
                            return false;
                        }
                    }
                }else{
                    if (!reg_mobilePhoneNumber.test(my_mobilePhone.val())) {
                        my_mobilePhone.focus();
                        alert('请输入手机号码');
                        return false;
                    }
                }

                verificationCode_wrap.removeClass('verify_e');
                verificationCode_wrap.addClass('verify_r');

                _this.addClass('wish_verify_btn_disabled');

                window.sec--;
                _this.html(sec + '秒后重新获取');
                clearInterval(window.wish_timer);
                window.wish_timer = setInterval(function () {
                    window.sec--
                    if (window.sec < 0) {
                        clearInterval(window.wish_timer);
                        _this.html('免费获取验证码');
                        _this.removeClass('wish_verify_btn_disabled');
                        window.sec = 61;
                    } else {
                        _this.html(window.sec + '秒后重新获取');
                    }
                }, 1000);

                //$.ajax(); 请求验证码
                $.ajax({
                    type: "GET",
                    url: '//ss'+cookieDomain+'/item/v1/d/wish/code/'+loginData.loginId+'/'+$.trim($("#my_mobilePhone").val())+'/flag/item/securitycode',
                    dataType: "jsonp",
                    jsonpName: "securitycode",
                    success: function (data) {
                        if ( !$.isEmptyObject(data) && data.success ) {
                            switch (data.result)
                            {
                                case 3000:
                                    _this.addClass('wish_verify_btn_disabled');
                                    _this.html('60秒后重新获取')
                                    var sec = 61;
                                function temp(){
                                    sec--
                                    if (sec < 0) {
                                        clearInterval(timer);
                                        _this.html('免费获取验证码');
                                        _this.removeClass('wish_verify_btn_disabled');
                                    } else {
                                        _this.html(sec + '秒后重新获取');
                                    }
                                }
                                    temp();
                                    var timer = setInterval(temp, 1000);
                                    break;
                                case -1004:
                                    alert("该手机号今日验证次数已满，请明日再试");
                                    clearInterval(window.wish_timer);
                                    window.sec = 61;
                                    full_mobilePhoneNumber.push(my_mobilePhone.val());
                                    _this.html('免费获取验证码');
                                    _this.removeClass('wish_verify_btn_disabled');
                                    verificationCode_wrap.removeClass('verify_r');
                                    verificationCode_wrap.removeClass('verify_e');
                                    break;
                                case -1002:
                                    verificationCode_wrap.removeClass('verify_r');
                                    alert("短信验证码发送失败，请重新获取验证码");
                                    break;
                                case -107:
                                case -110:
                                    verificationCode_wrap.removeClass('verify_r');
                                    alert("该手机号已加入黑名单,请联系客服");
                                    break;
                                case -106:
                                    verificationCode_wrap.removeClass('verify_r');
                                    alert("请输入正确的手机号");
                                    break;
                                default:
                                    verificationCode_wrap.removeClass('verify_r');
                                    alert("短信验证码发送失败，请您稍后再试");
                            }
                        }else{
                            verificationCode_wrap.removeClass('verify_r');
                            alert("获取短信验证码失败，请您稍后再试");
                        }
                    }
                });
            });

            //发送文本
            wish_text.keyup(function () {
                wish_text_wrap.removeClass('wish_text_error');

                if ($(this).attr('value').length > 140) {
                    wish_text_wrap.addClass('wish_text_error');
                    return false;
                }
            });

            innerBox.find('#wish_show_weixin').click(function () {
                innerBox.find('#wish_form').hide();
                innerBox.find('#send_wish_error').hide();
                innerBox.find('#wish_weixin').hide();
                innerBox.find('#send_wish_success').hide();
                innerBox.find('#send_wish_error').hide();

                innerBox.find('#wish_weixin').show();

                omniture_wish.share('weixin');
            });

            innerBox.find('#submit_wish').hover(function () {
                $(this).css('background', '#d00');
            }, function () {
                $(this).css('background', '#c30000');
            });

            innerBox.find('#submit_wish').click(function () {
                var _this = $(this);
                //验证
                if( $('#innerBox').attr('mobile')){
                    if (!($('#innerBox').attr('mobile').length == 11 && my_mobilePhone.val() == $('#innerBox').attr('mobile'))) {  //如果返回的号码不是初始号码
                        if (!reg_mobilePhoneNumber.test(my_mobilePhone.val())) {
                            my_mobilePhone.focus();
                            alert('请正确输入手机号码');
                            return false;
                        }
                    }
                }else{
                    if (!reg_mobilePhoneNumber.test(my_mobilePhone.val())) {
                        my_mobilePhone.focus();
                        alert('请输入手机号码');
                        return false;
                    }
                }

                if (wish_verifyNum.val().length != 6) {
                    wish_verifyNum.focus();
                    return false;
                }
                if (!reg_mobilePhoneNumber.test(his_mobilePhone.val())) {
                    his_mobilePhone.focus();
                    return false;
                }

                if (my_mobilePhone.val() == his_mobilePhone.val()) {
                    alert('两个电话号码不能重复');
                    his_mobilePhone.focus();
                    return false;
                }
                if (innerBox.find('#wish_verify_btn').attr('send') != '1') {
                    alert('请获取验证码');
                    wish_verifyNum.focus();
                    return false;
                }

                if (wish_text.attr('value').length > 140) {
                    //wish_text.value = wish_text.val(wish_text.val().substring(0, 140));
                    alert('留言最多140个字');
                    wish_text.focus();
                    return false;
                }

                //发送请求
                $.ajax({
                    type: "GET",
                    url: '//ss'+cookieDomain+'/item/v1/d/wish/send/flag/item/sendwish',
                    data: {
                        userId : loginData.loginId,
                        mobileNumber : innerBox.find('#my_mobilePhone').attr('value'),
                        productId : prdInfo.prdId,
                        skuId : prdInfo.sku,
                        message : $.trim(innerBox.find('#wish_text').val()),
                        verifyCode : innerBox.find('#wish_verifyNum').val(),
                        productName : prdInfo.description,
                        productUrl : window.location.href,
                        mobile : innerBox.find('#his_mobilePhone').attr('value')
                    },
                    dataType: "jsonp",
                    jsonpName: "sendwish",
                    success: function (data) {
                        _this.removeAttr('disabled');
                        var iresult = data.result;
                        switch (iresult)
                        {
                            case 3000:
                                innerBox.find('#wish_form').hide();
                                innerBox.find('#send_wish_error').hide();
                                innerBox.find('#wish_weixin').hide();
                                innerBox.find('#send_wish_success').hide();
                                innerBox.find('#send_wish_error').hide();
                                innerBox.find('#send_wish_success').show();
                                break;
                            case -1003:
                                alert("你输入的短信验证码不正确,请确认");
                                verificationCode_wrap.removeClass('verify_r');
                                verificationCode_wrap.addClass('verify_e');
                                wish_verifyNum.focus();
                                break;
                            case -1004:
                                alert('校验次数超过限制,请重新获取验证码');
                                clearInterval(window.wish_timer);
                                window.sec = 61;
                                innerBox.find('#wish_verify_btn').html('免费获取验证码');
                                innerBox.find('#wish_verify_btn').removeClass('wish_verify_btn_disabled');
                                innerBox.find('#wish_verify_btn').removeAttr('send', '1');
                                innerBox.find('#wish_verifyNum').val('');
                                verificationCode_wrap.removeClass('verify_r');
                                verificationCode_wrap.removeClass('verify_e');
                                break;
                            case -103:
                                alert('短信内容不符合要求');
                                break;
                            default:
                                innerBox.find('#wish_form').hide();
                                innerBox.find('#send_wish_error').hide();
                                innerBox.find('#wish_weixin').hide();
                                innerBox.find('#send_wish_success').hide();
                                innerBox.find('#send_wish_error').hide();
                                innerBox.find('#send_wish_error').show();
                        }
                    }
                });
                _this.attr('disabled', 'disabled');
                omniture_wish.wish_submit();
            });

            innerBox.find('#copy_link').click(function () {
                try {
                    window.clipboardData.setData("Text", window.location.href);
                    innerBox.find('#copy_link_success').show();

                    if ($.browser.msie && $.browser.version == '7.0') {
                        innerBox.find('#copy_link_success').css('bottom', '63px');
                    }
                    if ($.browser.msie && $.browser.version == '6.0') {
                        innerBox.find('#copy_link_success').css('bottom', '43px');
                    }

                    setTimeout(function () {
                        innerBox.find('#copy_link_success').hide();
                    }, 3000);

                } catch (e) {
                    alert('您的浏览器不支持此功能,请手动复制');
                }

                omniture_wish.share('复制链接');
            });

            $('.wish_text_presentation').click(function () {
                $(this).hide();
                wish_text.focus();
            });
            wish_text.focus(function () {
                $('.wish_text_presentation').hide();
            });
            wish_text.blur(function () {
                if ($.trim($(this).val()) == '') {
                    $('.wish_text_presentation').show();
                }
            });
            //gwh修改于2015-10-26
            //$('.qrcode_img').attr('src', $('#qrcode_img').attr('src'));
            $('.qrcode_img').attr('src', $('#shoujizhuanxiang_wrap img').attr('_src'));
            $('.tichu_wish,.try_again').click(function () {
                innerBox.find('#wish_form').hide();
                innerBox.find('#send_wish_error').hide();
                innerBox.find('#wish_weixin').hide();
                innerBox.find('#send_wish_success').hide();
                innerBox.find('#send_wish_error').hide();

                innerBox.find('#my_mobilePhone').attr('value', '');
                innerBox.find('.my_mobilePhone_wrap').removeClass('verify_r');
                innerBox.find('.my_mobilePhone_wrap').removeClass('verify_e');

                innerBox.find('#wish_verifyNum').attr('value', '');
                innerBox.find('.verificationCode_wrap').removeClass('verify_r');
                innerBox.find('.verificationCode_wrap').removeClass('verify_e');

                innerBox.find('#his_mobilePhone').attr('value', '');
                innerBox.find('.his_mobilePhone_wrap').removeClass('verify_r');
                innerBox.find('.his_mobilePhone_wrap').removeClass('verify_e');

                innerBox.find('#wish_text').val('');
                innerBox.find('.his_mobilePhone_wrap').removeClass('wish_verify_btn_disabled');

                innerBox.find('#submit_wish').removeAttr('disabled');

                window.sec = 61;
                clearInterval(window.wish_timer);
                innerBox.find('#wish_verify_btn').removeClass('wish_verify_btn_disabled');
                innerBox.find('#wish_verify_btn').html('免费获取验证码');

                innerBox.find('#wish_form').show();
            });
        },
        /*收藏店铺*/
        collectShop: function (shopid, type) {
            var _this = this;
            g.login(function () {
                //http://ss.atguat.com.cn/item/v1/shop/favorite/add/{mercantId}/{userId}/{merchantType}/flag/item
                var _url = '//ss'+cookieDomain+'/item/v1/shop/favorite/add/'+ shopid +'/'+ loginData.loginId +'/'+ type +'/flag/item/shopWishList';
                $.ajax({type:'get',url: _url, dataType:'jsonp', jsonpName: "shopWishList",   success:function(data){_this.collectShopDom(data,shopid)}});
            })
        },
        collectShopDom:function(data,shopid){
            if(data && data!=undefined && data.success==true && data.result){
                  var data = data.result;
                  if(data.state==1){
                    /*神策埋码*/
                    window.GomeSa &&  GomeSa.track('ShopCollection', {
                        collection_type: '成功',
                        shop_id: shopid
                    });       
                    alert('收藏店铺成功！');
                      
                  }else if(data.state==5){
                    alert('您已经收藏过此店铺！');
                  }
              }else{
                  alert(data.message);
              }
        },
        /* 收藏商品 */
        collect:function(){
            var _this = this;
            g.login(function () {
                var _url = '//ss'+cookieDomain+ "/item/v1/sc/"+prdInfo.prdId+"/"+prdInfo.sku+"/"+loginData.loginId+"/homeSite/flag/item/wishlist";
                $.ajax({ url: _url,type:'get',dataType:'jsonp',jsonpName: "wishlist", success:function(data){_this.collectDom(data)}  });
            });

        },
        collectDom:function(data){
        if(data!=undefined){
            var _this = this,_dat = data.errorType,_dbj = data;
            /*if(_dat==="下架商品不能收藏"){
                _this.dialog({inner:"#dialogEr",cssname:"dialogBox Er",errIco:"error",errMsg:"下架商品不能收藏！"});
                return false;
            }*/
            if(_dat=="isNoLogin"){
                _this.dialog({inner:dialogContent.Er,cssname:"dialogBox Er",errIco:"error",errMsg:"请登录后再添加商品到收藏夹！"});
                return false;
            }
            if(_dat=="isError"){
                _this.dialog({inner:dialogContent.Er,cssname:"dialogBox Er",errIco:"error",errMsg:this.data.message});
                return false;
            }
            if(_dat=="isCollect"){
                _this.dialog({inner:dialogContent.dialogAdd,callback:function(){
                    _this.dgObj.find("#dgTxt").addClass("have").html('您已收藏过该商品！');
                }});
            }

            if(_dat=="isSuccess"){
                _this.dialog({inner:dialogContent.dialogAdd,callback:function(){
                    _this.dgObj.find("#dgMsg").html('收藏成功！');
                    _this.dgObj.find("#dgTxt").html('您已经成功收藏了<b>' + (_dbj.count || 1) + '</b>个' +( prdInfo.threeDflag ?"3D":'')+ '商品');
                }});

                /*神策埋码*/
                window.GomeSa &&  GomeSa.track('GoodCollection', {
                      collection_type: '成功',
                      sku_id: prdInfo.sku
                });      
                
            }
            if(_dat=="isCollect" || _dat=="isSuccess"){
                _this.dgObj.find("#dgMsg,.redlink").hide();
                _this.dgObj.find(".arrange").html( "查看收藏夹&nbsp;>");
                _this.dgObj.find("a.arrange").attr('href', "//myhome"+cookieDomain+"/member/myFavorites");
                  
                

                /*收藏里面的降价通知*/
                var minPrice= $.trim( $("#prdPrice").text().toString().replace("¥",'') );
                _this.dgObj.find(".price-box input").val( minPrice );
                _this._getTellAndEmail({userId:loginData.loginId,formAppName:'item'});
                _this.dgObj.find(".redlinks").show().click(function () {
                _this.addNotic('reduce');
                });
                _this.dgObj.find("#tell").focus();


                _this.dgObj.find(".tit").html("收藏了此商品的用户还收藏了：");

                try{
                    /* 大数据-收藏了还收藏了 */
                    var _url= '//bigd'+gomeplusDomain+'/gome/rec';
                    $.ajax({
                        url: _url,
                        dataType:'jsonp',
                        type:'get',
                        data: {
                            "pid": prdInfo.prdId,
                            "size": 4,
                            "boxid": 'box88',
                            "area": g.cityCode(),
                            "cid": $.cookie('__clickidc'),
                            "uid": loginData.loginId,
                            "brid": prdInfo.brandID,
                            "shopid": prdInfo.shopNo,
                            "c1id":  prdInfo.firstCategoryId,
                            "c3id":  prdInfo.thirdCategoryId,
                            "sid": prdInfo.sku,
                            "imagesize": 80,
                            "callbackparam": 'viewAndViewList'
                        },
                        success: function (data) {
                            if(data && data.lst && data.lst.length>0){
                                var htm = '\
								<div class="andBuy-btnout collect-andBuy-btnout">\
									<a data-btn="collect-tlRight" href="javascript:;"><b></b></a>\
									<a data-btn="collect-tlLeft" href="javascript:;"><s></s></a>\
								</div>\
								<div class="andBuy-cont collect-andBuy-cont">\
									<ul class="pushul item">\
										<% for(var i=0,j=lst.length; i<j; i++){ \
												var prd = lst[i];\
												var href = prd.purl;\
												var point = i<j-1?",":"";\
												bigData(prd.pid+point);\
										%>\
										<li>\
											<a track="7:<%= prd.pid %>" maima_param="<%= prd.maima_param %>" href="<%= href %>"  target="_blank" title="<%= prd.pn %>">\
												<img width="80" height="80" gome-src="<%= prd.iurl %>" alt="<%= prd.pn %>">\
											</a>\
											<a track="7:<%= prd.pid %>" maima_param="<%= prd.maima_param %>" href="<%= href %>"  target="_blank" title="<%= prd.pn %>" class="lnk"><%= prd.pn %></a>\
											<span>¥<%= prd.price %></span>\
										</li>\
										<% } %>\
									</ul>\
								</div>';
                                var products = "";
                                template.helper('bigData',function(pid){products+=pid;});
                                $("#buyMbox").attr('maima_param', data.maima_param).html(template.compile(htm)(data));

                                // 处理因为#buyMbox里面类容晚于对话框定位而导致的位置不垂直居中的问题
                                var _dialogBox=$("#dialogBox");
                                _dialogBox.css("top",parseInt( _dialogBox.css("top"))- $("#buyMbox").outerHeight()/2 +'px' );
                                _this.dgObj.find("#buyMbox").show();

                                if (typeof trackEvent != "undefined") { trackEvent(7, products); }
                                var tlscroll = 4;
                                for(var i=0,k=tlscroll;i<k;i++){
                                    $('.pushul.item').find('li').eq(i).loadsrc('gome-src');
                                }
                                if (data.size > tlscroll) {
                                    $(".collect-andBuy-cont").gSlider({
                                        isAuto: false,
                                        isImgLoad: false,
                                        dataOriginal: "gome-src",
                                        showNum: tlscroll,
                                        stepLen: tlscroll,
                                        time: 3000,
                                        btnGo: {left: '[data-btn="collect-tlLeft"]', right: '[data-btn="collect-tlRight"]'},
                                        callback:function(){
                                            $('.pushul.item').loadsrc('gome-src');
                                        }
                                    });
                                }
                               
                                maiMaRecTrack({
                                    ele : '#buyMbox',
                                    links : '#buyMbox a'
                                });
                            }
                        }});
                }catch(ex){}
            }
        }
    },
    //获取手机号码和邮箱地址
    _getTellAndEmail : function(param){
        var _this=this;
        var __ajaxUrl__='//ss'+cookieDomain+'/item/v1/user/contact/'+param.userId+'/flag/'+param.formAppName+'/'+'callbackName';
        $.ajax({
            type : "get",
            url :  __ajaxUrl__,
            dataType : "jsonp",
            async : false,
            jsonp: "callback",
            jsonpName : "callbackName",
            success : function(data){
                if(data.success){
                    var result={
                        email : data.email,
                        mobile : data.mobile
                    }
                    $("#tell").val(result.mobile).attr("data-value",result.mobile);
                    $("#mail").val(result.email).attr("data-value",result.email);
                }
            },
            error:function(x,y,z){
            }
        });
    },
        /* 替换元素图片 */
        imgSrc:function(imgObj){
            if(imgObj.attr("gome-src"))imgObj.attr("src",imgObj.attr("gome-src")).removeAttr("gome-src");
        },
        /* 主信息弹出层 logData:{inner:"弹出层模型",unlock:"是否锁屏",errIco:"提示图标样式",errMsg:"提示内容",callback:"弹出时回调函数",closeCall:"关闭时回调函数",closeAuto:定时关闭提示层}} */
        dialog:function(logData){
                if($.browser.msie && parseInt($.browser.version)<7)$(".dialog").css("position","static");
                this.dgObj.html(templateSimple.compile(logData.inner));
                if(logData.errIco)this.dgObj.find(".dgIcon").addClass(logData.errIco);
                if(logData.errMsg)this.dgObj.find(".errorBox").html(logData.errMsg);
                $("#dialogBox").removeAttr("class").addClass(logData.cssname||"dialogBox").show();
                if(logData.callback)logData.callback();
                var _c={},_t=this;if(logData.closeCall)_c.closeCall = logData.closeCall;
                $("#close").unbind("click")
                $("#close").click(function () {
                    if (logData.beforClose && logData.beforClose() == false) {
                        return;
                    }
                    _t.dialogClose.apply(_c);
                });
                _t.dgObj.find(".stages").click(function(){_t.dialogClose();});
                if(!logData.unlock)$("#dialogBox").gPop({lockBgColor:'#000',opacity:0.15,isColseBtn:false});
                if(logData.closeAuto){window.setTimeout(function(){_t.dialogClose();},1000);}
                if($.browser.msie && parseInt($.browser.version)<7)$("#dialogBox").css("position","absolute");/*ie6*/
            },
            dialogClose:function(){
                $("#dialogBox,#popLock").hide();
                if(this.closeCall)this.closeCall();
            }
    }

    var prdMain = new prdMain();
    prdMain.bind();
    prdMainNew = prdMain;
}(window,prdInfo,$,templateSimple)
