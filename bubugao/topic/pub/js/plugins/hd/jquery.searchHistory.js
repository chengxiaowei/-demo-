/**
 * @desc 搜索框搜索历史记录
 *
 * @author liangyouyu update 2015.3.10
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('../jquery.cookie');
    _ = require('../json2');
    _ = require('../../core/bbg');
    var cookieArray = []; // 缓存变量
    var cookiekKey = "_searchHistory";
    var searchCookie = {
        add: function(str) {
            if (str) {
                str = str.length > 200 ? str.substr(0, 200) : str;
                str = $('<div />').text(str).html(); //转义html标签
            } else {
                return;
            }
            cookieArray = searchCookie.get();
            var len = cookieArray.length;
            // 如果搜索的词 已经在历史记录中了，那么更新顺序
            for (var i = 0; i < len; i++) {
                if (cookieArray[i] == str) {
                    cookieArray.splice(i, 1);
                    cookieArray.push(str);
                    searchCookie.update();
                    return false;
                }
            }
            if (len > 9) {
                cookieArray.shift();
                cookieArray.push(str);
            } else {
                cookieArray.push(str);
            }
            searchCookie.update();
        },
        remove: function(idx) {
            var len = cookieArray.length;
            // 因为展数组是倒叙展示在页面上，所以删除元素就要倒置一下index
            var index = len - idx;
            if (len > idx) {
                cookieArray.splice(index - 1, 1);
                searchCookie.update();
            }
        },
        clear: function() {
            cookieArray = [];
            searchCookie.update();
        },
        get: function() {
            var cookieData = $.cookie(cookiekKey) || "";
            if (cookieData == "") {
                cookieArray = [];
            } else {
                cookieArray = JSON.parse(cookieData);
            }
            return cookieArray;
        },
        update: function() {
            var str = JSON.stringify(cookieArray);
            $.cookie(cookiekKey, str, {
                domain: "yunhou.com",
                path: "/",
                expires: 365
            });
        }
    }
    $.extend({
        searchHistory: searchCookie
    });
    $.fn.searchHistory = function(options) {
        var SearchHistory = function(args) {
            var defautls = {
                zIndex: 84, // 层
                url: "",
                selectItemCallback: function() {},
                callback: function() {} // 回调函数
            };
            this.opts = $.extend({}, defautls, options || {});
            this.eQuery = args.eQuery;
            this.eSearchHistoryPanel = args.eSearchHistoryPanel;
            this.eItems = null;
            this.isHide = true; // panel是否显示状态数值，始终和状态同步
            this.onQueryFlg = false; //是否悬浮在输入框上面，始终和状态同步
            this.onPanelFlg = false; //是否悬浮在panel上面，始终和状态同步
            this.init();
        }
        SearchHistory.prototype = {
            init: function() {
                $(document.body).append(this.eSearchHistoryPanel);
                this.reset();
                this.initEvent();
            },
            // 重新定位
            reset: function() {
                var position = this.eQuery.offset();
                this.eSearchHistoryPanel.css({
                    left: position.left - 1,
                    top: position.top + this.eQuery.outerHeight() + 1,
                    width: this.eQuery.outerWidth(),
                    'z-index': this.opts.zIndex
                });
            },
            // 显示auto suggest
            show: function() {
                this.isHide = false;
                this.reset();
                this.eSearchHistoryPanel.css({
                    display: 'block'
                });
            },
            // 隐藏auto suggest
            hide: function() {
                if (!this.onPanelFlg) {
                    this.isHide = true;
                    this.eSearchHistoryPanel.css({
                        display: 'none'
                    });
                }
            },
            removeItem: function($dom, allFlg) {
                if (allFlg) {
                    this.onPanelFlg = false;
                    this.eQuery.focus();
                    searchCookie.clear();
                    $dom.remove();
                } else {
                    searchCookie.remove($dom.index());
                    $dom.remove();
                }
                if (searchCookie.get().length == 0) {
                    this.eSearchHistoryPanel.find(".kh-item").remove();
                    this.eSearchHistoryPanel.find(".kh-none").show();
                }
            },
            // 注册事件
            initEvent: function() {
                var self = this;
                $(window).resize(function() {
                    self.reset();
                });
                self.eQuery.keyup(function(e) {
                    if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
                        return false;
                    }
                    if ($.trim($(this).val()).length <= 0) {
                        self.reset();
                        self.makeList();
                        return false;
                    } else {
                        self.reset();
                        self.makeSuggestList();
                        return false;
                    }
                    self.hide();
                });

                self.eQuery.keydown(function(e) {
                    var curItem = self.eSearchHistoryPanel.find('.kh-hover');
                    if (e.keyCode == 13) {
                        self.opts.callback && self.opts.callback(self.eQuery, curItem);
                        return;
                    }
                    if (self.isHide) {
                        return;
                    }
                    if (e.keyCode == 38) {
                        self.setCurItem(curItem.length > 0 && curItem.prev());
                    } else if (e.keyCode == 40) {
                        self.setCurItem(curItem.length > 0 && curItem.next());
                    }
                });

                self.eQuery.blur(function() {
                    self.onQueryFlg = false;
                    self.hide();
                });

                self.eQuery.focus(function() {
                    self.onQueryFlg = true;
                    if ($.trim($(this).val()).length <= 0) {
                        self.reset();
                        self.makeList();
                    } else {
                        self.makeSuggestList();
                    }
                });
                // 悬浮标记 当悬浮在panel窗口时，不隐藏窗口
                self.eSearchHistoryPanel.hover(function() {
                    self.onPanelFlg = true;
                }, function() {
                    self.onPanelFlg = false;
                    if (!self.onQueryFlg) {
                        self.hide();
                    }
                });

                self.eSearchHistoryPanel.delegate('.kh-item', 'mouseover', function() {
                    if (!self.isHide) {
                        self.hoverItem($(this));
                    }
                });

                self.eSearchHistoryPanel.delegate('.kh-item', 'click', function(e) {
                    e.stopPropagation && e.stopPropagation();
                    var $this = $(this);
                    if ($(e.target).is('.kh-button')) {
                        //eQuery.focus();
                        self.removeItem($this);
                    } else {
                        if (!self.isHide) {
                            self.setCurItem($this);
                        }
                        self.hide();
                        self.opts.callback && self.opts.callback(self.eQuery, this);
                    }
                });
                // 清楚所有记录按钮
                self.eSearchHistoryPanel.delegate('.kh-clear', 'click', function(e) {
                    e.stopPropagation && e.stopPropagation();
                    self.removeItem(self.eSearchHistoryPanel.find(".kh-item"), true);
                });
                // 关闭自动提示按钮
                self.eSearchHistoryPanel.delegate('.kh-close', 'click', function(e) {
                    e.stopPropagation && e.stopPropagation();
                    self.onPanelFlg = false;
                    self.onQueryFlg = false;
                    self.hide();
                });
            },
            hoverItem: function(curItem) {
                if (!this.isHide && this.eItems && this.eItems.length > 0) {
                    this.eItems.removeClass("kh-hover");
                    if (!curItem) {
                        curItem = this.eItems.eq(0);
                    }
                    if (curItem && curItem.length > 0) {
                        curItem.addClass("kh-hover");
                    }
                }
            },
            setCurItem: function(curItem) {
                if (!this.isHide && this.eItems && this.eItems.length > 0) {
                    this.eItems.removeClass("kh-hover");
                    if (!curItem) {
                        curItem = this.eItems.eq(0);
                    }
                    if (curItem && curItem.length > 0) {
                        curItem.addClass("kh-hover");
                        this.eQuery.val(curItem.attr('data-key'));
                        this.eQuery.attr('data-cat-id', curItem.attr('data-cat-id'));
                        this.opts.selectItemCallback && this.opts.selectItemCallback(this.eQuery, curItem);
                    }
                }
            },
            getHtml: function(data) {
                var strHtml = '';
                if (data && data.length > 0) {
                    var strHtml = '<ul class="kh-list">';
                    for (var i = 0, item, keyword, text; i < data.length; i++) {
                        item = data[i];
                        keyword = item.keyword;
                        strHtml += '<li class="kh-item" data-key="' + keyword + '"><span class="kh-key"><span>' + (item.highLight || keyword) + '</span></span><a class="kh-button">删除</a></li>';
                    }
                    strHtml += '</ul>';
                    strHtml += '<div class="kh-none" style="display:none">无历史搜索记录</div>';
                    strHtml += '<div class="kh-infos clearfix"><span>搜索记录</span><a class="kh-clear">清空搜索记录</a></div>';
                }
                return strHtml;
            },
            getSuggestHtml: function(data) {
                var strHtml = '';
                if (data && data.length > 0) {
                    var strHtml = '<ul class="kh-list">';
                    for (var i = 0, item, keyword, text; i < data.length; i++) {
                        item = data[i];
                        keyword = item.keyword;
                        strHtml += '<li class="kh-item" data-key="' + keyword + '"><span class="kh-key">' + (item.highLight || keyword) + '</span>'+ (item['count'] > 0 ? '<span class="kh-count">约' + item['count'] + '个商品</span>' : '') +'</li>';
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
                                strHtml += '<li data-cat-id="' + catItem['cateId'] + '" class="kh-item kh-item-cat' + lastCatClass + '" data-key="' + keyword + '"><span class="kh-key"> 在<em>' + catItem['name'] + '</em>分类中搜索</span>'+ (catItem['count'] > 0 ? '<span class="kh-count">约' + catItem['count'] + '个商品</span>' : '') + '</li>';
                            }
                        }
                    }
                    strHtml += '</ul>';
                    strHtml += '<div class="kh-infos clearfix"><a class="kh-close">关闭</a></div>';
                }
                return strHtml;
            },
            makeList: function() {
                var val = $.trim(this.eQuery.val());
                var data = [];
                var strArray = searchCookie.get();
                for (var i = strArray.length - 1; i > -1; i--) {
                    data.push({
                        keyword: strArray[i]
                    });
                }

                if (data && data.length > 0) {
                    this.eSearchHistoryPanel.html(this.getHtml(data));
                    this.eItems = this.eSearchHistoryPanel.find('.kh-item');
                    this.show();
                } else {
                    this.hide();
                }
            },
            makeSuggestList: function() {
                var self = this;
                var val = $.trim(self.eQuery.val());
                var shopType =  self.eQuery.siblings('[name="st"]').val() || $('[data-node-type="st"]').val();
                BBG.AJAX.jsonp({
                    url: self.opts.url,
                    data: {
                        prefixStr: val,
                        method: 'bubugao.search.autoComplete.get',
                        count: 10,
                        shopType:shopType
                    }
                }, function(data) {
                    if (data && data.data && data.data.length > 0) {
                        self.eSearchHistoryPanel.html(self.getSuggestHtml(data.data));
                        self.eItems = self.eSearchHistoryPanel.find('.kh-item');
                        self.show();
                    } else {
                        self.hide();
                    }
                }, function(data) {
                    self.hide();
                });
            }
        };
        $(this).each(function() {
            var eQuery = $(this),
                eSearchHistoryPanel = $('<div />', {
                    'class': 'k-history',
                    'data-s-key': 'jSearchHistoryBox' //关键字特殊标示
                });
            var a = new SearchHistory({
                eQuery: eQuery,
                eSearchHistoryPanel: eSearchHistoryPanel
            });
        });
    };
});