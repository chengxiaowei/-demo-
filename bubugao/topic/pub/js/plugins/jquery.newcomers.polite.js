/**
 * @description 新人有礼
 * @author licuiting 250602615@qq.com
 * @date 2014-12-08 09:36:13
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //
    var bbg = require('../core/bbg');
    var Dialog = require('./dialog');
    var cookie = require('./jquery.cookie');

    function NewcomersPolite(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };

    NewcomersPolite.prototype = {
        defaultSetting: {
            selector: '',
            loginCookieName: '_nick',
            gotoUrl: 'register.html', //点击'马上领取'跳转的url
            closeCookieName: '_onlyForNews',
            callBack: false //点击'马上领取'和'关闭'后执行
        },
        //初始化
        init: function() {
            var self = this;
            self.isVisible = false;
            self.createBox();
            self.event();
        },
        createBox: function() {
            var self = this;
            //
            var imgArr = [];
            imgArr.push('<div class="new-exclusive">',
                '<a class="new-exclusive-close" title="关闭,不再显示"></a>',
                '<a class="new-exclusive-get" href="javascript:;" target="_blank"></a>',
                '</div>');
            var d = Dialog({
                'id': 'jNewExclusive',
                'width': '703',
                'height': '502',
                'content': imgArr.join('')
            });
            //设置样式
            self.setStyles();
            self._$d = d;
            //self.show();
        },
        show: function() {
            var self = this;
            var isLogin = $.cookie(self.loginCookieName);
            var isClosed = $.cookie(self.closeCookieName);
            var $AddrBox = $('[aria-labelledby="title:jSelecteAddress"]');
            var isHasAddrBox = $AddrBox && $AddrBox.is(':visible');
            //show
            if (isLogin || isClosed || isHasAddrBox) {
                return;
            }
            self.isVisible = true;
            self._$d.showModal();
        },
        //设置弹框样式
        setStyles: function() {
            var self = this;
            $('[aria-labelledby="title:jNewExclusive"]')
                .find('.ui-dialog').css({
                    'box-shadow': 'none',
                    'background': 'none',
                    'border': '0px'
                }).end()
                .find('.ui-dialog-body').css({
                    'padding': '0px'
                });
        },
        event: function() {
            var self = this;
            //主框
            $('.new-exclusive').attr('tabIndex', '-1');
            //马上领取
            $('.new-exclusive-get').click(function() {
                $.cookie(self.closeCookieName, '1', {
                    expires: 365000
                });
                self._$d.remove();
                $(this).attr({
                    'href': self.gotoUrl
                });
                self.isVisible = false;
                self.callBack && self.callBack();
            });
            //关闭
            $('.new-exclusive-close').click(function() {
                $.cookie(self.closeCookieName, '1', {
                    expires: 365000
                });
                self._$d.remove();
                self.isVisible = false;
                self.callBack && self.callBack();
            });
            //
        }
    }
    return (function(opt) {
        return new NewcomersPolite(opt);
    });
});
