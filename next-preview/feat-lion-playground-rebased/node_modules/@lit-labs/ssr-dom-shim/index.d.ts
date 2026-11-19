export { ariaMixinAttributes, ElementInternals, HYDRATE_INTERNALS_ATTR_PREFIX, } from './lib/element-internals.js';
export { CSSRule, CSSRuleList, CSSStyleSheet, MediaList, StyleSheet, } from './lib/css.js';
export { CustomEvent, Event } from './lib/events.js';
export { IntersectionObserver, MutationObserver, ResizeObserver, } from './lib/observers.js';
/**
 * Internal type to be used for the event polyfill functionality.
 * @deprecated Use EventTargetShimMeta directly, if needed.
 */
export type HTMLElementWithEventMeta = HTMLElement & EventTargetShimMeta;
/**
 * Properties necessary for the EventTarget shim to work.
 */
export interface EventTargetShimMeta {
    /**
     * The event target parent represents the previous event target for an event
     * in capture phase and the next event target for a bubbling event.
     * Note that this is not the element parent
     */
    __eventTargetParent?: globalThis.EventTarget;
    /**
     * The host event target/element of this event target, if this event target
     * is inside a Shadow DOM.
     */
    __host?: globalThis.EventTarget;
    /**
     * A map of slot name to the corresponding slot element.
     * For named slots, the key is the name of the slot and for
     * the unnamed slot, the key is `undefined`.
     *
     * These need to be tracked explicitly since the slot elements are not
     * necessarily in the same tree as the event target, so they can't be found
     * by traversing the event path. This is needed to properly retarget events
     * dispatched on slotted nodes.
     *
     * <my-el1>
     *   #shadow-dom (open)
     *     <slot></slot>
     *     <my-el2>
     *       #shadow-dom (closed)
     *         <slot></slot>
     *       <slot name="nested"></slot>
     *     </my-el2>
     *   <my-el3 slot="nested"></my-el3>
     * </my-el1>
     *
     * With the above example the shadow DOM of `<my-el1>` is rendered before the
     * child elements of `<my-el1>`, so when the slot elements are rendered, they
     * are added and subsequently removed from the eventTargetStack and when
     * `<my-el3>` is rendered it cannot solely rely on the eventTargetStack
     * and need to check for each custom element in the stack if it has a slot
     * with the name of the slot it is trying to fill.
     */
    __slots?: Map<string | undefined, globalThis.HTMLSlotElement>;
}
declare const EventTargetShimWithRealType: typeof globalThis.EventTarget;
export { EventTargetShimWithRealType as EventTarget };
declare const NodeShimWithRealType: typeof Node;
export { NodeShimWithRealType as Node };
declare const DocumentShimWithRealType: typeof Document;
export { DocumentShimWithRealType as Document };
declare const document: Document;
export { document };
declare const WindowShimWithRealType: typeof Window;
export { WindowShimWithRealType as Window };
declare const ElementShimWithRealType: typeof Element;
export { ElementShimWithRealType as Element };
declare const HTMLElementShimWithRealType: typeof HTMLElement;
export { HTMLElementShimWithRealType as HTMLElement };
declare const HTMLSlotElementShimWithRealType: typeof HTMLSlotElement;
export { HTMLSlotElementShimWithRealType as HTMLSlotElement };
declare const ShadowRootShimWithRealType: typeof ShadowRoot;
export { ShadowRootShimWithRealType as ShadowRoot };
type RealCustomElementRegistryClass = (typeof globalThis)['CustomElementRegistry'];
declare const CustomElementRegistryShimWithRealType: RealCustomElementRegistryClass;
export { CustomElementRegistryShimWithRealType as CustomElementRegistry };
export declare const customElements: globalThis.CustomElementRegistry;
declare const window: Window;
export { window };
//# sourceMappingURL=index.d.ts.map