define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
    require(['mall/topic/public/plug/jquery.let_it_snow'],function(){
        $("canvas.snow").let_it_snow({
          windPower: 0,
          speed: 1,
          count: 100,
          size: 2
        });
    });

});