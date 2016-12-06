'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// compat
var compat = {};

function detectBrowsers() {
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        $('html').addClass('safari');
        compat.safari = true;
    }

    if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i))) {
        $('html').addClass('mobileSafari');
        compat.mobileSafari = true;
    }

    if (navigator.userAgent.match(/iPad/i)) {
        $('html').addClass('iPad');
        compat.ipad = true;
    }

    if (navigator.userAgent.match(/iPhone/i)) {
        $('html').addClass('iPhone');
        compat.iphone = true;
    }

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $('html').addClass('firefox');
        compat.firefox = true;
    }

    if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
        $('html').addClass('android');
        compat.android = true;
    }

    if (!!window.chrome && !!window.chrome.webstore) {
        $('html').addClass('chrome');
        compat.chrome = true;
    }

    if (Function('/*@cc_on return document.documentMode===10@*/')()) {
        $('html').addClass('ie10');
        compat.ie = true;
        compat.ie10 = true;
    }

    if (!!window.MSInputMethodContext && !!document.documentMode) {
        $('html').addClass('ie11');
        compat.ie = true;
        compat.ie11 = true;
    }
}

function isDevice() {
    return isIpad() || isIphone() || isAndroid();
}

function isIpad() {
    return compat.ipad;
}

function isAndroid() {
    return compat.android;
}

function isIphone() {
    return compat.iphone;
}

function isApple() {
    return compat.ipad || compat.iphone;
}

function windowHeight() {
    return isApple() ? window.innerHeight : $w.height();
}
// form
var phs = {},
    frm = document.forms['details'],
    $frm = $('#details-form'),
    formValidated = false,
    $formSubmit = $('#form-submit'),
    userData = {};

function prepareForm() {
    $frm.on('submit', onSubmit);

    $frm.find('input, textarea').on('change', validateForm).on('keyup', validateForm);
    $('#page4-back').on('click', function () {
        setActivePage(2);
    });
}

function setPlaceHolder(cls, val) {
    var $inp = $('input.' + cls),
        inp = $inp[0],
        ph = true,
        phV = val;
    phs[cls] = ph;

    function onKeyUp(e) {
        ph = e.target.value == '';
        phs[cls] = ph;
    }

    function onBlur(e) {
        if (ph) {
            if (isDevice()) {
                e.target.value = phV;
                return;
            }
            $inp.addClass('transit').css('color', 'rgba(0,0,0,0)');
            e.target.value = phV;
            setTimeout(function () {
                $inp.css('color', '');
                setTimeout(function () {
                    $inp.removeClass('transit');
                }, 100);
            }, 10);
        }
    }

    function onFocus(e) {
        if (ph) {
            if (isDevice()) {
                e.target.value = '';
                return;
            }
            $inp.addClass('transit');
            setTimeout(function () {
                $inp.css('color', 'rgba(0,0,0,0)');
                setTimeout(function () {
                    e.target.value = '';
                    $inp.removeClass('transit');
                    setTimeout(function () {
                        $inp.css('color', '');
                    }, 0);
                }, 100);
            }, 0);
        }
        // e.target.value = '';
    }

    $inp.on('keyup', onKeyUp);
    $inp.on('blur', onBlur);
    $inp.on('focus', onFocus);
    onBlur({ target: inp });
    $inp.on('change', onKeyUp);
}

function showMsg(err, msg) {
    setVisualLoadingState(false);
    $frm.addClass('hidden');
    showMessage(msg, err);
    // emoveClass('hidden').html(msg).toggleClass('error', !!err);
}

function mockFormSend() {
    setVisualLoadingState(true);
    setTimeout(function () {
        if (Math.random() > 0.5) {
            onError({});
            return;
        }
        var data = {};
        if (Math.random() > 0.5) {
            data.err = true;
            data.text = 'new-yorkers-only understandable xtra long 3rr0r messag3';
        } else {
            data.err = false;
            data.text = 'Thank you!';
        }
        onSuccess(data);
    }, settings.animationTime);
}

var xhr = void 0,
    mockRequest = true;
var emptyValidator = function emptyValidator(elem) {
    return !elem.value;
};
var cbxValidator = function cbxValidator(elem) {
    return !elem.checked;
};
var cbxValue = function cbxValue(elem) {
    return elem.checked;
};
var fields = [{ elem: 'email', validator: emptyValidator }, { elem: 'name', validator: emptyValidator }, { elem: 'surname', validator: emptyValidator }, { elem: 'address', validator: emptyValidator }, { elem: 'legalname', validator: emptyValidator }, { elem: 'affirm_use_right', validator: cbxValidator, value: cbxValue }, { elem: 'affirm_grant_right', validator: cbxValidator, value: cbxValue }, { elem: 'affirm_people', validator: cbxValidator, value: cbxValue }];

