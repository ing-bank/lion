/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { ElementInternalsShim } from './lib/element-internals.js';
import { EventShim, CustomEventShim } from './lib/events.js';
export { ariaMixinAttributes, ElementInternals, HYDRATE_INTERNALS_ATTR_PREFIX, } from './lib/element-internals.js';
export { CSSRule, CSSRuleList, CSSStyleSheet, MediaList, StyleSheet, } from './lib/css.js';
export { CustomEvent, Event } from './lib/events.js';
export { IntersectionObserver, MutationObserver, ResizeObserver, } from './lib/observers.js';
// In an empty Node.js vm, we need to patch the global context.
// TODO: Remove these globalThis assignments when we remove support
// for vm modules (--experimental-vm-modules).
globalThis.Event ??= EventShim;
globalThis.CustomEvent ??= CustomEventShim;
const constructionToken = Symbol();
const isCaptureEventListener = (options) => (typeof options === 'boolean' ? options : (options?.capture ?? false));
const enumerableProperty = { __proto__: null };
enumerableProperty.enumerable = true;
Object.freeze(enumerableProperty);
/**
 * This is a basic implementation of an EventTarget.
 *
 * This is not fully spec compliant (e.g. validation),
 * but should work well enough for our use cases.
 *
 * @see https://dom.spec.whatwg.org/#eventtarget
 *
 * Example Event Path
 * ------------------
 *
 * Note that this depends on the logic in `packages/labs/ssr/src/lib/render-value.ts`.
 * Any element that is not a custom element or a slot element is skipped in the chain.
 *
 * <main>
 *   <my-el1>
 *     #shadow-dom (open)
 *       <div>
 *         <slot></slot>
 *         <my-el2>
 *           #shadow-dom (closed)
 *             <slot></slot>
 *             <event-dispatcher3></event-dispatcher3>
 *           <slot name="nested"></slot>
 *         </my-el2>
 *       </div>
 *     <event-dispatcher1></event-dispatcher1>
 *     <event-dispatcher2 slot="nested"></event-dispatcher2>
 *   </my-el1>
 * </main>
 *
 * Given the previous structure, the event path of this shim would be as follows,
 * for the given dispatcher with an event that bubbles (document-fragment
 * represents a ShadowRoot/#shadow-dom instance):
 *
 * <event-dispatcher1>:
 * [event-dispatcher1, slot{my-el1}, document-fragment{my-el1}, my-el1, document]
 *
 * <event-dispatcher2>:
 * [
 *   event-dispatcher2,
 *   slot[name="nested"]{my-el1},
 *   slot{my-el2},
 *   document-fragment{my-el2},
 *   my-el2,
 *   document-fragment{my-el1},
 *   my-el1,
 *   document
 * ]
 *
 * <event-dispatcher3> (without composed):
 * [event-dispatcher3, document-fragment{my-el2}]
 *
 * <event-dispatcher3> (composed):
 * [
 *   event-dispatcher3,
 *   document-fragment{my-el2},
 *   my-el2,
 *   document-fragment{my-el1},
 *   my-el1,
 *   document
 * ]
 */
