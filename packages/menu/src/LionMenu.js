/* eslint-disable max-classes-per-file */
import { dedupeMixin, LitElement } from '@lion/core';
import { MultiLevelListMixin } from './MultiLevelListMixin.js';
import { setChecked, toggleChecked } from './utils/listItemInteractions.js';


function getContentHeight(node) {
  return `${node.getBoundingClientRect().height}px`;
}

/**
 * Calculate total content height after collapsible opens
 * @param {Object} contentNode content node
 * @private
 */
async function calculateHeight(contentNode) {
  contentNode.style.setProperty('max-height', '');
  await new Promise(resolve => requestAnimationFrame(() => resolve()));
  return getContentHeight(contentNode); // Expected height i.e. actual size once collapsed after animation
}


const AnimateMixinImplementation = superclass =>
  class AnimateMixin extends superclass {
    constructor() {
      super();
      this.__handeAnimateComplete = this.__handeAnimateComplete.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      this._contentNode.style.setProperty('transition', 'max-height 0.35s, opacity 0.35s');
    }

    /**
     * Trigger show animation and wait for transition to be finished.
     * @param {Object} options - element node and its options
     * @override
     */
    async _showAnimation(cfg) {
      super._showAnimation(cfg);

      const { contentNode } = cfg;
      const expectedHeight = await calculateHeight(contentNode);
      contentNode.style.setProperty('overflow', 'hidden');
      contentNode.style.setProperty('opacity', '1');
      contentNode.style.setProperty('max-height', '0');
      await new Promise(resolve => requestAnimationFrame(() => resolve()));
      contentNode.style.setProperty('max-height', expectedHeight);
      await this._animateComplete;
      ['opacity', 'padding', 'max-height', 'overflow'].map(prop =>
        contentNode.style.removeProperty(prop),
      );
    }

    /**
     * Trigger hide animation and wait for transition to be finished.
     * @param {Object} options - element node and its options
     * @override
     */
    async _hideAnimation(cfg) {
      super._hideAnimation(cfg);

      const { contentNode } = cfg;
      if (getContentHeight(contentNode) === '0px') {
        return;
      }
      const expectedHeight = await calculateHeight(contentNode);

      contentNode.style.setProperty('overflow', 'hidden');
      contentNode.style.setProperty('max-height', expectedHeight);
      await new Promise(resolve => requestAnimationFrame(() => resolve()));
      ['opacity', 'padding', 'max-height'].map(prop => contentNode.style.setProperty(prop, 0));

      await this._animateComplete;
    }
  };
export const AnimateMixin = dedupeMixin(AnimateMixinImplementation);

/**
 *
 * Api explanation:
 * - No [slot="invoker"], because adding it inside the lion-menu would:
 *  - make api more verbose, less aligned with common html examples (examples from wai-aria etc.)
 *  - break Popper positioning (you would need to specify parent menuitem as reference node)
 *  - put click surface inside menuitem padding (you would need to correct with negative margin :( ...)
 * - No [slot="content"], because for a "right click menu" it would be obsolete
 *
 * @example menu button (VsCode action menu right top of screen)
 * <lion-menu>
 *   <button slot="invoker" title="More actions">...</button>
 *   <div role="menuitem">Show opened editors</div>
 *   <div role="separator"></div>
 *   <div role="menuitem">Close All</div>
 * </lion-menu>
 *
 * @example as menubar (VsCode main menu)
 * <lion-menu bar>
 *   <div>
 *     <div role="menuitem">File</div>
 *     <lion-menu>
 *       <div role="menuitem">New File</div>
 *       <div role="separator"></div>
 *       <div>
 *         <div role="menuitem">Open Recent</div>
 *         <lion-menu>
 *           More...
 *         </lion-menu>
 *       </div>
 *     </lion-menu>
 *   </div>
 *   <div>
 *     <div role="menuitem">View</div>
 *     <lion-menu>
 *       <div role="menuitemcheckbox">Show Minimap</div>
 *     </lion-menu>
 *   </div>
 * </lion-menu>
 *
 *
 * @example as context menu (VsCode right click menu)
 * <lion-menu>
 *   <div role="menuitem">Go to Definition</div>
 *   <div role="menuitem">Go to Type Definition</div>
 *   <div>
 *     <div role="menuitem">Peek</div>
 *     <lion-menu>
 *       <div role="menuitem">Peek Call Hierarchy</div>
 *       <div role="separator"></div>
 *       <div role="menuitem">Peek Definition</div>
 *     </lion-menu>
 *   </div>
 *   <div role="separator"></div>
 *   <div role="menuitem">Find all References</div>
 * </lion-menu>
 */
export class LionMenu extends AnimateMixin(MultiLevelListMixin(LitElement)) {
  static get properties() {
    return {
      /**
       * Enable bar to use [role="menubar"] and horizontal navigation
      */
      bar: { type: Boolean },
    };
  }

  /**
   * Allows groups within one level. In case we deal with menuitemcheckbox,
   * we treat it as multiple choice group
   * @override InteractiveListMixin
   * @param {number} index
   */
  setCheckedIndex(index) {
    const item = this.listItems[index];
    if (item) {
      const role = /** @type {InteractiveListItemRole} */ (item.getAttribute('role'));
      let listItemsWithinGroup = this.listItems;
      let multiple = this.multipleChoice;
      if (role === 'menuitemradio' || role === 'menuitemcheckbox') {
        /**
         * If index = 3 (menuitemradio 'Red'), closest group will be div[role=group]
         * @example
         * <interactive-list role="menu">
         *   <div role="menuitemcheckbox" aria-checked="true">Bold</div>
         *   <div role="menuitemcheckbox" aria-checked="true">Italic</div>
         *   <div role="separator"></div>
         *   <div role="group" aria-label="Text Color">
         *     <div role="menuitemradio" aria-checked="false">Blue</div>
         *     <div role="menuitemradio" aria-checked="true">Red</div>
         *     <div role="menuitemradio" aria-checked="false">Green</div>
         *   </div>
         * </interactive-list>
         */
        const closestGroup = item.closest('[role="group"]');
        const group = closestGroup && this.contains(closestGroup) ? closestGroup : this;
        listItemsWithinGroup = this.listItems.filter(item => group.contains(item));
        multiple = role === 'menuitemcheckbox';
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

  constructor() {
    super();

    this.bar = false;
    /** @configure MultiLevelListMixin */
    this.behaveAsAccordion = true;
    /** @configure InteractiveListMixin */
    this._listRole = 'menu';
    /** @configure InteractiveListMixin */
    this._activateOnTypedChars = true;
    /** @configure DisclosureMixin */
    this.invokerInteraction = 'click';
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    if (this.bar) {
      this.orientation = 'horizontal';
      if (this._listRole === 'menu') {
        this._listRole = 'menubar';
      }
    }

    if (this._activeMode === 'disclosure') {
      this._listRole = 'list';
    }

    this._listNode.setAttribute('role', this._listRole);
  }
}
