/**
 * @desc »ÛÉú»î
 *
 * @author jiangchaoyi update 2014.11.8
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');  

    function floorTab(opt) {
        var defaultSetting = {
            pager: 0,
            selector: null,
            hoverClass : 'hover',
            tabContentImgClass : 'jFloorImg',
            callback: function() {}
        };
        opt = $.extend(true, defaultSetting, opt);
        var eSelector = $(opt.selector);
        if (opt.selector.length === 0) {
            return;
        }

        var eTitles = eSelector.find('.jFloorTabTitle'),
            eItems = eSelector.find('.jFloorTabItem'),
            count = eTitles.length;
        if (count === 0) {
            return;
        }

        if (count != eItems.length) {
            return;
        }

        if (!(opt.pager >= 0 && opt.pager <= count)) {
            opt.pager = 0;
        }

        var index = 0;
        eTitles.each(function() {
            var $this = $(this);
            $this.data('pager', index);
            index++;
            $this.mouseenter(function() {
                var pager = $this.data('pager');
                goTab(pager);
            });
        });
        /**
         * Í¼Æ¬ÀÁ¼ÓÔØ
         */
        function loadLazyImg(eImgs) {
            eImgs.each(function() {
                var $this = $(this),
                    url = $this.attr("data-url");
                if (url) {
                    BBG.IMG.load(url, function() {
                        $this.attr('src', url);
                        $this.removeClass('img-error');
                    }, function() {
                        return false;
                    });
                    $this.removeAttr("data-url");
                }
            });
        }

        /**
         * tab ÇÐ»»
         * @param  {[number]} index µÚ¼¸Ò³
         */
        goTab(opt.pager);

        function goTab(index) {
            var curItem = eItems.eq(index),
                inited = curItem.data('inited');
            eTitles.removeClass(opt.hoverClass);
            eTitles.eq(index).addClass(opt.hoverClass);
            eItems.hide();
            curItem.show();
            if (inited != 'inited') {
                if (curItem.hasClass('bd-first')) {
                    curItem.find('.jFloorSlide').slide();
                }
                loadLazyImg(curItem.find('.'+ opt.tabContentImgClass));
                curItem.data('inited', 'inited');
            }
        }

    }
    return floorTab;
});