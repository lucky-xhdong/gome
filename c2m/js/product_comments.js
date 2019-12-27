template.helper('dateFormat', function (date, format) {
    date = new Date(date);
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});
function all(data) {
    if(data && data.totalCount) {
        $(".comment-all-em").html('('+data.totalCount+')');
    }
    if(!data || data.evaList.Evalist.length == 0) {
        $("#comment-lists-wrapper").html('<li><p>暂无商品评论！</p></li>');
        $(".c2m-product-pagenation").hide();
    }else {
        $("#comment-lists-wrapper").html(template('comment-lists-tmpl', data.evaList));
    }
}
function orderShowData(data) {
    if(data && data.count) {
        $(".comment-images-em").html('('+data.count+')');
    }
    if(!data || data.ordershow.length == 0) {
        $("#comment-images-wrapper").html('<li><p>暂无晒单评论！</p></li>');
        $(".c2m-product-pagenation").hide();
    }else {
        if($(".product-comment-label label input:radio:checked").val() == "all") {
            $("#comment-images-wrapper").html(template('comment-singleimages-tmpl', data));
        }else{
            $("#comment-images-wrapper").html(template('comment-images-tmpl', data));
            $(".c2m-product-pagenation").show();
        }
    }
}
$(document).ready(function () {
    var productId = '',pagenumber = 1;

    function getListsComments(type, productId, page) {
        var url = 'http://ss.gome.com.cn/item/v1/prdevajsonp/appraiseModuleAjax/A0003958778/1/all/flag/appraise/all?callback=all&_=1469515012438';
        $.ajax({
            type: 'get',
            url: url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "all"
        })
            .ajaxStart(function(){
                console.log("正在加载。。。")
            })
        .done(function (data) {
            all(data);
            $('#c2m-page').gPage({
                ap: data.totalpage,
                cp: pagenumber,
                np: 10,
                tg: "javascript:;",
                e: function () {
                    pagenumber = this.cp;
                    type = $(".product-comment-label label input:radio:checked").val();
                    getListsComments(type, productId, pagenumber);
                }
            });
        })
    }
    function getImagesComments(type, productId, page) {
        var url = 'http://bbs.gome.com.cn/api/api_getbaskorder.php?callback=orderShowData&productId=9133684768&skuId=1122450806&type=0&page=2&_=1469694829327';
        $.ajax({
            type: 'get',
            url: url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "orderShowData"
        })
        .done(function (data) {
            orderShowData(data);
            $('#c2m-page').gPage({
                ap: data.count,
                cp: pagenumber,
                np: 1,
                tg: "javascript:;",
                e: function () {
                    pagenumber = this.cp;
                    type = $(".product-comment-label label input:radio:checked").val();
                    getImagesComments(type, productId, pagenumber);
                }
            });
        })
    }


    /*详情/评价标签切换 start*/
    $(".left-main-nav li").click(function () {
        $(this).addClass("pseudo").siblings().removeClass("pseudo");
        var index = $(".left-main-nav li").index(this);
        $(".left-main-con > div").eq(index).show().siblings().hide();

        getListsComments('all', productId, 1);
        /*查看全部晒单 start*/
        $(".show-all-images").unbind('click').bind('click', function () {
            $(".comment-lists-wrapper").hide();
            $(".product-comment-label label").eq(0).removeClass('active')
            $(".product-comment-label label").eq(1).addClass('active').click();
            $(".product-comment-label label input:radio:checked").val('images').click();
        })
        /*查看全部晒单 end*/
    })
    /*详情/评价标签切换 end*/

    /*全部评价/有图晒单标签切换 start*/
    $(".product-comment-label label").on('click', function () {
        $(this).addClass("active").siblings().removeClass("active");
        var type = $(this).find("input:radio:checked").val();
        if(type == "all") {
            $(".comment-images-wrapper, .comment-lists-wrapper").show();
            getListsComments(type, productId, 1);
        }else {
            $(".comment-images-wrapper").show();
            $(".comment-lists-wrapper").hide();
            getImagesComments(type, productId, 1);
        }
    })
    /*全部评价/有图晒单标签切换 end*/
})



