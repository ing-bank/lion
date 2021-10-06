/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/material-components/material-components-web/blob/master/LICENSE
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof exports === 'object') exports['chips'] = factory();
  else (root['mdc'] = root['mdc'] || {}), (root['mdc']['chips'] = factory());
})(this, function () {
  return /******/ (function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      }
      /******/ // Create a new module (and put it into the cache)
      /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      });
      /******/
      /******/ // Execute the module function
      /******/ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/
      /******/ // Flag the module as loaded
      /******/ module.l = true;
      /******/
      /******/ // Return the exports of the module
      /******/ return module.exports;
      /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/ __webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/ __webpack_require__.c = installedModules;
    /******/
    /******/ // define getter function for harmony exports
    /******/ __webpack_require__.d = function (exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, { enumerable: true, get: getter });
        /******/
      }
      /******/
    };
    /******/
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = function (exports) {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    };
    /******/
    /******/ // create a fake namespace object
    /******/ // mode & 1: value is a module id, require it
    /******/ // mode & 2: merge all properties of value into the ns
    /******/ // mode & 4: return value when already ns object
    /******/ // mode & 8|1: behave like require
    /******/ __webpack_require__.t = function (value, mode) {
      /******/ if (mode & 1) value = __webpack_require__(value);
      /******/ if (mode & 8) return value;
      /******/ if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
      /******/ var ns = Object.create(null);
      /******/ __webpack_require__.r(ns);
      /******/ Object.defineProperty(ns, 'default', { enumerable: true, value: value });
      /******/ if (mode & 2 && typeof value != 'string')
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function (key) {
              return value[key];
            }.bind(null, key),
          );
      /******/ return ns;
      /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = function (module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module['default'];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, 'a', getter);
      /******/ return getter;
      /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/ __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/ __webpack_require__.p = '';
    /******/
    /******/
    /******/ // Load entry module and return exports
    /******/ return __webpack_require__((__webpack_require__.s = './packages/mdc-chips/index.ts'));
    /******/
  })(
    /************************************************************************/
    /******/ {
      /***/ './packages/mdc-animation/animationframe.ts':
        /*!**************************************************!*\
  !*** ./packages/mdc-animation/animationframe.ts ***!
  \**************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.AnimationFrame = void 0;
          /**
           * AnimationFrame provides a user-friendly abstraction around requesting
           * and canceling animation frames.
           */
          var AnimationFrame = /** @class */ (function () {
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
          })();
          exports.AnimationFrame = AnimationFrame;

          /***/
        },

      /***/ './packages/mdc-base/component.ts':
        /*!****************************************!*\
  !*** ./packages/mdc-base/component.ts ***!
  \****************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __read =
            (this && this.__read) ||
            function (o, n) {
              var m = typeof Symbol === 'function' && o[Symbol.iterator];
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
                  if (r && !r.done && (m = i['return'])) m.call(i);
                } finally {
                  if (e) throw e.error;
                }
              }
              return ar;
            };
          var __spreadArray =
            (this && this.__spreadArray) ||
            function (to, from) {
              for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) {
                to[j] = from[i];
              }
              return to;
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCComponent = void 0;
          var foundation_1 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-base/foundation.ts',
          );
          var MDCComponent = /** @class */ (function () {
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
              throw new Error(
                'Subclasses must override getDefaultFoundation to return a properly configured ' +
                  'foundation class',
              );
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
                  detail: evtData,
                });
              } else {
                evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(evtType, shouldBubble, false, evtData);
              }
              this.root.dispatchEvent(evt);
            };
            return MDCComponent;
          })();
          exports.MDCComponent = MDCComponent;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCComponent;

          /***/
        },

      /***/ './packages/mdc-base/foundation.ts':
        /*!*****************************************!*\
  !*** ./packages/mdc-base/foundation.ts ***!
  \*****************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCFoundation = void 0;
          var MDCFoundation = /** @class */ (function () {
            function MDCFoundation(adapter) {
              if (adapter === void 0) {
                adapter = {};
              }
              this.adapter = adapter;
            }
            Object.defineProperty(MDCFoundation, 'cssClasses', {
              get: function get() {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCFoundation, 'strings', {
              get: function get() {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCFoundation, 'numbers', {
              get: function get() {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCFoundation, 'defaultAdapter', {
              get: function get() {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
              },
              enumerable: false,
              configurable: true,
            });
            MDCFoundation.prototype.init = function () {
              // Subclasses should override this method to perform initialization routines (registering events, etc.)
            };
            MDCFoundation.prototype.destroy = function () {
              // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
            };
            return MDCFoundation;
          })();
          exports.MDCFoundation = MDCFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/action/component-ripple.ts':
        /*!*******************************************************!*\
  !*** ./packages/mdc-chips/action/component-ripple.ts ***!
  \*******************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.GRAPHIC_SELECTED_WIDTH_STYLE_PROP = exports.computePrimaryActionRippleClientRect =
            void 0;
          /**
           * Computes the ripple client rect for the primary action given the raw client
           * rect and the selected width graphic style property.
           */
          function computePrimaryActionRippleClientRect(
            clientRect,
            graphicSelectedWidthStyleValue,
          ) {
            // parseInt is banned so we need to manually format and parse the string.
            var graphicWidth = Number(graphicSelectedWidthStyleValue.replace('px', ''));
            if (Number.isNaN(graphicWidth)) {
              return clientRect;
            }
            // Can't use the spread operator because it has internal problems
            return {
              width: clientRect.width + graphicWidth,
              height: clientRect.height,
              top: clientRect.top,
              right: clientRect.right,
              bottom: clientRect.bottom,
              left: clientRect.left,
            };
          }
          exports.computePrimaryActionRippleClientRect = computePrimaryActionRippleClientRect;
          /**
           * Provides the CSS custom property whose value is read by
           * computePrimaryRippleClientRect. The CSS custom property provides the width
           * of the chip graphic when selected. It is only set for the unselected chip
           * variant without a leadinc icon. In all other cases, it will have no value.
           */
          exports.GRAPHIC_SELECTED_WIDTH_STYLE_PROP = '--mdc-chip-graphic-selected-width';

          /***/
        },

      /***/ './packages/mdc-chips/action/component.ts':
        /*!************************************************!*\
  !*** ./packages/mdc-chips/action/component.ts ***!
  \************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipAction = void 0;
          var component_1 = __webpack_require__(
            /*! @material/base/component */ './packages/mdc-base/component.ts',
          );
          var ponyfill_1 = __webpack_require__(
            /*! @material/dom/ponyfill */ './packages/mdc-dom/ponyfill.ts',
          );
          var component_2 = __webpack_require__(
            /*! @material/ripple/component */ './packages/mdc-ripple/component.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! @material/ripple/foundation */ './packages/mdc-ripple/foundation.ts',
          );
          var component_ripple_1 = __webpack_require__(
            /*! ./component-ripple */ './packages/mdc-chips/action/component-ripple.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/action/constants.ts',
          );
          var primary_foundation_1 = __webpack_require__(
            /*! ./primary-foundation */ './packages/mdc-chips/action/primary-foundation.ts',
          );
          var trailing_foundation_1 = __webpack_require__(
            /*! ./trailing-foundation */ './packages/mdc-chips/action/trailing-foundation.ts',
          );
          /**
           * MDCChipAction provides component encapsulation of the different foundation
           * implementations.
           */
          var MDCChipAction = /** @class */ (function (_super) {
            __extends(MDCChipAction, _super);
            function MDCChipAction() {
              var _this = (_super !== null && _super.apply(this, arguments)) || this;
              _this.rootHTML = _this.root;
              return _this;
            }
            MDCChipAction.attachTo = function (root) {
              return new MDCChipAction(root);
            };
            Object.defineProperty(MDCChipAction.prototype, 'ripple', {
              get: function get() {
                return this.rippleInstance;
              },
              enumerable: false,
              configurable: true,
            });
            MDCChipAction.prototype.initialize = function (rippleFactory) {
              var _this = this;
              if (rippleFactory === void 0) {
                rippleFactory = function rippleFactory(el, foundation) {
                  return new component_2.MDCRipple(el, foundation);
                };
              }
              var rippleAdapter = __assign(
                __assign({}, component_2.MDCRipple.createAdapter(this)),
                {
                  computeBoundingRect: function computeBoundingRect() {
                    return _this.computeRippleClientRect();
                  },
                },
              );
              this.rippleInstance = rippleFactory(
                this.root,
                new foundation_1.MDCRippleFoundation(rippleAdapter),
              );
            };
            MDCChipAction.prototype.initialSyncWithDOM = function () {
              var _this = this;
              this.handleClick = function () {
                _this.foundation.handleClick();
              };
              this.handleKeydown = function (event) {
                _this.foundation.handleKeydown(event);
              };
              this.listen('click', this.handleClick);
              this.listen('keydown', this.handleKeydown);
            };
            MDCChipAction.prototype.destroy = function () {
              this.ripple.destroy();
              this.unlisten('click', this.handleClick);
              this.unlisten('keydown', this.handleKeydown);
              _super.prototype.destroy.call(this);
            };
            MDCChipAction.prototype.getDefaultFoundation = function () {
              var _this = this;
              // DO NOT INLINE this variable. For backward compatibility, foundations take
              // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
              // methods, we need a separate, strongly typed adapter variable.
              var adapter = {
                emitEvent: function emitEvent(eventName, eventDetail) {
                  _this.emit(eventName, eventDetail, true /* shouldBubble */);
                },
                focus: function focus() {
                  _this.rootHTML.focus();
                },
                getAttribute: function getAttribute(attrName) {
                  return _this.root.getAttribute(attrName);
                },
                getElementID: function getElementID() {
                  return _this.root.id;
                },
                removeAttribute: function removeAttribute(name) {
                  _this.root.removeAttribute(name);
                },
                setAttribute: function setAttribute(name, value) {
                  _this.root.setAttribute(name, value);
                },
              };
              if (this.root.classList.contains(constants_1.CssClasses.TRAILING_ACTION)) {
                return new trailing_foundation_1.MDCChipTrailingActionFoundation(adapter);
              }
              // Default to the primary foundation
              return new primary_foundation_1.MDCChipPrimaryActionFoundation(adapter);
            };
            MDCChipAction.prototype.setDisabled = function (isDisabled) {
              this.foundation.setDisabled(isDisabled);
            };
            MDCChipAction.prototype.isDisabled = function () {
              return this.foundation.isDisabled();
            };
            MDCChipAction.prototype.setFocus = function (behavior) {
              this.foundation.setFocus(behavior);
            };
            MDCChipAction.prototype.isFocusable = function () {
              return this.foundation.isFocusable();
            };
            MDCChipAction.prototype.setSelected = function (isSelected) {
              this.foundation.setSelected(isSelected);
            };
            MDCChipAction.prototype.isSelected = function () {
              return this.foundation.isSelected();
            };
            MDCChipAction.prototype.isSelectable = function () {
              return this.foundation.isSelectable();
            };
            MDCChipAction.prototype.actionType = function () {
              return this.foundation.actionType();
            };
            MDCChipAction.prototype.computeRippleClientRect = function () {
              if (this.root.classList.contains(constants_1.CssClasses.PRIMARY_ACTION)) {
                var chipRoot = ponyfill_1.closest(
                  this.root,
                  '.' + constants_1.CssClasses.CHIP_ROOT,
                );
                // Return the root client rect since it's better than nothing
                if (!chipRoot) return this.root.getBoundingClientRect();
                var graphicWidth = window
                  .getComputedStyle(chipRoot)
                  .getPropertyValue(component_ripple_1.GRAPHIC_SELECTED_WIDTH_STYLE_PROP);
                return component_ripple_1.computePrimaryActionRippleClientRect(
                  chipRoot.getBoundingClientRect(),
                  graphicWidth,
                );
              }
              return this.root.getBoundingClientRect();
            };
            return MDCChipAction;
          })(component_1.MDCComponent);
          exports.MDCChipAction = MDCChipAction;

          /***/
        },

      /***/ './packages/mdc-chips/action/constants.ts':
        /*!************************************************!*\
  !*** ./packages/mdc-chips/action/constants.ts ***!
  \************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.Attributes =
            exports.FocusBehavior =
            exports.Events =
            exports.ActionType =
            exports.InteractionTrigger =
            exports.CssClasses =
              void 0;
          /**
           * CssClasses provides the classes to be queried and manipulated on the root.
           */
          var CssClasses;
          (function (CssClasses) {
            CssClasses['PRIMARY_ACTION'] = 'mdc-evolution-chip__action--primary';
            CssClasses['TRAILING_ACTION'] = 'mdc-evolution-chip__action--trailing';
            CssClasses['CHIP_ROOT'] = 'mdc-evolution-chip';
          })((CssClasses = exports.CssClasses || (exports.CssClasses = {})));
          /**
           * InteractionTrigger provides detail of the different triggers for action
           * interactions.
           */
          var InteractionTrigger;
          (function (InteractionTrigger) {
            InteractionTrigger[(InteractionTrigger['UNSPECIFIED'] = 0)] = 'UNSPECIFIED';
            InteractionTrigger[(InteractionTrigger['CLICK'] = 1)] = 'CLICK';
            InteractionTrigger[(InteractionTrigger['BACKSPACE_KEY'] = 2)] = 'BACKSPACE_KEY';
            InteractionTrigger[(InteractionTrigger['DELETE_KEY'] = 3)] = 'DELETE_KEY';
            InteractionTrigger[(InteractionTrigger['SPACEBAR_KEY'] = 4)] = 'SPACEBAR_KEY';
            InteractionTrigger[(InteractionTrigger['ENTER_KEY'] = 5)] = 'ENTER_KEY';
          })(
            (InteractionTrigger = exports.InteractionTrigger || (exports.InteractionTrigger = {})),
          );
          /**
           * ActionType provides the different types of available actions.
           */
          var ActionType;
          (function (ActionType) {
            ActionType[(ActionType['UNSPECIFIED'] = 0)] = 'UNSPECIFIED';
            ActionType[(ActionType['PRIMARY'] = 1)] = 'PRIMARY';
            ActionType[(ActionType['TRAILING'] = 2)] = 'TRAILING';
          })((ActionType = exports.ActionType || (exports.ActionType = {})));
          /**
           * Events provides the different events emitted by the action.
           */
          var Events;
          (function (Events) {
            Events['INTERACTION'] = 'MDCChipAction:interaction';
            Events['NAVIGATION'] = 'MDCChipAction:navigation';
          })((Events = exports.Events || (exports.Events = {})));
          /**
           * FocusBehavior provides configurations for focusing or unfocusing an action.
           */
          var FocusBehavior;
          (function (FocusBehavior) {
            FocusBehavior[(FocusBehavior['FOCUSABLE'] = 0)] = 'FOCUSABLE';
            FocusBehavior[(FocusBehavior['FOCUSABLE_AND_FOCUSED'] = 1)] = 'FOCUSABLE_AND_FOCUSED';
            FocusBehavior[(FocusBehavior['NOT_FOCUSABLE'] = 2)] = 'NOT_FOCUSABLE';
          })((FocusBehavior = exports.FocusBehavior || (exports.FocusBehavior = {})));
          /**
           * Attributes provides the HTML attributes used by the foundation.
           */
          var Attributes;
          (function (Attributes) {
            Attributes['ARIA_DISABLED'] = 'aria-disabled';
            Attributes['ARIA_HIDDEN'] = 'aria-hidden';
            Attributes['ARIA_SELECTED'] = 'aria-selected';
            Attributes['DATA_DELETABLE'] = 'data-mdc-deletable';
            Attributes['DISABLED'] = 'disabled';
            Attributes['ROLE'] = 'role';
            Attributes['TAB_INDEX'] = 'tabindex';
          })((Attributes = exports.Attributes || (exports.Attributes = {})));

          /***/
        },

      /***/ './packages/mdc-chips/action/foundation.ts':
        /*!*************************************************!*\
  !*** ./packages/mdc-chips/action/foundation.ts ***!
  \*************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipActionFoundation = void 0;
          var foundation_1 = __webpack_require__(
            /*! @material/base/foundation */ './packages/mdc-base/foundation.ts',
          );
          var keyboard_1 = __webpack_require__(
            /*! @material/dom/keyboard */ './packages/mdc-dom/keyboard.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/action/constants.ts',
          );
          var triggerMap = new Map();
          triggerMap.set(keyboard_1.KEY.SPACEBAR, constants_1.InteractionTrigger.SPACEBAR_KEY);
          triggerMap.set(keyboard_1.KEY.ENTER, constants_1.InteractionTrigger.ENTER_KEY);
          triggerMap.set(keyboard_1.KEY.DELETE, constants_1.InteractionTrigger.DELETE_KEY);
          triggerMap.set(keyboard_1.KEY.BACKSPACE, constants_1.InteractionTrigger.BACKSPACE_KEY);
          /**
           * MDCChipActionFoundation provides a base abstract foundation for all chip
           * actions.
           */
          var MDCChipActionFoundation = /** @class */ (function (_super) {
            __extends(MDCChipActionFoundation, _super);
            function MDCChipActionFoundation(adapter) {
              return (
                _super.call(
                  this,
                  __assign(__assign({}, MDCChipActionFoundation.defaultAdapter), adapter),
                ) || this
              );
            }
            Object.defineProperty(MDCChipActionFoundation, 'defaultAdapter', {
              get: function get() {
                return {
                  emitEvent: function emitEvent() {
                    return undefined;
                  },
                  focus: function focus() {
                    return undefined;
                  },
                  getAttribute: function getAttribute() {
                    return null;
                  },
                  getElementID: function getElementID() {
                    return '';
                  },
                  removeAttribute: function removeAttribute() {
                    return undefined;
                  },
                  setAttribute: function setAttribute() {
                    return undefined;
                  },
                };
              },
              enumerable: false,
              configurable: true,
            });
            MDCChipActionFoundation.prototype.handleClick = function () {
              // Early exit for cases where the click comes from a source other than the
              // user's pointer (i.e. programmatic click from AT).
              if (this.isDisabled()) return;
              this.emitInteraction(constants_1.InteractionTrigger.CLICK);
            };
            MDCChipActionFoundation.prototype.handleKeydown = function (event) {
              var key = keyboard_1.normalizeKey(event);
              if (this.shouldNotifyInteractionFromKey(key)) {
                event.preventDefault();
                this.emitInteraction(this.getTriggerFromKey(key));
                return;
              }
              if (keyboard_1.isNavigationEvent(event)) {
                event.preventDefault();
                this.emitNavigation(key);
                return;
              }
            };
            MDCChipActionFoundation.prototype.setDisabled = function (isDisabled) {
              // Use `aria-disabled` for the selectable (listbox) disabled state
              if (this.isSelectable()) {
                this.adapter.setAttribute(constants_1.Attributes.ARIA_DISABLED, '' + isDisabled);
                return;
              }
              if (isDisabled) {
                this.adapter.setAttribute(constants_1.Attributes.DISABLED, 'true');
              } else {
                this.adapter.removeAttribute(constants_1.Attributes.DISABLED);
              }
            };
            MDCChipActionFoundation.prototype.isDisabled = function () {
              if (this.adapter.getAttribute(constants_1.Attributes.ARIA_DISABLED) === 'true') {
                return true;
              }
              if (this.adapter.getAttribute(constants_1.Attributes.DISABLED) !== null) {
                return true;
              }
              return false;
            };
            MDCChipActionFoundation.prototype.setFocus = function (behavior) {
              // Early exit if not focusable
              if (!this.isFocusable()) {
                return;
              }
              // Add it to the tab order and give focus
              if (behavior === constants_1.FocusBehavior.FOCUSABLE_AND_FOCUSED) {
                this.adapter.setAttribute(constants_1.Attributes.TAB_INDEX, '0');
                this.adapter.focus();
                return;
              }
              // Add to the tab order
              if (behavior === constants_1.FocusBehavior.FOCUSABLE) {
                this.adapter.setAttribute(constants_1.Attributes.TAB_INDEX, '0');
                return;
              }
              // Remove it from the tab order
              if (behavior === constants_1.FocusBehavior.NOT_FOCUSABLE) {
                this.adapter.setAttribute(constants_1.Attributes.TAB_INDEX, '-1');
                return;
              }
            };
            MDCChipActionFoundation.prototype.isFocusable = function () {
              if (this.isDisabled()) {
                return false;
              }
              if (this.adapter.getAttribute(constants_1.Attributes.ARIA_HIDDEN) === 'true') {
                return false;
              }
              return true;
            };
            MDCChipActionFoundation.prototype.setSelected = function (isSelected) {
              // Early exit if not selectable
              if (!this.isSelectable()) {
                return;
              }
              this.adapter.setAttribute(constants_1.Attributes.ARIA_SELECTED, '' + isSelected);
            };
            MDCChipActionFoundation.prototype.isSelected = function () {
              return this.adapter.getAttribute(constants_1.Attributes.ARIA_SELECTED) === 'true';
            };
            MDCChipActionFoundation.prototype.emitInteraction = function (trigger) {
              this.adapter.emitEvent(constants_1.Events.INTERACTION, {
                actionID: this.adapter.getElementID(),
                source: this.actionType(),
                trigger: trigger,
              });
            };
            MDCChipActionFoundation.prototype.emitNavigation = function (key) {
              this.adapter.emitEvent(constants_1.Events.NAVIGATION, {
                source: this.actionType(),
                key: key,
              });
            };
            MDCChipActionFoundation.prototype.shouldNotifyInteractionFromKey = function (key) {
              var isFromActionKey = key === keyboard_1.KEY.ENTER || key === keyboard_1.KEY.SPACEBAR;
              var isFromRemoveKey =
                key === keyboard_1.KEY.BACKSPACE || key === keyboard_1.KEY.DELETE;
              if (isFromActionKey) {
                return true;
              }
              if (isFromRemoveKey && this.shouldEmitInteractionOnRemoveKey()) {
                return true;
              }
              return false;
            };
            MDCChipActionFoundation.prototype.getTriggerFromKey = function (key) {
              var trigger = triggerMap.get(key);
              if (trigger) {
                return trigger;
              }
              // Default case, should ideally never be returned
              return constants_1.InteractionTrigger.UNSPECIFIED;
            };
            return MDCChipActionFoundation;
          })(foundation_1.MDCFoundation);
          exports.MDCChipActionFoundation = MDCChipActionFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCChipActionFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/action/primary-foundation.ts':
        /*!*********************************************************!*\
  !*** ./packages/mdc-chips/action/primary-foundation.ts ***!
  \*********************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipPrimaryActionFoundation = void 0;
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/action/constants.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-chips/action/foundation.ts',
          );
          /**
           * MDCChipPrimaryActionFoundation provides the business logic for the primary
           * chip action.
           */
          var MDCChipPrimaryActionFoundation = /** @class */ (function (_super) {
            __extends(MDCChipPrimaryActionFoundation, _super);
            function MDCChipPrimaryActionFoundation() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            MDCChipPrimaryActionFoundation.prototype.isSelectable = function () {
              return this.adapter.getAttribute(constants_1.Attributes.ROLE) === 'option';
            };
            MDCChipPrimaryActionFoundation.prototype.actionType = function () {
              return constants_1.ActionType.PRIMARY;
            };
            MDCChipPrimaryActionFoundation.prototype.shouldEmitInteractionOnRemoveKey =
              function () {
                return this.adapter.getAttribute(constants_1.Attributes.DATA_DELETABLE) === 'true';
              };
            return MDCChipPrimaryActionFoundation;
          })(foundation_1.MDCChipActionFoundation);
          exports.MDCChipPrimaryActionFoundation = MDCChipPrimaryActionFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCChipPrimaryActionFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/action/trailing-foundation.ts':
        /*!**********************************************************!*\
  !*** ./packages/mdc-chips/action/trailing-foundation.ts ***!
  \**********************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipTrailingActionFoundation = void 0;
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/action/constants.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-chips/action/foundation.ts',
          );
          /**
           * MDCChipTrailingActionFoundation provides the business logic for the trailing
           * chip action.
           */
          var MDCChipTrailingActionFoundation = /** @class */ (function (_super) {
            __extends(MDCChipTrailingActionFoundation, _super);
            function MDCChipTrailingActionFoundation() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            MDCChipTrailingActionFoundation.prototype.isSelectable = function () {
              return false;
            };
            MDCChipTrailingActionFoundation.prototype.actionType = function () {
              return constants_1.ActionType.TRAILING;
            };
            MDCChipTrailingActionFoundation.prototype.shouldEmitInteractionOnRemoveKey =
              function () {
                return true;
              };
            return MDCChipTrailingActionFoundation;
          })(foundation_1.MDCChipActionFoundation);
          exports.MDCChipTrailingActionFoundation = MDCChipTrailingActionFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCChipTrailingActionFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/chip-set/adapter.ts':
        /*!************************************************!*\
  !*** ./packages/mdc-chips/chip-set/adapter.ts ***!
  \************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });

          /***/
        },

      /***/ './packages/mdc-chips/chip-set/component.ts':
        /*!**************************************************!*\
  !*** ./packages/mdc-chips/chip-set/component.ts ***!
  \**************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipSet = void 0;
          var component_1 = __webpack_require__(
            /*! @material/base/component */ './packages/mdc-base/component.ts',
          );
          var announce_1 = __webpack_require__(
            /*! @material/dom/announce */ './packages/mdc-dom/announce.ts',
          );
          var component_2 = __webpack_require__(
            /*! ../chip/component */ './packages/mdc-chips/chip/component.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ../chip/constants */ './packages/mdc-chips/chip/constants.ts',
          );
          var constants_2 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/chip-set/constants.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-chips/chip-set/foundation.ts',
          );
          /**
           * MDCChip provides component encapsulation of the foundation implementation.
           */
          var MDCChipSet = /** @class */ (function (_super) {
            __extends(MDCChipSet, _super);
            function MDCChipSet() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            MDCChipSet.attachTo = function (root) {
              return new MDCChipSet(root);
            };
            MDCChipSet.prototype.initialize = function (chipFactory) {
              if (chipFactory === void 0) {
                chipFactory = function chipFactory(el) {
                  return new component_2.MDCChip(el);
                };
              }
              this.chips = [];
              var chipEls = this.root.querySelectorAll('.' + constants_2.CssClasses.CHIP);
              for (var i = 0; i < chipEls.length; i++) {
                var chip = chipFactory(chipEls[i]);
                this.chips.push(chip);
              }
            };
            MDCChipSet.prototype.initialSyncWithDOM = function () {
              var _this = this;
              this.handleChipAnimation = function (event) {
                _this.foundation.handleChipAnimation(event);
              };
              this.handleChipInteraction = function (event) {
                _this.foundation.handleChipInteraction(event);
              };
              this.handleChipNavigation = function (event) {
                _this.foundation.handleChipNavigation(event);
              };
              this.listen(constants_1.Events.ANIMATION, this.handleChipAnimation);
              this.listen(constants_1.Events.INTERACTION, this.handleChipInteraction);
              this.listen(constants_1.Events.NAVIGATION, this.handleChipNavigation);
            };
            MDCChipSet.prototype.destroy = function () {
              this.unlisten(constants_1.Events.ANIMATION, this.handleChipAnimation);
              this.unlisten(constants_1.Events.INTERACTION, this.handleChipInteraction);
              this.unlisten(constants_1.Events.NAVIGATION, this.handleChipNavigation);
              _super.prototype.destroy.call(this);
            };
            MDCChipSet.prototype.getDefaultFoundation = function () {
              var _this = this;
              // DO NOT INLINE this variable. For backward compatibility, foundations take
              // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
              // methods, we need a separate, strongly typed adapter variable.
              var adapter = {
                announceMessage: function announceMessage(message) {
                  announce_1.announce(message);
                },
                emitEvent: function emitEvent(eventName, eventDetail) {
                  _this.emit(eventName, eventDetail, true /* shouldBubble */);
                },
                getAttribute: function getAttribute(attrName) {
                  return _this.root.getAttribute(attrName);
                },
                getChipActionsAtIndex: function getChipActionsAtIndex(index) {
                  if (!_this.isIndexValid(index)) return [];
                  return _this.chips[index].getActions();
                },
                getChipCount: function getChipCount() {
                  return _this.chips.length;
                },
                getChipIdAtIndex: function getChipIdAtIndex(index) {
                  if (!_this.isIndexValid(index)) return '';
                  return _this.chips[index].getElementID();
                },
                getChipIndexById: function getChipIndexById(id) {
                  return _this.chips.findIndex(function (chip) {
                    return chip.getElementID() === id;
                  });
                },
                isChipFocusableAtIndex: function isChipFocusableAtIndex(index, action) {
                  if (!_this.isIndexValid(index)) return false;
                  return _this.chips[index].isActionFocusable(action);
                },
                isChipSelectableAtIndex: function isChipSelectableAtIndex(index, action) {
                  if (!_this.isIndexValid(index)) return false;
                  return _this.chips[index].isActionSelectable(action);
                },
                isChipSelectedAtIndex: function isChipSelectedAtIndex(index, action) {
                  if (!_this.isIndexValid(index)) return false;
                  return _this.chips[index].isActionSelected(action);
                },
                removeChipAtIndex: function removeChipAtIndex(index) {
                  if (!_this.isIndexValid(index)) return;
                  _this.chips[index].destroy();
                  _this.chips[index].remove();
                  _this.chips.splice(index, 1);
                },
                setChipFocusAtIndex: function setChipFocusAtIndex(index, action, focus) {
                  if (!_this.isIndexValid(index)) return;
                  _this.chips[index].setActionFocus(action, focus);
                },
                setChipSelectedAtIndex: function setChipSelectedAtIndex(index, action, selected) {
                  if (!_this.isIndexValid(index)) return;
                  _this.chips[index].setActionSelected(action, selected);
                },
                startChipAnimationAtIndex: function startChipAnimationAtIndex(index, animation) {
                  if (!_this.isIndexValid(index)) return;
                  _this.chips[index].startAnimation(animation);
                },
              };
              // Default to the primary foundation
              return new foundation_1.MDCChipSetFoundation(adapter);
            };
            /** Returns the index of the chip with the given ID or -1 if none exists. */
            MDCChipSet.prototype.getChipIndexByID = function (chipID) {
              return this.chips.findIndex(function (chip) {
                return chip.getElementID() === chipID;
              });
            };
            /**
             * Returns the ID of the chip at the given index or an empty string if the
             * index is out of bounds.
             */
            MDCChipSet.prototype.getChipIdAtIndex = function (index) {
              if (!this.isIndexValid(index)) return '';
              return this.chips[index].getElementID();
            };
            /** Returns the unique indexes of the selected chips. */
            MDCChipSet.prototype.getSelectedChipIndexes = function () {
              return this.foundation.getSelectedChipIndexes();
            };
            /** Sets the selection state of the chip. */
            MDCChipSet.prototype.setChipSelected = function (index, action, isSelected) {
              this.foundation.setChipSelected(index, action, isSelected);
            };
            /** Returns the selection state of the chip. */
            MDCChipSet.prototype.isChipSelected = function (index, action) {
              return this.foundation.isChipSelected(index, action);
            };
            /** Animates the chip addition at the given index. */
            MDCChipSet.prototype.addChip = function (index) {
              this.foundation.addChip(index);
            };
            /** Removes the chip at the given index. */
            MDCChipSet.prototype.removeChip = function (index) {
              this.foundation.removeChip(index);
            };
            MDCChipSet.prototype.isIndexValid = function (index) {
              return index > -1 && index < this.chips.length;
            };
            return MDCChipSet;
          })(component_1.MDCComponent);
          exports.MDCChipSet = MDCChipSet;

          /***/
        },

      /***/ './packages/mdc-chips/chip-set/constants.ts':
        /*!**************************************************!*\
  !*** ./packages/mdc-chips/chip-set/constants.ts ***!
  \**************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.Events = exports.CssClasses = exports.Attributes = void 0;
          /**
           * Events provides the named constants for strings used by the foundation.
           */
          var Attributes;
          (function (Attributes) {
            Attributes['ARIA_MULTISELECTABLE'] = 'aria-multiselectable';
          })((Attributes = exports.Attributes || (exports.Attributes = {})));
          /**
           * CssClasses provides the named constants for class names.
           */
          var CssClasses;
          (function (CssClasses) {
            CssClasses['CHIP'] = 'mdc-evolution-chip';
          })((CssClasses = exports.CssClasses || (exports.CssClasses = {})));
          /**
           * Events provides the constants for emitted events.
           */
          var Events;
          (function (Events) {
            Events['INTERACTION'] = 'MDCChipSet:interaction';
            Events['REMOVAL'] = 'MDCChipSet:removal';
            Events['SELECTION'] = 'MDCChipSet:selection';
          })((Events = exports.Events || (exports.Events = {})));

          /***/
        },

      /***/ './packages/mdc-chips/chip-set/foundation.ts':
        /*!***************************************************!*\
  !*** ./packages/mdc-chips/chip-set/foundation.ts ***!
  \***************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          var __values =
            (this && this.__values) ||
            function (o) {
              var s = typeof Symbol === 'function' && Symbol.iterator,
                m = s && o[s],
                i = 0;
              if (m) return m.call(o);
              if (o && typeof o.length === 'number')
                return {
                  next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return { value: o && o[i++], done: !o };
                  },
                };
              throw new TypeError(
                s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
              );
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipSetFoundation = void 0;
          var foundation_1 = __webpack_require__(
            /*! @material/base/foundation */ './packages/mdc-base/foundation.ts',
          );
          var keyboard_1 = __webpack_require__(
            /*! @material/dom/keyboard */ './packages/mdc-dom/keyboard.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ../action/constants */ './packages/mdc-chips/action/constants.ts',
          );
          var constants_2 = __webpack_require__(
            /*! ../chip/constants */ './packages/mdc-chips/chip/constants.ts',
          );
          var constants_3 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/chip-set/constants.ts',
          );
          var Operator;
          (function (Operator) {
            Operator[(Operator['INCREMENT'] = 0)] = 'INCREMENT';
            Operator[(Operator['DECREMENT'] = 1)] = 'DECREMENT';
          })(Operator || (Operator = {}));
          /**
           * MDCChipSetFoundation provides a foundation for all chips.
           */
          var MDCChipSetFoundation = /** @class */ (function (_super) {
            __extends(MDCChipSetFoundation, _super);
            function MDCChipSetFoundation(adapter) {
              return (
                _super.call(
                  this,
                  __assign(__assign({}, MDCChipSetFoundation.defaultAdapter), adapter),
                ) || this
              );
            }
            Object.defineProperty(MDCChipSetFoundation, 'defaultAdapter', {
              get: function get() {
                return {
                  announceMessage: function announceMessage() {
                    return undefined;
                  },
                  emitEvent: function emitEvent() {
                    return undefined;
                  },
                  getAttribute: function getAttribute() {
                    return null;
                  },
                  getChipActionsAtIndex: function getChipActionsAtIndex() {
                    return [];
                  },
                  getChipCount: function getChipCount() {
                    return 0;
                  },
                  getChipIdAtIndex: function getChipIdAtIndex() {
                    return '';
                  },
                  getChipIndexById: function getChipIndexById() {
                    return 0;
                  },
                  isChipFocusableAtIndex: function isChipFocusableAtIndex() {
                    return false;
                  },
                  isChipSelectableAtIndex: function isChipSelectableAtIndex() {
                    return false;
                  },
                  isChipSelectedAtIndex: function isChipSelectedAtIndex() {
                    return false;
                  },
                  removeChipAtIndex: function removeChipAtIndex() {},
                  setChipFocusAtIndex: function setChipFocusAtIndex() {
                    return undefined;
                  },
                  setChipSelectedAtIndex: function setChipSelectedAtIndex() {
                    return undefined;
                  },
                  startChipAnimationAtIndex: function startChipAnimationAtIndex() {
                    return undefined;
                  },
                };
              },
              enumerable: false,
              configurable: true,
            });
            MDCChipSetFoundation.prototype.handleChipAnimation = function (_a) {
              var detail = _a.detail;
              var chipID = detail.chipID,
                animation = detail.animation,
                isComplete = detail.isComplete,
                addedAnnouncement = detail.addedAnnouncement,
                removedAnnouncement = detail.removedAnnouncement;
              var index = this.adapter.getChipIndexById(chipID);
              if (animation === constants_2.Animation.EXIT && isComplete) {
                if (removedAnnouncement) {
                  this.adapter.announceMessage(removedAnnouncement);
                }
                this.removeAfterAnimation(index, chipID);
                return;
              }
              if (animation === constants_2.Animation.ENTER && isComplete && addedAnnouncement) {
                this.adapter.announceMessage(addedAnnouncement);
                return;
              }
            };
            MDCChipSetFoundation.prototype.handleChipInteraction = function (_a) {
              var detail = _a.detail;
              var source = detail.source,
                chipID = detail.chipID,
                isSelectable = detail.isSelectable,
                isSelected = detail.isSelected,
                shouldRemove = detail.shouldRemove;
              var index = this.adapter.getChipIndexById(chipID);
              if (shouldRemove) {
                this.removeChip(index);
                return;
              }
              this.focusChip(index, source, constants_1.FocusBehavior.FOCUSABLE);
              this.adapter.emitEvent(constants_3.Events.INTERACTION, {
                chipIndex: index,
                chipID: chipID,
              });
              if (isSelectable) {
                this.setSelection(index, source, !isSelected);
              }
            };
            MDCChipSetFoundation.prototype.handleChipNavigation = function (_a) {
              var detail = _a.detail;
              var chipID = detail.chipID,
                key = detail.key,
                isRTL = detail.isRTL,
                source = detail.source;
              var index = this.adapter.getChipIndexById(chipID);
              var toNextChip =
                (key === keyboard_1.KEY.ARROW_RIGHT && !isRTL) ||
                (key === keyboard_1.KEY.ARROW_LEFT && isRTL);
              if (toNextChip) {
                // Start from the next chip so we increment the index
                this.focusNextChipFrom(index + 1);
                return;
              }
              var toPreviousChip =
                (key === keyboard_1.KEY.ARROW_LEFT && !isRTL) ||
                (key === keyboard_1.KEY.ARROW_RIGHT && isRTL);
              if (toPreviousChip) {
                // Start from the previous chip so we decrement the index
                this.focusPrevChipFrom(index - 1);
                return;
              }
              if (key === keyboard_1.KEY.ARROW_DOWN) {
                // Start from the next chip so we increment the index
                this.focusNextChipFrom(index + 1, source);
                return;
              }
              if (key === keyboard_1.KEY.ARROW_UP) {
                // Start from the previous chip so we decrement the index
                this.focusPrevChipFrom(index - 1, source);
                return;
              }
              if (key === keyboard_1.KEY.HOME) {
                this.focusNextChipFrom(0, source);
                return;
              }
              if (key === keyboard_1.KEY.END) {
                this.focusPrevChipFrom(this.adapter.getChipCount() - 1, source);
                return;
              }
            };
            /** Returns the unique selected indexes of the chips. */
            MDCChipSetFoundation.prototype.getSelectedChipIndexes = function () {
              var e_1, _a;
              var selectedIndexes = new Set();
              var chipCount = this.adapter.getChipCount();
              for (var i = 0; i < chipCount; i++) {
                var actions = this.adapter.getChipActionsAtIndex(i);
                try {
                  for (
                    var actions_1 = ((e_1 = void 0), __values(actions)),
                      actions_1_1 = actions_1.next();
                    !actions_1_1.done;
                    actions_1_1 = actions_1.next()
                  ) {
                    var action = actions_1_1.value;
                    if (this.adapter.isChipSelectedAtIndex(i, action)) {
                      selectedIndexes.add(i);
                    }
                  }
                } catch (e_1_1) {
                  e_1 = { error: e_1_1 };
                } finally {
                  try {
                    if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return))
                      _a.call(actions_1);
                  } finally {
                    if (e_1) throw e_1.error;
                  }
                }
              }
              return selectedIndexes;
            };
            /** Sets the selected state of the chip at the given index and action. */
            MDCChipSetFoundation.prototype.setChipSelected = function (index, action, isSelected) {
              if (this.adapter.isChipSelectableAtIndex(index, action)) {
                this.setSelection(index, action, isSelected);
              }
            };
            /** Returns the selected state of the chip at the given index and action. */
            MDCChipSetFoundation.prototype.isChipSelected = function (index, action) {
              return this.adapter.isChipSelectedAtIndex(index, action);
            };
            /** Removes the chip at the given index. */
            MDCChipSetFoundation.prototype.removeChip = function (index) {
              // Early exit if the index is out of bounds
              if (index >= this.adapter.getChipCount() || index < 0) return;
              this.adapter.startChipAnimationAtIndex(index, constants_2.Animation.EXIT);
              this.adapter.emitEvent(constants_3.Events.REMOVAL, {
                chipID: this.adapter.getChipIdAtIndex(index),
                chipIndex: index,
                isComplete: false,
              });
            };
            MDCChipSetFoundation.prototype.addChip = function (index) {
              // Early exit if the index is out of bounds
              if (index >= this.adapter.getChipCount() || index < 0) return;
              this.adapter.startChipAnimationAtIndex(index, constants_2.Animation.ENTER);
            };
            /**
             * Increments to find the first focusable chip.
             */
            MDCChipSetFoundation.prototype.focusNextChipFrom = function (startIndex, targetAction) {
              var chipCount = this.adapter.getChipCount();
              for (var i = startIndex; i < chipCount; i++) {
                var focusableAction = this.getFocusableAction(i, Operator.INCREMENT, targetAction);
                if (focusableAction) {
                  this.focusChip(
                    i,
                    focusableAction,
                    constants_1.FocusBehavior.FOCUSABLE_AND_FOCUSED,
                  );
                  return;
                }
              }
            };
            /**
             * Decrements to find the first focusable chip. Takes an optional target
             * action that can be used to focus the first matching focusable action.
             */
            MDCChipSetFoundation.prototype.focusPrevChipFrom = function (startIndex, targetAction) {
              for (var i = startIndex; i > -1; i--) {
                var focusableAction = this.getFocusableAction(i, Operator.DECREMENT, targetAction);
                if (focusableAction) {
                  this.focusChip(
                    i,
                    focusableAction,
                    constants_1.FocusBehavior.FOCUSABLE_AND_FOCUSED,
                  );
                  return;
                }
              }
            };
            /** Returns the appropriate focusable action, or null if none exist. */
            MDCChipSetFoundation.prototype.getFocusableAction = function (index, op, targetAction) {
              var actions = this.adapter.getChipActionsAtIndex(index);
              // Reverse the actions if decrementing
              if (op === Operator.DECREMENT) actions.reverse();
              if (targetAction) {
                return this.getMatchingFocusableAction(index, actions, targetAction);
              }
              return this.getFirstFocusableAction(index, actions);
            };
            /**
             * Returs the first focusable action, regardless of type, or null if no
             * focusable actions exist.
             */
            MDCChipSetFoundation.prototype.getFirstFocusableAction = function (index, actions) {
              var e_2, _a;
              try {
                for (
                  var actions_2 = __values(actions), actions_2_1 = actions_2.next();
                  !actions_2_1.done;
                  actions_2_1 = actions_2.next()
                ) {
                  var action = actions_2_1.value;
                  if (this.adapter.isChipFocusableAtIndex(index, action)) {
                    return action;
                  }
                }
              } catch (e_2_1) {
                e_2 = { error: e_2_1 };
              } finally {
                try {
                  if (actions_2_1 && !actions_2_1.done && (_a = actions_2.return))
                    _a.call(actions_2);
                } finally {
                  if (e_2) throw e_2.error;
                }
              }
              return null;
            };
            /**
             * If the actions contain a focusable action that matches the target action,
             * return that. Otherwise, return the first focusable action, or null if no
             * focusable action exists.
             */
            MDCChipSetFoundation.prototype.getMatchingFocusableAction = function (
              index,
              actions,
              targetAction,
            ) {
              var e_3, _a;
              var focusableAction = null;
              try {
                for (
                  var actions_3 = __values(actions), actions_3_1 = actions_3.next();
                  !actions_3_1.done;
                  actions_3_1 = actions_3.next()
                ) {
                  var action = actions_3_1.value;
                  if (this.adapter.isChipFocusableAtIndex(index, action)) {
                    focusableAction = action;
                  }
                  // Exit and return the focusable action if it matches the target
                  if (focusableAction === targetAction) {
                    return focusableAction;
                  }
                }
              } catch (e_3_1) {
                e_3 = { error: e_3_1 };
              } finally {
                try {
                  if (actions_3_1 && !actions_3_1.done && (_a = actions_3.return))
                    _a.call(actions_3);
                } finally {
                  if (e_3) throw e_3.error;
                }
              }
              return focusableAction;
            };
            MDCChipSetFoundation.prototype.focusChip = function (index, action, focus) {
              var e_4, _a;
              this.adapter.setChipFocusAtIndex(index, action, focus);
              var chipCount = this.adapter.getChipCount();
              for (var i = 0; i < chipCount; i++) {
                var actions = this.adapter.getChipActionsAtIndex(i);
                try {
                  for (
                    var actions_4 = ((e_4 = void 0), __values(actions)),
                      actions_4_1 = actions_4.next();
                    !actions_4_1.done;
                    actions_4_1 = actions_4.next()
                  ) {
                    var chipAction = actions_4_1.value;
                    // Skip the action and index provided since we set it above
                    if (chipAction === action && i === index) continue;
                    this.adapter.setChipFocusAtIndex(
                      i,
                      chipAction,
                      constants_1.FocusBehavior.NOT_FOCUSABLE,
                    );
                  }
                } catch (e_4_1) {
                  e_4 = { error: e_4_1 };
                } finally {
                  try {
                    if (actions_4_1 && !actions_4_1.done && (_a = actions_4.return))
                      _a.call(actions_4);
                  } finally {
                    if (e_4) throw e_4.error;
                  }
                }
              }
            };
            MDCChipSetFoundation.prototype.supportsMultiSelect = function () {
              return (
                this.adapter.getAttribute(constants_3.Attributes.ARIA_MULTISELECTABLE) === 'true'
              );
            };
            MDCChipSetFoundation.prototype.setSelection = function (index, action, isSelected) {
              var e_5, _a;
              this.adapter.setChipSelectedAtIndex(index, action, isSelected);
              this.adapter.emitEvent(constants_3.Events.SELECTION, {
                chipID: this.adapter.getChipIdAtIndex(index),
                chipIndex: index,
                isSelected: isSelected,
              });
              // Early exit if we support multi-selection
              if (this.supportsMultiSelect()) {
                return;
              }
              // If we get here, we ony support single selection. This means we need to
              // unselect all chips
              var chipCount = this.adapter.getChipCount();
              for (var i = 0; i < chipCount; i++) {
                var actions = this.adapter.getChipActionsAtIndex(i);
                try {
                  for (
                    var actions_5 = ((e_5 = void 0), __values(actions)),
                      actions_5_1 = actions_5.next();
                    !actions_5_1.done;
                    actions_5_1 = actions_5.next()
                  ) {
                    var chipAction = actions_5_1.value;
                    // Skip the action and index provided since we set it above
                    if (chipAction === action && i === index) continue;
                    this.adapter.setChipSelectedAtIndex(i, chipAction, false);
                  }
                } catch (e_5_1) {
                  e_5 = { error: e_5_1 };
                } finally {
                  try {
                    if (actions_5_1 && !actions_5_1.done && (_a = actions_5.return))
                      _a.call(actions_5);
                  } finally {
                    if (e_5) throw e_5.error;
                  }
                }
              }
            };
            MDCChipSetFoundation.prototype.removeAfterAnimation = function (index, chipID) {
              this.adapter.removeChipAtIndex(index);
              this.adapter.emitEvent(constants_3.Events.REMOVAL, {
                chipIndex: index,
                isComplete: true,
                chipID: chipID,
              });
              var chipCount = this.adapter.getChipCount();
              // Early exit if we have an empty chip set
              if (chipCount <= 0) return;
              this.focusNearestFocusableAction(index);
            };
            /**
             * Find the first focusable action by moving bidirectionally horizontally
             * from the start index.
             *
             * Given chip set [A, B, C, D, E, F, G]...
             * Let's say we remove chip "F". We don't know where the nearest focusable
             * action is since any of them could be disabled. The nearest focusable
             * action could be E, it could be G, it could even be A. To find it, we
             * start from the source index (5 for "F" in this case) and move out
             * horizontally, checking each chip at each index.
             *
             */
            MDCChipSetFoundation.prototype.focusNearestFocusableAction = function (index) {
              var chipCount = this.adapter.getChipCount();
              var decrIndex = index;
              var incrIndex = index;
              while (decrIndex > -1 || incrIndex < chipCount) {
                var focusAction = this.getNearestFocusableAction(
                  decrIndex,
                  incrIndex,
                  constants_1.ActionType.TRAILING,
                );
                if (focusAction) {
                  this.focusChip(
                    focusAction.index,
                    focusAction.action,
                    constants_1.FocusBehavior.FOCUSABLE_AND_FOCUSED,
                  );
                  return;
                }
                decrIndex--;
                incrIndex++;
              }
            };
            MDCChipSetFoundation.prototype.getNearestFocusableAction = function (
              decrIndex,
              incrIndex,
              actionType,
            ) {
              var decrAction = this.getFocusableAction(decrIndex, Operator.DECREMENT, actionType);
              if (decrAction) {
                return {
                  index: decrIndex,
                  action: decrAction,
                };
              }
              // Early exit if the incremented and decremented indices are identical
              if (incrIndex === decrIndex) return null;
              var incrAction = this.getFocusableAction(incrIndex, Operator.INCREMENT, actionType);
              if (incrAction) {
                return {
                  index: incrIndex,
                  action: incrAction,
                };
              }
              return null;
            };
            return MDCChipSetFoundation;
          })(foundation_1.MDCFoundation);
          exports.MDCChipSetFoundation = MDCChipSetFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCChipSetFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/chip-set/index.ts':
        /*!**********************************************!*\
  !*** ./packages/mdc-chips/chip-set/index.ts ***!
  \**********************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function get() {
                      return m[k];
                    },
                  });
                }
              : function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  o[k2] = m[k];
                });
          var __exportStar =
            (this && this.__exportStar) ||
            function (m, exports) {
              for (var p in m) {
                if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                  __createBinding(exports, m, p);
              }
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          __exportStar(
            __webpack_require__(/*! ./adapter */ './packages/mdc-chips/chip-set/adapter.ts'),
            exports,
          );
          __exportStar(
            __webpack_require__(/*! ./component */ './packages/mdc-chips/chip-set/component.ts'),
            exports,
          );
          __exportStar(
            __webpack_require__(/*! ./constants */ './packages/mdc-chips/chip-set/constants.ts'),
            exports,
          );
          __exportStar(
            __webpack_require__(/*! ./foundation */ './packages/mdc-chips/chip-set/foundation.ts'),
            exports,
          );

          /***/
        },

      /***/ './packages/mdc-chips/chip/component.ts':
        /*!**********************************************!*\
  !*** ./packages/mdc-chips/chip/component.ts ***!
  \**********************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __values =
            (this && this.__values) ||
            function (o) {
              var s = typeof Symbol === 'function' && Symbol.iterator,
                m = s && o[s],
                i = 0;
              if (m) return m.call(o);
              if (o && typeof o.length === 'number')
                return {
                  next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return { value: o && o[i++], done: !o };
                  },
                };
              throw new TypeError(
                s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
              );
            };
          var __read =
            (this && this.__read) ||
            function (o, n) {
              var m = typeof Symbol === 'function' && o[Symbol.iterator];
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
                  if (r && !r.done && (m = i['return'])) m.call(i);
                } finally {
                  if (e) throw e.error;
                }
              }
              return ar;
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChip = void 0;
          var component_1 = __webpack_require__(
            /*! @material/base/component */ './packages/mdc-base/component.ts',
          );
          var component_2 = __webpack_require__(
            /*! ../action/component */ './packages/mdc-chips/action/component.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ../action/constants */ './packages/mdc-chips/action/constants.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-chips/chip/foundation.ts',
          );
          /**
           * MDCChip provides component encapsulation of the foundation implementation.
           */
          var MDCChip = /** @class */ (function (_super) {
            __extends(MDCChip, _super);
            function MDCChip() {
              var _this = (_super !== null && _super.apply(this, arguments)) || this;
              _this.rootHTML = _this.root;
              return _this;
            }
            MDCChip.attachTo = function (root) {
              return new MDCChip(root);
            };
            MDCChip.prototype.initialize = function (actionFactory) {
              if (actionFactory === void 0) {
                actionFactory = function actionFactory(el) {
                  return new component_2.MDCChipAction(el);
                };
              }
              this.actions = new Map();
              var actionEls = this.root.querySelectorAll('.mdc-evolution-chip__action');
              for (var i = 0; i < actionEls.length; i++) {
                var action = actionFactory(actionEls[i]);
                this.actions.set(action.actionType(), action);
              }
            };
            MDCChip.prototype.initialSyncWithDOM = function () {
              var _this = this;
              this.handleActionInteraction = function (event) {
                _this.foundation.handleActionInteraction(event);
              };
              this.handleActionNavigation = function (event) {
                _this.foundation.handleActionNavigation(event);
              };
              this.listen(constants_1.Events.INTERACTION, this.handleActionInteraction);
              this.listen(constants_1.Events.NAVIGATION, this.handleActionNavigation);
            };
            MDCChip.prototype.destroy = function () {
              this.unlisten(constants_1.Events.INTERACTION, this.handleActionInteraction);
              this.unlisten(constants_1.Events.NAVIGATION, this.handleActionNavigation);
              _super.prototype.destroy.call(this);
            };
            MDCChip.prototype.getDefaultFoundation = function () {
              var _this = this;
              // DO NOT INLINE this variable. For backward compatibility, foundations take
              // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
              // methods, we need a separate, strongly typed adapter variable.
              var adapter = {
                addClass: function addClass(className) {
                  _this.root.classList.add(className);
                },
                emitEvent: function emitEvent(eventName, eventDetail) {
                  _this.emit(eventName, eventDetail, true /* shouldBubble */);
                },
                getActions: function getActions() {
                  var e_1, _a;
                  var actions = [];
                  try {
                    for (
                      var _b = __values(_this.actions), _c = _b.next();
                      !_c.done;
                      _c = _b.next()
                    ) {
                      var _d = __read(_c.value, 1),
                        key = _d[0];
                      actions.push(key);
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
                  return actions;
                },
                getAttribute: function getAttribute(attrName) {
                  return _this.root.getAttribute(attrName);
                },
                getElementID: function getElementID() {
                  return _this.rootHTML.id;
                },
                getOffsetWidth: function getOffsetWidth() {
                  return _this.rootHTML.offsetWidth;
                },
                hasClass: function hasClass(className) {
                  return _this.root.classList.contains(className);
                },
                isActionSelectable: function isActionSelectable(actionType) {
                  var action = _this.actions.get(actionType);
                  if (action) {
                    return action.isSelectable();
                  }
                  return false;
                },
                isActionSelected: function isActionSelected(actionType) {
                  var action = _this.actions.get(actionType);
                  if (action) {
                    return action.isSelected();
                  }
                  return false;
                },
                isActionFocusable: function isActionFocusable(actionType) {
                  var action = _this.actions.get(actionType);
                  if (action) {
                    return action.isFocusable();
                  }
                  return false;
                },
                isActionDisabled: function isActionDisabled(actionType) {
                  var action = _this.actions.get(actionType);
                  if (action) {
                    return action.isDisabled();
                  }
                  return false;
                },
                isRTL: function isRTL() {
                  return (
                    window.getComputedStyle(_this.root).getPropertyValue('direction') === 'rtl'
                  );
                },
                removeClass: function removeClass(className) {
                  _this.root.classList.remove(className);
                },
                setActionDisabled: function setActionDisabled(actionType, isDisabled) {
                  var action = _this.actions.get(actionType);
                  if (action) {
                    action.setDisabled(isDisabled);
                  }
                },
                setActionFocus: function setActionFocus(actionType, behavior) {
                  var action = _this.actions.get(actionType);
                  if (action) {
                    action.setFocus(behavior);
                  }
                },
                setActionSelected: function setActionSelected(actionType, isSelected) {
                  var action = _this.actions.get(actionType);
                  if (action) {
                    action.setSelected(isSelected);
                  }
                },
                setStyleProperty: function setStyleProperty(prop, value) {
                  _this.rootHTML.style.setProperty(prop, value);
                },
              };
              // Default to the primary foundation
              return new foundation_1.MDCChipFoundation(adapter);
            };
            /** Exposed to be called by the parent chip set. */
            MDCChip.prototype.remove = function () {
              var parent = this.root.parentNode;
              if (parent !== null) {
                parent.removeChild(this.root);
              }
            };
            /** Returns the ActionTypes for the encapsulated actions. */
            MDCChip.prototype.getActions = function () {
              return this.foundation.getActions();
            };
            /** Returns the ID of the root element. */
            MDCChip.prototype.getElementID = function () {
              return this.foundation.getElementID();
            };
            MDCChip.prototype.isDisabled = function () {
              return this.foundation.isDisabled();
            };
            MDCChip.prototype.setDisabled = function (isDisabled) {
              this.foundation.setDisabled(isDisabled);
            };
            /** Returns the focusability of the action. */
            MDCChip.prototype.isActionFocusable = function (action) {
              return this.foundation.isActionFocusable(action);
            };
            /** Returns the selectability of the action. */
            MDCChip.prototype.isActionSelectable = function (action) {
              return this.foundation.isActionSelectable(action);
            };
            /** Returns the selected state of the action. */
            MDCChip.prototype.isActionSelected = function (action) {
              return this.foundation.isActionSelected(action);
            };
            /** Sets the focus behavior of the action. */
            MDCChip.prototype.setActionFocus = function (action, focus) {
              this.foundation.setActionFocus(action, focus);
            };
            /** Sets the selected state of the action. */
            MDCChip.prototype.setActionSelected = function (action, isSelected) {
              this.foundation.setActionSelected(action, isSelected);
            };
            /** Starts the animation on the chip. */
            MDCChip.prototype.startAnimation = function (animation) {
              this.foundation.startAnimation(animation);
            };
            return MDCChip;
          })(component_1.MDCComponent);
          exports.MDCChip = MDCChip;

          /***/
        },

      /***/ './packages/mdc-chips/chip/constants.ts':
        /*!**********************************************!*\
  !*** ./packages/mdc-chips/chip/constants.ts ***!
  \**********************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.Animation = exports.Attributes = exports.Events = exports.CssClasses = void 0;
          /**
           * CssClasses provides the named constants for class names.
           */
          var CssClasses;
          (function (CssClasses) {
            CssClasses['SELECTING'] = 'mdc-evolution-chip--selecting';
            CssClasses['DESELECTING'] = 'mdc-evolution-chip--deselecting';
            CssClasses['SELECTING_WITH_PRIMARY_ICON'] =
              'mdc-evolution-chip--selecting-with-primary-icon';
            CssClasses['DESELECTING_WITH_PRIMARY_ICON'] =
              'mdc-evolution-chip--deselecting-with-primary-icon';
            CssClasses['DISABLED'] = 'mdc-evolution-chip--disabled';
            CssClasses['ENTER'] = 'mdc-evolution-chip--enter';
            CssClasses['EXIT'] = 'mdc-evolution-chip--exit';
            CssClasses['SELECTED'] = 'mdc-evolution-chip--selected';
            CssClasses['HIDDEN'] = 'mdc-evolution-chip--hidden';
            CssClasses['WITH_PRIMARY_ICON'] = 'mdc-evolution-chip--with-primary-icon';
          })((CssClasses = exports.CssClasses || (exports.CssClasses = {})));
          /**
           * Events provides the named constants for emitted events.
           */
          var Events;
          (function (Events) {
            Events['INTERACTION'] = 'MDCChip:interaction';
            Events['NAVIGATION'] = 'MDCChip:navigation';
            Events['ANIMATION'] = 'MDCChip:animation';
          })((Events = exports.Events || (exports.Events = {})));
          /**
           * Events provides the named constants for strings used by the foundation.
           */
          var Attributes;
          (function (Attributes) {
            Attributes['DATA_REMOVED_ANNOUNCEMENT'] = 'data-mdc-removed-announcement';
            Attributes['DATA_ADDED_ANNOUNCEMENT'] = 'data-mdc-added-announcement';
          })((Attributes = exports.Attributes || (exports.Attributes = {})));
          /**
           * Animation provides the names of runnable animations.
           */
          var Animation;
          (function (Animation) {
            Animation['ENTER'] = 'mdc-evolution-chip-enter';
            Animation['EXIT'] = 'mdc-evolution-chip-exit';
          })((Animation = exports.Animation || (exports.Animation = {})));

          /***/
        },

      /***/ './packages/mdc-chips/chip/foundation.ts':
        /*!***********************************************!*\
  !*** ./packages/mdc-chips/chip/foundation.ts ***!
  \***********************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          var __values =
            (this && this.__values) ||
            function (o) {
              var s = typeof Symbol === 'function' && Symbol.iterator,
                m = s && o[s],
                i = 0;
              if (m) return m.call(o);
              if (o && typeof o.length === 'number')
                return {
                  next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return { value: o && o[i++], done: !o };
                  },
                };
              throw new TypeError(
                s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
              );
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipFoundation = void 0;
          var animationframe_1 = __webpack_require__(
            /*! @material/animation/animationframe */ './packages/mdc-animation/animationframe.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! @material/base/foundation */ './packages/mdc-base/foundation.ts',
          );
          var keyboard_1 = __webpack_require__(
            /*! @material/dom/keyboard */ './packages/mdc-dom/keyboard.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ../action/constants */ './packages/mdc-chips/action/constants.ts',
          );
          var constants_2 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/chip/constants.ts',
          );
          var Direction;
          (function (Direction) {
            Direction[(Direction['UNSPECIFIED'] = 0)] = 'UNSPECIFIED';
            Direction[(Direction['LEFT'] = 1)] = 'LEFT';
            Direction[(Direction['RIGHT'] = 2)] = 'RIGHT';
          })(Direction || (Direction = {}));
          var AnimationKeys;
          (function (AnimationKeys) {
            AnimationKeys['SELECTION'] = 'selection';
            AnimationKeys['EXIT'] = 'exit';
          })(AnimationKeys || (AnimationKeys = {}));
          /**
           * MDCChipFoundation provides a foundation for all chips.
           */
          var MDCChipFoundation = /** @class */ (function (_super) {
            __extends(MDCChipFoundation, _super);
            function MDCChipFoundation(adapter) {
              var _this =
                _super.call(
                  this,
                  __assign(__assign({}, MDCChipFoundation.defaultAdapter), adapter),
                ) || this;
              _this.animFrame = new animationframe_1.AnimationFrame();
              return _this;
            }
            Object.defineProperty(MDCChipFoundation, 'defaultAdapter', {
              get: function get() {
                return {
                  addClass: function addClass() {
                    return undefined;
                  },
                  emitEvent: function emitEvent() {
                    return undefined;
                  },
                  getActions: function getActions() {
                    return [];
                  },
                  getAttribute: function getAttribute() {
                    return null;
                  },
                  getElementID: function getElementID() {
                    return '';
                  },
                  getOffsetWidth: function getOffsetWidth() {
                    return 0;
                  },
                  hasClass: function hasClass() {
                    return false;
                  },
                  isActionDisabled: function isActionDisabled() {
                    return false;
                  },
                  isActionFocusable: function isActionFocusable() {
                    return false;
                  },
                  isActionSelectable: function isActionSelectable() {
                    return false;
                  },
                  isActionSelected: function isActionSelected() {
                    return false;
                  },
                  isRTL: function isRTL() {
                    return false;
                  },
                  removeClass: function removeClass() {
                    return undefined;
                  },
                  setActionDisabled: function setActionDisabled() {
                    return undefined;
                  },
                  setActionFocus: function setActionFocus() {
                    return undefined;
                  },
                  setActionSelected: function setActionSelected() {
                    return undefined;
                  },
                  setStyleProperty: function setStyleProperty() {
                    return undefined;
                  },
                };
              },
              enumerable: false,
              configurable: true,
            });
            MDCChipFoundation.prototype.destroy = function () {
              this.animFrame.cancelAll();
            };
            MDCChipFoundation.prototype.getElementID = function () {
              return this.adapter.getElementID();
            };
            MDCChipFoundation.prototype.setDisabled = function (isDisabled) {
              var e_1, _a;
              var actions = this.getActions();
              try {
                for (
                  var actions_1 = __values(actions), actions_1_1 = actions_1.next();
                  !actions_1_1.done;
                  actions_1_1 = actions_1.next()
                ) {
                  var action = actions_1_1.value;
                  this.adapter.setActionDisabled(action, isDisabled);
                }
              } catch (e_1_1) {
                e_1 = { error: e_1_1 };
              } finally {
                try {
                  if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return))
                    _a.call(actions_1);
                } finally {
                  if (e_1) throw e_1.error;
                }
              }
              if (isDisabled) {
                this.adapter.addClass(constants_2.CssClasses.DISABLED);
              } else {
                this.adapter.removeClass(constants_2.CssClasses.DISABLED);
              }
            };
            MDCChipFoundation.prototype.isDisabled = function () {
              var e_2, _a;
              var actions = this.getActions();
              try {
                for (
                  var actions_2 = __values(actions), actions_2_1 = actions_2.next();
                  !actions_2_1.done;
                  actions_2_1 = actions_2.next()
                ) {
                  var action = actions_2_1.value;
                  if (this.adapter.isActionDisabled(action)) {
                    return true;
                  }
                }
              } catch (e_2_1) {
                e_2 = { error: e_2_1 };
              } finally {
                try {
                  if (actions_2_1 && !actions_2_1.done && (_a = actions_2.return))
                    _a.call(actions_2);
                } finally {
                  if (e_2) throw e_2.error;
                }
              }
              return false;
            };
            MDCChipFoundation.prototype.getActions = function () {
              return this.adapter.getActions();
            };
            MDCChipFoundation.prototype.isActionFocusable = function (action) {
              return this.adapter.isActionFocusable(action);
            };
            MDCChipFoundation.prototype.isActionSelectable = function (action) {
              return this.adapter.isActionSelectable(action);
            };
            MDCChipFoundation.prototype.isActionSelected = function (action) {
              return this.adapter.isActionSelected(action);
            };
            MDCChipFoundation.prototype.setActionFocus = function (action, focus) {
              this.adapter.setActionFocus(action, focus);
            };
            MDCChipFoundation.prototype.setActionSelected = function (action, isSelected) {
              this.adapter.setActionSelected(action, isSelected);
              this.animateSelection(isSelected);
            };
            MDCChipFoundation.prototype.startAnimation = function (animation) {
              if (animation === constants_2.Animation.ENTER) {
                this.adapter.addClass(constants_2.CssClasses.ENTER);
                return;
              }
              if (animation === constants_2.Animation.EXIT) {
                this.adapter.addClass(constants_2.CssClasses.EXIT);
                return;
              }
            };
            MDCChipFoundation.prototype.handleAnimationEnd = function (event) {
              var _this = this;
              var animationName = event.animationName;
              if (animationName === constants_2.Animation.ENTER) {
                this.adapter.removeClass(constants_2.CssClasses.ENTER);
                this.adapter.emitEvent(constants_2.Events.ANIMATION, {
                  chipID: this.getElementID(),
                  animation: constants_2.Animation.ENTER,
                  addedAnnouncement: this.getAddedAnnouncement(),
                  isComplete: true,
                });
                return;
              }
              if (animationName === constants_2.Animation.EXIT) {
                this.adapter.removeClass(constants_2.CssClasses.EXIT);
                this.adapter.addClass(constants_2.CssClasses.HIDDEN);
                var width = this.adapter.getOffsetWidth();
                this.adapter.setStyleProperty('width', width + 'px');
                // Wait two frames so the width gets applied correctly.
                this.animFrame.request(AnimationKeys.EXIT, function () {
                  _this.animFrame.request(AnimationKeys.EXIT, function () {
                    _this.adapter.setStyleProperty('width', '0');
                  });
                });
              }
            };
            MDCChipFoundation.prototype.handleTransitionEnd = function () {
              if (!this.adapter.hasClass(constants_2.CssClasses.HIDDEN)) return;
              this.adapter.emitEvent(constants_2.Events.ANIMATION, {
                chipID: this.getElementID(),
                animation: constants_2.Animation.EXIT,
                removedAnnouncement: this.getRemovedAnnouncement(),
                isComplete: true,
              });
            };
            MDCChipFoundation.prototype.handleActionInteraction = function (_a) {
              var detail = _a.detail;
              var source = detail.source,
                actionID = detail.actionID;
              var isSelectable = this.adapter.isActionSelectable(source);
              var isSelected = this.adapter.isActionSelected(source);
              this.adapter.emitEvent(constants_2.Events.INTERACTION, {
                chipID: this.getElementID(),
                shouldRemove: this.shouldRemove(detail),
                actionID: actionID,
                isSelectable: isSelectable,
                isSelected: isSelected,
                source: source,
              });
            };
            MDCChipFoundation.prototype.handleActionNavigation = function (_a) {
              var detail = _a.detail;
              var source = detail.source,
                key = detail.key;
              var isRTL = this.adapter.isRTL();
              var isTrailingActionFocusable = this.adapter.isActionFocusable(
                constants_1.ActionType.TRAILING,
              );
              var isPrimaryActionFocusable = this.adapter.isActionFocusable(
                constants_1.ActionType.PRIMARY,
              );
              var dir = this.directionFromKey(key, isRTL);
              var shouldNavigateToTrailing =
                source === constants_1.ActionType.PRIMARY &&
                dir === Direction.RIGHT &&
                isTrailingActionFocusable;
              var shouldNavigateToPrimary =
                source === constants_1.ActionType.TRAILING &&
                dir === Direction.LEFT &&
                isPrimaryActionFocusable;
              if (shouldNavigateToTrailing) {
                this.navigateActions({ from: source, to: constants_1.ActionType.TRAILING });
                return;
              }
              if (shouldNavigateToPrimary) {
                this.navigateActions({ from: source, to: constants_1.ActionType.PRIMARY });
                return;
              }
              this.adapter.emitEvent(constants_2.Events.NAVIGATION, {
                chipID: this.getElementID(),
                isRTL: isRTL,
                source: source,
                key: key,
              });
            };
            MDCChipFoundation.prototype.directionFromKey = function (key, isRTL) {
              var isLeftKey = key === keyboard_1.KEY.ARROW_LEFT;
              var isRightKey = key === keyboard_1.KEY.ARROW_RIGHT;
              if ((!isRTL && isLeftKey) || (isRTL && isRightKey)) {
                return Direction.LEFT;
              }
              if ((!isRTL && isRightKey) || (isRTL && isLeftKey)) {
                return Direction.RIGHT;
              }
              return Direction.UNSPECIFIED;
            };
            MDCChipFoundation.prototype.navigateActions = function (nav) {
              this.adapter.setActionFocus(nav.from, constants_1.FocusBehavior.NOT_FOCUSABLE);
              this.adapter.setActionFocus(nav.to, constants_1.FocusBehavior.FOCUSABLE_AND_FOCUSED);
            };
            MDCChipFoundation.prototype.shouldRemove = function (_a) {
              var source = _a.source,
                trigger = _a.trigger;
              if (
                trigger === constants_1.InteractionTrigger.BACKSPACE_KEY ||
                trigger === constants_1.InteractionTrigger.DELETE_KEY
              ) {
                return true;
              }
              return source === constants_1.ActionType.TRAILING;
            };
            MDCChipFoundation.prototype.getRemovedAnnouncement = function () {
              var msg = this.adapter.getAttribute(constants_2.Attributes.DATA_REMOVED_ANNOUNCEMENT);
              return msg || undefined;
            };
            MDCChipFoundation.prototype.getAddedAnnouncement = function () {
              var msg = this.adapter.getAttribute(constants_2.Attributes.DATA_ADDED_ANNOUNCEMENT);
              return msg || undefined;
            };
            MDCChipFoundation.prototype.animateSelection = function (isSelected) {
              var _this = this;
              this.resetAnimationStyles();
              // Wait two frames to ensure the animation classes are unset
              this.animFrame.request(AnimationKeys.SELECTION, function () {
                _this.animFrame.request(AnimationKeys.SELECTION, function () {
                  _this.updateSelectionStyles(isSelected);
                });
              });
            };
            MDCChipFoundation.prototype.resetAnimationStyles = function () {
              this.adapter.removeClass(constants_2.CssClasses.SELECTING);
              this.adapter.removeClass(constants_2.CssClasses.DESELECTING);
              this.adapter.removeClass(constants_2.CssClasses.SELECTING_WITH_PRIMARY_ICON);
              this.adapter.removeClass(constants_2.CssClasses.DESELECTING_WITH_PRIMARY_ICON);
            };
            MDCChipFoundation.prototype.updateSelectionStyles = function (isSelected) {
              var _this = this;
              var hasIcon = this.adapter.hasClass(constants_2.CssClasses.WITH_PRIMARY_ICON);
              if (hasIcon && isSelected) {
                this.adapter.addClass(constants_2.CssClasses.SELECTING_WITH_PRIMARY_ICON);
                this.animFrame.request(AnimationKeys.SELECTION, function () {
                  _this.adapter.addClass(constants_2.CssClasses.SELECTED);
                });
                return;
              }
              if (hasIcon && !isSelected) {
                this.adapter.addClass(constants_2.CssClasses.DESELECTING_WITH_PRIMARY_ICON);
                this.animFrame.request(AnimationKeys.SELECTION, function () {
                  _this.adapter.removeClass(constants_2.CssClasses.SELECTED);
                });
                return;
              }
              if (isSelected) {
                this.adapter.addClass(constants_2.CssClasses.SELECTING);
                this.animFrame.request(AnimationKeys.SELECTION, function () {
                  _this.adapter.addClass(constants_2.CssClasses.SELECTED);
                });
                return;
              }
              if (!isSelected) {
                this.adapter.addClass(constants_2.CssClasses.DESELECTING);
                this.animFrame.request(AnimationKeys.SELECTION, function () {
                  _this.adapter.removeClass(constants_2.CssClasses.SELECTED);
                });
                return;
              }
            };
            return MDCChipFoundation;
          })(foundation_1.MDCFoundation);
          exports.MDCChipFoundation = MDCChipFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCChipFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip-set/adapter.ts':
        /*!***********************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip-set/adapter.ts ***!
  \***********************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip-set/component.ts':
        /*!*************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip-set/component.ts ***!
  \*************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __values =
            (this && this.__values) ||
            function (o) {
              var s = typeof Symbol === 'function' && Symbol.iterator,
                m = s && o[s],
                i = 0;
              if (m) return m.call(o);
              if (o && typeof o.length === 'number')
                return {
                  next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return { value: o && o[i++], done: !o };
                  },
                };
              throw new TypeError(
                s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
              );
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipSet = void 0;
          var component_1 = __webpack_require__(
            /*! @material/base/component */ './packages/mdc-base/component.ts',
          );
          var announce_1 = __webpack_require__(
            /*! @material/dom/announce */ './packages/mdc-dom/announce.ts',
          );
          var component_2 = __webpack_require__(
            /*! ../chip/component */ './packages/mdc-chips/deprecated/chip/component.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! ../chip/foundation */ './packages/mdc-chips/deprecated/chip/foundation.ts',
          );
          var foundation_2 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-chips/deprecated/chip-set/foundation.ts',
          );
          var _a = foundation_1.MDCChipFoundation.strings,
            INTERACTION_EVENT = _a.INTERACTION_EVENT,
            SELECTION_EVENT = _a.SELECTION_EVENT,
            REMOVAL_EVENT = _a.REMOVAL_EVENT,
            NAVIGATION_EVENT = _a.NAVIGATION_EVENT;
          var CHIP_SELECTOR = foundation_2.MDCChipSetFoundation.strings.CHIP_SELECTOR;
          var idCounter = 0;
          var MDCChipSet = /** @class */ (function (_super) {
            __extends(MDCChipSet, _super);
            function MDCChipSet() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            MDCChipSet.attachTo = function (root) {
              return new MDCChipSet(root);
            };
            Object.defineProperty(MDCChipSet.prototype, 'chips', {
              get: function get() {
                return this.chipsList.slice();
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChipSet.prototype, 'selectedChipIds', {
              /**
               * @return An array of the IDs of all selected chips.
               */
              get: function get() {
                return this.foundation.getSelectedChipIds();
              },
              enumerable: false,
              configurable: true,
            });
            /**
             * @param chipFactory A function which creates a new MDCChip.
             */
            MDCChipSet.prototype.initialize = function (chipFactory) {
              if (chipFactory === void 0) {
                chipFactory = function chipFactory(el) {
                  return new component_2.MDCChip(el);
                };
              }
              this.chipFactory = chipFactory;
              this.chipsList = this.instantiateChips(this.chipFactory);
            };
            MDCChipSet.prototype.initialSyncWithDOM = function () {
              var e_1, _a;
              var _this = this;
              try {
                for (var _b = __values(this.chipsList), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var chip = _c.value;
                  if (chip.id && chip.selected) {
                    this.foundation.select(chip.id);
                  }
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
              this.handleChipInteraction = function (evt) {
                return _this.foundation.handleChipInteraction(evt.detail);
              };
              this.handleChipSelection = function (evt) {
                return _this.foundation.handleChipSelection(evt.detail);
              };
              this.handleChipRemoval = function (evt) {
                return _this.foundation.handleChipRemoval(evt.detail);
              };
              this.handleChipNavigation = function (evt) {
                return _this.foundation.handleChipNavigation(evt.detail);
              };
              this.listen(INTERACTION_EVENT, this.handleChipInteraction);
              this.listen(SELECTION_EVENT, this.handleChipSelection);
              this.listen(REMOVAL_EVENT, this.handleChipRemoval);
              this.listen(NAVIGATION_EVENT, this.handleChipNavigation);
            };
            MDCChipSet.prototype.destroy = function () {
              var e_2, _a;
              try {
                for (var _b = __values(this.chipsList), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var chip = _c.value;
                  chip.destroy();
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
              this.unlisten(INTERACTION_EVENT, this.handleChipInteraction);
              this.unlisten(SELECTION_EVENT, this.handleChipSelection);
              this.unlisten(REMOVAL_EVENT, this.handleChipRemoval);
              this.unlisten(NAVIGATION_EVENT, this.handleChipNavigation);
              _super.prototype.destroy.call(this);
            };
            /**
             * Adds a new chip object to the chip set from the given chip element.
             */
            MDCChipSet.prototype.addChip = function (chipEl) {
              chipEl.id = chipEl.id || 'mdc-chip-' + ++idCounter;
              this.chipsList.push(this.chipFactory(chipEl));
            };
            MDCChipSet.prototype.getDefaultFoundation = function () {
              var _this = this;
              // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
              // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
              var adapter = {
                announceMessage: function announceMessage(message) {
                  announce_1.announce(message);
                },
                focusChipPrimaryActionAtIndex: function focusChipPrimaryActionAtIndex(index) {
                  _this.chipsList[index].focusPrimaryAction();
                },
                focusChipTrailingActionAtIndex: function focusChipTrailingActionAtIndex(index) {
                  _this.chipsList[index].focusTrailingAction();
                },
                getChipListCount: function getChipListCount() {
                  return _this.chips.length;
                },
                getIndexOfChipById: function getIndexOfChipById(chipId) {
                  return _this.findChipIndex(chipId);
                },
                hasClass: function hasClass(className) {
                  return _this.root.classList.contains(className);
                },
                isRTL: function isRTL() {
                  return (
                    window.getComputedStyle(_this.root).getPropertyValue('direction') === 'rtl'
                  );
                },
                removeChipAtIndex: function removeChipAtIndex(index) {
                  if (index >= 0 && index < _this.chips.length) {
                    _this.chipsList[index].destroy();
                    _this.chipsList[index].remove();
                    _this.chipsList.splice(index, 1);
                  }
                },
                removeFocusFromChipAtIndex: function removeFocusFromChipAtIndex(index) {
                  _this.chipsList[index].removeFocus();
                },
                selectChipAtIndex: function selectChipAtIndex(
                  index,
                  selected,
                  shouldNotifyClients,
                ) {
                  if (index >= 0 && index < _this.chips.length) {
                    _this.chipsList[index].setSelectedFromChipSet(selected, shouldNotifyClients);
                  }
                },
              };
              return new foundation_2.MDCChipSetFoundation(adapter);
            };
            /**
             * Instantiates chip components on all of the chip set's child chip elements.
             */
            MDCChipSet.prototype.instantiateChips = function (chipFactory) {
              var chipElements = [].slice.call(this.root.querySelectorAll(CHIP_SELECTOR));
              return chipElements.map(function (el) {
                el.id = el.id || 'mdc-chip-' + ++idCounter;
                return chipFactory(el);
              });
            };
            /**
             * Returns the index of the chip with the given id, or -1 if the chip does not exist.
             */
            MDCChipSet.prototype.findChipIndex = function (chipId) {
              for (var i = 0; i < this.chips.length; i++) {
                if (this.chipsList[i].id === chipId) {
                  return i;
                }
              }
              return -1;
            };
            return MDCChipSet;
          })(component_1.MDCComponent);
          exports.MDCChipSet = MDCChipSet;

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip-set/constants.ts':
        /*!*************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip-set/constants.ts ***!
  \*************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.cssClasses = exports.strings = void 0;
          exports.strings = {
            CHIP_SELECTOR: '.mdc-chip',
          };
          exports.cssClasses = {
            CHOICE: 'mdc-chip-set--choice',
            FILTER: 'mdc-chip-set--filter',
          };

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip-set/foundation.ts':
        /*!**************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip-set/foundation.ts ***!
  \**************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipSetFoundation = void 0;
          var foundation_1 = __webpack_require__(
            /*! @material/base/foundation */ './packages/mdc-base/foundation.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ../chip/constants */ './packages/mdc-chips/deprecated/chip/constants.ts',
          );
          var constants_2 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/deprecated/chip-set/constants.ts',
          );
          var MDCChipSetFoundation = /** @class */ (function (_super) {
            __extends(MDCChipSetFoundation, _super);
            function MDCChipSetFoundation(adapter) {
              var _this =
                _super.call(
                  this,
                  __assign(__assign({}, MDCChipSetFoundation.defaultAdapter), adapter),
                ) || this;
              /**
               * The ids of the selected chips in the set. Only used for choice chip set or filter chip set.
               */
              _this.selectedChipIds = [];
              return _this;
            }
            Object.defineProperty(MDCChipSetFoundation, 'strings', {
              get: function get() {
                return constants_2.strings;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChipSetFoundation, 'cssClasses', {
              get: function get() {
                return constants_2.cssClasses;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChipSetFoundation, 'defaultAdapter', {
              get: function get() {
                return {
                  announceMessage: function announceMessage() {
                    return undefined;
                  },
                  focusChipPrimaryActionAtIndex: function focusChipPrimaryActionAtIndex() {
                    return undefined;
                  },
                  focusChipTrailingActionAtIndex: function focusChipTrailingActionAtIndex() {
                    return undefined;
                  },
                  getChipListCount: function getChipListCount() {
                    return -1;
                  },
                  getIndexOfChipById: function getIndexOfChipById() {
                    return -1;
                  },
                  hasClass: function hasClass() {
                    return false;
                  },
                  isRTL: function isRTL() {
                    return false;
                  },
                  removeChipAtIndex: function removeChipAtIndex() {
                    return undefined;
                  },
                  removeFocusFromChipAtIndex: function removeFocusFromChipAtIndex() {
                    return undefined;
                  },
                  selectChipAtIndex: function selectChipAtIndex() {
                    return undefined;
                  },
                };
              },
              enumerable: false,
              configurable: true,
            });
            /**
             * Returns an array of the IDs of all selected chips.
             */
            MDCChipSetFoundation.prototype.getSelectedChipIds = function () {
              return this.selectedChipIds.slice();
            };
            /**
             * Selects the chip with the given id. Deselects all other chips if the chip set is of the choice variant.
             * Does not notify clients of the updated selection state.
             */
            MDCChipSetFoundation.prototype.select = function (chipId) {
              this.selectImpl(chipId, false);
            };
            /**
             * Handles a chip interaction event
             */
            MDCChipSetFoundation.prototype.handleChipInteraction = function (_a) {
              var chipId = _a.chipId;
              var index = this.adapter.getIndexOfChipById(chipId);
              this.removeFocusFromChipsExcept(index);
              if (
                this.adapter.hasClass(constants_2.cssClasses.CHOICE) ||
                this.adapter.hasClass(constants_2.cssClasses.FILTER)
              ) {
                this.toggleSelect(chipId);
              }
            };
            /**
             * Handles a chip selection event, used to handle discrepancy when selection state is set directly on the Chip.
             */
            MDCChipSetFoundation.prototype.handleChipSelection = function (_a) {
              var chipId = _a.chipId,
                selected = _a.selected,
                shouldIgnore = _a.shouldIgnore;
              // Early exit if we should ignore the event
              if (shouldIgnore) {
                return;
              }
              var chipIsSelected = this.selectedChipIds.indexOf(chipId) >= 0;
              if (selected && !chipIsSelected) {
                this.select(chipId);
              } else if (!selected && chipIsSelected) {
                this.deselectImpl(chipId);
              }
            };
            /**
             * Handles the event when a chip is removed.
             */
            MDCChipSetFoundation.prototype.handleChipRemoval = function (_a) {
              var chipId = _a.chipId,
                removedAnnouncement = _a.removedAnnouncement;
              if (removedAnnouncement) {
                this.adapter.announceMessage(removedAnnouncement);
              }
              var index = this.adapter.getIndexOfChipById(chipId);
              this.deselectAndNotifyClients(chipId);
              this.adapter.removeChipAtIndex(index);
              var maxIndex = this.adapter.getChipListCount() - 1;
              if (maxIndex < 0) {
                return;
              }
              var nextIndex = Math.min(index, maxIndex);
              this.removeFocusFromChipsExcept(nextIndex);
              // After removing a chip, we should focus the trailing action for the next chip.
              this.adapter.focusChipTrailingActionAtIndex(nextIndex);
            };
            /**
             * Handles a chip navigation event.
             */
            MDCChipSetFoundation.prototype.handleChipNavigation = function (_a) {
              var chipId = _a.chipId,
                key = _a.key,
                source = _a.source;
              var maxIndex = this.adapter.getChipListCount() - 1;
              var index = this.adapter.getIndexOfChipById(chipId);
              // Early exit if the index is out of range or the key is unusable
              if (index === -1 || !constants_1.navigationKeys.has(key)) {
                return;
              }
              var isRTL = this.adapter.isRTL();
              var isLeftKey =
                key === constants_1.strings.ARROW_LEFT_KEY ||
                key === constants_1.strings.IE_ARROW_LEFT_KEY;
              var isRightKey =
                key === constants_1.strings.ARROW_RIGHT_KEY ||
                key === constants_1.strings.IE_ARROW_RIGHT_KEY;
              var isDownKey =
                key === constants_1.strings.ARROW_DOWN_KEY ||
                key === constants_1.strings.IE_ARROW_DOWN_KEY;
              var shouldIncrement = (!isRTL && isRightKey) || (isRTL && isLeftKey) || isDownKey;
              var isHome = key === constants_1.strings.HOME_KEY;
              var isEnd = key === constants_1.strings.END_KEY;
              if (shouldIncrement) {
                index++;
              } else if (isHome) {
                index = 0;
              } else if (isEnd) {
                index = maxIndex;
              } else {
                index--;
              }
              // Early exit if the index is out of bounds
              if (index < 0 || index > maxIndex) {
                return;
              }
              this.removeFocusFromChipsExcept(index);
              this.focusChipAction(index, key, source);
            };
            MDCChipSetFoundation.prototype.focusChipAction = function (index, key, source) {
              var shouldJumpChips = constants_1.jumpChipKeys.has(key);
              if (shouldJumpChips && source === constants_1.EventSource.PRIMARY) {
                return this.adapter.focusChipPrimaryActionAtIndex(index);
              }
              if (shouldJumpChips && source === constants_1.EventSource.TRAILING) {
                return this.adapter.focusChipTrailingActionAtIndex(index);
              }
              var dir = this.getDirection(key);
              if (dir === constants_1.Direction.LEFT) {
                return this.adapter.focusChipTrailingActionAtIndex(index);
              }
              if (dir === constants_1.Direction.RIGHT) {
                return this.adapter.focusChipPrimaryActionAtIndex(index);
              }
            };
            MDCChipSetFoundation.prototype.getDirection = function (key) {
              var isRTL = this.adapter.isRTL();
              var isLeftKey =
                key === constants_1.strings.ARROW_LEFT_KEY ||
                key === constants_1.strings.IE_ARROW_LEFT_KEY;
              var isRightKey =
                key === constants_1.strings.ARROW_RIGHT_KEY ||
                key === constants_1.strings.IE_ARROW_RIGHT_KEY;
              if ((!isRTL && isLeftKey) || (isRTL && isRightKey)) {
                return constants_1.Direction.LEFT;
              }
              return constants_1.Direction.RIGHT;
            };
            /**
             * Deselects the chip with the given id and optionally notifies clients.
             */
            MDCChipSetFoundation.prototype.deselectImpl = function (chipId, shouldNotifyClients) {
              if (shouldNotifyClients === void 0) {
                shouldNotifyClients = false;
              }
              var index = this.selectedChipIds.indexOf(chipId);
              if (index >= 0) {
                this.selectedChipIds.splice(index, 1);
                var chipIndex = this.adapter.getIndexOfChipById(chipId);
                this.adapter.selectChipAtIndex(
                  chipIndex,
                  /** isSelected */ false,
                  shouldNotifyClients,
                );
              }
            };
            /**
             * Deselects the chip with the given id and notifies clients.
             */
            MDCChipSetFoundation.prototype.deselectAndNotifyClients = function (chipId) {
              this.deselectImpl(chipId, true);
            };
            /**
             * Toggles selection of the chip with the given id.
             */
            MDCChipSetFoundation.prototype.toggleSelect = function (chipId) {
              if (this.selectedChipIds.indexOf(chipId) >= 0) {
                this.deselectAndNotifyClients(chipId);
              } else {
                this.selectAndNotifyClients(chipId);
              }
            };
            MDCChipSetFoundation.prototype.removeFocusFromChipsExcept = function (index) {
              var chipCount = this.adapter.getChipListCount();
              for (var i = 0; i < chipCount; i++) {
                if (i !== index) {
                  this.adapter.removeFocusFromChipAtIndex(i);
                }
              }
            };
            MDCChipSetFoundation.prototype.selectAndNotifyClients = function (chipId) {
              this.selectImpl(chipId, true);
            };
            MDCChipSetFoundation.prototype.selectImpl = function (chipId, shouldNotifyClients) {
              if (this.selectedChipIds.indexOf(chipId) >= 0) {
                return;
              }
              if (
                this.adapter.hasClass(constants_2.cssClasses.CHOICE) &&
                this.selectedChipIds.length > 0
              ) {
                var previouslySelectedChip = this.selectedChipIds[0];
                var previouslySelectedIndex =
                  this.adapter.getIndexOfChipById(previouslySelectedChip);
                this.selectedChipIds = [];
                this.adapter.selectChipAtIndex(
                  previouslySelectedIndex,
                  /** isSelected */ false,
                  shouldNotifyClients,
                );
              }
              this.selectedChipIds.push(chipId);
              var index = this.adapter.getIndexOfChipById(chipId);
              this.adapter.selectChipAtIndex(index, /** isSelected */ true, shouldNotifyClients);
            };
            return MDCChipSetFoundation;
          })(foundation_1.MDCFoundation);
          exports.MDCChipSetFoundation = MDCChipSetFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCChipSetFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip-set/index.ts':
        /*!*********************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip-set/index.ts ***!
  \*********************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function get() {
                      return m[k];
                    },
                  });
                }
              : function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  o[k2] = m[k];
                });
          var __exportStar =
            (this && this.__exportStar) ||
            function (m, exports) {
              for (var p in m) {
                if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                  __createBinding(exports, m, p);
              }
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.chipSetStrings = exports.chipSetCssClasses = void 0;
          __exportStar(
            __webpack_require__(
              /*! ./adapter */ './packages/mdc-chips/deprecated/chip-set/adapter.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./component */ './packages/mdc-chips/deprecated/chip-set/component.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./foundation */ './packages/mdc-chips/deprecated/chip-set/foundation.ts',
            ),
            exports,
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/deprecated/chip-set/constants.ts',
          );
          Object.defineProperty(exports, 'chipSetCssClasses', {
            enumerable: true,
            get: function get() {
              return constants_1.cssClasses;
            },
          });
          Object.defineProperty(exports, 'chipSetStrings', {
            enumerable: true,
            get: function get() {
              return constants_1.strings;
            },
          });

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip/adapter.ts':
        /*!*******************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip/adapter.ts ***!
  \*******************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip/component.ts':
        /*!*********************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip/component.ts ***!
  \*********************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChip = void 0;
          var component_1 = __webpack_require__(
            /*! @material/base/component */ './packages/mdc-base/component.ts',
          );
          var component_2 = __webpack_require__(
            /*! @material/ripple/component */ './packages/mdc-ripple/component.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! @material/ripple/foundation */ './packages/mdc-ripple/foundation.ts',
          );
          var component_3 = __webpack_require__(
            /*! ../trailingaction/component */ './packages/mdc-chips/deprecated/trailingaction/component.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ../trailingaction/constants */ './packages/mdc-chips/deprecated/trailingaction/constants.ts',
          );
          var constants_2 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/deprecated/chip/constants.ts',
          );
          var foundation_2 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-chips/deprecated/chip/foundation.ts',
          );
          var MDCChip = /** @class */ (function (_super) {
            __extends(MDCChip, _super);
            function MDCChip() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            Object.defineProperty(MDCChip.prototype, 'selected', {
              /**
               * @return Whether the chip is selected.
               */
              get: function get() {
                return this.foundation.isSelected();
              },
              /**
               * Sets selected state on the chip.
               */
              set: function set(selected) {
                this.foundation.setSelected(selected);
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChip.prototype, 'shouldRemoveOnTrailingIconClick', {
              /**
               * @return Whether a trailing icon click should trigger exit/removal of the chip.
               */
              get: function get() {
                return this.foundation.getShouldRemoveOnTrailingIconClick();
              },
              /**
               * Sets whether a trailing icon click should trigger exit/removal of the chip.
               */
              set: function set(shouldRemove) {
                this.foundation.setShouldRemoveOnTrailingIconClick(shouldRemove);
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChip.prototype, 'setShouldFocusPrimaryActionOnClick', {
              /**
               * Sets whether a clicking on the chip should focus the primary action.
               */
              set: function set(shouldFocus) {
                this.foundation.setShouldFocusPrimaryActionOnClick(shouldFocus);
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChip.prototype, 'ripple', {
              get: function get() {
                return this.rippleSurface;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChip.prototype, 'id', {
              get: function get() {
                return this.root.id;
              },
              enumerable: false,
              configurable: true,
            });
            MDCChip.attachTo = function (root) {
              return new MDCChip(root);
            };
            MDCChip.prototype.initialize = function (rippleFactory, trailingActionFactory) {
              var _this = this;
              if (rippleFactory === void 0) {
                rippleFactory = function rippleFactory(el, foundation) {
                  return new component_2.MDCRipple(el, foundation);
                };
              }
              if (trailingActionFactory === void 0) {
                trailingActionFactory = function trailingActionFactory(el) {
                  return new component_3.MDCChipTrailingAction(el);
                };
              }
              this.leadingIcon = this.root.querySelector(constants_2.strings.LEADING_ICON_SELECTOR);
              this.checkmark = this.root.querySelector(constants_2.strings.CHECKMARK_SELECTOR);
              this.primaryAction = this.root.querySelector(
                constants_2.strings.PRIMARY_ACTION_SELECTOR,
              );
              var trailingActionEl = this.root.querySelector(
                constants_2.strings.TRAILING_ACTION_SELECTOR,
              );
              if (trailingActionEl) {
                this.trailingAction = trailingActionFactory(trailingActionEl);
              }
              // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
              // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
              var rippleAdapter = __assign(
                __assign({}, component_2.MDCRipple.createAdapter(this)),
                {
                  computeBoundingRect: function computeBoundingRect() {
                    return _this.foundation.getDimensions();
                  },
                },
              );
              this.rippleSurface = rippleFactory(
                this.root,
                new foundation_1.MDCRippleFoundation(rippleAdapter),
              );
            };
            MDCChip.prototype.initialSyncWithDOM = function () {
              var _this = this;
              // Custom events
              this.handleTrailingActionInteraction = function () {
                _this.foundation.handleTrailingActionInteraction();
              };
              this.handleTrailingActionNavigation = function (evt) {
                _this.foundation.handleTrailingActionNavigation(evt);
              };
              // Native events
              this.handleClick = function () {
                _this.foundation.handleClick();
              };
              this.handleKeydown = function (evt) {
                _this.foundation.handleKeydown(evt);
              };
              this.handleTransitionEnd = function (evt) {
                _this.foundation.handleTransitionEnd(evt);
              };
              this.handleFocusIn = function (evt) {
                _this.foundation.handleFocusIn(evt);
              };
              this.handleFocusOut = function (evt) {
                _this.foundation.handleFocusOut(evt);
              };
              this.listen('transitionend', this.handleTransitionEnd);
              this.listen('click', this.handleClick);
              this.listen('keydown', this.handleKeydown);
              this.listen('focusin', this.handleFocusIn);
              this.listen('focusout', this.handleFocusOut);
              if (this.trailingAction) {
                this.listen(
                  constants_1.strings.INTERACTION_EVENT,
                  this.handleTrailingActionInteraction,
                );
                this.listen(
                  constants_1.strings.NAVIGATION_EVENT,
                  this.handleTrailingActionNavigation,
                );
              }
            };
            MDCChip.prototype.destroy = function () {
              this.rippleSurface.destroy();
              this.unlisten('transitionend', this.handleTransitionEnd);
              this.unlisten('keydown', this.handleKeydown);
              this.unlisten('click', this.handleClick);
              this.unlisten('focusin', this.handleFocusIn);
              this.unlisten('focusout', this.handleFocusOut);
              if (this.trailingAction) {
                this.unlisten(
                  constants_1.strings.INTERACTION_EVENT,
                  this.handleTrailingActionInteraction,
                );
                this.unlisten(
                  constants_1.strings.NAVIGATION_EVENT,
                  this.handleTrailingActionNavigation,
                );
              }
              _super.prototype.destroy.call(this);
            };
            /**
             * Begins the exit animation which leads to removal of the chip.
             */
            MDCChip.prototype.beginExit = function () {
              this.foundation.beginExit();
            };
            MDCChip.prototype.getDefaultFoundation = function () {
              var _this = this;
              // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
              // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
              var adapter = {
                addClass: function addClass(className) {
                  return _this.root.classList.add(className);
                },
                addClassToLeadingIcon: function addClassToLeadingIcon(className) {
                  if (_this.leadingIcon) {
                    _this.leadingIcon.classList.add(className);
                  }
                },
                eventTargetHasClass: function eventTargetHasClass(target, className) {
                  return target ? target.classList.contains(className) : false;
                },
                focusPrimaryAction: function focusPrimaryAction() {
                  if (_this.primaryAction) {
                    _this.primaryAction.focus();
                  }
                },
                focusTrailingAction: function focusTrailingAction() {
                  if (_this.trailingAction) {
                    _this.trailingAction.focus();
                  }
                },
                getAttribute: function getAttribute(attr) {
                  return _this.root.getAttribute(attr);
                },
                getCheckmarkBoundingClientRect: function getCheckmarkBoundingClientRect() {
                  return _this.checkmark ? _this.checkmark.getBoundingClientRect() : null;
                },
                getComputedStyleValue: function getComputedStyleValue(propertyName) {
                  return window.getComputedStyle(_this.root).getPropertyValue(propertyName);
                },
                getRootBoundingClientRect: function getRootBoundingClientRect() {
                  return _this.root.getBoundingClientRect();
                },
                hasClass: function hasClass(className) {
                  return _this.root.classList.contains(className);
                },
                hasLeadingIcon: function hasLeadingIcon() {
                  return !!_this.leadingIcon;
                },
                isRTL: function isRTL() {
                  return (
                    window.getComputedStyle(_this.root).getPropertyValue('direction') === 'rtl'
                  );
                },
                isTrailingActionNavigable: function isTrailingActionNavigable() {
                  if (_this.trailingAction) {
                    return _this.trailingAction.isNavigable();
                  }
                  return false;
                },
                notifyInteraction: function notifyInteraction() {
                  return _this.emit(
                    constants_2.strings.INTERACTION_EVENT,
                    { chipId: _this.id },
                    true /* shouldBubble */,
                  );
                },
                notifyNavigation: function notifyNavigation(key, source) {
                  return _this.emit(
                    constants_2.strings.NAVIGATION_EVENT,
                    { chipId: _this.id, key: key, source: source },
                    true /* shouldBubble */,
                  );
                },
                notifyRemoval: function notifyRemoval(removedAnnouncement) {
                  _this.emit(
                    constants_2.strings.REMOVAL_EVENT,
                    { chipId: _this.id, removedAnnouncement: removedAnnouncement },
                    true /* shouldBubble */,
                  );
                },
                notifySelection: function notifySelection(selected, shouldIgnore) {
                  return _this.emit(
                    constants_2.strings.SELECTION_EVENT,
                    { chipId: _this.id, selected: selected, shouldIgnore: shouldIgnore },
                    true /* shouldBubble */,
                  );
                },
                notifyTrailingIconInteraction: function notifyTrailingIconInteraction() {
                  return _this.emit(
                    constants_2.strings.TRAILING_ICON_INTERACTION_EVENT,
                    { chipId: _this.id },
                    true /* shouldBubble */,
                  );
                },
                notifyEditStart: function notifyEditStart() {},
                notifyEditFinish: function notifyEditFinish() {},
                removeClass: function removeClass(className) {
                  return _this.root.classList.remove(className);
                },
                removeClassFromLeadingIcon: function removeClassFromLeadingIcon(className) {
                  if (_this.leadingIcon) {
                    _this.leadingIcon.classList.remove(className);
                  }
                },
                removeTrailingActionFocus: function removeTrailingActionFocus() {
                  if (_this.trailingAction) {
                    _this.trailingAction.removeFocus();
                  }
                },
                setPrimaryActionAttr: function setPrimaryActionAttr(attr, value) {
                  if (_this.primaryAction) {
                    _this.primaryAction.setAttribute(attr, value);
                  }
                },
                setStyleProperty: function setStyleProperty(propertyName, value) {
                  return _this.root.style.setProperty(propertyName, value);
                },
              };
              return new foundation_2.MDCChipFoundation(adapter);
            };
            MDCChip.prototype.setSelectedFromChipSet = function (selected, shouldNotifyClients) {
              this.foundation.setSelectedFromChipSet(selected, shouldNotifyClients);
            };
            MDCChip.prototype.focusPrimaryAction = function () {
              this.foundation.focusPrimaryAction();
            };
            MDCChip.prototype.focusTrailingAction = function () {
              this.foundation.focusTrailingAction();
            };
            MDCChip.prototype.removeFocus = function () {
              this.foundation.removeFocus();
            };
            MDCChip.prototype.remove = function () {
              var parent = this.root.parentNode;
              if (parent !== null) {
                parent.removeChild(this.root);
              }
            };
            return MDCChip;
          })(component_1.MDCComponent);
          exports.MDCChip = MDCChip;

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip/constants.ts':
        /*!*********************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip/constants.ts ***!
  \*********************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.jumpChipKeys =
            exports.navigationKeys =
            exports.cssClasses =
            exports.strings =
            exports.EventSource =
            exports.Direction =
              void 0;
          var Direction;
          (function (Direction) {
            Direction['LEFT'] = 'left';
            Direction['RIGHT'] = 'right';
          })((Direction = exports.Direction || (exports.Direction = {})));
          var EventSource;
          (function (EventSource) {
            EventSource['PRIMARY'] = 'primary';
            EventSource['TRAILING'] = 'trailing';
            EventSource['NONE'] = 'none';
          })((EventSource = exports.EventSource || (exports.EventSource = {})));
          exports.strings = {
            ADDED_ANNOUNCEMENT_ATTRIBUTE: 'data-mdc-chip-added-announcement',
            ARIA_CHECKED: 'aria-checked',
            ARROW_DOWN_KEY: 'ArrowDown',
            ARROW_LEFT_KEY: 'ArrowLeft',
            ARROW_RIGHT_KEY: 'ArrowRight',
            ARROW_UP_KEY: 'ArrowUp',
            BACKSPACE_KEY: 'Backspace',
            CHECKMARK_SELECTOR: '.mdc-chip__checkmark',
            DELETE_KEY: 'Delete',
            END_KEY: 'End',
            ENTER_KEY: 'Enter',
            ENTRY_ANIMATION_NAME: 'mdc-chip-entry',
            HOME_KEY: 'Home',
            IE_ARROW_DOWN_KEY: 'Down',
            IE_ARROW_LEFT_KEY: 'Left',
            IE_ARROW_RIGHT_KEY: 'Right',
            IE_ARROW_UP_KEY: 'Up',
            IE_DELETE_KEY: 'Del',
            INTERACTION_EVENT: 'MDCChip:interaction',
            LEADING_ICON_SELECTOR: '.mdc-chip__icon--leading',
            NAVIGATION_EVENT: 'MDCChip:navigation',
            PRIMARY_ACTION_SELECTOR: '.mdc-chip__primary-action',
            REMOVED_ANNOUNCEMENT_ATTRIBUTE: 'data-mdc-chip-removed-announcement',
            REMOVAL_EVENT: 'MDCChip:removal',
            SELECTION_EVENT: 'MDCChip:selection',
            SPACEBAR_KEY: ' ',
            TAB_INDEX: 'tabindex',
            TRAILING_ACTION_SELECTOR: '.mdc-chip-trailing-action',
            TRAILING_ICON_INTERACTION_EVENT: 'MDCChip:trailingIconInteraction',
            TRAILING_ICON_SELECTOR: '.mdc-chip__icon--trailing',
          };
          exports.cssClasses = {
            CHECKMARK: 'mdc-chip__checkmark',
            CHIP_EXIT: 'mdc-chip--exit',
            DELETABLE: 'mdc-chip--deletable',
            EDITABLE: 'mdc-chip--editable',
            EDITING: 'mdc-chip--editing',
            HIDDEN_LEADING_ICON: 'mdc-chip__icon--leading-hidden',
            LEADING_ICON: 'mdc-chip__icon--leading',
            PRIMARY_ACTION: 'mdc-chip__primary-action',
            PRIMARY_ACTION_FOCUSED: 'mdc-chip--primary-action-focused',
            SELECTED: 'mdc-chip--selected',
            TEXT: 'mdc-chip__text',
            TRAILING_ACTION: 'mdc-chip__trailing-action',
            TRAILING_ICON: 'mdc-chip__icon--trailing',
          };
          exports.navigationKeys = new Set();
          // IE11 has no support for new Set with iterable so we need to initialize this by hand
          exports.navigationKeys.add(exports.strings.ARROW_LEFT_KEY);
          exports.navigationKeys.add(exports.strings.ARROW_RIGHT_KEY);
          exports.navigationKeys.add(exports.strings.ARROW_DOWN_KEY);
          exports.navigationKeys.add(exports.strings.ARROW_UP_KEY);
          exports.navigationKeys.add(exports.strings.END_KEY);
          exports.navigationKeys.add(exports.strings.HOME_KEY);
          exports.navigationKeys.add(exports.strings.IE_ARROW_LEFT_KEY);
          exports.navigationKeys.add(exports.strings.IE_ARROW_RIGHT_KEY);
          exports.navigationKeys.add(exports.strings.IE_ARROW_DOWN_KEY);
          exports.navigationKeys.add(exports.strings.IE_ARROW_UP_KEY);
          exports.jumpChipKeys = new Set();
          // IE11 has no support for new Set with iterable so we need to initialize this by hand
          exports.jumpChipKeys.add(exports.strings.ARROW_UP_KEY);
          exports.jumpChipKeys.add(exports.strings.ARROW_DOWN_KEY);
          exports.jumpChipKeys.add(exports.strings.HOME_KEY);
          exports.jumpChipKeys.add(exports.strings.END_KEY);
          exports.jumpChipKeys.add(exports.strings.IE_ARROW_UP_KEY);
          exports.jumpChipKeys.add(exports.strings.IE_ARROW_DOWN_KEY);

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip/foundation.ts':
        /*!**********************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip/foundation.ts ***!
  \**********************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipFoundation = void 0;
          var foundation_1 = __webpack_require__(
            /*! @material/base/foundation */ './packages/mdc-base/foundation.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/deprecated/chip/constants.ts',
          );
          var emptyClientRect = {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
          };
          var FocusBehavior;
          (function (FocusBehavior) {
            FocusBehavior[(FocusBehavior['SHOULD_FOCUS'] = 0)] = 'SHOULD_FOCUS';
            FocusBehavior[(FocusBehavior['SHOULD_NOT_FOCUS'] = 1)] = 'SHOULD_NOT_FOCUS';
          })(FocusBehavior || (FocusBehavior = {}));
          var MDCChipFoundation = /** @class */ (function (_super) {
            __extends(MDCChipFoundation, _super);
            function MDCChipFoundation(adapter) {
              var _this =
                _super.call(
                  this,
                  __assign(__assign({}, MDCChipFoundation.defaultAdapter), adapter),
                ) || this;
              /** Whether a trailing icon click should immediately trigger exit/removal of the chip. */
              _this.shouldRemoveOnTrailingIconClick = true;
              /**
               * Whether the primary action should receive focus on click. Should only be
               * set to true for clients who programmatically give focus to a different
               * element on the page when a chip is clicked (like a menu).
               */
              _this.shouldFocusPrimaryActionOnClick = true;
              return _this;
            }
            Object.defineProperty(MDCChipFoundation, 'strings', {
              get: function get() {
                return constants_1.strings;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChipFoundation, 'cssClasses', {
              get: function get() {
                return constants_1.cssClasses;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChipFoundation, 'defaultAdapter', {
              get: function get() {
                return {
                  addClass: function addClass() {
                    return undefined;
                  },
                  addClassToLeadingIcon: function addClassToLeadingIcon() {
                    return undefined;
                  },
                  eventTargetHasClass: function eventTargetHasClass() {
                    return false;
                  },
                  focusPrimaryAction: function focusPrimaryAction() {
                    return undefined;
                  },
                  focusTrailingAction: function focusTrailingAction() {
                    return undefined;
                  },
                  getAttribute: function getAttribute() {
                    return null;
                  },
                  getCheckmarkBoundingClientRect: function getCheckmarkBoundingClientRect() {
                    return emptyClientRect;
                  },
                  getComputedStyleValue: function getComputedStyleValue() {
                    return '';
                  },
                  getRootBoundingClientRect: function getRootBoundingClientRect() {
                    return emptyClientRect;
                  },
                  hasClass: function hasClass() {
                    return false;
                  },
                  hasLeadingIcon: function hasLeadingIcon() {
                    return false;
                  },
                  isRTL: function isRTL() {
                    return false;
                  },
                  isTrailingActionNavigable: function isTrailingActionNavigable() {
                    return false;
                  },
                  notifyEditFinish: function notifyEditFinish() {
                    return undefined;
                  },
                  notifyEditStart: function notifyEditStart() {
                    return undefined;
                  },
                  notifyInteraction: function notifyInteraction() {
                    return undefined;
                  },
                  notifyNavigation: function notifyNavigation() {
                    return undefined;
                  },
                  notifyRemoval: function notifyRemoval() {
                    return undefined;
                  },
                  notifySelection: function notifySelection() {
                    return undefined;
                  },
                  notifyTrailingIconInteraction: function notifyTrailingIconInteraction() {
                    return undefined;
                  },
                  removeClass: function removeClass() {
                    return undefined;
                  },
                  removeClassFromLeadingIcon: function removeClassFromLeadingIcon() {
                    return undefined;
                  },
                  removeTrailingActionFocus: function removeTrailingActionFocus() {
                    return undefined;
                  },
                  setPrimaryActionAttr: function setPrimaryActionAttr() {
                    return undefined;
                  },
                  setStyleProperty: function setStyleProperty() {
                    return undefined;
                  },
                };
              },
              enumerable: false,
              configurable: true,
            });
            MDCChipFoundation.prototype.isSelected = function () {
              return this.adapter.hasClass(constants_1.cssClasses.SELECTED);
            };
            MDCChipFoundation.prototype.isEditable = function () {
              return this.adapter.hasClass(constants_1.cssClasses.EDITABLE);
            };
            MDCChipFoundation.prototype.isEditing = function () {
              return this.adapter.hasClass(constants_1.cssClasses.EDITING);
            };
            MDCChipFoundation.prototype.setSelected = function (selected) {
              this.setSelectedImpl(selected);
              this.notifySelection(selected);
            };
            MDCChipFoundation.prototype.setSelectedFromChipSet = function (
              selected,
              shouldNotifyClients,
            ) {
              this.setSelectedImpl(selected);
              if (shouldNotifyClients) {
                this.notifyIgnoredSelection(selected);
              }
            };
            MDCChipFoundation.prototype.getShouldRemoveOnTrailingIconClick = function () {
              return this.shouldRemoveOnTrailingIconClick;
            };
            MDCChipFoundation.prototype.setShouldRemoveOnTrailingIconClick = function (
              shouldRemove,
            ) {
              this.shouldRemoveOnTrailingIconClick = shouldRemove;
            };
            MDCChipFoundation.prototype.setShouldFocusPrimaryActionOnClick = function (
              shouldFocus,
            ) {
              this.shouldFocusPrimaryActionOnClick = shouldFocus;
            };
            MDCChipFoundation.prototype.getDimensions = function () {
              var _this = this;
              var getRootRect = function getRootRect() {
                return _this.adapter.getRootBoundingClientRect();
              };
              var getCheckmarkRect = function getCheckmarkRect() {
                return _this.adapter.getCheckmarkBoundingClientRect();
              };
              // When a chip has a checkmark and not a leading icon, the bounding rect changes in size depending on the current
              // size of the checkmark.
              if (!this.adapter.hasLeadingIcon()) {
                var checkmarkRect = getCheckmarkRect();
                if (checkmarkRect) {
                  var rootRect = getRootRect();
                  // Checkmark is a square, meaning the client rect's width and height are identical once the animation completes.
                  // However, the checkbox is initially hidden by setting the width to 0.
                  // To account for an initial width of 0, we use the checkbox's height instead (which equals the end-state width)
                  // when adding it to the root client rect's width.
                  return {
                    bottom: rootRect.bottom,
                    height: rootRect.height,
                    left: rootRect.left,
                    right: rootRect.right,
                    top: rootRect.top,
                    width: rootRect.width + checkmarkRect.height,
                  };
                }
              }
              return getRootRect();
            };
            /**
             * Begins the exit animation which leads to removal of the chip.
             */
            MDCChipFoundation.prototype.beginExit = function () {
              this.adapter.addClass(constants_1.cssClasses.CHIP_EXIT);
            };
            MDCChipFoundation.prototype.handleClick = function () {
              this.adapter.notifyInteraction();
              this.setPrimaryActionFocusable(this.getFocusBehavior());
            };
            MDCChipFoundation.prototype.handleDoubleClick = function () {
              if (this.isEditable()) {
                this.startEditing();
              }
            };
            /**
             * Handles a transition end event on the root element.
             */
            MDCChipFoundation.prototype.handleTransitionEnd = function (evt) {
              var _this = this;
              // Handle transition end event on the chip when it is about to be removed.
              var shouldHandle = this.adapter.eventTargetHasClass(
                evt.target,
                constants_1.cssClasses.CHIP_EXIT,
              );
              var widthIsAnimating = evt.propertyName === 'width';
              var opacityIsAnimating = evt.propertyName === 'opacity';
              if (shouldHandle && opacityIsAnimating) {
                // See: https://css-tricks.com/using-css-transitions-auto-dimensions/#article-header-id-5
                var chipWidth_1 = this.adapter.getComputedStyleValue('width');
                // On the next frame (once we get the computed width), explicitly set the chip's width
                // to its current pixel width, so we aren't transitioning out of 'auto'.
                requestAnimationFrame(function () {
                  _this.adapter.setStyleProperty('width', chipWidth_1);
                  // To mitigate jitter, start transitioning padding and margin before width.
                  _this.adapter.setStyleProperty('padding', '0');
                  _this.adapter.setStyleProperty('margin', '0');
                  // On the next frame (once width is explicitly set), transition width to 0.
                  requestAnimationFrame(function () {
                    _this.adapter.setStyleProperty('width', '0');
                  });
                });
                return;
              }
              if (shouldHandle && widthIsAnimating) {
                this.removeFocus();
                var removedAnnouncement = this.adapter.getAttribute(
                  constants_1.strings.REMOVED_ANNOUNCEMENT_ATTRIBUTE,
                );
                this.adapter.notifyRemoval(removedAnnouncement);
              }
              // Handle a transition end event on the leading icon or checkmark, since the transition end event bubbles.
              if (!opacityIsAnimating) {
                return;
              }
              var shouldHideLeadingIcon =
                this.adapter.eventTargetHasClass(evt.target, constants_1.cssClasses.LEADING_ICON) &&
                this.adapter.hasClass(constants_1.cssClasses.SELECTED);
              var shouldShowLeadingIcon =
                this.adapter.eventTargetHasClass(evt.target, constants_1.cssClasses.CHECKMARK) &&
                !this.adapter.hasClass(constants_1.cssClasses.SELECTED);
              if (shouldHideLeadingIcon) {
                this.adapter.addClassToLeadingIcon(constants_1.cssClasses.HIDDEN_LEADING_ICON);
                return;
              }
              if (shouldShowLeadingIcon) {
                this.adapter.removeClassFromLeadingIcon(constants_1.cssClasses.HIDDEN_LEADING_ICON);
                return;
              }
            };
            MDCChipFoundation.prototype.handleFocusIn = function (evt) {
              // Early exit if the event doesn't come from the primary action
              if (!this.eventFromPrimaryAction(evt)) {
                return;
              }
              this.adapter.addClass(constants_1.cssClasses.PRIMARY_ACTION_FOCUSED);
            };
            MDCChipFoundation.prototype.handleFocusOut = function (evt) {
              // Early exit if the event doesn't come from the primary action
              if (!this.eventFromPrimaryAction(evt)) {
                return;
              }
              if (this.isEditing()) {
                this.finishEditing();
              }
              this.adapter.removeClass(constants_1.cssClasses.PRIMARY_ACTION_FOCUSED);
            };
            /**
             * Handles an interaction event on the trailing icon element. This is used to
             * prevent the ripple from activating on interaction with the trailing icon.
             */
            MDCChipFoundation.prototype.handleTrailingActionInteraction = function () {
              this.adapter.notifyTrailingIconInteraction();
              this.removeChip();
            };
            /**
             * Handles a keydown event from the root element.
             */
            MDCChipFoundation.prototype.handleKeydown = function (evt) {
              if (this.isEditing()) {
                if (this.shouldFinishEditing(evt)) {
                  evt.preventDefault();
                  this.finishEditing();
                }
                // When editing, the foundation should only handle key events that finish
                // the editing process.
                return;
              }
              if (this.isEditable()) {
                if (this.shouldStartEditing(evt)) {
                  evt.preventDefault();
                  this.startEditing();
                }
              }
              if (this.shouldNotifyInteraction(evt)) {
                this.adapter.notifyInteraction();
                this.setPrimaryActionFocusable(this.getFocusBehavior());
                return;
              }
              if (this.isDeleteAction(evt)) {
                evt.preventDefault();
                this.removeChip();
                return;
              }
              // Early exit if the key is not usable
              if (!constants_1.navigationKeys.has(evt.key)) {
                return;
              }
              // Prevent default behavior for movement keys which could include scrolling
              evt.preventDefault();
              this.focusNextAction(evt.key, constants_1.EventSource.PRIMARY);
            };
            MDCChipFoundation.prototype.handleTrailingActionNavigation = function (evt) {
              this.focusNextAction(evt.detail.key, constants_1.EventSource.TRAILING);
            };
            /**
             * Called by the chip set to remove focus from the chip actions.
             */
            MDCChipFoundation.prototype.removeFocus = function () {
              this.adapter.setPrimaryActionAttr(constants_1.strings.TAB_INDEX, '-1');
              this.adapter.removeTrailingActionFocus();
            };
            /**
             * Called by the chip set to focus the primary action.
             *
             */
            MDCChipFoundation.prototype.focusPrimaryAction = function () {
              this.setPrimaryActionFocusable(FocusBehavior.SHOULD_FOCUS);
            };
            /**
             * Called by the chip set to focus the trailing action (if present), otherwise
             * gives focus to the trailing action.
             */
            MDCChipFoundation.prototype.focusTrailingAction = function () {
              var trailingActionIsNavigable = this.adapter.isTrailingActionNavigable();
              if (trailingActionIsNavigable) {
                this.adapter.setPrimaryActionAttr(constants_1.strings.TAB_INDEX, '-1');
                this.adapter.focusTrailingAction();
                return;
              }
              this.focusPrimaryAction();
            };
            MDCChipFoundation.prototype.setPrimaryActionFocusable = function (focusBehavior) {
              this.adapter.setPrimaryActionAttr(constants_1.strings.TAB_INDEX, '0');
              if (focusBehavior === FocusBehavior.SHOULD_FOCUS) {
                this.adapter.focusPrimaryAction();
              }
              this.adapter.removeTrailingActionFocus();
            };
            MDCChipFoundation.prototype.getFocusBehavior = function () {
              if (this.shouldFocusPrimaryActionOnClick) {
                return FocusBehavior.SHOULD_FOCUS;
              }
              return FocusBehavior.SHOULD_NOT_FOCUS;
            };
            MDCChipFoundation.prototype.focusNextAction = function (key, source) {
              var isTrailingActionNavigable = this.adapter.isTrailingActionNavigable();
              var dir = this.getDirection(key);
              // Early exit if the key should jump chips
              if (constants_1.jumpChipKeys.has(key) || !isTrailingActionNavigable) {
                this.adapter.notifyNavigation(key, source);
                return;
              }
              if (
                source === constants_1.EventSource.PRIMARY &&
                dir === constants_1.Direction.RIGHT
              ) {
                this.focusTrailingAction();
                return;
              }
              if (
                source === constants_1.EventSource.TRAILING &&
                dir === constants_1.Direction.LEFT
              ) {
                this.focusPrimaryAction();
                return;
              }
              this.adapter.notifyNavigation(key, constants_1.EventSource.NONE);
            };
            MDCChipFoundation.prototype.getDirection = function (key) {
              var isRTL = this.adapter.isRTL();
              var isLeftKey =
                key === constants_1.strings.ARROW_LEFT_KEY ||
                key === constants_1.strings.IE_ARROW_LEFT_KEY;
              var isRightKey =
                key === constants_1.strings.ARROW_RIGHT_KEY ||
                key === constants_1.strings.IE_ARROW_RIGHT_KEY;
              if ((!isRTL && isLeftKey) || (isRTL && isRightKey)) {
                return constants_1.Direction.LEFT;
              }
              return constants_1.Direction.RIGHT;
            };
            MDCChipFoundation.prototype.removeChip = function () {
              if (this.shouldRemoveOnTrailingIconClick) {
                this.beginExit();
              }
            };
            MDCChipFoundation.prototype.shouldStartEditing = function (evt) {
              return this.eventFromPrimaryAction(evt) && evt.key === constants_1.strings.ENTER_KEY;
            };
            MDCChipFoundation.prototype.shouldFinishEditing = function (evt) {
              return evt.key === constants_1.strings.ENTER_KEY;
            };
            MDCChipFoundation.prototype.shouldNotifyInteraction = function (evt) {
              return (
                evt.key === constants_1.strings.ENTER_KEY ||
                evt.key === constants_1.strings.SPACEBAR_KEY
              );
            };
            MDCChipFoundation.prototype.isDeleteAction = function (evt) {
              var isDeletable = this.adapter.hasClass(constants_1.cssClasses.DELETABLE);
              return (
                isDeletable &&
                (evt.key === constants_1.strings.BACKSPACE_KEY ||
                  evt.key === constants_1.strings.DELETE_KEY ||
                  evt.key === constants_1.strings.IE_DELETE_KEY)
              );
            };
            MDCChipFoundation.prototype.setSelectedImpl = function (selected) {
              if (selected) {
                this.adapter.addClass(constants_1.cssClasses.SELECTED);
                this.adapter.setPrimaryActionAttr(constants_1.strings.ARIA_CHECKED, 'true');
              } else {
                this.adapter.removeClass(constants_1.cssClasses.SELECTED);
                this.adapter.setPrimaryActionAttr(constants_1.strings.ARIA_CHECKED, 'false');
              }
            };
            MDCChipFoundation.prototype.notifySelection = function (selected) {
              this.adapter.notifySelection(selected, false);
            };
            MDCChipFoundation.prototype.notifyIgnoredSelection = function (selected) {
              this.adapter.notifySelection(selected, true);
            };
            MDCChipFoundation.prototype.eventFromPrimaryAction = function (evt) {
              return this.adapter.eventTargetHasClass(
                evt.target,
                constants_1.cssClasses.PRIMARY_ACTION,
              );
            };
            MDCChipFoundation.prototype.startEditing = function () {
              this.adapter.addClass(constants_1.cssClasses.EDITING);
              this.adapter.notifyEditStart();
            };
            MDCChipFoundation.prototype.finishEditing = function () {
              this.adapter.removeClass(constants_1.cssClasses.EDITING);
              this.adapter.notifyEditFinish();
            };
            return MDCChipFoundation;
          })(foundation_1.MDCFoundation);
          exports.MDCChipFoundation = MDCChipFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCChipFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip/index.ts':
        /*!*****************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip/index.ts ***!
  \*****************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function get() {
                      return m[k];
                    },
                  });
                }
              : function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  o[k2] = m[k];
                });
          var __exportStar =
            (this && this.__exportStar) ||
            function (m, exports) {
              for (var p in m) {
                if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                  __createBinding(exports, m, p);
              }
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.chipStrings = exports.chipCssClasses = void 0;
          __exportStar(
            __webpack_require__(/*! ./adapter */ './packages/mdc-chips/deprecated/chip/adapter.ts'),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./component */ './packages/mdc-chips/deprecated/chip/component.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./foundation */ './packages/mdc-chips/deprecated/chip/foundation.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(/*! ./types */ './packages/mdc-chips/deprecated/chip/types.ts'),
            exports,
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/deprecated/chip/constants.ts',
          );
          Object.defineProperty(exports, 'chipCssClasses', {
            enumerable: true,
            get: function get() {
              return constants_1.cssClasses;
            },
          });
          Object.defineProperty(exports, 'chipStrings', {
            enumerable: true,
            get: function get() {
              return constants_1.strings;
            },
          });

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/chip/types.ts':
        /*!*****************************************************!*\
  !*** ./packages/mdc-chips/deprecated/chip/types.ts ***!
  \*****************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/index.ts':
        /*!************************************************!*\
  !*** ./packages/mdc-chips/deprecated/index.ts ***!
  \************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function get() {
                      return m[k];
                    },
                  });
                }
              : function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  o[k2] = m[k];
                });
          var __exportStar =
            (this && this.__exportStar) ||
            function (m, exports) {
              for (var p in m) {
                if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                  __createBinding(exports, m, p);
              }
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          __exportStar(
            __webpack_require__(
              /*! ./trailingaction/index */ './packages/mdc-chips/deprecated/trailingaction/index.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./chip/index */ './packages/mdc-chips/deprecated/chip/index.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./chip-set/index */ './packages/mdc-chips/deprecated/chip-set/index.ts',
            ),
            exports,
          );

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/trailingaction/adapter.ts':
        /*!*****************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/trailingaction/adapter.ts ***!
  \*****************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/trailingaction/component.ts':
        /*!*******************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/trailingaction/component.ts ***!
  \*******************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipTrailingAction = void 0;
          var component_1 = __webpack_require__(
            /*! @material/base/component */ './packages/mdc-base/component.ts',
          );
          var component_2 = __webpack_require__(
            /*! @material/ripple/component */ './packages/mdc-ripple/component.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! @material/ripple/foundation */ './packages/mdc-ripple/foundation.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/deprecated/trailingaction/constants.ts',
          );
          var foundation_2 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-chips/deprecated/trailingaction/foundation.ts',
          );
          var MDCChipTrailingAction = /** @class */ (function (_super) {
            __extends(MDCChipTrailingAction, _super);
            function MDCChipTrailingAction() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            Object.defineProperty(MDCChipTrailingAction.prototype, 'ripple', {
              get: function get() {
                return this.rippleSurface;
              },
              enumerable: false,
              configurable: true,
            });
            MDCChipTrailingAction.attachTo = function (root) {
              return new MDCChipTrailingAction(root);
            };
            MDCChipTrailingAction.prototype.initialize = function (rippleFactory) {
              if (rippleFactory === void 0) {
                rippleFactory = function rippleFactory(el, foundation) {
                  return new component_2.MDCRipple(el, foundation);
                };
              }
              // DO NOT INLINE this variable. For backward compatibility, foundations take
              // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
              // methods, we need a separate, strongly typed adapter variable.
              var rippleAdapter = component_2.MDCRipple.createAdapter(this);
              this.rippleSurface = rippleFactory(
                this.root,
                new foundation_1.MDCRippleFoundation(rippleAdapter),
              );
            };
            MDCChipTrailingAction.prototype.initialSyncWithDOM = function () {
              var _this = this;
              this.handleClick = function (evt) {
                _this.foundation.handleClick(evt);
              };
              this.handleKeydown = function (evt) {
                _this.foundation.handleKeydown(evt);
              };
              this.listen('click', this.handleClick);
              this.listen('keydown', this.handleKeydown);
            };
            MDCChipTrailingAction.prototype.destroy = function () {
              this.rippleSurface.destroy();
              this.unlisten('click', this.handleClick);
              this.unlisten('keydown', this.handleKeydown);
              _super.prototype.destroy.call(this);
            };
            MDCChipTrailingAction.prototype.getDefaultFoundation = function () {
              var _this = this;
              // DO NOT INLINE this variable. For backward compatibility, foundations take
              // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
              // methods, we need a separate, strongly typed adapter variable.
              var adapter = {
                focus: function focus() {
                  // TODO(b/157231863): Migate MDCComponent#root to HTMLElement
                  _this.root.focus();
                },
                getAttribute: function getAttribute(attr) {
                  return _this.root.getAttribute(attr);
                },
                notifyInteraction: function notifyInteraction(trigger) {
                  return _this.emit(
                    constants_1.strings.INTERACTION_EVENT,
                    { trigger: trigger },
                    true /* shouldBubble */,
                  );
                },
                notifyNavigation: function notifyNavigation(key) {
                  _this.emit(
                    constants_1.strings.NAVIGATION_EVENT,
                    { key: key },
                    true /* shouldBubble */,
                  );
                },
                setAttribute: function setAttribute(attr, value) {
                  _this.root.setAttribute(attr, value);
                },
              };
              return new foundation_2.MDCChipTrailingActionFoundation(adapter);
            };
            MDCChipTrailingAction.prototype.isNavigable = function () {
              return this.foundation.isNavigable();
            };
            MDCChipTrailingAction.prototype.focus = function () {
              this.foundation.focus();
            };
            MDCChipTrailingAction.prototype.removeFocus = function () {
              this.foundation.removeFocus();
            };
            return MDCChipTrailingAction;
          })(component_1.MDCComponent);
          exports.MDCChipTrailingAction = MDCChipTrailingAction;

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/trailingaction/constants.ts':
        /*!*******************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/trailingaction/constants.ts ***!
  \*******************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.strings = exports.InteractionTrigger = void 0;
          var InteractionTrigger;
          (function (InteractionTrigger) {
            InteractionTrigger[(InteractionTrigger['UNSPECIFIED'] = 0)] = 'UNSPECIFIED';
            InteractionTrigger[(InteractionTrigger['CLICK'] = 1)] = 'CLICK';
            InteractionTrigger[(InteractionTrigger['BACKSPACE_KEY'] = 2)] = 'BACKSPACE_KEY';
            InteractionTrigger[(InteractionTrigger['DELETE_KEY'] = 3)] = 'DELETE_KEY';
            InteractionTrigger[(InteractionTrigger['SPACEBAR_KEY'] = 4)] = 'SPACEBAR_KEY';
            InteractionTrigger[(InteractionTrigger['ENTER_KEY'] = 5)] = 'ENTER_KEY';
          })(
            (InteractionTrigger = exports.InteractionTrigger || (exports.InteractionTrigger = {})),
          );
          exports.strings = {
            ARIA_HIDDEN: 'aria-hidden',
            INTERACTION_EVENT: 'MDCChipTrailingAction:interaction',
            NAVIGATION_EVENT: 'MDCChipTrailingAction:navigation',
            TAB_INDEX: 'tabindex',
          };

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/trailingaction/foundation.ts':
        /*!********************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/trailingaction/foundation.ts ***!
  \********************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCChipTrailingActionFoundation = void 0;
          var foundation_1 = __webpack_require__(
            /*! @material/base/foundation */ './packages/mdc-base/foundation.ts',
          );
          var keyboard_1 = __webpack_require__(
            /*! @material/dom/keyboard */ './packages/mdc-dom/keyboard.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/deprecated/trailingaction/constants.ts',
          );
          var MDCChipTrailingActionFoundation = /** @class */ (function (_super) {
            __extends(MDCChipTrailingActionFoundation, _super);
            function MDCChipTrailingActionFoundation(adapter) {
              return (
                _super.call(
                  this,
                  __assign(__assign({}, MDCChipTrailingActionFoundation.defaultAdapter), adapter),
                ) || this
              );
            }
            Object.defineProperty(MDCChipTrailingActionFoundation, 'strings', {
              get: function get() {
                return constants_1.strings;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCChipTrailingActionFoundation, 'defaultAdapter', {
              get: function get() {
                return {
                  focus: function focus() {
                    return undefined;
                  },
                  getAttribute: function getAttribute() {
                    return null;
                  },
                  setAttribute: function setAttribute() {
                    return undefined;
                  },
                  notifyInteraction: function notifyInteraction() {
                    return undefined;
                  },
                  notifyNavigation: function notifyNavigation() {
                    return undefined;
                  },
                };
              },
              enumerable: false,
              configurable: true,
            });
            MDCChipTrailingActionFoundation.prototype.handleClick = function (evt) {
              evt.stopPropagation();
              this.adapter.notifyInteraction(constants_1.InteractionTrigger.CLICK);
            };
            MDCChipTrailingActionFoundation.prototype.handleKeydown = function (evt) {
              evt.stopPropagation();
              var key = keyboard_1.normalizeKey(evt);
              if (this.shouldNotifyInteractionFromKey(key)) {
                var trigger = this.getTriggerFromKey(key);
                this.adapter.notifyInteraction(trigger);
                return;
              }
              if (keyboard_1.isNavigationEvent(evt)) {
                this.adapter.notifyNavigation(key);
                return;
              }
            };
            MDCChipTrailingActionFoundation.prototype.removeFocus = function () {
              this.adapter.setAttribute(constants_1.strings.TAB_INDEX, '-1');
            };
            MDCChipTrailingActionFoundation.prototype.focus = function () {
              this.adapter.setAttribute(constants_1.strings.TAB_INDEX, '0');
              this.adapter.focus();
            };
            MDCChipTrailingActionFoundation.prototype.isNavigable = function () {
              return this.adapter.getAttribute(constants_1.strings.ARIA_HIDDEN) !== 'true';
            };
            MDCChipTrailingActionFoundation.prototype.shouldNotifyInteractionFromKey = function (
              key,
            ) {
              var isFromActionKey = key === keyboard_1.KEY.ENTER || key === keyboard_1.KEY.SPACEBAR;
              var isFromDeleteKey =
                key === keyboard_1.KEY.BACKSPACE || key === keyboard_1.KEY.DELETE;
              return isFromActionKey || isFromDeleteKey;
            };
            MDCChipTrailingActionFoundation.prototype.getTriggerFromKey = function (key) {
              if (key === keyboard_1.KEY.SPACEBAR) {
                return constants_1.InteractionTrigger.SPACEBAR_KEY;
              }
              if (key === keyboard_1.KEY.ENTER) {
                return constants_1.InteractionTrigger.ENTER_KEY;
              }
              if (key === keyboard_1.KEY.DELETE) {
                return constants_1.InteractionTrigger.DELETE_KEY;
              }
              if (key === keyboard_1.KEY.BACKSPACE) {
                return constants_1.InteractionTrigger.BACKSPACE_KEY;
              }
              // Default case, should never be returned
              return constants_1.InteractionTrigger.UNSPECIFIED;
            };
            return MDCChipTrailingActionFoundation;
          })(foundation_1.MDCFoundation);
          exports.MDCChipTrailingActionFoundation = MDCChipTrailingActionFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCChipTrailingActionFoundation;

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/trailingaction/index.ts':
        /*!***************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/trailingaction/index.ts ***!
  \***************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function get() {
                      return m[k];
                    },
                  });
                }
              : function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  o[k2] = m[k];
                });
          var __exportStar =
            (this && this.__exportStar) ||
            function (m, exports) {
              for (var p in m) {
                if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                  __createBinding(exports, m, p);
              }
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.trailingActionStrings = void 0;
          __exportStar(
            __webpack_require__(
              /*! ./adapter */ './packages/mdc-chips/deprecated/trailingaction/adapter.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./component */ './packages/mdc-chips/deprecated/trailingaction/component.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./foundation */ './packages/mdc-chips/deprecated/trailingaction/foundation.ts',
            ),
            exports,
          );
          __exportStar(
            __webpack_require__(
              /*! ./types */ './packages/mdc-chips/deprecated/trailingaction/types.ts',
            ),
            exports,
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-chips/deprecated/trailingaction/constants.ts',
          );
          Object.defineProperty(exports, 'trailingActionStrings', {
            enumerable: true,
            get: function get() {
              return constants_1.strings;
            },
          });

          /***/
        },

      /***/ './packages/mdc-chips/deprecated/trailingaction/types.ts':
        /*!***************************************************************!*\
  !*** ./packages/mdc-chips/deprecated/trailingaction/types.ts ***!
  \***************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });

          /***/
        },

      /***/ './packages/mdc-chips/index.ts':
        /*!*************************************!*\
  !*** ./packages/mdc-chips/index.ts ***!
  \*************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function get() {
                      return m[k];
                    },
                  });
                }
              : function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  o[k2] = m[k];
                });
          var __setModuleDefault =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (o, v) {
                  Object.defineProperty(o, 'default', { enumerable: true, value: v });
                }
              : function (o, v) {
                  o['default'] = v;
                });
          var __exportStar =
            (this && this.__exportStar) ||
            function (m, exports) {
              for (var p in m) {
                if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                  __createBinding(exports, m, p);
              }
            };
          var __importStar =
            (this && this.__importStar) ||
            function (mod) {
              if (mod && mod.__esModule) return mod;
              var result = {};
              if (mod != null)
                for (var k in mod) {
                  if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
                }
              __setModuleDefault(result, mod);
              return result;
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.deprecated = void 0;
          __exportStar(
            __webpack_require__(/*! ./chip-set/index */ './packages/mdc-chips/chip-set/index.ts'),
            exports,
          );
          /**
           * Backwards compatibility for existing clients.
           */
          var deprecated = __importStar(
            __webpack_require__(
              /*! ./deprecated/index */ './packages/mdc-chips/deprecated/index.ts',
            ),
          );
          exports.deprecated = deprecated;

          /***/
        },

      /***/ './packages/mdc-dom/announce.ts':
        /*!**************************************!*\
  !*** ./packages/mdc-dom/announce.ts ***!
  \**************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.announce = exports.DATA_MDC_DOM_ANNOUNCE = exports.AnnouncerPriority = void 0;
          /**
           * Priorities for the announce function
           */
          var AnnouncerPriority;
          (function (AnnouncerPriority) {
            AnnouncerPriority['POLITE'] = 'polite';
            AnnouncerPriority['ASSERTIVE'] = 'assertive';
          })((AnnouncerPriority = exports.AnnouncerPriority || (exports.AnnouncerPriority = {})));
          /**
           * Data attribute added to live region element.
           */
          exports.DATA_MDC_DOM_ANNOUNCE = 'data-mdc-dom-announce';
          /**
           * Announces the given message with optional priority, defaulting to "polite"
           */
          function announce(message, priority) {
            Announcer.getInstance().say(message, priority);
          }
          exports.announce = announce;
          var Announcer = /** @class */ (function () {
            // Constructor made private to ensure only the singleton is used
            function Announcer() {
              this.liveRegions = new Map();
            }
            Announcer.getInstance = function () {
              if (!Announcer.instance) {
                Announcer.instance = new Announcer();
              }
              return Announcer.instance;
            };
            Announcer.prototype.say = function (message, priority) {
              if (priority === void 0) {
                priority = AnnouncerPriority.POLITE;
              }
              var liveRegion = this.getLiveRegion(priority);
              // Reset the region to pick up the message, even if the message is the
              // exact same as before.
              liveRegion.textContent = '';
              // Timeout is necessary for screen readers like NVDA and VoiceOver.
              setTimeout(function () {
                liveRegion.textContent = message;
                document.addEventListener('click', clearLiveRegion);
              }, 1);
              function clearLiveRegion() {
                liveRegion.textContent = '';
                document.removeEventListener('click', clearLiveRegion);
              }
            };
            Announcer.prototype.getLiveRegion = function (priority) {
              var existingLiveRegion = this.liveRegions.get(priority);
              if (existingLiveRegion && document.body.contains(existingLiveRegion)) {
                return existingLiveRegion;
              }
              var liveRegion = this.createLiveRegion(priority);
              this.liveRegions.set(priority, liveRegion);
              return liveRegion;
            };
            Announcer.prototype.createLiveRegion = function (priority) {
              var el = document.createElement('div');
              el.style.position = 'absolute';
              el.style.top = '-9999px';
              el.style.left = '-9999px';
              el.style.height = '1px';
              el.style.overflow = 'hidden';
              el.setAttribute('aria-atomic', 'true');
              el.setAttribute('aria-live', priority);
              el.setAttribute(exports.DATA_MDC_DOM_ANNOUNCE, 'true');
              document.body.appendChild(el);
              return el;
            };
            return Announcer;
          })();

          /***/
        },

      /***/ './packages/mdc-dom/events.ts':
        /*!************************************!*\
  !*** ./packages/mdc-dom/events.ts ***!
  \************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
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
                },
              };
              var handler = function handler() {};
              globalObj.document.addEventListener('test', handler, options);
              globalObj.document.removeEventListener('test', handler, options);
            } catch (err) {
              passiveSupported = false;
            }
            return passiveSupported;
          }

          /***/
        },

      /***/ './packages/mdc-dom/keyboard.ts':
        /*!**************************************!*\
  !*** ./packages/mdc-dom/keyboard.ts ***!
  \**************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
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
            TAB: 'Tab',
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
            TAB: 9,
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

          /***/
        },

      /***/ './packages/mdc-dom/ponyfill.ts':
        /*!**************************************!*\
  !*** ./packages/mdc-dom/ponyfill.ts ***!
  \**************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
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
            var nativeMatches =
              element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
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

          /***/
        },

      /***/ './packages/mdc-ripple/component.ts':
        /*!******************************************!*\
  !*** ./packages/mdc-ripple/component.ts ***!
  \******************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function get() {
                      return m[k];
                    },
                  });
                }
              : function (o, m, k, k2) {
                  if (k2 === undefined) k2 = k;
                  o[k2] = m[k];
                });
          var __setModuleDefault =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (o, v) {
                  Object.defineProperty(o, 'default', { enumerable: true, value: v });
                }
              : function (o, v) {
                  o['default'] = v;
                });
          var __importStar =
            (this && this.__importStar) ||
            function (mod) {
              if (mod && mod.__esModule) return mod;
              var result = {};
              if (mod != null)
                for (var k in mod) {
                  if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
                }
              __setModuleDefault(result, mod);
              return result;
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCRipple = void 0;
          var component_1 = __webpack_require__(
            /*! @material/base/component */ './packages/mdc-base/component.ts',
          );
          var events_1 = __webpack_require__(
            /*! @material/dom/events */ './packages/mdc-dom/events.ts',
          );
          var ponyfill_1 = __webpack_require__(
            /*! @material/dom/ponyfill */ './packages/mdc-dom/ponyfill.ts',
          );
          var foundation_1 = __webpack_require__(
            /*! ./foundation */ './packages/mdc-ripple/foundation.ts',
          );
          var util = __importStar(
            __webpack_require__(/*! ./util */ './packages/mdc-ripple/util.ts'),
          );
          var MDCRipple = /** @class */ (function (_super) {
            __extends(MDCRipple, _super);
            function MDCRipple() {
              var _this = (_super !== null && _super.apply(this, arguments)) || this;
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
                deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler(
                  evtType,
                  handler,
                ) {
                  return document.documentElement.removeEventListener(
                    evtType,
                    handler,
                    events_1.applyPassive(),
                  );
                },
                deregisterInteractionHandler: function deregisterInteractionHandler(
                  evtType,
                  handler,
                ) {
                  return instance.root.removeEventListener(
                    evtType,
                    handler,
                    events_1.applyPassive(),
                  );
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
                registerDocumentInteractionHandler: function registerDocumentInteractionHandler(
                  evtType,
                  handler,
                ) {
                  return document.documentElement.addEventListener(
                    evtType,
                    handler,
                    events_1.applyPassive(),
                  );
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
                },
              };
            };
            Object.defineProperty(MDCRipple.prototype, 'unbounded', {
              get: function get() {
                return Boolean(this.isUnbounded);
              },
              set: function set(unbounded) {
                this.isUnbounded = Boolean(unbounded);
                this.setUnbounded();
              },
              enumerable: false,
              configurable: true,
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
          })(component_1.MDCComponent);
          exports.MDCRipple = MDCRipple;

          /***/
        },

      /***/ './packages/mdc-ripple/constants.ts':
        /*!******************************************!*\
  !*** ./packages/mdc-ripple/constants.ts ***!
  \******************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          Object.defineProperty(exports, '__esModule', { value: true });
          exports.numbers = exports.strings = exports.cssClasses = void 0;
          exports.cssClasses = {
            // Ripple is a special case where the "root" component is really a "mixin" of sorts,
            // given that it's an 'upgrade' to an existing component. That being said it is the root
            // CSS class that all other CSS classes derive from.
            BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
            FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
            FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
            ROOT: 'mdc-ripple-upgraded',
            UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
          };
          exports.strings = {
            VAR_FG_SCALE: '--mdc-ripple-fg-scale',
            VAR_FG_SIZE: '--mdc-ripple-fg-size',
            VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
            VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
            VAR_LEFT: '--mdc-ripple-left',
            VAR_TOP: '--mdc-ripple-top',
          };
          exports.numbers = {
            DEACTIVATION_TIMEOUT_MS: 225,
            FG_DEACTIVATION_MS: 150,
            INITIAL_ORIGIN_SCALE: 0.6,
            PADDING: 10,
            TAP_DELAY_MS: 300,
          };

          /***/
        },

      /***/ './packages/mdc-ripple/foundation.ts':
        /*!*******************************************!*\
  !*** ./packages/mdc-ripple/foundation.ts ***!
  \*******************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

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

          var __extends =
            (this && this.__extends) ||
            (function () {
              var _extendStatics = function extendStatics(d, b) {
                _extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) {
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    }
                  };
                return _extendStatics(d, b);
              };
              return function (d, b) {
                if (typeof b !== 'function' && b !== null)
                  throw new TypeError(
                    'Class extends value ' + String(b) + ' is not a constructor or null',
                  );
                _extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            function () {
              __assign =
                Object.assign ||
                function (t) {
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
          var __values =
            (this && this.__values) ||
            function (o) {
              var s = typeof Symbol === 'function' && Symbol.iterator,
                m = s && o[s],
                i = 0;
              if (m) return m.call(o);
              if (o && typeof o.length === 'number')
                return {
                  next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return { value: o && o[i++], done: !o };
                  },
                };
              throw new TypeError(
                s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
              );
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.MDCRippleFoundation = void 0;
          var foundation_1 = __webpack_require__(
            /*! @material/base/foundation */ './packages/mdc-base/foundation.ts',
          );
          var constants_1 = __webpack_require__(
            /*! ./constants */ './packages/mdc-ripple/constants.ts',
          );
          var util_1 = __webpack_require__(/*! ./util */ './packages/mdc-ripple/util.ts');
          // Activation events registered on the root element of each instance for activation
          var ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown'];
          // Deactivation events registered on documentElement when a pointer-related down event occurs
          var POINTER_DEACTIVATION_EVENT_TYPES = [
            'touchend',
            'pointerup',
            'mouseup',
            'contextmenu',
          ];
          // simultaneous nested activations
          var activatedTargets = [];
          var MDCRippleFoundation = /** @class */ (function (_super) {
            __extends(MDCRippleFoundation, _super);
            function MDCRippleFoundation(adapter) {
              var _this =
                _super.call(
                  this,
                  __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter),
                ) || this;
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
            Object.defineProperty(MDCRippleFoundation, 'cssClasses', {
              get: function get() {
                return constants_1.cssClasses;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCRippleFoundation, 'strings', {
              get: function get() {
                return constants_1.strings;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCRippleFoundation, 'numbers', {
              get: function get() {
                return constants_1.numbers;
              },
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(MDCRippleFoundation, 'defaultAdapter', {
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
                  deregisterDocumentInteractionHandler:
                    function deregisterDocumentInteractionHandler() {
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
                  registerDocumentInteractionHandler:
                    function registerDocumentInteractionHandler() {
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
                  },
                };
              },
              enumerable: false,
              configurable: true,
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
                wasElementMadeActive: false,
              };
            };
            /**
             * supportsPressRipple Passed from init to save a redundant function call
             */
            MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
              var e_1, _a;
              if (supportsPressRipple) {
                try {
                  for (
                    var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES),
                      ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next();
                    !ACTIVATION_EVENT_TYPES_1_1.done;
                    ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()
                  ) {
                    var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                  }
                } catch (e_1_1) {
                  e_1 = { error: e_1_1 };
                } finally {
                  try {
                    if (
                      ACTIVATION_EVENT_TYPES_1_1 &&
                      !ACTIVATION_EVENT_TYPES_1_1.done &&
                      (_a = ACTIVATION_EVENT_TYPES_1.return)
                    )
                      _a.call(ACTIVATION_EVENT_TYPES_1);
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
                  for (
                    var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(
                        POINTER_DEACTIVATION_EVENT_TYPES,
                      ),
                      POINTER_DEACTIVATION_EVENT_TYPES_1_1 =
                        POINTER_DEACTIVATION_EVENT_TYPES_1.next();
                    !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done;
                    POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()
                  ) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerDocumentInteractionHandler(
                      evtType,
                      this.deactivateHandler,
                    );
                  }
                } catch (e_2_1) {
                  e_2 = { error: e_2_1 };
                } finally {
                  try {
                    if (
                      POINTER_DEACTIVATION_EVENT_TYPES_1_1 &&
                      !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done &&
                      (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)
                    )
                      _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                  } finally {
                    if (e_2) throw e_2.error;
                  }
                }
              }
            };
            MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
              var e_3, _a;
              try {
                for (
                  var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES),
                    ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next();
                  !ACTIVATION_EVENT_TYPES_2_1.done;
                  ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()
                ) {
                  var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                  this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
              } catch (e_3_1) {
                e_3 = { error: e_3_1 };
              } finally {
                try {
                  if (
                    ACTIVATION_EVENT_TYPES_2_1 &&
                    !ACTIVATION_EVENT_TYPES_2_1.done &&
                    (_a = ACTIVATION_EVENT_TYPES_2.return)
                  )
                    _a.call(ACTIVATION_EVENT_TYPES_2);
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
                for (
                  var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(
                      POINTER_DEACTIVATION_EVENT_TYPES,
                    ),
                    POINTER_DEACTIVATION_EVENT_TYPES_2_1 =
                      POINTER_DEACTIVATION_EVENT_TYPES_2.next();
                  !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done;
                  POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()
                ) {
                  var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                  this.adapter.deregisterDocumentInteractionHandler(
                    evtType,
                    this.deactivateHandler,
                  );
                }
              } catch (e_4_1) {
                e_4 = { error: e_4_1 };
              } finally {
                try {
                  if (
                    POINTER_DEACTIVATION_EVENT_TYPES_2_1 &&
                    !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done &&
                    (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)
                  )
                    _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
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
              var isSameInteraction =
                previousActivationEvent &&
                evt !== undefined &&
                previousActivationEvent.type !== evt.type;
              if (isSameInteraction) {
                return;
              }
              activationState.isActivated = true;
              activationState.isProgrammatic = evt === undefined;
              activationState.activationEvent = evt;
              activationState.wasActivatedByPointer = activationState.isProgrammatic
                ? false
                : evt !== undefined &&
                  (evt.type === 'mousedown' ||
                    evt.type === 'touchstart' ||
                    evt.type === 'pointerdown');
              var hasActivatedChild =
                evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) {
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
                if (
                  !activationState.wasElementMadeActive &&
                  evt !== undefined &&
                  (evt.key === ' ' || evt.keyCode === 32)
                ) {
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
              return evt !== undefined && evt.type === 'keydown'
                ? this.adapter.isSurfaceActive()
                : true;
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
                translateStart = startPoint.x + 'px, ' + startPoint.y + 'px';
                translateEnd = endPoint.x + 'px, ' + endPoint.y + 'px';
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
                startPoint = util_1.getNormalizedEventCoords(
                  activationEvent,
                  this.adapter.getWindowPageOffset(),
                  this.adapter.computeBoundingRect(),
                );
              } else {
                startPoint = {
                  x: this.frame.width / 2,
                  y: this.frame.height / 2,
                };
              }
              // Center the element around the start point.
              startPoint = {
                x: startPoint.x - this.initialSize / 2,
                y: startPoint.y - this.initialSize / 2,
              };
              var endPoint = {
                x: this.frame.width / 2 - this.initialSize / 2,
                y: this.frame.height / 2 - this.initialSize / 2,
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
                return (_this.previousActivationEvent = undefined);
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
                var hypotenuse = Math.sqrt(
                  Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2),
                );
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
              };
              this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
              // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
              var initialSize = Math.floor(
                maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE,
              );
              // Unbounded ripple size should always be even number to equally center align.
              if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
              } else {
                this.initialSize = initialSize;
              }
              this.fgScale = '' + this.maxRadius / this.initialSize;
              this.updateLayoutCssVars();
            };
            MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
              var _a = MDCRippleFoundation.strings,
                VAR_FG_SIZE = _a.VAR_FG_SIZE,
                VAR_LEFT = _a.VAR_LEFT,
                VAR_TOP = _a.VAR_TOP,
                VAR_FG_SCALE = _a.VAR_FG_SCALE;
              this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + 'px');
              this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
              if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                  left: Math.round(this.frame.width / 2 - this.initialSize / 2),
                  top: Math.round(this.frame.height / 2 - this.initialSize / 2),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + 'px');
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + 'px');
              }
            };
            return MDCRippleFoundation;
          })(foundation_1.MDCFoundation);
          exports.MDCRippleFoundation = MDCRippleFoundation;
          // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
          exports.default = MDCRippleFoundation;

          /***/
        },

      /***/ './packages/mdc-ripple/util.ts':
        /*!*************************************!*\
  !*** ./packages/mdc-ripple/util.ts ***!
  \*************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          'use strict';

          Object.defineProperty(exports, '__esModule', { value: true });
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
            var weAreFeatureDetectingSafari10plus =
              CSS.supports('(--css-vars: yes)') && CSS.supports('color', '#00000000');
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

          /***/
        },

      /******/
    },
  );
});
//# sourceMappingURL=mdc.chips.js.map
