!function(exports){

	  var url="",data={};
	     //初始化取值 
	     function init(){
	          //获取loginID http://member"+cookieDomain+"/gome/index/loginStyle?callback=logintop&type=1&productId=9010000426&skuId=1000033596&_=1478573825891
	          $.ajax({
	           url:'//member'+cookieDomain+'/gome/index/loginStyle?callback=logintop&type=1&productId='+productId+'&skuId='+skuId,
	           type:'get',
	           dataType:'jsonp',
	           jsonpName:'logintop',
	           success:function(datas){
	             var datas=datas;
	             if(datas){
	               if(datas.loginStatus=='3'){
	                 data.userId=datas.loginId
	               }else{
	                 location.href="https://login"+cookieDomain+"/login";
	               }
	               
	             }
	           }
	          });
	          //获取初始化信息
	          $.ajax({
	           url:"//ss"+cookieDomain+"/item/v1/d/m/commoninfo/"+productId+"/"+skuId+"/flag/item/initinfo",
	           type:'get',
	           dataType:'jsonp',
	           jsonpName:'initinfo',
	           success:function(datainfo){
	             if(datainfo.success && datainfo.result && datainfo.result.skuInfo){
	               var datainfo=datainfo.result.skuInfo;
	               data.skuNo=datainfo.skuNo;
	               $('#skuNos').html('商品编号：'+datainfo.skuNo);
	               $('#prdNames').html('商品名称：'+decodeURI(datainfo.displayName));
	             }else{
	               alert('获取商品信息出错!');
	             }
	           }
	          })

	          data={
	           'skuId':skuId,
	           'productId':productId,
	           'content':'',
	           'status':'1'
	          }
	          url='//ss'+cookieDomain+'/item/v1/correct/pagerror/flag/item/backcall'; 
	     }
	   




	 

	     init()
	     // 调用

	     $('.btn-submit').on('click',function(){
	       var datas = data;
	       var errorContent=$('.gtext').val();
	           datas.content=errorContent;
	           if(errorContent != "请输入具体内容，0/300" && errorContent != ""){
	             if(errorContent.length >300 ){
	               alert("输入内容不能超过300汉字!");
	             }else{
	               $.ajax({
	                        url:url,
	                        type:'get',
	                        data:datas,
	                        dataType:'jsonp',
	                        jsonpName:'backcall',
	                        success:function(data){
	                          if(data.success){
	                             $('.complete-msg').hide();
	                             $('#result-msg').show();
	                             setInterval(function(){
	                                window.opener = null;
	                                window.open('', '_self');
	                                window.close();
	                                 },500); 
	                          }else{
	                           alert('提交失败!请您重新提交')
	                          }
	                        }
	                 });
	             };
	           }else{
	             alert('请您输入具体内容')
	           }
	       
	     });

	  
	}(this);