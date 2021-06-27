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
		exports["tabScroller"] = factory();
	else
		root["mdc"] = root["mdc"] || {}, root["mdc"]["tabScroller"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/mdc-tab-scroller/index.ts");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./packages/mdc-tab-scroller/adapter.ts":
/*!**********************************************!*\
  !*** ./packages/mdc-tab-scroller/adapter.ts ***!
  \**********************************************/
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

/***/ "./packages/mdc-tab-scroller/component.ts":
/*!************************************************!*\
  !*** ./packages/mdc-tab-scroller/component.ts ***!
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
exports.MDCTabScroller = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var events_1 = __webpack_require__(/*! @material/dom/events */ "./packages/mdc-dom/events.ts");
var ponyfill_1 = __webpack_require__(/*! @material/dom/ponyfill */ "./packages/mdc-dom/ponyfill.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-tab-scroller/foundation.ts");
var util = __importStar(__webpack_require__(/*! ./util */ "./packages/mdc-tab-scroller/util.ts"));
var MDCTabScroller = /** @class */function (_super) {
    __extends(MDCTabScroller, _super);
    function MDCTabScroller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTabScroller.attachTo = function (root) {
        return new MDCTabScroller(root);
    };
    // initialSyncWithDOM()
    MDCTabScroller.prototype.initialize = function () {
        this.area = this.root.querySelector(foundation_1.MDCTabScrollerFoundation.strings.AREA_SELECTOR);
        this.content = this.root.querySelector(foundation_1.MDCTabScrollerFoundation.strings.CONTENT_SELECTOR);
    };
    MDCTabScroller.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.handleInteraction = function () {
            _this.foundation.handleInteraction();
        };
        this.handleTransitionEnd = function (evt) {
            _this.foundation.handleTransitionEnd(evt);
        };
        this.area.addEventListener('wheel', this.handleInteraction, events_1.applyPassive());
        this.area.addEventListener('touchstart', this.handleInteraction, events_1.applyPassive());
        this.area.addEventListener('pointerdown', this.handleInteraction, events_1.applyPassive());
        this.area.addEventListener('mousedown', this.handleInteraction, events_1.applyPassive());
        this.area.addEventListener('keydown', this.handleInteraction, events_1.applyPassive());
        this.content.addEventListener('transitionend', this.handleTransitionEnd);
    };
    MDCTabScroller.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.area.removeEventListener('wheel', this.handleInteraction, events_1.applyPassive());
        this.area.removeEventListener('touchstart', this.handleInteraction, events_1.applyPassive());
        this.area.removeEventListener('pointerdown', this.handleInteraction, events_1.applyPassive());
        this.area.removeEventListener('mousedown', this.handleInteraction, events_1.applyPassive());
        this.area.removeEventListener('keydown', this.handleInteraction, events_1.applyPassive());
        this.content.removeEventListener('transitionend', this.handleTransitionEnd);
    };
    MDCTabScroller.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            eventTargetMatchesSelector: function eventTargetMatchesSelector(evtTarget, selector) {
                return ponyfill_1.matches(evtTarget, selector);
            },
            addClass: function addClass(className) {
                _this.root.classList.add(className);
            },
            removeClass: function removeClass(className) {
                _this.root.classList.remove(className);
            },
            addScrollAreaClass: function addScrollAreaClass(className) {
                _this.area.classList.add(className);
            },
            setScrollAreaStyleProperty: function setScrollAreaStyleProperty(prop, value) {
                _this.area.style.setProperty(prop, value);
            },
            setScrollContentStyleProperty: function setScrollContentStyleProperty(prop, value) {
                _this.content.style.setProperty(prop, value);
            },
            getScrollContentStyleValue: function getScrollContentStyleValue(propName) {
                return window.getComputedStyle(_this.content).getPropertyValue(propName);
            },
            setScrollAreaScrollLeft: function setScrollAreaScrollLeft(scrollX) {
                return _this.area.scrollLeft = scrollX;
            },
            getScrollAreaScrollLeft: function getScrollAreaScrollLeft() {
                return _this.area.scrollLeft;
            },
            getScrollContentOffsetWidth: function getScrollContentOffsetWidth() {
                return _this.content.offsetWidth;
            },
            getScrollAreaOffsetWidth: function getScrollAreaOffsetWidth() {
                return _this.area.offsetWidth;
            },
            computeScrollAreaClientRect: function computeScrollAreaClientRect() {
                return _this.area.getBoundingClientRect();
            },
            computeScrollContentClientRect: function computeScrollContentClientRect() {
                return _this.content.getBoundingClientRect();
            },
            computeHorizontalScrollbarHeight: function computeHorizontalScrollbarHeight() {
                return util.computeHorizontalScrollbarHeight(document);
            }
        };
        // tslint:enable:object-literal-sort-keys
        return new foundation_1.MDCTabScrollerFoundation(adapter);
    };
    /**
     * Returns the current visual scroll position
     */
    MDCTabScroller.prototype.getScrollPosition = function () {
        return this.foundation.getScrollPosition();
    };
    /**
     * Returns the width of the scroll content
     */
    MDCTabScroller.prototype.getScrollContentWidth = function () {
        return this.content.offsetWidth;
    };
    /**
     * Increments the scroll value by the given amount
     * @param scrollXIncrement The pixel value by which to increment the scroll value
     */
    MDCTabScroller.prototype.incrementScroll = function (scrollXIncrement) {
        this.foundation.incrementScroll(scrollXIncrement);
    };
    /**
     * Scrolls to the given pixel position
     * @param scrollX The pixel value to scroll to
     */
    MDCTabScroller.prototype.scrollTo = function (scrollX) {
        this.foundation.scrollTo(scrollX);
    };
    return MDCTabScroller;
}(component_1.MDCComponent);
exports.MDCTabScroller = MDCTabScroller;

