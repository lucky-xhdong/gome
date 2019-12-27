/*
loginId：会员ID
loginName：会员显示名称即DisplayName
loginStatus：登录状态，1：匿名登录，2：假登录，3：正常登录成功
gradeId：会员等级（type为1时返回）
*/
$(function () {  
	var TYPE="user-info";
	$.getLoginInfo = function(callback){
		request.reqp("//member"+$page.cookieDomain+"/gome/index/loginStyle").then(function(data){
			if(data.loginName){
				$('.userinfo-has-login')
					.show()
					.find('[act-login-name]')
					.attr('href', '//myhome' + $page.cookieDomain + '/member/profileHome')
					.attr('uid', data.loginId)
					.text(data.loginName);

				$('.userinfo-not-login').hide(); 

				$(document).trigger('getLoginInfo', data);
				callback && callback();
				util_watch.emit(TYPE,"user-login",data);
			}
		});
	};

	$.getLoginInfo();
	
});