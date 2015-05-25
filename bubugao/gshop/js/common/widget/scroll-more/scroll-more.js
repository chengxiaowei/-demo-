define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');


    var ScorllLoad = function(options) {
        this.extentOpts(options);
        this.bindEvent();
    };

    ScorllLoad.prototype = {

        opts: {
            scrollY       : $('.scroll').offset().top,
            startTop      : 0,
            startScroll   : 0,
            startPageY    : 0,
            scrollHandle  : $('.scroll'),
            startMargin   : 0,
            elLoad        : $('.load'),
            callback      :''
        },


        extentOpts: function(options) {
            // import options
            this.opts = $.extend(this.opts, options);
        },

        bindEvent: function() {
            var self = this;

            this.opts.scrollHandle
            .on('touchstart', function(e) {

                self.opts.startPageY = e.touches[0].pageY;
                self.opts.startTop = ~~$(this).css('top').replace('px', '');

            })
            .on('touchmove', function(e) {
                if (self.opts.startPageY - e.touches[0].pageY>self.opts.startMargin) {
                    $('#test').html(window.scrollY + window.innerHeight >= $(document.body).height());
                    if (window.scrollY + window.innerHeight >= $(document.body).height()) {
                        e.preventDefault();
                        self.opts.elLoad.show();
                        self.opts.startScroll = 1;
                    }else{
                        self.opts.startScroll = 0;
                    }
                }
            })
            .on('touchend', function(e) {
                if (self.opts.startScroll) {
                    self.opts.callback && self.opts.callback();
                    //self.opts.elLoad.hide();
                }
                self.opts.startScroll = 0;
            });
        }
    };

    return ScorllLoad;
});