/***/ }),

/***/ "./packages/mdc-tab-scroller/constants.ts":
/*!************************************************!*\
  !*** ./packages/mdc-tab-scroller/constants.ts ***!
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
exports.strings = exports.cssClasses = void 0;
var cssClasses = {
    ANIMATING: 'mdc-tab-scroller--animating',
    SCROLL_AREA_SCROLL: 'mdc-tab-scroller__scroll-area--scroll',
    SCROLL_TEST: 'mdc-tab-scroller__test'
};
exports.cssClasses = cssClasses;
var strings = {
    AREA_SELECTOR: '.mdc-tab-scroller__scroll-area',
    CONTENT_SELECTOR: '.mdc-tab-scroller__scroll-content'
};
exports.strings = strings;

/***/ }),

/***/ "./packages/mdc-tab-scroller/foundation.ts":
/*!*************************************************!*\
  !*** ./packages/mdc-tab-scroller/foundation.ts ***!
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCTabScrollerFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-tab-scroller/constants.ts");
var rtl_default_scroller_1 = __webpack_require__(/*! ./rtl-default-scroller */ "./packages/mdc-tab-scroller/rtl-default-scroller.ts");
var rtl_negative_scroller_1 = __webpack_require__(/*! ./rtl-negative-scroller */ "./packages/mdc-tab-scroller/rtl-negative-scroller.ts");
var rtl_reverse_scroller_1 = __webpack_require__(/*! ./rtl-reverse-scroller */ "./packages/mdc-tab-scroller/rtl-reverse-scroller.ts");
var MDCTabScrollerFoundation = /** @class */function (_super) {
    __extends(MDCTabScrollerFoundation, _super);
    function MDCTabScrollerFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCTabScrollerFoundation.defaultAdapter), adapter)) || this;
        /**
         * Controls whether we should handle the transitionend and interaction events during the animation.
         */
        _this.isAnimating = false;
        return _this;
    }
    Object.defineProperty(MDCTabScrollerFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCTabScrollerFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCTabScrollerFoundation, "defaultAdapter", {
        get: function get() {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                eventTargetMatchesSelector: function eventTargetMatchesSelector() {
                    return false;
                },
                addClass: function addClass() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                addScrollAreaClass: function addScrollAreaClass() {
                    return undefined;
                },
                setScrollAreaStyleProperty: function setScrollAreaStyleProperty() {
                    return undefined;
                },
                setScrollContentStyleProperty: function setScrollContentStyleProperty() {
                    return undefined;
                },
                getScrollContentStyleValue: function getScrollContentStyleValue() {
                    return '';
                },
                setScrollAreaScrollLeft: function setScrollAreaScrollLeft() {
                    return undefined;
                },
                getScrollAreaScrollLeft: function getScrollAreaScrollLeft() {
                    return 0;
                },
                getScrollContentOffsetWidth: function getScrollContentOffsetWidth() {
                    return 0;
                },
                getScrollAreaOffsetWidth: function getScrollAreaOffsetWidth() {
                    return 0;
                },
                computeScrollAreaClientRect: function computeScrollAreaClientRect() {
                    return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
                },
                computeScrollContentClientRect: function computeScrollContentClientRect() {
                    return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
                },
                computeHorizontalScrollbarHeight: function computeHorizontalScrollbarHeight() {
                    return 0;
                }
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCTabScrollerFoundation.prototype.init = function () {
        // Compute horizontal scrollbar height on scroller with overflow initially hidden, then update overflow to scroll
        // and immediately adjust bottom margin to avoid the scrollbar initially appearing before JS runs.
        var horizontalScrollbarHeight = this.adapter.computeHorizontalScrollbarHeight();
        this.adapter.setScrollAreaStyleProperty('margin-bottom', -horizontalScrollbarHeight + 'px');
        this.adapter.addScrollAreaClass(MDCTabScrollerFoundation.cssClasses.SCROLL_AREA_SCROLL);
    };
    /**
     * Computes the current visual scroll position
     */
    MDCTabScrollerFoundation.prototype.getScrollPosition = function () {
        if (this.isRTL()) {
            return this.computeCurrentScrollPositionRTL();
        }
        var currentTranslateX = this.calculateCurrentTranslateX();
        var scrollLeft = this.adapter.getScrollAreaScrollLeft();
        return scrollLeft - currentTranslateX;
    };
    /**
     * Handles interaction events that occur during transition
     */
    MDCTabScrollerFoundation.prototype.handleInteraction = function () {
        // Early exit if we aren't animating
        if (!this.isAnimating) {
            return;
        }
        // Prevent other event listeners from handling this event
        this.stopScrollAnimation();
    };
    /**
     * Handles the transitionend event
     */
    MDCTabScrollerFoundation.prototype.handleTransitionEnd = function (evt) {
        // Early exit if we aren't animating or the event was triggered by a different element.
        var evtTarget = evt.target;
        if (!this.isAnimating || !this.adapter.eventTargetMatchesSelector(evtTarget, MDCTabScrollerFoundation.strings.CONTENT_SELECTOR)) {
            return;
        }
        this.isAnimating = false;
        this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
    };
    /**
     * Increment the scroll value by the scrollXIncrement using animation.
     * @param scrollXIncrement The value by which to increment the scroll position
     */
    MDCTabScrollerFoundation.prototype.incrementScroll = function (scrollXIncrement) {
        // Early exit for non-operational increment values
        if (scrollXIncrement === 0) {
            return;
        }
        this.animate(this.getIncrementScrollOperation(scrollXIncrement));
    };
    /**
     * Increment the scroll value by the scrollXIncrement without animation.
     * @param scrollXIncrement The value by which to increment the scroll position
     */
    MDCTabScrollerFoundation.prototype.incrementScrollImmediate = function (scrollXIncrement) {
        // Early exit for non-operational increment values
        if (scrollXIncrement === 0) {
            return;
        }
        var operation = this.getIncrementScrollOperation(scrollXIncrement);
        if (operation.scrollDelta === 0) {
            return;
        }
        this.stopScrollAnimation();
        this.adapter.setScrollAreaScrollLeft(operation.finalScrollPosition);
    };
    /**
     * Scrolls to the given scrollX value
     */
    MDCTabScrollerFoundation.prototype.scrollTo = function (scrollX) {
        if (this.isRTL()) {
            this.scrollToImplRTL(scrollX);
            return;
        }
        this.scrollToImpl(scrollX);
    };
    /**
     * @return Browser-specific {@link MDCTabScrollerRTL} instance.
     */
    MDCTabScrollerFoundation.prototype.getRTLScroller = function () {
        if (!this.rtlScrollerInstance) {
            this.rtlScrollerInstance = this.rtlScrollerFactory();
        }
        return this.rtlScrollerInstance;
    };
    /**
     * @return translateX value from a CSS matrix transform function string.
     */
    MDCTabScrollerFoundation.prototype.calculateCurrentTranslateX = function () {
        var transformValue = this.adapter.getScrollContentStyleValue('transform');
        // Early exit if no transform is present
        if (transformValue === 'none') {
            return 0;
        }
        // The transform value comes back as a matrix transformation in the form
        // of `matrix(a, b, c, d, tx, ty)`. We only care about tx (translateX) so
        // we're going to grab all the parenthesized values, strip out tx, and
        // parse it.
        var match = /\((.+?)\)/.exec(transformValue);
        if (!match) {
            return 0;
        }
        var matrixParams = match[1];
        // tslint:disable-next-line:ban-ts-ignore "Unused vars" should be a linter warning, not a compiler error.
        // @ts-ignore These unused variables should retain their semantic names for clarity.
        var _a = __read(matrixParams.split(','), 6),
            a = _a[0],
            b = _a[1],
            c = _a[2],
            d = _a[3],
            tx = _a[4],
            ty = _a[5];
        return parseFloat(tx); // tslint:disable-line:ban
    };
    /**
     * Calculates a safe scroll value that is > 0 and < the max scroll value
     * @param scrollX The distance to scroll
     */
    MDCTabScrollerFoundation.prototype.clampScrollValue = function (scrollX) {
        var edges = this.calculateScrollEdges();
        return Math.min(Math.max(edges.left, scrollX), edges.right);
    };
    MDCTabScrollerFoundation.prototype.computeCurrentScrollPositionRTL = function () {
        var translateX = this.calculateCurrentTranslateX();
        return this.getRTLScroller().getScrollPositionRTL(translateX);
    };
    MDCTabScrollerFoundation.prototype.calculateScrollEdges = function () {
        var contentWidth = this.adapter.getScrollContentOffsetWidth();
        var rootWidth = this.adapter.getScrollAreaOffsetWidth();
        return {
            left: 0,
            right: contentWidth - rootWidth
        };
    };
    /**
     * Internal scroll method
     * @param scrollX The new scroll position
     */
    MDCTabScrollerFoundation.prototype.scrollToImpl = function (scrollX) {
        var currentScrollX = this.getScrollPosition();
        var safeScrollX = this.clampScrollValue(scrollX);
        var scrollDelta = safeScrollX - currentScrollX;
        this.animate({
            finalScrollPosition: safeScrollX,
            scrollDelta: scrollDelta
        });
    };
    /**
     * Internal RTL scroll method
     * @param scrollX The new scroll position
     */
    MDCTabScrollerFoundation.prototype.scrollToImplRTL = function (scrollX) {
        var animation = this.getRTLScroller().scrollToRTL(scrollX);
        this.animate(animation);
    };
    /**
     * Internal method to compute the increment scroll operation values.
     * @param scrollX The desired scroll position increment
     * @return MDCTabScrollerAnimation with the sanitized values for performing the scroll operation.
     */
    MDCTabScrollerFoundation.prototype.getIncrementScrollOperation = function (scrollX) {
        if (this.isRTL()) {
            return this.getRTLScroller().incrementScrollRTL(scrollX);
        }
        var currentScrollX = this.getScrollPosition();
        var targetScrollX = scrollX + currentScrollX;
        var safeScrollX = this.clampScrollValue(targetScrollX);
        var scrollDelta = safeScrollX - currentScrollX;
        return {
            finalScrollPosition: safeScrollX,
            scrollDelta: scrollDelta
        };
    };
    /**
     * Animates the tab scrolling
     * @param animation The animation to apply
     */
    MDCTabScrollerFoundation.prototype.animate = function (animation) {
        var _this = this;
        // Early exit if translateX is 0, which means there's no animation to perform
        if (animation.scrollDelta === 0) {
            return;
        }
        this.stopScrollAnimation();
        // This animation uses the FLIP approach.
        // Read more here: https://aerotwist.com/blog/flip-your-animations/
        this.adapter.setScrollAreaScrollLeft(animation.finalScrollPosition);
        this.adapter.setScrollContentStyleProperty('transform', "translateX(" + animation.scrollDelta + "px)");
        // Force repaint
        this.adapter.computeScrollAreaClientRect();
        requestAnimationFrame(function () {
            _this.adapter.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
            _this.adapter.setScrollContentStyleProperty('transform', 'none');
        });
        this.isAnimating = true;
    };
    /**
     * Stops scroll animation
     */
    MDCTabScrollerFoundation.prototype.stopScrollAnimation = function () {
        this.isAnimating = false;
        var currentScrollPosition = this.getAnimatingScrollPosition();
        this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
        this.adapter.setScrollContentStyleProperty('transform', 'translateX(0px)');
        this.adapter.setScrollAreaScrollLeft(currentScrollPosition);
    };
    /**
     * Gets the current scroll position during animation
     */
    MDCTabScrollerFoundation.prototype.getAnimatingScrollPosition = function () {
        var currentTranslateX = this.calculateCurrentTranslateX();
        var scrollLeft = this.adapter.getScrollAreaScrollLeft();
        if (this.isRTL()) {
            return this.getRTLScroller().getAnimatingScrollPosition(scrollLeft, currentTranslateX);
        }
        return scrollLeft - currentTranslateX;
    };
    /**
     * Determines the RTL Scroller to use
     */
    MDCTabScrollerFoundation.prototype.rtlScrollerFactory = function () {
        // Browsers have three different implementations of scrollLeft in RTL mode,
        // dependent on the browser. The behavior is based off the max LTR
        // scrollLeft value and 0.
        //
        // * Default scrolling in RTL *
        //    - Left-most value: 0
        //    - Right-most value: Max LTR scrollLeft value
        //
        // * Negative scrolling in RTL *
        //    - Left-most value: Negated max LTR scrollLeft value
        //    - Right-most value: 0
        //
        // * Reverse scrolling in RTL *
        //    - Left-most value: Max LTR scrollLeft value
        //    - Right-most value: 0
        //
        // We use those principles below to determine which RTL scrollLeft
        // behavior is implemented in the current browser.
        var initialScrollLeft = this.adapter.getScrollAreaScrollLeft();
        this.adapter.setScrollAreaScrollLeft(initialScrollLeft - 1);
        var newScrollLeft = this.adapter.getScrollAreaScrollLeft();
        // If the newScrollLeft value is negative,then we know that the browser has
        // implemented negative RTL scrolling, since all other implementations have
        // only positive values.
        if (newScrollLeft < 0) {
            // Undo the scrollLeft test check
            this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
            return new rtl_negative_scroller_1.MDCTabScrollerRTLNegative(this.adapter);
        }
        var rootClientRect = this.adapter.computeScrollAreaClientRect();
        var contentClientRect = this.adapter.computeScrollContentClientRect();
        var rightEdgeDelta = Math.round(contentClientRect.right - rootClientRect.right);
        // Undo the scrollLeft test check
        this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
        // By calculating the clientRect of the root element and the clientRect of
        // the content element, we can determine how much the scroll value changed
        // when we performed the scrollLeft subtraction above.
        if (rightEdgeDelta === newScrollLeft) {
            return new rtl_reverse_scroller_1.MDCTabScrollerRTLReverse(this.adapter);
        }
        return new rtl_default_scroller_1.MDCTabScrollerRTLDefault(this.adapter);
    };
    MDCTabScrollerFoundation.prototype.isRTL = function () {
        return this.adapter.getScrollContentStyleValue('direction') === 'rtl';
    };
    return MDCTabScrollerFoundation;
}(foundation_1.MDCFoundation);
exports.MDCTabScrollerFoundation = MDCTabScrollerFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCTabScrollerFoundation;

/***/ }),

