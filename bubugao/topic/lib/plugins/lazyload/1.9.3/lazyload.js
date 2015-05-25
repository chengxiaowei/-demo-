/*
 * Lazy Load - A ui plugin for lazy loading images, html etc,.
 *
 * Plugin is inspired by $.lazyload by Mika Tuupola
 * - (http://www.appelsiini.net/projects/lazyload).
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
(function( root, name, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define( ['jquery'], factory );
    } else {
        // Browser globals (root is window)
        root[name] = factory(root.jQuery || root.Zepto);
    }
}(this, 'Lazyload', function( $, undefined ) {
    'use strict';

    if (!$) {
        throw 'Error: jquery api not implements.'
    }

    var win = window, $window = $(win);

    var isIOS5 = (/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion);

    /*! Based on work by Simon Willison: http://gist.github.com/292562 */
    //
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    //
    var throttle = function(fn, ms) {
        ms = (ms) ? ms : 150;
        if (ms === -1) {
            return function() {
                fn.apply(this, arguments);
            };
        }
        var last;
        return function() {
            var ctime = +new Date;
            if (!last || ctime - last > ms) {
                last = ctime;
                fn.apply(this, arguments);
            }
        };
    };

    // provide a simple event mechanism.
    var setupEventProvider = function(obj, $el) {
        obj = obj || {};
        $el = $el || $('<b />');
        $.each({'on': 'on', 'one': 'one', 'un': 'off', 'emit': 'trigger'}, function(k, v) {
            obj[k] = function() { return $el[v].apply($el, arguments); };
        });
        return obj;
    };

    // Internal loader collections,  can be extended by `registerLoader(type, fn)`;
    var _loaders = {};

    var registerLoader = function(type, fn) {
        if (!_loaders[type] && typeof fn === 'function') {
            _loaders[type] = fn;
        }
    };

    /* Register build-in loader for lazyload */

    registerLoader('image', function(elem, src, settings, next) {
        var $self = $(elem);
        $('<img />')
            .one('load', function() {

                $self.hide();
                if ($self.is('img')) {
                    $self.attr('src', src);
                } else {
                    $self.css('background-image', 'url("' + src + '")');
                }
                $self[settings.effect](settings.effectSpeed);

                next();

                // dispose
                src = undefined;
                $self = undefined;
            })
            .attr('src', src);
    });

    registerLoader('html', function(elem, src, settings, next) {
        next();
    });

    /** lazyload constructor */
    var Lazyload = function(elements, options) {
        options = options || {};
        elements = $(elements);

        var self = this, $container;
        var settings = {
            type            : 'image',
            threshold       : 0,
            failureLimit    : 0,
            event           : 'scroll',
            effect          : 'show', // cumstomize jquery effect for holder appear, defaults to show
            container       : win,
            dataAttribute   : 'src',
            skipInvisible   : true,
            appear          : null, // callback for holder appear
            load            : null, // callback for holder load
            placeholder     : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
        };

        self.elements = elements;
        self.settings = settings;

        if (!elements.length) { return; }

        // implements generic custom event APIs
        setupEventProvider(self);

        var type = options.type || settings.type;
        if (typeof _loaders[type] !== 'function') {
            throw 'Error, cannot found the specific loader for lazyload (type: `' + type + '`)';
        }
        if (type === 'html') {
            settings.placeholder = '';
        }

        if (options) {
            $.extend(settings, options);
        }

        var update = throttle(function() {
            if (elements.length > 0) {
                var counter = 0;
                elements.each(function(i, elem) {
                    var $this = $(elem);
                    if (settings.skipInvisible && !$this.is(':visible')) {
                        return;
                    }
                    if (abovethetop(elem, settings) ||
                        leftofbegin(elem, settings)) {
                            /* Nothing. */
                    } else if (!belowthefold(elem, settings) &&
                        !rightoffold(elem, settings)) {
                            $this.trigger('appear');
                            /* if we found an image we'll load, reset the counter */
                            counter = 0;
                    } else {
                        if (++counter > settings.failureLimit) { return false; }
                    }
                });
            } else {
                self.emit('destroy');
            }
        }, 10);

        var container = settings.container, event = settings.event, bindScroll = 0 === event.indexOf('scroll');

        /* Cache container as jQuery as object. */
        $container = (!container || container === win) ? $window : $(container);

        elements.each(function(i, elem) {
            var $self = $(elem);

            elem.loaded = false;

            // init lazyload items initialize viewstate.
            var placeholder = settings.placeholder;
            if (placeholder) {
                if ($self.is('img')) {
                    // If no src attribute given use data:uri.
                    var src = $self.attr('src');
                    if (!src) {
                        $self.attr('src', placeholder);
                    }
                } else {
                    // It's a empty placeholder
                    if (!$self.children()[0]) {
                        $self.html(placeholder);
                    }
                }
            }

            /* When appear is triggered load original resource . */
            $self.one('appear', function() {
                if (!elem.loaded) {

                    // original resource url
                    var original = $self.attr('data-' + settings.dataAttribute);

                    var appearFn = settings.appear;
                    if (appearFn) {
                        appearFn.apply(elem, [elem, original, elements.length, settings]);
                    }

                    // Load the resource by the typical loader.
                    _loaders[settings.type].call(elem, elem, original, settings, function() {
                        elem.loaded = true;

                        /* Remove item from array so it is not looped next time. */
                        var temp = $.grep(elements, function(element) {
                            return !element.loaded;
                        });
                        elements = $(temp);

                        var loadFn = settings.load;
                        if (loadFn) {
                            loadFn.apply(elem, [elem, original, elements.length, settings]);
                        }

                        // sync to instance
                        self.elements = elements;
                    });
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (!bindScroll) {
                $self.bind(event, function() {
                    if (!elem.loaded) { $self.trigger('appear'); }
                });
            }
        });

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (bindScroll) {
            $container.bind(event, update);
        }
        /* Check if something appears when window is resized. */
        $window.bind('resize', update);

        self.one('destroy', function() {
            if (bindScroll) {
                $container.unbind(event, update);
            }
            $window.unbind('resize', update);
            update = null;
        });

        /* With IOS5 force loading resources when navigating with back button. */
        /* Non optimal workaround. */
        if (isIOS5) {
            var pageshowFn = function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function(i, el) { $(el).trigger('appear'); });
                }
            };
            $window.bind('pageshow', pageshowFn);
            self.one('destroy', function() {
                $window.unbind('pageshow', pageshowFn);
            });
        }

        /* Force initial check if resources should appear. */
        $(document).ready(update);

        // exports api method update();
        self.update = update;
    };

    Lazyload.prototype = {
        constructor: Lazyload,
        update: function() {},
        destroy: function() {
            if (this.emit) {
                this.emit('destroy');
                this.elements.length = 0;
            }
        }
    };

    /**
     * Exports api method for register customize loader.
     *
     * @param {String} type The resource type for lazy load.
     * @param {Function} loader The resource loader function, make sure keep calling
     * the next callback.
     */
    Lazyload.register = registerLoader;

    /* utils methods {{{ */

    /* Use as Lazyload.belowthefold(element, {threshold: 100, container: window}) */

    var belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === win) {
            fold = (win.innerHeight ? win.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    var rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === win) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    var abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === win) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    var leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === win) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    var inviewport = function(element, settings) {
         return !rightoffold(element, settings) && !leftofbegin(element, settings) &&
                !belowthefold(element, settings) && !abovethetop(element, settings);
    };

    // }}}

    // Exports
    Lazyload.belowthefold = belowthefold;
    Lazyload.rightoffold = rightoffold;
    Lazyload.abovethetop = abovethetop;
    Lazyload.leftofbegin = leftofbegin;
    Lazyload.inviewport = inviewport;

    return Lazyload;
}));
