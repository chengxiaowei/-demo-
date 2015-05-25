define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var cart = require('module/add-to-cart/addcart');
    var io = require('common/kit/io/request');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var Dialog = require('common/ui/dialog/dialog');
    var goodsNotice = require('module/add-to-cart/goods-notice');

    var search = require('module/search/search');
    var top = require('module/common/to-top');

    top.init();
    // search module
    search();

//  window.onpopstate = function(event) {
//   alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
// };
    //更新购物车
    cart.getcart();

    //  加入购物车
    $('.goods-list').on('click', '.jAdd2Cart', function() {
        var _this = $(this);
        var id = _this.closest('li').attr('data-id');
        cart.addcart(id, '1', _this);
    });


    //  到货通知
    goodsNotice('', '.jArrival');


    var urlArgument2Obj = function() {
        var o     = {},
            urlA  = window.location.search.replace(/^[?]/, '').split('&'),
            key   = '',
            value = '';

        for (var ia = 0, len = urlA.length; ia < len; ia = ia + 1) {
            if (urlA[ia] !== '') {
                key   = urlA[ia].split('=')[0];
                value = urlA[ia].split('=')[1];
                o[key] = decodeURIComponent(value);
            }
        }
        return o;
    };

    //  初始化懒加载
    new Lazyload('img.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url'
    });

    var lazyMore = function() {
        new Lazyload('.goods-list .jPage', {
            type: 'html',
            placeholder: '<div class="loading">正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                var data = {};

                data           = urlArgument2Obj();
                data.p         = page;
                data.page_type = 'search';

                if(!$(el).hasClass('load')) {
                    var src = '/Search/get_page_data';
                    io.jsonp(src, data, function(res) {
                        if (res.data !== '') {
                            var html = window.unescape(res.data);
                            $(el).html(html).addClass('load');
                            $(el).after('<div class="jPage jProd'+(Number(page)+1)+'" data-page="'+(Number(page)+1)+'"></div>');
                            lazyMore();

                            var dataid = $(el).find('.load li'),
                                ayId = [];
                            for (var i = 0; i < dataid.length; i++) {
                                ayId.push(dataid.eq(i).attr('data-id'));
                            }
                            var data = {
                                'productid_str': '' + ayId + ''
                            };
                            io.get('/Promotion/productInfo', data, function(data) {
                                for (var i = 0; i < data.length; i++) {
                                    if(data[i].price.Mprice != ''){
                                        $(el).find('.load [data-node-type=pri]').eq(i).text('￥'+data[i].price.Mprice+'');
                                    }
                                    if(data[i].showWapicon){
                                        $(el).find('.load [data-node-type=channel-pri]').eq(i).show();
                                    }
                                    var tagStr = "";
                                    for (var j = 0; j< data[i].productTag.length ; j ++) {
                                        tagStr += '<span>'+data[i].productTag[j]+'</span>';
                                    };
                                    tagStr += '<span>'+data[i].downTag+'</span>';
                                    $(el).find('.load [data-node-type=tags]').eq(i).html(tagStr);
                                };
                            },function(e){
                                Dialog.tips(e.msg);
                            });
                        } else {
                            $(el).find('.loading')
                            .html('已经没有下一页了').removeClass('loading')
                            .addClass('loaded-all');
                        }
                    },function(){
                        $(el).find('.loading').html('网络错误，点击重试').attr('id','jNetError');
                    });
                }
            }
        });
    };
    lazyMore();

    //列表加载网络出错，重试
    $('body').on('click','#jNetError',function(){
        lazyMore();
    })

    //营销数据
    var dataid = $('.load li'),
        ayId = [];
    for (var i = 0; i < dataid.length; i++) {
        ayId.push(dataid.eq(i).attr('data-id'));
    }
    var data = {
        'productid_str': '' + ayId + ''
    };
    io.get('/Promotion/productInfo', data, function(data){

        for (var i = 0; i < data.length; i++) {
            if(data[i].price.Mprice != ''){
                $('.load [data-node-type=pri]').eq(i).text('￥'+data[i].price.Mprice+'');
            }
            if(data[i].showWapicon){
                $('.load [data-node-type=channel-pri]').eq(i).show();
            }
            var tagStr = "";
            for (var j = 0; j< data[i].productTag.length ; j ++) {
                tagStr += '<span>'+data[i].productTag[j]+'</span>';
            };
            tagStr += '<span>'+data[i].downTag+'</span>';
            $('.load [data-node-type=tags]').eq(i).html(tagStr);
        };
    },function(e){
        Dialog.tips(e.msg);
    });


    //  choose show animate
    $('.jChooseShow').on('click', function() {
        window.location.hash = "filter";
        var div = $('.page-view');

        var animateClass = div.attr('data-animate');
        if ($('html').hasClass(animateClass)) {
            $('html').removeClass(animateClass);

        } else {
            $('html').addClass(animateClass);
        }

        window.onhashchange = function(){
            if(location.hash==""){
                closeFilter();
            }
        };
    });
    //  close choose
    function closeFilter(){
        var div = $('.page-view');
        var animateClass = div.attr('data-animate');
        $('html').removeClass(animateClass);
    }

    $('.choose .jClose').on('click', function() {
        window.history.back(-1);
    });

    //  toggle show and hide
    $('.choose dt').on('click', function() {
        var div = $(this).siblings('dd').find('ul');
        $(this).parent().toggleClass("choose-open");
        var li = div.find('li');

        if (div.height() === 0) {
            div.height(li.height() * li.length);
        } else {
            div.height(0);
        }
    });

    //  choose url
    (function() {
        //  base url
        var url = window.location.href.replace(/[?#].*?$/, '');

        //  clear all
        $('.jChooseClear').on('click', function() {
            $('.jCon').removeClass('active');
            $('[data-node-type=choose-pros]').text("");
            $('#jConhs').attr('data-value', '3');
        });


        //  add condition
        $('.jCon').on('click', function() {
            var $this = $(this);
            var closestDl = $this.closest('dl');
            var closestDt = $this.closest('dt');
            $this.toggleClass('active');
            if (closestDl.find('dt').attr('data-type') === 'l,r') {
                $this.siblings('li').removeClass('active');

            } else if (closestDt.attr('data-type') === 'hs') {
                if (closestDt.hasClass('active')) {
                    closestDt.attr('data-value', '1');
                } else {
                    closestDt.attr('data-value', '3');
                }
            }

            // 填充选中的属性数值
            var args = [];
            $this.parent().children('li').each(function(k, v){
                if($(v).hasClass("active")){
                    args.push($(v).children("span").text());
                }
            });
            closestDl.find('dt [data-node-type=choose-pros]')?closestDl.find('dt [data-node-type=choose-pros]').text(args.join("，")):"";
        });

        var o = urlArgument2Obj();

        //  commit
        $('.jChooseCommit').on('click', function() {
            $('._wap-choose dt').each(function(i) {
                var a = $(this).attr('data-type')?$(this).attr('data-type').split(','):[];
                for (var i = 0, len = a.length; i < len; i = i + 1) {
                    if (o.hasOwnProperty(a[i])) {
                        delete o[a[i]];
                    }
                }
            });

            var s = '',
                key = '',
                value = '';

            $('._wap-choose dl').each(function(i) {
                //  是否有货
                if (i === 0) {
                    key = $(this).find('dt').attr('data-type');
                    value = $(this).find('dt').attr('data-value');

                    //  一般情况
                } else {
                    key = $(this).find('dt').attr('data-type');
                    value = '';
                    $(this).find('dd ul .active').each(function(idx) {
                        if (idx !==0 ) {
                            value += '|';
                        }
                        value += $(this).attr('data-value');
                    });
                }

                if (value !== '') {
                    //  拆分价格
                    if (key === 'l,r') {
                        o[key.split(',')[0]] = value.split(',')[0];
                        o[key.split(',')[1]] = value.split(',')[1];

                    } else if (o.hasOwnProperty(key)) {
                        o[key] += '|' + value;

                    } else {
                        o[key] = value;
                    }
                }
            });

            for (var p in o) {
                s += '&' + p + '=' + encodeURIComponent(o[p]);
            }
            window.location.href = url + s.replace('&', '?');
        });
    }());
});
