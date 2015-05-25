/**
 * 全部商品分类导航
 *
 * @author jiangchaoyi update 2014.7.30
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var _bbg = require('../../core/bbg');
    var loadData = require('../load-data');
    var lazyBlock = require('../lazy-block');

    // 分类动画
    function regCategory() {
        var eCat = $('#jCat');
        // 隐藏域保存导航
        var eHideNav = $('#jHideNav');
        if (eHideNav && eHideNav.val() == 'index') {
            eCat.removeClass('category-hide');
        } else {
            eCat.addClass('category-hide');
        }

        var _num = 0;
        var timerFun = ''; //延迟
        var eCatTitle = eCat.find('.cat-title'),
            eCatList = eCat.find('.cat-list'),
            eCatPop = eCat.find('.cat-pop'),
            eCatLayers = eCatPop.find('.cat-layer'),
            eCatPopBg = eCatPop.find('.cat-pop-bg'),
            eListItems = eCatList.find('.list-item'),
            isShow = false,
            isDelay = true; // 延迟显示弹窗效果,如果没有达到预定时间

        eListItems.mouseenter(function() {
            var $this = $(this);
            timerFun = setInterval(function() {
                _num++;
                if (_num > 1) {
                    clearTimeout(timerFun);
                    showCategory($this.index());
                }
            }, 100);
        });

        eListItems.mouseleave(function() {
            isShow = false;
            hideCategory();
            clearTimeout(timerFun);
        });

        eCatList.mouseover(function() {
            isShow = true;
        });

        eCatPop.mouseover(function() {
            isShow = true;
        });

        eCatPop.mouseout(function() {
            hideCategory();
            isShow = false;
        });

        /**
         * 显示并加载弹层
         */
        function showCategory(index) {
            var curLayer = eCatLayers.eq(index);
            if (curLayer.length > 0) {
                var inited = curLayer.data('inited');
                showLayer(curLayer, index);
                if (inited != 'inited') {
                    lazyBlock({
                        selector: curLayer,
                        isLazy: false,
                        callback: function(elm) {
                            loadData({
                                elm: elm,
                                okFn: function(data) {
                                    showLayer(curLayer, index);
                                }
                            });
                        }
                    });
                    curLayer.data('inited', 'inited');
                } else {
                    showLayer(curLayer, index);
                }
            }
        }

        //显示二级弹层
        function showLayer(curLayer, index) {
            hideAllCategory();
            curLayer.css({
                display: 'block'
            });
            eCatPop.css({
                display: 'block'
            });
            var curListItem = eListItems.eq(index);
            curListItem.addClass('cat-hover');
            var layerHeight = curLayer.outerHeight();
            eCatPop.css({
                height: layerHeight
            });
            eCatPopBg.css({
                height: layerHeight
            });
            curLayer.addClass('cat-layer-hover');
            var eWindow = $(window);
            var screenHeight = eWindow.height() + eWindow.scrollTop(),
                barOffsetTop = curListItem.offset().top,
                barPositionTop = curListItem.position().top,
                eCatTitleHeight = eCatTitle.outerHeight(),
                curPositionTop = barPositionTop + eCatTitleHeight,
                overHeight = 0;

            if (barOffsetTop + layerHeight > screenHeight) {
                overHeight = barOffsetTop + layerHeight - screenHeight;
            }

            if (overHeight > 0) {
                curPositionTop = curPositionTop - overHeight;
            }

            if (curPositionTop < eCatTitleHeight) {
                curPositionTop = eCatTitleHeight;
            }

            eCatPop.stop().animate({
                'top': curPositionTop
            });
        }

        // 影藏所有分类
        var hideAllCategory = function() {
            eListItems.removeClass("cat-hover");
            eCatPop.css({
                height: 0,
                display: 'none'
            });
            eCatLayers.css({
                display: 'none'
            });
            eCatLayers.removeClass("cat-layer-hover");
        };
        // 影藏分类
        function hideCategory() {
            setTimeout(function() {
                if (!isShow) {
                    hideAllCategory();
                }
            }, 100);
        }

        // 分类在二级页面的展示效果
        function regCategoryInOther() {
            if (eCat.hasClass("category-hide")) {
                eCat.mouseenter(function() {
                    isDelay = true;
                    setTimeout(function() {
                        if (isDelay) {
                            eCatList.stop().slideDown();
                            eCat.addClass("category-hover");
                            eCatTitle.addClass("cat-title-hover");
                            isDelay = false;
                        }
                    }, 100);
                });

                eCat.mouseleave(function() {
                    isDelay = false;
                    eCatList.stop().slideUp();
                    eCat.removeClass("category-hover");
                    eCatTitle.removeClass("cat-title-hover");
                });
            }
        }
        regCategoryInOther();
    }

    regCategory();
});