/***/ "./packages/mdc-tab-scroller/index.ts":
/*!********************************************!*\
  !*** ./packages/mdc-tab-scroller/index.ts ***!
  \********************************************/
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
var __exportStar = this && this.__exportStar || function (m, exports) {
    for (var p in m) {
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = void 0;
var util = __importStar(__webpack_require__(/*! ./util */ "./packages/mdc-tab-scroller/util.ts"));
exports.util = util;
__exportStar(__webpack_require__(/*! ./adapter */ "./packages/mdc-tab-scroller/adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./component */ "./packages/mdc-tab-scroller/component.ts"), exports);
__exportStar(__webpack_require__(/*! ./constants */ "./packages/mdc-tab-scroller/constants.ts"), exports);
__exportStar(__webpack_require__(/*! ./foundation */ "./packages/mdc-tab-scroller/foundation.ts"), exports);
__exportStar(__webpack_require__(/*! ./types */ "./packages/mdc-tab-scroller/types.ts"), exports);

/***/ }),

/***/ "./packages/mdc-tab-scroller/rtl-default-scroller.ts":
/*!***********************************************************!*\
  !*** ./packages/mdc-tab-scroller/rtl-default-scroller.ts ***!
  \***********************************************************/
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
exports.MDCTabScrollerRTLDefault = void 0;
var rtl_scroller_1 = __webpack_require__(/*! ./rtl-scroller */ "./packages/mdc-tab-scroller/rtl-scroller.ts");
var MDCTabScrollerRTLDefault = /** @class */function (_super) {
    __extends(MDCTabScrollerRTLDefault, _super);
    function MDCTabScrollerRTLDefault() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTabScrollerRTLDefault.prototype.getScrollPositionRTL = function () {
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        var right = this.calculateScrollEdges().right;
        // Scroll values on most browsers are ints instead of floats so we round
        return Math.round(right - currentScrollLeft);
    };
    MDCTabScrollerRTLDefault.prototype.scrollToRTL = function (scrollX) {
        var edges = this.calculateScrollEdges();
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        var clampedScrollLeft = this.clampScrollValue(edges.right - scrollX);
        return {
            finalScrollPosition: clampedScrollLeft,
            scrollDelta: clampedScrollLeft - currentScrollLeft
        };
    };
    MDCTabScrollerRTLDefault.prototype.incrementScrollRTL = function (scrollX) {
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        var clampedScrollLeft = this.clampScrollValue(currentScrollLeft - scrollX);
        return {
            finalScrollPosition: clampedScrollLeft,
            scrollDelta: clampedScrollLeft - currentScrollLeft
        };
    };
    MDCTabScrollerRTLDefault.prototype.getAnimatingScrollPosition = function (scrollX) {
        return scrollX;
    };
    MDCTabScrollerRTLDefault.prototype.calculateScrollEdges = function () {
        var contentWidth = this.adapter.getScrollContentOffsetWidth();
        var rootWidth = this.adapter.getScrollAreaOffsetWidth();
        return {
            left: 0,
            right: contentWidth - rootWidth
        };
    };
    MDCTabScrollerRTLDefault.prototype.clampScrollValue = function (scrollX) {
        var edges = this.calculateScrollEdges();
        return Math.min(Math.max(edges.left, scrollX), edges.right);
    };
    return MDCTabScrollerRTLDefault;
}(rtl_scroller_1.MDCTabScrollerRTL);
exports.MDCTabScrollerRTLDefault = MDCTabScrollerRTLDefault;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCTabScrollerRTLDefault;

/***/ }),

