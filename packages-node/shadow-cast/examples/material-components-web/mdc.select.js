/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/material-components/material-components-web/blob/master/LICENSE
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["select"] = factory();
	else
		root["mdc"] = root["mdc"] || {}, root["mdc"]["select"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/mdc-select/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./packages/mdc-animation/util.ts":
/*!****************************************!*\
  !*** ./packages/mdc-animation/util.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrectEventName = exports.getCorrectPropertyName = void 0;
var cssPropertyNameMap = {
    animation: {
        prefixed: '-webkit-animation',
        standard: 'animation'
    },
    transform: {
        prefixed: '-webkit-transform',
        standard: 'transform'
    },
    transition: {
        prefixed: '-webkit-transition',
        standard: 'transition'
    }
};
var jsEventTypeMap = {
    animationend: {
        cssProperty: 'animation',
        prefixed: 'webkitAnimationEnd',
        standard: 'animationend'
    },
    animationiteration: {
        cssProperty: 'animation',
        prefixed: 'webkitAnimationIteration',
        standard: 'animationiteration'
    },
    animationstart: {
        cssProperty: 'animation',
        prefixed: 'webkitAnimationStart',
        standard: 'animationstart'
    },
    transitionend: {
        cssProperty: 'transition',
        prefixed: 'webkitTransitionEnd',
        standard: 'transitionend'
    }
};
function isWindow(windowObj) {
    return Boolean(windowObj.document) && typeof windowObj.document.createElement === 'function';
}
function getCorrectPropertyName(windowObj, cssProperty) {
    if (isWindow(windowObj) && cssProperty in cssPropertyNameMap) {
        var el = windowObj.document.createElement('div');
        var _a = cssPropertyNameMap[cssProperty],
            standard = _a.standard,
            prefixed = _a.prefixed;
        var isStandard = standard in el.style;
        return isStandard ? standard : prefixed;
    }
    return cssProperty;
}
exports.getCorrectPropertyName = getCorrectPropertyName;
function getCorrectEventName(windowObj, eventType) {
    if (isWindow(windowObj) && eventType in jsEventTypeMap) {
        var el = windowObj.document.createElement('div');
        var _a = jsEventTypeMap[eventType],
            standard = _a.standard,
            prefixed = _a.prefixed,
            cssProperty = _a.cssProperty;
        var isStandard = cssProperty in el.style;
        return isStandard ? standard : prefixed;
    }
    return eventType;
}
exports.getCorrectEventName = getCorrectEventName;

/***/ }),

/***/ "./packages/mdc-base/component.ts":
/*!****************************************!*\
  !*** ./packages/mdc-base/component.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __read = this && this.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = this && this.__spreadArray || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) {
        to[j] = from[i];
    }return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCComponent = void 0;
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-base/foundation.ts");
var MDCComponent = /** @class */function () {
    function MDCComponent(root, foundation) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.root = root;
        this.initialize.apply(this, __spreadArray([], __read(args)));
        // Note that we initialize foundation here and not within the constructor's
        // default param so that this.root is defined and can be used within the
        // foundation class.
        this.foundation = foundation === undefined ? this.getDefaultFoundation() : foundation;
        this.foundation.init();
        this.initialSyncWithDOM();
    }
    MDCComponent.attachTo = function (root) {
        // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
        // returns an instantiated component with its root set to that element. Also note that in the cases of
        // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
        // from getDefaultFoundation().
        return new MDCComponent(root, new foundation_1.MDCFoundation({}));
    };
    /* istanbul ignore next: method param only exists for typing purposes; it does not need to be unit tested */
    MDCComponent.prototype.initialize = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        // Subclasses can override this to do any additional setup work that would be considered part of a
        // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
        // initialized. Any additional arguments besides root and foundation will be passed in here.
    };
    MDCComponent.prototype.getDefaultFoundation = function () {
        // Subclasses must override this method to return a properly configured foundation class for the
        // component.
        throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');
    };
    MDCComponent.prototype.initialSyncWithDOM = function () {
        // Subclasses should override this method if they need to perform work to synchronize with a host DOM
        // object. An example of this would be a form control wrapper that needs to synchronize its internal state
        // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
        // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
    };
    MDCComponent.prototype.destroy = function () {
        // Subclasses may implement this method to release any resources / deregister any listeners they have
        // attached. An example of this might be deregistering a resize event from the window object.
        this.foundation.destroy();
    };
    MDCComponent.prototype.listen = function (evtType, handler, options) {
        this.root.addEventListener(evtType, handler, options);
    };
    MDCComponent.prototype.unlisten = function (evtType, handler, options) {
        this.root.removeEventListener(evtType, handler, options);
    };
    /**
     * Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
     */
    MDCComponent.prototype.emit = function (evtType, evtData, shouldBubble) {
        if (shouldBubble === void 0) {
            shouldBubble = false;
        }
        var evt;
        if (typeof CustomEvent === 'function') {
            evt = new CustomEvent(evtType, {
                bubbles: shouldBubble,
                detail: evtData
            });
        } else {
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(evtType, shouldBubble, false, evtData);
        }
        this.root.dispatchEvent(evt);
    };
    return MDCComponent;
}();
exports.MDCComponent = MDCComponent;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCComponent;

/***/ }),

/***/ "./packages/mdc-base/foundation.ts":
/*!*****************************************!*\
  !*** ./packages/mdc-base/foundation.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCFoundation = void 0;
var MDCFoundation = /** @class */function () {
    function MDCFoundation(adapter) {
        if (adapter === void 0) {
            adapter = {};
        }
        this.adapter = adapter;
    }
    Object.defineProperty(MDCFoundation, "cssClasses", {
        get: function get() {
            // Classes extending MDCFoundation should implement this method to return an object which exports every
            // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "strings", {
        get: function get() {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "numbers", {
        get: function get() {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "defaultAdapter", {
        get: function get() {
            // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
            // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
            // validation.
            return {};
        },
        enumerable: false,
        configurable: true
    });
    MDCFoundation.prototype.init = function () {
        // Subclasses should override this method to perform initialization routines (registering events, etc.)
    };
    MDCFoundation.prototype.destroy = function () {
        // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
    };
    return MDCFoundation;
}();
exports.MDCFoundation = MDCFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCFoundation;

/***/ }),

/***/ "./packages/mdc-dom/events.ts":
/*!************************************!*\
  !*** ./packages/mdc-dom/events.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPassive = void 0;
/**
 * Determine whether the current browser supports passive event listeners, and
 * if so, use them.
 */
function applyPassive(globalObj) {
    if (globalObj === void 0) {
        globalObj = window;
    }
    return supportsPassiveOption(globalObj) ? { passive: true } : false;
}
exports.applyPassive = applyPassive;
function supportsPassiveOption(globalObj) {
    if (globalObj === void 0) {
        globalObj = window;
    }
    // See
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    var passiveSupported = false;
    try {
        var options = {
            // This function will be called when the browser
            // attempts to access the passive property.
            get passive() {
                passiveSupported = true;
                return false;
            }
        };
        var handler = function handler() {};
        globalObj.document.addEventListener('test', handler, options);
        globalObj.document.removeEventListener('test', handler, options);
    } catch (err) {
        passiveSupported = false;
    }
    return passiveSupported;
}

/***/ }),

/***/ "./packages/mdc-dom/keyboard.ts":
/*!**************************************!*\
  !*** ./packages/mdc-dom/keyboard.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.isNavigationEvent = exports.normalizeKey = exports.KEY = void 0;
/**
 * KEY provides normalized string values for keys.
 */
exports.KEY = {
    UNKNOWN: 'Unknown',
    BACKSPACE: 'Backspace',
    ENTER: 'Enter',
    SPACEBAR: 'Spacebar',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
    END: 'End',
    HOME: 'Home',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_UP: 'ArrowUp',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_DOWN: 'ArrowDown',
    DELETE: 'Delete',
    ESCAPE: 'Escape',
    TAB: 'Tab'
};
var normalizedKeys = new Set();
// IE11 has no support for new Map with iterable so we need to initialize this
// by hand.
normalizedKeys.add(exports.KEY.BACKSPACE);
normalizedKeys.add(exports.KEY.ENTER);
normalizedKeys.add(exports.KEY.SPACEBAR);
normalizedKeys.add(exports.KEY.PAGE_UP);
normalizedKeys.add(exports.KEY.PAGE_DOWN);
normalizedKeys.add(exports.KEY.END);
normalizedKeys.add(exports.KEY.HOME);
normalizedKeys.add(exports.KEY.ARROW_LEFT);
normalizedKeys.add(exports.KEY.ARROW_UP);
normalizedKeys.add(exports.KEY.ARROW_RIGHT);
normalizedKeys.add(exports.KEY.ARROW_DOWN);
normalizedKeys.add(exports.KEY.DELETE);
normalizedKeys.add(exports.KEY.ESCAPE);
normalizedKeys.add(exports.KEY.TAB);
var KEY_CODE = {
    BACKSPACE: 8,
    ENTER: 13,
    SPACEBAR: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    DELETE: 46,
    ESCAPE: 27,
    TAB: 9
};
var mappedKeyCodes = new Map();
// IE11 has no support for new Map with iterable so we need to initialize this
// by hand.
mappedKeyCodes.set(KEY_CODE.BACKSPACE, exports.KEY.BACKSPACE);
mappedKeyCodes.set(KEY_CODE.ENTER, exports.KEY.ENTER);
mappedKeyCodes.set(KEY_CODE.SPACEBAR, exports.KEY.SPACEBAR);
mappedKeyCodes.set(KEY_CODE.PAGE_UP, exports.KEY.PAGE_UP);
mappedKeyCodes.set(KEY_CODE.PAGE_DOWN, exports.KEY.PAGE_DOWN);
mappedKeyCodes.set(KEY_CODE.END, exports.KEY.END);
mappedKeyCodes.set(KEY_CODE.HOME, exports.KEY.HOME);
mappedKeyCodes.set(KEY_CODE.ARROW_LEFT, exports.KEY.ARROW_LEFT);
mappedKeyCodes.set(KEY_CODE.ARROW_UP, exports.KEY.ARROW_UP);
mappedKeyCodes.set(KEY_CODE.ARROW_RIGHT, exports.KEY.ARROW_RIGHT);
mappedKeyCodes.set(KEY_CODE.ARROW_DOWN, exports.KEY.ARROW_DOWN);
mappedKeyCodes.set(KEY_CODE.DELETE, exports.KEY.DELETE);
mappedKeyCodes.set(KEY_CODE.ESCAPE, exports.KEY.ESCAPE);
mappedKeyCodes.set(KEY_CODE.TAB, exports.KEY.TAB);
var navigationKeys = new Set();
// IE11 has no support for new Set with iterable so we need to initialize this
// by hand.
navigationKeys.add(exports.KEY.PAGE_UP);
navigationKeys.add(exports.KEY.PAGE_DOWN);
navigationKeys.add(exports.KEY.END);
navigationKeys.add(exports.KEY.HOME);
navigationKeys.add(exports.KEY.ARROW_LEFT);
navigationKeys.add(exports.KEY.ARROW_UP);
navigationKeys.add(exports.KEY.ARROW_RIGHT);
navigationKeys.add(exports.KEY.ARROW_DOWN);
/**
 * normalizeKey returns the normalized string for a navigational action.
 */
function normalizeKey(evt) {
    var key = evt.key;
    // If the event already has a normalized key, return it
    if (normalizedKeys.has(key)) {
        return key;
    }
    // tslint:disable-next-line:deprecation
    var mappedKey = mappedKeyCodes.get(evt.keyCode);
    if (mappedKey) {
        return mappedKey;
    }
    return exports.KEY.UNKNOWN;
}
exports.normalizeKey = normalizeKey;
/**
 * isNavigationEvent returns whether the event is a navigation event
 */
function isNavigationEvent(evt) {
    return navigationKeys.has(normalizeKey(evt));
}
exports.isNavigationEvent = isNavigationEvent;

/***/ }),

/***/ "./packages/mdc-dom/ponyfill.ts":
/*!**************************************!*\
  !*** ./packages/mdc-dom/ponyfill.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateScrollWidth = exports.matches = exports.closest = void 0;
/**
 * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
 * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
 */
function closest(element, selector) {
    if (element.closest) {
        return element.closest(selector);
    }
    var el = element;
    while (el) {
        if (matches(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}
exports.closest = closest;
function matches(element, selector) {
    var nativeMatches = element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    return nativeMatches.call(element, selector);
}
exports.matches = matches;
/**
 * Used to compute the estimated scroll width of elements. When an element is
 * hidden due to display: none; being applied to a parent element, the width is
 * returned as 0. However, the element will have a true width once no longer
 * inside a display: none context. This method computes an estimated width when
 * the element is hidden or returns the true width when the element is visble.
 * @param {Element} element the element whose width to estimate
 */
function estimateScrollWidth(element) {
    // Check the offsetParent. If the element inherits display: none from any
    // parent, the offsetParent property will be null (see
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
    // This check ensures we only clone the node when necessary.
    var htmlEl = element;
    if (htmlEl.offsetParent !== null) {
        return htmlEl.scrollWidth;
    }
    var clone = htmlEl.cloneNode(true);
    clone.style.setProperty('position', 'absolute');
    clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
    document.documentElement.appendChild(clone);
    var scrollWidth = clone.scrollWidth;
    document.documentElement.removeChild(clone);
    return scrollWidth;
}
exports.estimateScrollWidth = estimateScrollWidth;

/***/ }),

/***/ "./packages/mdc-floating-label/component.ts":
/*!**************************************************!*\
  !*** ./packages/mdc-floating-label/component.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCFloatingLabel = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var ponyfill_1 = __webpack_require__(/*! @material/dom/ponyfill */ "./packages/mdc-dom/ponyfill.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-floating-label/foundation.ts");
var MDCFloatingLabel = /** @class */function (_super) {
    __extends(MDCFloatingLabel, _super);
    function MDCFloatingLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCFloatingLabel.attachTo = function (root) {
        return new MDCFloatingLabel(root);
    };
    /**
     * Styles the label to produce the label shake for errors.
     * @param shouldShake If true, shakes the label by adding a CSS class; otherwise, stops shaking by removing the class.
     */
    MDCFloatingLabel.prototype.shake = function (shouldShake) {
        this.foundation.shake(shouldShake);
    };
    /**
     * Styles the label to float/dock.
     * @param shouldFloat If true, floats the label by adding a CSS class; otherwise, docks it by removing the class.
     */
    MDCFloatingLabel.prototype.float = function (shouldFloat) {
        this.foundation.float(shouldFloat);
    };
    /**
     * Styles the label as required.
     * @param isRequired If true, adds an asterisk to the label, indicating that it is required.
     */
    MDCFloatingLabel.prototype.setRequired = function (isRequired) {
        this.foundation.setRequired(isRequired);
    };
    MDCFloatingLabel.prototype.getWidth = function () {
        return this.foundation.getWidth();
    };
    MDCFloatingLabel.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function addClass(className) {
                return _this.root.classList.add(className);
            },
            removeClass: function removeClass(className) {
                return _this.root.classList.remove(className);
            },
            getWidth: function getWidth() {
                return ponyfill_1.estimateScrollWidth(_this.root);
            },
            registerInteractionHandler: function registerInteractionHandler(evtType, handler) {
                return _this.listen(evtType, handler);
            },
            deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {
                return _this.unlisten(evtType, handler);
            }
        };
        // tslint:enable:object-literal-sort-keys
        return new foundation_1.MDCFloatingLabelFoundation(adapter);
    };
    return MDCFloatingLabel;
}(component_1.MDCComponent);
exports.MDCFloatingLabel = MDCFloatingLabel;

/***/ }),

/***/ "./packages/mdc-floating-label/constants.ts":
/*!**************************************************!*\
  !*** ./packages/mdc-floating-label/constants.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.cssClasses = void 0;
exports.cssClasses = {
  LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',
  LABEL_REQUIRED: 'mdc-floating-label--required',
  LABEL_SHAKE: 'mdc-floating-label--shake',
  ROOT: 'mdc-floating-label'
};

/***/ }),

/***/ "./packages/mdc-floating-label/foundation.ts":
/*!***************************************************!*\
  !*** ./packages/mdc-floating-label/foundation.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCFloatingLabelFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-floating-label/constants.ts");
var MDCFloatingLabelFoundation = /** @class */function (_super) {
    __extends(MDCFloatingLabelFoundation, _super);
    function MDCFloatingLabelFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCFloatingLabelFoundation.defaultAdapter), adapter)) || this;
        _this.shakeAnimationEndHandler = function () {
            _this.handleShakeAnimationEnd();
        };
        return _this;
    }
    Object.defineProperty(MDCFloatingLabelFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFloatingLabelFoundation, "defaultAdapter", {
        /**
         * See {@link MDCFloatingLabelAdapter} for typing information on parameters and return types.
         */
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function addClass() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                getWidth: function getWidth() {
                    return 0;
                },
                registerInteractionHandler: function registerInteractionHandler() {
                    return undefined;
                },
                deregisterInteractionHandler: function deregisterInteractionHandler() {
                    return undefined;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCFloatingLabelFoundation.prototype.init = function () {
        this.adapter.registerInteractionHandler('animationend', this.shakeAnimationEndHandler);
    };
    MDCFloatingLabelFoundation.prototype.destroy = function () {
        this.adapter.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler);
    };
    /**
     * Returns the width of the label element.
     */
    MDCFloatingLabelFoundation.prototype.getWidth = function () {
        return this.adapter.getWidth();
    };
    /**
     * Styles the label to produce a shake animation to indicate an error.
     * @param shouldShake If true, adds the shake CSS class; otherwise, removes shake class.
     */
    MDCFloatingLabelFoundation.prototype.shake = function (shouldShake) {
        var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
        if (shouldShake) {
            this.adapter.addClass(LABEL_SHAKE);
        } else {
            this.adapter.removeClass(LABEL_SHAKE);
        }
    };
    /**
     * Styles the label to float or dock.
     * @param shouldFloat If true, adds the float CSS class; otherwise, removes float and shake classes to dock the label.
     */
    MDCFloatingLabelFoundation.prototype.float = function (shouldFloat) {
        var _a = MDCFloatingLabelFoundation.cssClasses,
            LABEL_FLOAT_ABOVE = _a.LABEL_FLOAT_ABOVE,
            LABEL_SHAKE = _a.LABEL_SHAKE;
        if (shouldFloat) {
            this.adapter.addClass(LABEL_FLOAT_ABOVE);
        } else {
            this.adapter.removeClass(LABEL_FLOAT_ABOVE);
            this.adapter.removeClass(LABEL_SHAKE);
        }
    };
    /**
     * Styles the label as required.
     * @param isRequired If true, adds an asterisk to the label, indicating that it is required.
     */
    MDCFloatingLabelFoundation.prototype.setRequired = function (isRequired) {
        var LABEL_REQUIRED = MDCFloatingLabelFoundation.cssClasses.LABEL_REQUIRED;
        if (isRequired) {
            this.adapter.addClass(LABEL_REQUIRED);
        } else {
            this.adapter.removeClass(LABEL_REQUIRED);
        }
    };
    MDCFloatingLabelFoundation.prototype.handleShakeAnimationEnd = function () {
        var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
        this.adapter.removeClass(LABEL_SHAKE);
    };
    return MDCFloatingLabelFoundation;
}(foundation_1.MDCFoundation);
exports.MDCFloatingLabelFoundation = MDCFloatingLabelFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCFloatingLabelFoundation;

/***/ }),

/***/ "./packages/mdc-line-ripple/component.ts":
/*!***********************************************!*\
  !*** ./packages/mdc-line-ripple/component.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCLineRipple = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-line-ripple/foundation.ts");
var MDCLineRipple = /** @class */function (_super) {
    __extends(MDCLineRipple, _super);
    function MDCLineRipple() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCLineRipple.attachTo = function (root) {
        return new MDCLineRipple(root);
    };
    /**
     * Activates the line ripple
     */
    MDCLineRipple.prototype.activate = function () {
        this.foundation.activate();
    };
    /**
     * Deactivates the line ripple
     */
    MDCLineRipple.prototype.deactivate = function () {
        this.foundation.deactivate();
    };
    /**
     * Sets the transform origin given a user's click location.
     * The `rippleCenter` is the x-coordinate of the middle of the ripple.
     */
    MDCLineRipple.prototype.setRippleCenter = function (xCoordinate) {
        this.foundation.setRippleCenter(xCoordinate);
    };
    MDCLineRipple.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function addClass(className) {
                return _this.root.classList.add(className);
            },
            removeClass: function removeClass(className) {
                return _this.root.classList.remove(className);
            },
            hasClass: function hasClass(className) {
                return _this.root.classList.contains(className);
            },
            setStyle: function setStyle(propertyName, value) {
                return _this.root.style.setProperty(propertyName, value);
            },
            registerEventHandler: function registerEventHandler(evtType, handler) {
                return _this.listen(evtType, handler);
            },
            deregisterEventHandler: function deregisterEventHandler(evtType, handler) {
                return _this.unlisten(evtType, handler);
            }
        };
        // tslint:enable:object-literal-sort-keys
        return new foundation_1.MDCLineRippleFoundation(adapter);
    };
    return MDCLineRipple;
}(component_1.MDCComponent);
exports.MDCLineRipple = MDCLineRipple;

/***/ }),

/***/ "./packages/mdc-line-ripple/constants.ts":
/*!***********************************************!*\
  !*** ./packages/mdc-line-ripple/constants.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.cssClasses = void 0;
var cssClasses = {
  LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',
  LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating'
};
exports.cssClasses = cssClasses;

/***/ }),

/***/ "./packages/mdc-line-ripple/foundation.ts":
/*!************************************************!*\
  !*** ./packages/mdc-line-ripple/foundation.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCLineRippleFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-line-ripple/constants.ts");
var MDCLineRippleFoundation = /** @class */function (_super) {
    __extends(MDCLineRippleFoundation, _super);
    function MDCLineRippleFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCLineRippleFoundation.defaultAdapter), adapter)) || this;
        _this.transitionEndHandler = function (evt) {
            _this.handleTransitionEnd(evt);
        };
        return _this;
    }
    Object.defineProperty(MDCLineRippleFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCLineRippleFoundation, "defaultAdapter", {
        /**
         * See {@link MDCLineRippleAdapter} for typing information on parameters and return types.
         */
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function addClass() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                hasClass: function hasClass() {
                    return false;
                },
                setStyle: function setStyle() {
                    return undefined;
                },
                registerEventHandler: function registerEventHandler() {
                    return undefined;
                },
                deregisterEventHandler: function deregisterEventHandler() {
                    return undefined;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCLineRippleFoundation.prototype.init = function () {
        this.adapter.registerEventHandler('transitionend', this.transitionEndHandler);
    };
    MDCLineRippleFoundation.prototype.destroy = function () {
        this.adapter.deregisterEventHandler('transitionend', this.transitionEndHandler);
    };
    MDCLineRippleFoundation.prototype.activate = function () {
        this.adapter.removeClass(constants_1.cssClasses.LINE_RIPPLE_DEACTIVATING);
        this.adapter.addClass(constants_1.cssClasses.LINE_RIPPLE_ACTIVE);
    };
    MDCLineRippleFoundation.prototype.setRippleCenter = function (xCoordinate) {
        this.adapter.setStyle('transform-origin', xCoordinate + "px center");
    };
    MDCLineRippleFoundation.prototype.deactivate = function () {
        this.adapter.addClass(constants_1.cssClasses.LINE_RIPPLE_DEACTIVATING);
    };
    MDCLineRippleFoundation.prototype.handleTransitionEnd = function (evt) {
        // Wait for the line ripple to be either transparent or opaque
        // before emitting the animation end event
        var isDeactivating = this.adapter.hasClass(constants_1.cssClasses.LINE_RIPPLE_DEACTIVATING);
        if (evt.propertyName === 'opacity') {
            if (isDeactivating) {
                this.adapter.removeClass(constants_1.cssClasses.LINE_RIPPLE_ACTIVE);
                this.adapter.removeClass(constants_1.cssClasses.LINE_RIPPLE_DEACTIVATING);
            }
        }
    };
    return MDCLineRippleFoundation;
}(foundation_1.MDCFoundation);
exports.MDCLineRippleFoundation = MDCLineRippleFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCLineRippleFoundation;

/***/ }),

/***/ "./packages/mdc-list/component.ts":
/*!****************************************!*\
  !*** ./packages/mdc-list/component.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCList = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var ponyfill_1 = __webpack_require__(/*! @material/dom/ponyfill */ "./packages/mdc-dom/ponyfill.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-list/constants.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-list/foundation.ts");
