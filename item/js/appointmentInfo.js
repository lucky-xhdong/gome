$("[data-visitor='hover']").ghover({
    addcss: "tophover"
});
$(".js-tophover").ghover({
    addcss: "hover"
});
//#region timer
function Timer(params) {
    this._init(params);
    this._runningflag;
}
Timer.prototype = {
    _init: function (params) {
        this.params = params;
    },
    run: function () {
        var _this = this;
        this.params.immediately && this.params.callback(this.params.millisecond)
        var running = setInterval(function () {
            _this.params.millisecond -= _this.params.interval;
            if (_this.params.millisecond < 0) {
                clearInterval(running);
                _this.params.callback(0);
                _this.end();
                return;
            }
            _this.params.callback(_this.params.millisecond);
        }, this.params.interval)
    },
    end: function () {
        this.params.fnEnd && this.params.fnEnd();
    }
}
//#endregion
function verify_phonenum() {
    var phone_num = $('#phone_num');
    var phone_reg = /^1(3|4|5|8)\d{9}$/;
    if ($.trim(phone_num.find("input[type=text]").val()).length == 0) {//手机号码不能为空
        phone_num.find('.verify_border').css('border', '1px solid #c00');
        phone_num.find('.verify_msg')
            .html('手机号码不能为空')
            .css({
                'visibility': 'visible',
                'color': '#c00'
            });
        // phone_num.find("input[type=text]").focus();
    }
    else if (verify.phone_num(phone_num.find("input[type=text]").val()).code != 0) {//号码不对
        phone_num.find('.verify_border').css('border', '1px solid #c00');
        phone_num.find('.verify_msg')
            .html('请输入11位手机号')
            .css({
                'visibility': 'visible',
                'color': '#c00'
            });
        //   phone_num.find("input[type=text]").focus();
    } else {//验证通过
        phone_num.find('.verify_border').css('border', '1px solid #ccc')
        phone_num.find('.verify_msg').css('visibility', 'hidden')
        return true;
    }
    return false;
}
$('#get_verify_code').click(function () {
    if (verify_phonenum() == false) {
        //alert();
        return;
    }
    var _this = this;
    if ($(_this).hasClass('unable')) {
        return;
    }
    //发送请求
    $.ajax({
        url: '//ss' + cookieDomain + '/item/v1/sms/reserve/' + loginData.loginId + '/' + $('#phone_num_val').val() + '/flag/item/getMobileInfo',
        data: 'get',
        dataType: 'jsonp',
        jsonpName: 'getMobileInfo'
    }).done(function (data) {
        if (data.success && data.success == true) {
            $(_this).addClass('unable');
            var t1 = new Timer({
                millisecond: 60 * 1000,
                interval: 1000,
                immediately: true,
                callback: function (millisecond) {
                    $(_this).html(parseInt(millisecond / 1000) + "秒后,重新获取");
                },
                fnEnd: function () {
                    $(_this).removeClass('unable');
                    $(_this).html('获取验证码');
                }
            });
            t1.run();
            $(this).parent().find(".verify_msg")
                .html('验证码已经发送到您的手机上')
                .css({
                    'visibility': 'visible',
                    'color': '#2a8c01'
                });
        } else {
            if (data.message) {
                alert(data.message);
            }
        }


    });


});
$('#phone_num').focusin(function () {
    $(this).find('.verify_border').css('border', '1px solid #a5a5a5');
    $(this).find('.verify_msg').css('visibility', 'hidden');
});
$('#phone_num').focusout(function () {
    verify_phonenum();

});
$('#verify_num').focusout(function () {
    if (verify.verify_num($('#verify_num_val').val()).code == 0) {//验证通过

        $(this).removeClass('error');
        $(this).find('.verify_msg').css({
            'visibility': 'hidden'
        });
    } else {

        if ($.trim($('#verify_num_val').val()).length == 0) {

            $(this).addClass('error');
            $(this).find('.verify_border').css('border', '1px solid #c00');
            $(this).find('.verify_msg')
                .css({
                    'visibility': 'visible',
                    'color': '#c00'
                })
                .html("验证码不能为空");
        } else {
            $(this).addClass('error');
            $(this).find('.verify_border').css('border', '1px solid #c00');
            $(this).find('.verify_msg')
                .css({
                    'visibility': 'visible',
                    'color': '#c00'
                })
                .html("验证码错误");
        }

    }
});
$('#verify_num').focusin(function () {
    $(this).find('.verify_border').css('border', '1px solid #a5a5a5');
    $(this).find('.verify_msg').css('visibility', 'hidden');
});
var bom_tools = {
    getUrlParam: function (name) {
        var reg = new RegExp("(^|/)([^html]*)(html|$)");
        var r = window.location.pathname.match(reg)[0].replace(/(.html)[^\n]*/g, "");
        if (r != null) return unescape(r.split('-')[name]);
        return null;
    }
};

