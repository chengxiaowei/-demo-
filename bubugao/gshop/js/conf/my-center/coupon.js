/**
 * 个人中心 - 优惠券
 * add: wugeng
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var modSlt = '.mod-coupon';
    var $ = require('jquery');
    require('module/common/common');

    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

    var clickHandles = {
        morePros: function() {
            var $this = $(this);
            var $dom = $this.prev().toggle();
            $this.toggleClass("shown");
        },
        logisDt: function () {
            var self = $(this);
            self.next().toggle();
            self.find('b').toggleClass('shown');
        }
    }
    for(var k in clickHandles){
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(modSlt).on("click",key,handle);
        }
    }

});
