/**
 * 迷你工具条
 *
 * @author djune update@2014.8.7
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery'),
        _ = require('../core/bbg');
    _ = require('./dialog');
    _ = require('./jquery.imgLoading');
    _ = require('./cart-count');

    var URL = {
        MinCart: {
            get: 'http://api.cart.yunhou.com/cart/miniGet', // 获取迷你购物车数据
            del: 'http://api.cart.yunhou.com/cart/miniDel' // 获取迷你购物车数据
        }
    };

    var minHeight = 400,
        wHeight = $(window).height(),
        startScroll = wHeight * 2,
        isOpen = false,
        eMinCart = $('#jMinBar'),
        eBarFast = eMinCart.find('.bar-fast'),
        eBarPlug = eMinCart.find('.bar-plug'),
        eBarPlugClose = eBarPlug.find('.jBarPlugClose'),
        eBarTabMid = eBarFast.find('.bar-tab-mid'),
        eScrollToTop = eBarFast.find('.jScrollToTop'),
        eTabItems = eBarFast.find('.tab-item');

    // 迷你Bar
    var MinBar = {
        init: function() {
            MinBar.reset();
            MinBar.initEvent();
            // 提前加载，这个地方不优雅
            //			MinBar.Plug.Cart.init(true);
        },
        reset: function() {
            wHeight = $(window).height();
            startScroll = wHeight * 2;
            eMinCart.css({
                display: 'block',
                height: wHeight
            });
            eBarFast.css({
                height: wHeight
            });
            eBarTabMid.css({
                top: (wHeight - eBarTabMid.height()) / 2
            });

            for (var i in MinBar.Plug) {
                MinBar.Plug[i].reset && MinBar.Plug[i].reset();
            }
        },
        Plug: {},
        initEvent: function() {
            eTabItems.click(function() {
                var $this = $(this);
                var type = $this.attr('data-type');
                type && MinBar.Plug[type].init();
            });

            $(window).resize(function() {
                MinBar.reset();
            });

            eBarPlugClose.click(function() {
                MinBar.hidePlug();
            });

            /* 返回顶部 - start */
            scrollToTop();

            function scrollToTop() {
                var top = $(window).scrollTop();
                if (top > startScroll) {
                    eScrollToTop.fadeIn();
                } else {
                    eScrollToTop.fadeOut();
                }
            }

            $(window).scroll(function() {
                scrollToTop();
            });

            eScrollToTop.click(function() {
                $('body,html').animate({
                    scrollTop: 0
                }, 1000);
            });
            /* 返回顶部 - end */
            $(document).click(function(e) {
                var tg = $(e.target);
                if (tg.closest('#jMinBar').length == 0) {
                    MinBar.hidePlug();
                }
            });
        },
        showPlug: function() {
            isOpen = true;
            eBarPlug.stop().animate({
                right: 34
            });
            MinBar.Plug.Cart.loading();
        },
        hidePlug: function() {
            isOpen = false;
            eBarPlug.stop().animate({
                right: -280
            });
        }
    };
    // 购物车
    MinBar.Plug.Cart = {
        init: function() {
            MinBar.Plug.Cart.isLoading = true;
            MinBar.Plug.Cart.initElms();
            MinBar.Plug.Cart.initEvent();
            MinBar.Plug.Cart.reset();
            if (isOpen) {
                MinBar.hidePlug();
            } else {
                MinBar.showPlug();
            }
        },
        isLoading: false,
        setQty: function(qty) {
            if (qty === undefined) {
                qty = 0;
            }
            BBG.CartCount.set(qty);
        },
        // 给外部用的
        updateQty: function(qty) {
            MinBar.hidePlug();
            MinBar.Plug.Cart.setQty(qty);
        },
        loading: function() {
            BBG.AJAX.jsonp({
                url: URL.MinCart.get,
                data: {}
            }, function(data) {
                MinBar.Plug.Cart.bindHtml(data);
            }, function(data) {
                MinBar.Plug.Cart.elms.eCartCnt.html(MinBar.Plug.Cart.config.reload);
            });
        },
        bindHtml: function(data) {
            var str = '';
            for (var i = 0; i < data.items.length; i++) {
                var pro = data.items[i];
                str += '<li class="jCartItem">';
                str += '<a class="goods-img" href="http://item.yunhou.com/' + pro.productId + '.html" target="_blank">';
                str += '	<img class="img-error jImgMinCart" alt="' + pro.productName + '" src="//s1.bbgstatic.com/pub/img/blank.gif" data-url="' + BBG.IMG.getImgByType(pro.productImage, BBG.IMG.TYPE.s1) + '">';
                str += '</a>';
                str += '<a class="goods-name" href="http://item.yunhou.com/' + pro.productId + '.html" target="_blank">' + pro.productName + '</a>';
                str += '<div class="goods-des clearfix">';
                str += '	<span class="goods-price p-normal f-l"><em>￥</em>' + pro.totalRealPrice + '</span>';
                str += '	<span class="goods-num f-r">' + pro.quantity + '</span>';
                str += '</div>';
                str += '<a class="op-del jOpDel" data-id="' + pro.productId + '" href="javascript:;"><i class="icon iconfont">&#xe607;</i></a>';
                str += '</li>';
            }
            if (str == '') {
                str = MinBar.Plug.Cart.config.empty;
            }
            MinBar.Plug.Cart.elms.eCartCnt.html(str);
            MinBar.Plug.Cart.setQty(data.totalType);
            MinBar.Plug.Cart.elms.eTotalPrice.html(data.totalPrice);
            MinBar.Plug.Cart.elms.eCartCnt.find('.jImgMinCart').imgLoading({
                container: MinBar.Plug.Cart.elms.eCartCnt
            });
            MinBar.Plug.Cart.isDisabled();
        },
        // 判断结算按钮是否可点击
        isDisabled: function() {
            if (MinBar.Plug.Cart.elms.eCartCnt.find('.jCartItem').length > 0) {
                MinBar.Plug.Cart.elms.eGoCart.removeClass('btn-disabled');
                return false;
            } else {
                MinBar.Plug.Cart.elms.eGoCart.addClass('btn-disabled');
                return true;
            }
        },
        config: {
            empty: '<li class="cart-empty">^_^&nbsp;&nbsp;既来之，则买之！</li>',
            reload: '<li class="cart-empty">加载失败，请<a href="javascript:;" class="jReload">重试</a></li>'
        },
        initElms: function() {
            MinBar.Plug.Cart.elms.ePlugCart = eBarPlug.find('.plug-cart');
            MinBar.Plug.Cart.elms.eCartCnt = eBarPlug.find('.cart-cnt');
            MinBar.Plug.Cart.elms.eTotalPrice = MinBar.Plug.Cart.elms.ePlugCart.find('.jTotalPrice');
            MinBar.Plug.Cart.elms.eGoCart = MinBar.Plug.Cart.elms.ePlugCart.find('.jGoCart');
        },
        elms: {
            ePlugCart: null,
            eCartCnt: null,
            eTotalPrice: null,
            eGoCart: null
        },
        reset: function() {
            if (MinBar.Plug.Cart.isLoading) {
                eBarPlug.css({
                    height: wHeight
                });
                MinBar.Plug.Cart.elms.eCartCnt.css({
                    height: wHeight - 110
                });
            }
        },
        initEvent: function() {
            // 重新加载购物车
            MinBar.Plug.Cart.elms.eCartCnt.delegate('.jReload', 'click', function() {
                MinBar.Plug.Cart.loading();
            });
            // 删除商品
            MinBar.Plug.Cart.elms.eCartCnt.delegate('.jOpDel', 'click', function() {
                var $this = $(this),
                    id = $this.attr('data-id'),
                    eCartItem = $this.parent('.jCartItem');
                BBG.AJAX.jsonp({
                    url: URL.MinCart.del,
                    data: {
                        productId: id
                    }
                }, function(data) {
                    eCartItem.fadeOut();
                    MinBar.Plug.Cart.bindHtml(data);
                }, function(data) {
                    BBG.Dialog.warning(data._error.msg, $this);
                }, $this);
            });
            // 去购物车
            MinBar.Plug.Cart.elms.ePlugCart.delegate('.jGoCart', 'click', function(e) {
                var $this = $(this);
                e.preventDefault();
                if (!MinBar.Plug.Cart.isDisabled()) {
                    window.location.href = $this.attr('href');
                }
            });
        }
    }
    MinBar.init();
    return MinBar;
});