var MDCList = /** @class */function (_super) {
    __extends(MDCList, _super);
    function MDCList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MDCList.prototype, "vertical", {
        set: function set(value) {
            this.foundation.setVerticalOrientation(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "listElements", {
        get: function get() {
            return Array.from(this.root.querySelectorAll("." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_CLASS]));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "wrapFocus", {
        set: function set(value) {
            this.foundation.setWrapFocus(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "typeaheadInProgress", {
        /**
         * @return Whether typeahead is currently matching a user-specified prefix.
         */
        get: function get() {
            return this.foundation.isTypeaheadInProgress();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "hasTypeahead", {
        /**
         * Sets whether typeahead functionality is enabled on the list.
         * @param hasTypeahead Whether typeahead is enabled.
         */
        set: function set(hasTypeahead) {
            this.foundation.setHasTypeahead(hasTypeahead);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "singleSelection", {
        set: function set(isSingleSelectionList) {
            this.foundation.setSingleSelection(isSingleSelectionList);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "selectedIndex", {
        get: function get() {
            return this.foundation.getSelectedIndex();
        },
        set: function set(index) {
            this.foundation.setSelectedIndex(index);
        },
        enumerable: false,
        configurable: true
    });
    MDCList.attachTo = function (root) {
        return new MDCList(root);
    };
    MDCList.prototype.initialSyncWithDOM = function () {
        this.isEvolutionEnabled = constants_1.evolutionAttribute in this.root.dataset;
        if (this.isEvolutionEnabled) {
            this.classNameMap = constants_1.evolutionClassNameMap;
        } else if (ponyfill_1.matches(this.root, constants_1.strings.DEPRECATED_SELECTOR)) {
            this.classNameMap = constants_1.deprecatedClassNameMap;
        } else {
            this.classNameMap = Object.values(constants_1.cssClasses).reduce(function (obj, className) {
                obj[className] = className;
                return obj;
            }, {});
        }
        this.handleClick = this.handleClickEvent.bind(this);
        this.handleKeydown = this.handleKeydownEvent.bind(this);
        this.focusInEventListener = this.handleFocusInEvent.bind(this);
        this.focusOutEventListener = this.handleFocusOutEvent.bind(this);
        this.listen('keydown', this.handleKeydown);
        this.listen('click', this.handleClick);
        this.listen('focusin', this.focusInEventListener);
        this.listen('focusout', this.focusOutEventListener);
        this.layout();
        this.initializeListType();
        this.ensureFocusable();
    };
    MDCList.prototype.destroy = function () {
        this.unlisten('keydown', this.handleKeydown);
        this.unlisten('click', this.handleClick);
        this.unlisten('focusin', this.focusInEventListener);
        this.unlisten('focusout', this.focusOutEventListener);
    };
    MDCList.prototype.layout = function () {
        var direction = this.root.getAttribute(constants_1.strings.ARIA_ORIENTATION);
        this.vertical = direction !== constants_1.strings.ARIA_ORIENTATION_HORIZONTAL;
        var itemSelector = "." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_CLASS] + ":not([tabindex])";
        var childSelector = constants_1.strings.FOCUSABLE_CHILD_ELEMENTS;
        // List items need to have at least tabindex=-1 to be focusable.
        var itemEls = this.root.querySelectorAll(itemSelector);
        if (itemEls.length) {
            Array.prototype.forEach.call(itemEls, function (el) {
                el.setAttribute('tabindex', '-1');
            });
        }
        // Child button/a elements are not tabbable until the list item is focused.
        var focusableChildEls = this.root.querySelectorAll(childSelector);
        if (focusableChildEls.length) {
            Array.prototype.forEach.call(focusableChildEls, function (el) {
                el.setAttribute('tabindex', '-1');
            });
        }
        if (this.isEvolutionEnabled) {
            this.foundation.setUseSelectedAttribute(true);
        }
        this.foundation.layout();
    };
    /**
     * Extracts the primary text from a list item.
     * @param item The list item element.
     * @return The primary text in the element.
     */
    MDCList.prototype.getPrimaryText = function (item) {
        var _a;
        var primaryText = item.querySelector("." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_PRIMARY_TEXT_CLASS]);
        if (this.isEvolutionEnabled || primaryText) {
            return (_a = primaryText === null || primaryText === void 0 ? void 0 : primaryText.textContent) !== null && _a !== void 0 ? _a : '';
        }
        var singleLineText = item.querySelector("." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_TEXT_CLASS]);
        return singleLineText && singleLineText.textContent || '';
    };
    /**
     * Initialize selectedIndex value based on pre-selected list items.
     */
    MDCList.prototype.initializeListType = function () {
        var _this = this;
        this.isInteractive = ponyfill_1.matches(this.root, constants_1.strings.ARIA_INTERACTIVE_ROLES_SELECTOR);
        if (this.isEvolutionEnabled && this.isInteractive) {
            var selection = Array.from(this.root.querySelectorAll(constants_1.strings.SELECTED_ITEM_SELECTOR), function (listItem) {
                return _this.listElements.indexOf(listItem);
            });
            if (ponyfill_1.matches(this.root, constants_1.strings.ARIA_MULTI_SELECTABLE_SELECTOR)) {
                this.selectedIndex = selection;
            } else if (selection.length > 0) {
                this.selectedIndex = selection[0];
            }
            return;
        }
        var checkboxListItems = this.root.querySelectorAll(constants_1.strings.ARIA_ROLE_CHECKBOX_SELECTOR);
        var radioSelectedListItem = this.root.querySelector(constants_1.strings.ARIA_CHECKED_RADIO_SELECTOR);
        if (checkboxListItems.length) {
            var preselectedItems = this.root.querySelectorAll(constants_1.strings.ARIA_CHECKED_CHECKBOX_SELECTOR);
            this.selectedIndex = Array.from(preselectedItems, function (listItem) {
                return _this.listElements.indexOf(listItem);
            });
        } else if (radioSelectedListItem) {
            this.selectedIndex = this.listElements.indexOf(radioSelectedListItem);
        }
    };
    /**
     * Updates the list item at itemIndex to the desired isEnabled state.
     * @param itemIndex Index of the list item
     * @param isEnabled Sets the list item to enabled or disabled.
     */
    MDCList.prototype.setEnabled = function (itemIndex, isEnabled) {
        this.foundation.setEnabled(itemIndex, isEnabled);
    };
    /**
     * Given the next desired character from the user, adds it to the typeahead
     * buffer. Then, attempts to find the next option matching the buffer. Wraps
     * around if at the end of options.
     *
     * @param nextChar The next character to add to the prefix buffer.
     * @param startingIndex The index from which to start matching. Defaults to
     *     the currently focused index.
     * @return The index of the matched item.
     */
    MDCList.prototype.typeaheadMatchItem = function (nextChar, startingIndex) {
        return this.foundation.typeaheadMatchItem(nextChar, startingIndex, /** skipFocus */true);
    };
    MDCList.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take
        // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
        // methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addClassForElementIndex: function addClassForElementIndex(index, className) {
                var element = _this.listElements[index];
                if (element) {
                    element.classList.add(_this.classNameMap[className]);
                }
            },
            focusItemAtIndex: function focusItemAtIndex(index) {
                var element = _this.listElements[index];
                if (element) {
                    element.focus();
                }
            },
            getAttributeForElementIndex: function getAttributeForElementIndex(index, attr) {
                return _this.listElements[index].getAttribute(attr);
            },
            getFocusedElementIndex: function getFocusedElementIndex() {
                return _this.listElements.indexOf(document.activeElement);
            },
            getListItemCount: function getListItemCount() {
                return _this.listElements.length;
            },
            getPrimaryTextAtIndex: function getPrimaryTextAtIndex(index) {
                return _this.getPrimaryText(_this.listElements[index]);
            },
            hasCheckboxAtIndex: function hasCheckboxAtIndex(index) {
                var listItem = _this.listElements[index];
                return !!listItem.querySelector(constants_1.strings.CHECKBOX_SELECTOR);
            },
            hasRadioAtIndex: function hasRadioAtIndex(index) {
                var listItem = _this.listElements[index];
                return !!listItem.querySelector(constants_1.strings.RADIO_SELECTOR);
            },
            isCheckboxCheckedAtIndex: function isCheckboxCheckedAtIndex(index) {
                var listItem = _this.listElements[index];
                var toggleEl = listItem.querySelector(constants_1.strings.CHECKBOX_SELECTOR);
                return toggleEl.checked;
            },
            isFocusInsideList: function isFocusInsideList() {
                return _this.root !== document.activeElement && _this.root.contains(document.activeElement);
            },
            isRootFocused: function isRootFocused() {
                return document.activeElement === _this.root;
            },
            listItemAtIndexHasClass: function listItemAtIndexHasClass(index, className) {
                return _this.listElements[index].classList.contains(_this.classNameMap[className]);
            },
            notifyAction: function notifyAction(index) {
                _this.emit(constants_1.strings.ACTION_EVENT, { index: index }, /** shouldBubble */true);
            },
            removeClassForElementIndex: function removeClassForElementIndex(index, className) {
                var element = _this.listElements[index];
                if (element) {
                    element.classList.remove(_this.classNameMap[className]);
                }
            },
            setAttributeForElementIndex: function setAttributeForElementIndex(index, attr, value) {
                var element = _this.listElements[index];
                if (element) {
                    element.setAttribute(attr, value);
                }
            },
            setCheckedCheckboxOrRadioAtIndex: function setCheckedCheckboxOrRadioAtIndex(index, isChecked) {
                var listItem = _this.listElements[index];
                var toggleEl = listItem.querySelector(constants_1.strings.CHECKBOX_RADIO_SELECTOR);
                toggleEl.checked = isChecked;
                var event = document.createEvent('Event');
                event.initEvent('change', true, true);
                toggleEl.dispatchEvent(event);
            },
            setTabIndexForListItemChildren: function setTabIndexForListItemChildren(listItemIndex, tabIndexValue) {
                var element = _this.listElements[listItemIndex];
                var selector = constants_1.strings.CHILD_ELEMENTS_TO_TOGGLE_TABINDEX;
                Array.prototype.forEach.call(element.querySelectorAll(selector), function (el) {
                    el.setAttribute('tabindex', tabIndexValue);
                });
            }
        };
        return new foundation_1.MDCListFoundation(adapter);
    };
    /**
     * Ensures that at least one item is focusable if the list is interactive and
     * doesn't specify a suitable tabindex.
     */
    MDCList.prototype.ensureFocusable = function () {
        if (this.isEvolutionEnabled && this.isInteractive) {
            if (!this.root.querySelector("." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_CLASS] + "[tabindex=\"0\"]")) {
                var index = this.initialFocusIndex();
                if (index !== -1) {
                    this.listElements[index].tabIndex = 0;
                }
            }
        }
    };
    MDCList.prototype.initialFocusIndex = function () {
        if (this.selectedIndex instanceof Array && this.selectedIndex.length > 0) {
            return this.selectedIndex[0];
        }
        if (typeof this.selectedIndex === 'number' && this.selectedIndex !== constants_1.numbers.UNSET_INDEX) {
            return this.selectedIndex;
        }
        var el = this.root.querySelector("." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_CLASS] + ":not(." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS] + ")");
        if (el === null) {
            return -1;
        }
        return this.getListItemIndex(el);
    };
    /**
     * Used to figure out which list item this event is targetting. Or returns -1
     * if there is no list item
     */
    MDCList.prototype.getListItemIndex = function (el) {
        var nearestParent = ponyfill_1.closest(el, "." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_CLASS] + ", ." + this.classNameMap[constants_1.cssClasses.ROOT]);
        // Get the index of the element if it is a list item.
        if (nearestParent && ponyfill_1.matches(nearestParent, "." + this.classNameMap[constants_1.cssClasses.LIST_ITEM_CLASS])) {
            return this.listElements.indexOf(nearestParent);
        }
        return -1;
    };
    /**
     * Used to figure out which element was clicked before sending the event to
     * the foundation.
     */
    MDCList.prototype.handleFocusInEvent = function (evt) {
        var index = this.getListItemIndex(evt.target);
        this.foundation.handleFocusIn(index);
    };
    /**
     * Used to figure out which element was clicked before sending the event to
     * the foundation.
     */
    MDCList.prototype.handleFocusOutEvent = function (evt) {
        var index = this.getListItemIndex(evt.target);
        this.foundation.handleFocusOut(index);
    };
    /**
     * Used to figure out which element was focused when keydown event occurred
     * before sending the event to the foundation.
     */
    MDCList.prototype.handleKeydownEvent = function (evt) {
        var index = this.getListItemIndex(evt.target);
        var target = evt.target;
        this.foundation.handleKeydown(evt, target.classList.contains(this.classNameMap[constants_1.cssClasses.LIST_ITEM_CLASS]), index);
    };
    /**
     * Used to figure out which element was clicked before sending the event to
     * the foundation.
     */
    MDCList.prototype.handleClickEvent = function (evt) {
        var index = this.getListItemIndex(evt.target);
        var target = evt.target;
        // Toggle the checkbox only if it's not the target of the event, or the
        // checkbox will have 2 change events.
        var toggleCheckbox = !ponyfill_1.matches(target, constants_1.strings.CHECKBOX_RADIO_SELECTOR);
        this.foundation.handleClick(index, toggleCheckbox);
    };
    return MDCList;
}(component_1.MDCComponent);
exports.MDCList = MDCList;

/***/ }),

/***/ "./packages/mdc-list/constants.ts":
/*!****************************************!*\
  !*** ./packages/mdc-list/constants.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.evolutionClassNameMap = exports.evolutionAttribute = exports.deprecatedClassNameMap = exports.numbers = exports.cssClasses = exports.strings = void 0;
var cssClasses = {
    LIST_ITEM_ACTIVATED_CLASS: 'mdc-list-item--activated',
    LIST_ITEM_CLASS: 'mdc-list-item',
    LIST_ITEM_DISABLED_CLASS: 'mdc-list-item--disabled',
    LIST_ITEM_SELECTED_CLASS: 'mdc-list-item--selected',
    LIST_ITEM_TEXT_CLASS: 'mdc-list-item__text',
    LIST_ITEM_PRIMARY_TEXT_CLASS: 'mdc-list-item__primary-text',
    ROOT: 'mdc-list'
};
exports.cssClasses = cssClasses;
var evolutionClassNameMap = (_a = {}, _a["" + cssClasses.LIST_ITEM_ACTIVATED_CLASS] = 'mdc-list-item--activated', _a["" + cssClasses.LIST_ITEM_CLASS] = 'mdc-list-item', _a["" + cssClasses.LIST_ITEM_DISABLED_CLASS] = 'mdc-list-item--disabled', _a["" + cssClasses.LIST_ITEM_SELECTED_CLASS] = 'mdc-list-item--selected', _a["" + cssClasses.LIST_ITEM_PRIMARY_TEXT_CLASS] = 'mdc-list-item__primary-text', _a["" + cssClasses.ROOT] = 'mdc-list', _a);
exports.evolutionClassNameMap = evolutionClassNameMap;
var deprecatedClassNameMap = (_b = {}, _b["" + cssClasses.LIST_ITEM_ACTIVATED_CLASS] = 'mdc-deprecated-list-item--activated', _b["" + cssClasses.LIST_ITEM_CLASS] = 'mdc-deprecated-list-item', _b["" + cssClasses.LIST_ITEM_DISABLED_CLASS] = 'mdc-deprecated-list-item--disabled', _b["" + cssClasses.LIST_ITEM_SELECTED_CLASS] = 'mdc-deprecated-list-item--selected', _b["" + cssClasses.LIST_ITEM_TEXT_CLASS] = 'mdc-deprecated-list-item__text', _b["" + cssClasses.LIST_ITEM_PRIMARY_TEXT_CLASS] = 'mdc-deprecated-list-item__primary-text', _b["" + cssClasses.ROOT] = 'mdc-deprecated-list', _b);
exports.deprecatedClassNameMap = deprecatedClassNameMap;
var strings = {
    ACTION_EVENT: 'MDCList:action',
    ARIA_CHECKED: 'aria-checked',
    ARIA_CHECKED_CHECKBOX_SELECTOR: '[role="checkbox"][aria-checked="true"]',
    ARIA_CHECKED_RADIO_SELECTOR: '[role="radio"][aria-checked="true"]',
    ARIA_CURRENT: 'aria-current',
    ARIA_DISABLED: 'aria-disabled',
    ARIA_ORIENTATION: 'aria-orientation',
    ARIA_ORIENTATION_HORIZONTAL: 'horizontal',
    ARIA_ROLE_CHECKBOX_SELECTOR: '[role="checkbox"]',
    ARIA_SELECTED: 'aria-selected',
    ARIA_INTERACTIVE_ROLES_SELECTOR: '[role="listbox"], [role="menu"]',
    ARIA_MULTI_SELECTABLE_SELECTOR: '[aria-multiselectable="true"]',
    CHECKBOX_RADIO_SELECTOR: 'input[type="checkbox"], input[type="radio"]',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    CHILD_ELEMENTS_TO_TOGGLE_TABINDEX: "\n    ." + cssClasses.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " a,\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " button:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " a\n  ",
    DEPRECATED_SELECTOR: '.mdc-deprecated-list',
    FOCUSABLE_CHILD_ELEMENTS: "\n    ." + cssClasses.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " a,\n    ." + cssClasses.LIST_ITEM_CLASS + " input[type=\"radio\"]:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " input[type=\"checkbox\"]:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " button:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " a,\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " input[type=\"radio\"]:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " input[type=\"checkbox\"]:not(:disabled)\n  ",
    RADIO_SELECTOR: 'input[type="radio"]',
    SELECTED_ITEM_SELECTOR: '[aria-selected="true"], [aria-current="true"]'
};
exports.strings = strings;
var numbers = {
    UNSET_INDEX: -1,
    TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS: 300
};
exports.numbers = numbers;
var evolutionAttribute = 'evolution';
exports.evolutionAttribute = evolutionAttribute;

/***/ }),

/***/ "./packages/mdc-list/events.ts":
/*!*************************************!*\
  !*** ./packages/mdc-list/events.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.preventDefaultEvent = void 0;
var ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];
/**
 * Ensures that preventDefault is only called if the containing element
 * doesn't consume the event, and it will cause an unintended scroll.
 *
 * @param evt keyboard event to be prevented.
 */
var preventDefaultEvent = function preventDefaultEvent(evt) {
    var target = evt.target;
    if (!target) {
        return;
    }
    var tagName = ("" + target.tagName).toLowerCase();
    if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
        evt.preventDefault();
    }
};
exports.preventDefaultEvent = preventDefaultEvent;

/***/ }),

