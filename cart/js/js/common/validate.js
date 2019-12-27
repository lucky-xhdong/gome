(function(exports,$,u){
	function errcbk(str){
		return function(cbk){
			cbk(str);
			return false;
		}
	}
	//最大长度限制
	var maxLimit=u.curry(function(max,str){
		return str.length>max;
	});
	var minLimit=u.curry(function(min,str){
		return str.length<min;
	});

	//判断是否为空
	function isBlank(str){
		if(str==null)return true;
		if(str=="")return true;

		if(u.head(str)==" ")return isBlank(u.tail(str));
		return false;
	}

	/**
	 * 排除中文括号
	 * @param str
	 * @returns {boolean}
	 * @constructor
     */
	function NotZhSign(str){
		return !(/^[^（）]+$/.test(str));
	}
	//非汉字英文和数字空格
	function notEnNumCn(str){
		return !(/^[\u4E00-\u9FFF|0-9|a-z|A-Z|（|）|\s]+$/.test(str));
	}
    function notRightFormat(str){
        return !(/^[\u4E00-\u9FFF|\u300a|\u300b|0-9|a-z|A-Z|\(|\)|（|）|\-|【|】|{|}|\[|\]|,|.|，|。|\s]+$/.test(str));
    }
    function notSpecialChat(str){
		return !(/^[\u4E00-\u9FFF0-9a-zA-Z\s]+$/.test(str));
	}

	//非数字大写英文字母
	function notUpenNum(str){
		return !(/^[0-9|A-Z]+$/.test(str));
	}
	function length(str){
		return str.length;
	}
	function not(a){
		return !a;
	}
	function notLength(l){
		return u.pipe(length,u.eq(l),not)
	}
	function eqLength(l){
		return u.pipe(length,u.eq(l))
	}
	function notNum(str){
		return !(/^[0-9]+$/.test(str));
	}
    //固定电话校验  暂时先放在这，以后用这个，需要验证规则
	/*规则：
	 ^(\([0-9]{3,4}\))?([0-9]{7,8})(-[0-9]{1,4})?|
	 ([0-9]{2,4}-)?([0-9]{3,4}-)?([0-9]{7,8})(-[0-9])?$
	区号3到4位，第一位为0；
	中间7到8位，0-9的数字；
	分机号1到4位，0-9的数字。
	举例为：010-12345678、0912-1234567、(010)-12345678、(0912)1234567、(010)12345678、(0912)-1234567、01012345678、09121234567、
	010-12345678-1 010-12345678-12 010-12345678-123 010-12345678-1234*/
    function chenkCall(str){
    	//return !(/^[0-9]+(|-)[0-9]+(|(|-)[0-9]+)+$/).test(str)
        //return !(/^(((^0\d{2}-?\d{8})|(^0\d{3}-?\d{7})|(^\(0\d{2}\)-?\d{8})|(^\(0\d{3}\)-?\d{7})))([\-]\d{1,4})?$/.test(str));
    	//^(\([0-9]{3,4}\))?([0-9]{7,8})(-[0-9]{1,4})?|([0-9]{2,4}-)?([0-9]{3,4}-)?([0-9]{7,8})(-[0-9])?|(\([0-9]{3,4}\))?([0-9]{7,8})(\([0-9]{1,4}\))?$
		return !(/^0[0-9]{6,11}$|^(\(0[0-9]{2,3}\))?([0-9]{7,8})(-[0-9]{1,4})?$|^([0-9]{2,4}-)?(0[0-9]{2,3}-)?([0-9]{7,8})(-[0-9]{1,4})?$/.test(str));
    }
    function notFixedPhoneNum(str){
        return !/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/.test(str);
        //return !(/^(((^0\d{2}-?\d{8})|(^0\d{3}-?\d{7})|(^\(0\d{2}\)-?\d{8})|(^\(0\d{3}\)-?\d{7})|(^\（0\d{2}\）-?\d{8})|(^\（0\d{3}\）-?\d{7})))([\-]\d{1,4})?$/.test(str));
    }
	//非身份证号码
	function valiedateCardInput(idCard) {
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
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if(idCardLast==idCardY[idCardMod]){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        } else {
            return false;
        }

    }
	//非英文、数字、汉字、井号（#）、大中小括弧、逗号、句号、分隔符（|）、点
	function notAddress(str){
		return !(/^[\u4E00-\u9FFF|0-9\-|a-z|A-Z|\s|#\{\}\(\)\[\],\.。，（）｛｝【】\|]+$/.test(str));
	}
	//非汉字
	function notCn(str){
		return !(/^[\u4E00-\u9FFF]+$/.test(str));	
	}
	function notEmail(str){
		return !( /^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/.test(str));
	}

    //邮箱替换*号,保留前面3位，后面2位
    function transEmail(str){
        if(str==null || str.length==0 || str=="") return "";
        return str.replace(/(.{3}).+(.{2}@.+)/g, "$1****$2");
    }
    function checkPhone(str){
		var reg = /^(1[34578]\d{9})|(19[89]\d{8})|(166\d{8})$/;
		return !(reg.test(str));
	}
	var config={
		consignee:[
			[isBlank,errcbk("请输入收货人姓名")],
			[NotZhSign,errcbk("请输入正确的收货人姓名")],
			[notEnNumCn,errcbk("请输入正确的收货人姓名")],
			[maxLimit(30),errcbk("收货人姓名最多30个字符")]
		],
		address:[
			[isBlank,errcbk("请选择所在地")]
		],
		detailAddress:[
			[isBlank,errcbk("请填写详细地址")],
			[notAddress,errcbk("输入格式不正确")],
			[maxLimit(80),errcbk("详细地址最多输入80个字符")]
		],
		"phone":[
			[isBlank,errcbk("请输入手机号码")],
			[checkPhone,errcbk("请输入正确的手机号码")]
		],
		"mtk-phone":[
			[isBlank,errcbk("请输入手机号码")]
			,[checkPhone,errcbk("请输入正确的手机号码")]
		],
		"mtk-yzm":[
			[isBlank,errcbk("请输入验证码")]
			,[notNum,errcbk("请输入正确的验证码")]
			,[u.pipe(length,u.eq(6),not),errcbk("请输入正确的验证码")]
		],
		"call":[
			[isBlank,u.T]
			,[chenkCall,errcbk("请输入正确的固定电话")]
		],
		"email":[
			[isBlank,u.T]
			,[maxLimit(30),errcbk("请输入正确的邮箱")]
			,[notEmail,errcbk("请输入正确的邮箱")]
		],
		"fptt":[//发票抬头
			[isBlank,errcbk("请输入发票抬头，如：个人")]
			,[NotZhSign,errcbk("输入格式不正确")]
			,[notSpecialChat,errcbk("输入格式不正确")]
			,[maxLimit(30),errcbk("抬头为30个字符以内")]
		],
		"fptt-dw":[//单位发票抬头验证
			[isBlank,errcbk("请输入单位名称")]
			,[notRightFormat,errcbk("输入格式不正确")]
			,[maxLimit(30),errcbk("抬头为30个字符以内")]
		],
		"spsj":[//收票手机
			[isBlank,errcbk("请输入手机号码")]
			,[checkPhone,errcbk("请输入正确的手机号码")]
		],
		"spyx":[//收票邮箱
            [isBlank,u.T]
            ,[maxLimit(30),errcbk("请输入正确的邮箱")]
            ,[notEmail,errcbk("请输入正确的邮箱")]
		],
		"dwsh":[//单位税号
			//[isBlank,errcbk("单位税号为数字和大写英文字母")]
			[isBlank,u.T]//解除必填拦截
			,[notUpenNum,errcbk("单位税号为数字和大写英文字母")]
			,[u.anyPass([eqLength(15),eqLength(18),eqLength(20)]),u.T]
			,[u.T,errcbk("单位税号为15位、18位、20位数字和大写英文字母")]
		],
		"zpsjr":[//增票收件人
			[isBlank,errcbk("请输入增票收件人")]
			,[NotZhSign,errcbk("收票人输入格式不正确")]
			,[notEnNumCn,errcbk("收票人输入格式不正确")]
			,[maxLimit(30),errcbk("收票人名称最多30个字符（数字、英文、汉字各占一个字符）")]
		],
		"zpsjhm":[//赠票手机号码
			[isBlank,errcbk("请输入手机号码")]
			,[checkPhone,errcbk("请输入正确的手机号码")]
		],
		"zzshr":[//电子卡纸质发票详细地址
			[isBlank,errcbk("请输入收票人姓名")],
			[NotZhSign,errcbk("请输入正确的收票人姓名")],
			[notEnNumCn,errcbk("请输入正确的收票人姓名")],
			[maxLimit(30),errcbk("收票人最多30个字符")]
		],
		"zzxxdz":[//电子卡纸质发票详细地址
			[isBlank,errcbk("请填写详细地址")],
			[minLimit(2),errcbk("请填写更详细的地址")],
			[maxLimit(100),errcbk("详细地址为100个字符以内")],
			[notAddress,errcbk("输入格式不正确")]
		],
		"zzsjhm":[//电子卡纸质发票手机号码
			[isBlank,errcbk("请输入手机号码")]
			,[checkPhone,errcbk("请输入正确的手机号码")]
		],
		"zzgddh":[//电子卡纸质发票固定电话号码
			[isBlank,u.T]
			,[chenkCall,errcbk("请输入正确的固定电话")]
		],
		"zzyj":[//电子卡纸质发票邮箱
			[isBlank,u.T]
			,[maxLimit(30),errcbk("请输入正确的邮箱")]
			,[notEmail,errcbk("请输入正确的邮箱")]
		],
		"zpyjdz":[//邮寄地址
			[isBlank,errcbk("请输入邮寄地址")]
			,[minLimit(2),errcbk("请填写更详细的地址")]
			,[maxLimit(80),errcbk("详细地址最多80个字符")]
			,[notAddress,errcbk("输入格式不正确")]
		],
		"mdhyjf":[//使用国美门电器门店会员积分 兑换
			[u.pipe(u.prop("txt"),isBlank),errcbk("请输入门店会员积分")]
			,[u.pipe(u.prop("txt"),parseFloat,u.gte(0)),errcbk("请输入正确的门店积分")]
			,[u.pipe(u.prop("txt"),notNum),errcbk("请输入整数")]
			,[u.pipe(u.juxt([
				u.pipe(u.prop("txt"),parseInt),
				u.pipe(u.prop("max"),parseInt)
				]), u.apply(u.lte),not),
			errcbk("门店会员积分不能大于本次最多可使用积分")]
		],
		"hwg-name":[//海外购 姓名
			[u.anyPass([isBlank,minLimit(2),maxLimit(30),notCn]),errcbk("请您填写真实姓名")]
		],
		"hwg-card":[//海外购 身份证
			[isBlank,errcbk("请输入正确的身份证号码")]
			,[u.pipe(valiedateCardInput,not),errcbk("请输入正确的身份证号码")]
		],
		"presell-phone":[//预售尾款手机号验证
			[isBlank,errcbk("请输入手机号码")]
			,[checkPhone,errcbk("请输入正确的手机号码")]
		],
		"dxjzxm":[//电信运营商站点
			[isBlank,errcbk("请输入机主姓名")],
			[minLimit(2),errcbk("请输入正确的机主姓名")],
			[maxLimit(30),errcbk("请输入正确的机主姓名")],
			[notCn,errcbk("请输入正确的机主姓名")]
		],
		"dxsfzh":[//电信运营商站点 身份证
			[isBlank,errcbk("请输入机主身份证号码")]
			,[u.pipe(valiedateCardInput,not),errcbk("请输入正确的身份证号码")]
		],
		"dxrwxx":[
			[isBlank,errcbk("请勾选")]
		],
		"dx_dqyzf":[
			[isBlank,errcbk("请选择")]
		],
		"jxjzxm":[//极信通机主姓名
			[isBlank,errcbk("请输入机主姓名")],
			[minLimit(2),errcbk("请填写真实姓名")],
			[maxLimit(30),errcbk("请填写真实姓名")],
			[notCn,errcbk("请填写真实姓名")]
		],
		"jxsfzh":[//极信通身份证号
			[isBlank,errcbk("请输入机主身份证号码")]
			,[u.pipe(valiedateCardInput,not),errcbk("请输入正确的身份证号码")]
		]
	}
	function vacond(conds,str,fillel){
		if(u.is(Function,fillel)) fillel("");
		else fillel.html("").hide();
		var cnd=u.head(conds);
		if(cnd==null) return true;
		if(u.head(cnd)(str)){
			return u.last(cnd)(fillel);
		}
		return vacond(u.tail(conds),str,fillel);
	}
	function validate(vaFillelkeys){
		function vakey(key){
			return vacond(config[key[1]],u.head(key),u.last(key));
		}
		return u.pipe(u.map(vakey),u.all(u.eq(true)))(vaFillelkeys);
	}
	function validateItem(key,str,fillel){
		return validate([[str,key,fillel]]);
	}
	exports.validate={
		validate:validate,
		validateItem:validateItem,
		vacond:vacond
	}
}(this,$,util));