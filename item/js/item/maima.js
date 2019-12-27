try {


    var prdSign = (prdInfo.shopNo.length == 0 ? 'gome' : 'coo8');




   /*神策埋码*/
   $("#addCart,#addCartLink").click(function(evt){ //加入购物车埋码
        
        window.GomeSa &&  GomeSa.track('AddCart', {
            quantity: $("#enterQty").val()*1,
            sku_id: prdInfo.sku
        });
   });



   /* $('#yuyue').click(function () {
        var s = s_gi(s_account);
        s.linkTrackVars = "products,events";
        s.linkTrackEvents = "event14";
        s.products = ";" + prdInfo.prdId + ";;;;eVar23=" + prdSign + "|eVar24=" + prdInfo.shopNo + "|eVar29=预约购";//12345为产品ID
        s.events = "event14";
        s.tl(this, "o", "buying");
    });*/
    /*$('#qianggou').click(function () {
        var s = s_gi(s_account);
        s.linkTrackVars = "products,events";
        s.linkTrackEvents = "event16";
        s.products = ";" + prdInfo.prdId + ";;;;eVar23=" + prdSign + "|eVar24=" + prdInfo.shopNo + "|eVar29=预约购";//12345为产品ID
        s.events = "event16";
        s.tl(this, "o", "buying");
    });*/
    
   
 
  

} catch (e) {
    if (console) {
        console.log(e);
    }
}




self!=top&&(top.location.href=self.location.href); 