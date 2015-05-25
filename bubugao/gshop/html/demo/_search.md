##  搜索使用方法

-   scss 引入

        @import "../../common/search/_search";

-   js 引入

        var search = require('module/search/search');
        search();

        //  完成参数
        search({
            ctx       : '.ui-header .search-mod',
            url       : 'http://api.search.yunhou.com/bubugao-search-server/api/search',
            resUrl    : '/search/index',
            searchStr : '<div id="_search-popup" data-animate="_search-popup-animate"> <div class="_wrap-search-cnt"> <div id="_search-header"> <input class="_input-cnt" id="_jSearchInput" type="text" placeholder="请输入搜索内容" > <div class="ui-button _btn-serch" id="_jSearchBtn">搜索</div> </div> <div id="_search-cnt-default"> <img src="//s1.bbgstatic.com/gshop/images/search/search-default.png" alt=""> <div class="ui-button ui-button-gray" id="_jClosePage">关闭</div> </div> <div class="_search-cnt" id="_jSearchCnt"> <ul> </ul> <div class="ui-button ui-button-gray" id="_jCloseRes">关闭</div> </div> </div> </div>',
            method    : 'bubugao.search.autoComplete.get',
            cont      : 10
        });
