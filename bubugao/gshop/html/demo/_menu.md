##  menu 使用方法

-   scss

        @import "../../common/menu/_menu";

-   js

        var Menu = require('common/ui/menu/menu');

        //  select, 可选项，触法点击的事件的DIV，该DIV应该有data-id的数据段。默认为：jCatalogue
        //  url，可选项。不填写为默认url:/Category/get_category_data
        Menu('.ui-showcase li', url);

    >   以下参考

        //  默认参数
        var defaults = {
            // dataCache: {},               //  暂时不支持  请求中不使用
            cataSelect  : 'jClassify',
            menuHandle  : '#jMenu',
            listHandle  : '#jMenuP',
            subHandle   : '#jMenuC',
            backHandle  : '#jClose',
            url         : '/Category/get_category_data',
            animateData : 'data-animate',
            menuDOM     : '<div class="wrap-menu" id="jMenu" data-animate="wrap-menu-animate"><div class="_close" id="jClose">×</div><div class="mod-menu" id="jMenuP"><ul></ul></div><div class="mod-content" id="jMenuC"><ul></ul></div></div>',
            success     : noop,
            error       : noop
        };



        //  剩下的就是请求参数了

        //  接口返回
        //  url: http://php.bubugao-inc.com/wiki/%E8%A7%A6%E5%B1%8F%E7%89%88%E4%B8%9A%E5%8A%A1#.E5.89.8D.E5.8F.B0.E5.88.86.E7.B1.BB

        [
            {
                "catId": 910001,
                "parentId": 0,
                "catName": "个人护理",
                "catPath": "0,",
                "disabled": false,
                "catSort": 1,
                "created": 1411106831000,
                "modified": 1421377593000,
                "isLeaf": false,
                "isHidden": false,
                "showCount": 20,
                "targetType": 1
            },
            {
                "catId": 910031,
                "parentId": 0,
                "catName": "家居文体",
                "catPath": "0,",
                "disabled": false,
                "catSort": 2,
                "created": 1411110366000,
                "modified": 1417575806839,
                "isLeaf": false,
                "isHidden": false,
                "showCount": 20,
                "targetType": 1
            }
        ]



