/**
* @description 老虎机
* @author licuiting 250602615@qq.com
* @last modified by wugeng
* @create 2014-10-27 16:27:05
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var _jsonp = require('app/plug/jquery.jsonp');
    require('pub/plugins/login-dialog');
    
    function SmashingEggs(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    //
    SmashingEggs.prototype = {
        defaultSetting: {
            selector: '', //选择器
            chanceSelector:'',//获得机会的选择器
            setChanceUrl : 'http://localhost:8002/js/plug/smashing-eggs/getChange.php',//获得机会的url
            url: 'http://localhost:8002/js/plug/smashing-eggs/data.php', //请求
            imgSrc : 'http://static5.bubugao.com/mall/topic/public/img/eggs/flower-bg.png',//图片src
            eggsNum : '3',//金蛋的数量
            isTest : false
        },
        init: function() {
            var self = this;
            self.o = $(self.selector);
            self.o.html(self.createDiv());
            self.setWrapWidth();
            self.event();
            self.setChance();
            //
        },
        //设置
        createDiv: function() {
            var ar = [];
            ar.push('<div class="smashing-eggs jSmashingEggs">',
                        '<ul class="eggList">',
                            '<p class="hammer jHammer">锤子</p>',
                            this.createTips());
            for(var i=0;i<this.eggsNum;i++){
                ar.push(    '<li class="jLi">','<sup></sup>','</li>');
            }
            ar.push(        '</ul>',
                        '<div class="tips-text jTipsText">您还有<span class="num"></span>次机会</div>',
                    '</div>');
            return ar.join('');
        },
        //生成气泡框
        createTips : function(){
            var ar = [];
            ar.push('<div class="arrow-content jResultTip">',
                        '<div class="arrow-b">',
                            '<div></div>',
                        '</div>',
                        '<b class="jResult b-txt"></b>',
                        '<p class="arrow-btn"><button class="bt-success" id="jTryAgain">再试一次</button></p>',
                    '</div>');
            return ar.join('');
        },
        //改变还有多少机会
        setChance : function( num, callback ){
            var self = this;
            if(num!=undefined){
                $(self.chanceSelector).html( num );
                if(num==0)
                    self.resetEggs();

            }else{
                var count = 0;
                self.ajax(self.setChanceUrl, {}, function(data){
                    if(data){  
                        $(self.chanceSelector).html(data.count);
                    } 
                });
                $(self.chanceSelector).html( count );
                /*self.ajax(self.setChanceUrl, {}, function(data){
                    if (data._error.code == 600) {
                        BBG.Login.dialog(function(){
                            window.location.reload();
                        });
                    }else {
                        BBG.Dialog.error(data._error.msg);
                    }
                    callback && callback();
                }); */
            }
        },
        //显示锤子
        showHammer : function( $egg ){
            var $hammer = this.o.find('.jHammer');
            var pos = $egg.position().left + $egg.width() - 105;
            if($egg.hasClass('curr')){ 
                $hammer.hide();
                return;
            }
            $hammer.show().css({ 'left' : pos ,'top' : $egg.position().top - 25 });
        },
        //展示信息
        showMsg : function( $egg ,data ){
            var self = this;
            self.o.find('.jResultTip').css({ 
                display: 'block', 
                top: '50px', 
                left: $egg.position().left + 85,
                opacity: 0
            })
            .find('.jResult').html('').end()//清空提示信息
            .animate({ top: '20px', opacity: 1 }, 200,
            function() {
                self.o.find('.jResult').html(data.msg);
                var $btn = self.o.find('#jTryAgain');
                if(data.times!=0 && !data.url && data.status){
                    $btn.show();
                }else{
                    $btn.hide();
                }
                //判断是否有url,有就直接跳转
                setTimeout(function(){
                    if(data.url && data.url!=null && data.url!='' ){
                        location.href = data.url;
                    }
                },3000)
                //删除正在加载的标示;
                //self.o.removeAttr('data-is-loading');
            });
        },
        //砸蛋
        openEgg: function( $egg, data ){
            //不允许砸多次;
            if($egg.hasClass('curr') ){ return; }
            var self = this;
            var $ePosition = $egg.position();
            var _top = $ePosition.top;
            var _left = $ePosition.left;
            self.o.find(".jHammer")
                .css({ "top": _top - 85, "left": _left + $egg.width() + 30 })//砸的动作
                    .animate({ "top": _top - 10, "left": _left + 140 }, 50, 
                        function(){
                            self.o.find(".jHammer").hide();
                           if(!data.status){
                                self.showMsg( $egg, data );
                                return;
                            }
                            $egg.addClass("curr");
                            //蛋碎样式
                            self.openFlower( $egg );
                            /* 与gif动画的时间差 */
                            setTimeout(function(){
                                self.showMsg( $egg, data );
                            },500)
                            self.setChance( data.times==null?0 : data.times );
                        });
        },
        //判断图片是否加载完毕
        isImgLoaded : function( src, successFun, errorFun ){
            var $img = new Image();
                $img.src = src;
                if ($img.complete) {
                    successFun && successFun($img);
                } else {
                    $img.onload = function() {
                        successFun && successFun($img);
                    };
                }
                $img.onerror = function() {
                    errorFun && errorFun($img);
                };
        },
        //炸花效果;
        openFlower : function( $egg ){
            var num = 0;
            var pos = 217;
            this.isImgLoaded( this.imgSrc, function(){
                var dh = setInterval(function(){
                    num++;
                        $egg.find("sup").css({
                            'background-position-y' : '-'+ (num*pos) +'px'
                        },500).show();           
                    if (num == 28){
                        clearInterval(dh);
                    }
                }, 30);
            },function(){

            })
        },
        //重置wrap的宽度;
        setWrapWidth : function(){
            var $li = this.o.find('.jLi');
            var _mar_l = $li.css('margin-left');  
            var _w = $li.width();
            var _last_w = (_w + parseFloat(_mar_l)) * this.eggsNum + parseFloat(_mar_l);
            this.o.find('.jSmashingEggs').width( _last_w );
        },
        ajax: function(url, data, successFun, errorFun) {
            /**/
            var p = {
                url : url,
                callbackParameter: "callback",
                data:$.extend({}, data),
                success: function (data ,textStatus) {
                    successFun && successFun(data);
                },
                error: function (data ,textStatus) {
                    if(errorFun){
                        errorFun(data);
                    }else{
                        //alert('网络错误!');
                    }
                },
                complete: function (data ,textStatus) {
                    
                }
            };
            $.jsonp(p);
        },
        //重置砸蛋状态
        resetEggs : function(){
            this.o.removeAttr('data-is-loading').find('.curr').removeClass('curr')
                .end().find('.jResultTip').hide();
        },
        event: function() {
            var self = this;
            //砸
            self.o.on('click', '.eggList li', function() {
                var $this = $(this);
                //第一次砸蛋没返回值时,不允许砸第二个;
                if(self.o.attr('data-is-loading')||$this.hasClass('curr')){
                    return;
                }   
                self.o.attr('data-is-loading', '1');
                //
                if(self.isTest){
                    self.openEgg( $this, {'status':true,'times':3,'msg':'恭喜获得奖品！'} );
                }else{
                    self.ajax(self.url, {},function(data){
                        if(data){
                            if(data.count>0){
                                self.openEgg( $this, {'status':true,'times':data.count,'msg':data.msg} );
                            }else if(data.count==0){
                                 self.openEgg( $this, {'status':true,'times':data.count,'msg':data.msg} );
                            }else if (data._error.code == 600) {
                                BBG.Login.dialog(function(){
                                    window.location.reload();
                                });
                            }else {
                                BBG.Dialog.error(data._error.msg);
                            }
                            
                            //callback && callback();
                        }                        
                    }, function( data ){
                        if (data._error.code == 600) {
                            BBG.Login.dialog(function(){
                                window.location.reload();
                            });
                        }else {
                            BBG.Dialog.error(data._error.msg);
                        }
                       // callback && callback();
                    });
                     
                }
            })
            //show hammer
            .on('mouseenter', '.eggList li', function() {
                if(!self.o.attr('data-is-loading')){
                    self.showHammer( $(this) );
                }
            })
            //hide tips box
            .on('mouseleave', '.jSmashingEggs', function(argument) {
                //self.o.find('.jResultTip').hide();
            })
            //try again
            .on('click', '#jTryAgain', function(){
                self.resetEggs();
            })
        }
    }
 
    return function( opt ){
        new SmashingEggs(opt);
    };
})