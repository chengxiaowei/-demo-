define(function(require, exports, module) {
    'use strict'; 
	
    var _  = require('pub/core/bbg');

	/**
     * 解决低版本浏览器placeholder问题
     */
    BBG.Placeholder = function(options) {
        if (('placeholder' in document.createElement('input'))) {
            return;
        }

        // options
        if (typeof options === 'string') {
            options = {
                obj : options
            };
        }
        var defaults = {
            obj : ''
        };
        options = $.extend({}, defaults, options);
        var $placeholder;
        if (options.obj) {
            $placeholder = $(options.obj).filter('[placeholder]');
        } else {
            $placeholder = $('[placeholder]');
        }

        $placeholder.focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();

        $placeholder.parents('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            })
        });
    };	

    // 低版本浏览器默认文本
    BBG.Placeholder(); 

})