/***/ "./packages/mdc-list/foundation.ts":
/*!*****************************************!*\
  !*** ./packages/mdc-list/foundation.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function get() {
            return m[k];
        } });
} : function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function (o, v) {
    o["default"] = v;
});
var __importStar = this && this.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }__setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCListFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var keyboard_1 = __webpack_require__(/*! @material/dom/keyboard */ "./packages/mdc-dom/keyboard.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-list/constants.ts");
var events_1 = __webpack_require__(/*! ./events */ "./packages/mdc-list/events.ts");
var typeahead = __importStar(__webpack_require__(/*! ./typeahead */ "./packages/mdc-list/typeahead.ts"));
function isNumberArray(selectedIndex) {
    return selectedIndex instanceof Array;
}
var MDCListFoundation = /** @class */function (_super) {
    __extends(MDCListFoundation, _super);
    function MDCListFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCListFoundation.defaultAdapter), adapter)) || this;
        _this.wrapFocus = false;
        _this.isVertical = true;
        _this.isSingleSelectionList = false;
        _this.selectedIndex = constants_1.numbers.UNSET_INDEX;
        _this.focusedItemIndex = constants_1.numbers.UNSET_INDEX;
        _this.useActivatedClass = false;
        _this.useSelectedAttr = false;
        _this.ariaCurrentAttrValue = null;
        _this.isCheckboxList = false;
        _this.isRadioList = false;
        _this.hasTypeahead = false;
        // Transiently holds current typeahead prefix from user.
        _this.typeaheadState = typeahead.initState();
        _this.sortedIndexByFirstChar = new Map();
        return _this;
    }
    Object.defineProperty(MDCListFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "numbers", {
        get: function get() {
            return constants_1.numbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "defaultAdapter", {
        get: function get() {
            return {
                addClassForElementIndex: function addClassForElementIndex() {
                    return undefined;
                },
                focusItemAtIndex: function focusItemAtIndex() {
                    return undefined;
                },
                getAttributeForElementIndex: function getAttributeForElementIndex() {
                    return null;
                },
                getFocusedElementIndex: function getFocusedElementIndex() {
                    return 0;
                },
                getListItemCount: function getListItemCount() {
                    return 0;
                },
                hasCheckboxAtIndex: function hasCheckboxAtIndex() {
                    return false;
                },
                hasRadioAtIndex: function hasRadioAtIndex() {
                    return false;
                },
                isCheckboxCheckedAtIndex: function isCheckboxCheckedAtIndex() {
                    return false;
                },
                isFocusInsideList: function isFocusInsideList() {
                    return false;
                },
                isRootFocused: function isRootFocused() {
                    return false;
                },
                listItemAtIndexHasClass: function listItemAtIndexHasClass() {
                    return false;
                },
                notifyAction: function notifyAction() {
                    return undefined;
                },
                removeClassForElementIndex: function removeClassForElementIndex() {
                    return undefined;
                },
                setAttributeForElementIndex: function setAttributeForElementIndex() {
                    return undefined;
                },
                setCheckedCheckboxOrRadioAtIndex: function setCheckedCheckboxOrRadioAtIndex() {
                    return undefined;
                },
                setTabIndexForListItemChildren: function setTabIndexForListItemChildren() {
                    return undefined;
                },
                getPrimaryTextAtIndex: function getPrimaryTextAtIndex() {
                    return '';
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCListFoundation.prototype.layout = function () {
        if (this.adapter.getListItemCount() === 0) {
            return;
        }
        // TODO(b/172274142): consider all items when determining the list's type.
        if (this.adapter.hasCheckboxAtIndex(0)) {
            this.isCheckboxList = true;
        } else if (this.adapter.hasRadioAtIndex(0)) {
            this.isRadioList = true;
        } else {
            this.maybeInitializeSingleSelection();
        }
        if (this.hasTypeahead) {
            this.sortedIndexByFirstChar = this.typeaheadInitSortedIndex();
        }
    };
    /** Returns the index of the item that was last focused. */
    MDCListFoundation.prototype.getFocusedItemIndex = function () {
        return this.focusedItemIndex;
    };
    /** Toggles focus wrapping with keyboard navigation. */
    MDCListFoundation.prototype.setWrapFocus = function (value) {
        this.wrapFocus = value;
    };
    /**
     * Toggles orientation direction for keyboard navigation (true for vertical,
     * false for horizontal).
     */
    MDCListFoundation.prototype.setVerticalOrientation = function (value) {
        this.isVertical = value;
    };
    /** Toggles single-selection behavior. */
    MDCListFoundation.prototype.setSingleSelection = function (value) {
        this.isSingleSelectionList = value;
        if (value) {
            this.maybeInitializeSingleSelection();
        }
    };
    /**
     * Automatically determines whether the list is single selection list. If so,
     * initializes the internal state to match the selected item.
     */
    MDCListFoundation.prototype.maybeInitializeSingleSelection = function () {
        var listItemsCount = this.adapter.getListItemCount();
        for (var i = 0; i < listItemsCount; i++) {
            var hasSelectedClass = this.adapter.listItemAtIndexHasClass(i, constants_1.cssClasses.LIST_ITEM_SELECTED_CLASS);
            var hasActivatedClass = this.adapter.listItemAtIndexHasClass(i, constants_1.cssClasses.LIST_ITEM_ACTIVATED_CLASS);
            if (!(hasSelectedClass || hasActivatedClass)) {
                continue;
            }
            if (hasActivatedClass) {
                this.setUseActivatedClass(true);
            }
            this.isSingleSelectionList = true;
            this.selectedIndex = i;
            return;
        }
    };
    /**
     * Sets whether typeahead is enabled on the list.
     * @param hasTypeahead Whether typeahead is enabled.
     */
    MDCListFoundation.prototype.setHasTypeahead = function (hasTypeahead) {
        this.hasTypeahead = hasTypeahead;
        if (hasTypeahead) {
            this.sortedIndexByFirstChar = this.typeaheadInitSortedIndex();
        }
    };
    /**
     * @return Whether typeahead is currently matching a user-specified prefix.
     */
    MDCListFoundation.prototype.isTypeaheadInProgress = function () {
        return this.hasTypeahead && typeahead.isTypingInProgress(this.typeaheadState);
    };
    /** Toggle use of the "activated" CSS class. */
    MDCListFoundation.prototype.setUseActivatedClass = function (useActivated) {
        this.useActivatedClass = useActivated;
    };
    /**
     * Toggles use of the selected attribute (true for aria-selected, false for
     * aria-checked).
     */
    MDCListFoundation.prototype.setUseSelectedAttribute = function (useSelected) {
        this.useSelectedAttr = useSelected;
    };
    MDCListFoundation.prototype.getSelectedIndex = function () {
        return this.selectedIndex;
    };
    MDCListFoundation.prototype.setSelectedIndex = function (index, _a) {
        var _b = _a === void 0 ? {} : _a,
            forceUpdate = _b.forceUpdate;
        if (!this.isIndexValid(index)) {
            return;
        }
        if (this.isCheckboxList) {
            this.setCheckboxAtIndex(index);
        } else if (this.isRadioList) {
            this.setRadioAtIndex(index);
        } else {
            this.setSingleSelectionAtIndex(index, { forceUpdate: forceUpdate });
        }
    };
    /**
     * Focus in handler for the list items.
     */
    MDCListFoundation.prototype.handleFocusIn = function (listItemIndex) {
        if (listItemIndex >= 0) {
            this.focusedItemIndex = listItemIndex;
            this.adapter.setAttributeForElementIndex(listItemIndex, 'tabindex', '0');
            this.adapter.setTabIndexForListItemChildren(listItemIndex, '0');
        }
    };
    /**
     * Focus out handler for the list items.
     */
    MDCListFoundation.prototype.handleFocusOut = function (listItemIndex) {
        var _this = this;
        if (listItemIndex >= 0) {
            this.adapter.setAttributeForElementIndex(listItemIndex, 'tabindex', '-1');
            this.adapter.setTabIndexForListItemChildren(listItemIndex, '-1');
        }
        /**
         * Between Focusout & Focusin some browsers do not have focus on any
         * element. Setting a delay to wait till the focus is moved to next element.
         */
        setTimeout(function () {
            if (!_this.adapter.isFocusInsideList()) {
                _this.setTabindexToFirstSelectedOrFocusedItem();
            }
        }, 0);
    };
    /**
     * Key handler for the list.
     */
    MDCListFoundation.prototype.handleKeydown = function (event, isRootListItem, listItemIndex) {
        var _this = this;
        var isArrowLeft = keyboard_1.normalizeKey(event) === 'ArrowLeft';
        var isArrowUp = keyboard_1.normalizeKey(event) === 'ArrowUp';
        var isArrowRight = keyboard_1.normalizeKey(event) === 'ArrowRight';
        var isArrowDown = keyboard_1.normalizeKey(event) === 'ArrowDown';
        var isHome = keyboard_1.normalizeKey(event) === 'Home';
        var isEnd = keyboard_1.normalizeKey(event) === 'End';
        var isEnter = keyboard_1.normalizeKey(event) === 'Enter';
        var isSpace = keyboard_1.normalizeKey(event) === 'Spacebar';
        // Have to check both upper and lower case, because having caps lock on
        // affects the value.
        var isLetterA = event.key === 'A' || event.key === 'a';
        if (this.adapter.isRootFocused()) {
            if (isArrowUp || isEnd) {
                event.preventDefault();
                this.focusLastElement();
            } else if (isArrowDown || isHome) {
                event.preventDefault();
                this.focusFirstElement();
            }
            if (this.hasTypeahead) {
                var handleKeydownOpts = {
                    event: event,
                    focusItemAtIndex: function focusItemAtIndex(index) {
                        _this.focusItemAtIndex(index);
                    },
                    focusedItemIndex: -1,
                    isTargetListItem: isRootListItem,
                    sortedIndexByFirstChar: this.sortedIndexByFirstChar,
                    isItemAtIndexDisabled: function isItemAtIndexDisabled(index) {
                        return _this.adapter.listItemAtIndexHasClass(index, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS);
                    }
                };
                typeahead.handleKeydown(handleKeydownOpts, this.typeaheadState);
            }
            return;
        }
        var currentIndex = this.adapter.getFocusedElementIndex();
        if (currentIndex === -1) {
            currentIndex = listItemIndex;
            if (currentIndex < 0) {
                // If this event doesn't have a mdc-list-item ancestor from the
                // current list (not from a sublist), return early.
                return;
            }
        }
        if (this.isVertical && isArrowDown || !this.isVertical && isArrowRight) {
            events_1.preventDefaultEvent(event);
            this.focusNextElement(currentIndex);
        } else if (this.isVertical && isArrowUp || !this.isVertical && isArrowLeft) {
            events_1.preventDefaultEvent(event);
            this.focusPrevElement(currentIndex);
        } else if (isHome) {
            events_1.preventDefaultEvent(event);
            this.focusFirstElement();
        } else if (isEnd) {
            events_1.preventDefaultEvent(event);
            this.focusLastElement();
        } else if (isLetterA && event.ctrlKey && this.isCheckboxList) {
            event.preventDefault();
            this.toggleAll(this.selectedIndex === constants_1.numbers.UNSET_INDEX ? [] : this.selectedIndex);
        } else if (isEnter || isSpace) {
            if (isRootListItem) {
                // Return early if enter key is pressed on anchor element which triggers
                // synthetic MouseEvent event.
                var target = event.target;
                if (target && target.tagName === 'A' && isEnter) {
                    return;
                }
                events_1.preventDefaultEvent(event);
                if (this.adapter.listItemAtIndexHasClass(currentIndex, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS)) {
                    return;
                }
                if (!this.isTypeaheadInProgress()) {
                    if (this.isSelectableList()) {
                        this.setSelectedIndexOnAction(currentIndex);
                    }
                    this.adapter.notifyAction(currentIndex);
                }
            }
        }
        if (this.hasTypeahead) {
            var handleKeydownOpts = {
                event: event,
                focusItemAtIndex: function focusItemAtIndex(index) {
                    _this.focusItemAtIndex(index);
                },
                focusedItemIndex: this.focusedItemIndex,
                isTargetListItem: isRootListItem,
                sortedIndexByFirstChar: this.sortedIndexByFirstChar,
                isItemAtIndexDisabled: function isItemAtIndexDisabled(index) {
                    return _this.adapter.listItemAtIndexHasClass(index, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS);
                }
            };
            typeahead.handleKeydown(handleKeydownOpts, this.typeaheadState);
        }
    };
    /**
     * Click handler for the list.
     */
    MDCListFoundation.prototype.handleClick = function (index, toggleCheckbox) {
        if (index === constants_1.numbers.UNSET_INDEX) {
            return;
        }
        if (this.adapter.listItemAtIndexHasClass(index, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS)) {
            return;
        }
        if (this.isSelectableList()) {
            this.setSelectedIndexOnAction(index, toggleCheckbox);
        }
        this.adapter.notifyAction(index);
    };
    /**
     * Focuses the next element on the list.
     */
    MDCListFoundation.prototype.focusNextElement = function (index) {
        var count = this.adapter.getListItemCount();
        var nextIndex = index + 1;
        if (nextIndex >= count) {
            if (this.wrapFocus) {
                nextIndex = 0;
            } else {
                // Return early because last item is already focused.
                return index;
            }
        }
        this.focusItemAtIndex(nextIndex);
        return nextIndex;
    };
    /**
     * Focuses the previous element on the list.
     */
    MDCListFoundation.prototype.focusPrevElement = function (index) {
        var prevIndex = index - 1;
        if (prevIndex < 0) {
            if (this.wrapFocus) {
                prevIndex = this.adapter.getListItemCount() - 1;
            } else {
                // Return early because first item is already focused.
                return index;
            }
        }
        this.focusItemAtIndex(prevIndex);
        return prevIndex;
    };
    MDCListFoundation.prototype.focusFirstElement = function () {
        this.focusItemAtIndex(0);
        return 0;
    };
    MDCListFoundation.prototype.focusLastElement = function () {
        var lastIndex = this.adapter.getListItemCount() - 1;
        this.focusItemAtIndex(lastIndex);
        return lastIndex;
    };
    MDCListFoundation.prototype.focusInitialElement = function () {
        var initialIndex = this.getFirstSelectedOrFocusedItemIndex();
        this.focusItemAtIndex(initialIndex);
        return initialIndex;
    };
    /**
     * @param itemIndex Index of the list item
     * @param isEnabled Sets the list item to enabled or disabled.
     */
    MDCListFoundation.prototype.setEnabled = function (itemIndex, isEnabled) {
        if (!this.isIndexValid(itemIndex)) {
            return;
        }
        if (isEnabled) {
            this.adapter.removeClassForElementIndex(itemIndex, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS);
            this.adapter.setAttributeForElementIndex(itemIndex, constants_1.strings.ARIA_DISABLED, 'false');
        } else {
            this.adapter.addClassForElementIndex(itemIndex, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS);
            this.adapter.setAttributeForElementIndex(itemIndex, constants_1.strings.ARIA_DISABLED, 'true');
        }
    };
    MDCListFoundation.prototype.setSingleSelectionAtIndex = function (index, _a) {
        var _b = _a === void 0 ? {} : _a,
            forceUpdate = _b.forceUpdate;
        if (this.selectedIndex === index && !forceUpdate) {
            return;
        }
        var selectedClassName = constants_1.cssClasses.LIST_ITEM_SELECTED_CLASS;
        if (this.useActivatedClass) {
            selectedClassName = constants_1.cssClasses.LIST_ITEM_ACTIVATED_CLASS;
        }
        if (this.selectedIndex !== constants_1.numbers.UNSET_INDEX) {
            this.adapter.removeClassForElementIndex(this.selectedIndex, selectedClassName);
        }
        this.setAriaForSingleSelectionAtIndex(index);
        this.setTabindexAtIndex(index);
        if (index !== constants_1.numbers.UNSET_INDEX) {
            this.adapter.addClassForElementIndex(index, selectedClassName);
        }
        this.selectedIndex = index;
    };
    /**
     * Sets aria attribute for single selection at given index.
     */
    MDCListFoundation.prototype.setAriaForSingleSelectionAtIndex = function (index) {
        // Detect the presence of aria-current and get the value only during list
        // initialization when it is in unset state.
        if (this.selectedIndex === constants_1.numbers.UNSET_INDEX) {
            this.ariaCurrentAttrValue = this.adapter.getAttributeForElementIndex(index, constants_1.strings.ARIA_CURRENT);
        }
        var isAriaCurrent = this.ariaCurrentAttrValue !== null;
        var ariaAttribute = isAriaCurrent ? constants_1.strings.ARIA_CURRENT : constants_1.strings.ARIA_SELECTED;
        if (this.selectedIndex !== constants_1.numbers.UNSET_INDEX) {
            this.adapter.setAttributeForElementIndex(this.selectedIndex, ariaAttribute, 'false');
        }
        if (index !== constants_1.numbers.UNSET_INDEX) {
            var ariaAttributeValue = isAriaCurrent ? this.ariaCurrentAttrValue : 'true';
            this.adapter.setAttributeForElementIndex(index, ariaAttribute, ariaAttributeValue);
        }
    };
    /**
     * Returns the attribute to use for indicating selection status.
     */
    MDCListFoundation.prototype.getSelectionAttribute = function () {
        return this.useSelectedAttr ? constants_1.strings.ARIA_SELECTED : constants_1.strings.ARIA_CHECKED;
    };
    /**
     * Toggles radio at give index. Radio doesn't change the checked state if it
     * is already checked.
     */
    MDCListFoundation.prototype.setRadioAtIndex = function (index) {
        var selectionAttribute = this.getSelectionAttribute();
        this.adapter.setCheckedCheckboxOrRadioAtIndex(index, true);
        if (this.selectedIndex !== constants_1.numbers.UNSET_INDEX) {
            this.adapter.setAttributeForElementIndex(this.selectedIndex, selectionAttribute, 'false');
        }
        this.adapter.setAttributeForElementIndex(index, selectionAttribute, 'true');
        this.selectedIndex = index;
    };
    MDCListFoundation.prototype.setCheckboxAtIndex = function (index) {
        var selectionAttribute = this.getSelectionAttribute();
        for (var i = 0; i < this.adapter.getListItemCount(); i++) {
            var isChecked = false;
            if (index.indexOf(i) >= 0) {
                isChecked = true;
            }
            this.adapter.setCheckedCheckboxOrRadioAtIndex(i, isChecked);
            this.adapter.setAttributeForElementIndex(i, selectionAttribute, isChecked ? 'true' : 'false');
        }
        this.selectedIndex = index;
    };
    MDCListFoundation.prototype.setTabindexAtIndex = function (index) {
        if (this.focusedItemIndex === constants_1.numbers.UNSET_INDEX && index !== 0) {
            // If some list item was selected set first list item's tabindex to -1.
            // Generally, tabindex is set to 0 on first list item of list that has no
            // preselected items.
            this.adapter.setAttributeForElementIndex(0, 'tabindex', '-1');
        } else if (this.focusedItemIndex >= 0 && this.focusedItemIndex !== index) {
            this.adapter.setAttributeForElementIndex(this.focusedItemIndex, 'tabindex', '-1');
        }
        // Set the previous selection's tabindex to -1. We need this because
        // in selection menus that are not visible, programmatically setting an
        // option will not change focus but will change where tabindex should be 0.
        if (!(this.selectedIndex instanceof Array) && this.selectedIndex !== index) {
            this.adapter.setAttributeForElementIndex(this.selectedIndex, 'tabindex', '-1');
        }
        if (index !== constants_1.numbers.UNSET_INDEX) {
            this.adapter.setAttributeForElementIndex(index, 'tabindex', '0');
        }
    };
    /**
     * @return Return true if it is single selectin list, checkbox list or radio
     *     list.
     */
    MDCListFoundation.prototype.isSelectableList = function () {
        return this.isSingleSelectionList || this.isCheckboxList || this.isRadioList;
    };
    MDCListFoundation.prototype.setTabindexToFirstSelectedOrFocusedItem = function () {
        var targetIndex = this.getFirstSelectedOrFocusedItemIndex();
        this.setTabindexAtIndex(targetIndex);
    };
    MDCListFoundation.prototype.getFirstSelectedOrFocusedItemIndex = function () {
        // Action lists retain focus on the most recently focused item.
        if (!this.isSelectableList()) {
            return Math.max(this.focusedItemIndex, 0);
        }
        // Single-selection lists focus the selected item.
        if (typeof this.selectedIndex === 'number' && this.selectedIndex !== constants_1.numbers.UNSET_INDEX) {
            return this.selectedIndex;
        }
        // Multiple-selection lists focus the first selected item.
        if (isNumberArray(this.selectedIndex) && this.selectedIndex.length > 0) {
            return this.selectedIndex.reduce(function (minIndex, currentIndex) {
                return Math.min(minIndex, currentIndex);
            });
        }
        // Selection lists without a selection focus the first item.
        return 0;
    };
    MDCListFoundation.prototype.isIndexValid = function (index) {
        var _this = this;
        if (index instanceof Array) {
            if (!this.isCheckboxList) {
                throw new Error('MDCListFoundation: Array of index is only supported for checkbox based list');
            }
            if (index.length === 0) {
                return true;
            } else {
                return index.some(function (i) {
                    return _this.isIndexInRange(i);
                });
            }
        } else if (typeof index === 'number') {
            if (this.isCheckboxList) {
                throw new Error("MDCListFoundation: Expected array of index for checkbox based list but got number: " + index);
            }
            return this.isIndexInRange(index) || this.isSingleSelectionList && index === constants_1.numbers.UNSET_INDEX;
        } else {
            return false;
        }
    };
    MDCListFoundation.prototype.isIndexInRange = function (index) {
        var listSize = this.adapter.getListItemCount();
        return index >= 0 && index < listSize;
    };
    /**
     * Sets selected index on user action, toggles checkbox / radio based on
     * toggleCheckbox value. User interaction should not toggle list item(s) when
     * disabled.
     */
    MDCListFoundation.prototype.setSelectedIndexOnAction = function (index, toggleCheckbox) {
        if (toggleCheckbox === void 0) {
            toggleCheckbox = true;
        }
        if (this.isCheckboxList) {
            this.toggleCheckboxAtIndex(index, toggleCheckbox);
        } else {
            this.setSelectedIndex(index);
        }
    };
    MDCListFoundation.prototype.toggleCheckboxAtIndex = function (index, toggleCheckbox) {
        var selectionAttribute = this.getSelectionAttribute();
        var isChecked = this.adapter.isCheckboxCheckedAtIndex(index);
        if (toggleCheckbox) {
            isChecked = !isChecked;
            this.adapter.setCheckedCheckboxOrRadioAtIndex(index, isChecked);
        }
        this.adapter.setAttributeForElementIndex(index, selectionAttribute, isChecked ? 'true' : 'false');
        // If none of the checkbox items are selected and selectedIndex is not
        // initialized then provide a default value.
        var selectedIndexes = this.selectedIndex === constants_1.numbers.UNSET_INDEX ? [] : this.selectedIndex.slice();
        if (isChecked) {
            selectedIndexes.push(index);
        } else {
            selectedIndexes = selectedIndexes.filter(function (i) {
                return i !== index;
            });
        }
        this.selectedIndex = selectedIndexes;
    };
    MDCListFoundation.prototype.focusItemAtIndex = function (index) {
        this.adapter.focusItemAtIndex(index);
        this.focusedItemIndex = index;
    };
    MDCListFoundation.prototype.toggleAll = function (currentlySelectedIndexes) {
        var count = this.adapter.getListItemCount();
        // If all items are selected, deselect everything.
        if (currentlySelectedIndexes.length === count) {
            this.setCheckboxAtIndex([]);
        } else {
            // Otherwise select all enabled options.
            var allIndexes = [];
            for (var i = 0; i < count; i++) {
                if (!this.adapter.listItemAtIndexHasClass(i, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS) || currentlySelectedIndexes.indexOf(i) > -1) {
                    allIndexes.push(i);
                }
            }
            this.setCheckboxAtIndex(allIndexes);
        }
    };
    /**
     * Given the next desired character from the user, adds it to the typeahead
     * buffer. Then, attempts to find the next option matching the buffer. Wraps
     * around if at the end of options.
     *
     * @param nextChar The next character to add to the prefix buffer.
     * @param startingIndex The index from which to start matching. Only relevant
     *     when starting a new match sequence. To start a new match sequence,
     *     clear the buffer using `clearTypeaheadBuffer`, or wait for the buffer
     *     to clear after a set interval defined in list foundation. Defaults to
     *     the currently focused index.
     * @return The index of the matched item, or -1 if no match.
     */
    MDCListFoundation.prototype.typeaheadMatchItem = function (nextChar, startingIndex, skipFocus) {
        var _this = this;
        if (skipFocus === void 0) {
            skipFocus = false;
        }
        var opts = {
            focusItemAtIndex: function focusItemAtIndex(index) {
                _this.focusItemAtIndex(index);
            },
            focusedItemIndex: startingIndex ? startingIndex : this.focusedItemIndex,
            nextChar: nextChar,
            sortedIndexByFirstChar: this.sortedIndexByFirstChar,
            skipFocus: skipFocus,
            isItemAtIndexDisabled: function isItemAtIndexDisabled(index) {
                return _this.adapter.listItemAtIndexHasClass(index, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS);
            }
        };
        return typeahead.matchItem(opts, this.typeaheadState);
    };
    /**
     * Initializes the MDCListTextAndIndex data structure by indexing the current
     * list items by primary text.
     *
     * @return The primary texts of all the list items sorted by first character.
     */
    MDCListFoundation.prototype.typeaheadInitSortedIndex = function () {
        return typeahead.initSortedIndex(this.adapter.getListItemCount(), this.adapter.getPrimaryTextAtIndex);
    };
    /**
     * Clears the typeahead buffer.
     */
    MDCListFoundation.prototype.clearTypeaheadBuffer = function () {
        typeahead.clearBuffer(this.typeaheadState);
    };
    return MDCListFoundation;
}(foundation_1.MDCFoundation);
exports.MDCListFoundation = MDCListFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCListFoundation;

/***/ }),

/***/ "./packages/mdc-list/typeahead.ts":
/*!****************************************!*\
  !*** ./packages/mdc-list/typeahead.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKeydown = exports.clearBuffer = exports.isTypingInProgress = exports.matchItem = exports.initSortedIndex = exports.initState = void 0;
var keyboard_1 = __webpack_require__(/*! @material/dom/keyboard */ "./packages/mdc-dom/keyboard.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-list/constants.ts");
var events_1 = __webpack_require__(/*! ./events */ "./packages/mdc-list/events.ts");
/**
 * Initializes a state object for typeahead. Use the same reference for calls to
 * typeahead functions.
 *
 * @return The current state of the typeahead process. Each state reference
 *     represents a typeahead instance as the reference is typically mutated
 *     in-place.
 */
function initState() {
    var state = {
        bufferClearTimeout: 0,
        currentFirstChar: '',
        sortedIndexCursor: 0,
        typeaheadBuffer: ''
    };
    return state;
}
exports.initState = initState;
/**
 * Initializes typeahead state by indexing the current list items by primary
 * text into the sortedIndexByFirstChar data structure.
 *
 * @param listItemCount numer of items in the list
 * @param getPrimaryTextByItemIndex function that returns the primary text at a
 *     given index
 *
 * @return Map that maps the first character of the primary text to the full
 *     list text and it's index
 */
function initSortedIndex(listItemCount, getPrimaryTextByItemIndex) {
    var sortedIndexByFirstChar = new Map();
    // Aggregate item text to index mapping
    for (var i = 0; i < listItemCount; i++) {
        var primaryText = getPrimaryTextByItemIndex(i).trim();
        if (!primaryText) {
            continue;
        }
        var firstChar = primaryText[0].toLowerCase();
        if (!sortedIndexByFirstChar.has(firstChar)) {
            sortedIndexByFirstChar.set(firstChar, []);
        }
        sortedIndexByFirstChar.get(firstChar).push({ text: primaryText.toLowerCase(), index: i });
    }
    // Sort the mapping
    // TODO(b/157162694): Investigate replacing forEach with Map.values()
    sortedIndexByFirstChar.forEach(function (values) {
        values.sort(function (first, second) {
            return first.index - second.index;
        });
    });
    return sortedIndexByFirstChar;
}
exports.initSortedIndex = initSortedIndex;
/**
 * Given the next desired character from the user, it attempts to find the next
 * list option matching the buffer. Wraps around if at the end of options.
 *
 * @param opts Options and accessors
 *   - nextChar - the next character to match against items
 *   - sortedIndexByFirstChar - output of `initSortedIndex(...)`
 *   - focusedItemIndex - the index of the currently focused item
 *   - focusItemAtIndex - function that focuses a list item at given index
 *   - skipFocus - whether or not to focus the matched item
 *   - isItemAtIndexDisabled - function that determines whether an item at a
 *        given index is disabled
 * @param state The typeahead state instance. See `initState`.
 *
 * @return The index of the matched item, or -1 if no match.
 */
function matchItem(opts, state) {
    var nextChar = opts.nextChar,
        focusItemAtIndex = opts.focusItemAtIndex,
        sortedIndexByFirstChar = opts.sortedIndexByFirstChar,
        focusedItemIndex = opts.focusedItemIndex,
        skipFocus = opts.skipFocus,
        isItemAtIndexDisabled = opts.isItemAtIndexDisabled;
    clearTimeout(state.bufferClearTimeout);
    state.bufferClearTimeout = setTimeout(function () {
        clearBuffer(state);
    }, constants_1.numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
    state.typeaheadBuffer = state.typeaheadBuffer + nextChar;
    var index;
    if (state.typeaheadBuffer.length === 1) {
        index = matchFirstChar(sortedIndexByFirstChar, focusedItemIndex, isItemAtIndexDisabled, state);
    } else {
        index = matchAllChars(sortedIndexByFirstChar, isItemAtIndexDisabled, state);
    }
    if (index !== -1 && !skipFocus) {
        focusItemAtIndex(index);
    }
    return index;
}
exports.matchItem = matchItem;
/**
 * Matches the user's single input character in the buffer to the
 * next option that begins with such character. Wraps around if at
 * end of options. Returns -1 if no match is found.
 */
function matchFirstChar(sortedIndexByFirstChar, focusedItemIndex, isItemAtIndexDisabled, state) {
    var firstChar = state.typeaheadBuffer[0];
    var itemsMatchingFirstChar = sortedIndexByFirstChar.get(firstChar);
    if (!itemsMatchingFirstChar) {
        return -1;
    }
    // Has the same firstChar been recently matched?
    // Also, did starting index remain the same between key presses?
    // If both hold true, simply increment index.
    if (firstChar === state.currentFirstChar && itemsMatchingFirstChar[state.sortedIndexCursor].index === focusedItemIndex) {
        state.sortedIndexCursor = (state.sortedIndexCursor + 1) % itemsMatchingFirstChar.length;
        var newIndex = itemsMatchingFirstChar[state.sortedIndexCursor].index;
        if (!isItemAtIndexDisabled(newIndex)) {
            return newIndex;
        }
    }
    // If we're here, it means one of the following happened:
    // - either firstChar or startingIndex has changed, invalidating the
    // cursor.
    // - The next item of typeahead is disabled, so we have to look further.
    state.currentFirstChar = firstChar;
    var newCursorPosition = -1;
    var cursorPosition;
    // Find the first non-disabled item as a fallback.
    for (cursorPosition = 0; cursorPosition < itemsMatchingFirstChar.length; cursorPosition++) {
        if (!isItemAtIndexDisabled(itemsMatchingFirstChar[cursorPosition].index)) {
            newCursorPosition = cursorPosition;
            break;
        }
    }
    // Advance cursor to first item matching the firstChar that is positioned
    // after starting item. Cursor is unchanged from fallback if there's no
    // such item.
    for (; cursorPosition < itemsMatchingFirstChar.length; cursorPosition++) {
        if (itemsMatchingFirstChar[cursorPosition].index > focusedItemIndex && !isItemAtIndexDisabled(itemsMatchingFirstChar[cursorPosition].index)) {
            newCursorPosition = cursorPosition;
            break;
        }
    }
    if (newCursorPosition !== -1) {
        state.sortedIndexCursor = newCursorPosition;
        return itemsMatchingFirstChar[state.sortedIndexCursor].index;
    }
    return -1;
}
/**
 * Attempts to find the next item that matches all of the typeahead buffer.
 * Wraps around if at end of options. Returns -1 if no match is found.
 */
function matchAllChars(sortedIndexByFirstChar, isItemAtIndexDisabled, state) {
    var firstChar = state.typeaheadBuffer[0];
    var itemsMatchingFirstChar = sortedIndexByFirstChar.get(firstChar);
    if (!itemsMatchingFirstChar) {
        return -1;
    }
    // Do nothing if text already matches
    var startingItem = itemsMatchingFirstChar[state.sortedIndexCursor];
    if (startingItem.text.lastIndexOf(state.typeaheadBuffer, 0) === 0 && !isItemAtIndexDisabled(startingItem.index)) {
        return startingItem.index;
    }
    // Find next item that matches completely; if no match, we'll eventually
    // loop around to same position
    var cursorPosition = (state.sortedIndexCursor + 1) % itemsMatchingFirstChar.length;
    var nextCursorPosition = -1;
    while (cursorPosition !== state.sortedIndexCursor) {
        var currentItem = itemsMatchingFirstChar[cursorPosition];
        var matches = currentItem.text.lastIndexOf(state.typeaheadBuffer, 0) === 0;
        var isEnabled = !isItemAtIndexDisabled(currentItem.index);
        if (matches && isEnabled) {
            nextCursorPosition = cursorPosition;
            break;
        }
        cursorPosition = (cursorPosition + 1) % itemsMatchingFirstChar.length;
    }
    if (nextCursorPosition !== -1) {
        state.sortedIndexCursor = nextCursorPosition;
        return itemsMatchingFirstChar[state.sortedIndexCursor].index;
    }
    return -1;
}
/**
 * Whether or not the given typeahead instaance state is currently typing.
 *
 * @param state The typeahead state instance. See `initState`.
 */
function isTypingInProgress(state) {
    return state.typeaheadBuffer.length > 0;
}
exports.isTypingInProgress = isTypingInProgress;
/**
 * Clears the typeahaed buffer so that it resets item matching to the first
 * character.
 *
 * @param state The typeahead state instance. See `initState`.
 */
function clearBuffer(state) {
    state.typeaheadBuffer = '';
}
exports.clearBuffer = clearBuffer;
/**
 * Given a keydown event, it calculates whether or not to automatically focus a
 * list item depending on what was typed mimicing the typeahead functionality of
 * a standard <select> element that is open.
 *
 * @param opts Options and accessors
 *   - event - the KeyboardEvent to handle and parse
 *   - sortedIndexByFirstChar - output of `initSortedIndex(...)`
 *   - focusedItemIndex - the index of the currently focused item
 *   - focusItemAtIndex - function that focuses a list item at given index
 *   - isItemAtFocusedIndexDisabled - whether or not the currently focused item
 *      is disabled
 *   - isTargetListItem - whether or not the event target is a list item
 * @param state The typeahead state instance. See `initState`.
 *
 * @returns index of the item matched by the keydown. -1 if not matched.
 */
function handleKeydown(opts, state) {
    var event = opts.event,
        isTargetListItem = opts.isTargetListItem,
        focusedItemIndex = opts.focusedItemIndex,
        focusItemAtIndex = opts.focusItemAtIndex,
        sortedIndexByFirstChar = opts.sortedIndexByFirstChar,
        isItemAtIndexDisabled = opts.isItemAtIndexDisabled;
    var isArrowLeft = keyboard_1.normalizeKey(event) === 'ArrowLeft';
    var isArrowUp = keyboard_1.normalizeKey(event) === 'ArrowUp';
    var isArrowRight = keyboard_1.normalizeKey(event) === 'ArrowRight';
    var isArrowDown = keyboard_1.normalizeKey(event) === 'ArrowDown';
    var isHome = keyboard_1.normalizeKey(event) === 'Home';
    var isEnd = keyboard_1.normalizeKey(event) === 'End';
    var isEnter = keyboard_1.normalizeKey(event) === 'Enter';
    var isSpace = keyboard_1.normalizeKey(event) === 'Spacebar';
    if (event.ctrlKey || event.metaKey || isArrowLeft || isArrowUp || isArrowRight || isArrowDown || isHome || isEnd || isEnter) {
        return -1;
    }
    var isCharacterKey = !isSpace && event.key.length === 1;
    if (isCharacterKey) {
        events_1.preventDefaultEvent(event);
        var matchItemOpts = {
            focusItemAtIndex: focusItemAtIndex,
            focusedItemIndex: focusedItemIndex,
            nextChar: event.key.toLowerCase(),
            sortedIndexByFirstChar: sortedIndexByFirstChar,
            skipFocus: false,
            isItemAtIndexDisabled: isItemAtIndexDisabled
        };
        return matchItem(matchItemOpts, state);
    }
    if (!isSpace) {
        return -1;
    }
    if (isTargetListItem) {
        events_1.preventDefaultEvent(event);
    }
    var typeaheadOnListItem = isTargetListItem && isTypingInProgress(state);
    if (typeaheadOnListItem) {
        var matchItemOpts = {
            focusItemAtIndex: focusItemAtIndex,
            focusedItemIndex: focusedItemIndex,
            nextChar: ' ',
            sortedIndexByFirstChar: sortedIndexByFirstChar,
            skipFocus: false,
            isItemAtIndexDisabled: isItemAtIndexDisabled
        };
        // space participates in typeahead matching if in rapid typing mode
        return matchItem(matchItemOpts, state);
    }
    return -1;
}
exports.handleKeydown = handleKeydown;

/***/ }),

/***/ "./packages/mdc-menu-surface/component.ts":
/*!************************************************!*\
  !*** ./packages/mdc-menu-surface/component.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCMenuSurface = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-menu-surface/constants.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-menu-surface/foundation.ts");
var util_1 = __webpack_require__(/*! @material/animation/util */ "./packages/mdc-animation/util.ts");
var MDCMenuSurface = /** @class */function (_super) {
    __extends(MDCMenuSurface, _super);
    function MDCMenuSurface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCMenuSurface.attachTo = function (root) {
        return new MDCMenuSurface(root);
    };
    MDCMenuSurface.prototype.initialSyncWithDOM = function () {
        var _this = this;
        var parentEl = this.root.parentElement;
        this.anchorElement = parentEl && parentEl.classList.contains(constants_1.cssClasses.ANCHOR) ? parentEl : null;
        if (this.root.classList.contains(constants_1.cssClasses.FIXED)) {
            this.setFixedPosition(true);
        }
        this.handleKeydown = function (event) {
            _this.foundation.handleKeydown(event);
        };
        this.handleBodyClick = function (event) {
            _this.foundation.handleBodyClick(event);
        };
        // capture so that no race between handleBodyClick and quickOpen when
        // menusurface opened on button click which registers this listener
        this.registerBodyClickListener = function () {
            document.body.addEventListener('click', _this.handleBodyClick, { capture: true });
        };
        this.deregisterBodyClickListener = function () {
            document.body.removeEventListener('click', _this.handleBodyClick, { capture: true });
        };
        this.listen('keydown', this.handleKeydown);
        this.listen(constants_1.strings.OPENED_EVENT, this.registerBodyClickListener);
        this.listen(constants_1.strings.CLOSED_EVENT, this.deregisterBodyClickListener);
    };
    MDCMenuSurface.prototype.destroy = function () {
        this.unlisten('keydown', this.handleKeydown);
        this.unlisten(constants_1.strings.OPENED_EVENT, this.registerBodyClickListener);
        this.unlisten(constants_1.strings.CLOSED_EVENT, this.deregisterBodyClickListener);
        _super.prototype.destroy.call(this);
    };
    MDCMenuSurface.prototype.isOpen = function () {
        return this.foundation.isOpen();
    };
    MDCMenuSurface.prototype.open = function () {
        this.foundation.open();
    };
    MDCMenuSurface.prototype.close = function (skipRestoreFocus) {
        if (skipRestoreFocus === void 0) {
            skipRestoreFocus = false;
        }
        this.foundation.close(skipRestoreFocus);
    };
    Object.defineProperty(MDCMenuSurface.prototype, "quickOpen", {
        set: function set(quickOpen) {
            this.foundation.setQuickOpen(quickOpen);
        },
        enumerable: false,
        configurable: true
    });
    /** Sets the foundation to use page offsets for an positioning when the menu is hoisted to the body. */
    MDCMenuSurface.prototype.setIsHoisted = function (isHoisted) {
        this.foundation.setIsHoisted(isHoisted);
    };
    /** Sets the element that the menu-surface is anchored to. */
    MDCMenuSurface.prototype.setMenuSurfaceAnchorElement = function (element) {
        this.anchorElement = element;
    };
    /** Sets the menu-surface to position: fixed. */
    MDCMenuSurface.prototype.setFixedPosition = function (isFixed) {
        if (isFixed) {
            this.root.classList.add(constants_1.cssClasses.FIXED);
        } else {
            this.root.classList.remove(constants_1.cssClasses.FIXED);
        }
        this.foundation.setFixedPosition(isFixed);
    };
    /** Sets the absolute x/y position to position based on. Requires the menu to be hoisted. */
    MDCMenuSurface.prototype.setAbsolutePosition = function (x, y) {
        this.foundation.setAbsolutePosition(x, y);
        this.setIsHoisted(true);
    };
    /**
     * @param corner Default anchor corner alignment of top-left surface corner.
     */
    MDCMenuSurface.prototype.setAnchorCorner = function (corner) {
        this.foundation.setAnchorCorner(corner);
    };
    MDCMenuSurface.prototype.setAnchorMargin = function (margin) {
        this.foundation.setAnchorMargin(margin);
    };
    MDCMenuSurface.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function addClass(className) {
                return _this.root.classList.add(className);
            },
            removeClass: function removeClass(className) {
                return _this.root.classList.remove(className);
            },
            hasClass: function hasClass(className) {
                return _this.root.classList.contains(className);
            },
            hasAnchor: function hasAnchor() {
                return !!_this.anchorElement;
            },
            notifyClose: function notifyClose() {
                return _this.emit(foundation_1.MDCMenuSurfaceFoundation.strings.CLOSED_EVENT, {});
            },
            notifyClosing: function notifyClosing() {
                _this.emit(foundation_1.MDCMenuSurfaceFoundation.strings.CLOSING_EVENT, {});
            },
            notifyOpen: function notifyOpen() {
                return _this.emit(foundation_1.MDCMenuSurfaceFoundation.strings.OPENED_EVENT, {});
            },
            isElementInContainer: function isElementInContainer(el) {
                return _this.root.contains(el);
            },
            isRtl: function isRtl() {
                return getComputedStyle(_this.root).getPropertyValue('direction') === 'rtl';
            },
            setTransformOrigin: function setTransformOrigin(origin) {
                var propertyName = util_1.getCorrectPropertyName(window, 'transform') + "-origin";
                _this.root.style.setProperty(propertyName, origin);
            },
            isFocused: function isFocused() {
                return document.activeElement === _this.root;
            },
            saveFocus: function saveFocus() {
                _this.previousFocus = document.activeElement;
            },
            restoreFocus: function restoreFocus() {
                if (_this.root.contains(document.activeElement)) {
                    if (_this.previousFocus && _this.previousFocus.focus) {
                        _this.previousFocus.focus();
                    }
                }
            },
            getInnerDimensions: function getInnerDimensions() {
                return {
                    width: _this.root.offsetWidth,
                    height: _this.root.offsetHeight
                };
            },
            getAnchorDimensions: function getAnchorDimensions() {
                return _this.anchorElement ? _this.anchorElement.getBoundingClientRect() : null;
            },
            getWindowDimensions: function getWindowDimensions() {
                return { width: window.innerWidth, height: window.innerHeight };
            },
            getBodyDimensions: function getBodyDimensions() {
                return { width: document.body.clientWidth, height: document.body.clientHeight };
            },
            getWindowScroll: function getWindowScroll() {
                return { x: window.pageXOffset, y: window.pageYOffset };
            },
            setPosition: function setPosition(position) {
                var rootHTML = _this.root;
                rootHTML.style.left = 'left' in position ? position.left + "px" : '';
                rootHTML.style.right = 'right' in position ? position.right + "px" : '';
                rootHTML.style.top = 'top' in position ? position.top + "px" : '';
                rootHTML.style.bottom = 'bottom' in position ? position.bottom + "px" : '';
            },
            setMaxHeight: function setMaxHeight(height) {
                _this.root.style.maxHeight = height;
            }
        };
        // tslint:enable:object-literal-sort-keys
        return new foundation_1.MDCMenuSurfaceFoundation(adapter);
    };
    return MDCMenuSurface;
}(component_1.MDCComponent);
exports.MDCMenuSurface = MDCMenuSurface;

