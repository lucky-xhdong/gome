/**
 * Created by guotingjie on 2015/12/2.
 */
(function($) {
    var querystring=util.pipe(util.split("?"),util.last,util.split("&"),util.map(function(item){return item.split("=")}),util.fromPairs),query=querystring(location.href);
    var userName = document.getElementById('userName'),
        card = document.getElementById('certNumber'),
        cardNumber = document.getElementById('cardNumber'),
        files = $('.file'),
        $submitBtn = $('#gotosubmit');
    var allowanceFrontImg,allowanceReverseImg,allowanceOtherImg,residenceCardUserInfoImg,residenceCardRenewFirstPageImg,residenceCardRenewSecondPageImg,tempResidenceCardRenewSecondPageImg,tempResidenceCardRenewFirstPageImg;
    var allow={
        cardPic1:null,
        cardPic2:null,
        cardPath1:null,
        cardPath2:null

    };
    /**
     * 创建图片上传html
     * @param imageIndex
     * @returns {string}
     */
    var createHtml = function(imageIndex,scopeCls) {
        var scopeCls=scopeCls+imageIndex
        //imageIndex += 2;
        var _html = '<div class="u-c-item">\
                        <div class="upload-au">\
                            <a class="upload_btn" href="javascript:;" id="'+scopeCls+'up_3">\
                                <input type="file" class="file" name="file_3" accept="image/*" capture="camera" id="file_'+(imageIndex+1)+'"">\
                                <span class="upload_img"></span>\
                                <div class="upload-load"><div class="upload-loading"></div></div>\
                            </a>\
                            <span style="display:none" class="upload-pic" id="'+scopeCls+'img_3">\
                                <img width="198" height="120" alt="" src="" name="pic3">\
                            </span>\
                            <div class="modify-con">\
                                <a class="upload_edit btn" href="#" style="display:none" id="mobidfy_'+(imageIndex+1)+'"">修改</a>\
                            </div>\
                        </div>\
                        <div id="'+scopeCls+'live" class="example-au">\
                            <span class="ex-name">示例</span>\
                            <div class="ex-c">\
                            </div>\
                        </div>\
                        <div class="clr"></div>\
                    </div>';

        return _html;
    }


    /**
     * 验证姓名文本框
     * @returns {boolean}
     */
    var valiedateUserNameInput = function() {
        var userNameVal = userName.value.replace(/\s/g,'');

        if(userNameVal.length <= 0 || !/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/g.test(userNameVal))
        {
            document.getElementById('userNameError').innerHTML = '请填写真实姓名';
            //userName.focus();
            return false;
        }

        if(userNameVal.length > 20) {
            document.getElementById('userNameError').innerHTML = '姓名最多20个字符';
            //userName.focus();
            return false;
        }
        else{
            document.getElementById('userNameError').innerHTML = '';
        }
        return true;
    }

    /**
     * 验证文本框
     */
    var valiedateCardInput = function() {
        var idCard = card.value.replace(/\s/g,'');
        //var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
        //15位和18位身份证号码的正则表达式
        var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

        //如果通过该验证，说明身份证格式正确，但准确性还需计算
        if(regIdCard.test(idCard)){
            if(idCard.length==18){
                var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
                var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
                for(var i=0;i<17;i++){
                    idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
                }

                var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
                var idCardLast=idCard.substring(17);//得到最后一位身份证号码

                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                if(idCardMod==2){
                    if(idCardLast=="X"||idCardLast=="x"){
                        document.getElementById('certNumberError').innerHTML = '';
                        return true;
                    }else{
                        document.getElementById('certNumberError').innerHTML = '身份证信息输入有误，请填写18位有效身份证号码！';
                        return false;
                    }
                }else{
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if(idCardLast==idCardY[idCardMod]){
                        document.getElementById('certNumberError').innerHTML = '';
                        return true;
                    }else{
                        document.getElementById('certNumberError').innerHTML = '身份证信息输入有误，请填写18位有效身份证号码！';
                        return false;
                    }
                }
            }
        } else {
            document.getElementById('certNumberError').innerHTML = '身份证信息输入有误，请填写18位有效身份证号码！';
            return false;
        }

    }

    /**
     * 验证证件编码
     * @returns {boolean}
     */
    var valiedateCardNumberInput = function() {
        var cardNumberVal = cardNumber.value.replace(/\s/g,'');

        if($(cardNumber).is(':visible')) {

            if(cardNumberVal.length > 32) {
                document.getElementById('cardNumberError').innerHTML = '证件编号不能超过32位';
                return false;
            }

            if(cardNumberVal.length <= 0 || !/^[0-9a-zA-Z]*$/g.test(cardNumberVal)) {
                document.getElementById('cardNumberError').innerHTML = '请填写证件编号';
                //cardNumber.focus();
                return false;
            }

            document.getElementById('cardNumberError').innerHTML = '';
            return true;
        }

        return true;
    }

    /**
     * @returns {boolean}
     */
    var validateForm = function() {
        var radVal=$('[type="radio"]:checked').val();
        if(!valiedateUserNameInput() || !valiedateCardInput() || !valiedateCardNumberInput()) {
            $submitBtn.addClass('disable');
            return false;
        }else{
            if(radVal==1){
                if($('#identityCard0img_3 img').attr('src')=='' || $('#identityCard1img_3 img').attr('src')==''){
                    $submitBtn.addClass('disable');
                    return false;
                }
            }else if(radVal==2){
                if($('#identityCard0img_3 img').attr('src')=='' || $('#identityCard1img_3 img').attr('src')=='' || $('#armymanCard2img_3 img').attr('src')==''){
                    $submitBtn.addClass('disable');
                    return false;
                }
            }else if(radVal==3){ 
                if($('#identityCard0img_3 img').attr('src')=='' || $('#identityCard1img_3 img').attr('src')=='' || $('#liveCard3img_3 img').attr('src')=='' || $('#clientCard5img_3 img').attr('src')==''){
                    $submitBtn.addClass('disable');
                    return false;
                }
            }else{ 
                if($('#identityCard0img_3 img').attr('src')=='' || $('#identityCard1img_3 img').attr('src')=='' || $('#stayCard4img_3 img').attr('src')==''){
                    $submitBtn.addClass('disable');
                    return false;
                }
            }
        }
        $submitBtn.removeClass('disable');
        return true;
       
    }
    //save card identity
/*    function saveCard(domID,num){//暂时先取第一个图
        $('#'+domID).attr('upload','true')
            .parents('.upload-au')
            .find('.upload_btn').hide().end()
            .find('.upload-pic')
            .find('img').attr('src',eval("allow.cardPic"+num) ).end().show().end()
            .find('.upload_edit').show();
    }*/
    /**
     * 单选框点击事件处理  gotosubmit
     */
    var clickFn = function() {
        var $this = $(this),
            _index = parseInt($this.val());
        var $uploadCols = $('.upload-cols');

        var identityCard = createHtml(0,'identityCard')+createHtml(1,'identityCard'); //身份证认证正面和反面
        var liveCard = createHtml(3,'liveCard'); //上传居住证
        var stayCard = createHtml(4,'stayCard'); // 上传暂住证
        var clientCard = createHtml(5,'clientCard'); //上传客户基础信息
        var renewCard3 = createHtml(6,'renewCard3')+createHtml(7,'renewCard3'); //上传续签(北京居住证)
        var renewCard4 = createHtml(6,'renewCard4')+createHtml(7,'renewCard4'); //上传续签(北京暂住证)
        var armymanCard = createHtml(2,'armymanCard'); //军官证

        var dqxqDOM = ' <div class="dqxq">到期续签：</div>\
                       <div class="dqxq2">（若有到期续签，需上传完整续签页）</div>';
       //12 //123 //12 578//12 4678
       // //_index  //3:居住证  4: 暂住证  5:基础信息页
       switch( _index ) {
            case 1:

                $("#gotosubmit").attr("type","");
                $uploadCols.html("").html(identityCard);
                //$uploadCols.find('.u-c-item').eq(2).remove().eq(3).remove();
                $('#cardNumber_name,#cardNumber_num').hide();
                //if(allow.cardPic1){saveCard("file_1",1);}else{
                    bindUpFiles();
                //}
                validateForm();
                break;
            case 2://驻京军人证

                $("#gotosubmit").attr("type","");
                $uploadCols.html("").html(identityCard+armymanCard);
                $('#cardNumber_name,#cardNumber_num').show();

                bindAjaxUpload('file_3');
                bindAjaxUpload('mobidfy_3');
               // if(allow.cardPic2){saveCard("file_2",2);}else{
                    bindUpFiles();
                //}
                validateForm();
                break;
            case 3:
                $("#gotosubmit").attr("type","live");
                $uploadCols.html("").html(identityCard+liveCard+clientCard+dqxqDOM+renewCard3);
                $('#cardNumber_name,#cardNumber_num').show();
                bindUpFiles();
                bindAjaxUpload('file_4');
                bindAjaxUpload('mobidfy_4');
                bindAjaxUpload('file_6');
                bindAjaxUpload('mobidfy_6');
                bindAjaxUpload('file_7');
                bindAjaxUpload('mobidfy_7');
                bindAjaxUpload('file_8');
                bindAjaxUpload('mobidfy_8');

                validateForm();
                break;
            case 4:
                $("#gotosubmit").attr("type","staty");
                $uploadCols.html("").html(identityCard+stayCard+dqxqDOM+renewCard4);
                $('#cardNumber_name,#cardNumber_num').show();
                bindUpFiles();
                bindAjaxUpload('file_5',"staty");
                bindAjaxUpload('mobidfy_5',"staty");
                bindAjaxUpload('file_7',"staty");
                bindAjaxUpload('mobidfy_7',"staty");
                bindAjaxUpload('file_8',"staty");
                bindAjaxUpload('mobidfy_8',"staty");
                validateForm();
                break;
            default:
                $("#gotosubmit").attr("type","");
              /* $uploadCols.find('.u-c-item').eq(2).remove().end().end().append( createHtml(_index) );
                bindAjaxUpload('file_3');
                bindAjaxUpload('mobidfy_3');
                $('#cardNumber_name,#cardNumber_num').show();
                // 校验表单提交
                validateForm();*/
                break;
        }
    }

    /**
     * 构造提交请求参数
     */
    var builtParam = function() {

        var param = [];
        param.push('k='+ query.rebatekid +'&');
        param.push('pid=' + query.productId + '&'); // productId
        param.push('sid=' + query.skuId + '&'); // skuId
        param.push('type=19&');// 固定为1
        param.push('pcount=1&');// 固定为1
        param.push('allowanceName=' + encodeURIComponent(userName.value) + '&');// 姓名
        param.push('allowanceType=' + $("input[type='radio']:checked").val() + '&');// 证件类型：1表示京籍身份证、2驻京军人证、3北京居住证、4北京暂住证
        param.push('allowanceOtherNo=' + cardNumber.value + '&');// 其他证件编号
        param.push('allowanceNo=' + card.value + '&');// 身份证编号
        param.push('allowanceFrontImg=' + (allowanceFrontImg||"") + '&');// 身份证正面照片
        param.push('allowanceReverseImg=' + (allowanceReverseImg||"") + '&');//身份证反面照片
        param.push('allowanceOtherImg=' + (allowanceOtherImg||"") + '&');// 其他证件照片

        param.push('residenceCardUserInfoImg=' + (residenceCardUserInfoImg||"") + '&');// 客户信息
       // if($("#gotosubmit").attr("type")=="live"){
        param.push('residenceCardRenewFirstPageImg=' + (residenceCardRenewFirstPageImg||"") + '&');// 续签1
        param.push('residenceCardRenewSecondPageImg=' + (residenceCardRenewSecondPageImg||"")+ '&' );// 续签2
       // }
        //if($("#gotosubmit").attr("type")=="staty"){
        param.push('tempResidenceCardRenewFirstPageImg=' + (tempResidenceCardRenewFirstPageImg||"") + '&');// 续签1
        param.push('tempResidenceCardRenewSecondPageImg=' + (tempResidenceCardRenewSecondPageImg||"") );// 续签2
        //}

        return param.join('');
    }

    /**
     * ajax提交请求
     * @param $target 目标控件
     */
    var ajaxFn = function($target) {
        var urls="//cart"+ cookieDomain +"/home/api/cart/quickBuy?",
            params=builtParam(),
            $this = this;
        $target.html('<span><i class="ioc"></i><em>&nbsp;跳转中...</em></span>');
        $.ajax({
            type: "GET",
            url: urls+params,
            data: {},
            success: function(data, textStatus, jqXHR){
                if(!!data.success === false){
                    $.errorMask({
                        code:data.errCode,
                        msg:data.errMsg
                    });
                    $target.html('<span>去结算</span>');
                    return ;
                }
                window.location.href='/allowance/shopping';
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                $this.html('<span>去结算</span>');
            }
        });
    }

    /**
     * 表单提交事件
     */
    var submitFn = function() {
        var $this = $(this);

        if($this.hasClass('disable')) {
            return false;
        }

        //g.login(function() {
            if(validateForm()) {
                ajaxFn($this);
            }
        //});
    }

    var focusFn = function() {
        var $this = $(this),
            $tSpan = $this.next('span');

        if($this.text() == '') {
            return false;
        }

        $tSpan.html('');
    }

    /**
     * 添加蒙层效果
     */
    var loadingFn = function() {
        $('<div class="js-warp" style="height:'+$(document).height() +'px;"></div>')
            .appendTo("body")
            .css({'opacity':'0.15','-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(opacity=15)','zIndex':'99999'});
    }
    /**
     * 文件上传
     * @param domID 元素id
     */
    var bindAjaxUpload = function(domID,type) {
        new AjaxUpload(
            domID, {
            action: '/home/api/gfs/fileUp',
            name: 'file',
            hoverClass:'hover',
            responseType: 'json',
            onSubmit : function(file , ext){
                var thiz = this;
                //判断IE
                var isIE = window.navigator.userAgent.toLowerCase().indexOf("msie")>0 ? true : false;
                if(!isIE && thiz._input.files && thiz._input.files[0].size/(1024 * 1024) > 5){
                    $.errorMask({
                        code:null,
                        msg:"请上传文件大小不超过5M的图片！"
                    });
                    return false;
                }
                if (ext && /^(jpg|jpeg|png|bmp)$/.test(ext.toLowerCase())){
                    thiz.setData({
                        'file': file
                    });
                } else {
                    $.errorMask({
                        code:null,
                        msg:"请上传格式为 jpg/jpeg/bmp/png 的图片！"
                    });
                    return false;
                }

                $('#'+domID).next('.upload-load').show();
                loadingFn();
            },
            onComplete : function(file,response){

                $(".js-warp").remove();

                if(!!response.success === false){
                    $('#'+domID).next('.upload-load').hide();
                    $.errorMask({
                        code:response.errCode,
                        msg:response.errMsg
                    });
                    return;
                }
                var waterPath = response.data.waterPath;
                var waterPathSrc = waterPath.substring(0,waterPath.indexOf(".jpg")) + "-dh300.jpg";

                $('#'+domID).attr('upload','true')
                    .parents('.upload-au')
                    .find('.upload_btn').hide().end()
                    .find('.upload-pic')
                    .find('img').attr('src',waterPathSrc).end().show().end()
                    .find('.upload_edit').show();
                /* if(domID=="file_1"){
                    allow.cardPic1 = response.data.waterPath;
                    allow.cardPath1 = response.data.path;
                 }
                 if(domID="file_2"){
                    allow.cardPic2 = response.data.waterPath;
                    allow.cardPath2 = response.data.path;
                 }   */
                // 校验表单提交
                validateForm();

                //居住证是file_4  678 OK //
                switch(domID) { //12 //123 //12 578//12 4678
                    case 'file_1':
                        allowanceFrontImg =  response.data.path;
                        break;
                    case 'mobidfy_1':
                        allowanceFrontImg =  response.data.path;
                        break;
                    case 'file_2':
                        allowanceReverseImg = response.data.path;
                        break;
                    case 'mobidfy_2':
                        allowanceReverseImg =  response.data.path;
                        break;
                    case 'file_6'://客户信息
                        residenceCardUserInfoImg = response.data.path;
                        break;
                    case 'mobidfy_6'://客户信息
                        residenceCardUserInfoImg = response.data.path;
                        break;
                    case 'file_7'://续签1
                        if(type=="staty"){
                            tempResidenceCardRenewFirstPageImg = response.data.path;
                        }else{
                            residenceCardRenewFirstPageImg = response.data.path;
                        }
                        break;
                   case 'mobidfy_7'://续签1
                      if(type=="staty"){
                          tempResidenceCardRenewFirstPageImg = response.data.path;
                      }else{
                          residenceCardRenewFirstPageImg = response.data.path;
                      }
                      break;
                    case 'file_8'://续签2
                        if(type=="staty"){
                            tempResidenceCardRenewSecondPageImg = response.data.path;
                        }else{
                            residenceCardRenewSecondPageImg = response.data.path;
                        }
                        break;
                   case 'mobidfy_8'://续签2
                       if(type=="staty"){
                           tempResidenceCardRenewSecondPageImg = response.data.path;
                       }else{
                           residenceCardRenewSecondPageImg = response.data.path;
                       }
                       break;
                    default:
                        allowanceOtherImg = response.data.path;
                        break;
                }
            }
        });
    }

    /**
     * 批量绑定文件上传
     * @param domIDs
     */
    function bindUpFiles(){
        bindAjaxUpload('file_1');
        bindAjaxUpload('mobidfy_1');
        bindAjaxUpload('file_2');
        bindAjaxUpload('mobidfy_2');
    };
    function bindUpFiles1(){
        bindAjaxUpload('file_1');
        bindAjaxUpload('mobidfy_1');
    };
    function bindUpFiles2(){
        bindAjaxUpload('file_2');
        bindAjaxUpload('mobidfy_2');
    };
    var batchBindAjaxUpload = function(domIDs) {

        domIDs.push('file_1');
        domIDs.push('file_2');
        domIDs.push('mobidfy_1');
        domIDs.push('mobidfy_2');
        for(var i=0; i<domIDs.length; i++) {
            bindAjaxUpload( domIDs[i] || 'undefined' );
        }
    }

    $(userName).focus( focusFn ).blur( function(){ validateForm(); } );
    $(card).focus( focusFn ).blur( function(){ validateForm(); } );
    $(cardNumber).focus( focusFn ).blur( function(){ validateForm(); } );

    $('input[type="radio"]').click( clickFn ).eq(0).click();

    $submitBtn.addClass('disable').click( submitFn );

   // batchBindAjaxUpload([]);
})(jQuery);
