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
		exports["tooltip"] = factory();
	else
		root["mdc"] = root["mdc"] || {}, root["mdc"]["tooltip"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/mdc-tooltip/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./packages/mdc-animation/animationframe.ts":
/*!**************************************************!*\
  !*** ./packages/mdc-animation/animationframe.ts ***!
  \**************************************************/
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
exports.AnimationFrame = void 0;
/**
 * AnimationFrame provides a user-friendly abstraction around requesting
 * and canceling animation frames.
 */
var AnimationFrame = /** @class */function () {
    function AnimationFrame() {
        this.rafIDs = new Map();
    }
    /**
     * Requests an animation frame. Cancels any existing frame with the same key.
     * @param {string} key The key for this callback.
     * @param {FrameRequestCallback} callback The callback to be executed.
     */
    AnimationFrame.prototype.request = function (key, callback) {
        var _this = this;
        this.cancel(key);
        var frameID = requestAnimationFrame(function (frame) {
            _this.rafIDs.delete(key);
            // Callback must come *after* the key is deleted so that nested calls to
            // request with the same key are not deleted.
            callback(frame);
        });
        this.rafIDs.set(key, frameID);
    };
    /**
     * Cancels a queued callback with the given key.
     * @param {string} key The key for this callback.
     */
    AnimationFrame.prototype.cancel = function (key) {
        var rafID = this.rafIDs.get(key);
        if (rafID) {
            cancelAnimationFrame(rafID);
            this.rafIDs.delete(key);
        }
    };
    /**
     * Cancels all queued callback.
     */
    AnimationFrame.prototype.cancelAll = function () {
        var _this = this;
        // Need to use forEach because it's the only iteration method supported
        // by IE11. Suppress the underscore because we don't need it.
        // tslint:disable-next-line:enforce-name-casing
        this.rafIDs.forEach(function (_, key) {
            _this.cancel(key);
        });
    };
    /**
     * Returns the queue of unexecuted callback keys.
     */
    AnimationFrame.prototype.getQueue = function () {
        var queue = [];
        // Need to use forEach because it's the only iteration method supported
        // by IE11. Suppress the underscore because we don't need it.
        // tslint:disable-next-line:enforce-name-casing
        this.rafIDs.forEach(function (_, key) {
            queue.push(key);
        });
        return queue;
    };
    return AnimationFrame;
}();
exports.AnimationFrame = AnimationFrame;

/***/ }),

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

/***/ "./packages/mdc-tooltip/adapter.ts":
/*!*****************************************!*\
  !*** ./packages/mdc-tooltip/adapter.ts ***!
  \*****************************************/
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

/***/ }),

/***/ "./packages/mdc-tooltip/component.ts":
/*!*******************************************!*\
  !*** ./packages/mdc-tooltip/component.ts ***!
  \*******************************************/
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
exports.MDCTooltip = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-tooltip/constants.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-tooltip/foundation.ts");
var MDCTooltip = /** @class */function (_super) {
    __extends(MDCTooltip, _super);
    function MDCTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTooltip.attachTo = function (root) {
        return new MDCTooltip(root);
    };
    MDCTooltip.prototype.initialize = function () {
        var tooltipId = this.root.getAttribute('id');
        if (!tooltipId) {
            throw new Error('MDCTooltip: Tooltip component must have an id.');
        }
        var anchorElem = document.querySelector("[data-tooltip-id=\"" + tooltipId + "\"]") || document.querySelector("[aria-describedby=\"" + tooltipId + "\"]");
        if (!anchorElem) {
            throw new Error('MDCTooltip: Tooltip component requires an anchor element annotated with [aria-describedby] or [data-tooltip-id].');
        }
        this.anchorElem = anchorElem;
    };
    MDCTooltip.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.isTooltipRich = this.foundation.isRich();
        this.isTooltipPersistent = this.foundation.isPersistent();
        this.handleMouseEnter = function () {
            _this.foundation.handleAnchorMouseEnter();
        };
        this.handleFocus = function (evt) {
            _this.foundation.handleAnchorFocus(evt);
        };
        this.handleMouseLeave = function () {
            _this.foundation.handleAnchorMouseLeave();
        };
        this.handleTransitionEnd = function () {
            _this.foundation.handleTransitionEnd();
        };
        this.handleClick = function () {
            _this.foundation.handleAnchorClick();
        };
        this.handleTouchstart = function () {
            _this.foundation.handleAnchorTouchstart();
        };
        this.handleTouchend = function () {
            _this.foundation.handleAnchorTouchend();
        };
        if (this.isTooltipRich && this.isTooltipPersistent) {
            this.anchorElem.addEventListener('click', this.handleClick);
        } else {
            this.anchorElem.addEventListener('mouseenter', this.handleMouseEnter);
            // TODO(b/157075286): Listening for a 'focus' event is too broad.
            this.anchorElem.addEventListener('focus', this.handleFocus);
            this.anchorElem.addEventListener('mouseleave', this.handleMouseLeave);
            this.anchorElem.addEventListener('touchstart', this.handleTouchstart);
            this.anchorElem.addEventListener('touchend', this.handleTouchend);
        }
        this.listen('transitionend', this.handleTransitionEnd);
    };
    MDCTooltip.prototype.destroy = function () {
        if (this.anchorElem) {
            if (this.isTooltipRich && this.isTooltipPersistent) {
                this.anchorElem.removeEventListener('click', this.handleClick);
            } else {
                this.anchorElem.removeEventListener('mouseenter', this.handleMouseEnter);
                this.anchorElem.removeEventListener('focus', this.handleFocus);
                this.anchorElem.removeEventListener('mouseleave', this.handleMouseLeave);
                this.anchorElem.removeEventListener('touchstart', this.handleTouchstart);
                this.anchorElem.removeEventListener('touchend', this.handleTouchend);
            }
        }
        this.unlisten('transitionend', this.handleTransitionEnd);
        _super.prototype.destroy.call(this);
    };
    MDCTooltip.prototype.setTooltipPosition = function (position) {
        this.foundation.setTooltipPosition(position);
    };
    MDCTooltip.prototype.setAnchorBoundaryType = function (type) {
        this.foundation.setAnchorBoundaryType(type);
    };
    MDCTooltip.prototype.setShowDelay = function (delayMs) {
        this.foundation.setShowDelay(delayMs);
    };
    MDCTooltip.prototype.setHideDelay = function (delayMs) {
        this.foundation.setHideDelay(delayMs);
    };
    MDCTooltip.prototype.hide = function () {
        this.foundation.hide();
    };
    MDCTooltip.prototype.isShown = function () {
        this.foundation.isShown();
    };
    /**
     * Method that allows user to specify additional elements that should have a
     * scroll event listener attached to it. This should be used in instances
     * where the anchor element is placed inside a scrollable container (that is
     * not the body element), and will ensure that the tooltip will stay attached
     * to the anchor on scroll.
     */
    MDCTooltip.prototype.attachScrollHandler = function (addEventListenerFn) {
        this.foundation.attachScrollHandler(addEventListenerFn);
    };
    /**
     * Must be used in conjunction with #attachScrollHandler. Removes the scroll
     * event handler from elements on the page.
     */
    MDCTooltip.prototype.removeScrollHandler = function (removeEventHandlerFn) {
        this.foundation.removeScrollHandler(removeEventHandlerFn);
    };
    MDCTooltip.prototype.getDefaultFoundation = function () {
        var _this = this;
        var adapter = {
            getAttribute: function getAttribute(attr) {
                return _this.root.getAttribute(attr);
            },
            setAttribute: function setAttribute(attr, value) {
                _this.root.setAttribute(attr, value);
            },
            addClass: function addClass(className) {
                _this.root.classList.add(className);
            },
            hasClass: function hasClass(className) {
                return _this.root.classList.contains(className);
            },
            removeClass: function removeClass(className) {
                _this.root.classList.remove(className);
            },
            getComputedStyleProperty: function getComputedStyleProperty(propertyName) {
                return window.getComputedStyle(_this.root).getPropertyValue(propertyName);
            },
            setStyleProperty: function setStyleProperty(propertyName, value) {
                _this.root.style.setProperty(propertyName, value);
            },
            setSurfaceAnimationStyleProperty: function setSurfaceAnimationStyleProperty(propertyName, value) {
                var surface = _this.root.querySelector("." + constants_1.CssClasses.SURFACE_ANIMATION);
                surface === null || surface === void 0 ? void 0 : surface.style.setProperty(propertyName, value);
            },
            getViewportWidth: function getViewportWidth() {
                return window.innerWidth;
            },
            getViewportHeight: function getViewportHeight() {
                return window.innerHeight;
            },
            getTooltipSize: function getTooltipSize() {
                return {
                    width: _this.root.offsetWidth,
                    height: _this.root.offsetHeight
                };
            },
            getAnchorBoundingRect: function getAnchorBoundingRect() {
                return _this.anchorElem ? _this.anchorElem.getBoundingClientRect() : null;
            },
            getParentBoundingRect: function getParentBoundingRect() {
                var _a, _b;
                return (_b = (_a = _this.root.parentElement) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) !== null && _b !== void 0 ? _b : null;
            },
            getAnchorAttribute: function getAnchorAttribute(attr) {
                return _this.anchorElem ? _this.anchorElem.getAttribute(attr) : null;
            },
            setAnchorAttribute: function setAnchorAttribute(attr, value) {
                var _a;
                (_a = _this.anchorElem) === null || _a === void 0 ? void 0 : _a.setAttribute(attr, value);
            },
            isRTL: function isRTL() {
                return getComputedStyle(_this.root).direction === 'rtl';
            },
            anchorContainsElement: function anchorContainsElement(element) {
                var _a;
                return !!((_a = _this.anchorElem) === null || _a === void 0 ? void 0 : _a.contains(element));
            },
            tooltipContainsElement: function tooltipContainsElement(element) {
                return _this.root.contains(element);
            },
            focusAnchorElement: function focusAnchorElement() {
                var _a;
                (_a = _this.anchorElem) === null || _a === void 0 ? void 0 : _a.focus();
            },
            registerEventHandler: function registerEventHandler(evt, handler) {
                if (_this.root instanceof HTMLElement) {
                    _this.root.addEventListener(evt, handler);
                }
            },
            deregisterEventHandler: function deregisterEventHandler(evt, handler) {
                if (_this.root instanceof HTMLElement) {
                    _this.root.removeEventListener(evt, handler);
                }
            },
            registerAnchorEventHandler: function registerAnchorEventHandler(evt, handler) {
                var _a;
                (_a = _this.anchorElem) === null || _a === void 0 ? void 0 : _a.addEventListener(evt, handler);
            },
            deregisterAnchorEventHandler: function deregisterAnchorEventHandler(evt, handler) {
                var _a;
                (_a = _this.anchorElem) === null || _a === void 0 ? void 0 : _a.removeEventListener(evt, handler);
            },
            registerDocumentEventHandler: function registerDocumentEventHandler(evt, handler) {
                document.body.addEventListener(evt, handler);
            },
            deregisterDocumentEventHandler: function deregisterDocumentEventHandler(evt, handler) {
                document.body.removeEventListener(evt, handler);
            },
            registerWindowEventHandler: function registerWindowEventHandler(evt, handler) {
                window.addEventListener(evt, handler);
            },
            deregisterWindowEventHandler: function deregisterWindowEventHandler(evt, handler) {
                window.removeEventListener(evt, handler);
            },
            notifyHidden: function notifyHidden() {
                _this.emit(constants_1.events.HIDDEN, {});
            },
            getTooltipCaretBoundingRect: function getTooltipCaretBoundingRect() {
                var caret = _this.root.querySelector("." + constants_1.CssClasses.TOOLTIP_CARET_TOP);
                if (!caret) {
                    return null;
                }
                return caret.getBoundingClientRect();
            },
            setTooltipCaretStyle: function setTooltipCaretStyle(propertyName, value) {
                var topCaret = _this.root.querySelector("." + constants_1.CssClasses.TOOLTIP_CARET_TOP);
                var bottomCaret = _this.root.querySelector("." + constants_1.CssClasses.TOOLTIP_CARET_BOTTOM);
                if (!topCaret || !bottomCaret) {
                    return;
                }
                topCaret.style.setProperty(propertyName, value);
                bottomCaret.style.setProperty(propertyName, value);
            },
            clearTooltipCaretStyles: function clearTooltipCaretStyles() {
                var topCaret = _this.root.querySelector("." + constants_1.CssClasses.TOOLTIP_CARET_TOP);
                var bottomCaret = _this.root.querySelector("." + constants_1.CssClasses.TOOLTIP_CARET_BOTTOM);
                if (!topCaret || !bottomCaret) {
                    return;
                }
                topCaret.removeAttribute('style');
                bottomCaret.removeAttribute('style');
            }
        };
        //tslint:enable:object-literal-sort-keys
        return new foundation_1.MDCTooltipFoundation(adapter);
    };
    return MDCTooltip;
}(component_1.MDCComponent);
exports.MDCTooltip = MDCTooltip;