/***/ }),

/***/ "./packages/mdc-menu-surface/constants.ts":
/*!************************************************!*\
  !*** ./packages/mdc-menu-surface/constants.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.Corner = exports.CornerBit = exports.numbers = exports.strings = exports.cssClasses = void 0;
var cssClasses = {
    ANCHOR: 'mdc-menu-surface--anchor',
    ANIMATING_CLOSED: 'mdc-menu-surface--animating-closed',
    ANIMATING_OPEN: 'mdc-menu-surface--animating-open',
    FIXED: 'mdc-menu-surface--fixed',
    IS_OPEN_BELOW: 'mdc-menu-surface--is-open-below',
    OPEN: 'mdc-menu-surface--open',
    ROOT: 'mdc-menu-surface'
};
exports.cssClasses = cssClasses;
// tslint:disable:object-literal-sort-keys
var strings = {
    CLOSED_EVENT: 'MDCMenuSurface:closed',
    CLOSING_EVENT: 'MDCMenuSurface:closing',
    OPENED_EVENT: 'MDCMenuSurface:opened',
    FOCUSABLE_ELEMENTS: ['button:not(:disabled)', '[href]:not([aria-disabled="true"])', 'input:not(:disabled)', 'select:not(:disabled)', 'textarea:not(:disabled)', '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])'].join(', ')
};
exports.strings = strings;
// tslint:enable:object-literal-sort-keys
var numbers = {
    /** Total duration of menu-surface open animation. */
    TRANSITION_OPEN_DURATION: 120,
    /** Total duration of menu-surface close animation. */
    TRANSITION_CLOSE_DURATION: 75,
    /** Margin left to the edge of the viewport when menu-surface is at maximum possible height. Also used as a viewport margin. */
    MARGIN_TO_EDGE: 32,
    /** Ratio of anchor width to menu-surface width for switching from corner positioning to center positioning. */
    ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO: 0.67
};
exports.numbers = numbers;
/**
 * Enum for bits in the {@see Corner) bitmap.
 */
var CornerBit;
(function (CornerBit) {
    CornerBit[CornerBit["BOTTOM"] = 1] = "BOTTOM";
    CornerBit[CornerBit["CENTER"] = 2] = "CENTER";
    CornerBit[CornerBit["RIGHT"] = 4] = "RIGHT";
    CornerBit[CornerBit["FLIP_RTL"] = 8] = "FLIP_RTL";
})(CornerBit || (CornerBit = {}));
exports.CornerBit = CornerBit;
/**
 * Enum for representing an element corner for positioning the menu-surface.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 */
var Corner;
(function (Corner) {
    Corner[Corner["TOP_LEFT"] = 0] = "TOP_LEFT";
    Corner[Corner["TOP_RIGHT"] = 4] = "TOP_RIGHT";
    Corner[Corner["BOTTOM_LEFT"] = 1] = "BOTTOM_LEFT";
    Corner[Corner["BOTTOM_RIGHT"] = 5] = "BOTTOM_RIGHT";
    Corner[Corner["TOP_START"] = 8] = "TOP_START";
    Corner[Corner["TOP_END"] = 12] = "TOP_END";
    Corner[Corner["BOTTOM_START"] = 9] = "BOTTOM_START";
    Corner[Corner["BOTTOM_END"] = 13] = "BOTTOM_END";
})(Corner || (Corner = {}));
exports.Corner = Corner;

/***/ }),

