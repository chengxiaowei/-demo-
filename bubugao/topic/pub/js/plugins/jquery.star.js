/**
 * 评论-星星插件
 * @author wugeng
 * @add 20140814
 */
define(['jquery'], function() {
    
    function star(opt) { 
        this.defaultSetting = $.extend(this, this.defaultSetting, opt || {});
        this.init();
    }
    
    star.prototype = {
        
        defaultSetting: {
            defStar: 1, //默认1星
            totalStar: 5, //总共5星
            clsPrefix: 'starts-', //容器class前缀
            clickCallBack: null, //选定后的回调
            hoverInCallBack: null, //hover in的回调
            hoverOutCallBack: null, //hove out的回调
            container: null,//容器
            initCallBack: null,//初始化后的回调
        },
        
        init: function(args) {
            var that = this, tt=that.defaultSetting, pf = tt.clsPrefix,df = tt.defStar;
            
            $(this.container).each(function(args) {
                var self = $(this);
                //初始化class
                self.addClass(pf + df).attr('score', tt.defStar);
                //绑定hover,click事件
                self.children().hover(function() {//hover
                    self.removeClass(pf + (self.attr('score') || df)).addClass(pf + $(this).attr('lv'));
                    tt.hoverInCallBack && tt.hoverInCallBack($(this).attr('lv'), self);
                }, function() {//out
                    self.removeClass(pf + $(this).attr('lv')).addClass(pf + (self.attr('score') || df));
                    tt.hoverOutCallBack && tt.hoverOutCallBack((self.attr('score') || df), self);
                }).click(function(){//click
                    self.removeClass(pf + (self.attr('score') || df));
                    var cur = $(this).attr('lv');
                    self.addClass(pf + cur);
                    self.attr('score', cur);
                    tt.clickCallBack && tt.clickCallBack(cur, self);
                });
            });
            
            tt.initCallBack && tt.initCallBack();
        },
        
        getStar: function(el) {
            return $(el).attr('score');
        }
    }
    
    return function(opt) {
        new star(opt);
    }
});