/***/ }),

/***/ "./packages/mdc-tooltip/constants.ts":
/*!*******************************************!*\
  !*** ./packages/mdc-tooltip/constants.ts ***!
  \*******************************************/
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
exports.XPositionWithCaret = exports.YPositionWithCaret = exports.PositionWithCaret = exports.strings = exports.YPosition = exports.AnchorBoundaryType = exports.XPosition = exports.events = exports.attributes = exports.numbers = exports.CssClasses = void 0;
var CssClasses;
(function (CssClasses) {
    CssClasses["RICH"] = "mdc-tooltip--rich";
    CssClasses["SHOWN"] = "mdc-tooltip--shown";
    CssClasses["SHOWING"] = "mdc-tooltip--showing";
    CssClasses["SHOWING_TRANSITION"] = "mdc-tooltip--showing-transition";
    CssClasses["HIDE"] = "mdc-tooltip--hide";
    CssClasses["HIDE_TRANSITION"] = "mdc-tooltip--hide-transition";
    CssClasses["MULTILINE_TOOLTIP"] = "mdc-tooltip--multiline";
    CssClasses["SURFACE"] = "mdc-tooltip__surface";
    CssClasses["SURFACE_ANIMATION"] = "mdc-tooltip__surface-animation";
    CssClasses["TOOLTIP_CARET_TOP"] = "mdc-tooltip__caret-surface-top";
    CssClasses["TOOLTIP_CARET_BOTTOM"] = "mdc-tooltip__caret-surface-bottom";
})(CssClasses || (CssClasses = {}));
exports.CssClasses = CssClasses;
var numbers = {
    BOUNDED_ANCHOR_GAP: 4,
    UNBOUNDED_ANCHOR_GAP: 8,
    MIN_VIEWPORT_TOOLTIP_THRESHOLD: 8,
    HIDE_DELAY_MS: 600,
    SHOW_DELAY_MS: 500,
    // LINT.IfChange(tooltip-dimensions)
    MIN_HEIGHT: 24,
    MAX_WIDTH: 200,
    // LINT.ThenChange(_tooltip.scss:tooltip-dimensions)
    CARET_INDENTATION: 24,
    // LINT.IfChange(tooltip-anim-scale)
    ANIMATION_SCALE: 0.8
};
exports.numbers = numbers;
var attributes = {
    ARIA_EXPANDED: 'aria-expanded',
    ARIA_HASPOPUP: 'aria-haspopup',
    PERSISTENT: 'data-mdc-tooltip-persistent',
    SCROLLABLE_ANCESTOR: 'tooltip-scrollable-ancestor',
    HAS_CARET: 'data-mdc-tooltip-has-caret'
};
exports.attributes = attributes;
var events = {
    HIDDEN: 'MDCTooltip:hidden'
};
exports.events = events;
/** Enum for possible tooltip positioning relative to its anchor element. */
var XPosition;
(function (XPosition) {
    XPosition[XPosition["DETECTED"] = 0] = "DETECTED";
    XPosition[XPosition["START"] = 1] = "START";
    // Note: CENTER is not valid for rich tooltips.
    XPosition[XPosition["CENTER"] = 2] = "CENTER";
    XPosition[XPosition["END"] = 3] = "END";
})(XPosition || (XPosition = {}));
exports.XPosition = XPosition;
var YPosition;
(function (YPosition) {
    YPosition[YPosition["DETECTED"] = 0] = "DETECTED";
    YPosition[YPosition["ABOVE"] = 1] = "ABOVE";
    YPosition[YPosition["BELOW"] = 2] = "BELOW";
})(YPosition || (YPosition = {}));
exports.YPosition = YPosition;
/**
 * Enum for possible anchor boundary types. This determines the gap between the
 * bottom of the anchor and the tooltip element.
 * Bounded anchors have an identifiable boundary (e.g. buttons).
 * Unbounded anchors don't have a visually declared boundary (e.g. plain text).
 */
var AnchorBoundaryType;
(function (AnchorBoundaryType) {
    AnchorBoundaryType[AnchorBoundaryType["BOUNDED"] = 0] = "BOUNDED";
    AnchorBoundaryType[AnchorBoundaryType["UNBOUNDED"] = 1] = "UNBOUNDED";
})(AnchorBoundaryType || (AnchorBoundaryType = {}));
exports.AnchorBoundaryType = AnchorBoundaryType;
var strings = {
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center',
    TOP: 'top',
    BOTTOM: 'bottom'
};
exports.strings = strings;
/**
 * Enum for possible positions of a tooltip with caret (this specifies the
 * positioning of the tooltip relative to the anchor -- the position of the
 * caret will follow that of the tooltip). This can NOT be combined with the
 * above X/YPosition options. Naming for the enums follows: (vertical
 * placement)_(horizontal placement).
 */
var PositionWithCaret;
(function (PositionWithCaret) {
    PositionWithCaret[PositionWithCaret["DETECTED"] = 0] = "DETECTED";
    PositionWithCaret[PositionWithCaret["ABOVE_START"] = 1] = "ABOVE_START";
    PositionWithCaret[PositionWithCaret["ABOVE_CENTER"] = 2] = "ABOVE_CENTER";
    PositionWithCaret[PositionWithCaret["ABOVE_END"] = 3] = "ABOVE_END";
    PositionWithCaret[PositionWithCaret["TOP_SIDE_START"] = 4] = "TOP_SIDE_START";
    PositionWithCaret[PositionWithCaret["CENTER_SIDE_START"] = 5] = "CENTER_SIDE_START";
    PositionWithCaret[PositionWithCaret["BOTTOM_SIDE_START"] = 6] = "BOTTOM_SIDE_START";
    PositionWithCaret[PositionWithCaret["TOP_SIDE_END"] = 7] = "TOP_SIDE_END";
    PositionWithCaret[PositionWithCaret["CENTER_SIDE_END"] = 8] = "CENTER_SIDE_END";
    PositionWithCaret[PositionWithCaret["BOTTOM_SIDE_END"] = 9] = "BOTTOM_SIDE_END";
    PositionWithCaret[PositionWithCaret["BELOW_START"] = 10] = "BELOW_START";
    PositionWithCaret[PositionWithCaret["BELOW_CENTER"] = 11] = "BELOW_CENTER";
    PositionWithCaret[PositionWithCaret["BELOW_END"] = 12] = "BELOW_END";
})(PositionWithCaret || (PositionWithCaret = {}));
exports.PositionWithCaret = PositionWithCaret;
var YPositionWithCaret;
(function (YPositionWithCaret) {
    YPositionWithCaret[YPositionWithCaret["ABOVE"] = 1] = "ABOVE";
    YPositionWithCaret[YPositionWithCaret["BELOW"] = 2] = "BELOW";
    YPositionWithCaret[YPositionWithCaret["SIDE_TOP"] = 3] = "SIDE_TOP";
    YPositionWithCaret[YPositionWithCaret["SIDE_CENTER"] = 4] = "SIDE_CENTER";
    YPositionWithCaret[YPositionWithCaret["SIDE_BOTTOM"] = 5] = "SIDE_BOTTOM";
})(YPositionWithCaret || (YPositionWithCaret = {}));
exports.YPositionWithCaret = YPositionWithCaret;
var XPositionWithCaret;
(function (XPositionWithCaret) {
    XPositionWithCaret[XPositionWithCaret["START"] = 1] = "START";
    XPositionWithCaret[XPositionWithCaret["CENTER"] = 2] = "CENTER";
    XPositionWithCaret[XPositionWithCaret["END"] = 3] = "END";
    XPositionWithCaret[XPositionWithCaret["SIDE_START"] = 4] = "SIDE_START";
    XPositionWithCaret[XPositionWithCaret["SIDE_END"] = 5] = "SIDE_END";
})(XPositionWithCaret || (XPositionWithCaret = {}));
exports.XPositionWithCaret = XPositionWithCaret;

