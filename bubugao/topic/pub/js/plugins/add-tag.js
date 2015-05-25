/**
* @description 添加tag
* @author licuiting 250602615@qq.com
* @date 2014-12-23 17:45:35
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var bbg = require('../core/bbg');
    var URL = {
       getPrefer:'http://api.mall.yunhou.com/product/productInfo'
    };
    //class
    function AddTag(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    AddTag.prototype = {
        defaultSetting: {
            url : URL.getPrefer,
            parent : '',//父级对象(ps:为jquery对象)
            //url : 'http://localhost:8000/mall/list/getPrefer.php',
            selector : '#prefer-'//前缀
        },
        init:function(){
            this._addTag();
        },
        //获取产品id的集合,并以逗号隔开
        getProductId : function(){
            var self = this;
            var isHasParent = (self.parent!='');
            var $sel = $('[id^=prefer-]');
            var $selector = isHasParent?self.parent.find('[id^=prefer-]'):$sel;
            var ar = [];
            ar = $selector.map(function(){
                return $(this).attr('id').replace('prefer-','');
            }).get();
            ar = $.unique( ar );
            return ar.join(',');
        },
        _addTag : function(){
            var self = this;
                BBG.AJAX.jsonp({
                    url : self.url,
                    data : {
                        productid_str : self.getProductId()
                    }
                },function(data){
                    $(data).each(function(i, v){
                        var productId = v.productId;
                        var productTag = v.productTag;
                        var downTag = v.downTag;
                            downTag = (downTag && downTag!='')?'['+ downTag +']':'';
                        $('[id=prefer-' + productId +']').html( downTag + self.createTagStr(productTag) );
                    });
                });
        },
        createTagStr : function( tag ){
            var str = '';
            if(tag && $.isArray(tag)){
                $.each(tag,function(i, v){
                    str += '[' + v + ']';
                });
            }
            return str;
        }
    }
    return function( opt ){
        return new AddTag( opt );
    };
});