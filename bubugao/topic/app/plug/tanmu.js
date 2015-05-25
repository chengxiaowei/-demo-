/*******************************************************************************
 * 弹幕插件 add:liangyouyu 2015-1-23
 ******************************************************************************/
define(function(require, exports, module) {
    'use strict';

    // requestAnimationFrame  兼容写法
    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    // canvas动画引擎 start
    var animationEngine = function(setting) {
        this.context = null;
        this.blastZone = {
            width: 800,
            height: 600
        };
        this.particle = tM;// 引用页面中tm弹幕对象
        this.particles = []; // 页面元素集合
        this.maxParticles = 12; // 单页面最多元素
        this.paused = false;
        this.fultures = []; //更新的弹幕项目 ！！！可以异步更改

        this.setCanvas(setting.canvas);
        this.initData(setting.tmData);
    };

    animationEngine.prototype.setCanvas = function(canvas) {
        function getSize(dom) {
            var width = dom.style.width || dom.clientWidth || dom.offsetWidth || dom.scrollWidth;
            var height = dom.style.height || dom.clientHeight || dom.offsetHeight || dom.scrollHeight;
            return {
                width: width,
                height: height
            };
        }

        this.canvas = canvas;
        this.canvas.width = getSize(canvas).width;
        this.canvas.height = getSize(canvas).height;
        this.context = canvas.getContext('2d');
        this.setBlastZone(this.canvas.width, this.canvas.height);
    };
    animationEngine.prototype.setMaxParticles = function(count) {
        // initData 在setMaxParticles 之前
        if (this.particles > 0) {
            count = this.particles.length > count ? count : this.particles.length;
        }
        this.maxParticles = count;
    };
    animationEngine.prototype.setBlastZone = function(width, height) {
        this.blastZone = {
            width: width,
            height: height
        }
    };
    animationEngine.prototype.start = function() {
        var self = this;
        renderLoop(); // call animation frame to start
        function renderLoop() {
            if (!self.paused) {
                self.frameUpdate(self);
                self.applyActions();
            }
            self.fpsId = window.requestAnimationFrame(renderLoop);
        }
    };
    animationEngine.prototype.pause = function() {
        window.cancelAnimationFrame(this.fpsId);
    };
    animationEngine.prototype.stop = function() {
        this.pause();
        this.clear();
    };
    // 清除画布
    animationEngine.prototype.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    // 初始化画布上元素
    animationEngine.prototype.initParticle = function(configArray) {
        var p;
        for (var i = 0; i < configArray.length; i++) {
            p = new this.particle(configArray[i], this);
            p.randomize(this.blastZone);
            while (!this.crossTest(this.particles, p)) {
                p.randomize(this.blastZone);
            }
            this.particles.push(p);
        }
    };
    // 添加元素
    animationEngine.prototype.addParticle = function(config) {
        var p;
        // 非本地填写的弹幕
        if (config.type != 1) {
            if (this.particles.length < this.maxParticles) {
                // 有候补项
                if (this.fultures.length > 0) {
                    config = this.fultures.pop();
                }
                // 没有候补项
                else {
                    if (!config) {
                        var array = this.particles.splice(0, 1);
                        config = array[0].metaData;
                        array[0].destory();
                    }
                }
            } else {
                // 有候补项
                if (this.fultures.length > 0) {
                    config = this.fultures.pop();
                }
                // 没有候补项目  自己循环
                else {
                    if (!config) {
                        var array = this.particles.splice(0, 1);
                        config = array[0].metaData;
                        array[0].destory();
                    }
                }
            }
            p = new this.particle(config, this);
            p.randomize(this.blastZone);
            while (!this.crossTest(this.particles, p)) {
                p.randomize(this.blastZone);
            }
            this.particles.push(p);
        }
        //本地填写的弹幕 重新add到画布上
        else {
            p = new this.particle(config, this);
            p.randomize(this.blastZone);
            while (!this.crossTest(this.particles, p)) {
                p.randomize(this.blastZone);
            }
            if (this.particles[this.maxParticles - 1]) {
                var oldP = this.particles[this.maxParticles - 1];
                this.particles[this.maxParticles - 1] = p;
                this.particles.push(oldP);
            } else {
                this.particles.push(p);
            }
        }
    };
    // 画画
    animationEngine.prototype.draw = function() {
        this.clear();
        var i = this.maxParticles;
        // 只显示屏幕可接受的个数
        while (i--) {
            this.particles[i].draw(this.context, this);
        }
    };
    // 更新元素位置
    animationEngine.prototype.update = function() {
        var p, config;
        var i = this.maxParticles;

        while (i--) {
            p = this.particles[i];
            p.update();
            if (p.x < 0 - p.width) {
                var array = this.particles.splice(i, 1);
                config = array[0].metaData;
                array[0].destory();
                this.addParticle(config);
            }
        }
    };
    // 应用元素行进中变化 例如：速度的变化
    animationEngine.prototype.applyActions = function() {
        var i = this.maxParticles;
        while (i--) {
            this.particles[i].action();
        }
    };
    // 第一次运行，生成随机个数元素
    animationEngine.prototype.initData = function(objArray) {
        this.maxParticles = objArray.length > this.maxParticles ? this.maxParticles : objArray.length;
        this.initParticle(objArray);
    };
    // 更新整个画布状态  包含（元素个数，元素坐标，画画）
    animationEngine.prototype.frameUpdate = function(self) {
        self.update();
        self.draw();
    };
    // 碰撞检测
    animationEngine.prototype.crossTest = function(otherParticles, particle) {
        var t = ((particle.x + particle.width) / particle.velocity.x) | 0; // 元素在页面上的时间
        var count = otherParticles.length > this.maxParticles ? this.maxParticles : otherParticles.length;
        for (var i = count - 1; i >= 0; i--) {
            // y 轴坐标接近  有可能重叠
            if (Math.abs(otherParticles[i].y - particle.y) < particle.fontSize) {
                //particle 在 otherParticles 后面出现
                if (otherParticles[i].x < particle.x) {
                    // 出现的位置出现重叠
                    if (particle.x - otherParticles[i].x <= otherParticles[i].width) {
                        return false;
                    } else {
                        // 元素行进到屏幕最边缘是否会追赶上 出现与其他元素重叠
                        if (otherParticles[i].x + otherParticles[i].width - otherParticles[i].velocity.x * t >= particle.x - particle.velocity.x * t) {
                            return false;
                        }
                    }
                } else if (otherParticles[i].x > particle.x) {
                    // 出现的位置出现重叠
                    if (otherParticles[i].x - particle.x <= particle.width) {
                        return false;
                    } else {
                        // 元素行进到屏幕最边缘是否会追赶上 出现与其他元素重叠
                        if (particle.x + particle.width - particle.velocity.x * t >= otherParticles[i].x - otherParticles[i].velocity.x * t) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        };
        return true;
    };
    // 本地填写的
    animationEngine.prototype.addMyText = function(config) {
        if (config) {
            config.type = 1
        };
        var p = new this.particle(config, this);
        p.fontSize += 4;
        p.width = p.fontSize * p.fillText.length;
        p.randomize(this.blastZone);
        p.x = this.blastZone.width;
        while (!this.crossTest(this.particles, p)) {
            p.randomize(this.blastZone);
            p.x = this.blastZone.width;
        }
        if (this.particles[this.maxParticles]) {
            var oldP = this.particles[this.maxParticles];
            this.particles[this.maxParticles] = p;
            this.particles.push(oldP);
        } else {
            this.particles.push(p);
        }
    }
    animationEngine.prototype.deepCopy = function(source) {
        var result = {};
        for (var key in source) {
            result[key] = typeof source[key] === 'object' ? this.deepCopy(source[key]) : source[key];
        }
        return result;
    }

    window.animationEngine = animationEngine;

    //canvas动画引擎 end


    // 弹幕元素
    var tM = function(config, animationEngine) {
        this.metaData = config;
        this.x = 0;
        this.y = 0;
        this.alpha = 1;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.type = config.type ? config.type : 0; // 当等于1时候永不清楚
        this.fillText = config.text;
        this.fontSize = config.fontSize ? config.fontSize : 20; // 字体大小 单位像素
        this.width = this.fillText.length * this.fontSize;
        this.fontColor = config.fontColor ? config.fontColor : "rgb(255,0,255)";
        //this.width = null;
        this.cacheCanvas = document.createElement("canvas");
        // 设置缓存canvas 宽度
        this.cacheCanvas.width = (animationEngine.blastZone.width / 2) | 0;
        this.cacheCanvas.height = this.fontSize + 10;
        this.cacheCtx = this.cacheCanvas.getContext("2d");
        this.cacheCtx.save();
        this.cacheCtx.font = 'bold ' + this.fontSize + 'px Tahoma,Microsoft YaHei';
        this.cacheCtx.fillStyle = this.fontColor;
        this.cacheCtx.fillText(this.fillText, 0, this.fontSize, this.cacheCanvas.width);
        this.cacheCtx.restore();

        // 画画
        this.draw = function(c, animationEngine) {
            c.globalAlpha = this.alpha;
            c.drawImage(this.cacheCanvas, this.x, this.y);
            c.globalAlpha = 1;
        };
        // 更新坐标
        this.update = function() {
            this.x -= this.velocity.x;
        };
        // 获得初始位置
        this.getLocation = function(z) {
            var p = {};
            p.x = ((Math.random() * 2 + 1) * z.width) | 0;
            p.y = ((Math.random() * (z.height - this.fontSize) / this.fontSize) | 0) * this.fontSize;
            return p;
        };
        // 生成随机数
        this.randomRange = function(low, high) {
            return (Math.random() * (high - low)) + low;
        };
        // 随机生成元素状态
        this.randomize = function(zone) {
            var s = this.getLocation(zone);
            this.x = s.x;
            this.y = s.y;
            this.velocity = {
                x: this.randomRange(2, 5),
                y: 0
            }
        };
        // 元素行进中 状态动作  可以实现 速度的动态变化
        this.action = function() {
            // 运行中改变速度
            if (this.x < 0) {
                if (this.alpha < 0.04) {
                    this.alpha = 0;
                } else
                    this.alpha -= 0.004;
            }
        };
        // 资源回收
        this.destory = function() {
            this.cacheCtx = null;
            this.cacheCanvas = null;
            this.metaData = null;
        }
    }
});