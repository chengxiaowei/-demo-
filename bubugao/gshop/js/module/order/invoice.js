/**
* @description 发票信息
* @author licuiting 250602615@qq.com
* @date 2014-11-05 10:17:06
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var com = require('module/order/common')();
    var cookie = require('common/kit/io/cookie');
    //class
    function Invoice(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    Invoice.prototype = {
        defaultSetting: {
			
        },
        init : function() {
			this.bindEvent();
		},
		// 绑定事件
		bindEvent : function() {
			var _self = this;
			// 发票信息列表
			com.o.on('click', '#jInvoice', function(){
                cookie('taxType',$.trim($('#jTaxType').attr('data-type')));
                cookie('taxContent',$.trim($('#jTaxContent').text()));
                cookie('taxTitle',$.trim($('#jTaxTitle').text()));
                var str = ($('#jPayType').length!=0?'?delivery='+$('#jPayType').val():'');
                location.href = 'modify-invoice.html'+str;
            })
		}
    }
    return function( opt ){
        new Invoice( opt );
    }
});