/***/ "./packages/mdc-menu-surface/foundation.ts":
/*!*************************************************!*\
  !*** ./packages/mdc-menu-surface/foundation.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = this && this.__values || function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
        m = s && o[s],
        i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function next() {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCMenuSurfaceFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-menu-surface/constants.ts");
var MDCMenuSurfaceFoundation = /** @class */function (_super) {
    __extends(MDCMenuSurfaceFoundation, _super);
    function MDCMenuSurfaceFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCMenuSurfaceFoundation.defaultAdapter), adapter)) || this;
        _this.isSurfaceOpen = false;
        _this.isQuickOpen = false;
        _this.isHoistedElement = false;
        _this.isFixedPosition = false;
        _this.isHorizontallyCenteredOnViewport = false;
        _this.maxHeight = 0;
        _this.openAnimationEndTimerId = 0;
        _this.closeAnimationEndTimerId = 0;
        _this.animationRequestId = 0;
        _this.anchorCorner = constants_1.Corner.TOP_START;
        /**
         * Corner of the menu surface to which menu surface is attached to anchor.
         *
         *  Anchor corner --->+----------+
         *                    |  ANCHOR  |
         *                    +----------+
         *  Origin corner --->+--------------+
         *                    |              |
         *                    |              |
         *                    | MENU SURFACE |
         *                    |              |
         *                    |              |
         *                    +--------------+
         */
        _this.originCorner = constants_1.Corner.TOP_START;
        _this.anchorMargin = { top: 0, right: 0, bottom: 0, left: 0 };
        _this.position = { x: 0, y: 0 };
        return _this;
    }
    Object.defineProperty(MDCMenuSurfaceFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "numbers", {
        get: function get() {
            return constants_1.numbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "Corner", {
        get: function get() {
            return constants_1.Corner;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "defaultAdapter", {
        /**
         * @see {@link MDCMenuSurfaceAdapter} for typing information on parameters and return types.
         */
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function addClass() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                hasClass: function hasClass() {
                    return false;
                },
                hasAnchor: function hasAnchor() {
                    return false;
                },
                isElementInContainer: function isElementInContainer() {
                    return false;
                },
                isFocused: function isFocused() {
                    return false;
                },
                isRtl: function isRtl() {
                    return false;
                },
                getInnerDimensions: function getInnerDimensions() {
                    return { height: 0, width: 0 };
                },
                getAnchorDimensions: function getAnchorDimensions() {
                    return null;
                },
                getWindowDimensions: function getWindowDimensions() {
                    return { height: 0, width: 0 };
                },
                getBodyDimensions: function getBodyDimensions() {
                    return { height: 0, width: 0 };
                },
                getWindowScroll: function getWindowScroll() {
                    return { x: 0, y: 0 };
                },
                setPosition: function setPosition() {
                    return undefined;
                },
                setMaxHeight: function setMaxHeight() {
                    return undefined;
                },
                setTransformOrigin: function setTransformOrigin() {
                    return undefined;
                },
                saveFocus: function saveFocus() {
                    return undefined;
                },
                restoreFocus: function restoreFocus() {
                    return undefined;
                },
                notifyClose: function notifyClose() {
                    return undefined;
                },
                notifyOpen: function notifyOpen() {
                    return undefined;
                },
                notifyClosing: function notifyClosing() {
                    return undefined;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCMenuSurfaceFoundation.prototype.init = function () {
        var _a = MDCMenuSurfaceFoundation.cssClasses,
            ROOT = _a.ROOT,
            OPEN = _a.OPEN;
        if (!this.adapter.hasClass(ROOT)) {
            throw new Error(ROOT + " class required in root element.");
        }
        if (this.adapter.hasClass(OPEN)) {
            this.isSurfaceOpen = true;
        }
    };
    MDCMenuSurfaceFoundation.prototype.destroy = function () {
        clearTimeout(this.openAnimationEndTimerId);
        clearTimeout(this.closeAnimationEndTimerId);
        // Cancel any currently running animations.
        cancelAnimationFrame(this.animationRequestId);
    };
    /**
     * @param corner Default anchor corner alignment of top-left menu surface corner.
     */
    MDCMenuSurfaceFoundation.prototype.setAnchorCorner = function (corner) {
        this.anchorCorner = corner;
    };
    /**
     * Flip menu corner horizontally.
     */
    MDCMenuSurfaceFoundation.prototype.flipCornerHorizontally = function () {
        this.originCorner = this.originCorner ^ constants_1.CornerBit.RIGHT;
    };
    /**
     * @param margin Set of margin values from anchor.
     */
    MDCMenuSurfaceFoundation.prototype.setAnchorMargin = function (margin) {
        this.anchorMargin.top = margin.top || 0;
        this.anchorMargin.right = margin.right || 0;
        this.anchorMargin.bottom = margin.bottom || 0;
        this.anchorMargin.left = margin.left || 0;
    };
    /** Used to indicate if the menu-surface is hoisted to the body. */
    MDCMenuSurfaceFoundation.prototype.setIsHoisted = function (isHoisted) {
        this.isHoistedElement = isHoisted;
    };
    /** Used to set the menu-surface calculations based on a fixed position menu. */
    MDCMenuSurfaceFoundation.prototype.setFixedPosition = function (isFixedPosition) {
        this.isFixedPosition = isFixedPosition;
    };
    /** Sets the menu-surface position on the page. */
    MDCMenuSurfaceFoundation.prototype.setAbsolutePosition = function (x, y) {
        this.position.x = this.isFinite(x) ? x : 0;
        this.position.y = this.isFinite(y) ? y : 0;
    };
    /** Sets whether menu-surface should be horizontally centered to viewport. */
    MDCMenuSurfaceFoundation.prototype.setIsHorizontallyCenteredOnViewport = function (isCentered) {
        this.isHorizontallyCenteredOnViewport = isCentered;
    };
    MDCMenuSurfaceFoundation.prototype.setQuickOpen = function (quickOpen) {
        this.isQuickOpen = quickOpen;
    };
    /**
     * Sets maximum menu-surface height on open.
     * @param maxHeight The desired max-height. Set to 0 (default) to
     *     automatically calculate max height based on available viewport space.
     */
    MDCMenuSurfaceFoundation.prototype.setMaxHeight = function (maxHeight) {
        this.maxHeight = maxHeight;
    };
    MDCMenuSurfaceFoundation.prototype.isOpen = function () {
        return this.isSurfaceOpen;
    };
    /**
     * Open the menu surface.
     */
    MDCMenuSurfaceFoundation.prototype.open = function () {
        var _this = this;
        if (this.isSurfaceOpen) {
            return;
        }
        this.adapter.saveFocus();
        if (this.isQuickOpen) {
            this.isSurfaceOpen = true;
            this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
            this.dimensions = this.adapter.getInnerDimensions();
            this.autoposition();
            this.adapter.notifyOpen();
        } else {
            this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
            this.animationRequestId = requestAnimationFrame(function () {
                _this.dimensions = _this.adapter.getInnerDimensions();
                _this.autoposition();
                _this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
                _this.openAnimationEndTimerId = setTimeout(function () {
                    _this.openAnimationEndTimerId = 0;
                    _this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
                    _this.adapter.notifyOpen();
                }, constants_1.numbers.TRANSITION_OPEN_DURATION);
            });
            this.isSurfaceOpen = true;
        }
    };
    /**
     * Closes the menu surface.
     */
    MDCMenuSurfaceFoundation.prototype.close = function (skipRestoreFocus) {
        var _this = this;
        if (skipRestoreFocus === void 0) {
            skipRestoreFocus = false;
        }
        if (!this.isSurfaceOpen) {
            return;
        }
        this.adapter.notifyClosing();
        if (this.isQuickOpen) {
            this.isSurfaceOpen = false;
            if (!skipRestoreFocus) {
                this.maybeRestoreFocus();
            }
            this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
            this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
            this.adapter.notifyClose();
            return;
        }
        this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
        requestAnimationFrame(function () {
            _this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
            _this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
            _this.closeAnimationEndTimerId = setTimeout(function () {
                _this.closeAnimationEndTimerId = 0;
                _this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
                _this.adapter.notifyClose();
            }, constants_1.numbers.TRANSITION_CLOSE_DURATION);
        });
        this.isSurfaceOpen = false;
        if (!skipRestoreFocus) {
            this.maybeRestoreFocus();
        }
    };
    /** Handle clicks and close if not within menu-surface element. */
    MDCMenuSurfaceFoundation.prototype.handleBodyClick = function (evt) {
        var el = evt.target;
        if (this.adapter.isElementInContainer(el)) {
            return;
        }
        this.close();
    };
    /** Handle keys that close the surface. */
    MDCMenuSurfaceFoundation.prototype.handleKeydown = function (evt) {
        var keyCode = evt.keyCode,
            key = evt.key;
        var isEscape = key === 'Escape' || keyCode === 27;
        if (isEscape) {
            this.close();
        }
    };
    MDCMenuSurfaceFoundation.prototype.autoposition = function () {
        var _a;
        // Compute measurements for autoposition methods reuse.
        this.measurements = this.getAutoLayoutmeasurements();
        var corner = this.getoriginCorner();
        var maxMenuSurfaceHeight = this.getMenuSurfaceMaxHeight(corner);
        var verticalAlignment = this.hasBit(corner, constants_1.CornerBit.BOTTOM) ? 'bottom' : 'top';
        var horizontalAlignment = this.hasBit(corner, constants_1.CornerBit.RIGHT) ? 'right' : 'left';
        var horizontalOffset = this.getHorizontalOriginOffset(corner);
        var verticalOffset = this.getVerticalOriginOffset(corner);
        var _b = this.measurements,
            anchorSize = _b.anchorSize,
            surfaceSize = _b.surfaceSize;
        var position = (_a = {}, _a[horizontalAlignment] = horizontalOffset, _a[verticalAlignment] = verticalOffset, _a);
        // Center align when anchor width is comparable or greater than menu surface, otherwise keep corner.
        if (anchorSize.width / surfaceSize.width > constants_1.numbers.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO) {
            horizontalAlignment = 'center';
        }
        // If the menu-surface has been hoisted to the body, it's no longer relative to the anchor element
        if (this.isHoistedElement || this.isFixedPosition) {
            this.adjustPositionForHoistedElement(position);
        }
        this.adapter.setTransformOrigin(horizontalAlignment + " " + verticalAlignment);
        this.adapter.setPosition(position);
        this.adapter.setMaxHeight(maxMenuSurfaceHeight ? maxMenuSurfaceHeight + 'px' : '');
        // If it is opened from the top then add is-open-below class
        if (!this.hasBit(corner, constants_1.CornerBit.BOTTOM)) {
            this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
        }
    };
    /**
     * @return Measurements used to position menu surface popup.
     */
    MDCMenuSurfaceFoundation.prototype.getAutoLayoutmeasurements = function () {
        var anchorRect = this.adapter.getAnchorDimensions();
        var bodySize = this.adapter.getBodyDimensions();
        var viewportSize = this.adapter.getWindowDimensions();
        var windowScroll = this.adapter.getWindowScroll();
        if (!anchorRect) {
            // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
            anchorRect = {
                top: this.position.y,
                right: this.position.x,
                bottom: this.position.y,
                left: this.position.x,
                width: 0,
                height: 0
            };
            // tslint:enable:object-literal-sort-keys
        }
        return {
            anchorSize: anchorRect,
            bodySize: bodySize,
            surfaceSize: this.dimensions,
            viewportDistance: {
                // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
                top: anchorRect.top,
                right: viewportSize.width - anchorRect.right,
                bottom: viewportSize.height - anchorRect.bottom,
                left: anchorRect.left
            },
            viewportSize: viewportSize,
            windowScroll: windowScroll
        };
    };
    /**
     * Computes the corner of the anchor from which to animate and position the
     * menu surface.
     *
     * Only LEFT or RIGHT bit is used to position the menu surface ignoring RTL
     * context. E.g., menu surface will be positioned from right side on TOP_END.
     */
    MDCMenuSurfaceFoundation.prototype.getoriginCorner = function () {
        var corner = this.originCorner;
        var _a = this.measurements,
            viewportDistance = _a.viewportDistance,
            anchorSize = _a.anchorSize,
            surfaceSize = _a.surfaceSize;
        var MARGIN_TO_EDGE = MDCMenuSurfaceFoundation.numbers.MARGIN_TO_EDGE;
        var isAnchoredToBottom = this.hasBit(this.anchorCorner, constants_1.CornerBit.BOTTOM);
        var availableTop;
        var availableBottom;
        if (isAnchoredToBottom) {
            availableTop = viewportDistance.top - MARGIN_TO_EDGE + this.anchorMargin.bottom;
            availableBottom = viewportDistance.bottom - MARGIN_TO_EDGE - this.anchorMargin.bottom;
        } else {
            availableTop = viewportDistance.top - MARGIN_TO_EDGE + this.anchorMargin.top;
            availableBottom = viewportDistance.bottom - MARGIN_TO_EDGE + anchorSize.height - this.anchorMargin.top;
        }
        var isAvailableBottom = availableBottom - surfaceSize.height > 0;
        if (!isAvailableBottom && availableTop > availableBottom) {
            // Attach bottom side of surface to the anchor.
            corner = this.setBit(corner, constants_1.CornerBit.BOTTOM);
        }
        var isRtl = this.adapter.isRtl();
        var isFlipRtl = this.hasBit(this.anchorCorner, constants_1.CornerBit.FLIP_RTL);
        var hasRightBit = this.hasBit(this.anchorCorner, constants_1.CornerBit.RIGHT) || this.hasBit(corner, constants_1.CornerBit.RIGHT);
        // Whether surface attached to right side of anchor element.
        var isAnchoredToRight = false;
        // Anchored to start
        if (isRtl && isFlipRtl) {
            isAnchoredToRight = !hasRightBit;
        } else {
            // Anchored to right
            isAnchoredToRight = hasRightBit;
        }
        var availableLeft;
        var availableRight;
        if (isAnchoredToRight) {
            availableLeft = viewportDistance.left + anchorSize.width + this.anchorMargin.right;
            availableRight = viewportDistance.right - this.anchorMargin.right;
        } else {
            availableLeft = viewportDistance.left + this.anchorMargin.left;
            availableRight = viewportDistance.right + anchorSize.width - this.anchorMargin.left;
        }
        var isAvailableLeft = availableLeft - surfaceSize.width > 0;
        var isAvailableRight = availableRight - surfaceSize.width > 0;
        var isOriginCornerAlignedToEnd = this.hasBit(corner, constants_1.CornerBit.FLIP_RTL) && this.hasBit(corner, constants_1.CornerBit.RIGHT);
        if (isAvailableRight && isOriginCornerAlignedToEnd && isRtl || !isAvailableLeft && isOriginCornerAlignedToEnd) {
            // Attach left side of surface to the anchor.
            corner = this.unsetBit(corner, constants_1.CornerBit.RIGHT);
        } else if (isAvailableLeft && isAnchoredToRight && isRtl || isAvailableLeft && !isAnchoredToRight && hasRightBit || !isAvailableRight && availableLeft >= availableRight) {
            // Attach right side of surface to the anchor.
            corner = this.setBit(corner, constants_1.CornerBit.RIGHT);
        }
        return corner;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Maximum height of the menu surface, based on available space. 0 indicates should not be set.
     */
    MDCMenuSurfaceFoundation.prototype.getMenuSurfaceMaxHeight = function (corner) {
        if (this.maxHeight > 0) {
            return this.maxHeight;
        }
        var viewportDistance = this.measurements.viewportDistance;
        var maxHeight = 0;
        var isBottomAligned = this.hasBit(corner, constants_1.CornerBit.BOTTOM);
        var isBottomAnchored = this.hasBit(this.anchorCorner, constants_1.CornerBit.BOTTOM);
        var MARGIN_TO_EDGE = MDCMenuSurfaceFoundation.numbers.MARGIN_TO_EDGE;
        // When maximum height is not specified, it is handled from CSS.
        if (isBottomAligned) {
            maxHeight = viewportDistance.top + this.anchorMargin.top - MARGIN_TO_EDGE;
            if (!isBottomAnchored) {
                maxHeight += this.measurements.anchorSize.height;
            }
        } else {
            maxHeight = viewportDistance.bottom - this.anchorMargin.bottom + this.measurements.anchorSize.height - MARGIN_TO_EDGE;
            if (isBottomAnchored) {
                maxHeight -= this.measurements.anchorSize.height;
            }
        }
        return maxHeight;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Horizontal offset of menu surface origin corner from corresponding anchor corner.
     */
    MDCMenuSurfaceFoundation.prototype.getHorizontalOriginOffset = function (corner) {
        var anchorSize = this.measurements.anchorSize;
        // isRightAligned corresponds to using the 'right' property on the surface.
        var isRightAligned = this.hasBit(corner, constants_1.CornerBit.RIGHT);
        var avoidHorizontalOverlap = this.hasBit(this.anchorCorner, constants_1.CornerBit.RIGHT);
        if (isRightAligned) {
            var rightOffset = avoidHorizontalOverlap ? anchorSize.width - this.anchorMargin.left : this.anchorMargin.right;
            // For hoisted or fixed elements, adjust the offset by the difference
            // between viewport width and body width so when we calculate the right
            // value (`adjustPositionForHoistedElement`) based on the element
            // position, the right property is correct.
            if (this.isHoistedElement || this.isFixedPosition) {
                return rightOffset - (this.measurements.viewportSize.width - this.measurements.bodySize.width);
            }
            return rightOffset;
        }
        return avoidHorizontalOverlap ? anchorSize.width - this.anchorMargin.right : this.anchorMargin.left;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Vertical offset of menu surface origin corner from corresponding anchor corner.
     */
    MDCMenuSurfaceFoundation.prototype.getVerticalOriginOffset = function (corner) {
        var anchorSize = this.measurements.anchorSize;
        var isBottomAligned = this.hasBit(corner, constants_1.CornerBit.BOTTOM);
        var avoidVerticalOverlap = this.hasBit(this.anchorCorner, constants_1.CornerBit.BOTTOM);
        var y = 0;
        if (isBottomAligned) {
            y = avoidVerticalOverlap ? anchorSize.height - this.anchorMargin.top : -this.anchorMargin.bottom;
        } else {
            y = avoidVerticalOverlap ? anchorSize.height + this.anchorMargin.bottom : this.anchorMargin.top;
        }
        return y;
    };
    /** Calculates the offsets for positioning the menu-surface when the menu-surface has been hoisted to the body. */
    MDCMenuSurfaceFoundation.prototype.adjustPositionForHoistedElement = function (position) {
        var e_1, _a;
        var _b = this.measurements,
            windowScroll = _b.windowScroll,
            viewportDistance = _b.viewportDistance,
            surfaceSize = _b.surfaceSize,
            viewportSize = _b.viewportSize;
        var props = Object.keys(position);
        try {
            for (var props_1 = __values(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
                var prop = props_1_1.value;
                var value = position[prop] || 0;
                if (this.isHorizontallyCenteredOnViewport && (prop === 'left' || prop === 'right')) {
                    position[prop] = (viewportSize.width - surfaceSize.width) / 2;
                    continue;
                }
                // Hoisted surfaces need to have the anchor elements location on the page added to the
                // position properties for proper alignment on the body.
                value += viewportDistance[prop];
                // Surfaces that are absolutely positioned need to have additional calculations for scroll
                // and bottom positioning.
                if (!this.isFixedPosition) {
                    if (prop === 'top') {
                        value += windowScroll.y;
                    } else if (prop === 'bottom') {
                        value -= windowScroll.y;
                    } else if (prop === 'left') {
                        value += windowScroll.x;
                    } else {
                        // prop === 'right'
                        value -= windowScroll.x;
                    }
                }
                position[prop] = value;
            }
        } catch (e_1_1) {
            e_1 = { error: e_1_1 };
        } finally {
            try {
                if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
    };
    /**
     * The last focused element when the menu surface was opened should regain focus, if the user is
     * focused on or within the menu surface when it is closed.
     */
    MDCMenuSurfaceFoundation.prototype.maybeRestoreFocus = function () {
        var isRootFocused = this.adapter.isFocused();
        var childHasFocus = document.activeElement && this.adapter.isElementInContainer(document.activeElement);
        if (isRootFocused || childHasFocus) {
            this.adapter.restoreFocus();
        }
    };
    MDCMenuSurfaceFoundation.prototype.hasBit = function (corner, bit) {
        return Boolean(corner & bit); // tslint:disable-line:no-bitwise
    };
    MDCMenuSurfaceFoundation.prototype.setBit = function (corner, bit) {
        return corner | bit; // tslint:disable-line:no-bitwise
    };
    MDCMenuSurfaceFoundation.prototype.unsetBit = function (corner, bit) {
        return corner ^ bit;
    };
    /**
     * isFinite that doesn't force conversion to number type.
     * Equivalent to Number.isFinite in ES2015, which is not supported in IE.
     */
    MDCMenuSurfaceFoundation.prototype.isFinite = function (num) {
        return typeof num === 'number' && isFinite(num);
    };
    return MDCMenuSurfaceFoundation;
}(foundation_1.MDCFoundation);
exports.MDCMenuSurfaceFoundation = MDCMenuSurfaceFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCMenuSurfaceFoundation;

/***/ }),

/***/ "./packages/mdc-menu/component.ts":
/*!****************************************!*\
  !*** ./packages/mdc-menu/component.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCMenu = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var ponyfill_1 = __webpack_require__(/*! @material/dom/ponyfill */ "./packages/mdc-dom/ponyfill.ts");
var component_2 = __webpack_require__(/*! @material/list/component */ "./packages/mdc-list/component.ts");
var constants_1 = __webpack_require__(/*! @material/list/constants */ "./packages/mdc-list/constants.ts");
var foundation_1 = __webpack_require__(/*! @material/list/foundation */ "./packages/mdc-list/foundation.ts");
var component_3 = __webpack_require__(/*! @material/menu-surface/component */ "./packages/mdc-menu-surface/component.ts");
var foundation_2 = __webpack_require__(/*! @material/menu-surface/foundation */ "./packages/mdc-menu-surface/foundation.ts");
var constants_2 = __webpack_require__(/*! ./constants */ "./packages/mdc-menu/constants.ts");
var foundation_3 = __webpack_require__(/*! ./foundation */ "./packages/mdc-menu/foundation.ts");
var MDCMenu = /** @class */function (_super) {
    __extends(MDCMenu, _super);
    function MDCMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCMenu.attachTo = function (root) {
        return new MDCMenu(root);
    };
    MDCMenu.prototype.initialize = function (menuSurfaceFactory, listFactory) {
        if (menuSurfaceFactory === void 0) {
            menuSurfaceFactory = function menuSurfaceFactory(el) {
                return new component_3.MDCMenuSurface(el);
            };
        }
        if (listFactory === void 0) {
            listFactory = function listFactory(el) {
                return new component_2.MDCList(el);
            };
        }
        this.menuSurfaceFactory = menuSurfaceFactory;
        this.listFactory = listFactory;
    };
    MDCMenu.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.menuSurface = this.menuSurfaceFactory(this.root);
        var list = this.root.querySelector(constants_2.strings.LIST_SELECTOR);
        if (list) {
            this.list = this.listFactory(list);
            this.list.wrapFocus = true;
        } else {
            this.list = null;
        }
        this.handleKeydown = function (evt) {
            _this.foundation.handleKeydown(evt);
        };
        this.handleItemAction = function (evt) {
            _this.foundation.handleItemAction(_this.items[evt.detail.index]);
        };
        this.handleMenuSurfaceOpened = function () {
            _this.foundation.handleMenuSurfaceOpened();
        };
        this.menuSurface.listen(foundation_2.MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.handleMenuSurfaceOpened);
        this.listen('keydown', this.handleKeydown);
        this.listen(foundation_1.MDCListFoundation.strings.ACTION_EVENT, this.handleItemAction);
    };
    MDCMenu.prototype.destroy = function () {
        if (this.list) {
            this.list.destroy();
        }
        this.menuSurface.destroy();
        this.menuSurface.unlisten(foundation_2.MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.handleMenuSurfaceOpened);
        this.unlisten('keydown', this.handleKeydown);
        this.unlisten(foundation_1.MDCListFoundation.strings.ACTION_EVENT, this.handleItemAction);
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(MDCMenu.prototype, "open", {
        get: function get() {
            return this.menuSurface.isOpen();
        },
        set: function set(value) {
            if (value) {
                this.menuSurface.open();
            } else {
                this.menuSurface.close();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "wrapFocus", {
        get: function get() {
            return this.list ? this.list.wrapFocus : false;
        },
        set: function set(value) {
            if (this.list) {
                this.list.wrapFocus = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "hasTypeahead", {
        /**
         * Sets whether the menu has typeahead functionality.
         * @param value Whether typeahead is enabled.
         */
        set: function set(value) {
            if (this.list) {
                this.list.hasTypeahead = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "typeaheadInProgress", {
        /**
         * @return Whether typeahead logic is currently matching some user prefix.
         */
        get: function get() {
            return this.list ? this.list.typeaheadInProgress : false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Given the next desired character from the user, adds it to the typeahead
     * buffer. Then, attempts to find the next option matching the buffer. Wraps
     * around if at the end of options.
     *
     * @param nextChar The next character to add to the prefix buffer.
     * @param startingIndex The index from which to start matching. Only relevant
     *     when starting a new match sequence. To start a new match sequence,
     *     clear the buffer using `clearTypeaheadBuffer`, or wait for the buffer
     *     to clear after a set interval defined in list foundation. Defaults to
     *     the currently focused index.
     * @return The index of the matched item, or -1 if no match.
     */
    MDCMenu.prototype.typeaheadMatchItem = function (nextChar, startingIndex) {
        if (this.list) {
            return this.list.typeaheadMatchItem(nextChar, startingIndex);
        }
        return -1;
    };
    /**
     * Layout the underlying list element in the case of any dynamic updates
     * to its structure.
     */
    MDCMenu.prototype.layout = function () {
        if (this.list) {
            this.list.layout();
        }
    };
    Object.defineProperty(MDCMenu.prototype, "items", {
        /**
         * Return the items within the menu. Note that this only contains the set of elements within
         * the items container that are proper list items, and not supplemental / presentational DOM
         * elements.
         */
        get: function get() {
            return this.list ? this.list.listElements : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "singleSelection", {
        /**
         * Turns on/off the underlying list's single selection mode. Used mainly
         * by select menu.
         *
         * @param singleSelection Whether to enable single selection mode.
         */
        set: function set(singleSelection) {
            if (this.list) {
                this.list.singleSelection = singleSelection;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "selectedIndex", {
        /**
         * Retrieves the selected index. Only applicable to select menus.
         * @return The selected index, which is a number for single selection and
         *     radio lists, and an array of numbers for checkbox lists.
         */
        get: function get() {
            return this.list ? this.list.selectedIndex : constants_1.numbers.UNSET_INDEX;
        },
        /**
         * Sets the selected index of the list. Only applicable to select menus.
         * @param index The selected index, which is a number for single selection and
         *     radio lists, and an array of numbers for checkbox lists.
         */
        set: function set(index) {
            if (this.list) {
                this.list.selectedIndex = index;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "quickOpen", {
        set: function set(quickOpen) {
            this.menuSurface.quickOpen = quickOpen;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets default focus state where the menu should focus every time when menu
     * is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by
     * default.
     * @param focusState Default focus state.
     */
    MDCMenu.prototype.setDefaultFocusState = function (focusState) {
        this.foundation.setDefaultFocusState(focusState);
    };
    /**
     * @param corner Default anchor corner alignment of top-left menu corner.
     */
    MDCMenu.prototype.setAnchorCorner = function (corner) {
        this.menuSurface.setAnchorCorner(corner);
    };
    MDCMenu.prototype.setAnchorMargin = function (margin) {
        this.menuSurface.setAnchorMargin(margin);
    };
    /**
     * Sets the list item as the selected row at the specified index.
     * @param index Index of list item within menu.
     */
    MDCMenu.prototype.setSelectedIndex = function (index) {
        this.foundation.setSelectedIndex(index);
    };
    /**
     * Sets the enabled state to isEnabled for the menu item at the given index.
     * @param index Index of the menu item
     * @param isEnabled The desired enabled state of the menu item.
     */
    MDCMenu.prototype.setEnabled = function (index, isEnabled) {
        this.foundation.setEnabled(index, isEnabled);
    };
    /**
     * @return The item within the menu at the index specified.
     */
    MDCMenu.prototype.getOptionByIndex = function (index) {
        var items = this.items;
        if (index < items.length) {
            return this.items[index];
        } else {
            return null;
        }
    };
    /**
     * @param index A menu item's index.
     * @return The primary text within the menu at the index specified.
     */
    MDCMenu.prototype.getPrimaryTextAtIndex = function (index) {
        var item = this.getOptionByIndex(index);
        if (item && this.list) {
            return this.list.getPrimaryText(item) || '';
        }
        return '';
    };
    MDCMenu.prototype.setFixedPosition = function (isFixed) {
        this.menuSurface.setFixedPosition(isFixed);
    };
    MDCMenu.prototype.setIsHoisted = function (isHoisted) {
        this.menuSurface.setIsHoisted(isHoisted);
    };
    MDCMenu.prototype.setAbsolutePosition = function (x, y) {
        this.menuSurface.setAbsolutePosition(x, y);
    };
    /**
     * Sets the element that the menu-surface is anchored to.
     */
    MDCMenu.prototype.setAnchorElement = function (element) {
        this.menuSurface.anchorElement = element;
    };
    MDCMenu.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClassToElementAtIndex: function addClassToElementAtIndex(index, className) {
                var list = _this.items;
                list[index].classList.add(className);
            },
            removeClassFromElementAtIndex: function removeClassFromElementAtIndex(index, className) {
                var list = _this.items;
                list[index].classList.remove(className);
            },
            addAttributeToElementAtIndex: function addAttributeToElementAtIndex(index, attr, value) {
                var list = _this.items;
                list[index].setAttribute(attr, value);
            },
            removeAttributeFromElementAtIndex: function removeAttributeFromElementAtIndex(index, attr) {
                var list = _this.items;
                list[index].removeAttribute(attr);
            },
            elementContainsClass: function elementContainsClass(element, className) {
                return element.classList.contains(className);
            },
            closeSurface: function closeSurface(skipRestoreFocus) {
                _this.menuSurface.close(skipRestoreFocus);
            },
            getElementIndex: function getElementIndex(element) {
                return _this.items.indexOf(element);
            },
            notifySelected: function notifySelected(evtData) {
                _this.emit(constants_2.strings.SELECTED_EVENT, {
                    index: evtData.index,
                    item: _this.items[evtData.index]
                });
            },
            getMenuItemCount: function getMenuItemCount() {
                return _this.items.length;
            },
            focusItemAtIndex: function focusItemAtIndex(index) {
                _this.items[index].focus();
            },
            focusListRoot: function focusListRoot() {
                _this.root.querySelector(constants_2.strings.LIST_SELECTOR).focus();
            },
            isSelectableItemAtIndex: function isSelectableItemAtIndex(index) {
                return !!ponyfill_1.closest(_this.items[index], "." + constants_2.cssClasses.MENU_SELECTION_GROUP);
            },
            getSelectedSiblingOfItemAtIndex: function getSelectedSiblingOfItemAtIndex(index) {
                var selectionGroupEl = ponyfill_1.closest(_this.items[index], "." + constants_2.cssClasses.MENU_SELECTION_GROUP);
                var selectedItemEl = selectionGroupEl.querySelector("." + constants_2.cssClasses.MENU_SELECTED_LIST_ITEM);
                return selectedItemEl ? _this.items.indexOf(selectedItemEl) : -1;
            }
        };
        // tslint:enable:object-literal-sort-keys
        return new foundation_3.MDCMenuFoundation(adapter);
    };
    return MDCMenu;
}(component_1.MDCComponent);
exports.MDCMenu = MDCMenu;

/***/ }),

/***/ "./packages/mdc-menu/constants.ts":
/*!****************************************!*\
  !*** ./packages/mdc-menu/constants.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFocusState = exports.numbers = exports.strings = exports.cssClasses = void 0;
var cssClasses = {
    MENU_SELECTED_LIST_ITEM: 'mdc-menu-item--selected',
    MENU_SELECTION_GROUP: 'mdc-menu__selection-group',
    ROOT: 'mdc-menu'
};
exports.cssClasses = cssClasses;
var strings = {
    ARIA_CHECKED_ATTR: 'aria-checked',
    ARIA_DISABLED_ATTR: 'aria-disabled',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    LIST_SELECTOR: '.mdc-list,.mdc-deprecated-list',
    SELECTED_EVENT: 'MDCMenu:selected'
};
exports.strings = strings;
var numbers = {
    FOCUS_ROOT_INDEX: -1
};
exports.numbers = numbers;
var DefaultFocusState;
(function (DefaultFocusState) {
    DefaultFocusState[DefaultFocusState["NONE"] = 0] = "NONE";
    DefaultFocusState[DefaultFocusState["LIST_ROOT"] = 1] = "LIST_ROOT";
    DefaultFocusState[DefaultFocusState["FIRST_ITEM"] = 2] = "FIRST_ITEM";
    DefaultFocusState[DefaultFocusState["LAST_ITEM"] = 3] = "LAST_ITEM";
})(DefaultFocusState || (DefaultFocusState = {}));
exports.DefaultFocusState = DefaultFocusState;

/***/ }),

/***/ "./packages/mdc-menu/foundation.ts":
/*!*****************************************!*\
  !*** ./packages/mdc-menu/foundation.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCMenuFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! @material/list/constants */ "./packages/mdc-list/constants.ts");
var foundation_2 = __webpack_require__(/*! @material/menu-surface/foundation */ "./packages/mdc-menu-surface/foundation.ts");
var constants_2 = __webpack_require__(/*! ./constants */ "./packages/mdc-menu/constants.ts");
var MDCMenuFoundation = /** @class */function (_super) {
    __extends(MDCMenuFoundation, _super);
    function MDCMenuFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCMenuFoundation.defaultAdapter), adapter)) || this;
        _this.closeAnimationEndTimerId = 0;
        _this.defaultFocusState = constants_2.DefaultFocusState.LIST_ROOT;
        _this.selectedIndex = -1;
        return _this;
    }
    Object.defineProperty(MDCMenuFoundation, "cssClasses", {
        get: function get() {
            return constants_2.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuFoundation, "strings", {
        get: function get() {
            return constants_2.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuFoundation, "numbers", {
        get: function get() {
            return constants_2.numbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuFoundation, "defaultAdapter", {
        /**
         * @see {@link MDCMenuAdapter} for typing information on parameters and return types.
         */
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClassToElementAtIndex: function addClassToElementAtIndex() {
                    return undefined;
                },
                removeClassFromElementAtIndex: function removeClassFromElementAtIndex() {
                    return undefined;
                },
                addAttributeToElementAtIndex: function addAttributeToElementAtIndex() {
                    return undefined;
                },
                removeAttributeFromElementAtIndex: function removeAttributeFromElementAtIndex() {
                    return undefined;
                },
                elementContainsClass: function elementContainsClass() {
                    return false;
                },
                closeSurface: function closeSurface() {
                    return undefined;
                },
                getElementIndex: function getElementIndex() {
                    return -1;
                },
                notifySelected: function notifySelected() {
                    return undefined;
                },
                getMenuItemCount: function getMenuItemCount() {
                    return 0;
                },
                focusItemAtIndex: function focusItemAtIndex() {
                    return undefined;
                },
                focusListRoot: function focusListRoot() {
                    return undefined;
                },
                getSelectedSiblingOfItemAtIndex: function getSelectedSiblingOfItemAtIndex() {
                    return -1;
                },
                isSelectableItemAtIndex: function isSelectableItemAtIndex() {
                    return false;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCMenuFoundation.prototype.destroy = function () {
        if (this.closeAnimationEndTimerId) {
            clearTimeout(this.closeAnimationEndTimerId);
        }
        this.adapter.closeSurface();
    };
    MDCMenuFoundation.prototype.handleKeydown = function (evt) {
        var key = evt.key,
            keyCode = evt.keyCode;
        var isTab = key === 'Tab' || keyCode === 9;
        if (isTab) {
            this.adapter.closeSurface( /** skipRestoreFocus */true);
        }
    };
    MDCMenuFoundation.prototype.handleItemAction = function (listItem) {
        var _this = this;
        var index = this.adapter.getElementIndex(listItem);
        if (index < 0) {
            return;
        }
        this.adapter.notifySelected({ index: index });
        this.adapter.closeSurface();
        // Wait for the menu to close before adding/removing classes that affect styles.
        this.closeAnimationEndTimerId = setTimeout(function () {
            // Recompute the index in case the menu contents have changed.
            var recomputedIndex = _this.adapter.getElementIndex(listItem);
            if (recomputedIndex >= 0 && _this.adapter.isSelectableItemAtIndex(recomputedIndex)) {
                _this.setSelectedIndex(recomputedIndex);
            }
        }, foundation_2.MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
    };
    MDCMenuFoundation.prototype.handleMenuSurfaceOpened = function () {
        switch (this.defaultFocusState) {
            case constants_2.DefaultFocusState.FIRST_ITEM:
                this.adapter.focusItemAtIndex(0);
                break;
            case constants_2.DefaultFocusState.LAST_ITEM:
                this.adapter.focusItemAtIndex(this.adapter.getMenuItemCount() - 1);
                break;
            case constants_2.DefaultFocusState.NONE:
                // Do nothing.
                break;
            default:
                this.adapter.focusListRoot();
                break;
        }
    };
    /**
     * Sets default focus state where the menu should focus every time when menu
     * is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by
     * default.
     */
    MDCMenuFoundation.prototype.setDefaultFocusState = function (focusState) {
        this.defaultFocusState = focusState;
    };
    /** @return Index of the currently selected list item within the menu. */
    MDCMenuFoundation.prototype.getSelectedIndex = function () {
        return this.selectedIndex;
    };
    /**
     * Selects the list item at `index` within the menu.
     * @param index Index of list item within the menu.
     */
    MDCMenuFoundation.prototype.setSelectedIndex = function (index) {
        this.validatedIndex(index);
        if (!this.adapter.isSelectableItemAtIndex(index)) {
            throw new Error('MDCMenuFoundation: No selection group at specified index.');
        }
        var prevSelectedIndex = this.adapter.getSelectedSiblingOfItemAtIndex(index);
        if (prevSelectedIndex >= 0) {
            this.adapter.removeAttributeFromElementAtIndex(prevSelectedIndex, constants_2.strings.ARIA_CHECKED_ATTR);
            this.adapter.removeClassFromElementAtIndex(prevSelectedIndex, constants_2.cssClasses.MENU_SELECTED_LIST_ITEM);
        }
        this.adapter.addClassToElementAtIndex(index, constants_2.cssClasses.MENU_SELECTED_LIST_ITEM);
        this.adapter.addAttributeToElementAtIndex(index, constants_2.strings.ARIA_CHECKED_ATTR, 'true');
        this.selectedIndex = index;
    };
    /**
     * Sets the enabled state to isEnabled for the menu item at the given index.
     * @param index Index of the menu item
     * @param isEnabled The desired enabled state of the menu item.
     */
    MDCMenuFoundation.prototype.setEnabled = function (index, isEnabled) {
        this.validatedIndex(index);
        if (isEnabled) {
            this.adapter.removeClassFromElementAtIndex(index, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS);
            this.adapter.addAttributeToElementAtIndex(index, constants_2.strings.ARIA_DISABLED_ATTR, 'false');
        } else {
            this.adapter.addClassToElementAtIndex(index, constants_1.cssClasses.LIST_ITEM_DISABLED_CLASS);
            this.adapter.addAttributeToElementAtIndex(index, constants_2.strings.ARIA_DISABLED_ATTR, 'true');
        }
    };
    MDCMenuFoundation.prototype.validatedIndex = function (index) {
        var menuSize = this.adapter.getMenuItemCount();
        var isIndexInRange = index >= 0 && index < menuSize;
        if (!isIndexInRange) {
            throw new Error('MDCMenuFoundation: No list item at specified index.');
        }
    };
    return MDCMenuFoundation;
}(foundation_1.MDCFoundation);
exports.MDCMenuFoundation = MDCMenuFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCMenuFoundation;

/***/ }),

/***/ "./packages/mdc-notched-outline/component.ts":
/*!***************************************************!*\
  !*** ./packages/mdc-notched-outline/component.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCNotchedOutline = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var foundation_1 = __webpack_require__(/*! @material/floating-label/foundation */ "./packages/mdc-floating-label/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-notched-outline/constants.ts");
var foundation_2 = __webpack_require__(/*! ./foundation */ "./packages/mdc-notched-outline/foundation.ts");
var MDCNotchedOutline = /** @class */function (_super) {
    __extends(MDCNotchedOutline, _super);
    function MDCNotchedOutline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCNotchedOutline.attachTo = function (root) {
        return new MDCNotchedOutline(root);
    };
    MDCNotchedOutline.prototype.initialSyncWithDOM = function () {
        this.notchElement = this.root.querySelector(constants_1.strings.NOTCH_ELEMENT_SELECTOR);
        var label = this.root.querySelector('.' + foundation_1.MDCFloatingLabelFoundation.cssClasses.ROOT);
        if (label) {
            label.style.transitionDuration = '0s';
            this.root.classList.add(constants_1.cssClasses.OUTLINE_UPGRADED);
            requestAnimationFrame(function () {
                label.style.transitionDuration = '';
            });
        } else {
            this.root.classList.add(constants_1.cssClasses.NO_LABEL);
        }
    };
    /**
     * Updates classes and styles to open the notch to the specified width.
     * @param notchWidth The notch width in the outline.
     */
    MDCNotchedOutline.prototype.notch = function (notchWidth) {
        this.foundation.notch(notchWidth);
    };
    /**
     * Updates classes and styles to close the notch.
     */
    MDCNotchedOutline.prototype.closeNotch = function () {
        this.foundation.closeNotch();
    };
    MDCNotchedOutline.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function addClass(className) {
                return _this.root.classList.add(className);
            },
            removeClass: function removeClass(className) {
                return _this.root.classList.remove(className);
            },
            setNotchWidthProperty: function setNotchWidthProperty(width) {
                _this.notchElement.style.setProperty('width', width + 'px');
            },
            removeNotchWidthProperty: function removeNotchWidthProperty() {
                _this.notchElement.style.removeProperty('width');
            }
        };
        // tslint:enable:object-literal-sort-keys
        return new foundation_2.MDCNotchedOutlineFoundation(adapter);
    };
    return MDCNotchedOutline;
}(component_1.MDCComponent);
exports.MDCNotchedOutline = MDCNotchedOutline;

/***/ }),

/***/ "./packages/mdc-notched-outline/constants.ts":
/*!***************************************************!*\
  !*** ./packages/mdc-notched-outline/constants.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.strings = exports.numbers = exports.cssClasses = void 0;
var strings = {
    NOTCH_ELEMENT_SELECTOR: '.mdc-notched-outline__notch'
};
exports.strings = strings;
var numbers = {
    // This should stay in sync with $mdc-notched-outline-padding * 2.
    NOTCH_ELEMENT_PADDING: 8
};
exports.numbers = numbers;
var cssClasses = {
    NO_LABEL: 'mdc-notched-outline--no-label',
    OUTLINE_NOTCHED: 'mdc-notched-outline--notched',
    OUTLINE_UPGRADED: 'mdc-notched-outline--upgraded'
};
exports.cssClasses = cssClasses;

/***/ }),

/***/ "./packages/mdc-notched-outline/foundation.ts":
/*!****************************************************!*\
  !*** ./packages/mdc-notched-outline/foundation.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCNotchedOutlineFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-notched-outline/constants.ts");
var MDCNotchedOutlineFoundation = /** @class */function (_super) {
    __extends(MDCNotchedOutlineFoundation, _super);
    function MDCNotchedOutlineFoundation(adapter) {
        return _super.call(this, __assign(__assign({}, MDCNotchedOutlineFoundation.defaultAdapter), adapter)) || this;
    }
    Object.defineProperty(MDCNotchedOutlineFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "numbers", {
        get: function get() {
            return constants_1.numbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "defaultAdapter", {
        /**
         * See {@link MDCNotchedOutlineAdapter} for typing information on parameters and return types.
         */
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function addClass() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                setNotchWidthProperty: function setNotchWidthProperty() {
                    return undefined;
                },
                removeNotchWidthProperty: function removeNotchWidthProperty() {
                    return undefined;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds the outline notched selector and updates the notch width calculated based off of notchWidth.
     */
    MDCNotchedOutlineFoundation.prototype.notch = function (notchWidth) {
        var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
        if (notchWidth > 0) {
            notchWidth += constants_1.numbers.NOTCH_ELEMENT_PADDING; // Add padding from left/right.
        }
        this.adapter.setNotchWidthProperty(notchWidth);
        this.adapter.addClass(OUTLINE_NOTCHED);
    };
    /**
     * Removes notched outline selector to close the notch in the outline.
     */
    MDCNotchedOutlineFoundation.prototype.closeNotch = function () {
        var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
        this.adapter.removeClass(OUTLINE_NOTCHED);
        this.adapter.removeNotchWidthProperty();
    };
    return MDCNotchedOutlineFoundation;
}(foundation_1.MDCFoundation);
exports.MDCNotchedOutlineFoundation = MDCNotchedOutlineFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCNotchedOutlineFoundation;

/***/ }),

/***/ "./packages/mdc-ripple/component.ts":
/*!******************************************!*\
  !*** ./packages/mdc-ripple/component.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function get() {
            return m[k];
        } });
} : function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function (o, v) {
    o["default"] = v;
});
var __importStar = this && this.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }__setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCRipple = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var events_1 = __webpack_require__(/*! @material/dom/events */ "./packages/mdc-dom/events.ts");
var ponyfill_1 = __webpack_require__(/*! @material/dom/ponyfill */ "./packages/mdc-dom/ponyfill.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-ripple/foundation.ts");
var util = __importStar(__webpack_require__(/*! ./util */ "./packages/mdc-ripple/util.ts"));
var MDCRipple = /** @class */function (_super) {
    __extends(MDCRipple, _super);
    function MDCRipple() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.disabled = false;
        return _this;
    }
    MDCRipple.attachTo = function (root, opts) {
        if (opts === void 0) {
            opts = { isUnbounded: undefined };
        }
        var ripple = new MDCRipple(root);
        // Only override unbounded behavior if option is explicitly specified
        if (opts.isUnbounded !== undefined) {
            ripple.unbounded = opts.isUnbounded;
        }
        return ripple;
    };
    MDCRipple.createAdapter = function (instance) {
        return {
            addClass: function addClass(className) {
                return instance.root.classList.add(className);
            },
            browserSupportsCssVars: function browserSupportsCssVars() {
                return util.supportsCssVariables(window);
            },
            computeBoundingRect: function computeBoundingRect() {
                return instance.root.getBoundingClientRect();
            },
            containsEventTarget: function containsEventTarget(target) {
                return instance.root.contains(target);
            },
            deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler(evtType, handler) {
                return document.documentElement.removeEventListener(evtType, handler, events_1.applyPassive());
            },
            deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {
                return instance.root.removeEventListener(evtType, handler, events_1.applyPassive());
            },
            deregisterResizeHandler: function deregisterResizeHandler(handler) {
                return window.removeEventListener('resize', handler);
            },
            getWindowPageOffset: function getWindowPageOffset() {
                return { x: window.pageXOffset, y: window.pageYOffset };
            },
            isSurfaceActive: function isSurfaceActive() {
                return ponyfill_1.matches(instance.root, ':active');
            },
            isSurfaceDisabled: function isSurfaceDisabled() {
                return Boolean(instance.disabled);
            },
            isUnbounded: function isUnbounded() {
                return Boolean(instance.unbounded);
            },
            registerDocumentInteractionHandler: function registerDocumentInteractionHandler(evtType, handler) {
                return document.documentElement.addEventListener(evtType, handler, events_1.applyPassive());
            },
            registerInteractionHandler: function registerInteractionHandler(evtType, handler) {
                return instance.root.addEventListener(evtType, handler, events_1.applyPassive());
            },
            registerResizeHandler: function registerResizeHandler(handler) {
                return window.addEventListener('resize', handler);
            },
            removeClass: function removeClass(className) {
                return instance.root.classList.remove(className);
            },
            updateCssVariable: function updateCssVariable(varName, value) {
                return instance.root.style.setProperty(varName, value);
            }
        };
    };
    Object.defineProperty(MDCRipple.prototype, "unbounded", {
        get: function get() {
            return Boolean(this.isUnbounded);
        },
        set: function set(unbounded) {
            this.isUnbounded = Boolean(unbounded);
            this.setUnbounded();
        },
        enumerable: false,
        configurable: true
    });
    MDCRipple.prototype.activate = function () {
        this.foundation.activate();
    };
    MDCRipple.prototype.deactivate = function () {
        this.foundation.deactivate();
    };
    MDCRipple.prototype.layout = function () {
        this.foundation.layout();
    };
    MDCRipple.prototype.getDefaultFoundation = function () {
        return new foundation_1.MDCRippleFoundation(MDCRipple.createAdapter(this));
    };
    MDCRipple.prototype.initialSyncWithDOM = function () {
        var root = this.root;
        this.isUnbounded = 'mdcRippleIsUnbounded' in root.dataset;
    };
    /**
     * Closure Compiler throws an access control error when directly accessing a
     * protected or private property inside a getter/setter, like unbounded above.
     * By accessing the protected property inside a method, we solve that problem.
     * That's why this function exists.
     */
    MDCRipple.prototype.setUnbounded = function () {
        this.foundation.setUnbounded(Boolean(this.isUnbounded));
    };
    return MDCRipple;
}(component_1.MDCComponent);
exports.MDCRipple = MDCRipple;

/***/ }),

/***/ "./packages/mdc-ripple/constants.ts":
/*!******************************************!*\
  !*** ./packages/mdc-ripple/constants.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.numbers = exports.strings = exports.cssClasses = void 0;
exports.cssClasses = {
    // Ripple is a special case where the "root" component is really a "mixin" of sorts,
    // given that it's an 'upgrade' to an existing component. That being said it is the root
    // CSS class that all other CSS classes derive from.
    BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
    FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
    FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
    ROOT: 'mdc-ripple-upgraded',
    UNBOUNDED: 'mdc-ripple-upgraded--unbounded'
};
exports.strings = {
    VAR_FG_SCALE: '--mdc-ripple-fg-scale',
    VAR_FG_SIZE: '--mdc-ripple-fg-size',
    VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
    VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
    VAR_LEFT: '--mdc-ripple-left',
    VAR_TOP: '--mdc-ripple-top'
};
exports.numbers = {
    DEACTIVATION_TIMEOUT_MS: 225,
    FG_DEACTIVATION_MS: 150,
    INITIAL_ORIGIN_SCALE: 0.6,
    PADDING: 10,
    TAP_DELAY_MS: 300 };

/***/ }),

/***/ "./packages/mdc-ripple/foundation.ts":
/*!*******************************************!*\
  !*** ./packages/mdc-ripple/foundation.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = this && this.__values || function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
        m = s && o[s],
        i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function next() {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCRippleFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-ripple/constants.ts");
var util_1 = __webpack_require__(/*! ./util */ "./packages/mdc-ripple/util.ts");
// Activation events registered on the root element of each instance for activation
var ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown'];
// Deactivation events registered on documentElement when a pointer-related down event occurs
var POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'pointerup', 'mouseup', 'contextmenu'];
// simultaneous nested activations
var activatedTargets = [];
var MDCRippleFoundation = /** @class */function (_super) {
    __extends(MDCRippleFoundation, _super);
    function MDCRippleFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
        _this.activationAnimationHasEnded = false;
        _this.activationTimer = 0;
        _this.fgDeactivationRemovalTimer = 0;
        _this.fgScale = '0';
        _this.frame = { width: 0, height: 0 };
        _this.initialSize = 0;
        _this.layoutFrame = 0;
        _this.maxRadius = 0;
        _this.unboundedCoords = { left: 0, top: 0 };
        _this.activationState = _this.defaultActivationState();
        _this.activationTimerCallback = function () {
            _this.activationAnimationHasEnded = true;
            _this.runDeactivationUXLogicIfReady();
        };
        _this.activateHandler = function (e) {
            _this.activateImpl(e);
        };
        _this.deactivateHandler = function () {
            _this.deactivateImpl();
        };
        _this.focusHandler = function () {
            _this.handleFocus();
        };
        _this.blurHandler = function () {
            _this.handleBlur();
        };
        _this.resizeHandler = function () {
            _this.layout();
        };
        return _this;
    }
    Object.defineProperty(MDCRippleFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "numbers", {
        get: function get() {
            return constants_1.numbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
        get: function get() {
            return {
                addClass: function addClass() {
                    return undefined;
                },
                browserSupportsCssVars: function browserSupportsCssVars() {
                    return true;
                },
                computeBoundingRect: function computeBoundingRect() {
                    return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
                },
                containsEventTarget: function containsEventTarget() {
                    return true;
                },
                deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler() {
                    return undefined;
                },
                deregisterInteractionHandler: function deregisterInteractionHandler() {
                    return undefined;
                },
                deregisterResizeHandler: function deregisterResizeHandler() {
                    return undefined;
                },
                getWindowPageOffset: function getWindowPageOffset() {
                    return { x: 0, y: 0 };
                },
                isSurfaceActive: function isSurfaceActive() {
                    return true;
                },
                isSurfaceDisabled: function isSurfaceDisabled() {
                    return true;
                },
                isUnbounded: function isUnbounded() {
                    return true;
                },
                registerDocumentInteractionHandler: function registerDocumentInteractionHandler() {
                    return undefined;
                },
                registerInteractionHandler: function registerInteractionHandler() {
                    return undefined;
                },
                registerResizeHandler: function registerResizeHandler() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                updateCssVariable: function updateCssVariable() {
                    return undefined;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCRippleFoundation.prototype.init = function () {
        var _this = this;
        var supportsPressRipple = this.supportsPressRipple();
        this.registerRootHandlers(supportsPressRipple);
        if (supportsPressRipple) {
            var _a = MDCRippleFoundation.cssClasses,
                ROOT_1 = _a.ROOT,
                UNBOUNDED_1 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter.addClass(ROOT_1);
                if (_this.adapter.isUnbounded()) {
                    _this.adapter.addClass(UNBOUNDED_1);
                    // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                    _this.layoutInternal();
                }
            });
        }
    };
    MDCRippleFoundation.prototype.destroy = function () {
        var _this = this;
        if (this.supportsPressRipple()) {
            if (this.activationTimer) {
                clearTimeout(this.activationTimer);
                this.activationTimer = 0;
                this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
            }
            if (this.fgDeactivationRemovalTimer) {
                clearTimeout(this.fgDeactivationRemovalTimer);
                this.fgDeactivationRemovalTimer = 0;
                this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
            }
            var _a = MDCRippleFoundation.cssClasses,
                ROOT_2 = _a.ROOT,
                UNBOUNDED_2 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter.removeClass(ROOT_2);
                _this.adapter.removeClass(UNBOUNDED_2);
                _this.removeCssVars();
            });
        }
        this.deregisterRootHandlers();
        this.deregisterDeactivationHandlers();
    };
    /**
     * @param evt Optional event containing position information.
     */
    MDCRippleFoundation.prototype.activate = function (evt) {
        this.activateImpl(evt);
    };
    MDCRippleFoundation.prototype.deactivate = function () {
        this.deactivateImpl();
    };
    MDCRippleFoundation.prototype.layout = function () {
        var _this = this;
        if (this.layoutFrame) {
            cancelAnimationFrame(this.layoutFrame);
        }
        this.layoutFrame = requestAnimationFrame(function () {
            _this.layoutInternal();
            _this.layoutFrame = 0;
        });
    };
    MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
        var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
        if (unbounded) {
            this.adapter.addClass(UNBOUNDED);
        } else {
            this.adapter.removeClass(UNBOUNDED);
        }
    };
    MDCRippleFoundation.prototype.handleFocus = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);
        });
    };
    MDCRippleFoundation.prototype.handleBlur = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);
        });
    };
    /**
     * We compute this property so that we are not querying information about the client
     * until the point in time where the foundation requests it. This prevents scenarios where
     * client-side feature-detection may happen too early, such as when components are rendered on the server
     * and then initialized at mount time on the client.
     */
    MDCRippleFoundation.prototype.supportsPressRipple = function () {
        return this.adapter.browserSupportsCssVars();
    };
    MDCRippleFoundation.prototype.defaultActivationState = function () {
        return {
            activationEvent: undefined,
            hasDeactivationUXRun: false,
            isActivated: false,
            isProgrammatic: false,
            wasActivatedByPointer: false,
            wasElementMadeActive: false
        };
    };
    /**
     * supportsPressRipple Passed from init to save a redundant function call
     */
    MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
        var e_1, _a;
        if (supportsPressRipple) {
            try {
                for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                }
            } catch (e_1_1) {
                e_1 = { error: e_1_1 };
            } finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                } finally {
                    if (e_1) throw e_1.error;
                }
            }
            if (this.adapter.isUnbounded()) {
                this.adapter.registerResizeHandler(this.resizeHandler);
            }
        }
        this.adapter.registerInteractionHandler('focus', this.focusHandler);
        this.adapter.registerInteractionHandler('blur', this.blurHandler);
    };
    MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
        var e_2, _a;
        if (evt.type === 'keydown') {
            this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
        } else {
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            } catch (e_2_1) {
                e_2 = { error: e_2_1 };
            } finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                } finally {
                    if (e_2) throw e_2.error;
                }
            }
        }
    };
    MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
        var e_3, _a;
        try {
            for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
            }
        } catch (e_3_1) {
            e_3 = { error: e_3_1 };
        } finally {
            try {
                if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
            } finally {
                if (e_3) throw e_3.error;
            }
        }
        this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
        this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
        if (this.adapter.isUnbounded()) {
            this.adapter.deregisterResizeHandler(this.resizeHandler);
        }
    };
    MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
        var e_4, _a;
        this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
        try {
            for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
            }
        } catch (e_4_1) {
            e_4 = { error: e_4_1 };
        } finally {
            try {
                if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
            } finally {
                if (e_4) throw e_4.error;
            }
        }
    };
    MDCRippleFoundation.prototype.removeCssVars = function () {
        var _this = this;
        var rippleStrings = MDCRippleFoundation.strings;
        var keys = Object.keys(rippleStrings);
        keys.forEach(function (key) {
            if (key.indexOf('VAR_') === 0) {
                _this.adapter.updateCssVariable(rippleStrings[key], null);
            }
        });
    };
    MDCRippleFoundation.prototype.activateImpl = function (evt) {
        var _this = this;
        if (this.adapter.isSurfaceDisabled()) {
            return;
        }
        var activationState = this.activationState;
        if (activationState.isActivated) {
            return;
        }
        // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
        var previousActivationEvent = this.previousActivationEvent;
        var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
        if (isSameInteraction) {
            return;
        }
        activationState.isActivated = true;
        activationState.isProgrammatic = evt === undefined;
        activationState.activationEvent = evt;
        activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
        var hasActivatedChild = evt !== undefined && activatedTargets.length > 0 && activatedTargets.some(function (target) {
            return _this.adapter.containsEventTarget(target);
        });
        if (hasActivatedChild) {
            // Immediately reset activation state, while preserving logic that prevents touch follow-on events
            this.resetActivationState();
            return;
        }
        if (evt !== undefined) {
            activatedTargets.push(evt.target);
            this.registerDeactivationHandlers(evt);
        }
        activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
        if (activationState.wasElementMadeActive) {
            this.animateActivation();
        }
        requestAnimationFrame(function () {
            // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
            activatedTargets = [];
            if (!activationState.wasElementMadeActive && evt !== undefined && (evt.key === ' ' || evt.keyCode === 32)) {
                // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                // active states inconsistently when they're called within event handling code:
                // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                // variable is set within a rAF callback for a submit button interaction (#2241).
                activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                if (activationState.wasElementMadeActive) {
                    _this.animateActivation();
                }
            }
            if (!activationState.wasElementMadeActive) {
                // Reset activation state immediately if element was not made active.
                _this.activationState = _this.defaultActivationState();
            }
        });
    };
    MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
        return evt !== undefined && evt.type === 'keydown' ? this.adapter.isSurfaceActive() : true;
    };
    MDCRippleFoundation.prototype.animateActivation = function () {
        var _this = this;
        var _a = MDCRippleFoundation.strings,
            VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START,
            VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
        var _b = MDCRippleFoundation.cssClasses,
            FG_DEACTIVATION = _b.FG_DEACTIVATION,
            FG_ACTIVATION = _b.FG_ACTIVATION;
        var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
        this.layoutInternal();
        var translateStart = '';
        var translateEnd = '';
        if (!this.adapter.isUnbounded()) {
            var _c = this.getFgTranslationCoordinates(),
                startPoint = _c.startPoint,
                endPoint = _c.endPoint;
            translateStart = startPoint.x + "px, " + startPoint.y + "px";
            translateEnd = endPoint.x + "px, " + endPoint.y + "px";
        }
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
        // Cancel any ongoing activation/deactivation animations
        clearTimeout(this.activationTimer);
        clearTimeout(this.fgDeactivationRemovalTimer);
        this.rmBoundedActivationClasses();
        this.adapter.removeClass(FG_DEACTIVATION);
        // Force layout in order to re-trigger the animation.
        this.adapter.computeBoundingRect();
        this.adapter.addClass(FG_ACTIVATION);
        this.activationTimer = setTimeout(function () {
            _this.activationTimerCallback();
        }, DEACTIVATION_TIMEOUT_MS);
    };
    MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
        var _a = this.activationState,
            activationEvent = _a.activationEvent,
            wasActivatedByPointer = _a.wasActivatedByPointer;
        var startPoint;
        if (wasActivatedByPointer) {
            startPoint = util_1.getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
        } else {
            startPoint = {
                x: this.frame.width / 2,
                y: this.frame.height / 2
            };
        }
        // Center the element around the start point.
        startPoint = {
            x: startPoint.x - this.initialSize / 2,
            y: startPoint.y - this.initialSize / 2
        };
        var endPoint = {
            x: this.frame.width / 2 - this.initialSize / 2,
            y: this.frame.height / 2 - this.initialSize / 2
        };
        return { startPoint: startPoint, endPoint: endPoint };
    };
    MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
        var _this = this;
        // This method is called both when a pointing device is released, and when the activation animation ends.
        // The deactivation animation should only run after both of those occur.
        var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
        var _a = this.activationState,
            hasDeactivationUXRun = _a.hasDeactivationUXRun,
            isActivated = _a.isActivated;
        var activationHasEnded = hasDeactivationUXRun || !isActivated;
        if (activationHasEnded && this.activationAnimationHasEnded) {
            this.rmBoundedActivationClasses();
            this.adapter.addClass(FG_DEACTIVATION);
            this.fgDeactivationRemovalTimer = setTimeout(function () {
                _this.adapter.removeClass(FG_DEACTIVATION);
            }, constants_1.numbers.FG_DEACTIVATION_MS);
        }
    };
    MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
        this.adapter.removeClass(FG_ACTIVATION);
        this.activationAnimationHasEnded = false;
        this.adapter.computeBoundingRect();
    };
    MDCRippleFoundation.prototype.resetActivationState = function () {
        var _this = this;
        this.previousActivationEvent = this.activationState.activationEvent;
        this.activationState = this.defaultActivationState();
        // Touch devices may fire additional events for the same interaction within a short time.
        // Store the previous event until it's safe to assume that subsequent events are for new interactions.
        setTimeout(function () {
            return _this.previousActivationEvent = undefined;
        }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
    };
    MDCRippleFoundation.prototype.deactivateImpl = function () {
        var _this = this;
        var activationState = this.activationState;
        // This can happen in scenarios such as when you have a keyup event that blurs the element.
        if (!activationState.isActivated) {
            return;
        }
        var state = __assign({}, activationState);
        if (activationState.isProgrammatic) {
            requestAnimationFrame(function () {
                _this.animateDeactivation(state);
            });
            this.resetActivationState();
        } else {
            this.deregisterDeactivationHandlers();
            requestAnimationFrame(function () {
                _this.activationState.hasDeactivationUXRun = true;
                _this.animateDeactivation(state);
                _this.resetActivationState();
            });
        }
    };
    MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
        var wasActivatedByPointer = _a.wasActivatedByPointer,
            wasElementMadeActive = _a.wasElementMadeActive;
        if (wasActivatedByPointer || wasElementMadeActive) {
            this.runDeactivationUXLogicIfReady();
        }
    };
    MDCRippleFoundation.prototype.layoutInternal = function () {
        var _this = this;
        this.frame = this.adapter.computeBoundingRect();
        var maxDim = Math.max(this.frame.height, this.frame.width);
        // Surface diameter is treated differently for unbounded vs. bounded ripples.
        // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
        // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
        // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
        // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
        // `overflow: hidden`.
        var getBoundedRadius = function getBoundedRadius() {
            var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
            return hypotenuse + MDCRippleFoundation.numbers.PADDING;
        };
        this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
        // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
        var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
        // Unbounded ripple size should always be even number to equally center align.
        if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
            this.initialSize = initialSize - 1;
        } else {
            this.initialSize = initialSize;
        }
        this.fgScale = "" + this.maxRadius / this.initialSize;
        this.updateLayoutCssVars();
    };
    MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
        var _a = MDCRippleFoundation.strings,
            VAR_FG_SIZE = _a.VAR_FG_SIZE,
            VAR_LEFT = _a.VAR_LEFT,
            VAR_TOP = _a.VAR_TOP,
            VAR_FG_SCALE = _a.VAR_FG_SCALE;
        this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
        this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
        if (this.adapter.isUnbounded()) {
            this.unboundedCoords = {
                left: Math.round(this.frame.width / 2 - this.initialSize / 2),
                top: Math.round(this.frame.height / 2 - this.initialSize / 2)
            };
            this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
            this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
        }
    };
    return MDCRippleFoundation;
}(foundation_1.MDCFoundation);
exports.MDCRippleFoundation = MDCRippleFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCRippleFoundation;

