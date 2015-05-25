define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var Slider = function(options) {
        this.init(options);
    };

    Slider.prototype = {

        constructor: Slider,

        opts: {
            index          : 0,
            sliderTotal    : 0,
            sliderTime     : 4000,
            slideShow      : $(".ui-slider")[0],
            imgWidth       : 320,
            threshold      : 0.1,
            sliderInterval : null,
            interval       : null,
            showDots       : true,
            dotActive      : 'img/icon-slide-dot-active-480.png',
            dotNormal      : 'img/icon-slide-dot-normal-480.png',
            element        : $(".ui-slider .ui-slider-img a"),
            imgCont        : $(".ui-slider .ui-slider-img"),
            sliderDot      : $(".ui-slider .ui-slider-dot span"),
            sliderTitle    : $(".ui-slider .ui-slider-title>div"),
            flag           : false,
            goUrl          : ''
        },


        init: function(options) {

            // import options
            this.opts = $.extend(this.opts, options);

            // get the sliderTotal
            this.opts.sliderTotal = this.opts.element.length;

            // append DOM
            var first = this.opts.element.clone()[0];
            var last = this.opts.element.clone()[this.opts.sliderTotal - 1];

            this.opts.imgCont.prepend(last);
            this.opts.imgCont.append(first);

            // get img container width
            this.opts.imgWidth = this.opts.slideShow.offsetWidth;

            // set basic css proterty
            this.opts.imgCont.css({
                'transition-property'         : 'right',
                '-webkit-transition-property' : 'right'
            });

            // set position to the first image
            if (this.opts.index === 0) {
                this.opts.index = 1;
                this.opts.imgCont.css({
                    'transition-duration'         : '0s',
                    '-webkit-transition-duration' : '0s',
                    right: this.translateX()
                });
            }

            // showDot
            if (this.opts.showDots) {
                this.showDots();

            }

            // bind touch event
            this.touchBind();

            // start setInterval;
            this.start();
        },

        start: function() {
            this.setSliderInterval();
        },

        refreshDots: function() {
            this.opts.sliderDot = $(this.opts.sliderDot.selector);
        },

        showDots: function() {
            var str = '';
            for (var i = 0, len = this.opts.sliderTotal; i < len; i = i + 1) {
                if (i === 0) {
                    str += '<span class="active"> </span>';
                } else {
                    str += '<span> </span>';
                }
                $('.ui-slider-dot').html(str);
            }
            this.refreshDots();
        },

        setSliderInterval: function() {
            var self = this;
            if(self.opts.flag) return;
            self.opts.sliderInterval = setInterval(function() {
                self.next();
            }, self.opts.sliderTime);
        },

        clearSliderInterval: function() {
            var self = this;
            if(self.opts.flag) return;
            clearInterval(self.opts.sliderInterval);
        },

        next: function() {
            this.to(1);
        },

        pre: function() {
            this.to(-1);
        },

        to: function(pos, t) {
            var self = this;
            var time = t || 1;

            //  change title and dot
            setTimeout(function() {
                //  change title
                self.opts.sliderTitle.hide();
                self.opts.sliderTitle.eq(self.opts.index - 1).show();

                // change dot
                self.opts.sliderDot.removeClass('active');
                self.opts.sliderDot.eq(self.opts.index - 1).addClass('active');
            }, time * 1000);

            self.opts.index = self.opts.index + pos;

            var p = self.translateX();

            self.opts.imgCont.css({
                'transition-duration'         : time + 's',
                '-webkit-transition-duration' : time + 's',
                'right'                       : p
            });

            self.opts.index = (self.opts.index - 1 + self.opts.sliderTotal ) % self.opts.sliderTotal + 1;
            if ((pos === 1 && self.opts.index === 1) || (pos === -1 && self.opts.index === self.opts.sliderTotal)) {

                p = self.translateX();
                setTimeout(function(){
                    self.opts.imgCont.css({
                        'transition-duration'         : '0s',
                        '-webkit-transition-duration' : '0s',
                        'right'                       : p
                    });
                }, time * 1000);
            }
        },

        translateX: function(p) {
            var pos = p || 0;
            this.opts.imgWidth = this.opts.slideShow.offsetWidth;
            pos += this.opts.index * this.opts.imgWidth;
            return pos + 'px';
        },

        touchBind: function() {
            var self = this;

            var touchStartX,
                touchNowX;

            self.opts.imgCont.on('touchstart', function(e) {

                // clear the slider interavl
                self.clearSliderInterval();

                touchStartX = e.touches[0].pageX;

                //  set transition-duration to 0s
                $(this).css({
                    'transition-duration'         :  '0s',
                    '-webkit-transition-duration' :  '0s'
                });

            }).on('touchmove', function(e) {

                touchNowX = e.touches[0].pageX;

                if (Math.abs(touchNowX - touchStartX) > 10) {
                    e.preventDefault();
                    
                    if(self.opts.flag){
                        if (touchStartX > touchNowX) {
                            if(self.opts.index==self.opts.sliderTotal){
                                window.location.href = self.opts.goUrl;
                                return;
                            }

                        } else {
                            if(self.opts.index==1){
                                return;
                            }
                        }
                    }
                    $(this).css({
                        right: self.translateX(touchStartX - touchNowX)
                    });
                }

            }).on('touchend', function() {
                if (Math.abs(touchStartX - touchNowX) > self.opts.imgWidth * self.opts.threshold) {
                    var time =  Math.abs(1 - (Math.abs(touchStartX - touchNowX) / self.opts.imgWidth)) * 0.4;
                    if (touchStartX > touchNowX) {
                        if(self.opts.flag){
                            if(self.opts.index==self.opts.sliderTotal){
                                return;
                            }
                        }
                        self.to(1, time);

                    } else {
                        if(self.opts.flag){
                            if(self.opts.index==1){
                                return;
                            }
                        }
                        self.to(-1, time);
                    }

                } else {
                    self.to(0, 0.7);
                }
                self.setSliderInterval();

                return true;
            });
        }
    };

    return Slider;
});
