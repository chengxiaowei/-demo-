/**
 * 图床工具
 */
define(function(require, exports, module) {
    'use strict';

    var TYPE = {
        s1: 's1',
        s2: 's2',
        m1: 'm1',
        l1: 'l1',
        l2: 'l2'
    };

    var toInt = function(n) {
        return parseInt(n, 10);
    };

    var isImgUrl = function(str) {
        return (/^((https?|ftp|rmtp|mms):)?\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(str);
    };

    var isPicUrl = function(src) {
        var reg = /[_]\d+x\d+\./;
        return reg.test(src);
    };

    module.exports = {

        getImgByType: function(src, type) {
            if (isPicUrl(src)) {
                // 有后缀就替换，无后缀就添上;
                var reg = /!(s1|s2|m1|l1|l2)$/
                if (reg.test(src)) {
                    return src.replace(reg, '!' + type);
                } else {
                    return src + '!' + type;
                }
            }
            return src;
        },

        /**
         * 是否是商城图片url(ps:_数字x数字)
         */
        isPicUrl: isPicUrl,

        /**
         * 根据图片地址获取图片相关信息
         * 
         * @param {String} id 图片ID
         * @return {Object} 图片相关信息 {id, width, height, ext, type}
         */
        getInfo: function(src) {
            var ptn = /\/?(([0-9a-z]+)_([0-9a-z]+)_([0-9a-z]+)_(\d+)x(\d+)\.([a-z]{3,4}))!?(\w+)?/;
            var items = ptn.exec(src);
            var info = null;
            if (items) {
                info = {};
                info.id = items[1];
                info.width = items[5];
                info.height = items[6];
                info.ext = items[7];
                info.type = items[8];
            }
            return info;
        },

        /**
         * 根据图片的uri获取图片的高度宽度
         * 
         * @param {String} picUri 图片请求地址
         * @return size 对象
         */
        getSizeByUri: function(picUri) {
            var size = {};
            var ptn = /_(\d+)x(\d+)\.([^.\/_]+)!(\d+)$/;
            var items = ptn.exec(picUri);
            if (items) {
                size.w = toInt(items[1]);
                size.h = toInt(items[2]);
                size.size = toInt(items[4]);
            } else {
                ptn = /_(\d+)x(\d+)\.([^.\/_]+)$/;
                items = ptn.exec(picUri);
                if (items) {
                    size.w = toInt(items[1]);
                    size.h = toInt(items[2]);
                    size.size = size.w;
                } else {
                    size = null;
                }
            }
            return size;
        },

        isImgUrl: isImgUrl,

        /**
         * 判读图片src是否加载完成
         *
         * @param src 图片路径
         * @param succeed 成功回调
         * @param error 失败回调
         */
        load: function(src, fnSucceed, fnError) {
            if (src) {
                var objImg = new Image();
                if (fnSucceed) {
                    objImg.onload = function() { fnSucceed(objImg); };
                }
                if (fnError) {
                    objImg.onerror = function() { fnError(objImg); };
                }
                objImg.src = src;
            } else {
                fnError && fnError(null);
            }
        }

    };

});
