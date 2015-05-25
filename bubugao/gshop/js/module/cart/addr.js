/**
 * @description 地址
 * @author licuiting 250602615@qq.com
 * @date 2015-02-10 16:04:30
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //
    var com = require('module/cart/common')();
    var cookie = require('common/kit/io/cookie');
    //四级地址
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');
    //class
    function Addr(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    Addr.prototype = {
        defaultSetting: {
            selector: ''
        },
        selectedUrl : 'http://m.yunhou.com/region/getuserregion/',
        // 购物车初始化
        init: function() {
            this.getDefaultAddr();
            this.event();

        },
        event : function(){
            var self = this;
            //
            $('#jAddrPop').on('click', function(){
                self.showAddr(true);
            })
        },
        getDefaultAddr : function(){
            var self = this;
            var selData = cookie('_address');//获取默认地址
            if(!selData){
                setTimeout(function(){
                    com.ajax(self.selectedUrl, {
                        action : 'get_def_area'
                    },
                    function(data) {
                        self.setAddr(data);
                    });
                },30);
            }else{
                self.setAddr(selData);
            }
        },
        setAddr: function(data){
            if(data && data.indexOf(':')>-1){
                $('#jAddrBox').html(data.split(':')[0].split('_').join(','))
                                .attr('data-linkage-tab', data);
            }
        },
        //展示地址
        showAddr : function(isShowLink){
            //地址一
            linkageTab({
                //调用多级地址的对象
                linkageBox : $('#jAddrBox'),
                degree : 3,
                isShowLink : isShowLink,
                loaded : function(){
                    isShowLink?'':$('#_jAddrPop').remove();
                },
                //请求多级地址的url
                lastChangeCallBack : function(){
                    location.reload();
                }
            });
        }
    }
    return function(opt) {
       return new Addr(opt);
    }
});