/***/ }),

/***/ "./packages/mdc-tooltip/foundation.ts":
/*!********************************************!*\
  !*** ./packages/mdc-tooltip/foundation.ts ***!
  \********************************************/
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
exports.MDCTooltipFoundation = void 0;
var animationframe_1 = __webpack_require__(/*! @material/animation/animationframe */ "./packages/mdc-animation/animationframe.ts");
var util_1 = __webpack_require__(/*! @material/animation/util */ "./packages/mdc-animation/util.ts");
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var keyboard_1 = __webpack_require__(/*! @material/dom/keyboard */ "./packages/mdc-dom/keyboard.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-tooltip/constants.ts");
var RICH = constants_1.CssClasses.RICH,
    SHOWN = constants_1.CssClasses.SHOWN,
    SHOWING = constants_1.CssClasses.SHOWING,
    SHOWING_TRANSITION = constants_1.CssClasses.SHOWING_TRANSITION,
    HIDE = constants_1.CssClasses.HIDE,
    HIDE_TRANSITION = constants_1.CssClasses.HIDE_TRANSITION,
    MULTILINE_TOOLTIP = constants_1.CssClasses.MULTILINE_TOOLTIP;
var AnimationKeys;
(function (AnimationKeys) {
    AnimationKeys["POLL_ANCHOR"] = "poll_anchor";
})(AnimationKeys || (AnimationKeys = {}));
// Accessing `window` without a `typeof` check will throw on Node environments.
var HAS_WINDOW = typeof window !== 'undefined';
var MDCTooltipFoundation = /** @class */function (_super) {
    __extends(MDCTooltipFoundation, _super);
    function MDCTooltipFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCTooltipFoundation.defaultAdapter), adapter)) || this;
        _this.tooltipShown = false;
        _this.anchorGap = constants_1.numbers.BOUNDED_ANCHOR_GAP;
        _this.xTooltipPos = constants_1.XPosition.DETECTED;
        _this.yTooltipPos = constants_1.YPosition.DETECTED;
        _this.tooltipPositionWithCaret = constants_1.PositionWithCaret.DETECTED;
        // Minimum threshold distance needed between the tooltip and the viewport.
        _this.minViewportTooltipThreshold = constants_1.numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD;
        _this.hideDelayMs = constants_1.numbers.HIDE_DELAY_MS;
        _this.showDelayMs = constants_1.numbers.SHOW_DELAY_MS;
        _this.anchorRect = null;
        _this.parentRect = null;
        _this.frameId = null;
        _this.hideTimeout = null;
        _this.showTimeout = null;
        _this.addAncestorScrollEventListeners = new Array();
        _this.removeAncestorScrollEventListeners = new Array();
        _this.animFrame = new animationframe_1.AnimationFrame();
        _this.anchorBlurHandler = function (evt) {
            _this.handleAnchorBlur(evt);
        };
        _this.documentClickHandler = function (evt) {
            _this.handleDocumentClick(evt);
        };
        _this.documentKeydownHandler = function (evt) {
            _this.handleKeydown(evt);
        };
        _this.tooltipMouseEnterHandler = function () {
            _this.handleTooltipMouseEnter();
        };
        _this.tooltipMouseLeaveHandler = function () {
            _this.handleTooltipMouseLeave();
        };
        _this.richTooltipFocusOutHandler = function (evt) {
            _this.handleRichTooltipFocusOut(evt);
        };
        _this.windowScrollHandler = function () {
            _this.handleWindowChangeEvent();
        };
        _this.windowResizeHandler = function () {
            _this.handleWindowChangeEvent();
        };
        return _this;
    }
    Object.defineProperty(MDCTooltipFoundation, "defaultAdapter", {
        get: function get() {
            return {
                getAttribute: function getAttribute() {
                    return null;
                },
                setAttribute: function setAttribute() {
                    return undefined;
                },
                addClass: function addClass() {
                    return undefined;
                },
                hasClass: function hasClass() {
                    return false;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                getComputedStyleProperty: function getComputedStyleProperty() {
                    return '';
                },
                setStyleProperty: function setStyleProperty() {
                    return undefined;
                },
                setSurfaceAnimationStyleProperty: function setSurfaceAnimationStyleProperty() {
                    return undefined;
                },
                getViewportWidth: function getViewportWidth() {
                    return 0;
                },
                getViewportHeight: function getViewportHeight() {
                    return 0;
                },
                getTooltipSize: function getTooltipSize() {
                    return { width: 0, height: 0 };
                },
                getAnchorBoundingRect: function getAnchorBoundingRect() {
                    return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
                },
                getParentBoundingRect: function getParentBoundingRect() {
                    return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
                },
                getAnchorAttribute: function getAnchorAttribute() {
                    return null;
                },
                setAnchorAttribute: function setAnchorAttribute() {
                    return null;
                },
                isRTL: function isRTL() {
                    return false;
                },
                anchorContainsElement: function anchorContainsElement() {
                    return false;
                },
                tooltipContainsElement: function tooltipContainsElement() {
                    return false;
                },
                focusAnchorElement: function focusAnchorElement() {
                    return undefined;
                },
                registerEventHandler: function registerEventHandler() {
                    return undefined;
                },
                deregisterEventHandler: function deregisterEventHandler() {
                    return undefined;
                },
                registerAnchorEventHandler: function registerAnchorEventHandler() {
                    return undefined;
                },
                deregisterAnchorEventHandler: function deregisterAnchorEventHandler() {
                    return undefined;
                },
                registerDocumentEventHandler: function registerDocumentEventHandler() {
                    return undefined;
                },
                deregisterDocumentEventHandler: function deregisterDocumentEventHandler() {
                    return undefined;
                },
                registerWindowEventHandler: function registerWindowEventHandler() {
                    return undefined;
                },
                deregisterWindowEventHandler: function deregisterWindowEventHandler() {
                    return undefined;
                },
                notifyHidden: function notifyHidden() {
                    return undefined;
                },
                getTooltipCaretBoundingRect: function getTooltipCaretBoundingRect() {
                    return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
                },
                setTooltipCaretStyle: function setTooltipCaretStyle() {
                    return undefined;
                },
                clearTooltipCaretStyles: function clearTooltipCaretStyles() {
                    return undefined;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCTooltipFoundation.prototype.init = function () {
        this.richTooltip = this.adapter.hasClass(RICH);
        this.persistentTooltip = this.adapter.getAttribute(constants_1.attributes.PERSISTENT) === 'true';
        this.interactiveTooltip = !!this.adapter.getAnchorAttribute(constants_1.attributes.ARIA_EXPANDED) && this.adapter.getAnchorAttribute(constants_1.attributes.ARIA_HASPOPUP) === 'dialog';
        this.hasCaret = this.richTooltip && this.adapter.getAttribute(constants_1.attributes.HAS_CARET) === 'true';
    };
    MDCTooltipFoundation.prototype.isShown = function () {
        return this.tooltipShown;
    };
    MDCTooltipFoundation.prototype.isRich = function () {
        return this.richTooltip;
    };
    MDCTooltipFoundation.prototype.isPersistent = function () {
        return this.persistentTooltip;
    };
    MDCTooltipFoundation.prototype.handleAnchorMouseEnter = function () {
        var _this = this;
        if (this.tooltipShown) {
            // Covers the instance where a user hovers over the anchor to reveal the
            // tooltip, and then quickly navigates away and then back to the anchor.
            // The tooltip should stay visible without animating out and then back in
            // again.
            this.show();
        } else {
            // clearHideTimeout here since handleAnchorMouseLeave sets a hideTimeout
            // and that can execute before the showTimeout executes, resulting in hide
            // being called and the showTimeout set below to be cleared.
            this.clearHideTimeout();
            this.showTimeout = setTimeout(function () {
                _this.show();
            }, this.showDelayMs);
        }
    };
    MDCTooltipFoundation.prototype.handleAnchorTouchstart = function () {
        var _this = this;
        this.showTimeout = setTimeout(function () {
            _this.show();
        }, this.showDelayMs);
        // Prevent a context menu from appearing if user is long-pressing on a
        // tooltip anchor.
        this.adapter.registerWindowEventHandler('contextmenu', this.preventContextMenuOnLongTouch);
    };
    MDCTooltipFoundation.prototype.preventContextMenuOnLongTouch = function (evt) {
        evt.preventDefault();
    };
    MDCTooltipFoundation.prototype.handleAnchorTouchend = function () {
        this.clearShowTimeout();
        // Only remove the 'contextmenu' listener if the tooltip is not shown. When
        // the tooltip *is* shown, listener is removed in the close method.
        if (!this.isShown()) {
            this.adapter.deregisterWindowEventHandler('contextmenu', this.preventContextMenuOnLongTouch);
        }
    };
    MDCTooltipFoundation.prototype.handleAnchorFocus = function (evt) {
        var _this = this;
        // TODO(b/157075286): Need to add some way to distinguish keyboard
        // navigation focus events from other focus events, and only show the
        // tooltip on the former of these events.
        var relatedTarget = evt.relatedTarget;
        var tooltipContainsRelatedTarget = relatedTarget instanceof HTMLElement && this.adapter.tooltipContainsElement(relatedTarget);
        // Do not show tooltip if the previous focus was on a tooltip element. This
        // occurs when a rich tooltip is closed and focus is restored to the anchor
        // or when user tab-navigates back into the anchor from the rich tooltip.
        if (tooltipContainsRelatedTarget) {
            return;
        }
        this.showTimeout = setTimeout(function () {
            _this.show();
        }, this.showDelayMs);
    };
    MDCTooltipFoundation.prototype.handleAnchorMouseLeave = function () {
        var _this = this;
        this.clearShowTimeout();
        this.hideTimeout = setTimeout(function () {
            _this.hide();
        }, this.hideDelayMs);
    };
    MDCTooltipFoundation.prototype.handleAnchorClick = function () {
        if (this.tooltipShown) {
            this.hide();
        } else {
            this.show();
        }
    };
    MDCTooltipFoundation.prototype.handleDocumentClick = function (evt) {
        var anchorOrTooltipContainsTargetElement = evt.target instanceof HTMLElement && (this.adapter.anchorContainsElement(evt.target) || this.adapter.tooltipContainsElement(evt.target));
        // For persistent rich tooltips, we will not hide if:
        // - The click target is within the anchor element. Otherwise, both
        //   the anchor element's click handler and this handler will handle the
        //   click (due to event propagation), resulting in a shown tooltip
        //   being immediately hidden if the tooltip was initially hidden.
        // - The click target is within the tooltip element, since clicks
        //   on the tooltip do not close the tooltip.
        if (this.richTooltip && this.persistentTooltip && anchorOrTooltipContainsTargetElement) {
            return;
        }
        // Hide the tooltip immediately on click.
        this.hide();
    };
    MDCTooltipFoundation.prototype.handleKeydown = function (evt) {
        // Hide the tooltip immediately on ESC key.
        var key = keyboard_1.normalizeKey(evt);
        if (key === keyboard_1.KEY.ESCAPE) {
            var tooltipContainsActiveElement = document.activeElement instanceof HTMLElement && this.adapter.tooltipContainsElement(document.activeElement);
            if (tooltipContainsActiveElement) {
                this.adapter.focusAnchorElement();
            }
            this.hide();
        }
    };
    MDCTooltipFoundation.prototype.handleAnchorBlur = function (evt) {
        if (this.richTooltip) {
            var tooltipContainsRelatedTargetElement = evt.relatedTarget instanceof HTMLElement && this.adapter.tooltipContainsElement(evt.relatedTarget);
            // If focus changed to the tooltip element, don't hide the tooltip.
            if (tooltipContainsRelatedTargetElement) {
                return;
            }
        }
        // Hide tooltip immediately on focus change.
        this.hide();
    };
    MDCTooltipFoundation.prototype.handleTooltipMouseEnter = function () {
        this.show();
    };
    MDCTooltipFoundation.prototype.handleTooltipMouseLeave = function () {
        var _this = this;
        this.clearShowTimeout();
        this.hideTimeout = setTimeout(function () {
            _this.hide();
        }, this.hideDelayMs);
    };
    MDCTooltipFoundation.prototype.handleRichTooltipFocusOut = function (evt) {
        var anchorOrTooltipContainsRelatedTargetElement = evt.relatedTarget instanceof HTMLElement && (this.adapter.anchorContainsElement(evt.relatedTarget) || this.adapter.tooltipContainsElement(evt.relatedTarget));
        // If the focus is still within the anchor or the tooltip, do not hide the
        // tooltip.
        if (anchorOrTooltipContainsRelatedTargetElement) {
            return;
        }
        this.hide();
    };
    /**
     * On window resize or scroll, check the anchor position and size and
     * repostion tooltip if necessary.
     */
    MDCTooltipFoundation.prototype.handleWindowChangeEvent = function () {
        var _this = this;
        // Since scroll and resize events can fire at a high rate, we throttle
        // the potential re-positioning of tooltip component using
        // requestAnimationFrame.
        this.animFrame.request(AnimationKeys.POLL_ANCHOR, function () {
            _this.repositionTooltipOnAnchorMove();
        });
    };
    MDCTooltipFoundation.prototype.show = function () {
        var e_1, _a;
        var _this = this;
        this.clearHideTimeout();
        this.clearShowTimeout();
        if (this.tooltipShown) {
            return;
        }
        this.tooltipShown = true;
        var showTooltipOptions = this.parseShowTooltipOptions();
        if (!showTooltipOptions.hideFromScreenreader) {
            this.adapter.setAttribute('aria-hidden', 'false');
        }
        if (this.richTooltip) {
            if (this.interactiveTooltip) {
                this.adapter.setAnchorAttribute('aria-expanded', 'true');
            }
            this.adapter.registerEventHandler('focusout', this.richTooltipFocusOutHandler);
        }
        if (!this.persistentTooltip) {
            this.adapter.registerEventHandler('mouseenter', this.tooltipMouseEnterHandler);
            this.adapter.registerEventHandler('mouseleave', this.tooltipMouseLeaveHandler);
        }
        this.adapter.removeClass(HIDE);
        this.adapter.addClass(SHOWING);
        if (this.isTooltipMultiline() && !this.richTooltip) {
            this.adapter.addClass(MULTILINE_TOOLTIP);
        }
        this.anchorRect = this.adapter.getAnchorBoundingRect();
        this.parentRect = this.adapter.getParentBoundingRect();
        this.richTooltip ? this.positionRichTooltip() : this.positionPlainTooltip();
        this.adapter.registerAnchorEventHandler('blur', this.anchorBlurHandler);
        this.adapter.registerDocumentEventHandler('click', this.documentClickHandler);
        this.adapter.registerDocumentEventHandler('keydown', this.documentKeydownHandler);
        this.adapter.registerWindowEventHandler('scroll', this.windowScrollHandler);
        this.adapter.registerWindowEventHandler('resize', this.windowResizeHandler);
        try {
            // Register any additional scroll handlers
            for (var _b = __values(this.addAncestorScrollEventListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fn = _c.value;
                fn();
            }
        } catch (e_1_1) {
            e_1 = { error: e_1_1 };
        } finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
        this.frameId = requestAnimationFrame(function () {
            _this.clearAllAnimationClasses();
            _this.adapter.addClass(SHOWN);
            _this.adapter.addClass(SHOWING_TRANSITION);
        });
    };
    MDCTooltipFoundation.prototype.hide = function () {
        var e_2, _a;
        this.clearHideTimeout();
        this.clearShowTimeout();
        if (!this.tooltipShown) {
            return;
        }
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
        this.tooltipShown = false;
        this.adapter.setAttribute('aria-hidden', 'true');
        this.adapter.deregisterEventHandler('focusout', this.richTooltipFocusOutHandler);
        if (this.richTooltip) {
            if (this.interactiveTooltip) {
                this.adapter.setAnchorAttribute('aria-expanded', 'false');
            }
        }
        if (!this.persistentTooltip) {
            this.adapter.deregisterEventHandler('mouseenter', this.tooltipMouseEnterHandler);
            this.adapter.deregisterEventHandler('mouseleave', this.tooltipMouseLeaveHandler);
        }
        this.clearAllAnimationClasses();
        this.adapter.addClass(HIDE);
        this.adapter.addClass(HIDE_TRANSITION);
        this.adapter.removeClass(SHOWN);
        this.adapter.deregisterAnchorEventHandler('blur', this.anchorBlurHandler);
        this.adapter.deregisterDocumentEventHandler('click', this.documentClickHandler);
        this.adapter.deregisterDocumentEventHandler('keydown', this.documentKeydownHandler);
        this.adapter.deregisterWindowEventHandler('scroll', this.windowScrollHandler);
        this.adapter.deregisterWindowEventHandler('resize', this.windowResizeHandler);
        this.adapter.deregisterWindowEventHandler('contextmenu', this.preventContextMenuOnLongTouch);
        try {
            // Deregister any additional scroll handlers
            for (var _b = __values(this.removeAncestorScrollEventListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fn = _c.value;
                fn();
            }
        } catch (e_2_1) {
            e_2 = { error: e_2_1 };
        } finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
                if (e_2) throw e_2.error;
            }
        }
    };
    MDCTooltipFoundation.prototype.handleTransitionEnd = function () {
        var isHidingTooltip = this.adapter.hasClass(HIDE);
        this.adapter.removeClass(SHOWING);
        this.adapter.removeClass(SHOWING_TRANSITION);
        this.adapter.removeClass(HIDE);
        this.adapter.removeClass(HIDE_TRANSITION);
        // If handleTransitionEnd is called after hiding the tooltip, the tooltip
        // will have the HIDE class (before calling the adapter removeClass method).
        // If tooltip is now hidden, send a notification that the animation has
        // completed and the tooltip is no longer visible.
        if (isHidingTooltip) {
            this.adapter.notifyHidden();
        }
    };
    MDCTooltipFoundation.prototype.clearAllAnimationClasses = function () {
        this.adapter.removeClass(SHOWING_TRANSITION);
        this.adapter.removeClass(HIDE_TRANSITION);
    };
    MDCTooltipFoundation.prototype.setTooltipPosition = function (position) {
        var xPos = position.xPos,
            yPos = position.yPos,
            withCaretPos = position.withCaretPos;
        if (this.hasCaret && withCaretPos) {
            this.tooltipPositionWithCaret = withCaretPos;
            return;
        }
        if (xPos) {
            this.xTooltipPos = xPos;
        }
        if (yPos) {
            this.yTooltipPos = yPos;
        }
    };
    MDCTooltipFoundation.prototype.setAnchorBoundaryType = function (type) {
        if (type === constants_1.AnchorBoundaryType.UNBOUNDED) {
            this.anchorGap = constants_1.numbers.UNBOUNDED_ANCHOR_GAP;
        } else {
            this.anchorGap = constants_1.numbers.BOUNDED_ANCHOR_GAP;
        }
    };
    MDCTooltipFoundation.prototype.setShowDelay = function (delayMs) {
        this.showDelayMs = delayMs;
    };
    MDCTooltipFoundation.prototype.setHideDelay = function (delayMs) {
        this.hideDelayMs = delayMs;
    };
    MDCTooltipFoundation.prototype.parseShowTooltipOptions = function () {
        var hideFromScreenreader = Boolean(this.adapter.getAnchorAttribute('data-tooltip-id'));
        return { hideFromScreenreader: hideFromScreenreader };
    };
    MDCTooltipFoundation.prototype.isTooltipMultiline = function () {
        var tooltipSize = this.adapter.getTooltipSize();
        return tooltipSize.height > constants_1.numbers.MIN_HEIGHT && tooltipSize.width >= constants_1.numbers.MAX_WIDTH;
    };
    MDCTooltipFoundation.prototype.positionPlainTooltip = function () {
        // A plain tooltip has `fixed` positioning and is placed as an immediate
        // child of the document body. Its positioning is calculated with respect to
        // the viewport.
        var _a = this.calculateTooltipStyles(this.anchorRect),
            top = _a.top,
            yTransformOrigin = _a.yTransformOrigin,
            left = _a.left,
            xTransformOrigin = _a.xTransformOrigin;
        var transformProperty = HAS_WINDOW ? util_1.getCorrectPropertyName(window, 'transform') : 'transform';
        this.adapter.setSurfaceAnimationStyleProperty(transformProperty + "-origin", xTransformOrigin + " " + yTransformOrigin);
        this.adapter.setStyleProperty('top', top + "px");
        this.adapter.setStyleProperty('left', left + "px");
    };
    MDCTooltipFoundation.prototype.positionRichTooltip = function () {
        // TODO(b/177686782): Remove width setting when max-content is used to style
        // the rich tooltip.
        var _a, _b, _c, _d;
        // getComputedStyleProperty is used instead of getTooltipSize since
        // getTooltipSize returns the offSetWidth, which includes the border and
        // padding. What we need is the width of the tooltip without border and
        // padding.
        var width = this.adapter.getComputedStyleProperty('width');
        // When rich tooltips are positioned within their parent containers, the
        // tooltip width might be shrunk if it collides with the edge of the parent
        // container. We set the width of the tooltip to prevent this.
        this.adapter.setStyleProperty('width', width);
        var _e = this.hasCaret ? this.calculateTooltipWithCaretStyles(this.anchorRect) : this.calculateTooltipStyles(this.anchorRect),
            top = _e.top,
            yTransformOrigin = _e.yTransformOrigin,
            left = _e.left,
            xTransformOrigin = _e.xTransformOrigin;
        var transformProperty = HAS_WINDOW ? util_1.getCorrectPropertyName(window, 'transform') : 'transform';
        this.adapter.setSurfaceAnimationStyleProperty(transformProperty + "-origin", xTransformOrigin + " " + yTransformOrigin);
        // A rich tooltip has `absolute` positioning and is placed as a sibling to
        // the anchor element. Its positioning is calculated with respect to the
        // parent element, and so the values need to be adjusted against the parent
        // element.
        var leftAdjustment = left - ((_b = (_a = this.parentRect) === null || _a === void 0 ? void 0 : _a.left) !== null && _b !== void 0 ? _b : 0);
        var topAdjustment = top - ((_d = (_c = this.parentRect) === null || _c === void 0 ? void 0 : _c.top) !== null && _d !== void 0 ? _d : 0);
        this.adapter.setStyleProperty('top', topAdjustment + "px");
        this.adapter.setStyleProperty('left', leftAdjustment + "px");
    };
    /**
     * Calculates the position of the tooltip. A tooltip will be placed beneath
     * the anchor element and aligned either with the 'start'/'end' edge of the
     * anchor element or the 'center'.
     *
     * Tooltip alignment is selected such that the tooltip maintains a threshold
     * distance away from the viewport (defaulting to 'center' alignment). If the
     * placement of the anchor prevents this threshold distance from being
     * maintained, the tooltip is positioned so that it does not collide with the
     * viewport.
     *
     * Users can specify an alignment, however, if this alignment results in the
     * tooltip colliding with the viewport, this specification is overwritten.
     */
    MDCTooltipFoundation.prototype.calculateTooltipStyles = function (anchorRect) {
        if (!anchorRect) {
            return { top: 0, left: 0 };
        }
        var tooltipSize = this.adapter.getTooltipSize();
        var top = this.calculateYTooltipDistance(anchorRect, tooltipSize.height);
        var left = this.calculateXTooltipDistance(anchorRect, tooltipSize.width);
        return {
            top: top.distance,
            yTransformOrigin: top.yTransformOrigin,
            left: left.distance,
            xTransformOrigin: left.xTransformOrigin
        };
    };
    /**
     * Calculates the `left` distance for the tooltip.
     * Returns the distance value and a string indicating the x-axis transform-
     * origin that should be used when animating the tooltip.
     */
    MDCTooltipFoundation.prototype.calculateXTooltipDistance = function (anchorRect, tooltipWidth) {
        var isLTR = !this.adapter.isRTL();
        var startPos, endPos, centerPos;
        var startTransformOrigin, endTransformOrigin;
        if (this.richTooltip) {
            startPos = isLTR ? anchorRect.left - tooltipWidth : anchorRect.right;
            endPos = isLTR ? anchorRect.right : anchorRect.left - tooltipWidth;
            startTransformOrigin = isLTR ? constants_1.strings.RIGHT : constants_1.strings.LEFT;
            endTransformOrigin = isLTR ? constants_1.strings.LEFT : constants_1.strings.RIGHT;
        } else {
            startPos = isLTR ? anchorRect.left : anchorRect.right - tooltipWidth;
            endPos = isLTR ? anchorRect.right - tooltipWidth : anchorRect.left;
            centerPos = anchorRect.left + (anchorRect.width - tooltipWidth) / 2;
            startTransformOrigin = isLTR ? constants_1.strings.LEFT : constants_1.strings.RIGHT;
            endTransformOrigin = isLTR ? constants_1.strings.RIGHT : constants_1.strings.LEFT;
        }
        var positionOptions = this.richTooltip ? this.determineValidPositionOptions(startPos, endPos) :
        // For plain tooltips, centerPos is defined
        this.determineValidPositionOptions(centerPos, startPos, endPos);
        if (this.xTooltipPos === constants_1.XPosition.START && positionOptions.has(startPos)) {
            return { distance: startPos, xTransformOrigin: startTransformOrigin };
        }
        if (this.xTooltipPos === constants_1.XPosition.END && positionOptions.has(endPos)) {
            return { distance: endPos, xTransformOrigin: endTransformOrigin };
        }
        if (this.xTooltipPos === constants_1.XPosition.CENTER && positionOptions.has(centerPos)) {
            // This code path is only executed if calculating the distance for plain
            // tooltips. In this instance, centerPos will always be defined, so we can
            // safely assert that the returned value is non-null/undefined.
            return { distance: centerPos, xTransformOrigin: constants_1.strings.CENTER };
        }
        // If no user position is supplied, rich tooltips default to end pos, then
        // start position. Plain tooltips default to center, start, then end.
        var possiblePositions = this.richTooltip ? [{ distance: endPos, xTransformOrigin: endTransformOrigin }, { distance: startPos, xTransformOrigin: startTransformOrigin }] : [{ distance: centerPos, xTransformOrigin: constants_1.strings.CENTER }, { distance: startPos, xTransformOrigin: startTransformOrigin }, { distance: endPos, xTransformOrigin: endTransformOrigin }];
        var validPosition = possiblePositions.find(function (_a) {
            var distance = _a.distance;
            return positionOptions.has(distance);
        });
        if (validPosition) {
            return validPosition;
        }
        // Indicates that all potential positions would result in the tooltip
        // colliding with the viewport. This would only occur when the anchor
        // element itself collides with the viewport, or the viewport is very
        // narrow. In this case, we allow the tooltip to be mis-aligned from the
        // anchor element.
        if (anchorRect.left < 0) {
            return {
                distance: this.minViewportTooltipThreshold,
                xTransformOrigin: constants_1.strings.LEFT
            };
        } else {
            var viewportWidth = this.adapter.getViewportWidth();
            var distance = viewportWidth - (tooltipWidth + this.minViewportTooltipThreshold);
            return { distance: distance, xTransformOrigin: constants_1.strings.RIGHT };
        }
    };
    /**
     * Given the values for the horizontal alignments of the tooltip, calculates
     * which of these options would result in the tooltip maintaining the required
     * threshold distance vs which would result in the tooltip staying within the
     * viewport.
     *
     * A Set of values is returned holding the distances that would honor the
     * above requirements. Following the logic for determining the tooltip
     * position, if all alignments violate the threshold, then the returned Set
     * contains values that keep the tooltip within the viewport.
     */
    MDCTooltipFoundation.prototype.determineValidPositionOptions = function () {
        var e_3, _a;
        var positions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            positions[_i] = arguments[_i];
        }
        var posWithinThreshold = new Set();
        var posWithinViewport = new Set();
        try {
            for (var positions_1 = __values(positions), positions_1_1 = positions_1.next(); !positions_1_1.done; positions_1_1 = positions_1.next()) {
                var position = positions_1_1.value;
                if (this.positionHonorsViewportThreshold(position)) {
                    posWithinThreshold.add(position);
                } else if (this.positionDoesntCollideWithViewport(position)) {
                    posWithinViewport.add(position);
                }
            }
        } catch (e_3_1) {
            e_3 = { error: e_3_1 };
        } finally {
            try {
                if (positions_1_1 && !positions_1_1.done && (_a = positions_1.return)) _a.call(positions_1);
            } finally {
                if (e_3) throw e_3.error;
            }
        }
        return posWithinThreshold.size ? posWithinThreshold : posWithinViewport;
    };
    MDCTooltipFoundation.prototype.positionHonorsViewportThreshold = function (leftPos) {
        var viewportWidth = this.adapter.getViewportWidth();
        var tooltipWidth = this.adapter.getTooltipSize().width;
        return leftPos + tooltipWidth <= viewportWidth - this.minViewportTooltipThreshold && leftPos >= this.minViewportTooltipThreshold;
    };
    MDCTooltipFoundation.prototype.positionDoesntCollideWithViewport = function (leftPos) {
        var viewportWidth = this.adapter.getViewportWidth();
        var tooltipWidth = this.adapter.getTooltipSize().width;
        return leftPos + tooltipWidth <= viewportWidth && leftPos >= 0;
    };
    /**
     * Calculates the `top` distance for the tooltip.
     * Returns the distance value and a string indicating the y-axis transform-
     * origin that should be used when animating the tooltip.
     */
    MDCTooltipFoundation.prototype.calculateYTooltipDistance = function (anchorRect, tooltipHeight) {
        var belowYPos = anchorRect.bottom + this.anchorGap;
        var aboveYPos = anchorRect.top - (this.anchorGap + tooltipHeight);
        var yPositionOptions = this.determineValidYPositionOptions(aboveYPos, belowYPos);
        if (this.yTooltipPos === constants_1.YPosition.ABOVE && yPositionOptions.has(aboveYPos)) {
            return { distance: aboveYPos, yTransformOrigin: constants_1.strings.BOTTOM };
        } else if (this.yTooltipPos === constants_1.YPosition.BELOW && yPositionOptions.has(belowYPos)) {
            return { distance: belowYPos, yTransformOrigin: constants_1.strings.TOP };
        }
        if (yPositionOptions.has(belowYPos)) {
            return { distance: belowYPos, yTransformOrigin: constants_1.strings.TOP };
        }
        if (yPositionOptions.has(aboveYPos)) {
            return { distance: aboveYPos, yTransformOrigin: constants_1.strings.BOTTOM };
        }
        // Indicates that all potential positions would result in the tooltip
        // colliding with the viewport. This would only occur when the viewport is
        // very short.
        return { distance: belowYPos, yTransformOrigin: constants_1.strings.TOP };
    };
    /**
     * Given the values for above/below alignment of the tooltip, calculates
     * which of these options would result in the tooltip maintaining the required
     * threshold distance vs which would result in the tooltip staying within the
     * viewport.
     *
     * A Set of values is returned holding the distances that would honor the
     * above requirements. Following the logic for determining the tooltip
     * position, if all possible alignments violate the threshold, then the
     * returned Set contains values that keep the tooltip within the viewport.
     */
    MDCTooltipFoundation.prototype.determineValidYPositionOptions = function (aboveAnchorPos, belowAnchorPos) {
        var posWithinThreshold = new Set();
        var posWithinViewport = new Set();
        if (this.yPositionHonorsViewportThreshold(aboveAnchorPos)) {
            posWithinThreshold.add(aboveAnchorPos);
        } else if (this.yPositionDoesntCollideWithViewport(aboveAnchorPos)) {
            posWithinViewport.add(aboveAnchorPos);
        }
        if (this.yPositionHonorsViewportThreshold(belowAnchorPos)) {
            posWithinThreshold.add(belowAnchorPos);
        } else if (this.yPositionDoesntCollideWithViewport(belowAnchorPos)) {
            posWithinViewport.add(belowAnchorPos);
        }
        return posWithinThreshold.size ? posWithinThreshold : posWithinViewport;
    };
    MDCTooltipFoundation.prototype.yPositionHonorsViewportThreshold = function (yPos) {
        var viewportHeight = this.adapter.getViewportHeight();
        var tooltipHeight = this.adapter.getTooltipSize().height;
        return yPos + tooltipHeight + this.minViewportTooltipThreshold <= viewportHeight && yPos >= this.minViewportTooltipThreshold;
    };
    MDCTooltipFoundation.prototype.yPositionDoesntCollideWithViewport = function (yPos) {
        var viewportHeight = this.adapter.getViewportHeight();
        var tooltipHeight = this.adapter.getTooltipSize().height;
        return yPos + tooltipHeight <= viewportHeight && yPos >= 0;
    };
    MDCTooltipFoundation.prototype.calculateTooltipWithCaretStyles = function (anchorRect) {
        // Prior to grabbing the caret bounding rect, we clear all styles set on the
        // caret. This will ensure the width/height is consistent (since we rotate
        // the caret 90deg in some positions which would result in the height and
        // width bounding rect measurements flipping).
        this.adapter.clearTooltipCaretStyles();
        var caretSize = this.adapter.getTooltipCaretBoundingRect();
        if (!anchorRect || !caretSize) {
            return { position: constants_1.PositionWithCaret.DETECTED, top: 0, left: 0 };
        }
        // The caret for the rich tooltip is created by rotating/skewing/scaling
        // square div into a diamond shape and then hiding half of it so it looks
        // like a triangle. We use the boundingClientRect to calculate the
        // width/height of the element after the transforms (to the caret) have been
        // applied. Since the full tooltip is scaled by 0.8 for the entrance
        // animation, we divide by this value to retrieve the actual caret
        // dimensions.
        var caretWidth = caretSize.width / constants_1.numbers.ANIMATION_SCALE;
        // Since we hide half of caret, we divide the returned ClientRect height
        // by 2.
        var caretHeight = caretSize.height / constants_1.numbers.ANIMATION_SCALE / 2;
        var tooltipSize = this.adapter.getTooltipSize();
        var yOptions = this.calculateYWithCaretDistanceOptions(anchorRect, tooltipSize.height, { caretWidth: caretWidth, caretHeight: caretHeight });
        var xOptions = this.calculateXWithCaretDistanceOptions(anchorRect, tooltipSize.width, { caretWidth: caretWidth, caretHeight: caretHeight });
        var positionOptions = this.validateTooltipWithCaretDistances(yOptions, xOptions);
        if (positionOptions.size < 1) {
            positionOptions = this.generateBackupPositionOption(anchorRect, tooltipSize, { caretWidth: caretWidth, caretHeight: caretHeight });
        }
        var _a = this.determineTooltipWithCaretDistance(positionOptions),
            position = _a.position,
            xDistance = _a.xDistance,
            yDistance = _a.yDistance;
        // After determining the position of the tooltip relative to the anchor,
        // place the caret in the corresponding position and retrieve the necessary
        // x/y transform origins needed to properly animate the tooltip entrance.
        var _b = this.setCaretPositionStyles(position, { caretWidth: caretWidth, caretHeight: caretHeight }),
            yTransformOrigin = _b.yTransformOrigin,
            xTransformOrigin = _b.xTransformOrigin;
        return {
            yTransformOrigin: yTransformOrigin,
            xTransformOrigin: xTransformOrigin,
            top: yDistance,
            left: xDistance
        };
    };
    MDCTooltipFoundation.prototype.calculateXWithCaretDistanceOptions = function (anchorRect, tooltipWidth, caretSize) {
        var caretWidth = caretSize.caretWidth,
            caretHeight = caretSize.caretHeight;
        var isLTR = !this.adapter.isRTL();
        var anchorMidpoint = anchorRect.left + anchorRect.width / 2;
        var sideLeftAligned = anchorRect.left - (tooltipWidth + this.anchorGap + caretHeight);
        var sideRightAligned = anchorRect.right + this.anchorGap + caretHeight;
        var sideStartPos = isLTR ? sideLeftAligned : sideRightAligned;
        var sideEndPos = isLTR ? sideRightAligned : sideLeftAligned;
        var verticalLeftAligned = anchorMidpoint - (constants_1.numbers.CARET_INDENTATION + caretWidth / 2);
        var verticalRightAligned = anchorMidpoint - (tooltipWidth - constants_1.numbers.CARET_INDENTATION - caretWidth / 2);
        var verticalStartPos = isLTR ? verticalLeftAligned : verticalRightAligned;
        var verticalEndPos = isLTR ? verticalRightAligned : verticalLeftAligned;
        var verticalCenterPos = anchorMidpoint - tooltipWidth / 2;
        var possiblePositionsMap = new Map([[constants_1.XPositionWithCaret.START, verticalStartPos], [constants_1.XPositionWithCaret.CENTER, verticalCenterPos], [constants_1.XPositionWithCaret.END, verticalEndPos], [constants_1.XPositionWithCaret.SIDE_END, sideEndPos], [constants_1.XPositionWithCaret.SIDE_START, sideStartPos]]);
        return possiblePositionsMap;
    };
    MDCTooltipFoundation.prototype.calculateYWithCaretDistanceOptions = function (anchorRect, tooltipHeight, caretSize) {
        var caretWidth = caretSize.caretWidth,
            caretHeight = caretSize.caretHeight;
        var anchorMidpoint = anchorRect.top + anchorRect.height / 2;
        var belowYPos = anchorRect.bottom + this.anchorGap + caretHeight;
        var aboveYPos = anchorRect.top - (this.anchorGap + tooltipHeight + caretHeight);
        var sideTopYPos = anchorMidpoint - (constants_1.numbers.CARET_INDENTATION + caretWidth / 2);
        var sideCenterYPos = anchorMidpoint - tooltipHeight / 2;
        var sideBottomYPos = anchorMidpoint - (tooltipHeight - constants_1.numbers.CARET_INDENTATION - caretWidth / 2);
        var possiblePositionsMap = new Map([[constants_1.YPositionWithCaret.ABOVE, aboveYPos], [constants_1.YPositionWithCaret.BELOW, belowYPos], [constants_1.YPositionWithCaret.SIDE_TOP, sideTopYPos], [constants_1.YPositionWithCaret.SIDE_CENTER, sideCenterYPos], [constants_1.YPositionWithCaret.SIDE_BOTTOM, sideBottomYPos]]);
        return possiblePositionsMap;
    };
    MDCTooltipFoundation.prototype.repositionTooltipOnAnchorMove = function () {
        var newAnchorRect = this.adapter.getAnchorBoundingRect();
        if (!newAnchorRect || !this.anchorRect) return;
        if (newAnchorRect.top !== this.anchorRect.top || newAnchorRect.left !== this.anchorRect.left || newAnchorRect.height !== this.anchorRect.height || newAnchorRect.width !== this.anchorRect.width) {
            this.anchorRect = newAnchorRect;
            this.parentRect = this.adapter.getParentBoundingRect();
            this.richTooltip ? this.positionRichTooltip() : this.positionPlainTooltip();
        }
    };
    /**
     * Given a list of x/y position options for a rich tooltip with caret, checks
     * if valid x/y combinations of these position options are either within the
     * viewport threshold, or simply within the viewport. Returns a map with the
     * valid x/y position combinations that all either honor the viewport
     * threshold or are simply inside within the viewport.
     */
    MDCTooltipFoundation.prototype.validateTooltipWithCaretDistances = function (yOptions, xOptions) {
        var e_4, _a, e_5, _b, e_6, _c;
        var posWithinThreshold = new Map();
        var posWithinViewport = new Map();
        // If a tooltip has a caret, not all combinations of YPositionWithCarets and
        // XPositionWithCarets are possible. Because of this we only check the
        // validity of a given XPositionWithCaret if a potential corresponding
        // YPositionWithCaret is valid.
        var validMappings = new Map([[constants_1.YPositionWithCaret.ABOVE, [constants_1.XPositionWithCaret.START, constants_1.XPositionWithCaret.CENTER, constants_1.XPositionWithCaret.END]], [constants_1.YPositionWithCaret.BELOW, [constants_1.XPositionWithCaret.START, constants_1.XPositionWithCaret.CENTER, constants_1.XPositionWithCaret.END]], [constants_1.YPositionWithCaret.SIDE_TOP, [constants_1.XPositionWithCaret.SIDE_START, constants_1.XPositionWithCaret.SIDE_END]], [constants_1.YPositionWithCaret.SIDE_CENTER, [constants_1.XPositionWithCaret.SIDE_START, constants_1.XPositionWithCaret.SIDE_END]], [constants_1.YPositionWithCaret.SIDE_BOTTOM, [constants_1.XPositionWithCaret.SIDE_START, constants_1.XPositionWithCaret.SIDE_END]]]);
        try {
            for (var _d = __values(validMappings.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var y = _e.value;
                var yDistance = yOptions.get(y);
                if (this.yPositionHonorsViewportThreshold(yDistance)) {
                    try {
                        for (var _f = (e_5 = void 0, __values(validMappings.get(y))), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var x = _g.value;
                            var xDistance = xOptions.get(x);
                            if (this.positionHonorsViewportThreshold(xDistance)) {
                                var caretPositionName = this.caretPositionOptionsMapping(x, y);
                                posWithinThreshold.set(caretPositionName, { xDistance: xDistance, yDistance: yDistance });
                            }
                        }
                    } catch (e_5_1) {
                        e_5 = { error: e_5_1 };
                    } finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        } finally {
                            if (e_5) throw e_5.error;
                        }
                    }
                } else if (this.yPositionDoesntCollideWithViewport(yDistance)) {
                    try {
                        for (var _h = (e_6 = void 0, __values(validMappings.get(y))), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var x = _j.value;
                            var xDistance = xOptions.get(x);
                            if (this.positionDoesntCollideWithViewport(xDistance)) {
                                var caretPositionName = this.caretPositionOptionsMapping(x, y);
                                posWithinViewport.set(caretPositionName, { xDistance: xDistance, yDistance: yDistance });
                            }
                        }
                    } catch (e_6_1) {
                        e_6 = { error: e_6_1 };
                    } finally {
                        try {
                            if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                        } finally {
                            if (e_6) throw e_6.error;
                        }
                    }
                }
            }
        } catch (e_4_1) {
            e_4 = { error: e_4_1 };
        } finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            } finally {
                if (e_4) throw e_4.error;
            }
        }
        return posWithinThreshold.size ? posWithinThreshold : posWithinViewport;
    };
    /**
     * Method for generating a horizontal and vertical position for the tooltip if
     * all other calculated values are considered invalid. This would only happen
     * in situations of very small viewports/large tooltips.
     */
    MDCTooltipFoundation.prototype.generateBackupPositionOption = function (anchorRect, tooltipSize, caretSize) {
        var isLTR = !this.adapter.isRTL();
        var xDistance;
        var xPos;
        if (anchorRect.left < 0) {
            xDistance = this.minViewportTooltipThreshold + caretSize.caretHeight;
            xPos = isLTR ? constants_1.XPositionWithCaret.END : constants_1.XPositionWithCaret.START;
        } else {
            var viewportWidth = this.adapter.getViewportWidth();
            xDistance = viewportWidth - (tooltipSize.width + this.minViewportTooltipThreshold + caretSize.caretHeight);
            xPos = isLTR ? constants_1.XPositionWithCaret.START : constants_1.XPositionWithCaret.END;
        }
        var yDistance;
        var yPos;
        if (anchorRect.top < 0) {
            yDistance = this.minViewportTooltipThreshold + caretSize.caretHeight;
            yPos = constants_1.YPositionWithCaret.BELOW;
        } else {
            var viewportHeight = this.adapter.getViewportHeight();
            yDistance = viewportHeight - (tooltipSize.height + this.minViewportTooltipThreshold + caretSize.caretHeight);
            yPos = constants_1.YPositionWithCaret.ABOVE;
        }
        var caretPositionName = this.caretPositionOptionsMapping(xPos, yPos);
        return new Map([[caretPositionName, { xDistance: xDistance, yDistance: yDistance }]]);
    };
    /**
     * Given a list of valid position options for a rich tooltip with caret,
     * returns the option that should be used.
     */
    MDCTooltipFoundation.prototype.determineTooltipWithCaretDistance = function (options) {
        if (options.has(this.tooltipPositionWithCaret)) {
            var tooltipPos = options.get(this.tooltipPositionWithCaret);
            return {
                position: this.tooltipPositionWithCaret,
                xDistance: tooltipPos.xDistance,
                yDistance: tooltipPos.yDistance
            };
        }
        var orderPref = [constants_1.PositionWithCaret.ABOVE_START, constants_1.PositionWithCaret.ABOVE_CENTER, constants_1.PositionWithCaret.ABOVE_END, constants_1.PositionWithCaret.TOP_SIDE_START, constants_1.PositionWithCaret.CENTER_SIDE_START, constants_1.PositionWithCaret.BOTTOM_SIDE_START, constants_1.PositionWithCaret.TOP_SIDE_END, constants_1.PositionWithCaret.CENTER_SIDE_END, constants_1.PositionWithCaret.BOTTOM_SIDE_END, constants_1.PositionWithCaret.BELOW_START, constants_1.PositionWithCaret.BELOW_CENTER, constants_1.PositionWithCaret.BELOW_END];
        // Before calling this method we check whether or not the "options" param
        // is empty and invoke a different method. We, therefore, can be certain
        // that "validPosition" will always be defined.
        var validPosition = orderPref.find(function (pos) {
            return options.has(pos);
        });
        var pos = options.get(validPosition);
        return {
            position: validPosition,
            xDistance: pos.xDistance,
            yDistance: pos.yDistance
        };
    };
    /**
     * Returns the corresponding PositionWithCaret enum for the proivded
     * XPositionWithCaret and YPositionWithCaret enums. This mapping exists so our
     * public API accepts only PositionWithCaret enums (as all combinations of
     * XPositionWithCaret and YPositionWithCaret are not valid), but internally we
     * can calculate the X and Y positions of a rich tooltip with caret
     * separately.
     */
    MDCTooltipFoundation.prototype.caretPositionOptionsMapping = function (xPos, yPos) {
        switch (yPos) {
            case constants_1.YPositionWithCaret.ABOVE:
                if (xPos === constants_1.XPositionWithCaret.START) {
                    return constants_1.PositionWithCaret.ABOVE_START;
                } else if (xPos === constants_1.XPositionWithCaret.CENTER) {
                    return constants_1.PositionWithCaret.ABOVE_CENTER;
                } else if (xPos === constants_1.XPositionWithCaret.END) {
                    return constants_1.PositionWithCaret.ABOVE_END;
                }
                break;
            case constants_1.YPositionWithCaret.BELOW:
                if (xPos === constants_1.XPositionWithCaret.START) {
                    return constants_1.PositionWithCaret.BELOW_START;
                } else if (xPos === constants_1.XPositionWithCaret.CENTER) {
                    return constants_1.PositionWithCaret.BELOW_CENTER;
                } else if (xPos === constants_1.XPositionWithCaret.END) {
                    return constants_1.PositionWithCaret.BELOW_END;
                }
                break;
            case constants_1.YPositionWithCaret.SIDE_TOP:
                if (xPos === constants_1.XPositionWithCaret.SIDE_START) {
                    return constants_1.PositionWithCaret.TOP_SIDE_START;
                } else if (xPos === constants_1.XPositionWithCaret.SIDE_END) {
                    return constants_1.PositionWithCaret.TOP_SIDE_END;
                }
                break;
            case constants_1.YPositionWithCaret.SIDE_CENTER:
                if (xPos === constants_1.XPositionWithCaret.SIDE_START) {
                    return constants_1.PositionWithCaret.CENTER_SIDE_START;
                } else if (xPos === constants_1.XPositionWithCaret.SIDE_END) {
                    return constants_1.PositionWithCaret.CENTER_SIDE_END;
                }
                break;
            case constants_1.YPositionWithCaret.SIDE_BOTTOM:
                if (xPos === constants_1.XPositionWithCaret.SIDE_START) {
                    return constants_1.PositionWithCaret.BOTTOM_SIDE_START;
                } else if (xPos === constants_1.XPositionWithCaret.SIDE_END) {
                    return constants_1.PositionWithCaret.BOTTOM_SIDE_END;
                }
                break;
            default:
                break;
        }
        throw new Error("MDCTooltipFoundation: Invalid caret position of " + xPos + ", " + yPos);
    };
    /**
     * Given a PositionWithCaret, applies the correct styles to the caret element
     * so that it is positioned properly on the rich tooltip.
     * Returns the x and y positions of the caret, to be used as the
     * transform-origin on the tooltip itself for entrance animations.
     */
    MDCTooltipFoundation.prototype.setCaretPositionStyles = function (position, caretSize) {
        var values = this.calculateCaretPositionOnTooltip(position, caretSize);
        if (!values) {
            return { yTransformOrigin: 0, xTransformOrigin: 0 };
        }
        // Prior to setting the caret position styles, clear any previous styles
        // set. This is necessary as all position options do not use the same
        // properties (e.g. using 'left' or 'right') and so old style properties
        // might not get overridden, causing misplaced carets.
        this.adapter.clearTooltipCaretStyles();
        this.adapter.setTooltipCaretStyle(values.yAlignment, values.yAxisPx);
        this.adapter.setTooltipCaretStyle(values.xAlignment, values.xAxisPx);
        // Value of scaleX is cos(skew), Math.cos() expects radians though, so we
        // must first convert the skew value (which is in degrees) to radians.
        var skewRadians = values.skew * (Math.PI / 180);
        var scaleX = Math.cos(skewRadians);
        this.adapter.setTooltipCaretStyle('transform', "rotate(" + values.rotation + "deg) skewY(" + values.skew + "deg) scaleX(" + scaleX + ")");
        this.adapter.setTooltipCaretStyle('transform-origin', values.xAlignment + " " + values.yAlignment);
        return {
            yTransformOrigin: values.yTransformOrigin,
            xTransformOrigin: values.xTransformOrigin
        };
    };
    /**
     * Given a PositionWithCaret, determines the correct styles to position the
     * caret properly on the rich tooltip.
     */
    MDCTooltipFoundation.prototype.calculateCaretPositionOnTooltip = function (tooltipPos, caretSize) {
        var isLTR = !this.adapter.isRTL();
        var tooltipWidth = this.adapter.getComputedStyleProperty('width');
        var tooltipHeight = this.adapter.getComputedStyleProperty('height');
        if (!tooltipWidth || !tooltipHeight || !caretSize) {
            return;
        }
        var midpointWidth = "calc((" + tooltipWidth + " - " + caretSize.caretWidth + "px) / 2)";
        var midpointHeight = "calc((" + tooltipHeight + " - " + caretSize.caretWidth + "px) / 2)";
        var flushWithEdge = '0';
        var indentedFromEdge = constants_1.numbers.CARET_INDENTATION + "px";
        var indentedFromWidth = "calc(" + tooltipWidth + " - " + indentedFromEdge + ")";
        var indentedFromHeight = "calc(" + tooltipHeight + " - " + indentedFromEdge + ")";
        var verticalRotation = 35;
        var horizontalRotation = Math.abs(90 - verticalRotation);
        var skewDeg = 20;
        switch (tooltipPos) {
            case constants_1.PositionWithCaret.BELOW_CENTER:
                return {
                    yAlignment: constants_1.strings.TOP,
                    xAlignment: constants_1.strings.LEFT,
                    yAxisPx: flushWithEdge,
                    xAxisPx: midpointWidth,
                    rotation: -1 * verticalRotation,
                    skew: -1 * skewDeg,
                    xTransformOrigin: midpointWidth,
                    yTransformOrigin: flushWithEdge
                };
            case constants_1.PositionWithCaret.BELOW_END:
                return {
                    yAlignment: constants_1.strings.TOP,
                    xAlignment: isLTR ? constants_1.strings.RIGHT : constants_1.strings.LEFT,
                    yAxisPx: flushWithEdge,
                    xAxisPx: indentedFromEdge,
                    rotation: isLTR ? verticalRotation : -1 * verticalRotation,
                    skew: isLTR ? skewDeg : -1 * skewDeg,
                    xTransformOrigin: isLTR ? indentedFromWidth : indentedFromEdge,
                    yTransformOrigin: flushWithEdge
                };
            case constants_1.PositionWithCaret.BELOW_START:
                return {
                    yAlignment: constants_1.strings.TOP,
                    xAlignment: isLTR ? constants_1.strings.LEFT : constants_1.strings.RIGHT,
                    yAxisPx: flushWithEdge,
                    xAxisPx: indentedFromEdge,
                    rotation: isLTR ? -1 * verticalRotation : verticalRotation,
                    skew: isLTR ? -1 * skewDeg : skewDeg,
                    xTransformOrigin: isLTR ? indentedFromEdge : indentedFromWidth,
                    yTransformOrigin: flushWithEdge
                };
            case constants_1.PositionWithCaret.TOP_SIDE_END:
                return {
                    yAlignment: constants_1.strings.TOP,
                    xAlignment: isLTR ? constants_1.strings.LEFT : constants_1.strings.RIGHT,
                    yAxisPx: indentedFromEdge,
                    xAxisPx: flushWithEdge,
                    rotation: isLTR ? horizontalRotation : -1 * horizontalRotation,
                    skew: isLTR ? -1 * skewDeg : skewDeg,
                    xTransformOrigin: isLTR ? flushWithEdge : tooltipWidth,
                    yTransformOrigin: indentedFromEdge
                };
            case constants_1.PositionWithCaret.CENTER_SIDE_END:
                return {
                    yAlignment: constants_1.strings.TOP,
                    xAlignment: isLTR ? constants_1.strings.LEFT : constants_1.strings.RIGHT,
                    yAxisPx: midpointHeight,
                    xAxisPx: flushWithEdge,
                    rotation: isLTR ? horizontalRotation : -1 * horizontalRotation,
                    skew: isLTR ? -1 * skewDeg : skewDeg,
                    xTransformOrigin: isLTR ? flushWithEdge : tooltipWidth,
                    yTransformOrigin: midpointHeight
                };
            case constants_1.PositionWithCaret.BOTTOM_SIDE_END:
                return {
                    yAlignment: constants_1.strings.BOTTOM,
                    xAlignment: isLTR ? constants_1.strings.LEFT : constants_1.strings.RIGHT,
                    yAxisPx: indentedFromEdge,
                    xAxisPx: flushWithEdge,
                    rotation: isLTR ? -1 * horizontalRotation : horizontalRotation,
                    skew: isLTR ? skewDeg : -1 * skewDeg,
                    xTransformOrigin: isLTR ? flushWithEdge : tooltipWidth,
                    yTransformOrigin: indentedFromHeight
                };
            case constants_1.PositionWithCaret.TOP_SIDE_START:
                return {
                    yAlignment: constants_1.strings.TOP,
                    xAlignment: isLTR ? constants_1.strings.RIGHT : constants_1.strings.LEFT,
                    yAxisPx: indentedFromEdge,
                    xAxisPx: flushWithEdge,
                    rotation: isLTR ? -1 * horizontalRotation : horizontalRotation,
                    skew: isLTR ? skewDeg : -1 * skewDeg,
                    xTransformOrigin: isLTR ? tooltipWidth : flushWithEdge,
                    yTransformOrigin: indentedFromEdge
                };
            case constants_1.PositionWithCaret.CENTER_SIDE_START:
                return {
                    yAlignment: constants_1.strings.TOP,
                    xAlignment: isLTR ? constants_1.strings.RIGHT : constants_1.strings.LEFT,
                    yAxisPx: midpointHeight,
                    xAxisPx: flushWithEdge,
                    rotation: isLTR ? -1 * horizontalRotation : horizontalRotation,
                    skew: isLTR ? skewDeg : -1 * skewDeg,
                    xTransformOrigin: isLTR ? tooltipWidth : flushWithEdge,
                    yTransformOrigin: midpointHeight
                };
            case constants_1.PositionWithCaret.BOTTOM_SIDE_START:
                return {
                    yAlignment: constants_1.strings.BOTTOM,
                    xAlignment: isLTR ? constants_1.strings.RIGHT : constants_1.strings.LEFT,
                    yAxisPx: indentedFromEdge,
                    xAxisPx: flushWithEdge,
                    rotation: isLTR ? horizontalRotation : -1 * horizontalRotation,
                    skew: isLTR ? -1 * skewDeg : skewDeg,
                    xTransformOrigin: isLTR ? tooltipWidth : flushWithEdge,
                    yTransformOrigin: indentedFromHeight
                };
            case constants_1.PositionWithCaret.ABOVE_CENTER:
                return {
                    yAlignment: constants_1.strings.BOTTOM,
                    xAlignment: constants_1.strings.LEFT,
                    yAxisPx: flushWithEdge,
                    xAxisPx: midpointWidth,
                    rotation: verticalRotation,
                    skew: skewDeg,
                    xTransformOrigin: midpointWidth,
                    yTransformOrigin: tooltipHeight
                };
            case constants_1.PositionWithCaret.ABOVE_END:
                return {
                    yAlignment: constants_1.strings.BOTTOM,
                    xAlignment: isLTR ? constants_1.strings.RIGHT : constants_1.strings.LEFT,
                    yAxisPx: flushWithEdge,
                    xAxisPx: indentedFromEdge,
                    rotation: isLTR ? -1 * verticalRotation : verticalRotation,
                    skew: isLTR ? -1 * skewDeg : skewDeg,
                    xTransformOrigin: isLTR ? indentedFromWidth : indentedFromEdge,
                    yTransformOrigin: tooltipHeight
                };
            default:
            case constants_1.PositionWithCaret.ABOVE_START:
                return {
                    yAlignment: constants_1.strings.BOTTOM,
                    xAlignment: isLTR ? constants_1.strings.LEFT : constants_1.strings.RIGHT,
                    yAxisPx: flushWithEdge,
                    xAxisPx: indentedFromEdge,
                    rotation: isLTR ? verticalRotation : -1 * verticalRotation,
                    skew: isLTR ? skewDeg : -1 * skewDeg,
                    xTransformOrigin: isLTR ? indentedFromEdge : indentedFromWidth,
                    yTransformOrigin: tooltipHeight
                };
        }
    };
    MDCTooltipFoundation.prototype.clearShowTimeout = function () {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    };
    MDCTooltipFoundation.prototype.clearHideTimeout = function () {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    };
    /**
     * Method that allows user to specify additional elements that should have a
     * scroll event listener attached to it. This should be used in instances
     * where the anchor element is placed inside a scrollable container, and will
     * ensure that the tooltip will stay attached to the anchor on scroll.
     */
    MDCTooltipFoundation.prototype.attachScrollHandler = function (addEventListenerFn) {
        var _this = this;
        this.addAncestorScrollEventListeners.push(function () {
            addEventListenerFn('scroll', _this.windowScrollHandler);
        });
    };
    /**
     * Must be used in conjunction with #attachScrollHandler. Removes the scroll
     * event handler from elements on the page.
     */
    MDCTooltipFoundation.prototype.removeScrollHandler = function (removeEventHandlerFn) {
        var _this = this;
        this.removeAncestorScrollEventListeners.push(function () {
            removeEventHandlerFn('scroll', _this.windowScrollHandler);
        });
    };
    MDCTooltipFoundation.prototype.destroy = function () {
        var e_7, _a;
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        this.clearHideTimeout();
        this.clearShowTimeout();
        this.adapter.removeClass(SHOWN);
        this.adapter.removeClass(SHOWING_TRANSITION);
        this.adapter.removeClass(SHOWING);
        this.adapter.removeClass(HIDE);
        this.adapter.removeClass(HIDE_TRANSITION);
        if (this.richTooltip) {
            this.adapter.deregisterEventHandler('focusout', this.richTooltipFocusOutHandler);
        }
        if (!this.persistentTooltip) {
            this.adapter.deregisterEventHandler('mouseenter', this.tooltipMouseEnterHandler);
            this.adapter.deregisterEventHandler('mouseleave', this.tooltipMouseLeaveHandler);
        }
        this.adapter.deregisterAnchorEventHandler('blur', this.anchorBlurHandler);
        this.adapter.deregisterDocumentEventHandler('click', this.documentClickHandler);
        this.adapter.deregisterDocumentEventHandler('keydown', this.documentKeydownHandler);
        this.adapter.deregisterWindowEventHandler('scroll', this.windowScrollHandler);
        this.adapter.deregisterWindowEventHandler('resize', this.windowResizeHandler);
        try {
            for (var _b = __values(this.removeAncestorScrollEventListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fn = _c.value;
                fn();
            }
        } catch (e_7_1) {
            e_7 = { error: e_7_1 };
        } finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
                if (e_7) throw e_7.error;
            }
        }
        this.animFrame.cancelAll();
    };
    return MDCTooltipFoundation;
}(foundation_1.MDCFoundation);
exports.MDCTooltipFoundation = MDCTooltipFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCTooltipFoundation;

/***/ }),

/***/ "./packages/mdc-tooltip/index.ts":
/*!***************************************!*\
  !*** ./packages/mdc-tooltip/index.ts ***!
  \***************************************/
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
__exportStar(__webpack_require__(/*! ./adapter */ "./packages/mdc-tooltip/adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./component */ "./packages/mdc-tooltip/component.ts"), exports);
__exportStar(__webpack_require__(/*! ./foundation */ "./packages/mdc-tooltip/foundation.ts"), exports);
__exportStar(__webpack_require__(/*! ./constants */ "./packages/mdc-tooltip/constants.ts"), exports);
__exportStar(__webpack_require__(/*! ./types */ "./packages/mdc-tooltip/types.ts"), exports);

/***/ }),

/***/ "./packages/mdc-tooltip/types.ts":
/*!***************************************!*\
  !*** ./packages/mdc-tooltip/types.ts ***!
  \***************************************/
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

/***/ })

/******/ });
});
//# sourceMappingURL=mdc.tooltip.js.map