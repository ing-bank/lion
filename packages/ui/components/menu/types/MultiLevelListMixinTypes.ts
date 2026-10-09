import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { InteractiveListHost } from './InteractiveListMixinTypes.js';

/** Multiple nested, collapsible levels on top of an interactive list (see `MultiLevelListMixin`) */
export declare class MultiLevelListHost extends InteractiveListHost {
  /** The nesting level of this list; 1 for the top level list */
  level: number;

  protected _subListMap: Map<Element, MultiLevelListHost>;

  protected get _invokerNode(): HTMLElement | null | undefined;

  protected set _invokerNode(invokerNode: HTMLElement | null | undefined);

  protected get _contentNode(): HTMLElement;

  toggle(ev: Event): void;
}

export declare function MultiLevelListImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<MultiLevelListHost> &
  Pick<typeof MultiLevelListHost, keyof typeof MultiLevelListHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type MultiLevelListMixin = typeof MultiLevelListImplementation;
