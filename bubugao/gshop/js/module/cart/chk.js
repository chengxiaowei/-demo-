/**
 * @description 复选框
 * @author licuiting 250602615@qq.com
 * @date 2015-02-10 16:04:30
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var com = require('module/cart/common')();
    // 购物车容器
    var eCart = $('#jCart');
    //class
    function Chk(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    Chk.prototype = {
        defaultSetting: {
            selector: ''
        },
        // 购物车初始化
        init: function() {
            this.setChk();
            this.event();
        },
        /**
         * 选中购物车
         */
        check : function(btn) {
            var self = this;
            var info = btn.getProducts();
            com.ajax(com.url.checked, { productId : info.productId },function( data ){
                com.refreshCartModule( data );
                self.setChk();
            });
        },
        // 选择当前
        chkCur: function(btn) {
            var eTable = btn.parents('.jTable'),
                eChk = eTable.find('.jChkItem');
            if (!$(this).prop('disabled')) {
                eChk.prop('checked', true);
                this.setChk();
            }
        },
        // 判断是否全选中
        setChk: function() {
            this.isChkCatAll();
            this.isChkAll();
        },
        // 判断分类全选
        isChkCatAll: function() {
            var eChkCat = eCart.find('.jChkCat');
            eChkCat.each(function() {
                var $this = $(this),
                    eChkItem = $this.closest('.list').find('.jChkItem'),
                    len = eChkItem.length,
                    chkCount = 0,
                    disCount = 0;
                eChkItem.each(function() {
                    if ($(this).prop('checked')) {
                        chkCount++;
                    }
                    if ($(this).prop('disabled')) {
                        disCount++;
                    }
                });
                if (len == chkCount + disCount && disCount != len) {
                    $this.prop('checked', true);
                } else {
                    $this.prop('checked', false);
                }
            });
            this.isChkAll();
        },
        // 判断全选
        isChkAll: function() {
            var eChkAll = eCart.find('.jChkAll'); //全选按钮
            var $chk = eCart.find('.jChkItem:not(:disabled)'); //二级商品checkbox
            var chk_len = $chk.length; //总个数
            var chked_len = $chk.filter(':checked').length; //选中的
            eChkAll.prop('checked', (chk_len != 0 && chked_len == chk_len));
        },
        event : function(){
            var self = this;
            // 全部全选
            eCart.on("click", ".jChkAll", function() {
                var $this = $(this), eChkItem = eCart.find('.jChkItem'), isChecked = $this.prop('checked');
                if ($this.hasClass(com.disClass)) {
                    return;
                }
                eChkItem.each(function() {
                    var $this = $(this);
                    if (!$this.prop('disabled')) {
                        $this.prop('checked', isChecked);
                    }
                });
                //self.setChk();
                self.check(eCart.find('.jChkItem'));
            });

            // 分类全选
            eCart.on("click", ".jChkCat", function() {
                var $this = $(this), eChkItem = $this.closest('.list').find('.jChkItem'), isChecked = $this.prop('checked');
                if ($this.hasClass(com.disClass)) {
                    return;
                }
                eChkItem.each(function() {
                    var $this = $(this);
                    if (!$this.prop('disabled')) {
                        $this.prop('checked', isChecked);
                    }
                });
                //self.setChk();
                self.check(eCart.find('.jChkItem'));
            });

            // 单选
            eCart.on('click', '.jChkBox', function(e){
                var $tg = $(e.target);
                var $this = $(this).find('.jChkItem');
                var ischk = $this.is(':checked');
                if ($this.is(':disabled')) {
                    return;
                }
                if(!$tg.hasClass('jChkItem')){
                    $this.prop('checked',ischk?false:true);
                }
                //self.setChk();
                self.check(eCart.find('.jChkItem'));
            })
        }
    }
    return function(opt) {
       return new Chk(opt);
    }
});