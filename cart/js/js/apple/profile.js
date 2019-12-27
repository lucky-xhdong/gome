;(function($){
    var querystring = util.pipe(util.split("?"), util.last, util.split("&"), util.map(function (item) { return item.split("=") }), util.fromPairs);
    var query = querystring(location.href);
    var selectIdentityType = $("#select-identity-type"),//身份类型
        userName = $("#userName"),//用户姓名
        cardNumber = $("#cardNumber"),//身份证号
        selectschoolprovince = $("#select-school-province"),//学校省份
        labelSchoolName=$(".label-school"),//学校名称标签
        txtSchoolName=$(".txt-school"),//学校名称
        inputSchoolName = $("#input-school-name"),//学校名称输入框
        selectJoinSchoolYear = $("#select-joinschool-year"),//入学年份
        selectMajor = $("#select-major"),//专业
        selectDegree = $("#select-degree"),//学历
        btnSubmitProfile = $("#btn-submit-profile"),//下一步，提交个人信息按钮
        certificatesPhoto1 = '',//证件照片1
        certificatesPhoto2 = '',//证件照片2
		checkboxAgreements = $("#ckx-agreements"),//同意参加苹果特惠商品促销
        provinceId = '';//省份id

    //文本框获焦事件
    function valiedateFocusEvent () {
        var $this = $(this), $tSpan = $this.next('.error-tip');
        if($this.text() == '') {
            return false;
        }
        $tSpan.html('');
    }

    //验证用户姓名
    function valiedateUserName() {
        var userNameVal = userName.val().replace(/\s/g,'');
        if (!/^[\u4E00-\u9FA5·]{2,10}$/g.test(userNameVal)) {
            if (userNameVal.length == 0) {
                $('#userNameError').show().html('请输入姓名');
            } else if (userNameVal.length < 2) {
                $('#userNameError').show().html('姓名至少2个汉字');
            } else if (userNameVal.length > 10) {
                $('#userNameError').show().html('姓名最多10个汉字');
            } else {
                $('#userNameError').show().html('姓名只能输入汉字！');
            }
            return false;
        } else{
            $('#userNameError').hide().html('');
        }
        return true;
    }

    //验证身份证号
    function valiedateCardNumber () {
        var cardNumberVal = cardNumber.val().replace(/\s/g, '');
        //var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
        //15位和18位身份证号码的正则表达式
        var regCardNumber = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        //如果通过该验证，说明身份证格式正确，但准确性还需计算
        if (regCardNumber.test(cardNumberVal)) {
            if (cardNumberVal.length == 18) {
                var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                for (var i = 0; i < 17; i++) {
                    idCardWiSum += cardNumberVal.substring(i, i + 1) * idCardWi[i];
                }
                var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
                var idCardLast = cardNumberVal.substring(17);//得到最后一位身份证号码

                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                if (idCardMod == 2) {
                    if (idCardLast == "X" || idCardLast == "x") {
                        $('#cardNumberError').hide().html('');
                        return true;
                    } else {
                        $('#cardNumberError').show().html('身份证信息输入有误，请填写18位有效身份证号码！');
                        return false;
                    }
                } else {
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if (idCardLast == idCardY[idCardMod]) {
                        $('#cardNumberError').hide().html('');
                        return true;
                    } else {
                        $('#cardNumberError').show().html('身份证信息输入有误，请填写18位有效身份证号码！');
                        return false;
                    }
                }
            }
        } else {
            $('#cardNumberError').show().html('身份证信息输入有误，请填写18位有效身份证号码！');
            return false;
        }
    }

    //全局校验
    function valiedateForm () {
        //如果有未输入项，下一步不可点击
        if (!valiedateUserName() || !valiedateCardNumber()) {
            btnSubmitProfile.addClass('disabled');
            return false;
        } else {
            // debugger
            //学校名称
            if (txtSchoolName.html() == '') {
                selectschoolprovince.next().next('.error-tip').show().html('请选择学校');
                btnSubmitProfile.addClass('disabled');
                return false;
            }
            //新生需要上传证件照片
            if (selectIdentityType.val() && selectIdentityType.val() == 2) {
                if (certificatesPhoto1 == '' && certificatesPhoto2 == '') {
                    $('.file-control__normal1').find(".error-tip").show().html('请至少上传一张图片');
                    btnSubmitProfile.addClass('disabled');
                    return false;
				}
            }
            //同意参加苹果特惠勾选
            if (!checkboxAgreements.prop("checked")){
				btnSubmitProfile.addClass('disabled');
                return false;
			}
        }
        btnSubmitProfile.removeClass('disabled');
        return true;
    }

    //调用和节能补贴一样的上传图片方法
    function bindAjaxUpload(domID, parentDom) {
        new AjaxUpload(
            domID, {
                action: "//cart"+ cookieDomain +"/home/api/gfs/fileUp",
                name: 'file',
                hoverClass: 'hover',
                responseType: 'json',
                onSubmit : function(file , ext){
                    var thiz = this;
                    //判断IE
                    var isIE = window.navigator.userAgent.toLowerCase().indexOf("msie")>0 ? true : false;
                    if(!isIE && thiz._input.files && thiz._input.files[0].size/(1024 * 1024) > 1){
                        $('#'+domID).parents(parentDom).find(".error-tip").show().html('文件最大上传1024KB！');
                        return false;
                    }
                    if (file && !/\.(jpg|jpeg|png|gif|pdf)$/.test(file)){
                        $('#'+domID).parents(parentDom).find(".error-tip").show().html('请选择可用的图片格式！');
                        return false;
                    } else {
                        $('#'+domID).parents(parentDom).find(".error-tip").hide().html('');
                        thiz.setData({
                            'file': file
                        });
                    }
                },
                onComplete : function(file,response){
                    if(!!response.success === false){
						if (response.errMsg) {
							$('#'+domID).parents(parentDom).find(".error-tip").show().html(response.errMsg);
						}
                        return;
                    } else {
						$('#'+domID).parents(parentDom).find(".error-tip").hide().html('');
					}
                    var waterPath = response.data.waterPath;
                    var waterPathSrc = waterPath.substring(0,waterPath.indexOf(".jpg")) + "-dh300.jpg";
                    $('#'+domID).parents(parentDom).find('.upload-group').hide();
                    $('#'+domID).parents(parentDom).find(".img-group").show().find('img').attr('src',waterPathSrc);
                    $('#'+domID).parents(parentDom).find(".btn-group__inset").show();

                    switch(domID) {
                        case 'file-photo-1':
                            certificatesPhoto1 =  response.data.path;
                            break;
                        case 'btn-modify-1':
                            certificatesPhoto1 =  response.data.path;
                            break;
                        case 'file-photo-2':
                            certificatesPhoto2 =  response.data.path;
                            break;
                        case 'btn-modify-2':
                            certificatesPhoto2 =  response.data.path;
                            break;
                    }

                    // 校验表单提交
                    valiedateForm();
                }
            });
    }

    $.extend({
        //确认授权协议
        comfirmAgreements: function () {
            var button = $("#btn-comfirm-agreements"),
                popup = '.popup-agreements',
				mask = '.mask-apple';
            button.on('click', function () {
                $(this).parents(popup).hide();
				$(mask).hide();
                checkboxAgreements.attr('checked', true);
            });
            checkboxAgreements.on('click', function () {
                if (valiedateForm()) {
                    if ($(this).prop("checked")){
                        btnSubmitProfile.removeClass('disabled');
                    } else {
                        btnSubmitProfile.addClass('disabled');
                    }
                }
            });
        },

        //身份类型
        identityType: function () {
            //添加身份类型项
            function addEvent() {
                var html = '',
                    fileUpload = $("#certificatesPhoto");
                $.ajax({
                    type: "POST",
                    url: "//cart"+ cookieDomain +"/api/apple/occupations",
                }).done(function (data) {
                    if (!data) return;
                    if (data) {
                        var arr = [];
                        for (var i in data) {
                            arr.push({
                                id: i,
                                name: data[i]
                            });
                        }
                        arr.reverse();
                        for (var i = 0, len = arr.length; i < len; i++) {
                            html += '<option value=' + arr[i].id + '>' + arr[i].name + '</option>';
                        }
                        if (selectIdentityType.find('option').length <= 0) {
                            selectIdentityType.append(html);
                            selectIdentityType.change(function () {
                                changeEvent($(this), fileUpload);
                                valiedateForm();
                            });
                        }
                    }
                }).fail(function(){

                });
            }

            //选择身份类型：选择新生：展示“证件照”选项。选择在校生：隐藏“证件照”选项。
            function changeEvent(select, fileUpload) {
                (select.val() && select.val() == 2) ? fileUpload.show() : fileUpload.hide()
            }
            addEvent();
        },

        //学校省份
        schoolProvinces: function () {
            //添加省份
            function addEvent() {
                var html = '',
                    btnSelectSchool = $("#btn-select-school");
                $.ajax({
                    type: "GET",
                    url: "//cart"+ cookieDomain +"/api/apple/provinces",
                }).done(function (data) {
                    if (!data) return;
                    if (data) {
                        var result = data.data;
                        for (var i in result) {
                            html += '<option value=' + i + '>' + result[i] + '</option>';
                        }
                        selectschoolprovince.append(html);
                        selectschoolprovince.on('change', function () {
                            changeEvent($(this), btnSelectSchool);
                            provinceId = $(this).val();
                        })
                        chooseSchool();
                    }
                }).fail(function(){

                });
            }

            //省份选择
            function changeEvent(select, btnSelect) {
                labelSchoolName.show();
                txtSchoolName.removeAttr('style').html('');
                inputSchoolName.val('');
                if (select.val() && select.val() != 0) {
                    btnSelect.removeClass('disabled');
                    selectschoolprovince.next().next('.error-tip').hide().html('');
                    $(".school-list ul").html('');
                } else {
                    btnSelect.addClass('disabled');
                    selectschoolprovince.next().next('.error-tip').show().html('请选择学校');
                    inputSchoolName.val('');
                    $(".school-list li").removeClass('active');
                    btnSubmitProfile.addClass('disabled');
                }
            }

            //选择学校
            function chooseSchool() {
                var btnSelectSchool = $("#btn-select-school .btn-select"),
                    btnClose = $(".popup-schools .btn-close"),
                    btnConfirm = $(".popup-schools .btn-confirm"),
                    popupSchools = $(".popup-schools"),
					maskApple = $(".mask-apple"),
                    ul = $(".school-list ul");
                //选择学校点击事件
                btnSelectSchool.on('click', function () {
					if ($(this).parents('.btn-group__inset').hasClass('disabled')) {
						return false;
					}
                    popupSchools.show();
					maskApple.show();
                    var params = {
                        "activityId": query.spid || 1,
                        "provinceId": provinceId,
                        "partial":''
                    };
                    $.ajax({
                        type: "POST",
                        url: "//cart"+ cookieDomain +"/api/apple/schools",
                        data: params,
                    }).done(function (data) {
                        if (!data) return false;
                        if (data) {
                            if (data.schools) {
                                var result = data.schools,
                                    html = '';
                                for (var i = 0, len = result.length; i < len; i++) {
                                    html += '<li data-id="'+result[i].school_id+'"><a href="javascript:;" class="txt">' + result[i].school_name + '</a></li>';
                                }
                                ul.html(html);

                                //学校当前项选中事件
                                ul.undelegate('li', 'click').delegate('li', 'click', function () {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    inputSchoolName.val($(this).text());
                                    labelSchoolName.hide();
                                    txtSchoolName.css({'display': 'inline-block'}).html($(this).text());
                                    txtSchoolName.attr('school_id',$(this).attr('data-id'));
									selectschoolprovince.next().next('.error-tip').hide().html('');
                                });
                            }
                        }
                    }).fail(function(){

                    });
                    hidePopup(btnClose, popupSchools, maskApple);
                    hidePopup(btnConfirm, popupSchools, maskApple);
                });

                //输入框模糊查询
                inputSchoolName.on('keyup', function () {
                    // $(".school-list li").css('display', 'block');//只要输入就显示列表框
                    var li = $(".school-list li");
                    if ($(this).val().length <= 0) {
                        li.show().removeClass('active');//如果什么都没填，跳出，保持全部显示状态
                        $(this).parents(".popup-schools").find('.error-tip').hide().html('');
                        return;
                    } else {
                        li.hide();//如果填了，先将所有的选项隐藏
                        for (var i = 0; i < $(".school-list li").length; i++) {
                            //模糊匹配，将所有匹配项显示
                            if (li.eq(i).text().indexOf($(this).val()) >=0) {
                                li.eq(i).show();
                            }
                        }
						if (li.text().indexOf($(this).val()) >=0) {
							$(this).parents(".popup-schools").find('.error-tip').hide().html('');
						} else {
							$(this).parents(".popup-schools").find('.error-tip').show().html('暂无相关学校信息，请重新输入!');
						}
                    }
                });

                //隐藏弹窗
                function hidePopup(button, popupSchools, maskApple) {
                    button.on('click', function () {
                        popupSchools.hide();
						maskApple.hide();
                        valiedateForm();
                    });
                }
            }

            addEvent();
        },

        //入学年份
        joinSchoolYear: function () {
            $.ajax({
                type: "POST",
                url: "//cart"+ cookieDomain +"/api/apple/years",
            }).done(function (data) {
                var date, year, html = '';
                if (!data) return false;
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        date = new Date(data[i]);
                        year = date.getFullYear();
                        html += '<option value=' + year + '>' + year + '</option>';
                    }
                    if (selectJoinSchoolYear.find('option').length <= 0) {
                        selectJoinSchoolYear.append(html);
                    }
                }
            }).fail(function(){

            });
        },

        //专业
        major: function () {
            var html = '',
                result = '';
            $.ajax({
                type: "GET",
                url: "//cart"+ cookieDomain +"/api/apple/majors",
            }).done(function (data) {
                if (!data) return false;
                if (data) {
                    if (data.status_code  && data.status_code == 1) {
                        result = data.data;
                        for (var i in result) {
                            html += '<option value=' + i + '>' + result[i] + '</option>';
                        }
                        // html += '<option>其他</option>';
                        selectMajor.prepend(html);
                    }
                }
            }).fail(function(){

            });
        },

        //学历
        degree: function () {
            var html = '',
                result = '';
            $.ajax({
                type: "GET",
                url: "//cart"+ cookieDomain +"/api/apple/degrees",
            }).done(function (data) {
                if (!data) return false;
                if (data) {
                    if (data.status_code  && data.status_code == 1) {
                        result = data.data;
                        for (var i in result) {
                            html += '<option value=' + i + '>' + result[i] + '</option>';
                        }
                    } else {
                        html = '<option value="其他">' + 其他 + '</option>';
                    }
                    if (selectDegree.find('option').length <= 0) {
                        selectDegree.append(html);
                    }
                }
            }).fail(function(){

            });
        },

        //证件照片
        certificatesPhoto: function () {
            bindAjaxUpload('file-photo-1', '.file-control__normal1');
            bindAjaxUpload('btn-modify-1', '.file-control__normal1');
            bindAjaxUpload('file-photo-2', '.file-control__normal2');
            bindAjaxUpload('btn-modify-2', '.file-control__normal2');
        },

        //提交个人信息页
        submitProfile: function() {
            btnSubmitProfile.on('click', function () {
                // if ($(this).hasClass('disabled')) {
                //     return false;
                // }
                if (valiedateForm()) {
                    var params = $.getParams(), url = "//cart" + cookieDomain + "/applePc/api/cart/quickBuy?type=28&";
                    $.ajax({
                        type: "GET",
                        url: url + params,
                    }).done(function (data) {
                        if (!data) return false;
                        if (data) {
                            if (data.success == true) {
                                window.location.href = "//cart" + cookieDomain + "/applePc/shopping";
                            } else {
                                if (data.errMsg) {
                                    alert(data.errMsg);
									if(data.status && data.status == "GO_LOGIN"){
									   return util_ui.redir("//login"+cookieDomain+"/login")
									}
                                    return false;
                                }
                            }
                        }
                    }).fail(function () {

                    });
                }
            })
        },

        //收集参数
        getParams: function() {
            var params = [];
            params.push('spid='+ (query.activityid || '') +'&');//苹果特惠促销ID
            params.push('identityCode='+ (selectIdentityType.find('option:selected').val() || '') +'&');//学生身份
            params.push('name='+ (encodeURI(userName.val()) || '') +'&');//真实姓名
            params.push('idNumber='+ (cardNumber.val() || '') +'&');//身份证号
            params.push('school='+ (encodeURI(txtSchoolName.html()) || '') +'&');//学校名称
            params.push('schoolId='+ (encodeURI(txtSchoolName.attr('school_id')) || '') +'&');
            params.push('educationCode='+ (selectDegree.find('option:selected').val() || '') +'&');//学历code
            params.push('education='+ (encodeURI(selectDegree.find('option:selected').text()) || '') +'&');//学历描述
            params.push('specialty='+ (encodeURI(selectMajor.find('option:selected').text()) || '') +'&');//专业名称
            params.push('specialtyCode='+ (selectMajor.find('option:selected').val() || '') +'&');//专业编码
            //选择的是新生才有证件照片
            if (selectIdentityType.find('option:selected').val() == 2) {
                params.push('identityCertifyFirstPageImg='+ (certificatesPhoto1 || '') +'&');
                params.push('identityCertifySecondPageImg='+ (certificatesPhoto2 || '') +'&');
            }
            params.push('threeProductId='+ (query.threeproductid || '') +'&');
            params.push('threeActivityId='+ (query.threeactivityid || '') +'&');
            params.push('is='+ (query.is || '') +'&');
            params.push('pid='+ (query.pid || '') +'&');
            params.push('sid='+ (query.sid || '') +'&');
            params.push('entranceYear='+ (selectJoinSchoolYear.val() || ''));
            return params.join('');
        },

        //初始化个人信息
        profileInit: function () {
            $("#userName, #cardNumber").on('focus', function () {
                valiedateFocusEvent();
            }).on('blur', function () {
                valiedateForm();
            });
            $.comfirmAgreements();
            $.identityType();
            $.schoolProvinces();
            $.certificatesPhoto();
            $.joinSchoolYear();
            $.major();
            $.degree();
            $.submitProfile();
        }
    });
    $.profileInit();
})(jQuery);