/**
 * 图片懒加载组建，
 *
 * @deprecated 滚屏图片懒加载
 * @author djune 2013-10-15
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    require('../core/bbg');

    $.fn.slide = function (options) {
        var defautls = {
            attr: 'data-img',// 实际的地址
            duration: 5000,// 每个多久轮播一次
            addBtn: false,
            callback: function () {// 每次轮播完成后的回调
            }
        };
        var opts = $.extend({}, defautls, options || {});

        $(this).each(function () {
            var eSlide = $(this);
            addSlide(eSlide);
        });

        function addSlide(eSlide) {
            var eSlideItems = eSlide.find('.slide-list li');
            if (eSlideItems && eSlideItems.length == 0) {
                return;
            }
            var eNums = eSlide.find('.slide-num a');
            var isStop = false, oldIndex = 0, curIndex = 0, attr = opts.attr, itemCount = eNums.length;
            if (itemCount < 2) {
                eNums.hide();
            }
            if(opts.addBtn){
                addBtn();
            }
            // 点击按钮切换效果
            eNums.mouseenter(function () {
                curIndex = $(this).index();
                setCurrent();
            });


            // 设置当前切换的效果
            function setCurrent() {
                eNums.eq(curIndex).addClass('hover').siblings("a").removeClass("hover");
                var curItem = eSlideItems.eq(curIndex);
                var oldItem = eSlideItems.eq(oldIndex);
                var dataImg = curItem.attr(attr);
                if (dataImg) {
                    BBG.IMG.load(dataImg, function () {
                        //设置图片
                        curItem.css({
                            'background-image': 'url(' + dataImg + ')'
                        });
                        //去除图片地址，防止反复加载
                        curItem.removeAttr(attr);
                    });
                }
                // 大图切换
                if (oldIndex != curIndex) {
                    oldItem.stop().animate({
                        opacity: 0,
                        'z-index': 1
                    }, 1000);
                }
                curItem.stop().animate({
                    opacity: 1,
                   'z-index': 9
                }, 1000);
                //交换位置
                oldIndex = curIndex;
            }
            // 自动轮播判断
            function autoSlide() {
                if (opts.duration > 0) {
                    eSlide.mouseenter(function () {
                        isStop = true;
                    });
                    eSlide.mouseleave(function () {
                        isStop = false;
                    });
                    setInterval(function () {
                        if (!isStop) {
                            toggleNext(true);
                        }
                    }, opts.duration);
                }
            }

            function toggleNext (flag){
                if(flag){
                    curIndex++;
                    if (curIndex >= itemCount) {
                        curIndex = 0;
                    }
                }else{
                    curIndex--;
                    if (curIndex < 0) {
                        curIndex = itemCount-1;
                    }
                }
                setCurrent();
            }

            function addBtn (){
                //添加按钮容器
                var leftBtn = $('<a class="arrow-l jImgLeft" href="javascript:;"><em></em><i class="icon iconfont"></i></a>').appendTo(eSlide);
                var rightBtn =$('<a class="arrow-r jImgRight" href="javascript:;"><em></em><i class="icon iconfont"></i></a>').appendTo(eSlide);
                //绑定事件
                leftBtn.on("click",function(){
                    toggleNext(false);
                });
                rightBtn.on("click",function(){
                    toggleNext(true);
                });
            }

            autoSlide();
        }
    };
});
