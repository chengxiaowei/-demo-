define(function(require, exports, module) {
    'use strict';
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
     
    var $jProList = $('#jProList'),$body = $('body');
    var winScroll = require('mall/topic/public/plug/jquery.winScroll');
    var $imgList = $('.img-list');
    $jProList.find('a.jList').click(function(){
    	var index = $(this).index(),$imgBox = $imgList.find('.img-box:eq('+index+')');
        var opts = {
            'content':$imgBox.html(),
            'skin':'img-box',
            'divWidth':790,
            'liWidth':200,
            'callback':function(){
                var $thisImgBox = $('.win-box').find('.img-box');
                $thisImgBox.animate({'width':'790px'},"slow",function(){
                    $('.jImg').imgLoading();            
                });
            }
        }
        if(index==0){
            opts.isScroll = true;
        }
    	winScroll(opts);
    });
});