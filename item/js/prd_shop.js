$(function(){
         $("#j-imgload-logo").remove(); //移除
         $("#logo a").css("text-indent", "-9999px");//头部字体log
         $("#topSearch").css("left","330px");  //搜索框整栏宽
         $(".searchbox").css({"height":"30px","float":"left","border":"2px solid #e3101e"}); //搜索框+搜全站宽度
         $(".searchbox label ").css({"text-align":"left","width":"73%"}); //搜索关键字字体居左
         $("#searchInput").css("width","300px"); //设置输入框长度
         $(".search-btn").text("搜全站");
         $(".search-btn").css({"width":"91px","text-indent":"0","font-weight":"600"});//设置搜全站的样式
         $(".hotkeyword").css({"width":"503px","line-height":"20px","height":"20px"});//设置搜索词的宽度
         $(".hotkeyword a").css("margin-right","10px");
         //添加搜本店按钮
         $("#topSearchHover").append("<button style='position:absolute;top:-2px;right:-91px;width:88px;cursor:pointer;font:600 16px/30px Mircosoft YaHei;height:34px;border: 2px solid #5a5a5a;background-color: #5a5a5a;color: #fff;' onclick='searchResult();'>搜本店</button>");
         $(".gome-help-box dl dt").css("text-align","left");
         $(".infos-bd").css("text-align","left");
         $(".voice-search").css({"margin-top":"-30px","margin-right":"100px"});
     })
 /**
  * 点击头部进行本店搜索
  * @returns
  */
 function searchResult() {
     var shopNo = prdInfo.shopNo, searchUrl = '';
     var domainUrl = "//mall" + cookieDomain;
     var question = $("#searchInput").val();
     if (question == null || question == '') {
         question = $("#keyLabel").text();
     }
     if (shopNo && shopNo != '') {
         searchUrl = domainUrl + "/" + shopNo + "/" + "4-0-1-" + '0' + ".html?question=" + encodeURI(encodeURI(question));
     } else {
         searchUrl = "//pinpai" + cookieDomain + "/" + prdInfo.shopNo_zy + "/list.html?question=" + (encodeURIComponent(question));
     }
     window.open(searchUrl);
 }