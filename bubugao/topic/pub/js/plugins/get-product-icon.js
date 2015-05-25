/**
 * @description 显示商品图标
 * @author licuiting 250602615@qq.com
 * @date 2014-10-31 18:19:15
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var _ = require('../core/bbg');
    var URL = {
        getListIconInfo: 'http://api.mall.yunhou.com/product/labelInfo'
    };
    //class
    function GetProductIcon(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    GetProductIcon.prototype = {
        defaultSetting: {
            url: URL.getListIconInfo,
            classStr: 'img-tag',
            parent: '', //父级元素(ps:jquery对象)
            picSize: '60px', //图片尺寸
            selector: '[data-targetId]'
        },
        init: function() {
            var self = this;
            self.createIcon();
        },
        //获取goodsid,剔重,并以逗号隔开
        getGoodsId: function() {
            var self = this;
            var isHasParent = (self.parent != '');
            var $selector = isHasParent ? self.parent.find(self.selector) : $(self.selector);
            var ar = [];
            ar = $selector.map(function() {
                return $(this).attr('data-targetId');
            }).get();
            ar = $.unique(ar);
            return ar.join(',');
        },
        createIcon: function() {
            var self = this;
            BBG.AJAX.jsonp({
                url: self.url,
                data: {
                    goodsid_str: self.getGoodsId()
                }
            }, function(data) {
                $.each(data, function(k, v) {
                    if (data && v) {
                        var label = v;
                        var styleStr = '';
                        var positionStr = self.createLocation(label.location);
                        if (label && label.isShow) {
                            //判断是否有图片
                            if (label.imageKey) {
                                //直接给图片赋值
                                styleStr = '<span class="' + self.classStr + '" style="' + positionStr + '"><img class="jImg img-error jImgTag" src="' + label.labelimgurl + '"></span>';
                            } else {
                                //生成style
                                //styleStr = '<span class="'+ self.classStr +'" style="'+ self.createStyle(label) + positionStr +'"><em>'+ label.labelName +'</em></span>';
                            }
                        }
                        $('[data-targetId=' + v.targetId + ']').each(function() {
                            var $img = '';
                            var $this = $(this);
                            var listClass = [
                                'goods-img', //shop首页列表,电器城首页
                                'com-img', //专题
                                'gd-img' //商城首页
                            ];
                            $.each(listClass, function(i, v) {
                                if ($this.find('.' + v).length != 0 && $this.find('.' + self.classStr).length == 0) {
                                    $img = $this.find('.' + v);
                                    $this.css('position', 'relative');
                                    return;
                                }
                            });
                            ($img != '') &&
                            $img.append(styleStr)
                                .find('.' + self.classStr).css({
                                    'position': 'absolute',
                                    'max-width': self.picSize,
                                    'max-height': self.picSize
                                })
                                .find('img')
                                .css({
                                    'max-width': self.picSize,
                                    'max-height': self.picSize,
                                    'width': 'auto',
                                    'height': 'auto'
                                })
                        })
                    }
                });
            });
        },
        //生成非图片的样式
        createStyle: function(label) {
            return 'color:' + label.wordColor + ';background:' + label.bgColor + ';opacity:' + label.transparency + ';filter:alpha(opacity=' + label.transparency + ');'
        },
        //位置(1左上, 2右上, 3左下, 4右下)
        createLocation: function(num) {
            var posAr = ['', 'left:0px;top:0px;', 'right:0px;top:0px;',
                'left:0px;bottom:0px;', 'right:0px;bottom:0px;'
            ];
            return posAr[num];
        }
    }
    return function(opt) {
        new GetProductIcon(opt);
    }
});
