import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { SlotHost } from '../../core/types/SlotMixinTypes.js';
import { DisabledHost } from '../../core/types/DisabledMixinTypes.js';

export type InteractiveListItemRole =
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'option'
  | 'treeitem'
  | 'radio'
  | 'checkbox';

export declare class InteractiveListHost extends LitElement {
  /**
   * When true, will synchronize activedescendant and selected element on
   * arrow key navigation.
   * This behavior can usually be seen on <select> on the Windows platform.
   * Note that this behavior cannot be used when multiple-choice is true.
   * See: https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus
   */
  public selectionFollowsFocus: Boolean;
  /**
   * Will give first option active state when navigated to the next option from
   * last option.
   */
  public rotateKeyboardNavigation: Boolean;
  /**
   * Informs screen reader and affects keyboard navigation.
   * By default 'vertical'
   */
  public orientation: 'vertical' | 'horizontal';

  /** Whether more than one item can be checked (the name `LionListbox`/`LionCombobox` use) */
  public multipleChoice: Boolean;

  /** Whether items that do not fit are moved into a 'more' menu (see MoreButtonMenuMixin) */
  public itemWrap: Boolean;

  /** Whether an item is checked by default (checkedIndex 0) */
  public noPreselect: boolean;

  /** The item that currently has the active state */
  public get activeItem(): HTMLElement;

  public set activeItem(item: HTMLElement);

  /** Element members the mixin body uses on itself (restated: `this` is resolved through this host) */
  children: HTMLCollection;
  shadowRoot: ShadowRoot;
  childNodes: NodeListOf<ChildNode>;
  localName: string;
  disabled: boolean;

  public hasNoDefaultSelected: boolean;

  public singleOption: boolean;

  public get checkedIndex(): number | number[];

  public set checkedIndex(index: number | number[]);

  public get activeIndex(): number;

  public set activeIndex(index: number);

  public get listItems(): HTMLElement[];

  public setCheckedIndex(index: number): void;

  protected get _scrollTargetNode(): HTMLElement;

  protected get _invokerNode(): HTMLElement | null | undefined;

  protected set _invokerNode(invokerNode: HTMLElement | null | undefined);

  protected get _listNode(): HTMLElement;

  /** One of 'activedescendant', 'roving-tabindex', 'tabbable-disclosure' or 'none' */
  protected _activeMode: string;

  /** The role put on the list node: 'menu' | 'menubar' | 'listbox' | 'tree' | 'toolbar' */
  protected _listRole: string;

  protected _initListItems(newItems: Element[]): void;

  protected _syncCurrentPageWithLocationHref(location: Location): void;

  // private __setupListboxNode(): void;

  protected _getPreviousEnabledOption(currentIndex: number, offset?: number): number;

  protected _getNextEnabledOption(currentIndex: number, offset?: number): number;

  protected _onListKeyDown(ev: KeyboardEvent): void;

  protected _onListKeyUp(ev: KeyboardEvent): void;

  // protected _setupListboxNode(): void;

  // protected _teardownListboxNode(): void;

  protected _onListClick(ev: MouseEvent): void;

  // protected _setupListboxInteractions(): void;

  // protected _onChildActiveChanged(ev: Event): void;
}

export declare function InteractiveListMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<InteractiveListHost> &
  Pick<typeof InteractiveListHost, keyof typeof InteractiveListHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<SlotHost> &
  Pick<typeof SlotHost, keyof typeof SlotHost>;

export type InteractiveListMixin = typeof InteractiveListMixinImplementation;
