function sliderImgLoad(src, fnSucceed, fnError) {
    if (BBG.IMG.isImgUrl(src)) {
        var objImg = new Image();
        objImg.src = src;
        if (objImg.complete) {
            fnSucceed && fnSucceed(objImg);
        } else {
            objImg.onload = function() {
                fnSucceed && fnSucceed(objImg);
            };
        }
        objImg.onerror = function() {
            fnError && fnError(objImg);
        };
    } else {
        fnError && fnError(null);
    }
}