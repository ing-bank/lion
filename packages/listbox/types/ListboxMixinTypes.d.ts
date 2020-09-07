import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { SlotHost } from '@lion/core/types/SlotMixinTypes';

import { FormControlHost } from '@lion/form-core/types/FormControlMixinTypes';
import { FormRegistrarHost } from '@lion/form-core/types/registration/FormRegistrarMixinTypes';
import { ChoiceGroupHost } from '@lion/form-core/types/choice-group/ChoiceGroupMixinTypes';
import { LionOptions } from '../src/LionOptions.js';
import { LionOption } from '../src/LionOption.js';

export declare class ListboxHost {
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
  // protected _invokerNode: HTMLElement;

  public checkedIndex: number | number[];

  public activeIndex: number;

  public formElements: LionOption[];

  public setCheckedIndex(index: number): void;

  protected _scrollTargetNode: LionOptions;

  protected _listboxNode: LionOptions;

  private __setupListboxNode(): void;

  protected _getPreviousEnabledOption(currentIndex: number, offset?: number): number;

  protected _getNextEnabledOption(currentIndex: number, offset?: number): number;

  protected _listboxOnKeyDown(ev: KeyboardEvent): void;

  protected _listboxOnKeyUp(ev: KeyboardEvent): void;

  protected _setupListboxNodeInteractions(): void;

  protected _teardownListboxNode(): void;

  protected _listboxOnClick(ev: MouseEvent): void;

  protected _setupListboxInteractions(): void;

  protected _onChildActiveChanged(ev: Event): void;
}

export declare function ListboxImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<ListboxHost> &
  ListboxHost &
  Constructor<ChoiceGroupHost> &
  typeof ChoiceGroupHost &
  Constructor<SlotHost> &
  typeof SlotHost &
  Constructor<FormRegistrarHost> &
  typeof FormRegistrarHost &
  Constructor<FormControlHost> &
  typeof FormControlHost;

export type ListboxMixin = typeof ListboxImplementation;