/***/ "./packages/mdc-tab-scroller/rtl-negative-scroller.ts":
/*!************************************************************!*\
  !*** ./packages/mdc-tab-scroller/rtl-negative-scroller.ts ***!
  \************************************************************/
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
exports.MDCTabScrollerRTLNegative = void 0;
var rtl_scroller_1 = __webpack_require__(/*! ./rtl-scroller */ "./packages/mdc-tab-scroller/rtl-scroller.ts");
var MDCTabScrollerRTLNegative = /** @class */function (_super) {
    __extends(MDCTabScrollerRTLNegative, _super);
    function MDCTabScrollerRTLNegative() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTabScrollerRTLNegative.prototype.getScrollPositionRTL = function (translateX) {
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        return Math.round(translateX - currentScrollLeft);
    };
    MDCTabScrollerRTLNegative.prototype.scrollToRTL = function (scrollX) {
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        var clampedScrollLeft = this.clampScrollValue(-scrollX);
        return {
            finalScrollPosition: clampedScrollLeft,
            scrollDelta: clampedScrollLeft - currentScrollLeft
        };
    };
    MDCTabScrollerRTLNegative.prototype.incrementScrollRTL = function (scrollX) {
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        var clampedScrollLeft = this.clampScrollValue(currentScrollLeft - scrollX);
        return {
            finalScrollPosition: clampedScrollLeft,
            scrollDelta: clampedScrollLeft - currentScrollLeft
        };
    };
    MDCTabScrollerRTLNegative.prototype.getAnimatingScrollPosition = function (scrollX, translateX) {
        return scrollX - translateX;
    };
    MDCTabScrollerRTLNegative.prototype.calculateScrollEdges = function () {
        var contentWidth = this.adapter.getScrollContentOffsetWidth();
        var rootWidth = this.adapter.getScrollAreaOffsetWidth();
        return {
            left: rootWidth - contentWidth,
            right: 0
        };
    };
    MDCTabScrollerRTLNegative.prototype.clampScrollValue = function (scrollX) {
        var edges = this.calculateScrollEdges();
        return Math.max(Math.min(edges.right, scrollX), edges.left);
    };
    return MDCTabScrollerRTLNegative;
}(rtl_scroller_1.MDCTabScrollerRTL);
exports.MDCTabScrollerRTLNegative = MDCTabScrollerRTLNegative;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCTabScrollerRTLNegative;

