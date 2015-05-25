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
    //class
    function SlotMachine(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    SlotMachine.prototype = {
        defaultSetting: {
            selector : '',
            url : 'data.php',//获取奖品号码url
            itemWidth : '130',
            itemMarL : '18',//margin-left
            itemMarT : '18',//margin-top
            speed : 60,//滚动的速度
            num : 3, //一排放几个
            prizeWidth: 110,
            prizeHeight: 110,
            isTest:false
        },
        init:function(){
            var self = this;
            var name = $.cookie('_nick') || ''; 

            var p = {
                url : self.initUrl,
                callbackParameter: "callback",
                //data: $.extend({}, data),
                success: function (data ,textStatus) {
                    self.successFun(data,textStatus);
                    
                       
                },
                error: function (data ,textStatus) {
                    if(self.isTest)
                        self.successFun({'prizeRemaining':3},textStatus);
                    else
                        $('#jShowPrize').html("非常抱歉, 出错了！");
                },
                complete: function (data ,textStatus) {
                    
                }
            };

            self.o = $(self.selector);
            self.o.html( self.createDiv() );
            self.setWrapRange();
            self.event();

            if('' == name && !self.isTest) {
                var $jMachineStar =  $('#jMachineStar');
                $jMachineStar.attr('class','').addClass('sure-btn');
                $jMachineStar.click(function() {
                    if(!self.isTest)
                        BBG.Login.dialog(function(){
                            window.location.href = window.location.href + '?t='+ new Date().getTime();
                        });
                });
            }
            else {
                $('#jMachineStar').addClass('sure-btn-disabled');
                $.jsonp(p);
            }           
            
        },
        successFun : function(data,textStatus){
            var self = this;
            if (data && data.prizeRemaining && data.prizeRemaining > 0) {
                $('#jLeftTimes').html('' + data.prizeRemaining);
                $('#jMachineStar').unbind('click').attr('class', '').addClass('sure-btn').click( function(){
                    var that = $(this);
                    if (that.hasClass('sure-btn-stop')) {
                        that.attr('class', '').addClass('sure-btn');
                    }
                    else {
                        that.attr('class', '').addClass('sure-btn-stop');
                        self.rotation( that );
                    }
                });        
            }
            else {
                $('#jShowPrize').html("您的抽奖次数用完了！");
            } 
        },
        setWrapRange : function(){
            var itemWidth = this.itemWidth*1 + this.itemMarL*1;
            var lastW =  itemWidth * this.num;
            this.o.width( 463 ).height( 463 );
        },
        //创建中间的元素
        createMiddleItem : function(){
            var ar = [];
            ar.push('<div class="middle-box"><div class="middle-item" id="jShowPrize">',
                    '</div></div>');
            return ar.join('');
        },
        //创建元素
        createItem : function(){
            var self = this;
            var ar = [];
            ar.push(self.sortBox(), self.sortBox(true));
            return ar.join('');
        },
        //给盒子排序
        sortBox : function( flag ){
            var self = this;
            var _i = flag?((self.num-1) * 4 + 2):0;
            var ar = [];
            var start = flag?(self.num-1):0;
            var end = flag?0:(self.num-1);
            //
            for(var h=0;h<self.num;h++){
                for(var i=0;i<self.num;i++){
                    if(i == start || h == end){

                        var left = self.itemWidth*h + self.itemMarL*(h+1);
                        var top = self.itemWidth*i + self.itemMarT*(i+1);

                        flag?(_i--):(_i++);
                        var _ar = [];
                        _ar.push('<li class="slot-machine-item jItem '+ (_i==1?'selected-li':'') +'"',
                                ' style="left:'+ left +'px;top:'+ top +'px;" data-index="'+ _i +'"><span class="slot-machine-gift" style="background-position:0 -'+ (this.prizeWidth*(_i-1)) +'px;"></span></li>');
                        ar.push(_ar.join(''));
                    }
                }
            }
            if(flag){//倒排 //去掉头尾
                ar.reverse(); ar.shift(); ar.pop();
            }
            return ar.join('');
        },
        createDiv : function(){
            var ar = [
                        this.createMiddleItem(),
                        '<ul>',
                            this.createItem(),
                        '</ul>',
                        '<div class="btn-wrap"><a href="javascript:;" id="jMachineStar" class="sure-btn-disabled"></a></div>'
            ];
            return ar.join('');
        },
        ajax: function(url, data, successFun, errorFun) {
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
        //改变选中状态
        changeSelectedStatus : function( num ){
            this.o.find('.jItem').removeClass('selected-li')
                    .eq(num).addClass('selected-li');         
        },
        //旋转
        rotation : function( $btn ){
            if(!$btn.hasClass('sure-btn-stop')){
                return;
            }
            var self = this;
            var num = -1;
            self.hidePrize();
            var dh = setInterval(function(){
                if( !$btn.hasClass('sure-btn-stop')){
                    $btn.attr('disabled','disabled');
                }
                if (num == (self.num-1)*4){
                    num = -1;
                }
                num++;
                self.changeSelectedStatus( num );
                //切换点击状态
                if( !$btn.hasClass('sure-btn-stop') && num == 0 ){
                    if(self.isTest){
                         clearInterval(dh);
                        self.decreasingAnimation( $btn, dh, num, {'prize':Math.floor(Math.random()*10,0),'msg':'恭喜获得奖品！','times':1} );
                        if (!data.times || data.times < 1) {
                            $('#jMachineStar').unbind('click').attr('class', '').addClass('sure-btn-disabled').attr('disabled', 'true');
                        } 
                    }else{
                        self.ajax(self.url, {}, function( data ){
                            if ( !data.prize && data.prize !== 0 ){
                                data.prize = 1;
                            }
                            clearInterval(dh);
                            self.decreasingAnimation( $btn, dh, num, data );
                            if (!data.times || data.times < 1) {
                                $('#jMachineStar').unbind('click').attr('class', '').addClass('sure-btn-disabled').attr('disabled', 'true');
                            }
                        });
                    } 
                }
            }, self.speed);
        },
        //递减动画
        decreasingAnimation : function( $btn, dh, num, data ){
            if($btn.hasClass('sure-btn-stop')){
                return;
            }
            var i = num, self = this, total = (self.num-1)*4, _total = 1;
            function ff(){
                self.changeSelectedStatus ( i == total ? 0 : i );
                if (i == total){
                    i = -1;
                }
                if(_total<=total*1){//1圈
                    setTimeout(ff, (self.speed + 8*(_total+1)));
                }else {
                    if( i!=data.prize && !(i == -1 && total == data.prize)){
                        setTimeout(ff, (self.speed + 12*(_total+1))); 
                    }else {
                        self.showPrize( data.prize, data );
                        $btn.removeAttr('disabled');
                    }
                }
                i++;
                _total++;
            }
            setTimeout(ff, self.speed);
        },
        //隐藏奖品
        hidePrize : function(){
            $('#jShowPrize').html('');
        },
        //展示奖品
        showPrize : function( num, data ){
            var self = this;
            var ar = [];
            
            $('#jShowPrize').html(data.msg);
            $('#jLeftTimes').html(data.times);

            if (data && data.url) {
                window.location.href = data.url + '?t='+ new Date().getTime();
            }
        },
        //事件
        event : function(){
            var self = this;

        }
    }

    return function( opt ){
        new SlotMachine( opt )
    };
})
   
 

