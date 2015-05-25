define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var LazyLoad = require('lib/plugins/lazyload/1.9.3/lazyload');
    var ScrollLoad = require('common/widget/scroll-load/scroll-load');
    var dialog = require('common/ui/dialog/dialog');

    new ScrollLoad({
        callback:function(){
            alert(123);
        }
    });

    var _loader = null;
    var resetLazyLoad = function(selector) {
        if (_loader) {
            _loader.destroy();
        }
        _loader = new LazyLoad(selector, {dataAttribute: 'url'});
        return _loader;
    };

    // var imgLazy = require('common/widget/imglazy/img-lazy');
    // imgLazy.imgLazy({imgEl:'.jImg'});
    resetLazyLoad('.jImg');

    $('.ui-button').on('click', function() {
        dialog.tips();
    });

    var ScrollLoad = require('common/widget/scroll-more/scroll-more');
    new ScrollLoad({
        scrollHandle: $('.mod-list .scroll'),
        callback: function() {
            $.ajax({
                url:'/js/conf/demo/message.js',
                success:function(data){
                    data = $.parseJSON(data);
                    if(data._error){
                        var opt = {
                            cnt: data._error.msg
                        }
                        dialog.tips(opt);
                        $('.scroll').off('touchmove');
                        return;
                    }
                    var str = '<div class="page-cnt" data-page="'+data.page+'">';
                    var json = data.data;
                    for(var i=0;i<json.length;i++){
                        str += '<li class="list-item">';
                        str += '<a href="'+json[i].url+'" class="list-img"><img class="jImg" src="" data-url="/'+json[i].imgUrl+'" /></a>';
                        str += '<div class="list-msg">';
                        str += '<p><a href="'+json[i].url+'">'+json[i].text+'</a></p>';
                        str += '<p class="list-time">'+json[i].time+'</p>';
                        str += '</div>';
                        str += '</li>';
                    }
                    str += '</div>';
                    $('.load').before(str);
                    // imgLazy.imgLazy({imgEl:'.jImg'});
                    resetLazyLoad('.jImg');
                }
            });
        }
    });

    var nav = require('common/ui/nav/nav');

    new nav();

    $('#on').click(function(){
        new nav({
            isScroll : false
        });
    });

    $('#off').click(function(){
        new nav({
            isScroll : true
        });
    });

    //倒计时
    var countDown = require('common/ui/count-down/jquery.countDown');

    countDown({
            targetTime: $('.jCountTime').attr('data-endTime'),
            timeText : ['',':',':','',''],
            container : '.jCountTime',
            isShowTimeText : true,
            isShowArea : true,
            type : {
                'd' : false,
                'h' : true,
                'm' : true,
                's' : true,
                'ms' : false
            },
            callback : function() {
                //倒计时为0后回调
            }
        });

});
