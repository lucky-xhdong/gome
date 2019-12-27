;(function($){
    var deferredFlag=true;
    //在不轮播情况下点击过快处理
    function deferredReq(cbfn){
        return function(){
            if(!cbfn || typeof cbfn!='function') return;
            var timer;
            if(deferredFlag){
                deferredFlag = false;
                clearTimeout(timer);
                timer = setTimeout(function(){
                    deferredFlag = true;
                }, 500);
                cbfn();
            }
        }
    }
    function pageAddCurClass($obj,$this) {
        $obj.removeClass('cur');
        $this.addClass('cur')
    }

    //加载图片,第一页不考虑pageCur=0
    function loadimg(settings,opt) {
        var cmsrc='data-src',$img=null;
        if(settings.pageCur){
            if(opt.isGroup){
                $img = settings.$items.eq(settings.pageCur).find("img")
            }else{
                var start=settings.pageCur * opt.stepLen,end=start+opt.stepLen;
                $img = settings.$items.find("img").slice(start,end)
            }
            $img.each(function(){
                var gmsrc = $(this).attr(cmsrc);
                if(gmsrc != undefined){
                    this.src = $(this).attr(cmsrc);
                    $(this).removeAttr(cmsrc);
                };
            });
        }

    }
    function init(el,opt){
        var $viewScroller = opt.$viewScroller || el.find('[cart-scroll-view] ul'),$items = opt.$items || el.find('[cart-scroll-view] li');
        var settings={
            el:el,
            $prevBtn:el.find('[prev-btn]'),
            $nextBtn:el.find('[next-btn]'),
            $scrollView: el.find('[cart-scroll-view]'),
            $viewScroller:$viewScroller,
            $items:$items,
            pageNum:Math.ceil( $items.length / opt.stepLen),
            currIndex:0,
            pageCur:0
        }
        if(!settings.$items.length){return}

        if(opt.callback)opt.callback(el)

        if(settings.$items.length<=opt.stepLen){
            settings.$prevBtn.hide();
            settings.$nextBtn.hide()
            return;
        }
        //分页
        if(opt.pager){
            settings.$pageBtnli = el.find('[page-btn]').find('li');
            settings.$pageBtnli.off('click').on('click',function () {
                settings.pageCur = $(this).data('page');
                pageAddCurClass(settings.$pageBtnli,$(this));
                if( settings.pageNum-1 == settings.pageCur){
                    settings.$nextBtn.hide();
                    settings.$prevBtn.show();
                }else if(settings.pageCur == 0){
                    settings.$prevBtn.hide();
                    settings.$nextBtn.show();
                }else{
                    settings.$nextBtn.show();
                    settings.$prevBtn.show();
                }
                settings.$viewScroller.stop(true, true).animate({left: -(opt.moveDistance) * (settings.pageCur)}, opt.speed,function () {
                    if(opt.isLoadImg){loadimg(settings,opt)}
                })
            })
        }
        //不轮播
        if(opt.noCarousel){
            settings.$prevBtn.hide();
            settings.$nextBtn.show();
            settings.$nextBtn.off('click').on('click', deferredReq(function(){
                settings.$prevBtn.show();
                settings.$viewScroller.stop(true, true).animate({left: -(opt.moveDistance) * (settings.pageCur + 1)}, opt.speed, function () {
                    settings.pageCur++;
                    if(opt.isLoadImg){loadimg(settings,opt)}
                    if(opt.pager){
                        pageAddCurClass(settings.$pageBtnli,settings.$pageBtnli.eq(settings.pageCur));
                    }
                    if( settings.pageNum-1 == settings.pageCur){
                        settings.$nextBtn.hide();
                    }
                })

                return false
            }));
            settings.$prevBtn.off('click').on('click', deferredReq(function(){
                settings.$nextBtn.show();
                settings.$viewScroller.stop(true, true).animate({left: -(opt.moveDistance) * (settings.pageCur - 1)}, opt.speed, function () {
                    settings.pageCur--;
                    if(opt.isLoadImg){loadimg(settings,opt)}
                    if(opt.pager){
                        pageAddCurClass(settings.$pageBtnli,settings.$pageBtnli.eq(settings.pageCur));
                    }
                    if(settings.pageCur == 0){
                        settings.$prevBtn.hide();
                    }
                })

                return false
            }))

        }else{
            settings.$prevBtn.show();
            settings.$nextBtn.show();
            
            settings.$items.remove()

            settings.$viewScroller.css({position:'absolute',top:0,width:5000})

            move('init',settings,opt);
            settings.$prevBtn.off('click').on('click', function () {
                move('prev',settings,opt);
            });
            settings.$nextBtn.off('click').on('click', function () {
                move('next',settings,opt);
            });  
        }
        
    }
    /*
    * 轮播函数,点击左右按钮轮播切换
    * type {string} [init,prev,next]
    * */
    function move(type,settings,opt){
        var $removeDoms=settings.el.find('[cart-scroll-view] li');
        if(type=="prev"){
            var tmpIndex = settings.currIndex - 1;
            for (var i = 0; i < opt.stepLen * 2; i++) {
                if (!settings.$items.eq(tmpIndex).length) {
                    tmpIndex = settings.$items.length - 1;
                }
                if (i < opt.stepLen) {
                    tmpIndex--;
                    settings.currIndex = tmpIndex + 1;
                    continue;
                } else {
                    settings.$viewScroller.prepend(settings.$items.eq(tmpIndex).clone(false));
                }
                ;
                tmpIndex--;
            }
            settings.$viewScroller.stop(true, true).css({
                left: -(opt.moveDistance)
            }).animate({left: 0}, opt.speed, function () {
                $removeDoms.remove();
            });
            if(opt.callback)opt.callback(settings.el)
        } else if (type == 'next' || type == 'init') {
            for (var i = 0; i < opt.stepLen; i++) {
                if (!settings.$items.eq(settings.currIndex).length) {
                    settings.currIndex = 0;
                }
                settings.$viewScroller.append(settings.$items.eq(settings.currIndex).clone(false));
                (settings.currIndex)++;
            }
            if (type == 'next') {
                settings.$viewScroller.stop(true, true).animate({
                    left: -(opt.moveDistance)
                }, opt.speed, function () {
                    settings.$viewScroller.css({left: 0})
                    $removeDoms.remove();
                });
            } else {
                settings.$viewScroller.css({left: 0})
                $removeDoms.remove();
            }
            if(opt.callback)opt.callback(settings.el)
        }
    }
    $.fn.gScroll = function(options) {
        return this.each(function(){
            options = $.extend({},$.fn.gScroll.defaults,options);
            init($(this),options)
        })
    };
    $.fn.gScroll.defaults = {
        $viewScroller:'',
        $items:'',
        isGroup:false, //1个li为1个单位，步长加入为6,一次滑动6个，此时group=false;1个ul为单位（6个li），步长为1，一次滑动1个，此时group=true
        isLoadImg:false, //是否懒加载图片
        pager:false, //显示分页
        noCarousel:false,  // 如果pager为true 不轮播
        moveDistance: null,
        speed: 500,   // 移动速度（毫秒）
        stepLen: 5,   // 每次滚动步长
        callback:null
    };
}(jQuery))