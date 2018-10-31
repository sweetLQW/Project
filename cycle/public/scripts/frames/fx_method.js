//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($, undefined){
    var prefix = '', eventPrefix,    // prefix浏览器前缀 -webkit等，eventPrefix事件前缀
        vendors = { Webkit: 'webkit', Moz: '', O: 'o' }, //前缀数据源 不包含IE
    testEl = document.createElement('div'),  //临时DIV容器
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, //变形检测
        transform,     //变形
        transitionProperty, transitionDuration, transitionTiming, transitionDelay,//过渡
        animationName, animationDuration, animationTiming, animationDelay,     //动画
        cssReset = {}

    //将驼峰字符串转成css属性，如aB-->a-b
    function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
    //修正事件名
    function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }


    /**
     * 根据浏览器内核，设置CSS前缀，事件前缀
     * 如-webkit， css：-webkit-  event:webkit
     * 这里会在vendors存储webkit，moz，o三种前缀
     */
    $.each(vendors, function(vendor, event){
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            prefix = '-' + vendor.toLowerCase() + '-'
      eventPrefix = event
            return false
        }
    })

    transform = prefix + 'transform'     //变形
    //过渡
    cssReset[transitionProperty = prefix + 'transition-property'] =
        cssReset[transitionDuration = prefix + 'transition-duration'] =
        cssReset[transitionDelay    = prefix + 'transition-delay'] =
        cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
        cssReset[animationName      = prefix + 'animation-name'] =
        cssReset[animationDuration  = prefix + 'animation-duration'] =
        cssReset[animationDelay     = prefix + 'animation-delay'] =
        cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

    /**
     * 动画常量数据源
     * @type {{off: boolean, speeds: {_default: number, fast: number, slow: number}, cssPrefix: string, transitionEnd: *, animationEnd: *}}
     */
    $.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined), //能力检测是否支持动画，具体检测是否支持过渡，支持过渡事件
        speeds: { _default: 400, fast: 200, slow: 600 },
        cssPrefix: prefix,                                //css 前缀  如-webkit-
        transitionEnd: normalizeEvent('TransitionEnd'), //过渡结束事件
    animationEnd: normalizeEvent('AnimationEnd')     //动画播放结束事件
}

    /**
     * 创建自定义动画
     * @param properties  样式集
     * @param duration 持续事件
     * @param ease    速率
     * @param callback  完成时的回调
     * @param delay     动画延迟
     * @returns {*}
     */
    $.fn.animate = function(properties, duration, ease, callback, delay){
        //参数修正，传参为function(properties,callback)
        if ($.isFunction(duration))
            callback = duration, ease = undefined, duration = undefined
        if ($.isFunction(ease))  //传参为function(properties,duration，callback)
            callback = ease, ease = undefined
        if ($.isPlainObject(duration))  //传参为function(properties,｛｝)
            ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
        // duration 数字：持续时间  字符串：取speeds: { _default: 400, fast: 200, slow: 600 }对应数字
        if (duration) duration = (typeof duration == 'number' ? duration :
            ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000     //动画持续时间默认值
        if (delay) delay = parseFloat(delay) / 1000    //延迟时间，除以1000转换成s
        return this.anim(properties, duration, ease, callback, delay)
    }

    /**
     * 动画核心方法
     * @param properties  样式集
     * @param duration 持续事件
     * @param ease    速率
     * @param callback  完成时的回调
     * @param delay     动画延迟
     * @returns {*}
     */
    $.fn.anim = function(properties, duration, ease, callback, delay){
        var key, cssValues = {}, cssProperties, transforms = '',      // transforms 变形   cssValues设置给DOM的样式
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
            fired = false

        //修正持续时间
        if (duration === undefined) duration = $.fx.speeds._default / 1000
        if (delay === undefined) delay = 0

        //如果浏览器不支持动画，持续时间设为0，直接跳动画结束
        if ($.fx.off) duration = 0

        // properties是动画名
        if (typeof properties == 'string') {
            // keyframe animation
            cssValues[animationName] = properties
            cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
            endEvent = $.fx.animationEnd  //动画结束事件
        } else {  //properties 是样式集
            cssProperties = []
            // CSS transitions
            for (key in properties)
                //supportedTransforms.test(key) 正则检测是否为变形
                //key + '(' + properties[key] + ') ' 拼凑成变形方法
                if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

            //变形统一存入  cssValues   cssProperties
            if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)

            // duration > 0可以播放动画，且properties是对象，表明为过渡，上面有字符串，则为animate
            if (duration > 0 && typeof properties === 'object') {
                cssValues[transitionProperty] = cssProperties.join(', ')
                cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')  //默认线性速率
            }
        }

        //动画完成后的响应函数
        wrappedCallback = function(event){
            if (typeof event !== 'undefined') {
                if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
                $(event.target).unbind(endEvent, wrappedCallback)
            } else
            $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

            fired = true
            $(this).css(cssReset)
            callback && callback.call(this)
        }

        //处理动画结束事件
        if (duration > 0){
            //绑定动画结束事件
            this.bind(endEvent, wrappedCallback)
            // transitionEnd is not always firing on older Android phones
            // so make sure it gets fired

            //延时ms后执行动画，注意这里加了25ms，保持endEvent，动画先执行完。
            //绑定过事件还做延时处理，是transitionEnd在older Android phones不一定触发
            setTimeout(function(){
                //如果触发过，就不处理
                if (fired) return
                wrappedCallback.call(that)
            }, ((duration + delay) * 1000) + 25)
        }

        // trigger page reflow so new elements can animate
        //主动触发页面回流，刷新DOM，让接下来设置的动画可以正确播放
        //更改 offsetTop、offsetLeft、 offsetWidth、offsetHeight；scrollTop、scrollLeft、scrollWidth、scrollHeight；clientTop、clientLeft、clientWidth、clientHeight；getComputedStyle() 、currentStyle（）。这些都会触发回流。回流导致DOM重新渲染，平时要尽可能避免，但这里，为了动画即时生效播放，则主动触发回流，刷新DOM。
        this.size() && this.get(0).clientLeft

        //设置样式，启动动画
        this.css(cssValues)

        // duration为0，即浏览器不支持动画的情况，直接执行动画结束，执行回调。
        if (duration <= 0) setTimeout(function() {
            that.each(function(){ wrappedCallback.call(this) })
        }, 0)

        return this
    }

    testEl = null   //去掉不必要的数据存储，便于垃圾回收
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($, undefined){
    var document = window.document, docElem = document.documentElement,
        origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle// origShow展示    origHide隐藏  origToggle展示隐藏开关

    /**
     * 便捷动画的核心方法
     * @param el  DOM
     * @param speed 持续时间
     * @param opacity 不透明度
     * @param scale 缩放
     * @param callback 回调
     * @returns {*}
     */
    function anim(el, speed, opacity, scale, callback) {
        //修正参数  anim(el，callback）
        if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
        var props = { opacity: opacity }
        if (scale) {
            props.scale = scale
            el.css($.fx.cssPrefix + 'transform-origin', '0 0')  //设置变形原点
        }
        return el.animate(props, speed, null, callback)//不支持速率变化，
    }

    /**
     * 底层方法：隐藏显示的元素
     * @param el
     * @param speed
     * @param scale
     * @param callback
     * @returns {*}
     */
    function hide(el, speed, scale, callback) {
        //不透明度设为0，即完全透明，相当于隐藏元素。这里的原理是播放不透明-透明的过渡。
        //具体代码为 $(dom).animate({opacity: 0, '-webkit-transform-origin': '0px 0px 0px', '-webkit-transform': 'scale(0, 0)' },800)
        //设置了变形原点，缩放为0，它就会缩到左上角再透明
        return anim(el, speed, 0, scale, function(){
            origHide.call($(this)) //调用隐藏
            callback && callback.call(this)
        })
    }

    /**
     * 显示
     * @param speed  持续时间
     * @param callback   回调函数
     * @returns {*}
     */
    $.fn.show = function(speed, callback) {
        origShow.call(this)
        //具体代码为 $(dom).animate({opacity: 1, '-webkit-transform-origin': '0px 0px 0px', '-webkit-transform': 'scale(1, 1)' },800)
        //设置了变形原点，缩放为0，它就会缩到左上角再透明
        if (speed === undefined) speed = 0
        else this.css('opacity', 0)
        return anim(this, speed, 1, '1,1', callback)
    }

    /**
     * 隐藏
     * @param speed      持续时间
     * @param callback   回调函数
     * @returns {*}
     */
    $.fn.hide = function(speed, callback) {
        if (speed === undefined) return origHide.call(this)
        else return hide(this, speed, '0,0', callback)
    }

    /**
     * 显示、隐藏开关
     * @param speed     持续时间
     * @param callback   回调函数
     * @returns {*}
     */
    $.fn.toggle = function(speed, callback) {
        if (speed === undefined || typeof speed == 'boolean')
        return origToggle.call(this, speed)
        else return this.each(function(){
            var el = $(this)
            el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
        })
    }

    /**
     * 淡入淡出
     * 原理： $(dom).animate({opacity: 1/0, '-webkit-transform-origin': '0px 0px 0px'},800)
     * @param speed  持续时间
     * @param opacity 不透明度
     * @param callback  回调函数
     * @returns {*}
     */
    $.fn.fadeTo = function(speed, opacity, callback) {
        return anim(this, speed, opacity, null, callback)
    }

    /**
     *  淡入
     * 原理： $(dom).animate({opacity: 1, '-webkit-transform-origin': '0px 0px 0px'},800)
     * @param speed   持续时间
     * @param callback  回调函数
     * @returns {*}
     */
    $.fn.fadeIn = function(speed, callback) {
        var target = this.css('opacity')
        if (target > 0) this.css('opacity', 0)
        else target = 1
        return origShow.call(this).fadeTo(speed, target, callback)
    }

    /**
     *  淡出
     * 原理： $(dom).animate({opacity: 0, '-webkit-transform-origin': '0px 0px 0px'},800)
     * @param speed   持续时间
     * @param callback  回调函数
     * @returns {*}
     */
    $.fn.fadeOut = function(speed, callback) {
        return hide(this, speed, null, callback)
    }

    /**
     * 淡入淡出开关
     * @param speed   持续时间
     * @param callback  回调函数
     * @returns {*}
     */
    $.fn.fadeToggle = function(speed, callback) {
        return this.each(function(){
            var el = $(this)
            el[
                (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
            ](speed, callback)
        })
    }

})(Zepto);