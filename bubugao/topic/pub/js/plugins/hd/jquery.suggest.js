/**
 * @desc 搜索框效果插件
 *
 * @author jiangchaoyi update 2014.7.30
 */
define(function(require, exports, module) {

	var $ = require('jquery');
	var _ = require('../../core/bbg');

	$.fn.suggest = function(options) {
		var defautls = {
			url: null, // 数据源
			zIndex: 85, // 层
			callback: function() {} // 回调函数
		};

		var opt = $.extend({}, defautls, options || {});

		$(this).each(function() {
			var eQuery = $(this),
				eSuggestPanel = $('<div />', {
					'class': 'ks-suggest',
					'data-s-key': 'jSearchBox' //关键字特殊标示
				}),
				eItems = null,
				isHide = true;

			var Suggest = {
				init: function() {
					$(document.body).append(eSuggestPanel);
					Suggest.reset();
					eSuggestPanel.hide();
					Suggest.initEvent();
				},
				// 重新定位
				reset: function() {
					var position = eQuery.offset();
					eSuggestPanel.css({
						left: position.left - 1,
						top: position.top + eQuery.outerHeight() + 1,
						width: eQuery.outerWidth(),
						'z-index': opt.zIndex
					});
				},
				// 显示auto suggest
				show: function() {
					eSuggestPanel.css({
						display: 'block'
					});
				},
				// 隐藏auto suggest
				hide: function() {
					eSuggestPanel.css({
						display: 'none'
					});
				},
				// 注册事件
				initEvent: function() {
					$(window).resize(function() {
						Suggest.reset();
					});
					eQuery.keyup(function(e) {
						if (e.keyCode == 38 || e.keyCode == 40) {
							return false;
						}
						if ($.trim($(this).val()).length <= 0) {
							eSuggestPanel.hide();
							return false;
						}
						Suggest.reset();
						Suggest.makeList();
					});

					eQuery.keydown(function(e) {
						var curItem = eSuggestPanel.find('.ks-hover');
						if (e.keyCode == 13) {
							opt.callback && opt.callback(eQuery, curItem);
						}
						switch (e.keyCode) {
							case 38:
								Suggest.setCurItem(curItem.length > 0 && curItem.prev());
								break;
							case 40:
								Suggest.setCurItem(curItem.length > 0 && curItem.next());
								break;
						}
					});

					eQuery.blur(function() {
						if (isHide) {
							Suggest.hide();
						}
					});

					eQuery.focus(function() {
						isHide = true;
					});

					eSuggestPanel.hover(function() {
						isHide = false;
					}, function() {
						isHide = true;
					});

					eSuggestPanel.delegate('.ks-item', 'mouseover', function() {
						eItems.removeClass("ks-hover");
						$(this).addClass("ks-hover");
					});

					eSuggestPanel.delegate('.ks-item', 'click', function() {
						Suggest.setCurItem($(this));
						opt.callback && opt.callback(eQuery, this);
						Suggest.hide();
					});

				},
				setCurItem: function(curItem) {
					if (eItems && eItems.length > 0 && !eSuggestPanel.is(':hidden')) {
						eItems.removeClass("ks-hover");
						if (!curItem) {
							curItem = eItems.eq(0);
						}
						if (curItem && curItem.length > 0) {
							curItem.addClass("ks-hover");
							eQuery.val(curItem.attr('data-key'));
							//eQuery.attr('data-cat-id', curItem.attr('data-cat-id'));
						}
					}
				},
				getHtml: function(data) {
					data = data.data;
					var strHtml = '';
					if (data && data.length > 0) {
						var strHtml = '<ul class="ks-list">';
						for (var i = 0, item, keyword, text; i < data.length; i++) {
							item = data[i];
							keyword = item.keyword;
							strHtml += '<li class="ks-item" data-key="' + keyword + '"><span class="ks-key">' + (item.highLight || keyword) + '</span><span class="ks-count">约' + item['count'] + '个商品</span></li>';
							if (item['cateLink'] && item['cateLink'].length > 0) {
								var catItem, lastCatClass = '',
									catList = item['cateLink'],
									len = catList.length;
								for (var j = 0; j < len; j++) {
									catItem = catList[j];
									lastCatClass = '';
									if (j == len - 1 && i != data.length - 1) {
										lastCatClass = ' s-item-cat-last';
									}
									strHtml += '<li data-cat-id="' + catItem['cateId'] + '" class="ks-item ks-item-cat' + lastCatClass + '" data-key="' + keyword + '"><span class="ks-key">在<em>' + catItem['name'] + '</em>分类中搜索</span><span class="ks-count">约' + catItem['count'] + '个商品</span></li>';
								}
							}
						}
						strHtml += '</ul>';
					}
					return strHtml;
				},
				makeList: function() {
					var val = $.trim(eQuery.val());
					BBG.AJAX.jsonp({
						url: opt.url,
						data: {
							prefixStr: val,
							method: 'bubugao.search.autoComplete.get',
							count: 10
						}
					}, function(data) {
						if (data && data.data && data.data.length > 0) {
							eSuggestPanel.html(Suggest.getHtml(data));
							eItems = eSuggestPanel.find('.ks-item');
							Suggest.show();
						} else {
							Suggest.hide();
						}
					}, function(data) {
						Suggest.hide();
					});
				}
			};
			Suggest.init();
		});
	}
});