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
		exports["dataTable"] = factory();
	else
		root["mdc"] = root["mdc"] || {}, root["mdc"]["dataTable"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/mdc-data-table/index.ts");
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

/***/ "./packages/mdc-checkbox/component.ts":
/*!********************************************!*\
  !*** ./packages/mdc-checkbox/component.ts ***!
  \********************************************/
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
exports.MDCCheckbox = void 0;
var util_1 = __webpack_require__(/*! @material/animation/util */ "./packages/mdc-animation/util.ts");
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var events_1 = __webpack_require__(/*! @material/dom/events */ "./packages/mdc-dom/events.ts");
var ponyfill_1 = __webpack_require__(/*! @material/dom/ponyfill */ "./packages/mdc-dom/ponyfill.ts");
var component_2 = __webpack_require__(/*! @material/ripple/component */ "./packages/mdc-ripple/component.ts");
var foundation_1 = __webpack_require__(/*! @material/ripple/foundation */ "./packages/mdc-ripple/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-checkbox/constants.ts");
var foundation_2 = __webpack_require__(/*! ./foundation */ "./packages/mdc-checkbox/foundation.ts");
var CB_PROTO_PROPS = ['checked', 'indeterminate'];
var MDCCheckbox = /** @class */function (_super) {
    __extends(MDCCheckbox, _super);
    function MDCCheckbox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rippleSurface = _this.createRipple();
        return _this;
    }
    MDCCheckbox.attachTo = function (root) {
        return new MDCCheckbox(root);
    };
    Object.defineProperty(MDCCheckbox.prototype, "ripple", {
        get: function get() {
            return this.rippleSurface;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCCheckbox.prototype, "checked", {
        get: function get() {
            return this.getNativeControl().checked;
        },
        set: function set(checked) {
            this.getNativeControl().checked = checked;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCCheckbox.prototype, "indeterminate", {
        get: function get() {
            return this.getNativeControl().indeterminate;
        },
        set: function set(indeterminate) {
            this.getNativeControl().indeterminate = indeterminate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCCheckbox.prototype, "disabled", {
        get: function get() {
            return this.getNativeControl().disabled;
        },
        set: function set(disabled) {
            this.foundation.setDisabled(disabled);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCCheckbox.prototype, "value", {
        get: function get() {
            return this.getNativeControl().value;
        },
        set: function set(value) {
            this.getNativeControl().value = value;
        },
        enumerable: false,
        configurable: true
    });
    MDCCheckbox.prototype.initialize = function () {
        var DATA_INDETERMINATE_ATTR = constants_1.strings.DATA_INDETERMINATE_ATTR;
        this.getNativeControl().indeterminate = this.getNativeControl().getAttribute(DATA_INDETERMINATE_ATTR) === 'true';
        this.getNativeControl().removeAttribute(DATA_INDETERMINATE_ATTR);
    };
    MDCCheckbox.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.handleChange = function () {
            _this.foundation.handleChange();
        };
        this.handleAnimationEnd = function () {
            _this.foundation.handleAnimationEnd();
        };
        this.getNativeControl().addEventListener('change', this.handleChange);
        this.listen(util_1.getCorrectEventName(window, 'animationend'), this.handleAnimationEnd);
        this.installPropertyChangeHooks();
    };
    MDCCheckbox.prototype.destroy = function () {
        this.rippleSurface.destroy();
        this.getNativeControl().removeEventListener('change', this.handleChange);
        this.unlisten(util_1.getCorrectEventName(window, 'animationend'), this.handleAnimationEnd);
        this.uninstallPropertyChangeHooks();
        _super.prototype.destroy.call(this);
    };
    MDCCheckbox.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addClass: function addClass(className) {
                return _this.root.classList.add(className);
            },
            forceLayout: function forceLayout() {
                return _this.root.offsetWidth;
            },
            hasNativeControl: function hasNativeControl() {
                return !!_this.getNativeControl();
            },
            isAttachedToDOM: function isAttachedToDOM() {
                return Boolean(_this.root.parentNode);
            },
            isChecked: function isChecked() {
                return _this.checked;
            },
            isIndeterminate: function isIndeterminate() {
                return _this.indeterminate;
            },
            removeClass: function removeClass(className) {
                _this.root.classList.remove(className);
            },
            removeNativeControlAttr: function removeNativeControlAttr(attr) {
                _this.getNativeControl().removeAttribute(attr);
            },
            setNativeControlAttr: function setNativeControlAttr(attr, value) {
                _this.getNativeControl().setAttribute(attr, value);
            },
            setNativeControlDisabled: function setNativeControlDisabled(disabled) {
                _this.getNativeControl().disabled = disabled;
            }
        };
        return new foundation_2.MDCCheckboxFoundation(adapter);
    };
    MDCCheckbox.prototype.createRipple = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = __assign(__assign({}, component_2.MDCRipple.createAdapter(this)), { deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {
                _this.getNativeControl().removeEventListener(evtType, handler, events_1.applyPassive());
            }, isSurfaceActive: function isSurfaceActive() {
                return ponyfill_1.matches(_this.getNativeControl(), ':active');
            }, isUnbounded: function isUnbounded() {
                return true;
            }, registerInteractionHandler: function registerInteractionHandler(evtType, handler) {
                _this.getNativeControl().addEventListener(evtType, handler, events_1.applyPassive());
            } });
        return new component_2.MDCRipple(this.root, new foundation_1.MDCRippleFoundation(adapter));
    };
    MDCCheckbox.prototype.installPropertyChangeHooks = function () {
        var e_1, _a;
        var _this = this;
        var nativeCb = this.getNativeControl();
        var cbProto = Object.getPrototypeOf(nativeCb);
        var _loop_1 = function _loop_1(controlState) {
            var desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
            // We have to check for this descriptor, since some browsers (Safari) don't support its return.
            // See: https://bugs.webkit.org/show_bug.cgi?id=49739
            if (!validDescriptor(desc)) {
                return { value: void 0 };
            }
            // Type cast is needed for compatibility with Closure Compiler.
            var nativeGetter = desc.get;
            var nativeCbDesc = {
                configurable: desc.configurable,
                enumerable: desc.enumerable,
                get: nativeGetter,
                set: function set(state) {
                    desc.set.call(nativeCb, state);
                    _this.foundation.handleChange();
                }
            };
            Object.defineProperty(nativeCb, controlState, nativeCbDesc);
        };
        try {
            for (var CB_PROTO_PROPS_1 = __values(CB_PROTO_PROPS), CB_PROTO_PROPS_1_1 = CB_PROTO_PROPS_1.next(); !CB_PROTO_PROPS_1_1.done; CB_PROTO_PROPS_1_1 = CB_PROTO_PROPS_1.next()) {
                var controlState = CB_PROTO_PROPS_1_1.value;
                var state_1 = _loop_1(controlState);
                if ((typeof state_1 === "undefined" ? "undefined" : _typeof(state_1)) === "object") return state_1.value;
            }
        } catch (e_1_1) {
            e_1 = { error: e_1_1 };
        } finally {
            try {
                if (CB_PROTO_PROPS_1_1 && !CB_PROTO_PROPS_1_1.done && (_a = CB_PROTO_PROPS_1.return)) _a.call(CB_PROTO_PROPS_1);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
    };
    MDCCheckbox.prototype.uninstallPropertyChangeHooks = function () {
        var e_2, _a;
        var nativeCb = this.getNativeControl();
        var cbProto = Object.getPrototypeOf(nativeCb);
        try {
            for (var CB_PROTO_PROPS_2 = __values(CB_PROTO_PROPS), CB_PROTO_PROPS_2_1 = CB_PROTO_PROPS_2.next(); !CB_PROTO_PROPS_2_1.done; CB_PROTO_PROPS_2_1 = CB_PROTO_PROPS_2.next()) {
                var controlState = CB_PROTO_PROPS_2_1.value;
                var desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
                if (!validDescriptor(desc)) {
                    return;
                }
                Object.defineProperty(nativeCb, controlState, desc);
            }
        } catch (e_2_1) {
            e_2 = { error: e_2_1 };
        } finally {
            try {
                if (CB_PROTO_PROPS_2_1 && !CB_PROTO_PROPS_2_1.done && (_a = CB_PROTO_PROPS_2.return)) _a.call(CB_PROTO_PROPS_2);
            } finally {
                if (e_2) throw e_2.error;
            }
        }
    };
    MDCCheckbox.prototype.getNativeControl = function () {
        var NATIVE_CONTROL_SELECTOR = constants_1.strings.NATIVE_CONTROL_SELECTOR;
        var el = this.root.querySelector(NATIVE_CONTROL_SELECTOR);
        if (!el) {
            throw new Error("Checkbox component requires a " + NATIVE_CONTROL_SELECTOR + " element");
        }
        return el;
    };
    return MDCCheckbox;
}(component_1.MDCComponent);
exports.MDCCheckbox = MDCCheckbox;
function validDescriptor(inputPropDesc) {
    return !!inputPropDesc && typeof inputPropDesc.set === 'function';
}

/***/ }),

/***/ "./packages/mdc-checkbox/constants.ts":
/*!********************************************!*\
  !*** ./packages/mdc-checkbox/constants.ts ***!
  \********************************************/
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
    ANIM_CHECKED_INDETERMINATE: 'mdc-checkbox--anim-checked-indeterminate',
    ANIM_CHECKED_UNCHECKED: 'mdc-checkbox--anim-checked-unchecked',
    ANIM_INDETERMINATE_CHECKED: 'mdc-checkbox--anim-indeterminate-checked',
    ANIM_INDETERMINATE_UNCHECKED: 'mdc-checkbox--anim-indeterminate-unchecked',
    ANIM_UNCHECKED_CHECKED: 'mdc-checkbox--anim-unchecked-checked',
    ANIM_UNCHECKED_INDETERMINATE: 'mdc-checkbox--anim-unchecked-indeterminate',
    BACKGROUND: 'mdc-checkbox__background',
    CHECKED: 'mdc-checkbox--checked',
    CHECKMARK: 'mdc-checkbox__checkmark',
    CHECKMARK_PATH: 'mdc-checkbox__checkmark-path',
    DISABLED: 'mdc-checkbox--disabled',
    INDETERMINATE: 'mdc-checkbox--indeterminate',
    MIXEDMARK: 'mdc-checkbox__mixedmark',
    NATIVE_CONTROL: 'mdc-checkbox__native-control',
    ROOT: 'mdc-checkbox',
    SELECTED: 'mdc-checkbox--selected',
    UPGRADED: 'mdc-checkbox--upgraded'
};
exports.strings = {
    ARIA_CHECKED_ATTR: 'aria-checked',
    ARIA_CHECKED_INDETERMINATE_VALUE: 'mixed',
    DATA_INDETERMINATE_ATTR: 'data-indeterminate',
    NATIVE_CONTROL_SELECTOR: '.mdc-checkbox__native-control',
    TRANSITION_STATE_CHECKED: 'checked',
    TRANSITION_STATE_INDETERMINATE: 'indeterminate',
    TRANSITION_STATE_INIT: 'init',
    TRANSITION_STATE_UNCHECKED: 'unchecked'
};
exports.numbers = {
    ANIM_END_LATCH_MS: 250
};

/***/ }),

/***/ "./packages/mdc-checkbox/foundation.ts":
/*!*********************************************!*\
  !*** ./packages/mdc-checkbox/foundation.ts ***!
  \*********************************************/
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
exports.MDCCheckboxFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-checkbox/constants.ts");
var MDCCheckboxFoundation = /** @class */function (_super) {
    __extends(MDCCheckboxFoundation, _super);
    function MDCCheckboxFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCCheckboxFoundation.defaultAdapter), adapter)) || this;
        _this.currentCheckState = constants_1.strings.TRANSITION_STATE_INIT;
        _this.currentAnimationClass = '';
        _this.animEndLatchTimer = 0;
        _this.enableAnimationEndHandler = false;
        return _this;
    }
    Object.defineProperty(MDCCheckboxFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCCheckboxFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCCheckboxFoundation, "numbers", {
        get: function get() {
            return constants_1.numbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCCheckboxFoundation, "defaultAdapter", {
        get: function get() {
            return {
                addClass: function addClass() {
                    return undefined;
                },
                forceLayout: function forceLayout() {
                    return undefined;
                },
                hasNativeControl: function hasNativeControl() {
                    return false;
                },
                isAttachedToDOM: function isAttachedToDOM() {
                    return false;
                },
                isChecked: function isChecked() {
                    return false;
                },
                isIndeterminate: function isIndeterminate() {
                    return false;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                removeNativeControlAttr: function removeNativeControlAttr() {
                    return undefined;
                },
                setNativeControlAttr: function setNativeControlAttr() {
                    return undefined;
                },
                setNativeControlDisabled: function setNativeControlDisabled() {
                    return undefined;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCCheckboxFoundation.prototype.init = function () {
        this.currentCheckState = this.determineCheckState();
        this.updateAriaChecked();
        this.adapter.addClass(constants_1.cssClasses.UPGRADED);
    };
    MDCCheckboxFoundation.prototype.destroy = function () {
        clearTimeout(this.animEndLatchTimer);
    };
    MDCCheckboxFoundation.prototype.setDisabled = function (disabled) {
        this.adapter.setNativeControlDisabled(disabled);
        if (disabled) {
            this.adapter.addClass(constants_1.cssClasses.DISABLED);
        } else {
            this.adapter.removeClass(constants_1.cssClasses.DISABLED);
        }
    };
    /**
     * Handles the animationend event for the checkbox
     */
    MDCCheckboxFoundation.prototype.handleAnimationEnd = function () {
        var _this = this;
        if (!this.enableAnimationEndHandler) {
            return;
        }
        clearTimeout(this.animEndLatchTimer);
        this.animEndLatchTimer = setTimeout(function () {
            _this.adapter.removeClass(_this.currentAnimationClass);
            _this.enableAnimationEndHandler = false;
        }, constants_1.numbers.ANIM_END_LATCH_MS);
    };
    /**
     * Handles the change event for the checkbox
     */
    MDCCheckboxFoundation.prototype.handleChange = function () {
        this.transitionCheckState();
    };
    MDCCheckboxFoundation.prototype.transitionCheckState = function () {
        if (!this.adapter.hasNativeControl()) {
            return;
        }
        var oldState = this.currentCheckState;
        var newState = this.determineCheckState();
        if (oldState === newState) {
            return;
        }
        this.updateAriaChecked();
        var TRANSITION_STATE_UNCHECKED = constants_1.strings.TRANSITION_STATE_UNCHECKED;
        var SELECTED = constants_1.cssClasses.SELECTED;
        if (newState === TRANSITION_STATE_UNCHECKED) {
            this.adapter.removeClass(SELECTED);
        } else {
            this.adapter.addClass(SELECTED);
        }
        // Check to ensure that there isn't a previously existing animation class, in case for example
        // the user interacted with the checkbox before the animation was finished.
        if (this.currentAnimationClass.length > 0) {
            clearTimeout(this.animEndLatchTimer);
            this.adapter.forceLayout();
            this.adapter.removeClass(this.currentAnimationClass);
        }
        this.currentAnimationClass = this.getTransitionAnimationClass(oldState, newState);
        this.currentCheckState = newState;
        // Check for parentNode so that animations are only run when the element is attached
        // to the DOM.
        if (this.adapter.isAttachedToDOM() && this.currentAnimationClass.length > 0) {
            this.adapter.addClass(this.currentAnimationClass);
            this.enableAnimationEndHandler = true;
        }
    };
    MDCCheckboxFoundation.prototype.determineCheckState = function () {
        var TRANSITION_STATE_INDETERMINATE = constants_1.strings.TRANSITION_STATE_INDETERMINATE,
            TRANSITION_STATE_CHECKED = constants_1.strings.TRANSITION_STATE_CHECKED,
            TRANSITION_STATE_UNCHECKED = constants_1.strings.TRANSITION_STATE_UNCHECKED;
        if (this.adapter.isIndeterminate()) {
            return TRANSITION_STATE_INDETERMINATE;
        }
        return this.adapter.isChecked() ? TRANSITION_STATE_CHECKED : TRANSITION_STATE_UNCHECKED;
    };
    MDCCheckboxFoundation.prototype.getTransitionAnimationClass = function (oldState, newState) {
        var TRANSITION_STATE_INIT = constants_1.strings.TRANSITION_STATE_INIT,
            TRANSITION_STATE_CHECKED = constants_1.strings.TRANSITION_STATE_CHECKED,
            TRANSITION_STATE_UNCHECKED = constants_1.strings.TRANSITION_STATE_UNCHECKED;
        var _a = MDCCheckboxFoundation.cssClasses,
            ANIM_UNCHECKED_CHECKED = _a.ANIM_UNCHECKED_CHECKED,
            ANIM_UNCHECKED_INDETERMINATE = _a.ANIM_UNCHECKED_INDETERMINATE,
            ANIM_CHECKED_UNCHECKED = _a.ANIM_CHECKED_UNCHECKED,
            ANIM_CHECKED_INDETERMINATE = _a.ANIM_CHECKED_INDETERMINATE,
            ANIM_INDETERMINATE_CHECKED = _a.ANIM_INDETERMINATE_CHECKED,
            ANIM_INDETERMINATE_UNCHECKED = _a.ANIM_INDETERMINATE_UNCHECKED;
        switch (oldState) {
            case TRANSITION_STATE_INIT:
                if (newState === TRANSITION_STATE_UNCHECKED) {
                    return '';
                }
                return newState === TRANSITION_STATE_CHECKED ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
            case TRANSITION_STATE_UNCHECKED:
                return newState === TRANSITION_STATE_CHECKED ? ANIM_UNCHECKED_CHECKED : ANIM_UNCHECKED_INDETERMINATE;
            case TRANSITION_STATE_CHECKED:
                return newState === TRANSITION_STATE_UNCHECKED ? ANIM_CHECKED_UNCHECKED : ANIM_CHECKED_INDETERMINATE;
            default:
                // TRANSITION_STATE_INDETERMINATE
                return newState === TRANSITION_STATE_CHECKED ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
        }
    };
    MDCCheckboxFoundation.prototype.updateAriaChecked = function () {
        // Ensure aria-checked is set to mixed if checkbox is in indeterminate state.
        if (this.adapter.isIndeterminate()) {
            this.adapter.setNativeControlAttr(constants_1.strings.ARIA_CHECKED_ATTR, constants_1.strings.ARIA_CHECKED_INDETERMINATE_VALUE);
        } else {
            // The on/off state does not need to keep track of aria-checked, since
            // the screenreader uses the checked property on the checkbox element.
            this.adapter.removeNativeControlAttr(constants_1.strings.ARIA_CHECKED_ATTR);
        }
    };
    return MDCCheckboxFoundation;
}(foundation_1.MDCFoundation);
exports.MDCCheckboxFoundation = MDCCheckboxFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCCheckboxFoundation;

/***/ }),

/***/ "./packages/mdc-data-table/adapter.ts":
/*!********************************************!*\
  !*** ./packages/mdc-data-table/adapter.ts ***!
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

Object.defineProperty(exports, "__esModule", { value: true });

/***/ }),

/***/ "./packages/mdc-data-table/component.ts":
/*!**********************************************!*\
  !*** ./packages/mdc-data-table/component.ts ***!
  \**********************************************/
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
exports.MDCDataTable = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var component_2 = __webpack_require__(/*! @material/checkbox/component */ "./packages/mdc-checkbox/component.ts");
var ponyfill_1 = __webpack_require__(/*! @material/dom/ponyfill */ "./packages/mdc-dom/ponyfill.ts");
var component_3 = __webpack_require__(/*! @material/linear-progress/component */ "./packages/mdc-linear-progress/component.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-data-table/constants.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-data-table/foundation.ts");
/**
 * Implementation of `MDCDataTableFoundation`
 */
var MDCDataTable = /** @class */function (_super) {
    __extends(MDCDataTable, _super);
    function MDCDataTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCDataTable.attachTo = function (root) {
        return new MDCDataTable(root);
    };
    MDCDataTable.prototype.initialize = function (checkboxFactory) {
        if (checkboxFactory === void 0) {
            checkboxFactory = function checkboxFactory(el) {
                return new component_2.MDCCheckbox(el);
            };
        }
        this.checkboxFactory = checkboxFactory;
    };
    MDCDataTable.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.headerRow = this.root.querySelector("." + constants_1.cssClasses.HEADER_ROW);
        this.handleHeaderRowCheckboxChange = function () {
            _this.foundation.handleHeaderRowCheckboxChange();
        };
        this.headerRow.addEventListener('change', this.handleHeaderRowCheckboxChange);
        this.headerRowClickListener = function (event) {
            _this.handleHeaderRowClick(event);
        };
        this.headerRow.addEventListener('click', this.headerRowClickListener);
        this.content = this.root.querySelector("." + constants_1.cssClasses.CONTENT);
        this.handleRowCheckboxChange = function (event) {
            _this.foundation.handleRowCheckboxChange(event);
        };
        this.content.addEventListener('change', this.handleRowCheckboxChange);
        this.layout();
    };
    /**
     * Re-initializes header row checkbox and row checkboxes when selectable rows are added or removed from table.
     */
    MDCDataTable.prototype.layout = function () {
        this.foundation.layout();
    };
    /**
     * @return Returns array of header row cell elements.
     */
    MDCDataTable.prototype.getHeaderCells = function () {
        return [].slice.call(this.root.querySelectorAll(constants_1.selectors.HEADER_CELL));
    };
    /**
     * @return Returns array of row elements.
     */
    MDCDataTable.prototype.getRows = function () {
        return this.foundation.getRows();
    };
    /**
     * @return Returns array of selected row ids.
     */
    MDCDataTable.prototype.getSelectedRowIds = function () {
        return this.foundation.getSelectedRowIds();
    };
    /**
     * Sets selected row ids. Overwrites previously selected rows.
     * @param rowIds Array of row ids that needs to be selected.
     */
    MDCDataTable.prototype.setSelectedRowIds = function (rowIds) {
        this.foundation.setSelectedRowIds(rowIds);
    };
    /**
     * Shows progress indicator when data table is in loading state.
     */
    MDCDataTable.prototype.showProgress = function () {
        this.getLinearProgress().open();
        this.foundation.showProgress();
    };
    /**
     * Hides progress indicator after data table is finished loading.
     */
    MDCDataTable.prototype.hideProgress = function () {
        this.foundation.hideProgress();
        this.getLinearProgress().close();
    };
    MDCDataTable.prototype.destroy = function () {
        var e_1, _a;
        if (this.handleHeaderRowCheckboxChange) {
            this.headerRow.removeEventListener('change', this.handleHeaderRowCheckboxChange);
        }
        if (this.headerRowClickListener) {
            this.headerRow.removeEventListener('click', this.headerRowClickListener);
        }
        if (this.handleRowCheckboxChange) {
            this.content.removeEventListener('change', this.handleRowCheckboxChange);
        }
        if (this.headerRowCheckbox) {
            this.headerRowCheckbox.destroy();
        }
        if (this.rowCheckboxList) {
            try {
                for (var _b = __values(this.rowCheckboxList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var checkbox = _c.value;
                    checkbox.destroy();
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
        }
    };
    MDCDataTable.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function addClass(className) {
                _this.root.classList.add(className);
            },
            removeClass: function removeClass(className) {
                _this.root.classList.remove(className);
            },
            getHeaderCellElements: function getHeaderCellElements() {
                return _this.getHeaderCells();
            },
            getHeaderCellCount: function getHeaderCellCount() {
                return _this.getHeaderCells().length;
            },
            getAttributeByHeaderCellIndex: function getAttributeByHeaderCellIndex(index, attribute) {
                return _this.getHeaderCells()[index].getAttribute(attribute);
            },
            setAttributeByHeaderCellIndex: function setAttributeByHeaderCellIndex(index, attribute, value) {
                _this.getHeaderCells()[index].setAttribute(attribute, value);
            },
            setClassNameByHeaderCellIndex: function setClassNameByHeaderCellIndex(index, className) {
                _this.getHeaderCells()[index].classList.add(className);
            },
            removeClassNameByHeaderCellIndex: function removeClassNameByHeaderCellIndex(index, className) {
                _this.getHeaderCells()[index].classList.remove(className);
            },
            notifySortAction: function notifySortAction(data) {
                _this.emit(constants_1.events.SORTED, data, /** shouldBubble */true);
            },
            getTableContainerHeight: function getTableContainerHeight() {
                var tableContainer = _this.root.querySelector("." + constants_1.cssClasses.TABLE_CONTAINER);
                if (!tableContainer) {
                    throw new Error('MDCDataTable: Table container element not found.');
                }
                return tableContainer.getBoundingClientRect().height;
            },
            getTableHeaderHeight: function getTableHeaderHeight() {
                var tableHeader = _this.root.querySelector(constants_1.selectors.HEADER_ROW);
                if (!tableHeader) {
                    throw new Error('MDCDataTable: Table header element not found.');
                }
                return tableHeader.getBoundingClientRect().height;
            },
            setProgressIndicatorStyles: function setProgressIndicatorStyles(styles) {
                var progressIndicator = _this.root.querySelector(constants_1.selectors.PROGRESS_INDICATOR);
                if (!progressIndicator) {
                    throw new Error('MDCDataTable: Progress indicator element not found.');
                }
                progressIndicator.style.setProperty('height', styles.height);
                progressIndicator.style.setProperty('top', styles.top);
            },
            addClassAtRowIndex: function addClassAtRowIndex(rowIndex, className) {
                _this.getRows()[rowIndex].classList.add(className);
            },
            getRowCount: function getRowCount() {
                return _this.getRows().length;
            },
            getRowElements: function getRowElements() {
                return [].slice.call(_this.root.querySelectorAll(constants_1.selectors.ROW));
            },
            getRowIdAtIndex: function getRowIdAtIndex(rowIndex) {
                return _this.getRows()[rowIndex].getAttribute(constants_1.dataAttributes.ROW_ID);
            },
            getRowIndexByChildElement: function getRowIndexByChildElement(el) {
                return _this.getRows().indexOf(ponyfill_1.closest(el, constants_1.selectors.ROW));
            },
            getSelectedRowCount: function getSelectedRowCount() {
                return _this.root.querySelectorAll(constants_1.selectors.ROW_SELECTED).length;
            },
            isCheckboxAtRowIndexChecked: function isCheckboxAtRowIndexChecked(rowIndex) {
                return _this.rowCheckboxList[rowIndex].checked;
            },
            isHeaderRowCheckboxChecked: function isHeaderRowCheckboxChecked() {
                return _this.headerRowCheckbox.checked;
            },
            isRowsSelectable: function isRowsSelectable() {
                return !!_this.root.querySelector(constants_1.selectors.ROW_CHECKBOX) || !!_this.root.querySelector(constants_1.selectors.HEADER_ROW_CHECKBOX);
            },
            notifyRowSelectionChanged: function notifyRowSelectionChanged(data) {
                _this.emit(constants_1.events.ROW_SELECTION_CHANGED, {
                    row: _this.getRowByIndex(data.rowIndex),
                    rowId: _this.getRowIdByIndex(data.rowIndex),
                    rowIndex: data.rowIndex,
                    selected: data.selected
                },
                /** shouldBubble */true);
            },
            notifySelectedAll: function notifySelectedAll() {
                _this.emit(constants_1.events.SELECTED_ALL, {}, /** shouldBubble */true);
            },
            notifyUnselectedAll: function notifyUnselectedAll() {
                _this.emit(constants_1.events.UNSELECTED_ALL, {}, /** shouldBubble */true);
            },
            registerHeaderRowCheckbox: function registerHeaderRowCheckbox() {
                if (_this.headerRowCheckbox) {
                    _this.headerRowCheckbox.destroy();
                }
                var checkboxEl = _this.root.querySelector(constants_1.selectors.HEADER_ROW_CHECKBOX);
                _this.headerRowCheckbox = _this.checkboxFactory(checkboxEl);
            },
            registerRowCheckboxes: function registerRowCheckboxes() {
                if (_this.rowCheckboxList) {
                    _this.rowCheckboxList.forEach(function (checkbox) {
                        checkbox.destroy();
                    });
                }
                _this.rowCheckboxList = [];
                _this.getRows().forEach(function (rowEl) {
                    var checkbox = _this.checkboxFactory(rowEl.querySelector(constants_1.selectors.ROW_CHECKBOX));
                    _this.rowCheckboxList.push(checkbox);
                });
            },
            removeClassAtRowIndex: function removeClassAtRowIndex(rowIndex, className) {
                _this.getRows()[rowIndex].classList.remove(className);
            },
            setAttributeAtRowIndex: function setAttributeAtRowIndex(rowIndex, attr, value) {
                _this.getRows()[rowIndex].setAttribute(attr, value);
            },
            setHeaderRowCheckboxChecked: function setHeaderRowCheckboxChecked(checked) {
                _this.headerRowCheckbox.checked = checked;
            },
            setHeaderRowCheckboxIndeterminate: function setHeaderRowCheckboxIndeterminate(indeterminate) {
                _this.headerRowCheckbox.indeterminate = indeterminate;
            },
            setRowCheckboxCheckedAtIndex: function setRowCheckboxCheckedAtIndex(rowIndex, checked) {
                _this.rowCheckboxList[rowIndex].checked = checked;
            },
            setSortStatusLabelByHeaderCellIndex: function setSortStatusLabelByHeaderCellIndex(columnIndex, sortValue) {
                var headerCell = _this.getHeaderCells()[columnIndex];
                var sortStatusLabel = headerCell.querySelector(constants_1.selectors.SORT_STATUS_LABEL);
                if (!sortStatusLabel) return;
                sortStatusLabel.textContent = _this.getSortStatusMessageBySortValue(sortValue);
            }
        };
        return new foundation_1.MDCDataTableFoundation(adapter);
    };
    MDCDataTable.prototype.getRowByIndex = function (index) {
        return this.getRows()[index];
    };
    MDCDataTable.prototype.getRowIdByIndex = function (index) {
        return this.getRowByIndex(index).getAttribute(constants_1.dataAttributes.ROW_ID);
    };
    MDCDataTable.prototype.handleHeaderRowClick = function (event) {
        var headerCell = ponyfill_1.closest(event.target, constants_1.selectors.HEADER_CELL_WITH_SORT);
        if (!headerCell) {
            return;
        }
        var columnId = headerCell.getAttribute(constants_1.dataAttributes.COLUMN_ID);
        var columnIndex = this.getHeaderCells().indexOf(headerCell);
        if (columnIndex === -1) {
            return;
        }
        this.foundation.handleSortAction({ columnId: columnId, columnIndex: columnIndex, headerCell: headerCell });
    };
    MDCDataTable.prototype.getSortStatusMessageBySortValue = function (sortValue) {
        switch (sortValue) {
            case constants_1.SortValue.ASCENDING:
                return constants_1.messages.SORTED_IN_ASCENDING;
            case constants_1.SortValue.DESCENDING:
                return constants_1.messages.SORTED_IN_DESCENDING;
            default:
                return '';
        }
    };
    MDCDataTable.prototype.getLinearProgressElement = function () {
        var el = this.root.querySelector("." + constants_1.cssClasses.LINEAR_PROGRESS);
        if (!el) {
            throw new Error('MDCDataTable: linear progress element is not found.');
        }
        return el;
    };
    MDCDataTable.prototype.getLinearProgress = function () {
        if (!this.linearProgress) {
            var el = this.getLinearProgressElement();
            this.linearProgress = new component_3.MDCLinearProgress(el);
        }
        return this.linearProgress;
    };
    return MDCDataTable;
}(component_1.MDCComponent);
exports.MDCDataTable = MDCDataTable;

/***/ }),

/***/ "./packages/mdc-data-table/constants.ts":
/*!**********************************************!*\
  !*** ./packages/mdc-data-table/constants.ts ***!
  \**********************************************/
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
exports.events = exports.SortValue = exports.strings = exports.messages = exports.selectors = exports.dataAttributes = exports.attributes = exports.cssClasses = void 0;
/**
 * CSS class names used in component.
 */
exports.cssClasses = {
  CELL: 'mdc-data-table__cell',
  CELL_NUMERIC: 'mdc-data-table__cell--numeric',
  CONTENT: 'mdc-data-table__content',
  HEADER_CELL: 'mdc-data-table__header-cell',
  HEADER_CELL_LABEL: 'mdc-data-table__header-cell-label',
  HEADER_CELL_SORTED: 'mdc-data-table__header-cell--sorted',
  HEADER_CELL_SORTED_DESCENDING: 'mdc-data-table__header-cell--sorted-descending',
  HEADER_CELL_WITH_SORT: 'mdc-data-table__header-cell--with-sort',
  HEADER_CELL_WRAPPER: 'mdc-data-table__header-cell-wrapper',
  HEADER_ROW: 'mdc-data-table__header-row',
  HEADER_ROW_CHECKBOX: 'mdc-data-table__header-row-checkbox',
  IN_PROGRESS: 'mdc-data-table--in-progress',
  LINEAR_PROGRESS: 'mdc-data-table__linear-progress',
  PAGINATION_ROWS_PER_PAGE_LABEL: 'mdc-data-table__pagination-rows-per-page-label',
  PAGINATION_ROWS_PER_PAGE_SELECT: 'mdc-data-table__pagination-rows-per-page-select',
  PROGRESS_INDICATOR: 'mdc-data-table__progress-indicator',
  ROOT: 'mdc-data-table',
  ROW: 'mdc-data-table__row',
  ROW_CHECKBOX: 'mdc-data-table__row-checkbox',
  ROW_SELECTED: 'mdc-data-table__row--selected',
  SORT_ICON_BUTTON: 'mdc-data-table__sort-icon-button',
  SORT_STATUS_LABEL: 'mdc-data-table__sort-status-label',
  TABLE_CONTAINER: 'mdc-data-table__table-container'
};
/**
 * DOM attributes used in component.
 */
exports.attributes = {
  ARIA_SELECTED: 'aria-selected',
  ARIA_SORT: 'aria-sort'
};
/**
 * List of data attributes used in component.
 */
exports.dataAttributes = {
  COLUMN_ID: 'data-column-id',
  ROW_ID: 'data-row-id'
};
/**
 * CSS selectors used in component.
 */
exports.selectors = {
  CONTENT: "." + exports.cssClasses.CONTENT,
  HEADER_CELL: "." + exports.cssClasses.HEADER_CELL,
  HEADER_CELL_WITH_SORT: "." + exports.cssClasses.HEADER_CELL_WITH_SORT,
  HEADER_ROW: "." + exports.cssClasses.HEADER_ROW,
  HEADER_ROW_CHECKBOX: "." + exports.cssClasses.HEADER_ROW_CHECKBOX,
  PROGRESS_INDICATOR: "." + exports.cssClasses.PROGRESS_INDICATOR,
  ROW: "." + exports.cssClasses.ROW,
  ROW_CHECKBOX: "." + exports.cssClasses.ROW_CHECKBOX,
  ROW_SELECTED: "." + exports.cssClasses.ROW_SELECTED,
  SORT_ICON_BUTTON: "." + exports.cssClasses.SORT_ICON_BUTTON,
  SORT_STATUS_LABEL: "." + exports.cssClasses.SORT_STATUS_LABEL
};
/**
 * Messages used in component.
 */
exports.messages = {
  SORTED_IN_DESCENDING: 'Sorted in descending order',
  SORTED_IN_ASCENDING: 'Sorted in ascending order'
};
/**
 * Attributes and selectors used in component.
 * @deprecated Use `attributes`, `dataAttributes` and `selectors` instead.
 */
exports.strings = {
  ARIA_SELECTED: exports.attributes.ARIA_SELECTED,
  ARIA_SORT: exports.attributes.ARIA_SORT,
  DATA_ROW_ID_ATTR: exports.dataAttributes.ROW_ID,
  HEADER_ROW_CHECKBOX_SELECTOR: exports.selectors.HEADER_ROW_CHECKBOX,
  ROW_CHECKBOX_SELECTOR: exports.selectors.ROW_CHECKBOX,
  ROW_SELECTED_SELECTOR: exports.selectors.ROW_SELECTED,
  ROW_SELECTOR: exports.selectors.ROW
};
/**
 * Sort values defined by ARIA.
 * See https://www.w3.org/WAI/PF/aria/states_and_properties#aria-sort
 */
var SortValue;
(function (SortValue) {
  // Items are sorted in ascending order by this column.
  SortValue["ASCENDING"] = "ascending";
  // Items are sorted in descending order by this column.
  SortValue["DESCENDING"] = "descending";
  // There is no defined sort applied to the column.
  SortValue["NONE"] = "none";
  // A sort algorithm other than ascending or descending has been applied.
  SortValue["OTHER"] = "other";
})(SortValue = exports.SortValue || (exports.SortValue = {}));
/**
 * Event names used in component.
 */
exports.events = {
  ROW_SELECTION_CHANGED: 'MDCDataTable:rowSelectionChanged',
  SELECTED_ALL: 'MDCDataTable:selectedAll',
  UNSELECTED_ALL: 'MDCDataTable:unselectedAll',
  SORTED: 'MDCDataTable:sorted'
};

/***/ }),