/***/ }),

/***/ "./packages/mdc-tab-scroller/rtl-reverse-scroller.ts":
/*!***********************************************************!*\
  !*** ./packages/mdc-tab-scroller/rtl-reverse-scroller.ts ***!
  \***********************************************************/
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
exports.MDCTabScrollerRTLReverse = void 0;
var rtl_scroller_1 = __webpack_require__(/*! ./rtl-scroller */ "./packages/mdc-tab-scroller/rtl-scroller.ts");
var MDCTabScrollerRTLReverse = /** @class */function (_super) {
    __extends(MDCTabScrollerRTLReverse, _super);
    function MDCTabScrollerRTLReverse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTabScrollerRTLReverse.prototype.getScrollPositionRTL = function (translateX) {
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        // Scroll values on most browsers are ints instead of floats so we round
        return Math.round(currentScrollLeft - translateX);
    };
    MDCTabScrollerRTLReverse.prototype.scrollToRTL = function (scrollX) {
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        var clampedScrollLeft = this.clampScrollValue(scrollX);
        return {
            finalScrollPosition: clampedScrollLeft,
            scrollDelta: currentScrollLeft - clampedScrollLeft
        };
    };
    MDCTabScrollerRTLReverse.prototype.incrementScrollRTL = function (scrollX) {
        var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
        var clampedScrollLeft = this.clampScrollValue(currentScrollLeft + scrollX);
        return {
            finalScrollPosition: clampedScrollLeft,
            scrollDelta: currentScrollLeft - clampedScrollLeft
        };
    };
    MDCTabScrollerRTLReverse.prototype.getAnimatingScrollPosition = function (scrollX, translateX) {
        return scrollX + translateX;
    };
    MDCTabScrollerRTLReverse.prototype.calculateScrollEdges = function () {
        var contentWidth = this.adapter.getScrollContentOffsetWidth();
        var rootWidth = this.adapter.getScrollAreaOffsetWidth();
        return {
            left: contentWidth - rootWidth,
            right: 0
        };
    };
    MDCTabScrollerRTLReverse.prototype.clampScrollValue = function (scrollX) {
        var edges = this.calculateScrollEdges();
        return Math.min(Math.max(edges.right, scrollX), edges.left);
    };
    return MDCTabScrollerRTLReverse;
}(rtl_scroller_1.MDCTabScrollerRTL);
exports.MDCTabScrollerRTLReverse = MDCTabScrollerRTLReverse;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCTabScrollerRTLReverse;

