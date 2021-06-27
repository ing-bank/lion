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
		exports["autoInit"] = factory();
	else
		root["mdc"] = root["mdc"] || {}, root["mdc"]["autoInit"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/mdc-auto-init/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./packages/mdc-auto-init/constants.ts":
/*!*********************************************!*\
  !*** ./packages/mdc-auto-init/constants.ts ***!
  \*********************************************/
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
exports.strings = void 0;
exports.strings = {
  AUTO_INIT_ATTR: 'data-mdc-auto-init',
  AUTO_INIT_STATE_ATTR: 'data-mdc-auto-init-state',
  INITIALIZED_STATE: 'initialized'
};

/***/ }),

/***/ "./packages/mdc-auto-init/index.ts":
/*!*****************************************!*\
  !*** ./packages/mdc-auto-init/index.ts ***!
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
exports.mdcAutoInit = void 0;
var constants_1 = __webpack_require__(/*! ./constants */ "./packages/mdc-auto-init/constants.ts");
var AUTO_INIT_ATTR = constants_1.strings.AUTO_INIT_ATTR,
    AUTO_INIT_STATE_ATTR = constants_1.strings.AUTO_INIT_STATE_ATTR,
    INITIALIZED_STATE = constants_1.strings.INITIALIZED_STATE;
var registry = {};
var CONSOLE_WARN = console.warn.bind(console); // tslint:disable-line:no-console
function emit(evtType, evtData, shouldBubble) {
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
    document.dispatchEvent(evt);
}
/* istanbul ignore next: optional argument is not a branch statement */
/**
 * Auto-initializes all MDC components on a page.
 */
function mdcAutoInit(root) {
    var e_1, _a;
    if (root === void 0) {
        root = document;
    }
    var components = [];
    var nodes = [].slice.call(root.querySelectorAll("[" + AUTO_INIT_ATTR + "]"));
    nodes = nodes.filter(function (node) {
        return node.getAttribute(AUTO_INIT_STATE_ATTR) !== INITIALIZED_STATE;
    });
    try {
        for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
            var node = nodes_1_1.value;
            var ctorName = node.getAttribute(AUTO_INIT_ATTR);
            if (!ctorName) {
                throw new Error('(mdc-auto-init) Constructor name must be given.');
            }
            var Constructor = registry[ctorName]; // tslint:disable-line:variable-name
            if (typeof Constructor !== 'function') {
                throw new Error("(mdc-auto-init) Could not find constructor in registry for " + ctorName);
            }
            // TODO: Should we make an eslint rule for an attachTo() static method?
            // See https://github.com/Microsoft/TypeScript/issues/14600 for discussion of static interface support in TS
            var component = Constructor.attachTo(node);
            Object.defineProperty(node, ctorName, {
                configurable: true,
                enumerable: false,
                value: component,
                writable: false
            });
            components.push(component);
            node.setAttribute(AUTO_INIT_STATE_ATTR, INITIALIZED_STATE);
        }
    } catch (e_1_1) {
        e_1 = { error: e_1_1 };
    } finally {
        try {
            if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
        } finally {
            if (e_1) throw e_1.error;
        }
    }
    emit('MDCAutoInit:End', {});
    return components;
}
exports.mdcAutoInit = mdcAutoInit;
// Constructor is PascalCased because it is a direct reference to a class, rather than an instance of a class.
// tslint:disable-next-line:variable-name
mdcAutoInit.register = function (componentName, Constructor, warn) {
    if (warn === void 0) {
        warn = CONSOLE_WARN;
    }
    if (typeof Constructor !== 'function') {
        throw new Error("(mdc-auto-init) Invalid Constructor value: " + Constructor + ". Expected function.");
    }
    var registryValue = registry[componentName];
    if (registryValue) {
        warn("(mdc-auto-init) Overriding registration for " + componentName + " with " + Constructor + ". Was: " + registryValue);
    }
    registry[componentName] = Constructor;
};
mdcAutoInit.deregister = function (componentName) {
    delete registry[componentName];
};
/** @nocollapse */
mdcAutoInit.deregisterAll = function () {
    var keys = Object.keys(registry);
    keys.forEach(this.deregister, this);
};
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
exports.default = mdcAutoInit;

/***/ })

/******/ });
});
//# sourceMappingURL=mdc.autoInit.js.map