function validateForm() {
    var validated = true;
    _.forEach(fields, function (f) {
        var elem = frm.elements[f.elem];
        if (f.validator(elem)) {
            // $(elem).focus();
            validated = false;
        }
    });
    formValidated = validated;

    $formSubmit.toggleClass('disabled', !formValidated);
}

function onSubmit() {
    if (!formValidated) return false;

    var data = {};
    _.forEach(fields, function (f) {
        data[f.elem] = f.value ? f.value(frm.elements[f.elem]) : frm.elements[f.elem].value;
    });

    userData = data;
    setActivePage(4);
    // if (mockRequest) {
    //     mockFormSend();
    //     return false;
    // }

    // if (xhr) {
    //     xhr.abort();
    //     xhr = false;
    // }
    // setVisualLoadingState(true);

    // setTimeout(function() {
    //     xhr = $.ajax({
    //         success: onSuccess,
    //         error: onError,
    //         data,
    //         dataType: 'json',
    //         method: settings.method,
    //         timeout: settings.connectionTimeout,
    //         url: settings.url,
    //         async: true
    //     });
    // }, 50);
    return false;
}

function setVisualLoadingState(state) {
    if (state) {
        $frm.find('input.submit').addClass('hidden');
        $frm.find('.loader').removeClass('hidden');
    } else {
        $frm.find('input.submit').removeClass('hidden');
        $frm.find('.loader').addClass('hidden');
    }
}

function onSuccess(data) {
    console.log('[onSuccess] data = ', data);
    showMsg(data.err, data.text);
}

function onError(data) {
    console.log('[onError]');
    showMsg(true, settings.failedMessage);
}
/**
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler ○ gmail • com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.3
 */
;(function (f) {
    "use strict";
    "function" === typeof define && define.amd ? define(["jquery"], f) : "undefined" !== typeof module && module.exports ? module.exports = f(require("jquery")) : f(jQuery);
})(function ($) {
    "use strict";
    function n(a) {
        return !a.nodeName || -1 !== $.inArray(a.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]);
    }function h(a) {
        return $.isFunction(a) || $.isPlainObject(a) ? a : { top: a, left: a };
    }var p = $.scrollTo = function (a, d, b) {
        return $(window).scrollTo(a, d, b);
    };p.defaults = { axis: "xy", duration: 0, limit: !0 };$.fn.scrollTo = function (a, d, b) {
        "object" === (typeof d === 'undefined' ? 'undefined' : _typeof(d)) && (b = d, d = 0);"function" === typeof b && (b = { onAfter: b });"max" === a && (a = 9E9);b = $.extend({}, p.defaults, b);d = d || b.duration;var u = b.queue && 1 < b.axis.length;u && (d /= 2);b.offset = h(b.offset);b.over = h(b.over);return this.each(function () {
            function k(a) {
                var k = $.extend({}, b, { queue: !0, duration: d, complete: a && function () {
                        a.call(q, e, b);
                    } });r.animate(f, k);
            }if (null !== a) {
                var l = n(this),
                    q = l ? this.contentWindow || window : this,
                    r = $(q),
                    e = a,
                    f = {},
                    t;switch (typeof e === 'undefined' ? 'undefined' : _typeof(e)) {case "number":case "string":
                        if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)) {
                            e = h(e);break;
                        }e = l ? $(e) : $(e, q);case "object":
                        if (e.length === 0) return;if (e.is || e.style) t = (e = $(e)).offset();}var v = $.isFunction(b.offset) && b.offset(q, e) || b.offset;$.each(b.axis.split(""), function (a, c) {
                    var d = "x" === c ? "Left" : "Top",
                        m = d.toLowerCase(),
                        g = "scroll" + d,
                        h = r[g](),
                        n = p.max(q, c);t ? (f[g] = t[m] + (l ? 0 : h - r.offset()[m]), b.margin && (f[g] -= parseInt(e.css("margin" + d), 10) || 0, f[g] -= parseInt(e.css("border" + d + "Width"), 10) || 0), f[g] += v[m] || 0, b.over[m] && (f[g] += e["x" === c ? "width" : "height"]() * b.over[m])) : (d = e[m], f[g] = d.slice && "%" === d.slice(-1) ? parseFloat(d) / 100 * n : d);b.limit && /^\d+$/.test(f[g]) && (f[g] = 0 >= f[g] ? 0 : Math.min(f[g], n));!a && 1 < b.axis.length && (h === f[g] ? f = {} : u && (k(b.onAfterFirst), f = {}));
                });k(b.onAfter);
            }
        });
    };p.max = function (a, d) {
        var b = "x" === d ? "Width" : "Height",
            h = "scroll" + b;if (!n(a)) return a[h] - $(a)[b.toLowerCase()]();var b = "client" + b,
            k = a.ownerDocument || a.document,
            l = k.documentElement,
            k = k.body;return Math.max(l[h], k[h]) - Math.min(l[b], k[b]);
    };$.Tween.propHooks.scrollLeft = $.Tween.propHooks.scrollTop = { get: function get(a) {
            return $(a.elem)[a.prop]();
        }, set: function set(a) {
            var d = this.get(a);if (a.options.interrupt && a._last && a._last !== d) return $(a.elem).stop();var b = Math.round(a.now);d !== b && ($(a.elem)[a.prop](b), a._last = this.get(a));
        } };return p;
});
// settings
var settings = {
    connectionTimeout: 15000, // timeout to connect for form send
    animationTime: 500, // we need to know animation timeout for scroll control
    programmScrollTime: 300, // time for auto scroll
    programmScrollEasing: 'easeInOutQuad', // easing for auto scroll
    url: '/form', // url for form sending
    method: 'POST', // send method
    failedMessage: 'connection failed', // default message for send fail
    ignoreScrollSize: 10
};
// onXX and behavioral functions
function ipadOrient() {
    $(document).ready(function () {
        window.addEventListener('orientationchange', function (e) {
            onOrient();
        });
    });
}

