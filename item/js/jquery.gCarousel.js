;(function () {
    var Carousel = function (o, options) {
        this.o = o;//当前对象
        this.options = $.extend({}, Carousel.options, options);//插件参数
        this.ul = $(this.o).find('ul');//ul
        $(this.ul).wrap('<div class="carousel"></div>');//wrap
        this.wrap = $(".carousel");
        this.li = this.ul.children('li');//li节点
        this.liLength = this.li.length;//li节点长度
        this.liWidth = $(this.li).width();//li节点宽度
        this.liHeight = $(this.li).height();//li节点高度
        this.started = false;
        this.init();
    };
    this.currentIndex = 0;
    Carousel.prototype = {
        /**
         *初始化
         */
        init: function () {
            this.draw();
            this.createPager();
        },
        /**
         * 元素布局
         * 分纵向和横向布局
         * 纵向和横向布局以传进来的方向参数为准
         */
        draw: function () {
            var _this = this, sizeArr = [];
            var height = (this.liHeight+this.options.margin) * this.options.elementNum - this.options.margin, cloneNode;

            $(this.wrap).css({
                width: this.liWidth,
                height: height,
                position: 'relative',
                overflow: 'hidden'
            });
            $(this.ul).css({
                height: height
            });
            $(this.li).each(function (index, element) {
                var elementArgs = _this.min(sizeArr),
                    elementHeight = $(_this.li).outerHeight() + _this.options.margin,
                    elementWidth = $(_this.li).outerWidth() + _this.options.margin;
                if(index < _this.options.elementNum) {
                    sizeArr[index] = _this.liHeight + _this.options.margin;
                    $(this).css({
                        top: (_this.liHeight + _this.options.margin) * index + 'px',
                        left: 0
                    })
                }else {
                    $(this).css({
                        top: elementArgs * elementHeight + 'px',
                        left: sizeArr[elementArgs] + 'px'
                    });
                    sizeArr[elementArgs] += elementWidth;
                }
            })
        },
        /**
         *分页器
         */
        createPager: function (){
            var _this = this;
            if(this.options.pager && this.options.pager == true) {
                var pageLength, html = '';
                pageLength = Math.ceil(this.liLength / this.options.elementNum);
                html += '<div class="pager"><ol>';
                for(var i = 0; i < pageLength; i++) {
                    if (i == 0) {
                        html += '<li class="active"><a href="javascript:;">' + i + '</a></li>'
                    } else {
                        html += '<li><a href="javascript:;">' + i + '</a></li>'
                    }
                }
                html += '</ol></div>';
                if(!$(this.o).has(".pager").length && (this.liLength > this.options.elementNum)) {
                    $(this.o).append(html);
                }
                $(".pager li").hover(function () {
                    _this.started = true;
                    _this.currentIndex = $(this).index();
                    _this.play(_this.currentIndex);
                }, function () {
                    _this.started = false;
                })
            }
        },
        /**
         * 滚动函数
         */
        play: function (index) {
            var _this = this, left, page = $(".pager li");
            left = (_this.liWidth+_this.options.margin) * index;
            $(this.ul).stop().animate({
                left: -left
            }, 500);
            page.removeClass('active').eq(index).addClass('active');
        },
        /**
         * 布局需要记住所有的高度和宽度值
         */
        min: function (arr) {
            var minColumn = 0, temp, i;
            var minHeight = arr[minColumn];
            for(i = 0; i < arr.length; i++) {
                temp = arr[i];
                if(temp < minHeight) {
                    minColumn = i;
                    minHeight = temp;
                }
            }
            return minColumn;
        }
    };
    Carousel.options = {
        elementNum: 0,
        margin: 0,
        pager: false
    };
    window.Carousel = Carousel;
})(jQuery);