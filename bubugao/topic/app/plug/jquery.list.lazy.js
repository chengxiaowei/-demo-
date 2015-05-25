/**
 * @模块懒加载 
 * @author licuiting 250602615@qq.com
 * @date 2014-10-16 14:15:01
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var _ = require('pub/core/bbg');

    function ListLazy(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };

    ListLazy.prototype = {
        defaultSetting: {
            selector: '.jFloor', //jquery选择器
            listItem: '.jListItem', //需要加载的item
            range: 100, // 提前加载部分，提高用户体验
            container: window, //最外层的容器盒子,jquery选择器
            laodItem: '', //加载的显示框
            loadPathFlag: 'data-path', //加载标示
            currentPage: '1', //当前页
            totalData: '200', //总页数
            perPageData: '2', //每页显示条数
            successFun: null, //成功以后的回调函数
            errorFun: null //失败以后的回调函数
        },
        //标示
        _loadFlag: 'data-is-loaded', // 是否正在加载的判断
        //初始化
        init: function() {
            this.o = $(this.selector);
            this.resetData();
            this.load();
            this.event();
        },
        //重置分页数据
        resetData: function() {
            var self = this;
            var tData = self.o.attr('data-total-num');
            var perData = self.o.attr('data-per-num');
            self.totalData = tData || self.totalData; //总页数
            self.perPageData = perData || self.perPageData; //每页显示条数
            self.totalPage = Math.ceil(self.totalData / self.perPageData);
        },
        /**
         * 判断是否第一次加载，并且是否在可视区域
         */
        load: function($wrap) {
            var self = this;
            var scrt = self._getContent().scrt;
            var scrb = self._getContent().scrb;
            var $selector = $wrap ? $wrap : $(self.selector);
            //
            $selector.each(function() {
                var isInViewableArea = self._isInViewableArea($(this), scrt, scrb);
                //没有默认信息就给出默认信息
                if ($.trim($(this).text()).length == 0) {
                    //添加正在加载样式
                    self.o.addClass('load-floor');
                }
                if (!$(this).attr(self._loadFlag) && isInViewableArea) {
                    self._loadMod($(this));
                }
            });
        },
        /**
         * 给容器绑定scroll事件
         */
        event: function() {
            var self = this;
            //滚屏请求数据
            $(self.container).scroll(function(argument) {
                    self.load();
                })
                //请重试
            self.o.on('click', '.jRestart', function() {
                var $parent = $(this).closest(self.selector);
                $parent.removeAttr(self._loadFlag);
                self.load($parent);
            })
        },
        /*
         * 加载模块
         * @param {jquery object} 单个盒子的jquery对象 
         */
        _loadMod: function($box) {
            var self = this;
            var url = $box.attr(self.loadPathFlag);
            var p = {
                url: url,
                data: {
                    pageno: self.currentPage
                }
            };
            $box.attr(self._loadFlag, '1'); //避免重复加载标示
            $(self.laodItem).show();
            BBG.AJAX.jsonp(p, function(data) {
                self.o.removeClass('load-floor');
                $(self.laodItem).hide();
                if (self.totalPage > self.currentPage) {
                    $box.removeAttr(self._loadFlag);
                }
                self.currentPage++;
                self.successFun && self.successFun(data);
            }, function() {
                $box.html('获取失败，<a class="jRestart">请重试</a>!');
                self.errorFun && self.errorFun($box);
            });
        },
        /*
         * 1.获得容器的滚动条top,2.获得容器的延展高度
         */
        _getContent: function() {
            var self = this;
            var container = $(self.container); //容器
            var contentHeight = container.height(); //容器-高
            var contentScrollTop = container.scrollTop(); //容器滚动条离上面的距离
            var contentScrollBottom = contentScrollTop + contentHeight; //容器随滚动条的延展高度
            return {
                scrt: contentScrollTop,
                scrb: contentScrollBottom
            };
        },
        /**
         * 判断是否在可视区域
         * @param {jquery object} 单个盒子的jquery对象 
         * @param {string} 容器滚动条top
         * @param {string} 容器的延展高度 
         * @return {bool} 标示
         */
        _isInViewableArea: function($box, contentScrollTop, contentScrollBottom) {
            var self = this;
            var elemOffsetTop = $box.offset().top; //当前元素离顶部的距离-提前加载图片的距离
            var elemOffsetBottom = elemOffsetTop + $box.outerHeight();
            /*return !((elemOffsetTop-self.range > contentScrollBottom )||(elemOffsetBottom < contentScrollTop));*/
            return (elemOffsetBottom - self.range <= contentScrollBottom);
        }
    }
    return function(opt) {
        new ListLazy(opt);
    }
});
