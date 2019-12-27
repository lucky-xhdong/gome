(function ($) {
    function inject(prop, elem, content) {
        if (prop != 'after') prop = 'before';
        if (prop == "after") {
            content = elem.getAttribute('data-after') ? elem.getAttribute('data-after') : "";
        } else if (prop == "before") {
            content = elem.getAttribute('data-before') ? elem.getAttribute('data-before') : "";
        } else {
            content = '';
        }
        $(elem)[prop == 'before' ? 'prepend' : 'append']($(document.createElement('span')).addClass(prop).html(content));
    }
    $.pseudo = function (elem) {
        if (elem.currentStyle['before']) {
            inject('before', elem);
        } else if (elem.currentStyle['after']) {
            inject('after', elem);
        }
        elem.runtimeStyle.behavior = null;
    };
    $(".pseudo").each(function () {
        $.pseudo(this);
    })
})(jQuery);