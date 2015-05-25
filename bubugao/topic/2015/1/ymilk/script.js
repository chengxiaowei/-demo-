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
    var opt = {
           itemSize : 400,//飘点个数
           hidesnowtime: 0,//消失时间
           arrSnowSrc: ['snow-1','snow-2','snow-3','snow-4'],
           showTime : 1
        }
    snow(opt);
});