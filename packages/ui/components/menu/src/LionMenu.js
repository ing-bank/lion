/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html } from 'lit';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

import { OverlayMixin, withDropdownConfig } from '@lion/ui/overlays.js';
import { MultiLevelListMixin } from './MultiLevelListMixin.js';
import { InteractiveListMixin } from './InteractiveListMixin.js';
import { setChecked, toggleChecked } from './utils/listItemInteractions.js';

// /**
//  * @param {Element} element
//  */
// function getContentHeight(element) {
//   return `${element.getBoundingClientRect().height}px`;
// }

// /**
//  * Calculate total content height after collapsible opens
//  * @param {HTMLElement} contentNode content node
//  * @private
//  */
// async function calculateHeight(contentNode) {
//   contentNode.style.setProperty('max-height', '');
//   await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
//   return getContentHeight(contentNode); // Expected height i.e. actual size once collapsed after animation
// }

// /**
//  * @type {AnimateMixin}
//  */
// const AnimateMixinImplementation = superclass =>
//   class AnimateMixin extends superclass {
//     constructor() {
//       super();
//       this.__handleAnimateComplete = this.__handleAnimateComplete.bind(this);
//     }

//     connectedCallback() {
//       super.connectedCallback();
//       this._contentNode.style.setProperty('transition', 'max-height 0.35s, opacity 0.35s');
//     }

//     /**
//      * Trigger show animation and wait for transition to be finished.
//      * @param {Object} options - element node and its options
//      * @override
//      */
//     async _showAnimation(cfg) {
//       super._showAnimation(cfg);

//       const { contentNode } = cfg;
//       const expectedHeight = await calculateHeight(contentNode);
//       contentNode.style.setProperty('overflow', 'hidden');
//       contentNode.style.setProperty('opacity', '1');
//       contentNode.style.setProperty('max-height', '0');
//       await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
//       contentNode.style.setProperty('max-height', expectedHeight);
//       await this._animateComplete;
//       ['opacity', 'padding', 'max-height', 'overflow'].map(prop =>
//         contentNode.style.removeProperty(prop),
//       );
//     }

//     /**
//      * Trigger hide animation and wait for transition to be finished.
//      * @param {Object} options - element node and its options
//      * @override
//      */
//     async _hideAnimation(cfg) {
//       super._hideAnimation(cfg);

//       const { contentNode } = cfg;
//       if (getContentHeight(contentNode) === '0px') {
//         return;
//       }
//       const expectedHeight = await calculateHeight(contentNode);

//       contentNode.style.setProperty('overflow', 'hidden');
//       contentNode.style.setProperty('max-height', expectedHeight);
//       await new Promise(resolve => requestAnimationFrame(() => resolve()));
//       ['opacity', 'padding', 'max-height'].map(prop => contentNode.style.setProperty(prop, 0));

//       await this._animateComplete;
//     }
//   };
// export const AnimateMixin = dedupeMixin(AnimateMixinImplementation);

/**
 * The interactive (multi level) list behavior of a menu.
 *
 * Not exported on its own: consumers use `LionMenu`, which adds the
 * disclosure/overlay behavior on top of this.
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
// @ts-ignore - _listRole property type compatibility
class LionMenuCore extends MultiLevelListMixin(LitElement) {
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
    if (!item) return;

    // @ts-ignore - InteractiveListItemRole type
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
      listItemsWithinGroup = this.listItems.filter(listItem => group.contains(listItem));
      multiple = role === 'menuitemcheckbox';
    }

    if (!multiple) {
      // Uncheck all within group
      listItemsWithinGroup.forEach(listItem => {
        setChecked(listItem, true);
      });
      setChecked(this.listItems[index]);
    } else {
      toggleChecked(this.listItems[index]);
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

    if (this._activeMode === 'tabbable-disclosure') {
      this._listRole = 'list';
    }

    this._listNode.setAttribute('role', this._listRole);

    // Allow generic attr for functional styling
    this.dataset.menu = '';
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('bar')) {
      if (this.bar) {
        this.orientation = 'horizontal';
        if (this._listRole === 'menu') {
          this._listRole = 'menubar';
        }
      } else {
        this.orientation = 'vertical';
        if (this._listRole === 'menubar') {
          this._listRole = 'menu';
        }
      }
    }
  }
}

/**
 * Handles integration of InteractiveListMixin and OverlayMixin
 * Will be used by:
 * - LionMenu
 * - LionCombobox
 * - LionSelectRich
 *
 * @param {import('@open-wc/dedupe-mixin').Constructor<LionMenuCore>} superclass
 */
