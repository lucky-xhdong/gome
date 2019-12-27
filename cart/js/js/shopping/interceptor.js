/*
*拦截器
*要求： 每个函数 两个参数 通过data处理逻辑如果通过 执行return hanlder(data);
* hanlder :为下一个拦截器
* data: 当前的数据
* function handler1(hanlder,data){
*    return hanlder(data)	
* }
* function handler2(hanlder,data){
*    return hanlder(data)	
* }
* var handler1=curry(handler1);
* 
* var hanlderSeqfn=u.pipe(handler1,hanlder2);
* var hanlderSeq=hanlderSeqfn(endfn); //xxxxx
* hanlderSeq(data)
* 执行顺序: hanlder2(data)->hanlder1(hanlder2返回的结果)->endfn(handler返回的结果)->endfn返回的结果
*/
!function(exports,u,panel,payment,invoice,listOfItem,address){
	function commonerror(errfn,handler,data){
	if(data.success) return dofn();
		else errfn(data);
		function dofn(){
			var r=null;
			// try{
				r=handler(data);
			// }catch(a){
			// 	panel.error("系统错误请稍后再试!");
			// 	if(window.console&&window.console.error)console.error(a);
			// }
			return r;
		}
		return dofn();
	}
	function whenError(handler,data){
		if(!data.success){
			return handler(data);
		}
	}
	function unlesssError(handler,data){
		if(data.success)return handler(data);
	}
	function addressTransData(handler,data){
		return handler(address.transData(data.data));
	}
	function paymentTransData(handler,data){
		return handler(payment.transData(data.data.paymentMethods));
	}
	function preferentialTransData(handler,data){
		return handler(preferential.transData(data.data));
	}
	function transData(handler,data){
		return handler(data.data);
	}
	function listOfItemTransData(handler,data){
		return handler(listOfItem.transData(data.data));
	}
	function invoiceTransData(handler,data){
		//var initData = invoice.initTransData(data.data)
		return handler(invoice.transData(data.data));
	}
	function setInstanceAtom(name,handler,instance){
		var r=handler(instance);
		$config.shoppingInstenceAtom[name]=r;
		return r;
	}
	exports.interceptor={
		commonerror:u.curry(commonerror),
		addressTransData:u.curry(addressTransData),
		paymentTransData:u.curry(paymentTransData),
		invoiceTransData:u.curry(invoiceTransData),
		whenError:u.curry(whenError),
		transData:u.curry(transData),
		preferentialTransData:u.curry(preferentialTransData),
		listOfItemTransData:u.curry(listOfItemTransData),
		setInstanceAtom:u.curry(setInstanceAtom),
		unlessError:u.curry(unlesssError)
	}
}(this,util,panel,payment,invoice,listOfItem,address);