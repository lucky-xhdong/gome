;(function(exports,$,prdInfo){

/**颜色、版本、合约机  切换**/

	    var changeGoods = function(){
	        var wrapdiv=$('#salesProperty .prd-properties-other');
	        var str="",
	            $this=this,
	            wrapdivLen=wrapdiv.length,
	            ColorVersion=prdInfo.ColorVersion,
	            seoStr="",  //seo加的需求
	            arr=[],   //   所有的数组
	            arr1=[],  //当前的主属性下的数组
	            arra=[];  // 匹配到点击当前a 的相关的数组
	            $this.GetQueryString =function(name){
	            /*取地址栏*/
	            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	            var r = window.location.search.substr(1).match(reg);
	                if(r!=null)return  unescape(r[2]); return "";
        		};
	            $this.jumpUrl=function(wrapdiv){
	                var txt1="",
	                    kid="";
	                wrapdiv.each(function(){
	                    if($(this).find('a').hasClass('select')){
	                        txt1+='&'+$(this).find('a.select').attr('data-alt');
	                    }else{
	                        txt1+='&';
	                    }
	                })
	                txt1=txt1.substring(1);

	                if($this.GetQueryString('kid') || $this.GetQueryString('mid') || $this.GetQueryString('stid')){
	                	var kidobj={
	                		"kid":$this.GetQueryString('kid'),
	                		"mid":$this.GetQueryString('mid'),
	                		"stid":$this.GetQueryString('stid')
	                	};
	                	for(i in kidobj){
	                		kidobj[i]?kid+=i+'='+kidobj[i]+'&':''
	                	}
	                	kid='?'+kid
	                }
	                //console.log(txt1)
	                if(ColorVersion[txt1]){
	                    //console.log(ColorVersion[txt1])
	                    location.href="/"+prdInfo.prdId+"-"+ColorVersion[txt1]+".html"+kid;
	                    return  false;
	                }
	            }
	        //str=wrapdiv.eq(0).find('a.select').text();
	        str=$('#booleanMainsale').find('a.select').attr('data-alt');    //  初始值
	        $.each(ColorVersion,function(k,v){
	            arr.push(k);
	        })

	        for( var i=1,len=wrapdivLen;i<len;i++){
	            seoStr+="&";
	        }
	        //SEO提的SB需求
	        //console.log(seoStr)

	        wrapdiv.eq(0).find('a').each(function(){
	            var str=$(this).attr('data-alt');
	            $(this).loadsrc('gome-src');
	            if(ColorVersion[str+seoStr]){
	                $(this).attr('href','/'+prdInfo.prdId+'-'+ColorVersion[str+seoStr]+'.html')
	            }
	        })

	        


	        //console.log(arr)
	        var onecur=str;
	        var regExpStr=new RegExp('^'+onecur+'&');

	        $.each(arr,function(k,v){

	            if(regExpStr.test(v)){
	                arr1.push(v)
	            }

	        })
	        //console.log(arr1)



	        wrapdiv.each(function(k,v){
	            var arrs=[],
	                _thisall=$(this);

	            $(this).find('.prdLeft').each(function(){     //后台不给返回“版　　本”这种格式，只能自己搞；
	                var txt=$(this).text();
	                var txt2="";
	                if(txt.length==2){
	                    txt2=txt.substring(0,1)+'　　'+txt.substring(1)
	                    $(this).html(txt2)
	                }
	            })

	            $.each(arr1,function(j,n){
	                arrs.push(n.split('&')[k])
	            })

	            $.each(arrs,function(a,s){
	                _thisall.find('a').each(function(){
	                    $(this).loadsrc('gome-src');
	                    if($(this).attr('data-alt')==s){
	                        //$(this).parent().removeClass('noVersion');
	                        $(this).addClass('clicks');
	                        $(this).removeClass('novison');
	                    }
	                    if($(this).hasClass('select'))$(this).removeClass('clicks');   //带select的不能点击
	                    if($(this).hasClass('novison'))$(this).removeClass('clicks');;
	                })
	            })
	            //点击事件
	            $(this).on('click','a.clicks',function(){
	                //i.preventDefault();
	                var txt2=$(this).attr('data-alt'),
	                    curindex=$(this).parent().parent().parent().index(),
	                    txt1="";
	                $("#btnLink a").addClass("disabled");
	                /*苦逼。。。。销售属性,日了狗了*/
	                //console.log(newarr)

	                $(this).addClass('select').parent().siblings().find('a').removeClass('select');
	                wrapdiv.each(function(m){
	                    if(m!=0){
	                        $(this).find('a').each(function(){
	                            if(!$(this).hasClass('novison')){
	                                $(this).addClass('clicks');
	                            }
	                        })
	                    }
	                })


	              
	    
	                    var curT=$this.jumpUrl(wrapdiv); //跳转
	                               if(curT==false){
	                                   return  false;
	                               }
	                    arra=[];

	                    $(this).parent().parent().parent().siblings('.nozhu').find('a').removeClass('select');


	                    //console.log(arr1)
	                    $.each(arr1,function(k,v){
	                        var arrd=v.split('&');
	                        $.each(arrd,function(a,s){
	                            //console.log(a)
	                            if(a==curindex && s==txt2){
	                                arra.push(v)
	                            }
	                        })
	                    })

	                    //console.log(arra)
	                    //console.log(curindex)
	                    wrapdiv.each(function(z,x){
	                        var arras=[],
	                            _this=$(this);
	                        $.each(arra,function(h,v){

	                            arras.push(v.split('&')[z])
	                        })
	                        //console.log(arras)
	                        if(z!=0 && z!=curindex){
	                            wrapdiv.eq(z).addClass('chooseVersion').find('a').addClass('novison')//.removeClass('select').removeClass('clicks');
	                            $.each(arras,function(a,s){


	                                _this.find('a').each(function(){
	                                    //$(this).loadsrc('gome-src');
	                                    if($(this).attr('data-alt')==s){
	                                        //console.log($(this).text())
	                                        $(this).removeClass('novison');
	                                        $(this).addClass('seclass')
	                                        //$(this).addClass('clicks');
	                                    }
	                                    if(wrapdiv.eq(z).hasClass('chooseVersion')){
	                                        $(this).removeClass('clicks');
	                                    }
	                                })



	                            })
	                        }

	                    })

	                

	                
	               var curT=$this.jumpUrl(wrapdiv); //跳转
	                   if(curT==false){
	                          return  false;
	                    }

	                var curlens=0;  // 产品又提的小需求
	                wrapdiv.each(function(){
	                    var curlens= $(this).find('.prdRight a').length;
	                    if($(this).find('.prdRight a.novison').length==curlens){
	                        $(this).removeClass('chooseVersion');
	                    }
	                })

	            })
	        })

	        $('#booleanMainsale').on('click','a',function(i){    //点击主属性
	            //i.preventdefault();
	            if($(this).hasClass('select')){

	                return false;
	            }
	            str=$(this).attr('data-alt');                             //取点击完主属性的值
	            arr1.length=0;                            //清空一下arr1
	            

	            $(this).addClass('select').parent().siblings().find('a').removeClass('select');

	           var curT=$this.jumpUrl(wrapdiv); //跳转
	                      if(curT==false){

	                          return  false;
	                      }
	            
	            $("#btnLink a").addClass("disabled");
	            
	            
	            $(this).parent().parent().parent().siblings().removeClass('chooseVersion').find('a').removeClass('select');
	           
	            var onecur=str;
	            var regExpStr=new RegExp('^'+onecur+'&');
	            //  console.log(onecur)
	            $.each(arr,function(k,v){
	                if(regExpStr.test(v)){
	                    arr1.push(v)
	                }
	            })                                  //匹配主属性下的所有数组
	            //console.log(arr1)
	            wrapdiv.each(function(a,c){
	                if(a!=0){
	                    $(this).find('a').addClass('novison').removeClass('select');
	                }
	            })
	            wrapdiv.each(function(k,v){
	                var arrs=[],
	                    _thisall=$(this);
	                $.each(arr1,function(j,n){
	                    arrs.push(n.split('&')[k])
	                })

	                $.each(arrs,function(a,s){
	                    _thisall.find('a').each(function(){
	                        //$(this).loadsrc('gome-src');
	                        if($(this).attr('data-alt')==s){
	                            //$(this).parent().removeClass('noVersion');
	                            $(this).addClass('clicks');
	                            $(this).removeClass('novison');
	                        }
	                        if($(this).hasClass('select'))$(this).removeClass('clicks');   //带select的不能点击
	                        if($(this).hasClass('novison'))$(this).removeClass('clicks');;
	                    })
	                })
	            })


	        })


	        $('#salesProperty').on('click','div.chooseVersion a.seclass',function(){  //点击  选择的属性
	            //i.preventdefault();
	            var txt2=$(this).attr('data-alt'),
	                curindex=$(this).parent().parent().parent().index(),
	                secarr=[];

	            $('#salesProperty').find('li.chooseVersion').find('a').each(function(){
	                if(!$(this).hasClass('select')){
	                    $(this).addClass('novison').removeClass('seclass');
	                }
	            })
	            $(this).addClass('select').parent().siblings().find('a').removeClass('select');
	           
	            $.each(arra,function(k,v){
	                var arrd=v.split('&');
	                $.each(arrd,function(a,s){
	                    //console.log(a)
	                    if(a==curindex && s==txt2){
	                        secarr.push(v)
	                    }
	                })

	            })
	            arra=secarr;
	            //console.log(secarr)
	            $.each(secarr,function(k,v){
	                var sp=v.split('&');
	                $.each(sp,function(s,q){
	                    var txt=wrapdiv.eq(s).find('a.select').attr('data-alt');

	                    //console.log(q)
	                    //console.log(k)
	                    wrapdiv.eq(s).find('a').each(function(){
	                        //console.log($(this).text())
	                        if($(this).attr('data-alt')==q){

	                            $(this).removeClass('novison').addClass('seclass');
	                        }
	                    })

	                })
	            })
	            //console.log(arr1)
	            $this.jumpUrl(wrapdiv); //跳转
	        })
	        $('#booleanMainsale').find('a').removeClass('novison');
	    }

	    changeGoods();

	    })(window,$,prdInfo);