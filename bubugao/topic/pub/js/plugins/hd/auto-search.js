/**
 * @desc 搜索框整体效果
 *
 * @author jiangchaoyi update 2014.7.30
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var _ = require('./jquery.suggest');
    _ = require('./search-keyword');
    _ = require('../jquery.minSlide');
    _ = require('./jquery.searchHistory');

    var eSearch = $('[data-node-type=jSearch]'),
        eTips = eSearch.find('.lbl-key'),
        eKey = $('[data-node-type=mq]'),
        eBtnAllSearch = eSearch.find('.jBtnAllSearch'),
        eBtnShopSearch = eSearch.find('.jBtnShopSearch');

    if ($('[data-node-type=jSearch]').length == 0) {
        // 兼容之前的页面 没有添加node-type的
        eSearch = $('#jSearch'), eTips = eSearch.find('.lbl-key'), eKey = $('#mq'), eBtnAllSearch = eSearch.find('.jBtnAllSearch'), eBtnShopSearch = eSearch.find('.jBtnShopSearch');
    }

    var URL = {
        SEARCH: {
            suggest: 'http://api.search.yunhou.com/bubugao-search-server/api/search', // 自动提示
            all: 'http://search.yunhou.com' // 全站搜索
        }
    };

	var Search = {
		init : function() {
            var searchKey = eKey.val() || "";
            if ($.trim(searchKey).length > 0) {
                Search.hideTips();
                eKey.val(searchKey);
            }
            eKey.searchHistory({
                selectItemCallback : function(){
                    Search.hideTips();
                },
                url : URL.SEARCH.suggest,
                callback : Search[(Search.isSearchShop()?'shop':'all') + 'Callback']
            });
			Search.initEvent();
		},
		//是否搜本店
		isSearchShop : function(){
			return (eBtnShopSearch.filter(':visible').length != 0);
		},
        allCallback: function($dom, clickItem) {
            var eKey = $dom,
                box = eKey.parent(),
                val = $.trim(eKey.val()),
                catId = clickItem ? $(clickItem).attr('data-cat-id') : null,
                shopType,
                action = URL.SEARCH.all, params = {};
            if (val) {
                // 缓存搜索的变量
                $.searchHistory.add(val);
                params['k'] = val;
                if (catId) {
                    params['c'] = catId;
                }
                if (shopType = (box.find('[name="st"]').val() || ($('[data-node-type="st"]').val() =='4' ? '4': null) ) ) {
                    params['st'] = shopType;
                }
                action += (!~action.indexOf('?') ? '?' : '&') + $.param(params);
                window.location.href = action;
            }
        },
        shopCallback: function($dom, clickItem) {
            var eKey = $dom,
                box = eKey.parent(),
                val = $.trim(eKey.val()),
                catId = clickItem ? $(clickItem).attr('data-cat-id') : null,
                shopType,
                action = eBtnShopSearch.attr('data-url'), params = {};
            if (val) {
                // 缓存搜索的变量
                $.searchHistory.add(val);
                params['k'] = val;
                if (catId) {
                    params['c'] = catId;
                }
                if (shopType = box.find('[name="st"]').val()) {
                    params['st'] = shopType;
                }
                action += (!~action.indexOf('?') ? '?' : '&') + $.param(params);
                window.location.href = action;
            }
        },
		initEvent : function() {
			//打点
			function uaTrack( btn, $keyDom){
				var bpmCode = btn.attr('data-bpm'); // BPM code
				var searchVal = $keyDom ? $keyDom.val() : $("#mq").val(); // Get input value
				if (searchVal && typeof BPM === 'object' && BPM) {
				 	BPM.uaTrack(bpmCode, searchVal); // send track
				}
			}
			eBtnAllSearch.click(function() {
                var $this = $(this);
                var $keyDom = $this.parents("[data-node-type=jSearch]").find("[data-node-type=mq]");
				uaTrack($this, $keyDom);
				Search.allCallback($keyDom);
			});

			eBtnShopSearch.click(function() {
                var $this = $(this);
                var $keyDom = $this.parents("[data-node-type=jSearch]").find("[data-node-type=mq]");
				uaTrack($this, $keyDom);
				Search.shopCallback($keyDom);
			});

			eKey.focus(function() {
                var $this = $(this);
                var $searchDom = $this.parents("[data-node-type=jSearch]");
				if ($.trim($this.val()).length > 0) {
					Search.hideTips($searchDom);
				} else {
					Search.filterTips($searchDom);
				}
			});

			eKey.blur(function() {
                var $this = $(this);
                var $searchDom = $this.parents("[data-node-type=jSearch]");
				if ($.trim($this.val()).length > 0) {
					Search.hideTips($searchDom);
				} else {
					Search.showTips($searchDom);
				}
			});
			eKey.keyup(function() {
                var $this = $(this);
                var $searchDom = $this.parents("[data-node-type=jSearch]");
				if ($.trim($this.val()).length > 0) {
					Search.hideTips($searchDom);
				} else {
					Search.filterTips($searchDom);
				}
			});
		},
		filterTips : function($searchDom) {
            var tips = null;
            if($searchDom && $searchDom.length > 0 ){
                tips = $searchDom.find('.lbl-key');
            }
            else{
                tips = eTips;
            }
			tips.css({
				display : 'block',
				opacity : '.5'
			});
		},
		hideTips : function($searchDom) {
            var tips = null;
            if($searchDom && $searchDom.length > 0 ){
                tips = $searchDom.find('.lbl-key');
            }
            else{
                tips = eTips;
            }
            tips.css({
                display : 'none',
                opacity : '1'
            });
		},
		showTips : function($searchDom) {
            var tips = null;
            if($searchDom && $searchDom.length > 0){
                tips = $searchDom.find('.lbl-key');
            }
            else{
                tips = eTips;
            }
			tips.css({
				display : 'block',
				opacity : '1'
			});
		}
	};
	Search.init();

	// 搜索关键字
	//$('#jKwSuggest').searchKeyWord();
    $('[data-node-type=jKwSuggest]').searchKeyWord();

	// 搜索右侧广告轮播
	var eSearchAd = $('#jSearchAd');
	if (eSearchAd.length > 0) {
		eSearchAd.minSlide();
	}
});