/***/ }),

/***/ "./packages/mdc-tab-scroller/rtl-scroller.ts":
/*!***************************************************!*\
  !*** ./packages/mdc-tab-scroller/rtl-scroller.ts ***!
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
exports.MDCTabScrollerRTL = void 0;
var MDCTabScrollerRTL = /** @class */function () {
    function MDCTabScrollerRTL(adapter) {
        this.adapter = adapter;
    }
    return MDCTabScrollerRTL;
}();
exports.MDCTabScrollerRTL = MDCTabScrollerRTL;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCTabScrollerRTL;

/***/ }),

/***/ "./packages/mdc-tab-scroller/types.ts":
/*!********************************************!*\
  !*** ./packages/mdc-tab-scroller/types.ts ***!
  \********************************************/
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

/***/ "./packages/mdc-tab-scroller/util.ts":
/*!*******************************************!*\
  !*** ./packages/mdc-tab-scroller/util.ts ***!
  \*******************************************/
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
exports.computeHorizontalScrollbarHeight = void 0;
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-tab-scroller/constants.ts");
/**
 * Stores result from computeHorizontalScrollbarHeight to avoid redundant processing.
 */
var horizontalScrollbarHeight_;
/**
 * Computes the height of browser-rendered horizontal scrollbars using a self-created test element.
 * May return 0 (e.g. on OS X browsers under default configuration).
 */
function computeHorizontalScrollbarHeight(documentObj, shouldCacheResult) {
  if (shouldCacheResult === void 0) {
    shouldCacheResult = true;
  }
  if (shouldCacheResult && typeof horizontalScrollbarHeight_ !== 'undefined') {
    return horizontalScrollbarHeight_;
  }
  var el = documentObj.createElement('div');
  el.classList.add(constants_1.cssClasses.SCROLL_TEST);
  documentObj.body.appendChild(el);
  var horizontalScrollbarHeight = el.offsetHeight - el.clientHeight;
  documentObj.body.removeChild(el);
  if (shouldCacheResult) {
    horizontalScrollbarHeight_ = horizontalScrollbarHeight;
  }
  return horizontalScrollbarHeight;
}
exports.computeHorizontalScrollbarHeight = computeHorizontalScrollbarHeight;

/***/ })

/******/ });
});
//# sourceMappingURL=mdc.tabScroller.js.map