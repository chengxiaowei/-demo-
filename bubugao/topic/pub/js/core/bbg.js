/*****************************************************************************/
/**                                    全局变量                              */
/** ************************************************************************** */
define(function(require, exports, module) {
    var $ = require('jquery');
    // 重定义console对象,避免ie报错;
    window.console = (function() {
        if (window.console) {
            return window.console;
        } else {
            return {
                log: function() {}
            };
        }
    })();

    var BBG = window.BBG = this.BBG = {
        Math: {
            fixed2: function(x) {
                var f_x = parseFloat(x);
                if (isNaN(f_x)) {
                    return '0.00';
                }
                var f_x = Math.round(x * 100) / 100;
                var s_x = f_x.toString();
                var pos_decimal = s_x.indexOf('.');
                if (pos_decimal < 0) {
                    pos_decimal = s_x.length;
                    s_x += '.';
                }
                while (s_x.length <= pos_decimal + 2) {
                    s_x += '0';
                }
                return s_x;
            }
        }
    };

    BBG.IMG = {
        TYPE: {
            s1: 's1',
            s2: 's2',
            m1: 'm1',
            l1: 'l1',
            l2: 'l2'
        },
        getImgByType: function(src, type) {
            var reg = /[!]((s1)|(s2)|(m1)|(l1)|(l2))$/
                // 有后缀就替换，无后缀就添上;
            if (BBG.IMG.isPicUrl(src)) {
                if (reg.test(src)) {
                    return src.replace(reg, '!' + type);
                } else {
                    return src + '!' + type;
                }
            }
            return src;
        },
        //是否是商城图片url(ps:_md5编码_数字x数字.);
        isPicUrl: function(src) {
            var reg = /[_]([0-9a-zA-Z]{32})[_][0-9]+[x][0-9]+\./;
            return reg.test(src);
        },
        /**
         * 根据图片ID获取图片地址
         *
         * @param {String}
         *            id 图片ID
         * @param {Object}
         *            type 图片规格，见
         * @return {String} 图片地址 BBG.IMG.TYPE
         */
        getSRC: function(id, type) {
            var suf = '';
            if (type) {
                suf = '!' + type;
            }
            return 'http://10.200.51.192:9720/bubugao-img-center/images/' + id + suf;
        },
        /**
         * 根据图片地址获取图片ID
         *
         * @param {String}
         *            id 图片ID
         * @return {String} 图片地址
         */
        getID: function(src) {
            var ptn = /\/?(([0-9a-z]+)_([0-9a-z]+)_([0-9a-z]+)_(\d+)x(\d+)\.([a-z]{3,4}))[!]?([a-z]+)?/;
            var items = ptn.exec(src);
            var info = null;
            if (items) {
                info = {};
                info.id = items[1];
                info.width = items[5];
                info.height = items[6];
                info.suf = items[9];
            }
            return info;
        },
        /**
         * 根据图片的uri获取图片的高度宽度
         *
         * @param {String}
         *            picUri 图片请求地址
         * @return size 对象
         */
        getSizeByUri: function(picUri) {
            var size = {};
            var ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)\!([0-9]+)$/;
            var items = ptn.exec(picUri);
            if (items) {
                size.w = parseInt(items[1]);
                size.h = parseInt(items[2]);
                size.size = parseInt(items[4]);
            } else {
                ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)$/;
                items = ptn.exec(picUri);
                if (items) {
                    size.w = parseInt(items[1]);
                    size.h = parseInt(items[2]);
                    size.size = size.w;
                } else {
                    size = null;
                }
            }
            return size;
        },
        isImgUrl: function(str) {
            return (/^((https?|ftp|rmtp|mms):)?\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(str);
        },
        /**
         * 判读图片src是否加载完成
         *
         * @param src
         *            图片路径
         * @param succeed
         *            成功回调
         * @param error
         *            失败回调
         */
        load: function(src, fnSucceed, fnError) {
            if (BBG.IMG.isImgUrl(src)) {
                var objImg = new Image();
                objImg.src = src;
                if (objImg.complete) {
                    fnSucceed && fnSucceed(objImg);
                } else {
                    objImg.onload = function() {
                        fnSucceed && fnSucceed(objImg);
                    };
                }
                objImg.onerror = function() {
                    fnError && fnError(objImg);
                };
            } else {
                fnError && fnError(null);
            }
        }
    };

    /**
     * ajax封装
     *
     * @param options
     *            {object} 与$.ajax配置一致
     * @param okFn
     *            {function} 成功回调
     * @param errFn
     *            {function} 错误回调
     * @param btn
     *            {element} jquery对象或者dom节点
     *
     */
    BBG.AJAX = {
        ajax: function(options, okFn, errFn, btn) {
            if (btn) {
                btn = $(btn);
                if (btn.hasClass('btn-disabled')) {
                    return;
                }
                btn.addClass('btn-disabled');
                btn.prop('disabled', true);
            }

            function _removeBtnDisabled() {
                if (btn) {
                    btn.removeClass('btn-disabled');
                    btn.prop('disabled', false);
                }
            }

            function _getJson(xhr) {
                var resJson = xhr;
                if (xhr && xhr.responseJSON) {
                    resJson = resJson.responseJSON;
                } else if (xhr && xhr.responseText) {
                    try {
                        resJson = $.parseJSON(xhr.responseText);
                    } catch (e) {
                        resJson = null;
                    }
                }
                return resJson;
            }

            var defaluts = {
                url: '',
                type: 'GET',
                data: {},
                dataType: 'json',
                timeout: 10000,
                cache: false,
                success: function(xhr) {
                    var resJson = _getJson(xhr);
                    if (resJson && resJson._error) {
                        errFn && errFn(resJson);
                    } else {
                        okFn && okFn(resJson);
                    }
                },
                error: function(xhr) {
                    //正确
                    if (xhr.status == '200') {
                        okFn && okFn();
                    } else {
                        var resJson = _getJson(xhr);
                        if (!(resJson && resJson._error)) {
                            resJson = {
                                _error: {
                                    code: '-1',
                                    msg: '网络错误，请重试！'
                                }
                            };
                        }
                        errFn && errFn(resJson);
                    }
                },
                complete: function() {
                    _removeBtnDisabled();
                }
            };
            var opt = $.extend(defaluts, options || {});
            $.ajax(opt);
        },
        get: function(options, okFn, errFn, btn) {
            var defaluts = {
                type: 'GET'
            };
            var opt = $.extend(defaluts, options || {});
            BBG.AJAX.ajax(opt, okFn, errFn, btn);
        },
        post: function(options, okFn, errFn, btn) {
            var defaluts = {
                type: 'POST'
            };
            var opt = $.extend(defaluts, options || {});
            BBG.AJAX.ajax(opt, okFn, errFn, btn);
        },
        jsonp: function(options, okFn, errFn, btn) {
            var defaluts = {
                dataType: 'jsonp',
                jsonp: "callback"
            };
            var opt = $.extend(defaluts, options || {});
            BBG.AJAX.ajax(opt, okFn, errFn, btn);
        }
    };
    //去掉html标签
    BBG.delHtmlTag = function(str) {
        return str.replace(/<[^>]+>/g, "");
    }

    //判断浏览器是否支持本站点
    BBG.isSupport = function() {
        var ie6 = !-[1, ] && !window.XMLHttpRequest;
        var isSupport = ie6;
        if (isSupport) {
            $(document.body).prepend('<div style="display:block;text-align:center;padding: 20px 0;background-color: #fed5c7;text-align: center;font-size: 14px;color: #bf440a;">亲，你当前的浏览版本太低，部分功能或者内容可能显示不正常，请升级或者更换你的浏览器，换得更好的浏览体验。</div>');
        }
    };

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function(fmt) { // author: meizz
        if (!fmt) {
            fmt = 'yyyy-MM-dd hh:mm:ss';
        }
        var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            "S": this.getMilliseconds()
                // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    return BBG;
});