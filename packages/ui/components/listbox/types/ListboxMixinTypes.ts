import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, CSSResultArray } from 'lit';
import { SlotHost } from '../../core/types/SlotMixinTypes.js';

import { FormControlHost } from '../../form-core/types/FormControlMixinTypes.js';
import { FormRegistrarHost } from '../../form-core/types/registration/FormRegistrarMixinTypes.js';
import { ChoiceGroupHost } from '../../form-core/types/choice-group/ChoiceGroupMixinTypes.js';
import { LionOptions } from '../src/LionOptions.js';
import { LionOption } from '../src/LionOption.js';

export declare class ListboxHost {
  static styles: CSSResultArray;
  /**
   * When true, will synchronize active descendant and selected element on
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

  public checkedIndex: number | number[];

  public activeIndex: number;

  public formElements: LionOption[];

  public setCheckedIndex(index: number | number[]): void;

  /** Reset interaction states and modelValue */
  public reset(): void;

  protected get _scrollTargetNode(): HTMLElement;

  protected get _listboxNode(): LionOptions;

  protected _listboxReceivesNoFocus: boolean;

  protected _noTypeAhead: boolean;

  protected _uncheckChildren(): void;

  private __setupListboxNode(): void;

  protected _handleTypeAhead(ev: KeyboardEvent, params: { setAsChecked: boolean }): void;

  protected _getPreviousEnabledOption(currentIndex: number, offset?: number): number;

  protected _getNextEnabledOption(currentIndex: number, offset?: number): number;

  protected _listboxOnKeyDown(ev: KeyboardEvent): void;

  protected _listboxOnKeyUp(ev: KeyboardEvent): void;

  protected _scrollIntoView(el: HTMLElement, scrollTargetEl: HTMLElement | undefined): void;

  protected _setupListboxNode(): void;

  protected _teardownListboxNode(): void;

  protected _listboxOnClick(ev: MouseEvent): void;

  protected _setupListboxInteractions(): void;

  protected _onChildActiveChanged(ev: Event): void;

  protected get _activeDescendantOwnerNode(): HTMLElement;

  protected _onListboxContentChanged(): void;

  private __pendingTypeAheadTimeout: number | undefined;
}

export declare function ListboxImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<ListboxHost> &
  Pick<typeof ListboxHost, keyof typeof ListboxHost> &
  Constructor<ChoiceGroupHost> &
  Pick<typeof ChoiceGroupHost, keyof typeof ChoiceGroupHost> &
  Constructor<SlotHost> &
  Pick<typeof SlotHost, keyof typeof SlotHost> &
  Constructor<FormRegistrarHost> &
  Pick<typeof FormRegistrarHost, keyof typeof FormRegistrarHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type ListboxMixin = typeof ListboxImplementation;
