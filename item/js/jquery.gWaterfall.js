;(function () {
    var Waterfall = function (o, options) {
        this.o = o;//当前对象
        this.options = $.extend({}, Waterfall.options, options);//插件参数
        this.ul = $(this.o).find('ul.waterfallUl');//ul
        $(this.ul).wrap('<div class="waterfall"></div>');//wrap
        this.wrap = $(".waterfall");
        this.li = this.ul.children('li');//li节点
        this.liLength = this.li.length;//li节点长度
        this.liWidth = $(this.li).outerWidth();//li节点宽度
        this.liHeight = $(this.li).outerHeight();//li节点高度
        this.currentIndex = 0;
        this.init();
    };
    Waterfall.prototype = {
        /**
         *初始化
         */
        init: function () {
            this.draw();
        },
        /**
         * 元素布局
         * 分纵向和横向布局
         * 纵向和横向布局以传进来的方向参数为准
         */
        draw: function () {
            var _this = this, sizeArr = [], width;
            width = (this.liWidth + this.options.margin) * this.options.elementNum - this.options.margin;

            $(this.wrap).css({
                width: width,
                position: 'relative',
                overflow: 'hidden'
            });
            $(this.li).each(function (index, element) {
                var elementArgs = _this.min(sizeArr),
                    elementHeight = $(this).outerHeight() + _this.options.margin,
                    elementWidth = $(this).outerWidth() + _this.options.margin;
                if (index < _this.options.elementNum) {
                    sizeArr[index] = elementHeight;
                    $(this).css({
                        top: 0,
                        left: elementWidth * index + 'px'
                    });
                } else {
                    $(this).css({
                        top: sizeArr[elementArgs] + 'px',
                        left: elementArgs * elementWidth + 'px'
                    });
                    sizeArr[elementArgs] += elementHeight;
                }
            });
            $(this.ul).css({
                height: (Math.max.apply(null, sizeArr) - this.options.margin) + 'px'
            })
        },
        min: function (arr) {
            var minColumn = 0, temp, i, minHeight = arr[minColumn];
            for (i = 0; i < arr.length; i++) {
                temp = arr[i];
                if (temp < minHeight) {
                    minColumn = i;
                    minHeight = temp;
                }
            }
            return minColumn;
        }
    };
    Waterfall.options = {
        elementNum: 0,
        margin: 0
    };
    window.Waterfall = Waterfall;
})(jQuery);