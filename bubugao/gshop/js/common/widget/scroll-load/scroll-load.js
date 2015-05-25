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
            positionY     : 0,
            resistance    : 3,
            maxScroll     : 80,
            startPageY    : 0,
            loadThreshold : 40,
            scrollHandle  : $('.wrap-progress .scroll'),
            loadingIcon   : $('.progress-icon'),
            loadAddCss    : 'progress-loading',
            startMargin   : 0,
            scrollBackCss : 'scroll-back',
            stabilizer    : 3,
            callback      : ''
        },


        extentOpts: function(options) {
            // import options
            this.opts = $.extend(this.opts, options);
        },

        bindEvent: function() {
            var self = this;

            this.opts.scrollHandle
            .on('touchstart', function(e) {

                // $(this).removeClass(self.opts.scrollBackCss);
                self.opts.startPageY = e.touches[0].pageY;
                self.opts.startTop = ~~$(this).css('top').replace('px', '');

            })
            .on('touchmove', function(e) {

                if (!!self.opts.startScroll || (e.touches[0].pageY - self.opts.startPageY) >= self.opts.startMargin) {
                    e.preventDefault();
                    if (!!self.opts.startScroll && Math.abs(e.touches[0].pageY - self.opts.startPageY) >= self.opts.stabilizer) {
                        var Y = self.opts.startTop + (e.touches[0].pageY - self.opts.startPageY - self.opts.startMargin) / self.opts.resistance;
                        if (Y <= self.opts.maxScroll) {
                            $(this).css('top', Y);
                        }
                        if (Y > self.opts.loadThreshold) {
                            self.opts.loadingIcon.addClass(self.opts.loadAddCss);
                        } else {
                            self.opts.loadingIcon.removeClass(self.opts.loadAddCss);
                        }
                    }
                    self.opts.startScroll = 1;
                }
            })
            .on('touchend', function(e) {
                if (self.opts.loadingIcon.hasClass(self.opts.loadAddCss)) {
                    // TODO
                    self.opts.callback && self.opts.callback();
                    self.opts.loadingIcon.removeClass(self.opts.loadAddCss);
                }
                self.opts.startScroll = 0;
                $(this).addClass(self.opts.scrollBackCss);
                $(this).css('top', 0);
            });
        }
    };

    return ScorllLoad;
});

