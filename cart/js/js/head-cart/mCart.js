;(function(exports){
    exports.mCart={
        getMcartNum:function(cartnum){
            //aside car
            if(cartnum){
                cartnum=cartnum;
            }else{
                cartnum=0;
            }
            $("#gome-aside-cart").find(".car_num s").html(cartnum);
            $(".gome-bar-btn-cart").find(".car_num s").html(cartnum);
            $("#commerceItemQuantityId").html(cartnum);//小购物车
            if(cartnum !=0){
                $("#hdrcarttext").text("去购物车结算");   //小购物车
                $(".gome-bar-btn-cart .car_num, #gome-aside-cart .car_num").css("background","red");
                $("#gome-bar-btn-cart .caricon,#gome-aside-cart .caricon").addClass('caricon_num'); //小购物图案
                //小三角红色 car_num_0
                $(".gome-bar-btn-cart .car_num, #gome-aside-cart .car_num").removeClass("car_num_0").addClass("car_num_more");
                $(".mygome-side").addClass("havecount");//小购物车
                //$("#gome-head .shopnum").css("background","red");//小购物车
            }else{
                $(".gome-bar-btn-cart .car_num, #gome-aside-cart .car_num").css("background","#A5A5A5");
                $("#gome-bar-btn-cart .caricon,#gome-aside-cart .caricon").removeClass('caricon_num'); //小购物图案
                //小三角红色 car_num_0
                $(".gome-bar-btn-cart .car_num, #gome-aside-cart .car_num").addClass("car_num_0").removeClass("car_num_more");
                $(".mygome-side").removeClass("havecount");//小购物车
                //$("#gome-head .shopnum").css("background","#A5A5A5");//小购物车
                $("#hdrcarttext").text("购物车空了");//小购物车
                return;
            }

            //aside car
            $("#commerceItemQuantityId").html(cartnum);
            if(cartnum>0){
                $("[data-cart='mincart'],.cart").addClass("havecount");
                $("#hdrcarttext").text("去购物车结算");
            }
        },
        /**
         * if state == true
         * 请求购物车数量 首先读cookie cartnum
         * 如果 cookie 不存在 则发请求
         * @param state
         */
        lazyCart:function(state){
            var cartnum= $.cookie("cartnum") || 0;
            if(state==false){
                mCart.getMcartNum(cartnum);
            }else if($.cookie("cartnum") && $.cookie("cartnum")>0){
                exports.mCart.getMcartNum( $.cookie("cartnum"));
            } else{
                mCart.getCartNumber();
            }
        },
        getCartNumber: function(){
            $.ajax({
                type: 'get',
                url: "//cart" + cookieDomain + "/home/api/cart/getCartItemCount",
                dataType: 'jsonp',
                success:function(result){
                    mCart.lazyCartDom(result);
                }
            });
        },
        lazyCartDom: function (result) {
            if(result.success === true){
                var cookieDate = new Date();
                cookieDate.setTime(cookieDate.getTime() + (10 * 60 * 1000));
                $.cookie("cartnum", result.data,{path:'/',expires:cookieDate});
                var cartnum= $.cookie("cartnum");
                mCart.getMcartNum(cartnum);
            }else{
                return;
            }
        }
    };
    $(function init(){
        /**
         * 默认 请求ajax请求
         * 购物车屏蔽获取小购物车数量的接口，其他初始化页面需要请求小购物接口
         * 只有当  exports.mCart.lazyCart(true）发请求
         */
        if(window.$page){
            exports.mCart.lazyCart(false);
        }else{
             exports.mCart.lazyCart(true);
        }
        
    });
})(window);