class EventTarget {
    constructor() {
        this.__eventListeners = new Map();
        this.__captureEventListeners = new Map();
    }
    addEventListener(type, callback, options) {
        if (callback === undefined || callback === null) {
            return;
        }
        const eventListenersMap = isCaptureEventListener(options)
            ? this.__captureEventListeners
            : this.__eventListeners;
        let eventListeners = eventListenersMap.get(type);
        if (eventListeners === undefined) {
            eventListeners = new Map();
            eventListenersMap.set(type, eventListeners);
        }
        else if (eventListeners.has(callback)) {
            return;
        }
        const normalizedOptions = typeof options === 'object' && options ? options : {};
        normalizedOptions.signal?.addEventListener('abort', () => this.removeEventListener(type, callback, options));
        eventListeners.set(callback, normalizedOptions ?? {});
    }
    removeEventListener(type, callback, options) {
        if (callback === undefined || callback === null) {
            return;
        }
        const eventListenersMap = isCaptureEventListener(options)
            ? this.__captureEventListeners
            : this.__eventListeners;
        const eventListeners = eventListenersMap.get(type);
        if (eventListeners !== undefined) {
            eventListeners.delete(callback);
            if (!eventListeners.size) {
                eventListenersMap.delete(type);
            }
        }
    }
    dispatchEvent(event) {
        let composedPath = this.__resolveFullEventPath();
        if (!event.composed && this.__host) {
            // If the event is not composed and the event was dispatched inside
            // shadow DOM, we need to stop the event chain before the host of the
            // shadow DOM.
            composedPath = composedPath.slice(0, composedPath.indexOf(this.__host));
        }
        // We need to patch various properties that would either be empty or wrong
        // in this scenario.
        let stopPropagation = false;
        let stopImmediatePropagation = false;
        let eventPhase = EventShim.NONE;
        let target = null;
        let tmpTarget = null;
        let currentTarget = null;
        const originalStopPropagation = event.stopPropagation;
        const originalStopImmediatePropagation = event.stopImmediatePropagation;
        Object.defineProperties(event, {
            target: {
                get() {
                    return target ?? tmpTarget;
                },
                ...enumerableProperty,
            },
            srcElement: {
                get() {
                    return event.target;
                },
                ...enumerableProperty,
            },
            currentTarget: {
                get() {
                    return currentTarget;
                },
                ...enumerableProperty,
            },
            eventPhase: {
                get() {
                    return eventPhase;
                },
                ...enumerableProperty,
            },
            composedPath: {
                value: () => composedPath,
                ...enumerableProperty,
            },
            stopPropagation: {
                value: () => {
                    stopPropagation = true;
                    originalStopPropagation.call(event);
                },
                ...enumerableProperty,
            },
            stopImmediatePropagation: {
                value: () => {
                    stopImmediatePropagation = true;
                    originalStopImmediatePropagation.call(event);
                },
                ...enumerableProperty,
            },
        });
        // An event handler can either be a function, an object with a handleEvent
        // method or null. This function takes care to call the event handler
        // correctly.
        const invokeEventListener = (listener, options, eventListenerMap) => {
            if (typeof listener === 'function') {
                listener(event);
            }
            else if (typeof listener?.handleEvent === 'function') {
                listener.handleEvent(event);
            }
            if (options.once) {
                eventListenerMap.delete(listener);
            }
        };
        // When an event is finished being dispatched, which can be after the event
        // tree has been traversed or stopPropagation/stopImmediatePropagation has
        // been called. Once that is the case, the currentTarget and eventPhase
        // need to be reset and a value, representing whether the event has not
        // been prevented, needs to be returned.
        const finishDispatch = () => {
            currentTarget = null;
            eventPhase = EventShim.NONE;
            return !event.defaultPrevented;
        };
        // An event starts with the capture order, where it starts from the top.
        // This is done even if bubbles is set to false, which is the default.
        const captureEventPath = composedPath.slice().reverse();
        // If the event target, which dispatches the event, is either in the light DOM
        // or the event is not composed, the target is always itself. If that is not
        // the case, the target needs to be retargeted: https://dom.spec.whatwg.org/#retarget
        target = !this.__host || !event.composed ? this : null;
        const retarget = (eventTargets) => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            tmpTarget = this;
            while (tmpTarget.__host && eventTargets.includes(tmpTarget.__host)) {
                tmpTarget = tmpTarget.__host;
            }
        };
        for (const eventTarget of captureEventPath) {
            if (!target && (!tmpTarget || tmpTarget === eventTarget.__host)) {
                retarget(captureEventPath.slice(captureEventPath.indexOf(eventTarget)));
            }
            currentTarget = eventTarget;
            eventPhase =
                eventTarget === event.target
                    ? EventShim.AT_TARGET
                    : EventShim.CAPTURING_PHASE;
            const captureEventListeners = eventTarget.__captureEventListeners.get(event.type);
            if (captureEventListeners) {
                for (const [listener, options] of captureEventListeners) {
                    invokeEventListener(listener, options, captureEventListeners);
                    if (stopImmediatePropagation) {
                        // Event.stopImmediatePropagation() stops any following invocation
                        // of an event handler even on the same event target.
                        return finishDispatch();
                    }
                }
            }
            if (stopPropagation) {
                // Event.stopPropagation() stops any following invocation
                // of an event handler for any following event targets.
                return finishDispatch();
            }
        }
        const bubbleEventPath = event.bubbles ? composedPath : [this];
        tmpTarget = null;
        for (const eventTarget of bubbleEventPath) {
            if (!target &&
                (!tmpTarget || eventTarget === tmpTarget.__host)) {
                retarget(bubbleEventPath.slice(0, bubbleEventPath.indexOf(eventTarget) + 1));
            }
            currentTarget = eventTarget;
            eventPhase =
                eventTarget === event.target
                    ? EventShim.AT_TARGET
                    : EventShim.BUBBLING_PHASE;
            const eventListeners = eventTarget.__eventListeners.get(event.type);
            if (eventListeners) {
                for (const [listener, options] of eventListeners) {
                    invokeEventListener(listener, options, eventListeners);
                    if (stopImmediatePropagation) {
                        // Event.stopImmediatePropagation() stops any following invocation
                        // of an event handler even on the same event target.
                        return finishDispatch();
                    }
                }
            }
            if (stopPropagation) {
                // Event.stopPropagation() stops any following invocation
                // of an event handler for any following event targets.
                return finishDispatch();
            }
        }
        return finishDispatch();
    }
    __resolveFullEventPath() {
        if (this.__eventPathCache) {
            return this.__eventPathCache;
        }
        else if (!this.__eventTargetParent) {
            return (this.__eventPathCache = [this, documentShim, windowShim]);
        }
        else {
            return (this.__eventPathCache = [
                this,
                ...this.__eventTargetParent.__resolveFullEventPath(),
            ]);
        }
    }
}
const EventTargetShimWithRealType = EventTarget;
export { EventTargetShimWithRealType as EventTarget };
const attributes = new WeakMap();
const attributesForElement = (element) => {
    let attrs = attributes.get(element);
    if (attrs === undefined) {
        attributes.set(element, (attrs = new Map()));
    }
    return attrs;
};
// The typings around the exports below are a little funky:
//
// 1. We want the `name` of the shim classes to match the real ones at runtime,
//    hence e.g. `class Element`.
// 2. We can't shadow the global types with a simple class declaration, because
//    then we can't reference the global types for casting, hence e.g.
//    `const ElementShim = class Element`.
// 3. We want to export the classes typed as the real ones, hence e.g.
//    `const ElementShimWithRealType = ElementShim as object as typeof Element;`.
// 4. We want the exported names to match the real ones, hence e.g.
//    `export {ElementShimWithRealType as Element}`.
const NodeShim = class Node extends EventTarget {
    getRootNode(options) {
        if (options?.composed) {
            return document;
        }
        // getRootNode returns the containing ShadowRoot instance, even if that was
        // created in closed mode.
        const host = this.__host;
        return (host?.__shadowRoot ?? document);
    }
};
const NodeShimWithRealType = NodeShim;
export { NodeShimWithRealType as Node };
const DocumentShim = class Document extends NodeShim {
    get adoptedStyleSheets() {
        return [];
    }
    createTreeWalker() {
        return {};
    }
    createTextNode() {
        return {};
    }
    createElement() {
        return {};
    }
};
const DocumentShimWithRealType = DocumentShim;
export { DocumentShimWithRealType as Document };
const documentShim = new DocumentShim();
const document = documentShim;
export { document };
const WindowShim = class Window extends NodeShim {
    constructor(token) {
        super();
        if (token !== constructionToken) {
            throw new TypeError('Illegal constructor');
        }
        Object.assign(this, globalThis, {
            CustomElementRegistry,
            customElements,
            document,
            Document: DocumentShim,
            Element: ElementShim,
            EventTarget,
            HTMLElement: HTMLElementShim,
            Node: NodeShim,
            ShadowRoot: ShadowRootShim,
            window: this,
            Window: WindowShim,
        });
    }
};
const WindowShimWithRealType = WindowShim;
export { WindowShimWithRealType as Window };
const ElementShim = class Element extends NodeShim {
    constructor() {
        super(...arguments);
        this.__shadowRootMode = null;
        this.__shadowRoot = null;
        this.__internals = null;
    }
    get attributes() {
        return Array.from(attributesForElement(this)).map(([name, value]) => ({
            name,
            value,
        }));
    }
    get shadowRoot() {
        if (this.__shadowRootMode === 'closed') {
            return null;
        }
        return this.__shadowRoot;
    }
    get localName() {
        return this.constructor.__localName;
    }
    get tagName() {
        return this.localName?.toUpperCase();
    }
    setAttribute(name, value) {
        // Emulate browser behavior that silently casts all values to string. E.g.
        // `42` becomes `"42"` and `{}` becomes `"[object Object]""`.
        attributesForElement(this).set(name, String(value));
    }
    removeAttribute(name) {
        attributesForElement(this).delete(name);
    }
    toggleAttribute(name, force) {
        // Steps reference https://dom.spec.whatwg.org/#dom-element-toggleattribute
        if (this.hasAttribute(name)) {
            // Step 5
            if (force === undefined || !force) {
                this.removeAttribute(name);
                return false;
            }
        }
        else {
            // Step 4
            if (force === undefined || force) {
                // Step 4.1
                this.setAttribute(name, '');
                return true;
            }
            else {
                // Step 4.2
                return false;
            }
        }
        // Step 6
        return true;
    }
    hasAttribute(name) {
        return attributesForElement(this).has(name);
    }
    attachShadow(init) {
        this.__shadowRootMode = init.mode;
        const shadowRoot = new ShadowRootShim(constructionToken, init);
        shadowRoot.__eventTargetParent = this;
        shadowRoot.__host = this;
        return (this.__shadowRoot = shadowRoot);
    }
    attachInternals() {
        if (this.__internals !== null) {
            throw new Error(`Failed to execute 'attachInternals' on 'HTMLElement': ` +
                `ElementInternals for the specified element was already attached.`);
        }
        const internals = new ElementInternalsShim(this);
        this.__internals = internals;
        return internals;
    }
    getAttribute(name) {
        const value = attributesForElement(this).get(name);
        return value ?? null;
    }
};
const ElementShimWithRealType = ElementShim;
export { ElementShimWithRealType as Element };
const HTMLElementShim = class HTMLElement extends ElementShim {
};
const HTMLElementShimWithRealType = HTMLElementShim;
export { HTMLElementShimWithRealType as HTMLElement };
const HTMLSlotElementShim = class HTMLSlotElement extends HTMLElementShim {
    get localName() {
        return 'slot';
    }
};
const HTMLSlotElementShimWithRealType = HTMLSlotElementShim;
export { HTMLSlotElementShimWithRealType as HTMLSlotElement };
const ShadowRootShim = class ShadowRoot extends NodeShim {
    get host() {
        return this.__host;
    }
    constructor(constructionToken, init) {
        super();
        if (constructionToken !== constructionToken) {
            throw new TypeError('Illegal constructor');
        }
        this.mode = init.mode;
    }
};
const ShadowRootShimWithRealType = ShadowRootShim;
export { ShadowRootShimWithRealType as ShadowRoot };
// For convenience, we provide a global instance of a HTMLElement as an event
// target. This facilitates registering global event handlers
// (e.g. for @lit/context ContextProvider).
// We use this in in the SSR render function.
// Note, this is a bespoke element and not simply `document` or `window` since
// user code relies on these being undefined in the server environment.
globalThis.litServerRoot ??= Object.defineProperty(new HTMLElementShimWithRealType(), 'localName', {
    // Patch localName (and tagName) to return a unique name.
    get() {
        return 'lit-server-root';
    },
});
function promiseWithResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve: resolve, reject: reject };
}
class CustomElementRegistry {
    constructor() {
        this.__definitions = new Map();
        this.__reverseDefinitions = new Map();
        this.__pendingWhenDefineds = new Map();
    }
    define(name, ctor) {
        if (this.__definitions.has(name)) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`'CustomElementRegistry' already has "${name}" defined. ` +
                    `This may have been caused by live reload or hot module ` +
                    `replacement in which case it can be safely ignored.\n` +
                    `Make sure to test your application with a production build as ` +
                    `repeat registrations will throw in production.`);
            }
            else {
                throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': ` +
                    `the name "${name}" has already been used with this registry`);
            }
        }
        if (this.__reverseDefinitions.has(ctor)) {
            throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': ` +
                `the constructor has already been used with this registry for the ` +
                `tag name ${this.__reverseDefinitions.get(ctor)}`);
        }
        // Provide tagName and localName for the component.
        ctor.__localName = name;
        this.__definitions.set(name, {
            ctor,
            // Note it's important we read `observedAttributes` in case it is a getter
            // with side-effects, as is the case in Lit, where it triggers class
            // finalization.
            //
            // TODO(aomarks) To be spec compliant, we should also capture the
            // registration-time lifecycle methods like `connectedCallback`. For them
            // to be actually accessible to e.g. the Lit SSR element renderer, though,
            // we'd need to introduce a new API for accessing them (since `get` only
            // returns the constructor).
            observedAttributes: ctor.observedAttributes ?? [],
        });
        this.__reverseDefinitions.set(ctor, name);
        this.__pendingWhenDefineds.get(name)?.resolve(ctor);
        this.__pendingWhenDefineds.delete(name);
    }
    get(name) {
        const definition = this.__definitions.get(name);
        return definition?.ctor;
    }
    getName(ctor) {
        return this.__reverseDefinitions.get(ctor) ?? null;
    }
    initialize(_root) {
        throw new Error(`customElements.initialize is not currently supported in SSR. ` +
            `Please file a bug if you need it.`);
    }
    upgrade(_element) {
        // In SSR this doesn't make a lot of sense, so we do nothing.
        throw new Error(`customElements.upgrade is not currently supported in SSR. ` +
            `Please file a bug if you need it.`);
    }
    async whenDefined(name) {
        const definition = this.__definitions.get(name);
        if (definition) {
            return definition.ctor;
        }
        let withResolvers = this.__pendingWhenDefineds.get(name);
        if (!withResolvers) {
            withResolvers = promiseWithResolvers();
            this.__pendingWhenDefineds.set(name, withResolvers);
        }
        return withResolvers.promise;
    }
}
const CustomElementRegistryShimWithRealType = CustomElementRegistry;
export { CustomElementRegistryShimWithRealType as CustomElementRegistry };
export const customElements = new CustomElementRegistryShimWithRealType();
// The window variable instantiation must happen after all shims
// have been declared, as they will be included in the window instance.
const windowShim = new WindowShim(constructionToken);
const window = windowShim;
export { window };
//# sourceMappingURL=index.js.map