import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { SlotHost } from '@lion/core/types/SlotMixinTypes';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';

export type InteractiveListItemRole =
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'option'
  | 'treeitem'
  | 'radio'
  | 'checkbox';

export declare class InteractiveListHost {
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

  public hasNoDefaultSelected: boolean;

  public singleOption: boolean;

  public checkedIndex: number | number[];

  public activeIndex: number;

  public listItems: HTMLElement[];

  public setCheckedIndex(index: number): void;

  protected _scrollTargetNode: HTMLElement;

  protected _listNode: HTMLElement;

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

export declare function InteractiveListHostImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<InteractiveListHost> &
  InteractiveListHost &
  Constructor<DisabledHost> &
  typeof DisabledHost &
  Constructor<SlotHost> &
  typeof SlotHost;

export type InteractiveListMixin = typeof InteractiveListHostImplementation;
