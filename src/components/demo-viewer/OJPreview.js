import { html, css, nothing, render } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { LionSelect } from '@lion/ui/select.js';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-relative-packages
import { ScopedElementsMixin } from '../../../packages/ui/components/core/src/ScopedElementsMixin.js';

import {
  cssClassModifierInterfaceRegistry,
  ingCssClasses,
  globalStateMap,
} from './test-and-demo-helpers/modifier-interfaces/index.js';
// import { appendAllIngWebStylesToRoot } from './test-and-demo-helpers/index.js';
import { LegacyOJPreview } from './LegacyOJPreview.js';
// import aliasAndBaseTokensForDarkMode from './style/tokens-demo-viewer.css.js';
import {
  codeIcon,
  copyIcon,
  resetIcon,
  closeIcon,
  settingsIcon,
  shrinkViewIcon,
  expandViewIcon,
  externalDemoIcon,
  modifierCombineIcon,
  copiedCorrectlyFeedbackIcon,
} from './icons.js';
// @ts-expect-error
import * as csstree from 'css-tree/dist/csstree.esm';

const supportsAdoptingStyleSheets =
  window.ShadowRoot &&
  // @ts-ignore
  (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
  'adoptedStyleSheets' in Document.prototype &&
  'replace' in CSSStyleSheet.prototype;

/**
 * @typedef {import('lit').CSSResult} CSSResult
 */

// const themes = ['legacy', 'retail', 'youth', 'business', 'private', 'wholesale', 'wireframe'];
// const themesBasic = ['legacy', 'oj2', 'wireframe'];
const surfaces = [
  'default',
  'primary',
  'secondary',
  'secondary-subtle',
  'secondary-moderate',
  'secondary-bold',
  'tertiary',
  'tertiary-subtle',
  'tertiary-moderate',
  'tertiary-bold',
  'quaternary',
  'quaternary-subtle',
  'quaternary-moderate',
  'quaternary-bold',
  'neutral',
  'neutral-subtle',
  'neutral-moderate',
  'neutral-bold',
  'inverse',
];
const devices = ['mobile', 'desktop'];
const modes = ['light', 'dark'];

/**
 * @param {*} options
 */
function getModelSyncedWithDemoDom({ model, modifiers, modifierMappers, demoEl }) {
  const updatedModel = { ...model };

  // Now that we have the model, update our component that we rendered.
  for (const variant of modifiers.variants || []) {
    // @ts-expect-error
    const variantFound = updatedModel.variants.find(v => v.name === variant.name);
    if (variantFound) {
      // @ts-expect-error
      const mapperFound = modifierMappers.find(m => m.name === variant.name);
      variantFound.value = mapperFound?.getter(demoEl, variant.name, {
        variantValues: variant.values,
      });
    }
  }
  for (const state of modifiers.states || []) {
    // @ts-expect-error
    const mapperFound = modifierMappers.find(m => m.name === state);
    const shouldBeActive = mapperFound?.getter(demoEl, state, {});
    // @ts-expect-error
    const stateIdx = updatedModel.states.findIndex(s => s === state);
    if (stateIdx === -1 && shouldBeActive) {
      updatedModel.states.push(state);
    }
  }

  return updatedModel;
}

/**
 * @param {RadioNodeList} radioNodeList
 */
function getValFromRadioNodeList(radioNodeList) {
  if (radioNodeList[0].type === 'radio') {
    return radioNodeList.value;
  }
  return Array.from(radioNodeList)
    .filter(r => r.checked)
    .map(r => r.value);
}

/**
 * @param {*} options
 */
function updateModifiersInDemo({ model, modifiers, demoEl, modifierMappers }) {
  // Now that we have the model, update our component that we rendered.
  for (const variant of modifiers.variants || []) {
    // @ts-expect-error
    const variantFound = model.variants.find(v => v.name === variant.name);
    if (variantFound) {
      // @ts-expect-error
      const mapperFound = modifierMappers.find(m => m.name === variant.name);
      mapperFound?.setter(demoEl, variant.name, variantFound.value, {
        variantValues: variant.values,
      });
    }
  }
  for (const state of modifiers.states || []) {
    // @ts-expect-error
    const mapperFound = modifierMappers.find(m => m.name === state);
    mapperFound?.setter(demoEl, state, model.states.includes(state), {});
  }
}

/**
 * Say we have 3 statesL ['hover', 'focus', 'pressed']
 * We want all possible combinations of these states:
 * - ['', '', ''] (none)
 * - ['hover', '', ''] (one state pos1)
 * - ['', 'focus', ''] (one state pos2)
 * - ['', '', 'pressed'] (one state pos3)
 * - ['hover', 'focus', ''] (two states pos1)
 * - ['', 'focus', 'pressed'] (two states pos2)
 * - ['hover', '', 'pressed'] (two states pos3)
 * - ['hover', 'focus', 'pressed'] (all)
 *
 * Create a matrix of 0s and 1s that can be mapped to the state boolean values
 * Adds 0 and 1 to each entry in the matrix on every iteration
 * - [[]]
 * - [[0], [1]]
 * - [[0,0], [0,1], [1,0], [1,1]]
 * - etc.
 * The 0s and 1s can be mapped to the state boolean values above
 * @param {number} iterationsLeft
 * @param {Array<Array<number>>} arr
 * @returns {Array<Array<number>>}
 */
function multiplyMatrix(iterationsLeft, arr = [[]]) {
  if (iterationsLeft === 0) return arr;

  /** @type {Array<Array<number>>} */
  const newArr = [];
  for (const entry of arr) {
    newArr.push([0, ...entry]);
    newArr.push([1, ...entry]);
  }
  return multiplyMatrix(iterationsLeft - 1, newArr);
}

/**
 * When a csstree Prelude contains unknown css syntax, it will be parsed as type 'Raw' instead of 'SelectorList'.
 * In that case, replace via string replace.
 * @param {string} selectorListRaw
 * @param {{ name:string; pseudoClass:string; lionGlobalAttr:string }[]} statesToReplace
 * @returns {string}
 */
function replaceInRawSelectorList(selectorListRaw, statesToReplace) {
  const selectorList = selectorListRaw.split(',').map(s => s.trim());
  const selectorsToBePrepended = [];
  for (const selector of selectorList) {
    let newSelector = selector;
    for (const { name, pseudoClass, lionGlobalAttr } of statesToReplace) {
      if (selector.includes(pseudoClass)) {
        newSelector = newSelector.replace(pseudoClass, `._m-${name}`);
      }
      // TODO: we probably need to enhance this with regex for attrs like [atrr~=val]
      if (selector.includes(`[${lionGlobalAttr}]`)) {
        newSelector = newSelector.replace(`[${lionGlobalAttr}]`, `._m-${name}`);
      }
    }
    if (newSelector !== selector) {
      selectorsToBePrepended.push(newSelector);
    }
  }
  if (selectorsToBePrepended.length) {
    return [...selectorsToBePrepended, ...selectorList].join(', ');
  }
  return selectorListRaw;
}

/**
 * @param {string} cssTxt
 * @param {string[]} states - a set of css pseudo classes that should be replaced in demo
 */
function replaceTxtWithModifierDemoClasses(cssTxt, states) {
  const statesThatHavePseudoClassOrGlobalAttr = states.filter(s => {
    const found = globalStateMap.find(g => g.name === s);
    return found?.pseudoClass || found?.lionGlobalAttr;
  });
  const statesToReplace = /** @type {{ name:string; pseudoClass:string }[]} */ (
    statesThatHavePseudoClassOrGlobalAttr.map(s => ({
      name: s,
      pseudoClass: globalStateMap.find(g => g.name === s)?.pseudoClass,
      lionGlobalAttr: globalStateMap.find(g => g.name === s)?.lionGlobalAttr,
    }))
  );

  const ast = csstree.parse(cssTxt);
  csstree.walk(
    ast,
    (
      /** @type {{ type: string; prelude: { type: string; value: string; children: any; }; }} */ node,
    ) => {
      if (node.type === 'Rule') {
        if (node.prelude.type === 'Raw') {
          // @ts-expect-error
          node.prelude.value = replaceInRawSelectorList(node.prelude.value, statesToReplace);
        } else {
          // Since css-tree does not understand 'modern' css syntax like ":host(<children>)",
          // we just convert prelude.type === 'SelectorList' to 'Raw' and replace the pseudo classes like above.
          const rawValue = csstree.generate(node.prelude);
          node.prelude.type = 'Raw';
          delete node.prelude.children;
          // @ts-expect-error
          node.prelude.value = replaceInRawSelectorList(rawValue, statesToReplace);
        }
      }
    },
  );

  // generate CSS from AST
  const replacedResult = csstree.generate(ast);
  return replacedResult;
}

/**
 * @param {HTMLElement & {shadowRoot: ShadowRoot}} el
 * @param {{ strategy?: 'web-component' | 'css-component' }} opts
 */
function getSheetsForEl(el, { strategy = 'web-component' } = {}) {
  // @ts-expect-error
  const searchRoot = el.parentElement || el.getRootNode()?.host;
  const elsFound = [el];
  if (strategy === 'css-component') {
    elsFound.push(searchRoot);
  } else {
    const scopedElNames = Object.keys({
      ...searchRoot.constructor?.scopedElements,
      // @ts-expect-error
      ...el.constructor?.scopedElements,
    });
    const childrenToConsider = scopedElNames.filter(
      scopedEl => scopedEl.startsWith('lion-') || scopedEl.startsWith('ing-'),
    );
    for (const child of childrenToConsider) {
      let childEl = el.shadowRoot.querySelector(child);
      if (!childEl) {
        childEl = el.querySelector(child);
      }
      if (childEl) {
        // @ts-expect-error
        elsFound.push(childEl);
      }
    }
  }

  const sheetsOrStyles = [];
  for (const el of elsFound) {
    if (supportsAdoptingStyleSheets) {
      sheetsOrStyles.push(...el.shadowRoot.adoptedStyleSheets);
    } else {
      sheetsOrStyles.push(...Array.from(el.shadowRoot?.querySelectorAll('style') || []));
    }
  }

  return sheetsOrStyles;
}

/**
 *
 * @param {(CSSStyleSheet|HTMLStyleElement)[]} sheetsOrStyles
 * @param {string[]} states
 */
function replaceInSheets(sheetsOrStyles, states) {
  for (const sheetOrStyle of sheetsOrStyles) {
    if (sheetOrStyle instanceof CSSStyleSheet) {
      const sheet = sheetOrStyle;

      const cssTxt = Array.from(sheet.cssRules)
        .map(rule => rule.cssText)
        .join('\n');
      sheet.replaceSync(replaceTxtWithModifierDemoClasses(cssTxt, states));
    } else {
      const style = sheetOrStyle;

      const cssTxt = style.innerHTML;
      style.innerHTML = replaceTxtWithModifierDemoClasses(cssTxt, states);
    }
  }
}

export class OJPreview extends ScopedElementsMixin(LegacyOJPreview) {
  static get scopedElements() {
    return {
      // @ts-ignore
      ...super.scopedElements,
      'lion-select': LionSelect,
    };
  }

  /** @type {any} */
  static get properties() {
    return {
      themePref: String,
      surfacePref: String,
      devicePref: String,
      darkModePref: String,
      _modifierCombineModel: Object,
      _shouldShowModifierCombinator: Boolean,
      _shouldShowCodePreview: Boolean,
      _shouldShowModifierCombinationsMatrix: Boolean,
      __isHoveringDemo: Boolean,
      __isCopying: Boolean,
      mdjsStoryName: { attribute: 'mdjs-story-name', type: String },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      // aliasAndBaseTokensForDarkMode,
      css`
        .modifier-combinator fieldset {
          display: flex;
          flex-flow: wrap;
          border-style: solid;
          border-color: var(--bg-subtle);
          border-right: none;
          border-bottom: none;
          border-left: none;
          margin: 0;
          font-size: 14px;
          gap: 4px;
          outline: none;
        }

        .modifier-combinator legend {
          font-weight: bold;
        }

        .modifier-combinator input {
          accent-color: var(--text-primary);
          border-radius: var(--border-radius-circle);
        }

        .modifier-combinator input:focus {
          box-shadow: 0 0 0 var(--border-width-lg) var(--focus-border-color-inner);
          outline-width: var(--border-width-lg);
          outline-style: solid;
          outline-color: var(--focus-border-color-outer);
          outline-offset: var(--border-width-lg);
        }

        .modifier-combinator label:has(> input) {
          display: flex;
        }

        .modifier-combinator {
          margin-block-end: var(--spacing-2xl);
        }

        .icon-toolbar {
          display: flex;
          justify-content: end;
          margin-top: calc(-1 * var(--spacing-lg));
          margin-right: calc(-1 * var(--spacing-md));
          margin-bottom: var(--spacing-xl);
          gap: var(--spacing-sm);
        }

        .tools-btn {
          display: inline-flex;
          padding: 8px;
          border: 1px solid transparent;
          background: none;
          cursor: pointer;
          fill: var(--text-primary);
          border-radius: var(--border-radius-circle);
        }

        .demo-viewer {
          background-color: var(--border-color);
        }

        .demo-viewer__section--modifier-combinator .tools-btn:hover {
          background:
            linear-gradient(0deg, var(--highlight-color), var(--highlight-color)), var(--bg-subtle);
        }

        .tools-btn:focus {
          box-shadow: 0 0 0 var(--border-width-lg) var(--focus-border-color-inner);
          outline-width: var(--border-width-lg);
          outline-style: solid;
          outline-color: var(--focus-border-color-outer);
          outline-offset: var(--border-width-lg);
        }

        .tools-btn > svg {
          width: 20px;
          height: 20px;
        }

        .tools-btn[aria-pressed='true'] {
          fill: var(--highlight-color);
        }

        .demo-viewer__section.demo-viewer__section--demo {
          padding-block-start: var(--spacing-lg);
          padding-block-end: var(--spacing-2xl);
          padding-inline: var(--spacing-2xl);
        }

        .demo-viewer__section--demo .demo-viewer__surface {
          background-color: var(--bg-surface);
          padding: var(--spacing-3xl);
        }

        :host(:not([device-mode])) #wrapper {
          padding: 0;
        }

        .demo-viewer {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .demo-viewer__section {
          position: relative;
          padding: 32px;
          border-bottom-left-radius: inherit;
          border-bottom-right-radius: inherit;
        }

        .demo-viewer__section--code {
          padding: 0;
          background-color: var(--bg-color);
          font-size: medium;
        }

        .demo-viewer__section--code .icon-toolbar {
          position: absolute;
          top: var(--spacing-xl);
          right: var(--spacing-xl);
          margin: 0;
        }

        .demo-viewer__section--modifier-combinator {
          padding-bottom: 8px;
          padding-left: 20px;
          margin-bottom: -24px;
          padding-right: 32px;
        }

        .permutatution-matrix-table {
          width: 100%;
        }

        .permutatution-matrix-table th,
        .permutatution-matrix-table td {
          border-collapse: collapse;
          text-align: left;
          padding: 32px;
        }

        .sr-only {
          position: absolute;
          top: 0;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(100%);
          clip: rect(1px, 1px, 1px, 1px);
          white-space: nowrap;
          border: 0;
          margin: 0;
          padding: 0;
        }

        .matrix-individual-demo {
          pointer-events: none;
          background-color: var(--bg-default);
          padding: 32px;
        }

        .dialog::backdrop {
          background-color: rgba(0, 0, 0, 0.3);
          position: fixed;
          inset: 0;
          backdrop-filter: blur(5px);
        }

        .dialog {
          width: 70vw;
          border: none;
          top: 160px;
          border-radius: 16px;
          /* padding-top: 32px; */
          padding: 0;
        }

        .dialog__header {
          padding-left: 150px;
          margin-bottom: 40px;
        }

        .permutatution-matrix-table {
          position: relative;
        }

        .permutatution-matrix-table .column-left {
          width: 150px;
        }

        .permutatution-matrix-table th {
          position: sticky;
          top: 0;
          z-index: 3;
          background: white;
        }

        select {
          height: auto;
          color: auto;
          fill: auto;
          font-size: auto;
          line-height: auto;
        }

        ::slotted(pre.astro-code) {
          visibility: visible;
        }
      `,
    ];
  }

  get _demoCanvasNode() {
    return this.shadowRoot?.querySelector('.demo-viewer__inner-section');
  }

  /**
   * The first lion ui component encountered in the demo
   */
  get _demoElNode() {
    return this.__demoElNode;
  }

  constructor() {
    super();

    this.modifiers = {};

    /** @type {'dark'|'light'|'auto'} */
    this.darkModePref = 'auto';
    this.themePref = 'auto';
    this.devicePref = 'auto';
    this.surfacePref = 'default';
    this.isExpressive = false;
    // Use this to check whether we have an 'actual' story or a 'placeholder' story
    // @ts-expect-error
    this.__placeholderStory = this.story;

    this._shouldShowModifierCombinator = false;
    this._shouldShowCodePreview = false;
    this._shouldShowModifierCombinationsMatrix = false;

    this.__amountOfModifierCombinations = 0;

    this._matrixDialogRef = createRef();
  }

  // connectedCallback() {
  //   super.connectedCallback();

  //   // @ts-expect-error
  //   // appendAllIngWebStylesToRoot(this.lightDomRenderTarget);
  //   // this.checkIfExpressive();
  // }

  /**
   * @param {import('lit').PropertyValues} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    // @ts-expect-error
    if (changedProperties.has('story') && this.story !== this.__placeholderStory) {
      // We need to wait a tick: https://github.com/lit/lit/issues/3538
      requestAnimationFrame(() => {
        this._initModifierCombinations();
      });
    }

    // if (changedProperties.has('themePref')) {
    //   let selectedTheme;
    //   if (this.themePref === 'auto') {
    //     const themeVal = document.documentElement.getAttribute('data-theme');
    //     selectedTheme = themeVal?.includes('legacy') ? 'legacy' : 'retail';
    //   } else if (this.themePref === 'oj2') {
    //     selectedTheme = 'retail';
    //   } else {
    //     selectedTheme = this.themePref;
    //   }
    //   this.updateDataTheme(selectedTheme, themes);
    // }

    // if (changedProperties.has('devicePref')) {
    //   let selectedDevice;
    //   if (this.devicePref === 'auto') {
    //     const themeVal = document.documentElement.getAttribute('data-theme');
    //     selectedDevice = themeVal?.includes('desktop') ? 'desktop' : 'mobile';
    //   } else {
    //     selectedDevice = this.devicePref;
    //   }
    //   this.updateDataTheme(selectedDevice, devices);
    // }

    // if (changedProperties.has('darkModePref')) {
    //   let newTheme;
    //   if (this.darkModePref === 'auto') {
    //     const themeVal = document.documentElement.getAttribute('data-theme');
    //     newTheme = themeVal?.includes('dark') ? 'dark' : 'light';
    //   } else {
    //     newTheme = this.darkModePref;
    //   }
    //   this.updateDataTheme(newTheme, modes);
    // }

    // if (changedProperties.has('surfacePref')) {
    //   this.updateSurfaceNode();
    // }
  }

  updateSurfaceNode() {
    if (this.mdjsStoryName?.toLowerCase().includes('cardexpressive')) {
      this._demoElNode?.setAttribute('surface', this.surfacePref);
    } else {
      let surfaceNode = /** @type {HTMLElement} */ (
        this._demoCanvasNode?.querySelector('.demo-viewer__surface')
      );
      surfaces.forEach(surface => {
        surfaceNode?.classList.remove(`surface--${surface}`);
      });
      surfaceNode?.classList.add(`surface--${this.surfacePref}`);
    }
  }

  /**
   * @param {string} selectedTheme
   * @param {string[]} dataThemeTypes
   */
  updateDataTheme(selectedTheme, dataThemeTypes) {
    let curThemeVal = /** @type {string} */ (this._demoCanvasNode?.getAttribute('data-theme'));
    if (!curThemeVal) {
      this._demoCanvasNode?.setAttribute('data-theme', '');
      curThemeVal = '';
    }
    let curThemeValArr = curThemeVal.split(/\s/g);
    let newVal;
    dataThemeTypes.forEach(theme => {
      curThemeValArr = curThemeValArr.filter(v => v !== theme);
    });

    curThemeValArr.push(selectedTheme);
    newVal = Array.from(new Set(curThemeValArr)).join(' ');
    this._demoCanvasNode?.setAttribute('data-theme', newVal);
  }

  checkIfExpressive() {
    if (this.mdjsStoryName?.toLowerCase().includes('noexpressive')) {
      this.isExpressive = false;
      return;
    }

    if (this.mdjsStoryName?.toLowerCase().includes('expressive')) {
      this.isExpressive = true;
      return;
    }

    const componentUrl = document.URL.split('components/')[1];
    const componentName = componentUrl?.split('/')[0];

    // // Dynamically import components only if it exists
    // try {
    //   import('../componentsOverview.js').then(({ components }) => {
    //     if (components) {
    //       components.map(component => {
    //         if (component.folder === componentName) {
    //           this.isExpressive = component.expressive || false;
    //         }
    //       });
    //     }
    //   });
    // } catch {
    //   // components module not available, skip
    // }
  }

  /**
   * @param {{choices:string[]; name:string; modelV:string}} cfg
   */
  renderSingleChoice({ choices, name, modelV }) {
    return html`<fieldset>
      <legend>${name}</legend>
      ${choices.map(
        choice =>
          html`<label
            ><input
              name="${name}"
              type="radio"
              .value="${choice}"
              .checked="${modelV === choice}"
            />${choice}</label
          >`,
      )}
    </fieldset>`;
  }

  /**
   * @param {{choices:string[]; name:string; modelV: string[]}} cfg
   */
  renderMultiChoice({ choices, name, modelV }) {
    return html`<fieldset>
      <legend>${name}</legend>
      ${choices.map(
        choice =>
          html`<label
            ><input
              name="${name}"
              type="checkbox"
              .value="${choice}"
              .checked="${modelV?.includes(choice)}"
            />${choice}</label
          >`,
      )}
    </fieldset>`;
  }

  /**
   * @param {{choices:string[]; name:string; modelV: string[]}} cfg
   */
  renderSelect({ choices, name, modelV }) {
    return html`
      <fieldset>
        <lion-select name="${name}">
          <label slot="label">${name}</label>
          <select slot="input">
            ${choices.map(choice => html` <option value="${choice}">${choice}</option> `)}
          </select>
        </lion-select>
      </fieldset>
    `;
  }

  // @ts-expect-error
  renderModifierCombinationsDialog({ modifiers }) {
    const { variants: _variants, states } = modifiers;
    const variants = _variants?.length ? _variants : [{ name: 'generic', values: ['generic'] }];

    const matrixOfZerosAndOnes = states?.length ? multiplyMatrix(states.length) : [];
    /** @type {Array<Array<string>>} */
    const mappedMatrix = [];
    if (states?.length) {
      for (const row of matrixOfZerosAndOnes) {
        mappedMatrix.push(row.map((bool, idx) => (bool ? states[idx] : '')));
      }
    } else {
      mappedMatrix.push(['']);
    }

    // @ts-expect-error
    function excludeDisabledSiblingStates(row) {
      // @ts-expect-error
      const hasDisabled = row.find(s => s === 'disabled');
      if (hasDisabled) {
        const hasNoOtherStatesBesidesDisabled = row.filter(Boolean).length === 1;
        return hasNoOtherStatesBesidesDisabled;
      }
      return true;
    }

    const filteredMappedMatrix = mappedMatrix.filter(excludeDisabledSiblingStates);

    this.__amountOfModifierCombinations =
      2 /* 2 for dark/light */ *
      filteredMappedMatrix.length *
      // @ts-expect-error
      variants.reduce((acc, curr) => curr.values.length * acc, 1);

    const allDemos = this.querySelectorAll('[slot*=_matrix-demo-]');

    for (const demo of Array.from(allDemos)) {
      demo.remove();
    }

    function updateClosedDialogState() {
      this._shouldShowModifierCombinationsMatrix = false;
    }

    return html`<dialog
      class="dialog"
      ${ref(this._matrixDialogRef)}
      style="z-index:1"
      @cancel="${updateClosedDialogState}"
      @close="${updateClosedDialogState}"
    >
      <div class="dialog__header">
        <button
          style="position: absolute; top: 12px; right: 12px;"
          @click="${() => {
            // @ts-expect-error
            this._matrixDialogRef?.value?.close();
          }}"
          class="tools-btn"
        >
          ${closeIcon}
        </button>
        <h1>Modifier Combinations (${this.__amountOfModifierCombinations})</h1>
        <p>
          This overview shows all possible combinations of modifiers (variants and/or states) that
          can be applied to a component. Use it as a reference during development and visual
          regression testing.
        </p>
      </div>

      ${this.renderCombiMatrix({
        theme: '',
        // @ts-expect-error
        variants,
        filteredMappedMatrix,
        modifiers,
      })}
      ${this.renderCombiMatrix({
        theme: 'dark',
        // @ts-expect-error
        variants,
        filteredMappedMatrix,
        modifiers,
      })}
    </dialog>`;
  }

  // N.B. the table below has aria roles applied, so that we can apply another layout module (display:flex|grid instead of display:table*)
  // without breaking the accessibility.

  /**
   * @param {{theme:''|'dark'}} opts
   */
  // @ts-expect-error
  renderCombiMatrix({ theme, variants, filteredMappedMatrix, modifiers }) {
    return variants.map(
      // @ts-expect-error
      variant =>
        html`<table role="table" class="permutatution-matrix-table">
          <caption class="sr-only">
            ${variant.name}
          </caption>
          <tr role="row">
            <td class="column-left" role="cell"></td>
            ${variant.values.map(
              // @ts-expect-error
              val => html`<th role="columnheader" scope="col">${val}</th>`,
            )}
          </tr>
          ${filteredMappedMatrix.map(
            // @ts-expect-error
            rowOfStateCombis =>
              html`<tr role="row">
                <th
                  class="column-left"
                  role="rowheader"
                  scope="row"
                  style="font-weight: normal; font-size: small;"
                >
                  ${rowOfStateCombis.filter(Boolean).map(
                    // @ts-expect-error
                    state => html`<pre>${state}</pre>`,
                  )}
                </th>
                ${variant.values.map(
                  // @ts-expect-error
                  val =>
                    html`<td role="cell">
                      ${this.renderModifierCombinationsDialogSingleDemo({
                        variantName: variant.name,
                        variantValue: val,
                        rowOfStateCombis,
                        modifiers,
                        theme,
                      })}
                    </td>`,
                )}
              </tr>`,
          )}
        </table>`,
    );
  }

  renderModifierCombinationsDialogSingleDemo({
    // @ts-expect-error
    variantName,
    // @ts-expect-error
    variantValue,
    // @ts-expect-error
    rowOfStateCombis,
    // @ts-expect-error
    modifiers,
    // @ts-expect-error
    theme,
  }) {
    const modelForThisDemo = {
      variants: [{ name: variantName, value: variantValue }],
      states: rowOfStateCombis,
    };
    const modifierMappers = this._modifierInterface?.mapToCode || [];

    const id = variantName + variantValue + theme + rowOfStateCombis.join('');
    const div = document.createElement('div');
    const renderTarget = div.attachShadow({ mode: 'open' });
    // @ts-expect-error
    render(html`<div slot="_matrix-demo-${id}">${this.story()}</div>`, renderTarget);
    const parentEl = renderTarget.firstElementChild;

    // @ts-expect-error
    this.appendChild(parentEl);
    requestAnimationFrame(() => {
      // @ts-expect-error
      const { el } = this.constructor._findDemoNode(parentEl);
      updateModifiersInDemo({
        model: modelForThisDemo,
        modifiers,
        demoEl: el,
        modifierMappers,
      });
      // appendAllIngWebStylesToRoot(renderTarget);
      const sheets = getSheetsForEl(el);
      // @ts-expect-error
      replaceInSheets(sheets, this.modifiers.states || []);
    });

    return html`<div data-theme="${theme}" class="matrix-individual-demo" data-darkmode-demo>
      <slot name="_matrix-demo-${id}"></slot>
    </div>`;
  }

  /**
   * Creates (more or less) an equivalent of a Figma component set.
   */
  renderModifierCombinator() {
    const { modifiers } = this;
    // @ts-expect-error
    const { variants, states } = modifiers;

    const model = this._modifierCombineModel;
    const demoRootEl = this._demoElNode;
    const modifierMappers = this._modifierInterface?.mapToCode || [];

    /**
     * @param {InputEvent & { target: HTMLInputElement }} event
     */
    function syncBackToModel(event) {
      const { form } = event.target;
      const nameOfChangedModifier = event.target.name;
      // const mo
      // @ts-expect-error
      const variantFound = model.variants.find(v => v.name === nameOfChangedModifier);
      if (variantFound) {
        // @ts-expect-error
        variantFound.value = getValFromRadioNodeList(form.elements[nameOfChangedModifier]);
        event.target.value;
      } else {
        model[nameOfChangedModifier] = getValFromRadioNodeList(
          // @ts-expect-error
          form.elements[nameOfChangedModifier],
        );
      }

      updateModifiersInDemo({ model, modifiers, demoEl: demoRootEl, modifierMappers });
    }

    return html`<div role="toolbar" class="modifier-combinator">
      <!-- <div class="icon-toolbar" role="toolbar">
        <button
          class="tools-btn"
          title="Reset to initial state"
          @click="${this._resetModifierCombineModel}"
        >
          ${resetIcon}
        </button>

        <button
          class="tools-btn"
          .title="${`Show all modifierCombinations (${this.__amountOfModifierCombinations})`}"
          aria-pressed="${this._shouldShowModifierCombinationsMatrix ? 'true' : 'false'}"
          @click="${() => {
        this._shouldShowModifierCombinationsMatrix = !this._shouldShowModifierCombinationsMatrix;
        this.updateComplete.then(() => {
          // @ts-expect-error
          this._matrixDialogRef.value?.showModal();
        });
      }}"
        >
          ${modifierCombineIcon}
        </button>
      </div> -->

      ${this._shouldShowModifierCombinationsMatrix
        ? html`<div>${this.renderModifierCombinationsDialog({ modifiers })}</div>`
        : nothing}

      <!-- <div @input="\${this._switchTheme}">
        \${this.renderSingleChoice({
          choices: this.isExpressive ? themes : themesBasic,
          name: 'Theme',
          modelV: this.themePref,
        })}
      </div> -->
      ${this.isExpressive
        ? html`
            <div @model-value-changed="${this._switchSurface}">
              ${this.renderSelect({
                choices: surfaces,
                name: 'Expressive surface',
                modelV: this.surfacePref,
              })}
            </div>
          `
        : nothing}
      <div @input="${this._switchMode}">
        ${this.renderSingleChoice({
          choices: modes,
          name: 'Mode',
          modelV: this.darkModePref,
        })}
      </div>
      <!-- TODO: enable when device tokens are in use -->
      <!-- <div @input="${this._switchDevice}">
        ${this.renderSingleChoice({
        choices: devices,
        name: 'Device',
        modelV: this.devicePref,
      })}
      </div> -->

      <form @input="${syncBackToModel}">
        ${variants?.length
          ? html` <fieldset>
              <legend>variants</legend>
              ${variants.map(
                ({
                  // @ts-expect-error
                  values,
                  name,
                }) =>
                  this.renderSingleChoice({
                    choices: values,
                    name,
                    // @ts-expect-error
                    modelV: model.variants.find(v => v.name === name)?.value,
                  }),
              )}
            </fieldset>`
          : nothing}
        ${states
          ? this.renderMultiChoice({ choices: states, name: 'states', modelV: model.states })
          : nothing}
      </form>
    </div>`;
  }

  renderToolbar() {
    const disableSizeForNow = true;

    return html`
      ${!disableSizeForNow && this.simulatorUrl
        ? html`
            <div class="platform-size-controls">${this.renderPlatform()} ${this.renderSize()}</div>
          `
        : ``}

      <div class="icon-toolbar" role="toolbar">
        <button
          class="tools-btn"
          .title="${`${this._shouldShowModifierCombinator ? 'close' : 'open'}  modifier settings`}"
          aria-pressed="${this._shouldShowModifierCombinator ? 'true' : 'false'}"
          @click="${() =>
            (this._shouldShowModifierCombinator = !this._shouldShowModifierCombinator)}"
        >
          ${settingsIcon}
        </button>

        <button
          class="tools-btn"
          .title="${`${this._shouldShowCodePreview ? 'close' : 'open'} code preview`}"
          aria-pressed="${this._shouldShowCodePreview ? 'true' : 'false'}"
          @click="${() => (this._shouldShowCodePreview = !this._shouldShowCodePreview)}"
        >
          ${codeIcon}
        </button>

        ${this.simulatorUrl
          ? html`
              <a
                class="tools-btn"
                href=${this.iframeUrl}
                target="_blank"
                rel="noopener"
                title="Open simulation in new window"
                >${externalDemoIcon}</a
              >
            `
          : nothing}
      </div>
    `;
  }

  renderCodeblock() {
    return html`<slot id="code-slot"></slot>
      <div class="icon-toolbar" role="toolbar">
        <!-- <button
          class="tools-btn"
          @click="${() => (this.__isDemoExpanded = !this.__isDemoExpanded)}"
          .title="${this.__isDemoExpanded ? 'relevant code' : 'all code'}"
        >
          ${this.__isDemoExpanded ? shrinkViewIcon : expandViewIcon}
        </button> -->
        <button
          class="tools-btn"
          @click="${this.onCopy}"
          ?hidden="${!(
            // @ts-expect-error
            this.__supportsClipboard
          )}"
          title="${
            // @ts-expect-error
            this.__copyButtonText
          }"
        >
          ${!this.__isCopying ? copyIcon : copiedCorrectlyFeedbackIcon}
        </button>
      </div>`;
  }

  render() {
    return html`
      <div class="demo-viewer card surface surface--neutral-subtle" id="wrapper">
        <div class="demo-viewer__section demo-viewer__section--modifier-combinator">
          ${this.renderToolbar()}
          ${this._shouldShowModifierCombinator ? this.renderModifierCombinator() : nothing}
        </div>
        <div class="demo-viewer__section demo-viewer__section--demo">
          <div class="demo-viewer__inner-section" data-darkmode-demo>
            <div class="demo-viewer__surface surface">
              <slot name="story"></slot>
            </div>
          </div>
        </div>
        ${this._shouldShowCodePreview
          ? html`<div class="demo-viewer__section demo-viewer__section--code">
              ${this.renderCodeblock()}
            </div>`
          : nothing}
      </div>
    `;
  }

  /**
   * @override
   * @param  {...any} args
   */
  // @ts-expect-error
  onCopy(...args) {
    // @ts-expect-error
    super.onCopy(...args);
    this.__isCopying = true;
    setTimeout(() => {
      this.__isCopying = false;
    }, 1000);
  }

  /**
   * @overridable
   * @extendable
   * @param {Element} candidateEl
   * @returns {boolean}
   */
  static _isLionEl(candidateEl) {
    const isLionTag = candidateEl.tagName.toLowerCase().startsWith('lion-');
    if (isLionTag) return true;
    const isIngTag = candidateEl.tagName.toLowerCase().startsWith('ing-');
    if (isIngTag) return true;
    return false;
  }

  /**
   * @overridable
   * @extendable
   * @param {Element} candidateEl
   * @returns {boolean}
   */
  static _isIngWebCssClassEl(candidateEl) {
    return ingCssClasses.some(ingClass =>
      // Since we don't follow strict BEM (e.g. we allow modifier
      // ".headline--secondary" without generic ".headline")
      Array.from(candidateEl.classList).find(c => c.startsWith(ingClass)),
    );
  }

  /**
   * @param {Element|ShadowRoot} lvlEl
   * @returns {{el:HTMLElement, name:string}}
   */
  static _findDemoNode(lvlEl) {
    const foundWc = this._recurseFindDemoNode(lvlEl, this._isLionEl);
    if (foundWc) {
      return { el: foundWc, name: foundWc.tagName.toLowerCase() };
    }
    const foundClassEl = this._recurseFindDemoNode(lvlEl, this._isIngWebCssClassEl);
    const name = Array.from(foundClassEl?.classList || []).find(c => ingCssClasses.includes(c));
    // @ts-expect-error
    return { el: foundClassEl, name };
  }

  /**
   * @param {Element|ShadowRoot} lvlEl
   * @param {(el: Element) => boolean} fn
   * @returns {HTMLElement|undefined}
   */
  static _recurseFindDemoNode(lvlEl, fn) {
    for (const c of Array.from(lvlEl.children)) {
      if (fn(c)) {
        return /** @type {HTMLElement} */ (c);
      } else {
        if (c.shadowRoot) {
          const result = this._recurseFindDemoNode(/** @type {ShadowRoot} */ (c.shadowRoot), fn);
          if (result) return result;
        }
        const result = this._recurseFindDemoNode(c, fn);
        if (result) return result;
      }
    }
  }

  __syncDemoDomBackToModel() {
    if (!this.__demoSyncPending) {
      requestAnimationFrame(() => {
        this._modifierCombineModel = getModelSyncedWithDemoDom({
          model: this._modifierCombineModel,
          modifiers: this.modifiers,
          demoEl: this.__demoElNode,
          modifierMappers: this._modifierInterface?.mapToCode,
        });
        this.__demoSyncPending = false;
      });
      this.__demoSyncPending = true;
    }
  }

  /**
   *
   * @param {HTMLElement} el
   * @param {HTMLElement} demoRootEl
   */
  _createSyncListeners(el, demoRootEl) {
    this.__syncDemoDomBackToModel = this.__syncDemoDomBackToModel.bind(this);

    if (demoRootEl?.addEventListener) {
      demoRootEl.addEventListener('model-value-changed', this.__syncDemoDomBackToModel);
      demoRootEl.addEventListener('opened-changed', this.__syncDemoDomBackToModel);
      demoRootEl.addEventListener('mousemove', this.__syncDemoDomBackToModel);
      // demoRootEl.addEventListener('blur', this.__syncDemoDomBackToModel);
      demoRootEl.addEventListener('focusin', this.__syncDemoDomBackToModel);
      demoRootEl.addEventListener('focusout', this.__syncDemoDomBackToModel);
      demoRootEl.addEventListener('change', this.__syncDemoDomBackToModel);
    }
    // @ts-expect-error
    if (el._inputNode?.form) {
      // @ts-expect-error
      el._inputNode.form.addEventListener('submit', this.__syncDemoDomBackToModel);
    }
  }

  /**
   * @protected
   */
  _initModifierCombinations() {
    const ctor = /** @type {typeof OJPreview} */ this.constructor;
    // @ts-expect-error
    const { el, name } = ctor._findDemoNode(this.lightDomRenderTarget);
    this.__demoElNode = el;
    this._modifierInterface =
      this.__demoElNode.constructor.getModifierInterface?.() ||
      cssClassModifierInterfaceRegistry[name];

    this.modifiers = this._modifierInterface?.designDefinitions || {};

    // @ts-expect-error
    const { variants = [], states = [] } = this.modifiers;

    if (ingCssClasses.includes(name)) {
      const sheets = getSheetsForEl(el, { strategy: 'css-component' });
      replaceInSheets(sheets, states);
    } else {
      const sheets = getSheetsForEl(el, { strategy: 'web-component' });
      replaceInSheets(sheets, states);
    }

    const initialModel = {
      // Enums. We assume here that default is also a variant, so there is no 'lack of variant'
      // @ts-expect-error
      variants: variants.map(v => ({ name: v.name, value: v.values[0] })),
      // Booleans. By default, no interaction is selected/visible
      states: [],
    };

    // Now, if the demo is preconfigured in a certain way, we need to update the model
    const updatedModel = getModelSyncedWithDemoDom({
      model: initialModel,
      modifiers: this.modifiers,
      demoEl: this.__demoElNode,
      modifierMappers: this._modifierInterface?.mapToCode,
    });

    // Here we save the initial model for a reset
    this.__initialModifierCombineModel = updatedModel;
    this._modifierCombineModel = updatedModel;

    // @ts-expect-error
    const demoRoot = this.lightDomRenderTarget.getRootNode().host;
    this._createSyncListeners(el, demoRoot);
    this.updateSurfaceNode();
  }

  _resetModifierCombineModel() {
    this._modifierCombineModel = { ...this.__initialModifierCombineModel };
  }

  /**
   * @param {{ target: { value: string; }; }} event
   */
  _switchTheme(event) {
    this.themePref = event.target.value;
  }

  /**
   * @param {{ target: { value: string; }; }} event
   */
  _switchSurface(event) {
    // @ts-expect-error
    this.surfacePref = event.target.modelValue;
  }

  /**
   * @param {{ target: { value: string; }; }} event
   */
  _switchDevice(event) {
    this.devicePref = event.target.value;
  }

  /**
   * @param {{ target: { value: string; }; }} event
   */
  _switchMode(event) {
    // @ts-expect-error
    this.darkModePref = event.target.value;
  }
}
