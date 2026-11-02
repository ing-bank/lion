import { AsyncDirective } from 'lit/async-directive.js';

/**
 * @typedef {import('./UIBaseElementTypes.js').TemplateContext} TemplateContext
 * @typedef {import('lit').ElementPart} ElementPart
 *
 * @typedef {Object} PartDefinition
 * @property {boolean} [optional]
 * @property {string} role
 * @property {string} [description]
 */

export class UIPartDirective extends AsyncDirective {
  render() {
    throw new Error('Method not implemented.');
  }

  /** @type {any} */
  host;

  #hasAlreadySetup = false;

  /** @type {Record<string, PartDefinition>} */
  parts = { root: { optional: false, role: 'presentation' } };

  // first updated
  /** @type {Record<keyof UIPartDirective['parts'], (part: ElementPart, context: { context: TemplateContext, localContext: any }) => void>} */
  setupFunctions = {};

  /** @type {Record<keyof UIPartDirective['parts'], (part: ElementPart, context: { context: TemplateContext, localContext: any }) => void>} */
  updateFunctions = {};

  /**
   *
   * @param {ElementPart} part
   * @param {[TemplateContext, keyof UIPartDirective['parts'], any]} params
   */
  update(part, [context, name, localContext]) {
    if (!Object.keys(this.parts).includes(name)) {
      throw new Error(`[UIPartDirective setup] Unknown part ${name}`);
    }

    this.host = part.options?.host;
    if (!this.#hasAlreadySetup) {
      part.element.setAttribute('data-part', name);
      context.registerRef(name, part.element);
      if (this.setupFunctions[name]) {
        this.setupFunctions[name](part, { context, localContext });
      }
      this.#hasAlreadySetup = true;
    }

    // throw new Error(`[UIPartDirective update] Unknown part ${name}`);
    this.updateFunctions[name]?.(part, { context, localContext });
  }
}

// eslint-disable-next-line arrow-body-style

/**
 * @template {typeof UIPartDirective} T
 *
 * Creates a part directive function with values typed based on the part name and its valuesType definition.
 * Different parts can expect different value structures via their valuesType property.
 *
 * @example
 * // Define a custom directive with typed parts:
 * class MyDirective extends UIPartDirective {
 *   parts = {
 *     root: { required: true, role: 'presentation', valuesType: {} },
 *     nav: { required: true, role: 'navigation', valuesType: { localData: String } },
 *     menu: { required: false, role: 'menu', valuesType: { items: Array, onSelect: Function } }
 *   }
 * }
 *
 * const part = createPartDirective(MyDirective, context);
 * // part('root') expects no values
 * // part('nav', { localData: 'yes' }) expects localData
 * // part('menu', { items: [...], onSelect: () => {} }) expects items and onSelect
 * html`<div ${part('root')}><nav ${part('nav', { localData: 'yes'})}></nav></div>`
 *
 * @param {T} ctor - The directive constructor class
 * @param {TemplateContext} context - The template context
 * @returns {(name: keyof InstanceType<T>['parts'], localContext: any) => {_$litDirective$: T, values: [TemplateContext, keyof InstanceType<T>['parts'], any]}}
 */
export function createPartDirective(ctor, context) {
  return (name, localContext) => ({
    // This property needs to remain unminified.
    _$litDirective$: ctor,
    values: [context, name, localContext],
  });
}