/***/ }),

/***/ "./packages/mdc-ripple/util.ts":
/*!*************************************!*\
  !*** ./packages/mdc-ripple/util.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.getNormalizedEventCoords = exports.supportsCssVariables = void 0;
/**
 * Stores result from supportsCssVariables to avoid redundant processing to
 * detect CSS custom variable support.
 */
var supportsCssVariables_;
function supportsCssVariables(windowObj, forceRefresh) {
    if (forceRefresh === void 0) {
        forceRefresh = false;
    }
    var CSS = windowObj.CSS;
    var supportsCssVars = supportsCssVariables_;
    if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
        return supportsCssVariables_;
    }
    var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
    if (!supportsFunctionPresent) {
        return false;
    }
    var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
    // See: https://bugs.webkit.org/show_bug.cgi?id=154669
    // See: README section on Safari
    var weAreFeatureDetectingSafari10plus = CSS.supports('(--css-vars: yes)') && CSS.supports('color', '#00000000');
    supportsCssVars = explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
    if (!forceRefresh) {
        supportsCssVariables_ = supportsCssVars;
    }
    return supportsCssVars;
}
exports.supportsCssVariables = supportsCssVariables;
function getNormalizedEventCoords(evt, pageOffset, clientRect) {
    if (!evt) {
        return { x: 0, y: 0 };
    }
    var x = pageOffset.x,
        y = pageOffset.y;
    var documentX = x + clientRect.left;
    var documentY = y + clientRect.top;
    var normalizedX;
    var normalizedY;
    // Determine touch point relative to the ripple container.
    if (evt.type === 'touchstart') {
        var touchEvent = evt;
        normalizedX = touchEvent.changedTouches[0].pageX - documentX;
        normalizedY = touchEvent.changedTouches[0].pageY - documentY;
    } else {
        var mouseEvent = evt;
        normalizedX = mouseEvent.pageX - documentX;
        normalizedY = mouseEvent.pageY - documentY;
    }
    return { x: normalizedX, y: normalizedY };
}
exports.getNormalizedEventCoords = getNormalizedEventCoords;

