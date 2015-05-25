/**
 * Http request utility interface, ajax(), post(), get(), jsonp().
 *
 * @module core/io/request
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var noop = $.noop;
    var trim = $.trim;
    var extend = $.extend;

    var CLASS_DISABLED = 'disabled';

    /**
     * A simple jQuery ajax abstract for application extends.
     * For more details info please see <http://api.jquery.com/jquery.ajax/>
     *
     * @param {String} url A string containing the URL to which the request is sent.
     * @param {Object} options A set of key/value pairs that configure the Ajax request.
     *                         All settings are optional.
     * @param {HTMLElement|jQuery} sender jQuery instance or a valid DOM reference.
     */
    exports.ajax = function( url, options, sender ) {

        // shift arguments if url was omitted
        if ( typeof url === "object" ) {
            sender = options;
            options = url;
            url = undefined;
        }

        options = options || {};

        if (url) {
            options.url = url;
        }

        var defaultText, loadingText;
        if (sender) {
            sender = $(sender);
            if (sender.hasClass(CLASS_DISABLED)) {
                return;
            }
            sender.addClass(CLASS_DISABLED).prop('disabled', true);
            if (loadingText = sender.attr('data-async-text')) {
                defaultText = sender.html();
                sender.html(loadingText);
            }
        }

        var success = options.success || noop, error = options.error || noop;

        delete options.error;
        delete options.success;

        var defaultErrorResult = {error: '1', msg: '网络错误, 请重试!', data: null};

        var defaluts = {
            url: '',
            type: 'GET',
            data: {},
            dataType: 'json',
            timeout: 5000,
            cache: false,
            complete: function(xhr, status) {
                if (sender) {
                    sender.removeClass(CLASS_DISABLED).prop('disabled', false);
                    if (loadingText) {
                        sender.html(defaultText);
                    }
                    sender = defaultText = loadingText = undefined;
                }

                if (xhr.status === 404 || status == 'timeout') {
                    error(defaultErrorResult);
                    return false;
                }

                var result = xhr.responseJSON;
                if (options.dataType === 'jsonp') { // jsonp
                    result = result || defaultErrorResult;
                } else {
                    if (!result) {
                        result = trim(xhr.responseText);
                        if (result.charAt(0) !== '<') { // html
                            try {
                                result = $.parseJSON(result);
                            } catch (e) {}
                        }
                    }
                }
                try {
                    if ( !result || +(result.error || 0) !== 0) {
                        error(result);
                    } else {
                        success(result);
                    }
                } catch (e) { console.log('Call async callback unexpected error.', e); }
            }
        };

        options = extend(defaluts, options || {});

        return $.ajax(options);
    };

    $.each([ 'get', 'post', 'jsonp' ], function(i, method) {
        exports[ method ] = function( url, data, callback, error, sender ) {

            // shift arguments if data argument was omitted
            if (typeof data === 'function') {
                sender = sender || error;
                error = callback;
                callback = data;
                data = undefined;
            }

            if (error && error.nodeType) {
                sender = error;
                error = undefined;
            }

            var options = {
                url: url,
                data: data,
                success: callback,
                error: error || callback // Defaluts same with success callback
            };

            var type = method;
            if (method === 'jsonp') {
                type = 'get';
                options.dataType = 'jsonp';
            }
            options.type = type;

            return exports.ajax(options, sender);
        };
    });

});