function onOrient(initial) {
    var wdth = $w.width(),
        hght = $w.height();
    if (window.orientation == 90 || window.orientation == -90 || wdth >= hght) $('html').addClass('landscape').removeClass('portrait');else $('html').removeClass('landscape').addClass('portrait');
}

function prepareBrowsers() {
    if (isDevice()) {
        return;
    }
}

function setProgrammScroll(height, time) {
    if (programmScrollInProgress) return;
    programmScrollInProgress = true;
    time = time || settings.animationTime;
    $w.scrollTo(height, time, { easing: settings.programmScrollEasing });
    setTimeout(function () {
        programmScrollInProgress = false;
    }, time);
}

var scrollTimeout = false;

function clearScrollTimeout() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = false;
    }
}

function setScrollTimeout() {
    scrollTimeout = setTimeout(onSlide1Click, settings.scrollTimeout);
}

function onScrollEnd() {
    // console.log('[onScrollEnd]');
    var wh = windowHeight();
    var skipScroll = dlt < settings.deviceIgnoreDelta && isDevice();

    clearTimeout(throttle);
    throttle = false;
}

var $w = $(window),
    slideState = 0,
    previousScroll = 0,
    programmScrollInProgress = false,
    sl1,
    sl2,
    throttle = false,
    topDelta,
    bottomDelta,
    d = 0,
    dlt = 0;

function onScroll(e) {
    var h = $w.scrollTop();
    d = h > previousScroll ? 1 : -1; //1 is scrolling bottom, -1 is scrolling top
    if (Math.abs(h - previousScroll) < settings.ignoreScrollSize) {
        //ok we're goin' down slow
        if (!throttle) {
            throttle = setTimeout(onScrollEnd, 50);
        }
    }
    clearScrollTimeout();
    previousScroll = h;
}

function startup() {
    addEasings();
    detectBrowsers();
    ipadOrient();
    prepareBrowsers();
    prepareForm();
    onOrient(true);
    onResize();
    onScroll();

    if (!isDevice()) {
        $w.on('resize', onResize);
        $w.on('scroll', onScroll);
    } else {
        $w.on('resize', onDeviceResize);
        $w.on('scroll', onScroll);
    }
}

function onResize() {
    // if (isDevice())
    // return;
    onOrient();
}

function onDeviceResize() {
    return;
}

function addEasings() {
    $.extend($.easing, {
        easeInOutQuad: function easeInOutQuad(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * (--t * (t - 2) - 1) + b;
        }
    });
}

$(startup);