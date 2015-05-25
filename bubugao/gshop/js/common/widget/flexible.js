// flexible.js
!function(window) {
    var dpr, scale, timer, match,
        document = window.document,
        navigator = window.navigator,
        docEl = document.documentElement,
        viewport = document.querySelector('meta[name="viewport"]'),
        flexible = document.querySelector('meta[name="flexible"]');
    function resize() {
        var width = docEl.getBoundingClientRect().width, rem;
        width / dpr > 640 && (width = 640 * dpr), rem = width / 16, docEl.style.fontSize = rem + 'px', window.rem = rem;
    }
    function isWeiXin() {
        var ua = navigator.userAgent.toLowerCase(); 
        return /micromessenger/.test(ua);
    }
    if (viewport) {
        match = viewport.getAttribute('content').match(/initial\-scale=(["']?)([\d\.]+)\1?/);
        match && (scale = parseFloat(match[2]), dpr = parseInt(1 / scale))
    } else if (flexible) {
        match = flexible.getAttribute('content').match(/initial\-dpr=(["']?)([\d\.]+)\1?/);
        match && (dpr = parseFloat(j[2]), scale = parseFloat((1 / dpr).toFixed(2)))
    }
    if (!dpr && !scale) {
        dpr = window.devicePixelRatio;
        dpr = (navigator.appVersion.match(/android/gi) || navigator.appVersion.match(/iphone/gi)) ? dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1 : 1;
        scale  = 1 / dpr;
    }
    docEl.setAttribute('data-dpr', dpr);
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', 'width=device-width, target-densitydpi=high-dpi, initial-scale='+scale+', maximum-scale='+scale+', minimum-scale='+scale+', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(viewport)
        } else {
            var wrap = document.createElement('div');
            wrap.appendChild(viewport);
            document.write(wrap.innerHTML)
        }
    }
    window.dpr = dpr;
    window.addEventListener('resize', function() {
        clearTimeout(timer), timer = setTimeout(resize, 300)
    }, false);
    window.addEventListener('pageshow', function(window) {
        window.persisted && (clearTimeout(timer), timer = setTimeout(resize, 300))
    }, false);
    if ('complete' === document.readyState) {
        document.body.style.fontSize = 12 * dpr + 'px'
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.style.fontSize = 12 * dpr + 'px'
        }, false)
    }
    resize();
}(window);
