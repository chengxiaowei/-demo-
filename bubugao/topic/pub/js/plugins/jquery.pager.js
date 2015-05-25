/**
 * @deprecated 分页插件
 * @author djune 2014.7.30
 */
define(function(require) {
    var $ = require('jquery');
	$.fn.pager = function(options) {
		var defautls = {
			nextHtml : '下一页',// 如果是false，则不显示
			prevHtml : '上一页',// 如果是false，则不显示
			clickPageFun : function(){},//点击页码
			range : 5,// 最多显示几个分页按钮
			isTotal : true,// 是否显示统计信息
			curPage : 1,// 当前页-首次绑定
			pageSize : 15,// 每页显示多少条
			totalCount : 0,// 总记录数，如果用户设置了ajax参数，则此参数无效
			/**
			 * 异步加载分页，如果需要就按照如下参数填写，如果不需要ajax就填写null ajax : { url :
			 * 'http://openapi.yunhou.com/getUserName',//必须得url data : {
			 * //参数，系统会默认把pageSize和curPage加上去 userId : 1 } }
			 */
			ajax : null,
			/**
			 * 分页回调函数
			 * 
			 * @param {int}
			 *            page 当前页
			 * @param {object}
			 *            data 后台返回数据类型 {totalCounts : 6000,data : {}}
			 */
			paged : function(curPage, data) {
			}
		};
		var opt = $.extend({}, defautls, options || {});
		$this = $(this), gIsLoading = false,// 全局 - 是否正在加载
		gCurPage = opt.curPage,// 全局-当前页
		gTotalCount = opt.totalCount,// 全局-总记录数
		gTotalPage = 0;// 全局-总页数

		var Pager = {
			init : function() {
				Pager.go(gCurPage);
				Pager.initEvent();
			},
			getTotalPage : function() {
				var totalPage = 0;
				if (gTotalCount > 0) {
					totalPage = parseInt(gTotalCount / opt.pageSize);
					if (gTotalCount % opt.pageSize > 0) {
						totalPage++;
					}
				}
				gTotalPage = totalPage;
			},
			getPagerCnt : function() {
				return $('<div />', {
					'class' : 'pager'
				});
			},
			getPager : function(page) {
				if (page) {
					return '<a href="javascript:;" class="pager-item" data-page=' + page + '>' + page + '</a>';
				}
				return '';
			},
			getMore : function() {
				return '<span>...</span>';
			},
			getNext : function() {
				if (opt.nextHtml) {
					return '<a href="javascript:;" class="pager-next">' + opt.nextHtml + '</a>';
				}
				return '';
			},
			getPrev : function() {
				if (opt.prevHtml) {
					return '<a href="javascript:;" class="pager-prev">' + opt.prevHtml + '</a>';
				}
				return '';
			},
			getCurPager : function(page) {
				if (page) {
					return '<b>' + page + '</b>';
				}
				return '';
			},
			getTotal : function() {
				var str = '';
				if (opt.isTotal) {
					str += '<em>共' + gTotalPage + '页，到<input class="pager-txt" type="text" maxLength=' + (gTotalPage + '').length + ' value="' + gCurPage + '">页</em>';
					str += '<a class="pg-btn" href="javascript:;">确定</a>';
				}
				return str;
			},
			makePager : function() {
				var ePager = Pager.getPagerCnt(), str = '', range = opt.range - 1;
				if (gTotalPage > opt.range && gCurPage <= gTotalPage) {
					var halfRange = parseInt(range / 2), //
					rightRange = gCurPage + halfRange, //
					leftRange = gCurPage - (range - halfRange);
					if (rightRange > gTotalPage) {
						rightRange = gTotalPage;
						leftRange = rightRange - range;
					} else if (leftRange < 1) {
						leftRange = 1;
						rightRange = leftRange + range;
					}
					for ( var i = leftRange; i <= gCurPage - 1; i++) {
						str += Pager.getPager(i);
					}
					str += Pager.getCurPager(gCurPage);
					for ( var i = gCurPage + 1; i <= rightRange; i++) {
						str += Pager.getPager(i);
					}
					if (leftRange > 1) {
						str = Pager.getMore() + str;
					}
					if (rightRange < gTotalPage) {
						str = str + Pager.getMore();
					}
					if (gCurPage > 1) {
						str = Pager.getPrev() + str;
					}
					if (gCurPage < gTotalPage) {
						str = str + Pager.getNext();
					}
					str += Pager.getTotal(gCurPage);
				} else {
					for ( var i = 1; i <= gTotalPage; i++) {
						if (i == gCurPage) {
							str += Pager.getCurPager(i);
						} else {
							str += Pager.getPager(i);
						}
					}
					if (gCurPage > 1) {
						str = Pager.getPrev() + str;
					}
					if (gCurPage < gTotalPage) {
						str = str + Pager.getNext();
					}
				}
				ePager.html(str);
				$this.html(ePager);
			},
			go : function(curPage) {
				if (gIsLoading) {
					return;
				}
				opt.clickPageFun && opt.clickPageFun(curPage);
				gIsLoading = true;
				gCurPage = curPage;
				if (opt.ajax) {
					var _data = $.extend(true, {}, {
						pageSize : opt.pageSize,
						curPage : gCurPage
					}, opt.ajax.data);
					BBG.AJAX.get({
						url : opt.ajax.url,
						data : _data
					}, function(data) {
						gTotalCount = data.totalCounts;
						Pager.getTotalPage();
						opt.paged(gCurPage, data);
						Pager.makePager();
						gIsLoading = false;
					}, function(data) {
						opt.paged(gCurPage, data);
						Pager.makePager();
						gIsLoading = false;
					});
				} else {
					Pager.getTotalPage();
					opt.paged(gCurPage);
					Pager.makePager();
					gIsLoading = false;
				}
			},
			initEvent : function() {
				$this.off();

				$this.delegate('.pg-btn', 'click', function() {
					var ePagerTxt = $(this).parent('.pager').find('.pager-txt');
					Pager.go(Pager.getValidPage(ePagerTxt.val()));
				});

				$this.delegate('.pager-next', 'click', function() {
					var val = gCurPage;
					val++;
					if (val <= gTotalPage) {
						Pager.go(val);
					}
				});

				$this.delegate('.pager-prev', 'click', function() {
					var val = gCurPage;
					val--;
					if (val > 0) {
						Pager.go(val);
					}
				});

				$this.delegate('.pager-txt', 'keydown', function(e) {
					var ePagerTxt = $(this).parent('em').parent('.pager').find('.pager-txt');
					if (e.keyCode == 13) {
						Pager.go(Pager.getValidPage(ePagerTxt.val()));
					}
				});

				$this.delegate('.pager-txt', 'kedown', function(e) {
					var ePagerTxt = $(this);
					var val = $.trim(ePagerTxt.val());
					if (val.length <= 0) {
						return;
					}
				});

				$this.delegate('.pager-item', 'click', function(e) {
					var val = $(this).attr('data-page') * 1;
					Pager.go(val);
				});
			},
			getValidPage : function(val) {
				if (/(^[1-9]?$)|(^[1-9][\d]*$)/.test(val)) {
					val = parseInt(val);
					if (val < 1) {
						val = 1;
					}
					if (val > gTotalPage) {
						val = gTotalPage;
					}
				} else {
					val = 1;
				}
				$this.find('.pager-txt').val(val);
				return val;
			}
		};
		Pager.init();
	};
});
