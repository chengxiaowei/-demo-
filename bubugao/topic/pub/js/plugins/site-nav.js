/**
 * 顶通
 *
 * @author djune update@2014.8.7
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var linkageTab = require('./linkage-tab');
    var _imgLoading = require('./jquery.imgLoading');
    var _identityInfo = require('./identity-info');
    var _cartCount = require('./cart-count');
    var eSiteNav = $('#jSiteNav'),
        eMenu = eSiteNav.find('.jMenu');

    // 四级地址
    var URL = {
        // 请求后端，返回默认选中的地址
        selectedUrl: 'http://www.yunhou.com/api/getUserRegion',
        // 选中最后一层，请求后台存储cookie
        changeCallBackUrl: 'http://www.yunhou.com/api/setUserRegion',
        // 请求多级地址的url
        url: 'http://www.yunhou.com/api/getRegion/jsonp/'
    };

    $('#jSiteLogin').identityInfo();

    eMenu.each(function() {
        var $this = $(this),
            eMenuBd = $this.find('.menu-bd');
        $this.hover(function() {
            $this.find('.jImgPhoneCode').imgLoading();
            $this.addClass('menu-hover');
            eMenuBd.stop().slideDown();
        }, function() {
            eMenuBd.stop().slideUp(function() {
                $this.removeClass('menu-hover');
            });
        });
    });

    linkageTab({
        defaultText: '立即选择，您的地址，您做主！',
        areaId: 'jSnSelAdddressInfo',
        selector: 'jSnSelAddress',
        selectedUrl: URL.selectedUrl,
        changeCallBackUrl: URL.changeCallBackUrl,
        firstValueId: 'jProvinceId',
        url: URL.url,
        degree: 3,
        lastChangeCallBack: function(data) {
            var $indexInput = $('#jHideNav');
            var isHuNan = $('#jProvinceId').val() == 43;
            //首页,若为省外地址，默认跳转到g.yunhou.com
            if ($indexInput && $indexInput.val() == 'index' && !isHuNan) {
                location.href = 'http://g.yunhou.com';
            } else {
                location.reload();
            }
        }
    });
    return null;
});
