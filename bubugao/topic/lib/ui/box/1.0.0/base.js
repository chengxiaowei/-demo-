/**
 * Base message box for application extends.
 *
 * @module lib/ui/box/base
 */
define(function(require, exports, module) {
    'use strict';

    var Layer = require('../../dialog/6.0.2/dialog-plus');

    var noop = function() {};

    var createLayer = function(opts) {
        if (typeof opts === 'string') {
            opts = {
                content: opts
            };
        }
        return Layer(opts);
    };

    /**
     * Basic message box.
     */
    var Box = {

        /**
         * Factory method for create a generic layer instance.
         *
         * @method create
         * @param {Object|String} opts The options for dialog creates. as the dialog
         *                        content if a string provided.
         */
        create: createLayer,

        /**
         * 默认自动关闭时间
         */
        autoTime: 2000,

        /**
         * Show waiting
         *
         * @param {String} content The message box html content.
         * @param {Function} callback The callback function when box show.
         */
        waiting: function(content, callback) {
            var d = createLayer('<p class="tips-div">' + (content || 'loading...') + '</p>');
            d.showModal();
            callback && callback();
            return d;
        },

        /**
         * alert box
         *
         * @param {String} content The message to alert
         * @param {Function} okFn The handler for the `OK` button clicked.
         */
        alert: function(content, okFn) {
            var d = createLayer({
                title: '提示',
                width: '300',
                content: '<p class="pop-tips">' + content + '</p>',
                okValue: '确定',
                ok: function() {
                    okFn && okFn();
                }
            });
            d.showModal();
            return d;
        },

        /**
         * 确认
         *
         * @param {String} content 内容
         * @param {Function} okFn 确定回调函数
         * @param {Function} cancelFn 取消回调函数
         * @param {HTMLElement} btn 按钮，只支持原生dom节点
         */
        confirm: function(content, okFn, cancelFn, btn) {
            var d = createLayer({
                'id': '_dialogConfirm',
                'type': 'question',
                'content': content,
                'align': 'top right',
                'okValue': '确定',
                'ok': function() {
                    okFn && okFn();
                },
                'cancelValue': '取消',
                'cancel': function() {
                    cancelFn && cancelFn();
                }
            })
            d.showModal(btn);
            return d;
        },

        /**
         * 错误
         *
         * @param {String} content 内容
         * @param {HTMLElement} btn 按钮，只支持原生dom节点
         * @param {int} time 自动关闭时间，单位毫秒, 默认: 2000
         */
        error: function(content, btn, time) {
            return createLayer({
                'id': '_dialogError',
                'type': 'error',
                'align': 'top',
                'content': content
            }).time(btn, time || Box.autoTime);
        },

        /**
         * 警告
         *
         * @param {String} content 内容
         * @param {HTMLElement} btn 按钮，只支持原生dom节点
         * @param {int} time 自动关闭时间，单位毫秒,默认:2000
         */
        warn: function(content, btn, time) {
            return createLayer({
                'id': '_dialogWarning',
                'type': 'warn',
                'align': 'top',
                'content': content
            }).time(btn, time || Box.autoTime);
        },

        /**
         * 正确
         *
         * @param {String} content 内容
         * @param {HTMLElement} btn 按钮，只支持原生dom节点
         * @param {int} time 自动关闭时间，单位毫秒,默认:2000
         */
        ok: function(content, btn, time) {
            return createLayer({
                'id': '_dialogOk',
                'type': 'ok',
                'align': 'top',
                'content': content
            }).time(btn, time || Box.autoTime);
        },

        /**
         * 普通提示
         *
         * @param {String} content 内容
         * @param {HTMLElement} btn 按钮，只支持原生dom节点
         * @param {int} time 自动关闭时间，单位毫秒,默认:2000
         */
        tips: function(content, btn, time) {
            return createLayer({
                'id': '_dialogTips',
                'type': 'tips',
                'align': 'top',
                'content': content
            }).time(btn, time || Box.autoTime);
        }

    };

    // Exports
    module.exports = Box;
});
