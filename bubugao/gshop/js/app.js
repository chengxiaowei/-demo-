require.config({
    baseUrl: '//s1.bbgstatic.com/gshop/js',
    paths: {
        'lib': '//s1.bbgstatic.com/lib',
        'jquery': '//s1.bbgstatic.com/lib/zeptojs/1.1.5/zepto',
        'url': '//s1.bbgstatic.com/gshop/js/url'
    }
});
if (!Function.prototype.bind) {
    require(['lib/es5-shim/4.0.3/es5-shim']);
}