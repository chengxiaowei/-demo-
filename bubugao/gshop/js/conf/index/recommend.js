define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var guide = require('common/ui/guide/_guide');

    new guide();

    var Slider = require('lib/ui/slider/3.0.4/slider');

    var slider = new Slider('#slides', {
        width:640,
        height:220,
        play: {
          auto: true,
          interval: 4000,
          swap: true,
          pauseOnHover: true,
          restartDelay: 2500
        },
        callback:{
            start:function(index){
                var el = $('.jSliderImg').eq(index);
                var src = el.attr('data-url');
                sliderImgLoad(src,el);
            },
            loaded : function(){
                var el = $('.jSliderImg').eq(0);
                var src = el.attr('data-url');
                sliderImgLoad(src,el);
            }
        }
    });

    function sliderImgLoad(src,el) {
        if (isImgUrl(src)) {
            var objImg = new Image();
            objImg.src = src;
            if (objImg.complete) {
                el.attr('src',src).removeClass('img-error').removeAttr('data-url');
            } else {
                objImg.onload = function() {
                    el.attr('src',src).removeClass('img-error').removeAttr('data-url');
                };
            }
        }
    }

    function isImgUrl(str) {
        return (/^((https?|ftp|rmtp|mms):)?\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(str);
    }

    //右上角导航
    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

    var search = require('module/search/search');

    new search();

    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');

    var imageLazyLoader = null;
    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url',
          load : function(self){
            if($(self).hasClass('img-error')){
                $(self).removeClass('img-error').removeAttr('data-url');
            }
          }
        });
        return imageLazyLoader;
    }

    resetImageLoader();

    var countDown = require('common/ui/count-down/jquery.countDown');

    countDown({
            targetTime: $('.jCountTime').attr('data-endTime'),
            timeText : ['',':',':','',''],
            container : '.jCountTime',
            isShowTimeText : true,
            isShowArea : true,
            type : {
                'd' : false,
                'h' : true,
                'm' : true,
                's' : true,
                'ms' : false
            },
            callback : function() {
                //倒计时为0后回调
            }
        });

});
