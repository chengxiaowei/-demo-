define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });
});