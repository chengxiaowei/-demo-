define(function(require) {
    'use strict';


    var Menu = require('common/ui/menu/menu');
    var url = '/Category/get_category_data';

    var search = require('module/search/search');

    //获取购物车数量
    var getSimple = require('common/widget/get-simple');
    new getSimple();

    // search module
    search();

    //  menu module
    Menu('.ui-showcase li', url);


    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    new Lazyload('img.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url',
        load : function(self){
            if($(self).hasClass('img-error')){
                $(self).removeClass('img-error');
            }
        }
    });
});
