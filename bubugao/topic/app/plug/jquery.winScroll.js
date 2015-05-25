/**
* @description 弹窗滚动
* @author 河马
* @create 2014-10-27 16:27:05
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var imgScroll = require('pub/plugins/jquery.img-scroll');

    function winScroll(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };

    winScroll.prototype = {
        defaultSetting: {
            content: '', //选择器
            width:990,
            height:364,
            liShowNum:4,
            skin:'',
            selClass:'jList',
            divWidth : '',
            isScroll:false,
            showTime:3,
            callback:function(){}
        },
        init: function() {
            var self = this;
            self.createDiv();
            self.event();
        },
        //设置
        createDiv: function() {
            var self = this,$body = $('body'),$div = $('<div class="win-box"></div>');
            $div.css({"position":"fixed","top":"50%","left":"50%","width":self.width,"height":self.height,"margin-left":-(self.width/2)+'px',"margin-top":-(self.height/2)+'px','z-index':'999'});
            if($body.find('.win-box').length>0)
                $('.win-box').remove();
            if(self.isScroll){
                $div.append('<div class="win-hd"><a href="javascript:;" title="上一组" class="prev-btn hid win-btn">上一组</a><a href="javascript:;" title="下一组" class="next-btn hid win-btn">下一组</a></div>');
                self.prevBtn = $div.find('.prev-btn');
                self.nextBtn = $div.find('.next-btn');
            }
            if(self.content!=''){
                if(self.skin!=""){
                    $div.append('<div class="'+self.skin+'">'+self.content+'</div>');
                }else{
                    $div.append(self.content);
                }
                if($body.find('.win-box').length>0){
                    $('.win-box').html($div.html()).show();
                }else{ 
                    $body.append($div);
                }
                self.obj = $div;
                self.callback && self.callback();
                
            }
        },
        scrollImg : function(){
            var self = this,$div = self.obj.find('.img-list-box'),$ul = $div.find('ul');
            self.obj.attr('id','jLiScroll');
            $div.addClass('jContent');
            $ul.addClass('jLiPannel'); 
            imgScroll({
                selector : '#jLiScroll',
                left : '.prev-btn',
                right : '.next-btn',
                wrap : self.skin,
                content : '.jContent',
                item : '.jLiPannel',
                beforeScrollLeft : function( _this ){
                    _this.find('.jImg').imgLoading();
                },
                beforeScrollRight : function( _this ){
                    _this.find('.jImg').imgLoading();
                }, 
                isScroll:true
            });
        },
        event: function() {
            var self = this;
            $(document).on('click', function(e) {
                var $this = $(e.target); 
                if($this.closest('.win-box').length == 0 && self.obj.is(':visible') && !$this.hasClass(self.selClass)) {
                     self.obj.find('.img-box').animate({'width':'0'},function(){
                        self.obj.remove();
                     });

                }
                if(self.isScroll){
                    self.obj.find('ul').hover(function(){
                    self.obj.find('.win-btn').show();
                    })
                    self.obj.hover(function(){},function(){
                        $(this).find('.win-btn').hide();
                    });
                }
            });
            if(self.isScroll){
                self.scrollImg();
            }
            
        }
    }
 
    return function( opt ){
        new winScroll(opt);
    };
})