/***/ }),

/***/ "./packages/mdc-select/adapter.ts":
/*!****************************************!*\
  !*** ./packages/mdc-select/adapter.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });

/***/ }),

/***/ "./packages/mdc-select/component.ts":
/*!******************************************!*\
  !*** ./packages/mdc-select/component.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function get() {
            return m[k];
        } });
} : function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function (o, v) {
    o["default"] = v;
});
var __importStar = this && this.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }__setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCSelect = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var component_2 = __webpack_require__(/*! @material/floating-label/component */ "./packages/mdc-floating-label/component.ts");
var component_3 = __webpack_require__(/*! @material/line-ripple/component */ "./packages/mdc-line-ripple/component.ts");
var menuSurfaceConstants = __importStar(__webpack_require__(/*! @material/menu-surface/constants */ "./packages/mdc-menu-surface/constants.ts"));
var component_4 = __webpack_require__(/*! @material/menu/component */ "./packages/mdc-menu/component.ts");
var menuConstants = __importStar(__webpack_require__(/*! @material/menu/constants */ "./packages/mdc-menu/constants.ts"));
var component_5 = __webpack_require__(/*! @material/notched-outline/component */ "./packages/mdc-notched-outline/component.ts");
var component_6 = __webpack_require__(/*! @material/ripple/component */ "./packages/mdc-ripple/component.ts");
var foundation_1 = __webpack_require__(/*! @material/ripple/foundation */ "./packages/mdc-ripple/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-select/constants.ts");
var foundation_2 = __webpack_require__(/*! ./foundation */ "./packages/mdc-select/foundation.ts");
var component_7 = __webpack_require__(/*! ./helper-text/component */ "./packages/mdc-select/helper-text/component.ts");
var component_8 = __webpack_require__(/*! ./icon/component */ "./packages/mdc-select/icon/component.ts");
var MDCSelect = /** @class */function (_super) {
    __extends(MDCSelect, _super);
    function MDCSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelect.attachTo = function (root) {
        return new MDCSelect(root);
    };
    MDCSelect.prototype.initialize = function (labelFactory, lineRippleFactory, outlineFactory, menuFactory, iconFactory, helperTextFactory) {
        if (labelFactory === void 0) {
            labelFactory = function labelFactory(el) {
                return new component_2.MDCFloatingLabel(el);
            };
        }
        if (lineRippleFactory === void 0) {
            lineRippleFactory = function lineRippleFactory(el) {
                return new component_3.MDCLineRipple(el);
            };
        }
        if (outlineFactory === void 0) {
            outlineFactory = function outlineFactory(el) {
                return new component_5.MDCNotchedOutline(el);
            };
        }
        if (menuFactory === void 0) {
            menuFactory = function menuFactory(el) {
                return new component_4.MDCMenu(el);
            };
        }
        if (iconFactory === void 0) {
            iconFactory = function iconFactory(el) {
                return new component_8.MDCSelectIcon(el);
            };
        }
        if (helperTextFactory === void 0) {
            helperTextFactory = function helperTextFactory(el) {
                return new component_7.MDCSelectHelperText(el);
            };
        }
        this.selectAnchor = this.root.querySelector(constants_1.strings.SELECT_ANCHOR_SELECTOR);
        this.selectedText = this.root.querySelector(constants_1.strings.SELECTED_TEXT_SELECTOR);
        this.hiddenInput = this.root.querySelector(constants_1.strings.HIDDEN_INPUT_SELECTOR);
        if (!this.selectedText) {
            throw new Error('MDCSelect: Missing required element: The following selector must be present: ' + ("'" + constants_1.strings.SELECTED_TEXT_SELECTOR + "'"));
        }
        if (this.selectAnchor.hasAttribute(constants_1.strings.ARIA_CONTROLS)) {
            var helperTextElement = document.getElementById(this.selectAnchor.getAttribute(constants_1.strings.ARIA_CONTROLS));
            if (helperTextElement) {
                this.helperText = helperTextFactory(helperTextElement);
            }
        }
        this.menuSetup(menuFactory);
        var labelElement = this.root.querySelector(constants_1.strings.LABEL_SELECTOR);
        this.label = labelElement ? labelFactory(labelElement) : null;
        var lineRippleElement = this.root.querySelector(constants_1.strings.LINE_RIPPLE_SELECTOR);
        this.lineRipple = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;
        var outlineElement = this.root.querySelector(constants_1.strings.OUTLINE_SELECTOR);
        this.outline = outlineElement ? outlineFactory(outlineElement) : null;
        var leadingIcon = this.root.querySelector(constants_1.strings.LEADING_ICON_SELECTOR);
        if (leadingIcon) {
            this.leadingIcon = iconFactory(leadingIcon);
        }
        if (!this.root.classList.contains(constants_1.cssClasses.OUTLINED)) {
            this.ripple = this.createRipple();
        }
    };
    /**
     * Initializes the select's event listeners and internal state based
     * on the environment's state.
     */
    MDCSelect.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.handleFocus = function () {
            _this.foundation.handleFocus();
        };
        this.handleBlur = function () {
            _this.foundation.handleBlur();
        };
        this.handleClick = function (evt) {
            _this.selectAnchor.focus();
            _this.foundation.handleClick(_this.getNormalizedXCoordinate(evt));
        };
        this.handleKeydown = function (evt) {
            _this.foundation.handleKeydown(evt);
        };
        this.handleMenuItemAction = function (evt) {
            _this.foundation.handleMenuItemAction(evt.detail.index);
        };
        this.handleMenuOpened = function () {
            _this.foundation.handleMenuOpened();
        };
        this.handleMenuClosed = function () {
            _this.foundation.handleMenuClosed();
        };
        this.handleMenuClosing = function () {
            _this.foundation.handleMenuClosing();
        };
        this.selectAnchor.addEventListener('focus', this.handleFocus);
        this.selectAnchor.addEventListener('blur', this.handleBlur);
        this.selectAnchor.addEventListener('click', this.handleClick);
        this.selectAnchor.addEventListener('keydown', this.handleKeydown);
        this.menu.listen(menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed);
        this.menu.listen(menuSurfaceConstants.strings.CLOSING_EVENT, this.handleMenuClosing);
        this.menu.listen(menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened);
        this.menu.listen(menuConstants.strings.SELECTED_EVENT, this.handleMenuItemAction);
        if (this.hiddenInput) {
            if (this.hiddenInput.value) {
                // If the hidden input already has a value, use it to restore the
                // select's value. This can happen e.g. if the user goes back or (in
                // some browsers) refreshes the page.
                this.foundation.setValue(this.hiddenInput.value, /** skipNotify */true);
                this.foundation.layout();
                return;
            }
            this.hiddenInput.value = this.value;
        }
    };
    MDCSelect.prototype.destroy = function () {
        this.selectAnchor.removeEventListener('focus', this.handleFocus);
        this.selectAnchor.removeEventListener('blur', this.handleBlur);
        this.selectAnchor.removeEventListener('keydown', this.handleKeydown);
        this.selectAnchor.removeEventListener('click', this.handleClick);
        this.menu.unlisten(menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed);
        this.menu.unlisten(menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened);
        this.menu.unlisten(menuConstants.strings.SELECTED_EVENT, this.handleMenuItemAction);
        this.menu.destroy();
        if (this.ripple) {
            this.ripple.destroy();
        }
        if (this.outline) {
            this.outline.destroy();
        }
        if (this.leadingIcon) {
            this.leadingIcon.destroy();
        }
        if (this.helperText) {
            this.helperText.destroy();
        }
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(MDCSelect.prototype, "value", {
        get: function get() {
            return this.foundation.getValue();
        },
        set: function set(value) {
            this.foundation.setValue(value);
        },
        enumerable: false,
        configurable: true
    });
    MDCSelect.prototype.setValue = function (value, skipNotify) {
        if (skipNotify === void 0) {
            skipNotify = false;
        }
        this.foundation.setValue(value, skipNotify);
    };
    Object.defineProperty(MDCSelect.prototype, "selectedIndex", {
        get: function get() {
            return this.foundation.getSelectedIndex();
        },
        set: function set(selectedIndex) {
            this.foundation.setSelectedIndex(selectedIndex, /* closeMenu */true);
        },
        enumerable: false,
        configurable: true
    });
    MDCSelect.prototype.setSelectedIndex = function (selectedIndex, skipNotify) {
        if (skipNotify === void 0) {
            skipNotify = false;
        }
        this.foundation.setSelectedIndex(selectedIndex, /* closeMenu */true, skipNotify);
    };
    Object.defineProperty(MDCSelect.prototype, "disabled", {
        get: function get() {
            return this.foundation.getDisabled();
        },
        set: function set(disabled) {
            this.foundation.setDisabled(disabled);
            if (this.hiddenInput) {
                this.hiddenInput.disabled = disabled;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "leadingIconAriaLabel", {
        set: function set(label) {
            this.foundation.setLeadingIconAriaLabel(label);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "leadingIconContent", {
        /**
         * Sets the text content of the leading icon.
         */
        set: function set(content) {
            this.foundation.setLeadingIconContent(content);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "helperTextContent", {
        /**
         * Sets the text content of the helper text.
         */
        set: function set(content) {
            this.foundation.setHelperTextContent(content);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "useDefaultValidation", {
        /**
         * Enables or disables the default validation scheme where a required select
         * must be non-empty. Set to false for custom validation.
         * @param useDefaultValidation Set this to false to ignore default
         *     validation scheme.
         */
        set: function set(useDefaultValidation) {
            this.foundation.setUseDefaultValidation(useDefaultValidation);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "valid", {
        /**
         * Checks if the select is in a valid state.
         */
        get: function get() {
            return this.foundation.isValid();
        },
        /**
         * Sets the current invalid state of the select.
         */
        set: function set(isValid) {
            this.foundation.setValid(isValid);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "required", {
        /**
         * Returns whether the select is required.
         */
        get: function get() {
            return this.foundation.getRequired();
        },
        /**
         * Sets the control to the required state.
         */
        set: function set(isRequired) {
            this.foundation.setRequired(isRequired);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Re-calculates if the notched outline should be notched and if the label
     * should float.
     */
    MDCSelect.prototype.layout = function () {
        this.foundation.layout();
    };
    /**
     * Synchronizes the list of options with the state of the foundation. Call
     * this whenever menu options are dynamically updated.
     */
    MDCSelect.prototype.layoutOptions = function () {
        this.foundation.layoutOptions();
        this.menu.layout();
        // Update cached menuItemValues for adapter.
        this.menuItemValues = this.menu.items.map(function (el) {
            return el.getAttribute(constants_1.strings.VALUE_ATTR) || '';
        });
        if (this.hiddenInput) {
            this.hiddenInput.value = this.value;
        }
    };
    MDCSelect.prototype.getDefaultFoundation = function () {
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = __assign(__assign(__assign(__assign({}, this.getSelectAdapterMethods()), this.getCommonAdapterMethods()), this.getOutlineAdapterMethods()), this.getLabelAdapterMethods());
        return new foundation_2.MDCSelectFoundation(adapter, this.getFoundationMap());
    };
    /**
     * Handles setup for the menu.
     */
    MDCSelect.prototype.menuSetup = function (menuFactory) {
        this.menuElement = this.root.querySelector(constants_1.strings.MENU_SELECTOR);
        this.menu = menuFactory(this.menuElement);
        this.menu.hasTypeahead = true;
        this.menu.singleSelection = true;
        this.menuItemValues = this.menu.items.map(function (el) {
            return el.getAttribute(constants_1.strings.VALUE_ATTR) || '';
        });
    };
    MDCSelect.prototype.createRipple = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = __assign(__assign({}, component_6.MDCRipple.createAdapter({ root: this.selectAnchor })), { registerInteractionHandler: function registerInteractionHandler(evtType, handler) {
                _this.selectAnchor.addEventListener(evtType, handler);
            }, deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {
                _this.selectAnchor.removeEventListener(evtType, handler);
            } });
        // tslint:enable:object-literal-sort-keys
        return new component_6.MDCRipple(this.selectAnchor, new foundation_1.MDCRippleFoundation(adapter));
    };
    MDCSelect.prototype.getSelectAdapterMethods = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            getMenuItemAttr: function getMenuItemAttr(menuItem, attr) {
                return menuItem.getAttribute(attr);
            },
            setSelectedText: function setSelectedText(text) {
                _this.selectedText.textContent = text;
            },
            isSelectAnchorFocused: function isSelectAnchorFocused() {
                return document.activeElement === _this.selectAnchor;
            },
            getSelectAnchorAttr: function getSelectAnchorAttr(attr) {
                return _this.selectAnchor.getAttribute(attr);
            },
            setSelectAnchorAttr: function setSelectAnchorAttr(attr, value) {
                _this.selectAnchor.setAttribute(attr, value);
            },
            removeSelectAnchorAttr: function removeSelectAnchorAttr(attr) {
                _this.selectAnchor.removeAttribute(attr);
            },
            addMenuClass: function addMenuClass(className) {
                _this.menuElement.classList.add(className);
            },
            removeMenuClass: function removeMenuClass(className) {
                _this.menuElement.classList.remove(className);
            },
            openMenu: function openMenu() {
                _this.menu.open = true;
            },
            closeMenu: function closeMenu() {
                _this.menu.open = false;
            },
            getAnchorElement: function getAnchorElement() {
                return _this.root.querySelector(constants_1.strings.SELECT_ANCHOR_SELECTOR);
            },
            setMenuAnchorElement: function setMenuAnchorElement(anchorEl) {
                _this.menu.setAnchorElement(anchorEl);
            },
            setMenuAnchorCorner: function setMenuAnchorCorner(anchorCorner) {
                _this.menu.setAnchorCorner(anchorCorner);
            },
            setMenuWrapFocus: function setMenuWrapFocus(wrapFocus) {
                _this.menu.wrapFocus = wrapFocus;
            },
            getSelectedIndex: function getSelectedIndex() {
                var index = _this.menu.selectedIndex;
                return index instanceof Array ? index[0] : index;
            },
            setSelectedIndex: function setSelectedIndex(index) {
                _this.menu.selectedIndex = index;
            },
            focusMenuItemAtIndex: function focusMenuItemAtIndex(index) {
                _this.menu.items[index].focus();
            },
            getMenuItemCount: function getMenuItemCount() {
                return _this.menu.items.length;
            },
            // Cache menu item values. layoutOptions() updates this cache.
            getMenuItemValues: function getMenuItemValues() {
                return _this.menuItemValues;
            },
            getMenuItemTextAtIndex: function getMenuItemTextAtIndex(index) {
                return _this.menu.getPrimaryTextAtIndex(index);
            },
            isTypeaheadInProgress: function isTypeaheadInProgress() {
                return _this.menu.typeaheadInProgress;
            },
            typeaheadMatchItem: function typeaheadMatchItem(nextChar, startingIndex) {
                return _this.menu.typeaheadMatchItem(nextChar, startingIndex);
            }
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getCommonAdapterMethods = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            addClass: function addClass(className) {
                _this.root.classList.add(className);
            },
            removeClass: function removeClass(className) {
                _this.root.classList.remove(className);
            },
            hasClass: function hasClass(className) {
                return _this.root.classList.contains(className);
            },
            setRippleCenter: function setRippleCenter(normalizedX) {
                _this.lineRipple && _this.lineRipple.setRippleCenter(normalizedX);
            },
            activateBottomLine: function activateBottomLine() {
                _this.lineRipple && _this.lineRipple.activate();
            },
            deactivateBottomLine: function deactivateBottomLine() {
                _this.lineRipple && _this.lineRipple.deactivate();
            },
            notifyChange: function notifyChange(value) {
                if (_this.hiddenInput) {
                    _this.hiddenInput.value = value;
                }
                var index = _this.selectedIndex;
                _this.emit(constants_1.strings.CHANGE_EVENT, { value: value, index: index }, true /* shouldBubble  */);
            }
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getOutlineAdapterMethods = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            hasOutline: function hasOutline() {
                return Boolean(_this.outline);
            },
            notchOutline: function notchOutline(labelWidth) {
                _this.outline && _this.outline.notch(labelWidth);
            },
            closeOutline: function closeOutline() {
                _this.outline && _this.outline.closeNotch();
            }
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getLabelAdapterMethods = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            hasLabel: function hasLabel() {
                return !!_this.label;
            },
            floatLabel: function floatLabel(shouldFloat) {
                _this.label && _this.label.float(shouldFloat);
            },
            getLabelWidth: function getLabelWidth() {
                return _this.label ? _this.label.getWidth() : 0;
            },
            setLabelRequired: function setLabelRequired(isRequired) {
                _this.label && _this.label.setRequired(isRequired);
            }
        };
        // tslint:enable:object-literal-sort-keys
    };
    /**
     * Calculates where the line ripple should start based on the x coordinate within the component.
     */
    MDCSelect.prototype.getNormalizedXCoordinate = function (evt) {
        var targetClientRect = evt.target.getBoundingClientRect();
        var xCoordinate = this.isTouchEvent(evt) ? evt.touches[0].clientX : evt.clientX;
        return xCoordinate - targetClientRect.left;
    };
    MDCSelect.prototype.isTouchEvent = function (evt) {
        return Boolean(evt.touches);
    };
    /**
     * Returns a map of all subcomponents to subfoundations.
     */
    MDCSelect.prototype.getFoundationMap = function () {
        return {
            helperText: this.helperText ? this.helperText.foundationForSelect : undefined,
            leadingIcon: this.leadingIcon ? this.leadingIcon.foundationForSelect : undefined
        };
    };
    return MDCSelect;
}(component_1.MDCComponent);
exports.MDCSelect = MDCSelect;

/***/ }),

/***/ "./packages/mdc-select/constants.ts":
/*!******************************************!*\
  !*** ./packages/mdc-select/constants.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.numbers = exports.strings = exports.cssClasses = void 0;
var cssClasses = {
    ACTIVATED: 'mdc-select--activated',
    DISABLED: 'mdc-select--disabled',
    FOCUSED: 'mdc-select--focused',
    INVALID: 'mdc-select--invalid',
    MENU_INVALID: 'mdc-select__menu--invalid',
    OUTLINED: 'mdc-select--outlined',
    REQUIRED: 'mdc-select--required',
    ROOT: 'mdc-select',
    WITH_LEADING_ICON: 'mdc-select--with-leading-icon'
};
exports.cssClasses = cssClasses;
var strings = {
    ARIA_CONTROLS: 'aria-controls',
    ARIA_DESCRIBEDBY: 'aria-describedby',
    ARIA_SELECTED_ATTR: 'aria-selected',
    CHANGE_EVENT: 'MDCSelect:change',
    HIDDEN_INPUT_SELECTOR: 'input[type="hidden"]',
    LABEL_SELECTOR: '.mdc-floating-label',
    LEADING_ICON_SELECTOR: '.mdc-select__icon',
    LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
    MENU_SELECTOR: '.mdc-select__menu',
    OUTLINE_SELECTOR: '.mdc-notched-outline',
    SELECTED_TEXT_SELECTOR: '.mdc-select__selected-text',
    SELECT_ANCHOR_SELECTOR: '.mdc-select__anchor',
    VALUE_ATTR: 'data-value'
};
exports.strings = strings;
var numbers = {
    LABEL_SCALE: 0.75,
    UNSET_INDEX: -1,
    CLICK_DEBOUNCE_TIMEOUT_MS: 330
};
exports.numbers = numbers;

/***/ }),

/***/ "./packages/mdc-select/foundation.ts":
/*!*******************************************!*\
  !*** ./packages/mdc-select/foundation.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCSelectFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var keyboard_1 = __webpack_require__(/*! @material/dom/keyboard */ "./packages/mdc-dom/keyboard.ts");
var constants_1 = __webpack_require__(/*! @material/menu-surface/constants */ "./packages/mdc-menu-surface/constants.ts");
var constants_2 = __webpack_require__(/*! ./constants */ "./packages/mdc-select/constants.ts");
var MDCSelectFoundation = /** @class */function (_super) {
    __extends(MDCSelectFoundation, _super);
    /* istanbul ignore next: optional argument is not a branch statement */
    /**
     * @param adapter
     * @param foundationMap Map from subcomponent names to their subfoundations.
     */
    function MDCSelectFoundation(adapter, foundationMap) {
        if (foundationMap === void 0) {
            foundationMap = {};
        }
        var _this = _super.call(this, __assign(__assign({}, MDCSelectFoundation.defaultAdapter), adapter)) || this;
        // Disabled state
        _this.disabled = false;
        // isMenuOpen is used to track the state of the menu by listening to the
        // MDCMenuSurface:closed event For reference, menu.open will return false if
        // the menu is still closing, but isMenuOpen returns false only after the menu
        // has closed
        _this.isMenuOpen = false;
        // By default, select is invalid if it is required but no value is selected.
        _this.useDefaultValidation = true;
        _this.customValidity = true;
        _this.lastSelectedIndex = constants_2.numbers.UNSET_INDEX;
        _this.clickDebounceTimeout = 0;
        _this.recentlyClicked = false;
        _this.leadingIcon = foundationMap.leadingIcon;
        _this.helperText = foundationMap.helperText;
        return _this;
    }
    Object.defineProperty(MDCSelectFoundation, "cssClasses", {
        get: function get() {
            return constants_2.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "numbers", {
        get: function get() {
            return constants_2.numbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "strings", {
        get: function get() {
            return constants_2.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectAdapter} for typing information on parameters and return types.
         */
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function addClass() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                hasClass: function hasClass() {
                    return false;
                },
                activateBottomLine: function activateBottomLine() {
                    return undefined;
                },
                deactivateBottomLine: function deactivateBottomLine() {
                    return undefined;
                },
                getSelectedIndex: function getSelectedIndex() {
                    return -1;
                },
                setSelectedIndex: function setSelectedIndex() {
                    return undefined;
                },
                hasLabel: function hasLabel() {
                    return false;
                },
                floatLabel: function floatLabel() {
                    return undefined;
                },
                getLabelWidth: function getLabelWidth() {
                    return 0;
                },
                setLabelRequired: function setLabelRequired() {
                    return undefined;
                },
                hasOutline: function hasOutline() {
                    return false;
                },
                notchOutline: function notchOutline() {
                    return undefined;
                },
                closeOutline: function closeOutline() {
                    return undefined;
                },
                setRippleCenter: function setRippleCenter() {
                    return undefined;
                },
                notifyChange: function notifyChange() {
                    return undefined;
                },
                setSelectedText: function setSelectedText() {
                    return undefined;
                },
                isSelectAnchorFocused: function isSelectAnchorFocused() {
                    return false;
                },
                getSelectAnchorAttr: function getSelectAnchorAttr() {
                    return '';
                },
                setSelectAnchorAttr: function setSelectAnchorAttr() {
                    return undefined;
                },
                removeSelectAnchorAttr: function removeSelectAnchorAttr() {
                    return undefined;
                },
                addMenuClass: function addMenuClass() {
                    return undefined;
                },
                removeMenuClass: function removeMenuClass() {
                    return undefined;
                },
                openMenu: function openMenu() {
                    return undefined;
                },
                closeMenu: function closeMenu() {
                    return undefined;
                },
                getAnchorElement: function getAnchorElement() {
                    return null;
                },
                setMenuAnchorElement: function setMenuAnchorElement() {
                    return undefined;
                },
                setMenuAnchorCorner: function setMenuAnchorCorner() {
                    return undefined;
                },
                setMenuWrapFocus: function setMenuWrapFocus() {
                    return undefined;
                },
                focusMenuItemAtIndex: function focusMenuItemAtIndex() {
                    return undefined;
                },
                getMenuItemCount: function getMenuItemCount() {
                    return 0;
                },
                getMenuItemValues: function getMenuItemValues() {
                    return [];
                },
                getMenuItemTextAtIndex: function getMenuItemTextAtIndex() {
                    return '';
                },
                isTypeaheadInProgress: function isTypeaheadInProgress() {
                    return false;
                },
                typeaheadMatchItem: function typeaheadMatchItem() {
                    return -1;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    /** Returns the index of the currently selected menu item, or -1 if none. */
    MDCSelectFoundation.prototype.getSelectedIndex = function () {
        return this.adapter.getSelectedIndex();
    };
    MDCSelectFoundation.prototype.setSelectedIndex = function (index, closeMenu, skipNotify) {
        if (closeMenu === void 0) {
            closeMenu = false;
        }
        if (skipNotify === void 0) {
            skipNotify = false;
        }
        if (index >= this.adapter.getMenuItemCount()) {
            return;
        }
        if (index === constants_2.numbers.UNSET_INDEX) {
            this.adapter.setSelectedText('');
        } else {
            this.adapter.setSelectedText(this.adapter.getMenuItemTextAtIndex(index).trim());
        }
        this.adapter.setSelectedIndex(index);
        if (closeMenu) {
            this.adapter.closeMenu();
        }
        if (!skipNotify && this.lastSelectedIndex !== index) {
            this.handleChange();
        }
        this.lastSelectedIndex = index;
    };
    MDCSelectFoundation.prototype.setValue = function (value, skipNotify) {
        if (skipNotify === void 0) {
            skipNotify = false;
        }
        var index = this.adapter.getMenuItemValues().indexOf(value);
        this.setSelectedIndex(index, /** closeMenu */false, skipNotify);
    };
    MDCSelectFoundation.prototype.getValue = function () {
        var index = this.adapter.getSelectedIndex();
        var menuItemValues = this.adapter.getMenuItemValues();
        return index !== constants_2.numbers.UNSET_INDEX ? menuItemValues[index] : '';
    };
    MDCSelectFoundation.prototype.getDisabled = function () {
        return this.disabled;
    };
    MDCSelectFoundation.prototype.setDisabled = function (isDisabled) {
        this.disabled = isDisabled;
        if (this.disabled) {
            this.adapter.addClass(constants_2.cssClasses.DISABLED);
            this.adapter.closeMenu();
        } else {
            this.adapter.removeClass(constants_2.cssClasses.DISABLED);
        }
        if (this.leadingIcon) {
            this.leadingIcon.setDisabled(this.disabled);
        }
        if (this.disabled) {
            // Prevent click events from focusing select. Simply pointer-events: none
            // is not enough since screenreader clicks may bypass this.
            this.adapter.removeSelectAnchorAttr('tabindex');
        } else {
            this.adapter.setSelectAnchorAttr('tabindex', '0');
        }
        this.adapter.setSelectAnchorAttr('aria-disabled', this.disabled.toString());
    };
    /** Opens the menu. */
    MDCSelectFoundation.prototype.openMenu = function () {
        this.adapter.addClass(constants_2.cssClasses.ACTIVATED);
        this.adapter.openMenu();
        this.isMenuOpen = true;
        this.adapter.setSelectAnchorAttr('aria-expanded', 'true');
    };
    /**
     * @param content Sets the content of the helper text.
     */
    MDCSelectFoundation.prototype.setHelperTextContent = function (content) {
        if (this.helperText) {
            this.helperText.setContent(content);
        }
    };
    /**
     * Re-calculates if the notched outline should be notched and if the label
     * should float.
     */
    MDCSelectFoundation.prototype.layout = function () {
        if (this.adapter.hasLabel()) {
            var optionHasValue = this.getValue().length > 0;
            var isFocused = this.adapter.hasClass(constants_2.cssClasses.FOCUSED);
            var shouldFloatAndNotch = optionHasValue || isFocused;
            var isRequired = this.adapter.hasClass(constants_2.cssClasses.REQUIRED);
            this.notchOutline(shouldFloatAndNotch);
            this.adapter.floatLabel(shouldFloatAndNotch);
            this.adapter.setLabelRequired(isRequired);
        }
    };
    /**
     * Synchronizes the list of options with the state of the foundation. Call
     * this whenever menu options are dynamically updated.
     */
    MDCSelectFoundation.prototype.layoutOptions = function () {
        var menuItemValues = this.adapter.getMenuItemValues();
        var selectedIndex = menuItemValues.indexOf(this.getValue());
        this.setSelectedIndex(selectedIndex, /** closeMenu */false, /** skipNotify */true);
    };
    MDCSelectFoundation.prototype.handleMenuOpened = function () {
        if (this.adapter.getMenuItemValues().length === 0) {
            return;
        }
        // Menu should open to the last selected element, should open to first menu item otherwise.
        var selectedIndex = this.getSelectedIndex();
        var focusItemIndex = selectedIndex >= 0 ? selectedIndex : 0;
        this.adapter.focusMenuItemAtIndex(focusItemIndex);
    };
    MDCSelectFoundation.prototype.handleMenuClosing = function () {
        this.adapter.setSelectAnchorAttr('aria-expanded', 'false');
    };
    MDCSelectFoundation.prototype.handleMenuClosed = function () {
        this.adapter.removeClass(constants_2.cssClasses.ACTIVATED);
        this.isMenuOpen = false;
        // Unfocus the select if menu is closed without a selection
        if (!this.adapter.isSelectAnchorFocused()) {
            this.blur();
        }
    };
    /**
     * Handles value changes, via change event or programmatic updates.
     */
    MDCSelectFoundation.prototype.handleChange = function () {
        this.layout();
        this.adapter.notifyChange(this.getValue());
        var isRequired = this.adapter.hasClass(constants_2.cssClasses.REQUIRED);
        if (isRequired && this.useDefaultValidation) {
            this.setValid(this.isValid());
        }
    };
    MDCSelectFoundation.prototype.handleMenuItemAction = function (index) {
        this.setSelectedIndex(index, /** closeMenu */true);
    };
    /**
     * Handles focus events from select element.
     */
    MDCSelectFoundation.prototype.handleFocus = function () {
        this.adapter.addClass(constants_2.cssClasses.FOCUSED);
        this.layout();
        this.adapter.activateBottomLine();
    };
    /**
     * Handles blur events from select element.
     */
    MDCSelectFoundation.prototype.handleBlur = function () {
        if (this.isMenuOpen) {
            return;
        }
        this.blur();
    };
    MDCSelectFoundation.prototype.handleClick = function (normalizedX) {
        if (this.disabled || this.recentlyClicked) {
            return;
        }
        this.setClickDebounceTimeout();
        if (this.isMenuOpen) {
            this.adapter.closeMenu();
            return;
        }
        this.adapter.setRippleCenter(normalizedX);
        this.openMenu();
    };
    /**
     * Handles keydown events on select element. Depending on the type of
     * character typed, does typeahead matching or opens menu.
     */
    MDCSelectFoundation.prototype.handleKeydown = function (event) {
        if (this.isMenuOpen || !this.adapter.hasClass(constants_2.cssClasses.FOCUSED)) {
            return;
        }
        var isEnter = keyboard_1.normalizeKey(event) === keyboard_1.KEY.ENTER;
        var isSpace = keyboard_1.normalizeKey(event) === keyboard_1.KEY.SPACEBAR;
        var arrowUp = keyboard_1.normalizeKey(event) === keyboard_1.KEY.ARROW_UP;
        var arrowDown = keyboard_1.normalizeKey(event) === keyboard_1.KEY.ARROW_DOWN;
        var isModifier = event.ctrlKey || event.metaKey;
        // Typeahead
        if (!isModifier && (!isSpace && event.key && event.key.length === 1 || isSpace && this.adapter.isTypeaheadInProgress())) {
            var key = isSpace ? ' ' : event.key;
            var typeaheadNextIndex = this.adapter.typeaheadMatchItem(key, this.getSelectedIndex());
            if (typeaheadNextIndex >= 0) {
                this.setSelectedIndex(typeaheadNextIndex);
            }
            event.preventDefault();
            return;
        }
        if (!isEnter && !isSpace && !arrowUp && !arrowDown) {
            return;
        }
        // Increment/decrement index as necessary and open menu.
        if (arrowUp && this.getSelectedIndex() > 0) {
            this.setSelectedIndex(this.getSelectedIndex() - 1);
        } else if (arrowDown && this.getSelectedIndex() < this.adapter.getMenuItemCount() - 1) {
            this.setSelectedIndex(this.getSelectedIndex() + 1);
        }
        this.openMenu();
        event.preventDefault();
    };
    /**
     * Opens/closes the notched outline.
     */
    MDCSelectFoundation.prototype.notchOutline = function (openNotch) {
        if (!this.adapter.hasOutline()) {
            return;
        }
        var isFocused = this.adapter.hasClass(constants_2.cssClasses.FOCUSED);
        if (openNotch) {
            var labelScale = constants_2.numbers.LABEL_SCALE;
            var labelWidth = this.adapter.getLabelWidth() * labelScale;
            this.adapter.notchOutline(labelWidth);
        } else if (!isFocused) {
            this.adapter.closeOutline();
        }
    };
    /**
     * Sets the aria label of the leading icon.
     */
    MDCSelectFoundation.prototype.setLeadingIconAriaLabel = function (label) {
        if (this.leadingIcon) {
            this.leadingIcon.setAriaLabel(label);
        }
    };
    /**
     * Sets the text content of the leading icon.
     */
    MDCSelectFoundation.prototype.setLeadingIconContent = function (content) {
        if (this.leadingIcon) {
            this.leadingIcon.setContent(content);
        }
    };
    MDCSelectFoundation.prototype.setUseDefaultValidation = function (useDefaultValidation) {
        this.useDefaultValidation = useDefaultValidation;
    };
    MDCSelectFoundation.prototype.setValid = function (isValid) {
        if (!this.useDefaultValidation) {
            this.customValidity = isValid;
        }
        this.adapter.setSelectAnchorAttr('aria-invalid', (!isValid).toString());
        if (isValid) {
            this.adapter.removeClass(constants_2.cssClasses.INVALID);
            this.adapter.removeMenuClass(constants_2.cssClasses.MENU_INVALID);
        } else {
            this.adapter.addClass(constants_2.cssClasses.INVALID);
            this.adapter.addMenuClass(constants_2.cssClasses.MENU_INVALID);
        }
        this.syncHelperTextValidity(isValid);
    };
    MDCSelectFoundation.prototype.isValid = function () {
        if (this.useDefaultValidation && this.adapter.hasClass(constants_2.cssClasses.REQUIRED) && !this.adapter.hasClass(constants_2.cssClasses.DISABLED)) {
            // See notes for required attribute under https://www.w3.org/TR/html52/sec-forms.html#the-select-element
            // TL;DR: Invalid if no index is selected, or if the first index is selected and has an empty value.
            return this.getSelectedIndex() !== constants_2.numbers.UNSET_INDEX && (this.getSelectedIndex() !== 0 || Boolean(this.getValue()));
        }
        return this.customValidity;
    };
    MDCSelectFoundation.prototype.setRequired = function (isRequired) {
        if (isRequired) {
            this.adapter.addClass(constants_2.cssClasses.REQUIRED);
        } else {
            this.adapter.removeClass(constants_2.cssClasses.REQUIRED);
        }
        this.adapter.setSelectAnchorAttr('aria-required', isRequired.toString());
        this.adapter.setLabelRequired(isRequired);
    };
    MDCSelectFoundation.prototype.getRequired = function () {
        return this.adapter.getSelectAnchorAttr('aria-required') === 'true';
    };
    MDCSelectFoundation.prototype.init = function () {
        var anchorEl = this.adapter.getAnchorElement();
        if (anchorEl) {
            this.adapter.setMenuAnchorElement(anchorEl);
            this.adapter.setMenuAnchorCorner(constants_1.Corner.BOTTOM_START);
        }
        this.adapter.setMenuWrapFocus(false);
        this.setDisabled(this.adapter.hasClass(constants_2.cssClasses.DISABLED));
        this.syncHelperTextValidity(!this.adapter.hasClass(constants_2.cssClasses.INVALID));
        this.layout();
        this.layoutOptions();
    };
    /**
     * Unfocuses the select component.
     */
    MDCSelectFoundation.prototype.blur = function () {
        this.adapter.removeClass(constants_2.cssClasses.FOCUSED);
        this.layout();
        this.adapter.deactivateBottomLine();
        var isRequired = this.adapter.hasClass(constants_2.cssClasses.REQUIRED);
        if (isRequired && this.useDefaultValidation) {
            this.setValid(this.isValid());
        }
    };
    MDCSelectFoundation.prototype.syncHelperTextValidity = function (isValid) {
        if (!this.helperText) {
            return;
        }
        this.helperText.setValidity(isValid);
        var helperTextVisible = this.helperText.isVisible();
        var helperTextId = this.helperText.getId();
        if (helperTextVisible && helperTextId) {
            this.adapter.setSelectAnchorAttr(constants_2.strings.ARIA_DESCRIBEDBY, helperTextId);
        } else {
            // Needed because screenreaders will read labels pointed to by
            // `aria-describedby` even if they are `aria-hidden`.
            this.adapter.removeSelectAnchorAttr(constants_2.strings.ARIA_DESCRIBEDBY);
        }
    };
    MDCSelectFoundation.prototype.setClickDebounceTimeout = function () {
        var _this = this;
        clearTimeout(this.clickDebounceTimeout);
        this.clickDebounceTimeout = setTimeout(function () {
            _this.recentlyClicked = false;
        }, constants_2.numbers.CLICK_DEBOUNCE_TIMEOUT_MS);
        this.recentlyClicked = true;
    };
    return MDCSelectFoundation;
}(foundation_1.MDCFoundation);
exports.MDCSelectFoundation = MDCSelectFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCSelectFoundation;

/***/ }),

/***/ "./packages/mdc-select/helper-text/adapter.ts":
/*!****************************************************!*\
  !*** ./packages/mdc-select/helper-text/adapter.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });

/***/ }),

/***/ "./packages/mdc-select/helper-text/component.ts":
/*!******************************************************!*\
  !*** ./packages/mdc-select/helper-text/component.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCSelectHelperText = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-select/helper-text/foundation.ts");
var MDCSelectHelperText = /** @class */function (_super) {
    __extends(MDCSelectHelperText, _super);
    function MDCSelectHelperText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelectHelperText.attachTo = function (root) {
        return new MDCSelectHelperText(root);
    };
    Object.defineProperty(MDCSelectHelperText.prototype, "foundationForSelect", {
        // Provided for access by MDCSelect component
        get: function get() {
            return this.foundation;
        },
        enumerable: false,
        configurable: true
    });
    MDCSelectHelperText.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function addClass(className) {
                return _this.root.classList.add(className);
            },
            removeClass: function removeClass(className) {
                return _this.root.classList.remove(className);
            },
            hasClass: function hasClass(className) {
                return _this.root.classList.contains(className);
            },
            getAttr: function getAttr(attr) {
                return _this.root.getAttribute(attr);
            },
            setAttr: function setAttr(attr, value) {
                return _this.root.setAttribute(attr, value);
            },
            removeAttr: function removeAttr(attr) {
                return _this.root.removeAttribute(attr);
            },
            setContent: function setContent(content) {
                _this.root.textContent = content;
            }
        };
        // tslint:enable:object-literal-sort-keys
        return new foundation_1.MDCSelectHelperTextFoundation(adapter);
    };
    return MDCSelectHelperText;
}(component_1.MDCComponent);
exports.MDCSelectHelperText = MDCSelectHelperText;

/***/ }),

/***/ "./packages/mdc-select/helper-text/constants.ts":
/*!******************************************************!*\
  !*** ./packages/mdc-select/helper-text/constants.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.cssClasses = exports.strings = void 0;
var strings = {
    ARIA_HIDDEN: 'aria-hidden',
    ROLE: 'role'
};
exports.strings = strings;
var cssClasses = {
    HELPER_TEXT_VALIDATION_MSG: 'mdc-select-helper-text--validation-msg',
    HELPER_TEXT_VALIDATION_MSG_PERSISTENT: 'mdc-select-helper-text--validation-msg-persistent'
};
exports.cssClasses = cssClasses;

/***/ }),

/***/ "./packages/mdc-select/helper-text/foundation.ts":
/*!*******************************************************!*\
  !*** ./packages/mdc-select/helper-text/foundation.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCSelectHelperTextFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-select/helper-text/constants.ts");
var MDCSelectHelperTextFoundation = /** @class */function (_super) {
    __extends(MDCSelectHelperTextFoundation, _super);
    function MDCSelectHelperTextFoundation(adapter) {
        return _super.call(this, __assign(__assign({}, MDCSelectHelperTextFoundation.defaultAdapter), adapter)) || this;
    }
    Object.defineProperty(MDCSelectHelperTextFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelectHelperTextFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelectHelperTextFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectHelperTextAdapter} for typing information on parameters and return types.
         */
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function addClass() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                hasClass: function hasClass() {
                    return false;
                },
                setAttr: function setAttr() {
                    return undefined;
                },
                getAttr: function getAttr() {
                    return null;
                },
                removeAttr: function removeAttr() {
                    return undefined;
                },
                setContent: function setContent() {
                    return undefined;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @return The ID of the helper text, or null if none is set.
     */
    MDCSelectHelperTextFoundation.prototype.getId = function () {
        return this.adapter.getAttr('id');
    };
    /**
     * @return Whether the helper text is currently visible.
     */
    MDCSelectHelperTextFoundation.prototype.isVisible = function () {
        return this.adapter.getAttr(constants_1.strings.ARIA_HIDDEN) !== 'true';
    };
    /**
     * Sets the content of the helper text field.
     */
    MDCSelectHelperTextFoundation.prototype.setContent = function (content) {
        this.adapter.setContent(content);
    };
    /**
     * Sets the helper text to act as a validation message.
     * By default, validation messages are hidden when the select is valid and
     * visible when the select is invalid.
     *
     * @param isValidation True to make the helper text act as an error validation
     *     message.
     */
    MDCSelectHelperTextFoundation.prototype.setValidation = function (isValidation) {
        if (isValidation) {
            this.adapter.addClass(constants_1.cssClasses.HELPER_TEXT_VALIDATION_MSG);
        } else {
            this.adapter.removeClass(constants_1.cssClasses.HELPER_TEXT_VALIDATION_MSG);
        }
    };
    /**
     * Sets the persistency of the validation helper text.
     * This keeps the validation message visible even if the select is valid,
     * though it will be displayed in the normal (grey) color.
     */
    MDCSelectHelperTextFoundation.prototype.setValidationMsgPersistent = function (isPersistent) {
        if (isPersistent) {
            this.adapter.addClass(constants_1.cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT);
        } else {
            this.adapter.removeClass(constants_1.cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT);
        }
    };
    /**
     * When acting as a validation message, shows/hides the helper text and
     * triggers alerts as necessary based on the select's validity.
     */
    MDCSelectHelperTextFoundation.prototype.setValidity = function (selectIsValid) {
        var isValidationMsg = this.adapter.hasClass(constants_1.cssClasses.HELPER_TEXT_VALIDATION_MSG);
        if (!isValidationMsg) {
            // Non-validating helper-text is always displayed and does not participate
            // in validation logic.
            return;
        }
        var isPersistentValidationMsg = this.adapter.hasClass(constants_1.cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT);
        // Validating helper text is displayed if select is invalid, unless it is
        // set as persistent, in which case it always displays.
        var msgShouldDisplay = !selectIsValid || isPersistentValidationMsg;
        if (msgShouldDisplay) {
            this.showToScreenReader();
            // In addition to displaying, also trigger an alert if the select
            // has become invalid.
            if (!selectIsValid) {
                this.adapter.setAttr(constants_1.strings.ROLE, 'alert');
            } else {
                this.adapter.removeAttr(constants_1.strings.ROLE);
            }
            return;
        }
        // Hide everything.
        this.adapter.removeAttr(constants_1.strings.ROLE);
        this.hide();
    };
    /**
     * Makes the helper text visible to screen readers.
     */
    MDCSelectHelperTextFoundation.prototype.showToScreenReader = function () {
        this.adapter.removeAttr(constants_1.strings.ARIA_HIDDEN);
    };
    /**
     * Hides the help text from screen readers.
     */
    MDCSelectHelperTextFoundation.prototype.hide = function () {
        this.adapter.setAttr(constants_1.strings.ARIA_HIDDEN, 'true');
    };
    return MDCSelectHelperTextFoundation;
}(foundation_1.MDCFoundation);
exports.MDCSelectHelperTextFoundation = MDCSelectHelperTextFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCSelectHelperTextFoundation;

/***/ }),

/***/ "./packages/mdc-select/helper-text/index.ts":
/*!**************************************************!*\
  !*** ./packages/mdc-select/helper-text/index.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function get() {
            return m[k];
        } });
} : function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = this && this.__exportStar || function (m, exports) {
    for (var p in m) {
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helperTextStrings = exports.helperTextCssClasses = void 0;
__exportStar(__webpack_require__(/*! ./adapter */ "./packages/mdc-select/helper-text/adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./component */ "./packages/mdc-select/helper-text/component.ts"), exports);
__exportStar(__webpack_require__(/*! ./foundation */ "./packages/mdc-select/helper-text/foundation.ts"), exports);
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-select/helper-text/constants.ts");
Object.defineProperty(exports, "helperTextCssClasses", { enumerable: true, get: function get() {
        return constants_1.cssClasses;
    } });
Object.defineProperty(exports, "helperTextStrings", { enumerable: true, get: function get() {
        return constants_1.strings;
    } });

/***/ }),

/***/ "./packages/mdc-select/icon/adapter.ts":
/*!*********************************************!*\
  !*** ./packages/mdc-select/icon/adapter.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });

/***/ }),

