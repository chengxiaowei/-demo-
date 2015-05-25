define(function(require, exports, module) {
    'use strict';
    var $ = require("jquery");
    var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
        BBG.ProModLeft($('.com-bd'),244);
        $(".up-btn img").hover(function(){
        	$(this).stop().animate({width:(parseInt($(this).width())+20)+'px'}); 
        },function(){
        	$(this).stop().animate({width:(parseInt($(this).width())-20)+'px'});
        });
       
});