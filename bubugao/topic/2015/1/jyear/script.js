define(function(require, exports, module) {
    'use strict';
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
    var snow = require('mall/topic/public/plug/snow');
    var Dialog = require('dialog');
    var opt = { 
        itemSize : 100,//飘点个数
        hidesnowtime: 0,//消失时间
        arrSnowSrc: [ 'snow-1', 'snow-2', 'snow-3', 'snow-4', 'snow-5', 'snow-6', 'snow-7', 'snow-8', 'snow-9' ],
        showTime : 10
    }
    snow(opt);

    var $nameList = $('.jNameList'),t,speed=100;
    (function getFont(){
        var strLi = '';
        
         BBG.AJAX.jsonp({'url':BBG.phpUrl+'/Sweepstake/getLogs'},function(data){
            if(data){
                $.each(data,function(i){
                    strLi += '<li class="clearfix"><span class="f-l">'+data[i].u_name+'</span><span class="f-r"> '+data[i].prizeName+'元</span></li>'
                });
                if(data.length>15){
                    $nameList.find('ul:first').append(strLi).append(strLi);
                }else{
                    $nameList.find('ul:first').append(strLi);
                }                
                t = setInterval(scrollFont,speed);
            }

         }); 
         
    })();
    var tp = 0;
    //字体轮播  
    function scrollFont(){
        var $nameList = $('#jNameList'),$ul = $nameList.find('ul');  
        if(-tp>=parseInt($ul.height()/2)){
            tp = 0;
        }else{
            tp--;
        } 
        $ul.css('top',tp);
    }
    $nameList.hover(function(){
        clearInterval(t)
    },function(){
        t=setInterval(scrollFont,speed);
    });require('pub/plugins/login-dialog');

    var $btn = $('#jRBox'),$win = $(window),timeSpeed = 1;
    if(jd.time){
        timeSpeed = jd.time*timeSpeed;
    }
    //红包下落
    function downRedBox($obj){
        $obj.css('display','block');
        $obj.animate({'top':parseInt($win.height()-$obj.height())},'slow',function(){
            if($obj.next()){ 
                downRedBox($obj.next());
            } 
        })
    }
    function beginDownBox(){
        setTimeout(function(){
            $btn.removeClass('first').find('a').css({'display':'none','top':0});
            downRedBox($btn.find('a:first'));
        },timeSpeed*1000);
    } 

     beginDownBox();
    function showTips(bool,msg,index){
        var cont = '<div class="jd-dialog-cnt">';
            if(bool){
                 cont += '<div class="jd-tips-success">';
                 cont += '<p class="cl-red">恭喜您！</p>';
                 cont += '<p class="tips-msg-ok">获得<strong>'+msg+'元</strong>家电电子劵一张</p>';
                 cont += '<p>（此券可在云猴网电器城无门槛使用，可在“我的电子券”中查看更多详情）</p>';
                 cont += '</div>'; 
            }else{
                cont += '<p class="jd-tips-msg">'+msg+'</p>'; 
            }
            cont += '</div>';
         BBG.Dialog.pop({
            id:'jCloseTips-'+index,
            skin:'jd-dialog-box',
            width:965,
            height:450,
            content:cont,
            fixed:true, 
            cancel: function() {}
         });

        if(bool){
            setTimeout(function(){
                Dialog.list['jCloseTips-'+index] && Dialog.list['jCloseTips-'+index].remove();
            },5000);
        }else{
            setTimeout(function(){
                Dialog.list['jCloseTips-'+index] && Dialog.list['jCloseTips-'+index].remove();
            },4000);
        }
    }

    $btn.find('a').click(function(){
        var $this = $(this),index = $(this).index(),parent = $(this).parent();
        BBG.AJAX.jsonp({'url':BBG.phpUrl+'/Sweepstake'}, function(data) {
            if(data){
                $this.hide(); 
                if(!parent.hasClass('first')){
                    beginDownBox();
                }
                parent.addClass('first');
               showTips(data.is_prize,data.msg,index); 
            }
        }, function(data){
           /* /*showTips(true,'11',index);
            if(!parent.hasClass('first')){
                beginDownBox();
            }
            parent.addClass('first');
            $this.hide();*/
            if (data._error.code == 600) {
                BBG.Login.dialog(function(){
                    window.location.reload();
                });
            }else {
                BBG.Dialog.error(data._error.msg);
            }
        },$(this)); 
    });

});