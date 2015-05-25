<?php
$a = $_GET['callback'];

$type = 3;

echo $a;
if($type === 1) {

?>

([
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
    },
    {
        "catId": 910052,
        "parentId": 0,
        "catName": "家庭清洁",
        "catPath": "0,",
        "disabled": false,
        "catSort": 3,
        "created": 1411111172000,
        "modified": 1417575806839,
        "isLeaf": false,
        "isHidden": false,
        "showCount": 20,
        "targetType": 1
    },
    {
        "catId": 910081,
        "parentId": 0,
        "catName": "粮油生鲜",
        "catPath": "0,",
        "disabled": false,
        "catSort": 4,
        "created": 1411112781000,
        "modified": 1417575806839,
        "isLeaf": false,
        "isHidden": false,
        "showCount": 20,
        "targetType": 1
    },
    {
        "catId": 910119,
        "parentId": 0,
        "catName": "母婴用品",
        "catPath": "0,",
        "disabled": false,
        "catSort": 5,
        "created": 1411114413000,
        "modified": 1417575806839,
        "isLeaf": false,
        "isHidden": false,
        "showCount": 20,
        "targetType": 1
    },
    {
        "catId": 910144,
        "parentId": 0,
        "catName": "食品饮料",
        "catPath": "0,",
        "disabled": false,
        "catSort": 6,
        "created": 1411115359000,
        "modified": 1417575806839,
        "isLeaf": false,
        "isHidden": false,
        "showCount": 20,
        "targetType": 1
    },
    {
        "catId": 910197,
        "parentId": 0,
        "catName": "进口商品",
        "catPath": "0,",
        "disabled": false,
        "catSort": 7,
        "created": 1411117580000,
        "modified": 1417575806839,
        "isLeaf": false,
        "isHidden": false,
        "showCount": 20,
        "targetType": 1
    },
    {
        "catId": 93780001,
        "parentId": 0,
        "catName": "前台tjtest",
        "catPath": "0,",
        "disabled": false,
        "catSort": 110,
        "created": 1423187980000,
        "modified": 1423188078000,
        "isLeaf": false,
        "isHidden": false,
        "showCount": 8,
        "targetType": 1,
        "linkUrl": ""
    },
    {
        "catId": 93780004,
        "parentId": 0,
        "catName": "rb001",
        "catPath": "0,",
        "disabled": false,
        "catSort": 1,
        "created": 1423194080000,
        "modified": 1423194390000,
        "isLeaf": false,
        "isHidden": false,
        "showCount": 12,
        "targetType": 1,
        "linkUrl": ""
    },
    {
        "catId": 93781000001,
        "parentId": 0,
        "catName": "xhbroot",
        "catPath": "0,",
        "disabled": false,
        "catSort": 1,
        "created": 1423201137000,
        "modified": 1423201137000,
        "isLeaf": true,
        "isHidden": false,
        "showCount": 3,
        "targetType": 1,
        "linkUrl": ""
    }
])
<?php
} else if($type === 0) {
?>
([])
<?php
} else {
?>
({"error":"1303","msg":"\u8be5\u5206\u7c7b\u4e0d\u5b58\u5728,id=91002","data":{"error":"1303","stack":"com.bubugao.framework.mvc.BbgCenterException: \u8be5\u5206\u7c7b\u4e0d\u5b58\u5728,id=91002\n\tat com.bubugao.goods.common.util.CenterExceptionUtil.createCenterException(CenterExceptionUtil.java:19)\n\tat com.bubugao.goods.service.validator.CategoryValidator.validateIdExsist(CategoryValidator.java:280)\n\tat com.bubugao.goods.service.validator.CategoryValidator.validateUnNeededParam(CategoryValidator.java:257)\n\tat com.bubugao.goods.service.validator.CategoryValidator.validateSearch(CategoryValidator.java:148)\n\tat com.bubugao.goods.service.compleximpl.CategoryServiceImpl.search(CategoryServiceImpl.java:204)\n\tat com.alibaba.dubbo.common.bytecode.Wrapper6.invokeMethod(Wrapper6.java)\n\tat com.alibaba.dubbo.rpc.proxy.javassist.JavassistProxyFactory$1.doInvoke(JavassistProxyFactory.java:46)\n\tat com.alibaba.dubbo.rpc.proxy.AbstractProxyInvoker.invoke(AbstractProxyInvoker.java:72)\n\tat com.alibaba.dubbo.rpc.protocol.InvokerWrapper.invoke(InvokerWrapper.java:53)\n\tat com.bubugao.framework.dubbo.FrameworkExceptionFilter.invoke(FrameworkExceptionFilter.java:31)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.AccessLogFilter.invoke(AccessLogFilter.java:199)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.TimeoutFilter.invoke(TimeoutFilter.java:42)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.monitor.support.MonitorFilter.invoke(MonitorFilter.java:65)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.protocol.dubbo.filter.TraceFilter.invoke(TraceFilter.java:78)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.ContextFilter.invoke(ContextFilter.java:60)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.GenericFilter.invoke(GenericFilter.java:112)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.ClassLoaderFilter.invoke(ClassLoaderFilter.java:38)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.EchoFilter.invoke(EchoFilter.java:38)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.bubugao.framework.eye.dubbo.EyeProviderFilter.invoke(EyeProviderFilter.java:29)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.protocol.dubbo.DubboProtocol$1.reply(DubboProtocol.java:108)\n\tat com.alibaba.dubbo.remoting.exchange.support.header.HeaderExchangeHandler.handleRequest(HeaderExchangeHandler.java:84)\n\tat com.alibaba.dubbo.remoting.exchange.support.header.HeaderExchangeHandler.received(HeaderExchangeHandler.java:170)\n\tat com.alibaba.dubbo.remoting.transport.DecodeHandler.received(DecodeHandler.java:52)\n\tat com.alibaba.dubbo.remoting.transport.dispatcher.ChannelEventRunnable.run(ChannelEventRunnable.java:82)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)\n\tat java.lang.Thread.run(Thread.java:745)\n","msg":"\u8be5\u5206\u7c7b\u4e0d\u5b58\u5728,id=91002"},"ver":"1.0"})
<?php
}
?>
