(function ($) {
    var Suits = function (o, options) {
        this.o = o;
        this.options = $.extend({}, Suits.options, options);
        this.dropdown = $(this.o).find(this.options.dropdown);
        this.init();
    };
    Suits.prototype = {
        init: function () {
            var _this = this, flag = true;
            $(this.dropdown).css({
                left: 0,
                top: $(this.o).offset().top - ($(this.o).parent().offset().top - $(this.o).outerHeight())
            });
            //点击单个套装系列显示对应下拉菜单
            $(this.o).off('click').on('click', function (e) {
                e.stopPropagation();
                //select状态是选中状态，open是下拉框打开状态
                //之所以添加两个class是因为点击当前标签给当前标签添加选中状态(select)，同时还要收起下拉框，所以要去掉下拉框的open状态
                $(this).addClass('select').siblings().removeClass('select open');
                if($(this).hasClass('different')) {
                    $(this).addClass('open').siblings().removeClass('select open');
                }
                _this.position();
                if (flag == true) {
                    _this.getAllSuits();
                    flag = false;
                }
            });
            //空白处点击隐藏下拉菜单并去除套装打开状态class名称
            $(document).on('click', function () {
                if($(_this.o).add('different').hasClass('select open')) {
                    $(_this.o).removeClass('select open')
                }
            });
        },
        //图片滑动
        slide: function () {
            var _this = this,
                suitUl = $(this.dropdown).find('ul'),
                suitLi = $(this.dropdown).find('li'),
                html = '',
                width = suitLi.length * suitLi.outerWidth(),
                height = suitLi.height();
            var showElements = parseInt($(this.dropdown).find(".suits-wrapper").outerWidth() / suitLi.outerWidth()); //记录需要显示的子元素的数量
            suitUl.css({
                width: width + 'px',
                height: height + 'px'
            });
            html += '<div class="suits-control"><a href="javascript:;" class="btn-prev"><</a><a href="javascript:;" class="btn-next">></a></div>';
            //当商品>3个的时候展示左右箭头，执行滑动效果
            if (suitLi.length > showElements) {
                var index = 0;
                if (!$(this.dropdown).find(".suits-control").length) {
                    $(this.dropdown).find(".suits-wrapper").append(html);
                }
                var page = (Math.ceil(suitLi.length / showElements));//用来记录可以滑动的页数
                var flag = false;//加这个标识位，是为了防止有些神经病有事儿没事儿拿着左右箭头瞎点
                $(this.dropdown).find(".btn-next").on('click', function () {
                    if(flag == true) return;//这里指当这个标志flag为真的时候，直接返回，不执行当前的这个动画。
                    flag = true;//这里是在执行这个动画的最开始的时候把标志flag设置为真，在这个动画没执行完之前这个值一直为真，当下次运行这个函数的时候，由于flag值为真，也不会执行。必须等到这个函数执行完之后才会再次执行这个动画。
                    index++;
                    $(_this.dropdown).find(".btn-prev").css({"visibility": "visible"});
                    if (!(suitUl.is(":animated"))) {
                        //滑动的left值是li元素的宽度*显示出来的个数*index
                        suitUl.stop(true,false).animate({left: -((suitLi.outerWidth() * showElements) *　index)}, 500, function(){
                            $(_this.dropdown).find(".suits-wrapper").loadsrc('gome-src');
                            //当滑动到最后一页的时候隐藏右箭头
                            //因为index从0开始，点右箭头的时候才开始加，即使加到最后一页也会比page小，所以使用page-1做比较
                            if(index == page - 1) {
                                $(".btn-next").css({"visibility": "hidden"});
                                return false;
                            }
                            flag = false;
                        });
                    }
                });
                $(this.dropdown).find(".btn-prev").on('click', function () {
                    if(flag == false) return;
                    flag = false;
                    index--;
                    $(_this.dropdown).find(".btn-next").css({"visibility": "visible"});
                    if (!(suitUl.is(":animated"))) {
                        //滑动的left值是li元素的宽度*显示出来的个数*index
                        suitUl.stop(true,false).animate({left:-((suitLi.outerWidth() * showElements) *　index)}, 500, function(){
                            //当滑动到第一页的时候隐藏左箭头
                            if(index == 0) {
                                $(".btn-prev").css({"visibility": "hidden"});
                                return false;
                            }
                            flag = true;
                        });
                    }
                });
            }
        },
        //定位
        position: function () {
            var parentLeft = $(this.o).parent().offset().left,//父级对象left值
                dropDownWidth = $(this.dropdown).width(),//下拉框宽度
                currentLeft = $(this.o).offset().left,//当前对象left值
                currentWidth = $(this.o).outerWidth();//当前对象left值

            //当套装的商品到最右边的时候下拉框靠右对齐
            if (((currentLeft + currentWidth) - parentLeft) >= dropDownWidth) {
                $(this.dropdown).css({
                    right: 0,
                    left: ""
                });
            } else {
                $(this.dropdown).css({
                    right: "",
                    left: 0
                });
            }
        },
        //取数据
        getAllSuits: function () {
            var _this = this,
                sSku = $(this.o).find('.prd-suit').data('skuid'),//套装skuid
                sUrl = $(this.o).find('.prd-suit').data('url'),//套装原跳转url，即购买系列链接,
                sFlag = $(this.o).find('.prd-suit').data('flag'),//不同套装商品标识
                area = g.cityCode(2),//二级区域code
                suitTmpl = {
                    html: '\
                       {{if result && result.suitList && result.suitList.length > 0}}\
                            <div class="suits-wrapper">\
                                <div class="suits-list">\
                                    <ul>\
                                        {{each result.suitList as suit index}}\
                                        <li>\
                                            <span class="icon-plus"><i>+</i></span>\
                                            <a href="{{suit.url}}" target="_blank" class="img-suit-thumb"><img gome-src="{{suit.imgUrl}}" alt="{{suit.displayName}}"></a>\
                                            <a href="{{suit.url}}" target="_blank" class="txt-suit" title="{{suit.displayName}}">{{suit.displayName}}</a>\
                                        </li>\
                                        {{/each}}\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="suits-toolbar">\
                                <span class="suits-price" data-before="套装价："><em>¥</em>{{result.price}}</span>\
                                <a href="javascript:;" class="btn-suits-buy">购买套装</a>\
                            </div>\
                        {{/if}}\
                    '
                };

            $.ajax({
                url: '//ss' + cookieDomain + '/item/v1/d/extends/suit/' + sSku + '/' + area + '/flag/item/suit',
                dataType: 'jsonp',
                type: 'get',
                jsonp: 'callback',
                jsonpCallback: 'suit'
            }).done(function (data) {
                if (!(data && data.success)) {
                    return false;
                }
                if (data && data.result) {
                    $(_this.dropdown).append(templateSimple.compile(suitTmpl.html)(data));
                    _this.slide();
                    var tlscroll = 3;
                    for (var i = 0, k = tlscroll; i < k; i++) {
                        $(_this.dropdown).find('li').eq(i).loadsrc('gome-src');
                    }
                    if(sFlag && sFlag == true) {
                        $(_this.dropdown).find(".btn-suits-buy").html('加入购物车');
                        if(prdInfo.hasGoods == 'N' || prdInfo.prdType == 2) {
                            $(_this.dropdown).find(".btn-suits-buy").addClass("disabled");
                        }else {
                            $(_this.dropdown).find(".btn-suits-buy").off('click').on('click', function () {
                                prdMainNew.addCart();
                            })
                        }
                    }else {
                        $(_this.dropdown).find(".btn-suits-buy").attr("href", sUrl);
                    }
                }
            }).fail(function () {
                console.log('请求错误！')
            })
        }
    };
    $.fn.Suits = function (options) {
        options = $.extend({}, $.fn.Suits.options, options);
        this.each(function () {
            new Suits($(this), options);
        })
    };
    Suits.options = {
        dropdown: '.g-suits-dropdown'
    }
})(jQuery);
$(".prdTaoGou").Suits();