/***/ "./packages/mdc-data-table/foundation.ts":
/*!***********************************************!*\
  !*** ./packages/mdc-data-table/foundation.ts ***!
  \***********************************************/
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
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCDataTableFoundation = void 0;
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-data-table/constants.ts");
/**
 * The Foundation of data table component containing pure business logic, any
 * logic requiring DOM manipulation are delegated to adapter methods.
 */
var MDCDataTableFoundation = /** @class */function (_super) {
    __extends(MDCDataTableFoundation, _super);
    function MDCDataTableFoundation(adapter) {
        return _super.call(this, __assign(__assign({}, MDCDataTableFoundation.defaultAdapter), adapter)) || this;
    }
    Object.defineProperty(MDCDataTableFoundation, "defaultAdapter", {
        get: function get() {
            return {
                addClass: function addClass() {
                    return undefined;
                },
                addClassAtRowIndex: function addClassAtRowIndex() {
                    return undefined;
                },
                getAttributeByHeaderCellIndex: function getAttributeByHeaderCellIndex() {
                    return '';
                },
                getHeaderCellCount: function getHeaderCellCount() {
                    return 0;
                },
                getHeaderCellElements: function getHeaderCellElements() {
                    return [];
                },
                getRowCount: function getRowCount() {
                    return 0;
                },
                getRowElements: function getRowElements() {
                    return [];
                },
                getRowIdAtIndex: function getRowIdAtIndex() {
                    return '';
                },
                getRowIndexByChildElement: function getRowIndexByChildElement() {
                    return 0;
                },
                getSelectedRowCount: function getSelectedRowCount() {
                    return 0;
                },
                getTableContainerHeight: function getTableContainerHeight() {
                    return 0;
                },
                getTableHeaderHeight: function getTableHeaderHeight() {
                    return 0;
                },
                isCheckboxAtRowIndexChecked: function isCheckboxAtRowIndexChecked() {
                    return false;
                },
                isHeaderRowCheckboxChecked: function isHeaderRowCheckboxChecked() {
                    return false;
                },
                isRowsSelectable: function isRowsSelectable() {
                    return false;
                },
                notifyRowSelectionChanged: function notifyRowSelectionChanged() {
                    return undefined;
                },
                notifySelectedAll: function notifySelectedAll() {
                    return undefined;
                },
                notifySortAction: function notifySortAction() {
                    return undefined;
                },
                notifyUnselectedAll: function notifyUnselectedAll() {
                    return undefined;
                },
                registerHeaderRowCheckbox: function registerHeaderRowCheckbox() {
                    return undefined;
                },
                registerRowCheckboxes: function registerRowCheckboxes() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                removeClassAtRowIndex: function removeClassAtRowIndex() {
                    return undefined;
                },
                removeClassNameByHeaderCellIndex: function removeClassNameByHeaderCellIndex() {
                    return undefined;
                },
                setAttributeAtRowIndex: function setAttributeAtRowIndex() {
                    return undefined;
                },
                setAttributeByHeaderCellIndex: function setAttributeByHeaderCellIndex() {
                    return undefined;
                },
                setClassNameByHeaderCellIndex: function setClassNameByHeaderCellIndex() {
                    return undefined;
                },
                setHeaderRowCheckboxChecked: function setHeaderRowCheckboxChecked() {
                    return undefined;
                },
                setHeaderRowCheckboxIndeterminate: function setHeaderRowCheckboxIndeterminate() {
                    return undefined;
                },
                setProgressIndicatorStyles: function setProgressIndicatorStyles() {
                    return undefined;
                },
                setRowCheckboxCheckedAtIndex: function setRowCheckboxCheckedAtIndex() {
                    return undefined;
                },
                setSortStatusLabelByHeaderCellIndex: function setSortStatusLabelByHeaderCellIndex() {
                    return undefined;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Re-initializes header row checkbox and row checkboxes when selectable rows are added or removed from table.
     * Use this if registering checkbox is synchronous.
     */
    MDCDataTableFoundation.prototype.layout = function () {
        if (this.adapter.isRowsSelectable()) {
            this.adapter.registerHeaderRowCheckbox();
            this.adapter.registerRowCheckboxes();
            this.setHeaderRowCheckboxState();
        }
    };
    /**
     * Re-initializes header row checkbox and row checkboxes when selectable rows are added or removed from table.
     * Use this if registering checkbox is asynchronous.
     */
    MDCDataTableFoundation.prototype.layoutAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.adapter.isRowsSelectable()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.adapter.registerHeaderRowCheckbox()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.adapter.registerRowCheckboxes()];
                    case 2:
                        _a.sent();
                        this.setHeaderRowCheckboxState();
                        _a.label = 3;
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return Returns array of row elements.
     */
    MDCDataTableFoundation.prototype.getRows = function () {
        return this.adapter.getRowElements();
    };
    /**
     * @return Array of header cell elements.
     */
    MDCDataTableFoundation.prototype.getHeaderCells = function () {
        return this.adapter.getHeaderCellElements();
    };
    /**
     * Sets selected row ids. Overwrites previously selected rows.
     * @param rowIds Array of row ids that needs to be selected.
     */
    MDCDataTableFoundation.prototype.setSelectedRowIds = function (rowIds) {
        for (var rowIndex = 0; rowIndex < this.adapter.getRowCount(); rowIndex++) {
            var rowId = this.adapter.getRowIdAtIndex(rowIndex);
            var isSelected = false;
            if (rowId && rowIds.indexOf(rowId) >= 0) {
                isSelected = true;
            }
            this.adapter.setRowCheckboxCheckedAtIndex(rowIndex, isSelected);
            this.selectRowAtIndex(rowIndex, isSelected);
        }
        this.setHeaderRowCheckboxState();
    };
    /**
     * @return Returns array of all row ids.
     */
    MDCDataTableFoundation.prototype.getRowIds = function () {
        var rowIds = [];
        for (var rowIndex = 0; rowIndex < this.adapter.getRowCount(); rowIndex++) {
            rowIds.push(this.adapter.getRowIdAtIndex(rowIndex));
        }
        return rowIds;
    };
    /**
     * @return Returns array of selected row ids.
     */
    MDCDataTableFoundation.prototype.getSelectedRowIds = function () {
        var selectedRowIds = [];
        for (var rowIndex = 0; rowIndex < this.adapter.getRowCount(); rowIndex++) {
            if (this.adapter.isCheckboxAtRowIndexChecked(rowIndex)) {
                selectedRowIds.push(this.adapter.getRowIdAtIndex(rowIndex));
            }
        }
        return selectedRowIds;
    };
    /**
     * Handles header row checkbox change event.
     */
    MDCDataTableFoundation.prototype.handleHeaderRowCheckboxChange = function () {
        var isHeaderChecked = this.adapter.isHeaderRowCheckboxChecked();
        for (var rowIndex = 0; rowIndex < this.adapter.getRowCount(); rowIndex++) {
            this.adapter.setRowCheckboxCheckedAtIndex(rowIndex, isHeaderChecked);
            this.selectRowAtIndex(rowIndex, isHeaderChecked);
        }
        if (isHeaderChecked) {
            this.adapter.notifySelectedAll();
        } else {
            this.adapter.notifyUnselectedAll();
        }
    };
    /**
     * Handles change event originated from row checkboxes.
     */
    MDCDataTableFoundation.prototype.handleRowCheckboxChange = function (event) {
        var rowIndex = this.adapter.getRowIndexByChildElement(event.target);
        if (rowIndex === -1) {
            return;
        }
        var selected = this.adapter.isCheckboxAtRowIndexChecked(rowIndex);
        this.selectRowAtIndex(rowIndex, selected);
        this.setHeaderRowCheckboxState();
        var rowId = this.adapter.getRowIdAtIndex(rowIndex);
        this.adapter.notifyRowSelectionChanged({ rowId: rowId, rowIndex: rowIndex, selected: selected });
    };
    /**
     * Handles sort action on sortable header cell.
     */
    MDCDataTableFoundation.prototype.handleSortAction = function (eventData) {
        var columnId = eventData.columnId,
            columnIndex = eventData.columnIndex,
            headerCell = eventData.headerCell;
        // Reset sort attributes / classes on other header cells.
        for (var index = 0; index < this.adapter.getHeaderCellCount(); index++) {
            if (index === columnIndex) {
                continue;
            }
            this.adapter.removeClassNameByHeaderCellIndex(index, constants_1.cssClasses.HEADER_CELL_SORTED);
            this.adapter.removeClassNameByHeaderCellIndex(index, constants_1.cssClasses.HEADER_CELL_SORTED_DESCENDING);
            this.adapter.setAttributeByHeaderCellIndex(index, constants_1.strings.ARIA_SORT, constants_1.SortValue.NONE);
            this.adapter.setSortStatusLabelByHeaderCellIndex(index, constants_1.SortValue.NONE);
        }
        // Set appropriate sort attributes / classes on target header cell.
        this.adapter.setClassNameByHeaderCellIndex(columnIndex, constants_1.cssClasses.HEADER_CELL_SORTED);
        var currentSortValue = this.adapter.getAttributeByHeaderCellIndex(columnIndex, constants_1.strings.ARIA_SORT);
        var sortValue = constants_1.SortValue.NONE;
        // Set to descending if sorted on ascending order.
        if (currentSortValue === constants_1.SortValue.ASCENDING) {
            this.adapter.setClassNameByHeaderCellIndex(columnIndex, constants_1.cssClasses.HEADER_CELL_SORTED_DESCENDING);
            this.adapter.setAttributeByHeaderCellIndex(columnIndex, constants_1.strings.ARIA_SORT, constants_1.SortValue.DESCENDING);
            sortValue = constants_1.SortValue.DESCENDING;
            // Set to ascending if sorted on descending order.
        } else if (currentSortValue === constants_1.SortValue.DESCENDING) {
            this.adapter.removeClassNameByHeaderCellIndex(columnIndex, constants_1.cssClasses.HEADER_CELL_SORTED_DESCENDING);
            this.adapter.setAttributeByHeaderCellIndex(columnIndex, constants_1.strings.ARIA_SORT, constants_1.SortValue.ASCENDING);
            sortValue = constants_1.SortValue.ASCENDING;
        } else {
            // Set to ascending by default when not sorted.
            this.adapter.setAttributeByHeaderCellIndex(columnIndex, constants_1.strings.ARIA_SORT, constants_1.SortValue.ASCENDING);
            sortValue = constants_1.SortValue.ASCENDING;
        }
        this.adapter.setSortStatusLabelByHeaderCellIndex(columnIndex, sortValue);
        this.adapter.notifySortAction({
            columnId: columnId,
            columnIndex: columnIndex,
            headerCell: headerCell,
            sortValue: sortValue
        });
    };
    /**
     * Shows progress indicator blocking only the table body content when in
     * loading state.
     */
    MDCDataTableFoundation.prototype.showProgress = function () {
        var tableHeaderHeight = this.adapter.getTableHeaderHeight();
        // Calculate the height of table content (Not scroll content) excluding
        // header row height.
        var height = this.adapter.getTableContainerHeight() - tableHeaderHeight;
        var top = tableHeaderHeight;
        this.adapter.setProgressIndicatorStyles({
            height: height + "px",
            top: top + "px"
        });
        this.adapter.addClass(constants_1.cssClasses.IN_PROGRESS);
    };
    /**
     * Hides progress indicator when data table is finished loading.
     */
    MDCDataTableFoundation.prototype.hideProgress = function () {
        this.adapter.removeClass(constants_1.cssClasses.IN_PROGRESS);
    };
    /**
     * Updates header row checkbox state based on number of rows selected.
     */
    MDCDataTableFoundation.prototype.setHeaderRowCheckboxState = function () {
        if (this.adapter.getSelectedRowCount() === 0) {
            this.adapter.setHeaderRowCheckboxChecked(false);
            this.adapter.setHeaderRowCheckboxIndeterminate(false);
        } else if (this.adapter.getSelectedRowCount() === this.adapter.getRowCount()) {
            this.adapter.setHeaderRowCheckboxChecked(true);
            this.adapter.setHeaderRowCheckboxIndeterminate(false);
        } else {
            this.adapter.setHeaderRowCheckboxIndeterminate(true);
            this.adapter.setHeaderRowCheckboxChecked(false);
        }
    };
    /**
     * Sets the attributes of row element based on selection state.
     */
    MDCDataTableFoundation.prototype.selectRowAtIndex = function (rowIndex, selected) {
        if (selected) {
            this.adapter.addClassAtRowIndex(rowIndex, constants_1.cssClasses.ROW_SELECTED);
            this.adapter.setAttributeAtRowIndex(rowIndex, constants_1.strings.ARIA_SELECTED, 'true');
        } else {
            this.adapter.removeClassAtRowIndex(rowIndex, constants_1.cssClasses.ROW_SELECTED);
            this.adapter.setAttributeAtRowIndex(rowIndex, constants_1.strings.ARIA_SELECTED, 'false');
        }
    };
    return MDCDataTableFoundation;
}(foundation_1.MDCFoundation);
exports.MDCDataTableFoundation = MDCDataTableFoundation;

/***/ }),

/***/ "./packages/mdc-data-table/index.ts":
/*!******************************************!*\
  !*** ./packages/mdc-data-table/index.ts ***!
  \******************************************/
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
__exportStar(__webpack_require__(/*! ./adapter */ "./packages/mdc-data-table/adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./component */ "./packages/mdc-data-table/component.ts"), exports);
__exportStar(__webpack_require__(/*! ./foundation */ "./packages/mdc-data-table/foundation.ts"), exports);
__exportStar(__webpack_require__(/*! ./constants */ "./packages/mdc-data-table/constants.ts"), exports);
__exportStar(__webpack_require__(/*! ./types */ "./packages/mdc-data-table/types.ts"), exports);

/***/ }),

/***/ "./packages/mdc-data-table/types.ts":
/*!******************************************!*\
  !*** ./packages/mdc-data-table/types.ts ***!
  \******************************************/
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

/***/ "./packages/mdc-linear-progress/component.ts":
/*!***************************************************!*\
  !*** ./packages/mdc-linear-progress/component.ts ***!
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
exports.MDCLinearProgress = void 0;
var component_1 = __webpack_require__(/*! @material/base/component */ "./packages/mdc-base/component.ts");
var foundation_1 = __webpack_require__(/*! ./foundation */ "./packages/mdc-linear-progress/foundation.ts");
var MDCLinearProgress = /** @class */function (_super) {
    __extends(MDCLinearProgress, _super);
    function MDCLinearProgress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCLinearProgress.attachTo = function (root) {
        return new MDCLinearProgress(root);
    };
    Object.defineProperty(MDCLinearProgress.prototype, "determinate", {
        set: function set(value) {
            this.foundation.setDeterminate(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCLinearProgress.prototype, "progress", {
        set: function set(value) {
            this.foundation.setProgress(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCLinearProgress.prototype, "buffer", {
        set: function set(value) {
            this.foundation.setBuffer(value);
        },
        enumerable: false,
        configurable: true
    });
    MDCLinearProgress.prototype.open = function () {
        this.foundation.open();
    };
    MDCLinearProgress.prototype.close = function () {
        this.foundation.close();
    };
    MDCLinearProgress.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.root.addEventListener('transitionend', function () {
            _this.foundation.handleTransitionEnd();
        });
    };
    MDCLinearProgress.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take
        // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
        // methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addClass: function addClass(className) {
                _this.root.classList.add(className);
            },
            forceLayout: function forceLayout() {
                _this.root.getBoundingClientRect();
            },
            setBufferBarStyle: function setBufferBarStyle(styleProperty, value) {
                var bufferBar = _this.root.querySelector(foundation_1.MDCLinearProgressFoundation.strings.BUFFER_BAR_SELECTOR);
                if (bufferBar) {
                    bufferBar.style.setProperty(styleProperty, value);
                }
            },
            setPrimaryBarStyle: function setPrimaryBarStyle(styleProperty, value) {
                var primaryBar = _this.root.querySelector(foundation_1.MDCLinearProgressFoundation.strings.PRIMARY_BAR_SELECTOR);
                if (primaryBar) {
                    primaryBar.style.setProperty(styleProperty, value);
                }
            },
            hasClass: function hasClass(className) {
                return _this.root.classList.contains(className);
            },
            removeAttribute: function removeAttribute(attributeName) {
                _this.root.removeAttribute(attributeName);
            },
            removeClass: function removeClass(className) {
                _this.root.classList.remove(className);
            },
            setAttribute: function setAttribute(attributeName, value) {
                _this.root.setAttribute(attributeName, value);
            },
            setStyle: function setStyle(name, value) {
                _this.root.style.setProperty(name, value);
            },
            attachResizeObserver: function attachResizeObserver(callback) {
                var RO = window.ResizeObserver;
                if (RO) {
                    var ro = new RO(callback);
                    ro.observe(_this.root);
                    return ro;
                }
                return null;
            },
            getWidth: function getWidth() {
                return _this.root.offsetWidth;
            }
        };
        return new foundation_1.MDCLinearProgressFoundation(adapter);
    };
    return MDCLinearProgress;
}(component_1.MDCComponent);
exports.MDCLinearProgress = MDCLinearProgress;

/***/ }),

/***/ "./packages/mdc-linear-progress/constants.ts":
/*!***************************************************!*\
  !*** ./packages/mdc-linear-progress/constants.ts ***!
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

Object.defineProperty(exports, "__esModule", { value: true });
exports.animationDimensionPercentages = exports.strings = exports.cssClasses = void 0;
exports.cssClasses = {
    CLOSED_CLASS: 'mdc-linear-progress--closed',
    CLOSED_ANIMATION_OFF_CLASS: 'mdc-linear-progress--closed-animation-off',
    INDETERMINATE_CLASS: 'mdc-linear-progress--indeterminate',
    REVERSED_CLASS: 'mdc-linear-progress--reversed',
    ANIMATION_READY_CLASS: 'mdc-linear-progress--animation-ready'
};
exports.strings = {
    ARIA_HIDDEN: 'aria-hidden',
    ARIA_VALUEMAX: 'aria-valuemax',
    ARIA_VALUEMIN: 'aria-valuemin',
    ARIA_VALUENOW: 'aria-valuenow',
    BUFFER_BAR_SELECTOR: '.mdc-linear-progress__buffer-bar',
    FLEX_BASIS: 'flex-basis',
    PRIMARY_BAR_SELECTOR: '.mdc-linear-progress__primary-bar'
};
// these are percentages pulled from keyframes.scss
exports.animationDimensionPercentages = {
    PRIMARY_HALF: .8367142,
    PRIMARY_FULL: 2.00611057,
    SECONDARY_QUARTER: .37651913,
    SECONDARY_HALF: .84386165,
    SECONDARY_FULL: 1.60277782
};

/***/ }),

