import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { InteractiveListHost } from './InteractiveListMixinTypes.js';

/**
 * The 'more' button pattern: items that do not fit are moved into a sub menu behind a more
 * button. See `MoreButtonMenuMixin`.
 */
export declare class MoreButtonMenuHost extends InteractiveListHost {
  protected _initMoreButtonMenu(): void;

  protected _getDeepActiveElement(): Element | null;

  protected _createMoreButtonWrapper(): void;

  getMoreButtonSlotProjection(): Element | null;

  getMoreButtonMenu(): Element | null;

  getMoreButtonMenuWrapper(): Element | null;

  displayMoreButton(): void;

  hideMoreButton(): void;

  doItemsFit(): boolean;

  getListItems(): Element[];

  moveItemToMoreButtonMenuFromMainMenu(params: {
    moreButtonMenuElement: HTMLElement;
    listItem: HTMLElement;
  }): void;

  moveAllItemsToMainMenuFromMoreButtonMenu(): void;

  renderAllItemsInMainMenu(): void;

  hideItemsOneByOneInMainMenuUntilTheyFit(): void;

  moveHiddenItemsFromMainMenuToMoreButtonMenu(hiddenItemsCount: number): void;
}

export declare function MoreButtonMenuImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<MoreButtonMenuHost> &
  Pick<typeof MoreButtonMenuHost, keyof typeof MoreButtonMenuHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type MoreButtonMenuMixin = typeof MoreButtonMenuImplementation;
