import { LionMenu } from './LionMenu.js';
import { setChecked, toggleChecked } from './utils/listItemInteractions.js';

export class LionToolbar extends LionMenu {
  constructor() {
    super();

    this._listRole = 'toolbar';
    this.bar = true;
  }

  /**
   * Allows groups ([role=radiogroup|checkboxgroup]) within one level.
   * In case we deal with [role=checkbox], we treat it as multiple choice group
   * @override InteractiveListMixin
   * @param {number} index
   */
  setCheckedIndex(index) {
    const item = this.listItems[index];
    if (item) {
      const role = /** @type {InteractiveListItemRole} */ (item.getAttribute('role'));
      let listItemsWithinGroup = this.listItems;
      let multiple = this.multipleChoice;
      if (role === 'radio' || role === 'checkbox') {
        /**
         * If index = 1 (radio 'Red'), closest group will be div[role=radiogroup]
         * @example
         * <lion-toolbar>
         *   <div role="radiogroup" aria-label="Text Color">
         *     <button role="radio" aria-checked="false">Blue</button>
         *     <button role="radio" aria-checked="true">Red</button>
         *     <button role="radio" aria-checked="false">Green</button>
         *   </div>
         *   <div role="separator"></div>
         *   <div role="checkboxgroup" aria-label="Text Color">
         *     <button role="checkbox" aria-checked="false">Blue</button>
         *     <button role="checkbox" aria-checked="true">Red</button>
         *     <button role="checkbox" aria-checked="false">Green</button>
         *   </div>
         * </lion-toolbar>
         */
        let closestGroup;
        if (role === 'radio') {
          closestGroup = item.closest('[role="radiogroup"]');
        } else if (role === 'checkbox') {
          closestGroup = item.closest('[role="checkboxgroup"]');
        }

        const group = closestGroup && this.contains(closestGroup) ? closestGroup : this;
        listItemsWithinGroup = this.listItems.filter(item => group.contains(item));
        multiple = role === 'checkbox';
      }

      if (!multiple) {
        // Uncheck all
        listItemsWithinGroup.forEach(item => {
          setChecked(item, true);
        });
        setChecked(this.listItems[index]);
      } else {
        toggleChecked(this.listItems[index]);
      }
    }
  }

  _initListItems(newItems) {
    super._initListItems(newItems);

    newItems.forEach(item => {
      if (
        item.getAttribute('role') === 'button' ||
        (item.tagName === 'BUTTON' && !item.hasAttribute('role'))
      ) {
        const initialAriaPressed = item.getAttribute('aria-pressed');
        item.setAttribute('aria-pressed', initialAriaPressed || 'false');

        item.addEventListener('click', () => {
          const ariaPressed = item.getAttribute('aria-pressed') === 'true';
          item.setAttribute('aria-pressed', `${!ariaPressed}`);
        });
      }
    });
  }
}
