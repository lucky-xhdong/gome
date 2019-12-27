
Page({
    data: {
    },
    
    onLoad: function () {
        var that = this

        that.init();
    },

    /**
     * @description 初事化数据<br />
     * @method init
     * @since 2017-01-20
     * @author liusuling
     */
    init: function() {
        var that = this;

        /*wx.request({
            url: 'test.php', 
            data: {
                x: '' ,
                y: ''
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res.data)
            },
            error: function(res) {

            }
        })*/


       //出事化数据加载完后让loadingInit消失
        setTimeout(function(){
           that.setData({
                loadingInit: false
            })
           that.initDeal();
        },500)

    },

    /**
     * @description 初事化数据后的处理<br />
     * @method init
     * @since 2017-01-20
     * @author liusuling
     */
    initDeal: function() {
        var that = this;
        

    }
})