/***/ "./packages/mdc-linear-progress/foundation.ts":
/*!****************************************************!*\
  !*** ./packages/mdc-linear-progress/foundation.ts ***!
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
exports.MDCLinearProgressFoundation = void 0;
var util_1 = __webpack_require__(/*! @material/animation/util */ "./packages/mdc-animation/util.ts");
var foundation_1 = __webpack_require__(/*! @material/base/foundation */ "./packages/mdc-base/foundation.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-linear-progress/constants.ts");
var MDCLinearProgressFoundation = /** @class */function (_super) {
    __extends(MDCLinearProgressFoundation, _super);
    function MDCLinearProgressFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCLinearProgressFoundation.defaultAdapter), adapter)) || this;
        _this.observer = null;
        return _this;
    }
    Object.defineProperty(MDCLinearProgressFoundation, "cssClasses", {
        get: function get() {
            return constants_1.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCLinearProgressFoundation, "strings", {
        get: function get() {
            return constants_1.strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCLinearProgressFoundation, "defaultAdapter", {
        get: function get() {
            return {
                addClass: function addClass() {
                    return undefined;
                },
                attachResizeObserver: function attachResizeObserver() {
                    return null;
                },
                forceLayout: function forceLayout() {
                    return undefined;
                },
                getWidth: function getWidth() {
                    return 0;
                },
                hasClass: function hasClass() {
                    return false;
                },
                setBufferBarStyle: function setBufferBarStyle() {
                    return null;
                },
                setPrimaryBarStyle: function setPrimaryBarStyle() {
                    return null;
                },
                setStyle: function setStyle() {
                    return undefined;
                },
                removeAttribute: function removeAttribute() {
                    return undefined;
                },
                removeClass: function removeClass() {
                    return undefined;
                },
                setAttribute: function setAttribute() {
                    return undefined;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCLinearProgressFoundation.prototype.init = function () {
        var _this = this;
        this.determinate = !this.adapter.hasClass(constants_1.cssClasses.INDETERMINATE_CLASS);
        this.adapter.addClass(constants_1.cssClasses.ANIMATION_READY_CLASS);
        this.progress = 0;
        this.buffer = 1;
        this.observer = this.adapter.attachResizeObserver(function (entries) {
            var e_1, _a;
            if (_this.determinate) {
                return;
            }
            try {
                for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                    var entry = entries_1_1.value;
                    if (entry.contentRect) {
                        _this.calculateAndSetDimensions(entry.contentRect.width);
                    }
                }
            } catch (e_1_1) {
                e_1 = { error: e_1_1 };
            } finally {
                try {
                    if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                } finally {
                    if (e_1) throw e_1.error;
                }
            }
        });
        if (!this.determinate && this.observer) {
            this.calculateAndSetDimensions(this.adapter.getWidth());
        }
    };
    MDCLinearProgressFoundation.prototype.setDeterminate = function (isDeterminate) {
        this.determinate = isDeterminate;
        if (this.determinate) {
            this.adapter.removeClass(constants_1.cssClasses.INDETERMINATE_CLASS);
            this.adapter.setAttribute(constants_1.strings.ARIA_VALUENOW, this.progress.toString());
            this.adapter.setAttribute(constants_1.strings.ARIA_VALUEMAX, '1');
            this.adapter.setAttribute(constants_1.strings.ARIA_VALUEMIN, '0');
            this.setPrimaryBarProgress(this.progress);
            this.setBufferBarProgress(this.buffer);
            return;
        }
        if (this.observer) {
            this.calculateAndSetDimensions(this.adapter.getWidth());
        }
        this.adapter.addClass(constants_1.cssClasses.INDETERMINATE_CLASS);
        this.adapter.removeAttribute(constants_1.strings.ARIA_VALUENOW);
        this.adapter.removeAttribute(constants_1.strings.ARIA_VALUEMAX);
        this.adapter.removeAttribute(constants_1.strings.ARIA_VALUEMIN);
        this.setPrimaryBarProgress(1);
        this.setBufferBarProgress(1);
    };
    MDCLinearProgressFoundation.prototype.isDeterminate = function () {
        return this.determinate;
    };
    MDCLinearProgressFoundation.prototype.setProgress = function (value) {
        this.progress = value;
        if (this.determinate) {
            this.setPrimaryBarProgress(value);
            this.adapter.setAttribute(constants_1.strings.ARIA_VALUENOW, value.toString());
        }
    };
    MDCLinearProgressFoundation.prototype.getProgress = function () {
        return this.progress;
    };
    MDCLinearProgressFoundation.prototype.setBuffer = function (value) {
        this.buffer = value;
        if (this.determinate) {
            this.setBufferBarProgress(value);
        }
    };
    MDCLinearProgressFoundation.prototype.getBuffer = function () {
        return this.buffer;
    };
    MDCLinearProgressFoundation.prototype.open = function () {
        this.adapter.removeClass(constants_1.cssClasses.CLOSED_CLASS);
        this.adapter.removeClass(constants_1.cssClasses.CLOSED_ANIMATION_OFF_CLASS);
        this.adapter.removeAttribute(constants_1.strings.ARIA_HIDDEN);
    };
    MDCLinearProgressFoundation.prototype.close = function () {
        this.adapter.addClass(constants_1.cssClasses.CLOSED_CLASS);
        this.adapter.setAttribute(constants_1.strings.ARIA_HIDDEN, 'true');
    };
    MDCLinearProgressFoundation.prototype.isClosed = function () {
        return this.adapter.hasClass(constants_1.cssClasses.CLOSED_CLASS);
    };
    /**
     * Handles the transitionend event emitted after `close()` is called and the
     * opacity fades out. This is so that animations are removed only after the
     * progress indicator is completely hidden.
     */
    MDCLinearProgressFoundation.prototype.handleTransitionEnd = function () {
        if (this.adapter.hasClass(constants_1.cssClasses.CLOSED_CLASS)) {
            this.adapter.addClass(constants_1.cssClasses.CLOSED_ANIMATION_OFF_CLASS);
        }
    };
    MDCLinearProgressFoundation.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.observer) {
            this.observer.disconnect();
        }
    };
    MDCLinearProgressFoundation.prototype.restartAnimation = function () {
        this.adapter.removeClass(constants_1.cssClasses.ANIMATION_READY_CLASS);
        this.adapter.forceLayout();
        this.adapter.addClass(constants_1.cssClasses.ANIMATION_READY_CLASS);
    };
    MDCLinearProgressFoundation.prototype.setPrimaryBarProgress = function (progressValue) {
        var value = "scaleX(" + progressValue + ")";
        // Accessing `window` without a `typeof` check will throw on Node
        // environments.
        var transformProp = typeof window !== 'undefined' ? util_1.getCorrectPropertyName(window, 'transform') : 'transform';
        this.adapter.setPrimaryBarStyle(transformProp, value);
    };
    MDCLinearProgressFoundation.prototype.setBufferBarProgress = function (progressValue) {
        var value = progressValue * 100 + "%";
        this.adapter.setBufferBarStyle(constants_1.strings.FLEX_BASIS, value);
    };
    MDCLinearProgressFoundation.prototype.calculateAndSetDimensions = function (width) {
        var primaryHalf = width * constants_1.animationDimensionPercentages.PRIMARY_HALF;
        var primaryFull = width * constants_1.animationDimensionPercentages.PRIMARY_FULL;
        var secondaryQuarter = width * constants_1.animationDimensionPercentages.SECONDARY_QUARTER;
        var secondaryHalf = width * constants_1.animationDimensionPercentages.SECONDARY_HALF;
        var secondaryFull = width * constants_1.animationDimensionPercentages.SECONDARY_FULL;
        this.adapter.setStyle('--mdc-linear-progress-primary-half', primaryHalf + "px");
        this.adapter.setStyle('--mdc-linear-progress-primary-half-neg', -primaryHalf + "px");
        this.adapter.setStyle('--mdc-linear-progress-primary-full', primaryFull + "px");
        this.adapter.setStyle('--mdc-linear-progress-primary-full-neg', -primaryFull + "px");
        this.adapter.setStyle('--mdc-linear-progress-secondary-quarter', secondaryQuarter + "px");
        this.adapter.setStyle('--mdc-linear-progress-secondary-quarter-neg', -secondaryQuarter + "px");
        this.adapter.setStyle('--mdc-linear-progress-secondary-half', secondaryHalf + "px");
        this.adapter.setStyle('--mdc-linear-progress-secondary-half-neg', -secondaryHalf + "px");
        this.adapter.setStyle('--mdc-linear-progress-secondary-full', secondaryFull + "px");
        this.adapter.setStyle('--mdc-linear-progress-secondary-full-neg', -secondaryFull + "px");
        // need to restart animation for custom props to apply to keyframes
        this.restartAnimation();
    };
    return MDCLinearProgressFoundation;
}(foundation_1.MDCFoundation);
exports.MDCLinearProgressFoundation = MDCLinearProgressFoundation;
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = MDCLinearProgressFoundation;

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

/***/ })

/******/ });
});
//# sourceMappingURL=mdc.dataTable.js.map