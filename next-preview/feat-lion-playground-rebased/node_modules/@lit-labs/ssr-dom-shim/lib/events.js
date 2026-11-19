/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Event_cancelable, _Event_bubbles, _Event_composed, _Event_defaultPrevented, _Event_timestamp, _Event_propagationStopped, _Event_type, _Event_target, _Event_isBeingDispatched, _a, _CustomEvent_detail, _b;
// Event phases
const NONE = 0;
const CAPTURING_PHASE = 1;
const AT_TARGET = 2;
const BUBBLING_PHASE = 3;
const enumerableProperty = { __proto__: null };
enumerableProperty.enumerable = true;
Object.freeze(enumerableProperty);
// TODO: Remove this when we remove support for vm modules (--experimental-vm-modules).
const EventShim = (_a = class Event {
        constructor(type, options = {}) {
            _Event_cancelable.set(this, false);
            _Event_bubbles.set(this, false);
            _Event_composed.set(this, false);
            _Event_defaultPrevented.set(this, false);
            _Event_timestamp.set(this, Date.now());
            _Event_propagationStopped.set(this, false);
            _Event_type.set(this, void 0);
            _Event_target.set(this, void 0);
            _Event_isBeingDispatched.set(this, void 0);
            this.NONE = NONE;
            this.CAPTURING_PHASE = CAPTURING_PHASE;
            this.AT_TARGET = AT_TARGET;
            this.BUBBLING_PHASE = BUBBLING_PHASE;
            if (arguments.length === 0)
                throw new Error(`The type argument must be specified`);
            if (typeof options !== 'object' || !options) {
                throw new Error(`The "options" argument must be an object`);
            }
            const { bubbles, cancelable, composed } = options;
            __classPrivateFieldSet(this, _Event_cancelable, !!cancelable, "f");
            __classPrivateFieldSet(this, _Event_bubbles, !!bubbles, "f");
            __classPrivateFieldSet(this, _Event_composed, !!composed, "f");
            __classPrivateFieldSet(this, _Event_type, `${type}`, "f");
            __classPrivateFieldSet(this, _Event_target, null, "f");
            __classPrivateFieldSet(this, _Event_isBeingDispatched, false, "f");
        }
        initEvent(_type, _bubbles, _cancelable) {
            throw new Error('Method not implemented.');
        }
        stopImmediatePropagation() {
            this.stopPropagation();
        }
        preventDefault() {
            __classPrivateFieldSet(this, _Event_defaultPrevented, true, "f");
        }
        get target() {
            return __classPrivateFieldGet(this, _Event_target, "f");
        }
        get currentTarget() {
            return __classPrivateFieldGet(this, _Event_target, "f");
        }
        get srcElement() {
            return __classPrivateFieldGet(this, _Event_target, "f");
        }
        get type() {
            return __classPrivateFieldGet(this, _Event_type, "f");
        }
        get cancelable() {
            return __classPrivateFieldGet(this, _Event_cancelable, "f");
        }
        get defaultPrevented() {
            return __classPrivateFieldGet(this, _Event_cancelable, "f") && __classPrivateFieldGet(this, _Event_defaultPrevented, "f");
        }
        get timeStamp() {
            return __classPrivateFieldGet(this, _Event_timestamp, "f");
        }
        composedPath() {
            return __classPrivateFieldGet(this, _Event_isBeingDispatched, "f") ? [__classPrivateFieldGet(this, _Event_target, "f")] : [];
        }
        get returnValue() {
            return !__classPrivateFieldGet(this, _Event_cancelable, "f") || !__classPrivateFieldGet(this, _Event_defaultPrevented, "f");
        }
        get bubbles() {
            return __classPrivateFieldGet(this, _Event_bubbles, "f");
        }
        get composed() {
            return __classPrivateFieldGet(this, _Event_composed, "f");
        }
        get eventPhase() {
            return __classPrivateFieldGet(this, _Event_isBeingDispatched, "f") ? _a.AT_TARGET : _a.NONE;
        }
        get cancelBubble() {
            return __classPrivateFieldGet(this, _Event_propagationStopped, "f");
        }
        set cancelBubble(value) {
            if (value) {
                __classPrivateFieldSet(this, _Event_propagationStopped, true, "f");
            }
        }
        stopPropagation() {
            __classPrivateFieldSet(this, _Event_propagationStopped, true, "f");
        }
        get isTrusted() {
            return false;
        }
    },
    _Event_cancelable = new WeakMap(),
    _Event_bubbles = new WeakMap(),
    _Event_composed = new WeakMap(),
    _Event_defaultPrevented = new WeakMap(),
    _Event_timestamp = new WeakMap(),
    _Event_propagationStopped = new WeakMap(),
    _Event_type = new WeakMap(),
    _Event_target = new WeakMap(),
    _Event_isBeingDispatched = new WeakMap(),
    _a.NONE = NONE,
    _a.CAPTURING_PHASE = CAPTURING_PHASE,
    _a.AT_TARGET = AT_TARGET,
    _a.BUBBLING_PHASE = BUBBLING_PHASE,
    _a);
Object.defineProperties(EventShim.prototype, {
    initEvent: enumerableProperty,
    stopImmediatePropagation: enumerableProperty,
    preventDefault: enumerableProperty,
    target: enumerableProperty,
    currentTarget: enumerableProperty,
    srcElement: enumerableProperty,
    type: enumerableProperty,
    cancelable: enumerableProperty,
    defaultPrevented: enumerableProperty,
    timeStamp: enumerableProperty,
    composedPath: enumerableProperty,
    returnValue: enumerableProperty,
    bubbles: enumerableProperty,
    composed: enumerableProperty,
    eventPhase: enumerableProperty,
    cancelBubble: enumerableProperty,
    stopPropagation: enumerableProperty,
    isTrusted: enumerableProperty,
});
// TODO: Remove this when we remove support for vm modules (--experimental-vm-modules).
const CustomEventShim = (_b = class CustomEvent extends EventShim {
        constructor(type, options = {}) {
            super(type, options);
            _CustomEvent_detail.set(this, void 0);
            __classPrivateFieldSet(this, _CustomEvent_detail, options?.detail ?? null, "f");
        }
        initCustomEvent(_type, _bubbles, _cancelable, _detail) {
            throw new Error('Method not implemented.');
        }
        get detail() {
            return __classPrivateFieldGet(this, _CustomEvent_detail, "f");
        }
    },
    _CustomEvent_detail = new WeakMap(),
    _b);
Object.defineProperties(CustomEventShim.prototype, {
    detail: enumerableProperty,
});
const EventShimWithRealType = EventShim;
const CustomEventShimWithRealType = CustomEventShim;
export { EventShimWithRealType as Event, EventShimWithRealType as EventShim, CustomEventShimWithRealType as CustomEvent, CustomEventShimWithRealType as CustomEventShim, };
//# sourceMappingURL=events.js.map