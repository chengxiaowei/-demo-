define(function(require, exports, module) {
    'use strict';
     var $ = require('jquery');
      
    $('.nav-lf') && $('.nav-lf').find('li').click(function(){
    	$(this).addClass('on').siblings().removeClass('on');
    });

    $('#jNav li').click(function(){
    	var index = $(this).index(),url = $(this).attr('data-url');
    	$(this).addClass('on').siblings().removeClass('on');
    	$('.nav-lf').eq(index).addClass('on').siblings().removeClass('on');
    	$('.nav-lf li:eq(0)').addClass('on').siblings().removeClass('on');
    	$("body").css('background-image','url(//s1.bbgstatic.com/topic/app/img/bg-'+(index+1)+'.jpg)');
    	$('#top-iframe').attr('src',url);
    });
 
});