/***/ "./packages/mdc-select/icon/component.ts":
/*!***********************************************!*\
  !*** ./packages/mdc-select/icon/component.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCSelectIcon = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-select/icon/foundation.ts");
var MDCSelectIcon = /** @class */function (_super) {
    __extends(MDCSelectIcon, _super);
    function MDCSelectIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelectIcon.attachTo = function (root) {
        return new MDCSelectIcon(root);
    };
    Object.defineProperty(MDCSelectIcon.prototype, "foundationForSelect", {
        // Provided for access by MDCSelect component
        get: function get() {
            return this.foundation;
        },
        enumerable: false,
        configurable: true
    });
    MDCSelectIcon.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            getAttr: function getAttr(attr) {
                return _this.root.getAttribute(attr);
            },
            setAttr: function setAttr(attr, value) {
                return _this.root.setAttribute(attr, value);
            },
            removeAttr: function removeAttr(attr) {
                return _this.root.removeAttribute(attr);
            },
            setContent: function setContent(content) {
                _this.root.textContent = content;
            },
            registerInteractionHandler: function registerInteractionHandler(evtType, handler) {
                return _this.listen(evtType, handler);
            },
            deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {
                return _this.unlisten(evtType, handler);
            },
            notifyIconAction: function notifyIconAction() {
                return _this.emit(foundation_1.MDCSelectIconFoundation.strings.ICON_EVENT, {} /* evtData */, true /* shouldBubble */);
            }
        };
        // tslint:enable:object-literal-sort-keys
        return new foundation_1.MDCSelectIconFoundation(adapter);
    };
    return MDCSelectIcon;
}(component_1.MDCComponent);
exports.MDCSelectIcon = MDCSelectIcon;

/***/ }),

/***/ "./packages/mdc-select/icon/constants.ts":
/*!***********************************************!*\
  !*** ./packages/mdc-select/icon/constants.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.strings = void 0;
var strings = {
  ICON_EVENT: 'MDCSelect:icon',
  ICON_ROLE: 'button'
};
exports.strings = strings;

/***/ }),

/***/ "./packages/mdc-select/icon/foundation.ts":
/*!************************************************!*\
  !*** ./packages/mdc-select/icon/foundation.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = this && this.__values || function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
        m = s && o[s],
        i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function next() {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCSelectIconFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-select/icon/constants.ts");
var INTERACTION_EVENTS = ['click', 'keydown'];
var MDCSelectIconFoundation = /** @class */function (_super) {
    __extends(MDCSelectIconFoundation, _super);
    function MDCSelectIconFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCSelectIconFoundation.defaultAdapter), adapter)) || this;
        _this.savedTabIndex = null;
        _this.interactionHandler = function (evt) {
            _this.handleInteraction(evt);
        };
        return _this;
    }
    Object.defineProperty(MDCSelectIconFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCSelectIconFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectIconAdapter} for typing information on parameters and return types.
         */
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                getAttr: function getAttr() {
                    return null;
                },
                setAttr: function setAttr() {
                    return undefined;
                },
                removeAttr: function removeAttr() {
                    return undefined;
                },
                setContent: function setContent() {
                    return undefined;
                },
                registerInteractionHandler: function registerInteractionHandler() {
                    return undefined;
                },
                deregisterInteractionHandler: function deregisterInteractionHandler() {
                    return undefined;
                },
                notifyIconAction: function notifyIconAction() {
                    return undefined;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCSelectIconFoundation.prototype.init = function () {
        var e_1, _a;
        this.savedTabIndex = this.adapter.getAttr('tabindex');
        try {
            for (var INTERACTION_EVENTS_1 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next(); !INTERACTION_EVENTS_1_1.done; INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next()) {
                var evtType = INTERACTION_EVENTS_1_1.value;
                this.adapter.registerInteractionHandler(evtType, this.interactionHandler);
            }
        } catch (e_1_1) {
            e_1 = { error: e_1_1 };
        } finally {
            try {
                if (INTERACTION_EVENTS_1_1 && !INTERACTION_EVENTS_1_1.done && (_a = INTERACTION_EVENTS_1.return)) _a.call(INTERACTION_EVENTS_1);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
    };
    MDCSelectIconFoundation.prototype.destroy = function () {
        var e_2, _a;
        try {
            for (var INTERACTION_EVENTS_2 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next(); !INTERACTION_EVENTS_2_1.done; INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next()) {
                var evtType = INTERACTION_EVENTS_2_1.value;
                this.adapter.deregisterInteractionHandler(evtType, this.interactionHandler);
            }
        } catch (e_2_1) {
            e_2 = { error: e_2_1 };
        } finally {
            try {
                if (INTERACTION_EVENTS_2_1 && !INTERACTION_EVENTS_2_1.done && (_a = INTERACTION_EVENTS_2.return)) _a.call(INTERACTION_EVENTS_2);
            } finally {
                if (e_2) throw e_2.error;
            }
        }
    };
    MDCSelectIconFoundation.prototype.setDisabled = function (disabled) {
        if (!this.savedTabIndex) {
            return;
        }
        if (disabled) {
            this.adapter.setAttr('tabindex', '-1');
            this.adapter.removeAttr('role');
        } else {
            this.adapter.setAttr('tabindex', this.savedTabIndex);
            this.adapter.setAttr('role', constants_1.strings.ICON_ROLE);
        }
    };
    MDCSelectIconFoundation.prototype.setAriaLabel = function (label) {
        this.adapter.setAttr('aria-label', label);
    };
    MDCSelectIconFoundation.prototype.setContent = function (content) {
        this.adapter.setContent(content);
    };
    MDCSelectIconFoundation.prototype.handleInteraction = function (evt) {
        var isEnterKey = evt.key === 'Enter' || evt.keyCode === 13;
        if (evt.type === 'click' || isEnterKey) {
            this.adapter.notifyIconAction();
        }
    };
    return MDCSelectIconFoundation;
}(foundation_1.MDCFoundation);
exports.MDCSelectIconFoundation = MDCSelectIconFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCSelectIconFoundation;

/***/ }),

/***/ "./packages/mdc-select/icon/index.ts":
/*!*******************************************!*\
  !*** ./packages/mdc-select/icon/index.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function get() {
            return m[k];
        } });
} : function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = this && this.__exportStar || function (m, exports) {
    for (var p in m) {
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconStrings = void 0;
__exportStar(__webpack_require__(/*! ./adapter */ "./packages/mdc-select/icon/adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./component */ "./packages/mdc-select/icon/component.ts"), exports);
__exportStar(__webpack_require__(/*! ./foundation */ "./packages/mdc-select/icon/foundation.ts"), exports);
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-select/icon/constants.ts");
Object.defineProperty(exports, "iconStrings", { enumerable: true, get: function get() {
        return constants_1.strings;
    } });

/***/ }),

/***/ "./packages/mdc-select/index.ts":
/*!**************************************!*\
  !*** ./packages/mdc-select/index.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function get() {
            return m[k];
        } });
} : function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = this && this.__exportStar || function (m, exports) {
    for (var p in m) {
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(/*! ./adapter */ "./packages/mdc-select/adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./component */ "./packages/mdc-select/component.ts"), exports);
__exportStar(__webpack_require__(/*! ./constants */ "./packages/mdc-select/constants.ts"), exports);
__exportStar(__webpack_require__(/*! ./foundation */ "./packages/mdc-select/foundation.ts"), exports);
__exportStar(__webpack_require__(/*! ./types */ "./packages/mdc-select/types.ts"), exports);
__exportStar(__webpack_require__(/*! ./helper-text/index */ "./packages/mdc-select/helper-text/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./icon/index */ "./packages/mdc-select/icon/index.ts"), exports);

/***/ }),

/***/ "./packages/mdc-select/types.ts":
/*!**************************************!*\
  !*** ./packages/mdc-select/types.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.defineProperty(exports, "__esModule", { value: true });

/***/ })

/******/ });
});
//# sourceMappingURL=mdc.select.js.map