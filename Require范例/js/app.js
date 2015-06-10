require.config({
	baseUrl: "//127.0.0.1:8020/Require",
    paths: {
        //个人中心url请求配置
        jquery: "js/jquery/jquery"
            /**
             * 说明： 1、带下划线"_"都属于私有，不会对外暴露.
             * 2、app.js的paths配置必须和build.js的paths配置一致，注意：相对路径的不同
             */
            // "jquery"          : "public/js/jquery",
            // // 公用的url为正式,url-test为测试
            // "url"             : "mall/js/url",
            // "domReady" : "public/js/domReady",
            // "_bbg"            : "public/js/bbg",
            // "bbg"             : "mall/js/bbg",
            // "_dialog.config"  : "public/js/dialog/dialog-config",
            // "_dialog.drag"    : "public/js/dialog/drag",
            // "_dialog.popup"   : "public/js/dialog/popup",
            // "_dialog.dialog"  : "public/js/dialog/dialog",
            // "dialogPlus"      : "public/js/dialog/dialog-plus",
            // "cookie"          : "public/js/jquery.cookie",
            // // 跨域
            // "messenger"       : "public/js/messenger",
            // "imgLoading"      : "public/js/jquery.imgLoading",
            // "previewPicture"  : "public/js/jquery.previewPicture",
            // "uploadify"       : "public/js/jquery.uploadify",
            // "imgUpload"       : "public/js/jquery.imgUpload",
            // "slide"           : "public/js/jquery.slide",
            // "suggest"         : "public/js/hd/jquery.suggest",
            // "category"        : "public/js/hd/category",
            // // 验证
            // "_validate"       : "public/js/validate/jquery.validate",
            // "_validateMethod" : "public/js/validate/jquery.validate.method",
            // "validate"        : "mall/js/jquery.validate.method",
            // // 按需加载
            // "demandLoading"   : "public/js/jquery.demandLoading",
            // // 分页
            // "pager"           : "public/js/jquery.pager",
            // "comSettlement"   : "mall/js/conf/settlement/common",
            // // 公用函数
            // "common"          : "mall/js/common",
            // // 公用函数 - 新闻公告
            // "commonForNews"   : "mall/js/common-for-news",
            // // 序列化表单
            // "formParams"      : "mall/js/jquery.formParams",			
            // // 获取优惠券
            // "getCoupon"      : "mall/js/plug/get-coupon",

        // // 搜索栏目-商城公用
        // "autoSearch"      : "public/js/hd/auto-search",
        // // 热卖排行
        // "hotRank"      : "mall/js/plug/hot-rank",

        // // 模板 -全部公用
        // "template"        : "public/js/template",
        // // 倒计时 -商城公用
        // "countDown"       : "public/js/jquery.countDown",
        // // 多级联动 -全部公用
        // "linkageTab"      : "public/js/linkage-tab",
        // // 加入购物车 -商城公用
        // "addCart"         : "public/js/jquery.addCart",
        // // 顶部导航 -商城公用
        // "siteNav"         : "public/js/site-nav",
        // // 用户信息
        // "identityInfo"    : "public/js/identity-info",
        // // 搜索关键字
        // "searchKeyWord"   : "public/js/search-keyword",
        // // 到货通知-商城公用
        // "arrivalNotice"   : "mall/js/plug/arrival-notice",
        // // 迷你slide -全部公用
        // "minSlide"        : "public/js/jquery.minSlide",
        // // 购物车数量
        // "cartCount"          : "public/js/cart-count",
        // // 首页tab切换 -商城公用
        // "indexTab"        : "mall/js/plug/jquery.indexTab",
        // // 弹窗-应用层-商城公用
        // "dialog"          : "mall/js/plug/dialog",
        // // 左侧分类-商城公用
        // "leftCat"         : "mall/js/plug/left-cat",
        // // 首页选择收货地址-商城公用
        // "addressDialog"   : "public/js/address-dialog",
        // // 迷你工具条
        // "minBar"          : "mall/js/plug/min-bar",
        // // 登录框
        // "loginDialog"     : "mall/js/plug/login-dialog",
        // // 收藏店铺
        // "shopCol"         : "mall/js/plug/jquery.shopCol",
        // // 收藏商品
        // "goodsCol"        : "mall/js/plug/jquery.goodsCol",

        // // 店铺-店铺公用
        // "shopInfo"        : "mall/js/plug/shop-info",
        // // 店铺 -店铺公用
        // "shopNav"         : "mall/js/plug/shop-nav",

        // // 商品属性选择-商城公用
        //          "goodsChoose"     : "mall/js/plug/goods-choose",

        //          // 门店发货自定义地址数据
        //          "addressArr"      : "mall/js/conf/mendian-address",            // 门店发货自定义地址数据
        //          //专题-平台公用

        //          "topic"           : "mall/topic/public/script",
        //          //3D 旋转引用js插件 add liangyouyu
        //          "plaxDiy"           :"mall/js/plug/plax-diy"           
    },
    shim: {
        // "cookie" : [ "jquery" ],
        // "public/js/jquery.ba-resize" : ["jquery"]
    }
});
