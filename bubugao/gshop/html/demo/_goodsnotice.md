##  到货通知 使用方法

-   scss

        @import "../../common/add-to-cart/_goods-notice";

-   js

        var goodsNotice = require('module/add-to-cart/goods-notice');

        //  productId   选填项，商品productId，默认为btn上的data-id数据，不填写请设置成''
        //  btn         选填项，触法该操作按钮，默认为 #jCartAdd
        goodsNotice(productId, btn);

        goodsNotice('', btn);



