/**
 * 登录弹窗
 *
 * @author djune update@2014.8.25
 */
define(function(require, exports, module) {
    'use strict';
    var Dialog = require('./dialog'),
        _ = require('../core/bbg');
    _ = require('./messenger');

    var URL = {
        Login: {
            minLogin: 'https://ssl.yunhou.com/login/login-min.php', // 迷你登录
            login: 'https://ssl.yunhou.com/login/login.php' // 主登录
        }
    };

    /**
     * 登录相关
     */
    BBG.Login = {
        dialog: function(sucCallback, errCallback, closeCallback) {
            BBG.Login._dialog = Dialog({
                url: URL.Login.minLogin,
                title: '云猴网欢迎您',
                skin: 'min-login-dialog',
                width: 356,
                height: 360,
                padding: 0,
                onremove: function() {
                    closeCallback && closeCallback();
                }
            }).showModal();
            BBG.CrossDomain.listen(sucCallback, errCallback);
        },
        /**
         * 登录跳转
         */
        referrer: function(url) {
            var url = url || window.location.href;
            window.location.href = URL.Login.login + '?ref=' + encodeURIComponent(url);
        }
    };

    /**
     * 跨域监听消息
     */
    BBG.CrossDomain = {
        listen: function(sucCallback, errCallback) {
            document.domain = 'yunhou.com';
            var messenger = new Messenger('parent', 'yunhou.com');
            messenger.listen(function(msg) {
                if (msg != 'success') {
                    BBG.Dialog.error(msg);
                    errCallback && errCallback();
                    return;
                } else {
                    sucCallback && sucCallback();
                    BBG.Login._dialog && BBG.Login._dialog.remove();
                }
            });
        }
    };

    return Dialog;
});