$('#submit_phone_num').hover(function () {
    $(this).css("background-color", '#d00');
}, function () {
    $(this).css("background-color", '#c00');
});

$('#submit_phone_num').click(function () {
    if ($.trim($('#verify_num_val').val().length) == 0) {
        $('#verify_num_val').focus();
        $('#verify_num').addClass('error');
        $('#verify_num').find('.verify_border').css('border', '1px solid #c00');
        $('#verify_num').find('.verify_msg')
            .css({
                'visibility': 'visible',
                'color': '#c00'
            })
            .html("验证码错误");
        return;
    }

    var _this = this;
    if ($(_this).attr('running')) {
        return;
    } else {
        $(_this).attr('running', true);
    }

    $.ajax({
        type: "get",
        url: '//member' + cookieDomain + '/myaccount/reserve/saveReserveBuyInfo',
        dataType: 'jsonp',
        jsonpName: 'ckdata',
        data: {
            // productId: bom_tools.getUrlParam(0),
            // skuId: bom_tools.getUrlParam(1),
            productId: productId,
            skuId: skuId,
            verifyCode: $('#verify_num_val').val(),
            mobileNumber: $('#phone_num_val').val()
        },
        contentType: "application/json",
        success: function (data) {
            $(_this).removeAttr('running');
            if (data.result && data.result.status == "Y") {
//                var d = new Date(parseInt(data.result.buyStartTime));
                $('#begin_time').html(data.result.buyStartTime);
                var photo_num = $('#phone_num_val').val();
                document.getElementById('phoneNo').innerHTML = "  " + photo_num.substr(0, 3) + "  " + photo_num.substr(3, 4) + "  " + photo_num.substr(7, 4);
                $('.appointemtInfo').hide();
                $('.appointemtSuccess').show();
                $('.cur').addClass('prev').addClass('ok').removeClass('cur');
                $('.last').addClass('cur');

            } else if (data.result && data.result.status == "fail") {//已经预约
                alert(data.result.message);
            } else if (data.result && data.result.status == "N") {
                alert(data.error.message);
            } else if (data.error && data.error.code == -40000) {
                window.location.href = window.location.href;
            } else if (data.error) {
                alert(data.error.message)
            } else {
                alert(data.error.message)
            }
        }
    });
});
var verify = {
    phone_num: function (num) {
        var reg = /^1(3|4|5|8|7)\d{9}$/;
        var result = {
            code: 0,//错误代码
            message: '验证通过' //验证通过
        }
        if (reg.test(num) == true) {
            result = {code: 0, 'msg': '验证通过'};
        } else if (num.length != 11) {
            result.code = 1;
            result.message = '长度不对'
        }
        return result;
    },
    verify_num: function (val) {
        var result = {
            code: -1,//错误代码
            message: '未知错误' //验证通过
        }
        if (val.length == 6) {
            result.code = 0;
            result.message = "验证通过";
        }
        if (val.length != 6) {
            result.code = 1;
            result.message = "长度不对";
        }
        return result;
    }
}

//埋码
/*
s.pageName = "预约购:预约信息填写";
s.channel = "预约购";
s.prop1 = "预约购:预约信息填写";
s.prop2 = "预约购:预约信息填写";
s.prop3 = "预约购:预约信息填写";
s.prop4 = "预约购";
var s_code = s.t();
if (s_code)document.write(s_code);*/
    	