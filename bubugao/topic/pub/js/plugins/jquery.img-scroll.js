/**
* @description 图片滚动
* @author licuiting 250602615@qq.com
* @date 2014-11-07 15:59:12
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    //class
    function ImgScroll(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };

    ImgScroll.prototype = {
        defaultSetting: {
            selector : '',//最外层选择器(选择器/jquery对象)
            left:'',//left按钮
            right : '',//right按钮
            wrap : '',//外层content
            content : '',//里面content
            item : '',//元素的content
            loaded : function(){},//加载完毕后执行的函数
            //滚动之前执行
            beforeScrollLeft : function(){},
            beforeScrollRight : function(){},
            //滚动之后执行
            afterScrollLeft : function(){},
            afterScrollRight : function(){}
        },
        init : function(){
            var self = this;
            var sstor = self.selector;
                self.o = (typeof sstor).toLowerCase()=='string'?$(sstor):sstor;
                //少于2不移动;
                if(self.isHasOneBox()){ return; }
                //
                self.num = 0;//当前显示元素的索引
                self.addFirstToLast();
                self.setBaseStyle();
                self.event();
                self.loaded();
        },
        //设置基本样式
        setBaseStyle : function(){
            var self = this;
            var $item = self.o.find(self.item);
            var $content = self.o.find(self.content);
                self.range = $item.width();
                //wrap样式
                self.o.find(self.wrap).css({
                    'overflow' : 'hidden',
                    'position' : 'relative'
                })
                //内容样式
                $content.css({
                    'overflow' : 'hidden',
                    'position' : 'absolute',
                    'left' : '0px',
                    'width' : $item.length*$item.width()+'px'
                })
        },
        //把第一个元素添加到最后一个位置
        addFirstToLast : function(){
            var self = this;
            var $content = self.o.find(self.content);
            var $item = self.o.find(self.item);
                $item.eq(0).clone(true).addClass('jLastImg').appendTo($content);
        },
        event : function(){
            var self = this;
            //左
            self.o.on('click', self.left, function(){
                self.move('-');
            })  
            //右
            .on('click', self.right, function(){
                self.move('+');
            })
        },
        //是否只有一个元素
        isHasOneBox : function(){
            return this.o.find(this.item).length <= 1;
        },
        //移动
        move : function( flag ){
            var self = this;
            var $content = self.o.find(self.content);
            var $width = $content.width();
                //
                $content.stop(true, true); 
                //左
                if(flag == '+'){
                    if($content.position().left > -($width-self.range)){
                        self.moveAnimation('-');
                    }else{
                        self.moveAnimation('-', '0');
                    }
                }else{
                    //右
                    if($content.position().left < 0){
                        self.moveAnimation('+');
                    }else{
                        self.moveAnimation('+', -($width-self.range));
                    }
                }
        },
        //获取当前滚动对象的索引
        getScrollIndex : function( flag ){
            var self = this;
            var $content = self.o.find(self.content);
            var $item = self.o.find(self.item);
            var _left = $content.position().left;
            var $left = 0;
            if(flag=='-'){
                $left = _left-self.range;
            }else{
                $left = _left+self.range;
            }
            return Math.abs($left/$item.width())
        },
        //移动动画
        moveAnimation : function( flag, left ){
            var self = this;
            var $content = self.o.find(self.content);
            var $item = self.o.find(self.item);
            var txt = (flag=='-'?'Right':'Left');
            var _this = '';
            if(left){
                $content.css('left', left+'px');
            }
            //获取滚动的当前对象;
            _this = $item.eq(self.getScrollIndex( flag ));
            self['beforeScroll' + txt]( _this );
            //
            $content.animate({
                left: flag + '=' + self.range +'px'
            }, 300, function(){
                //_this = $item.eq(self.getScrollIndex( flag ));
                self['afterScroll' + txt]( _this );
            });
        }
    }
    return function( opt ){
        new ImgScroll( opt );
    }
});