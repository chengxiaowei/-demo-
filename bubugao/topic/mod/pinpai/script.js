define(function(require, exports, module) {
    'use strict';
      
    var $ = require('jquery');

    // 品牌专区1 js代码
    var aLi = $('.brand .bd-box li');
    var aImg = $('.brand .bd-box li img');
    var aSpan = $('.brand .bd-box li span');
    aLi.each(function(index) {
        $(this).mouseover(function() {
            aSpan.eq(index).stop();
            aImg.eq(index).stop();
            aImg.eq(index).css({
                zIndex: 1
            }).animate({
                top: 37,
                height: 0
            }, 80, '', function() {
                $(this).hide();
                aSpan.eq(index).show().css({
                    zIndex: 2
                }).animate({
                    top: 0,
                    height: 75
                }, 80)
            })
        })
        $(this).mouseout(function() {
            aSpan.eq(index).stop();
            aImg.eq(index).stop();
            aSpan.eq(index).css({
                zIndex: 1
            }).animate({
                top: 37,
                height: 0
            }, 80, '', function() {
                $(this).hide();
                aImg.eq(index).show().css({
                    zIndex: 2
                }).animate({
                    top: 0,
                    height: 75
                }, 80)
            })
        })
    })
 });