const OverlayWithListInvokerMixinImplementation = superclass =>
  class OverlayWithListInvokerMixin extends OverlayMixin(InteractiveListMixin(superclass)) {
    _onOverlayShow = () => {
      if (this.checkedIndex != null) {
        // @ts-ignore - activeIndex can be number or array
        this.activeIndex = this.checkedIndex;
      }
    };

    /**
     * @enhance OverlayMixin
     */
    _setupOverlayCtrl() {
      super._setupOverlayCtrl();

      if (!this._overlayCtrl) return;

      this._overlayCtrl.addEventListener('show', this._onOverlayShow);
    }

    /**
     * @enhance OverlayMixin
     */
    _teardownOverlayCtrl() {
      super._teardownOverlayCtrl();

      if (!this._overlayCtrl) return;

      this._overlayCtrl.removeEventListener('show', this._onOverlayShow);
    }

    /**
     * make sure OverlayMixin gets the contentNode defined by DisclosureMixin
     */
    get _overlayContentNode() {
      // @ts-ignore - _contentNode property
      return this._contentNode;
    }

    /**
     * make sure OverlayMixin gets the invokerNode defined by DisclosureMixin
     */
    get _overlayInvokerNode() {
      // @ts-ignore - _invokerNode property
      return this._invokerNode;
    }
  };
export const OverlayWithListInvokerMixin = dedupeMixin(OverlayWithListInvokerMixinImplementation);

/**
 * LionMenu is a list of choices. Whether it opens as an overlay or as a regular
 * collapsible (disclosure) is configurable via `openable-mode`.
 *
 * N.B. the actual switching will be delegated to the disclosure system (see the
 * visibility-toggle controller); for now `disclosure` is the default.
 */
export class LionMenu extends OverlayWithListInvokerMixin(LionMenuCore) {
  static get properties() {
    return {
      openableMode: { type: String, attribute: 'openable-mode' },
    };
  }

  constructor() {
    super();

    // By default, we go for disclosure behavior
    // a TODO: in the future, bring disclosure behavior to a controller (and therefore directive).
    // Take inspiration from VisibilityToggleCtrl of portal elements
    /**
     * Terminology aligned with https://open-ui.org/components/openable.explainer/
     * @type {'disclosure'|'overlay'}
     */
    this.openableMode = 'disclosure';

    this._shouldSetupOverlay = false;
  }

  /**
   * @param {import('lit').PropertyValues} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('openableMode')) {
      if (this.openableMode === 'overlay') {
        this._shouldSetupOverlay = true;
        this._setupOverlayCtrl();
      } else {
        this._teardownOverlayCtrl();
      }
    }
  }

  // TODO: this was created 5 years ago, do we still need id="overlay-content-node-wrapper" after the "dialog refactor"?
  render() {
    return html`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="list"></slot>
      </div>
      <slot id="list-items-outlet"></slot>
    `;
  }

  // @ts-ignore - overlay config return type
  _defineOverlayConfig() {
    // @ts-ignore - parentList property
    const { parentList } = this;
    let placement = 'bottom-start';
    if (parentList?.orientation !== 'horizontal') {
      placement = 'right-start';
    }

    const dropdownCfg = withDropdownConfig();

    return {
      ...dropdownCfg,
      hidesOnEsc: true,
      popperConfig: {
        ...dropdownCfg.popperConfig,
        placement,
        strategy: 'absolute',
        modifiers: [
          {
            name: 'offset',
            enabled: true,
            options: {
              offset: [0, 0],
            },
          },
        ],
      },
    };
  }

  /**
   * @enhance InteractiveListMixin
   * @param {*} ev
   */
  _onListKeyUp(ev) {
    super._onListKeyUp(ev);

    const { key } = ev;

    switch (key) {
      case 'Escape':
        // We need to stop here, or else we affect parent menu (handled by OverlayController)
        ev.stopPropagation();
        break;
      /* no default */
    }
  }
}
