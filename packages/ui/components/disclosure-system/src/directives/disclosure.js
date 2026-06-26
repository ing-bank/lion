/* eslint-disable max-classes-per-file */
import { DisclosureController } from '@lion/ui/disclosure-system.js';
import { directive, Directive } from 'lit/directive.js';

// N.B. or should the controller do the housekeeping?
/** @type {WeakMap<Element, DisclosureController>} */
export const disclosureCtrlRegistry = new WeakMap();

class DisclosureDirective extends Directive {
  render() {
    throw new Error('Method not implemented.');
  }

  /**
   * @type {DisclosureController | null}
   */
  #disclosureCtrl = null;

  /**
   * @param {import('lit/directive.js').ElementPart} part
   * @param {any[]} params
   */
  update(part, [openableConfig]) {
    if (!this.#disclosureCtrl) {
      const contentNode = /** @type {HTMLElement} */ (part.element);
      // N.B. this is the first chance we get to access the contentNode, so the first time we can register
      this.#disclosureCtrl = new DisclosureController({
        ...openableConfig,
        requireConnectedNodes: false,
        contentNode,
      });
      disclosureCtrlRegistry.set(contentNode, this.#disclosureCtrl);
    } else {
      this.#disclosureCtrl.updateConfig({
        invokerNode: this.#disclosureCtrl.invokerNode,
        ...openableConfig,
      });
    }
  }
}

class DisclosureInvokerForDirective extends Directive {
  render() {
    throw new Error('Method not implemented.');
  }

  #hasAddedInvokerToCtrl = false;
  #hasTaskQueued = false;

  /**
   * @param {import('lit/directive.js').ElementPart} part
   * @param {any[]} params
   */
  update(part, [openableId]) {
    if (this.#hasAddedInvokerToCtrl || this.#hasTaskQueued) return;

    this.#hasTaskQueued = true;
    // We queue a microtask to make sure our sibling content has registered (or had a chance to)
    // TODO: support async renders and watch new registry entries for id match
    queueMicrotask(() => {
      const invokerNode = /** @type {HTMLElement} */ (part.element);
      // First, find the rootnode of part.element, as the invoker and content might not be in the same shadow root
      const rootNode = invokerNode.getRootNode();
      // @ts-ignore
      const contentNode = rootNode.getElementById(openableId);

      if (!contentNode) {
        // eslint-disable-next-line no-console
        console.warn(
          `[OpenableInvokerForDirective] No content found for openable with id "${openableId}"`,
        );
        return;
      }
      const disclosureCtrl = disclosureCtrlRegistry.get(contentNode);
      if (!disclosureCtrl) {
        // eslint-disable-next-line no-console
        console.warn(
          `[OpenableInvokerForDirective] No openable controller found for content with id "${openableId}"`,
        );
        return;
      }
      disclosureCtrl.updateConfig({ invokerNode });
      this.#hasAddedInvokerToCtrl = true;
      this.#hasTaskQueued = false;
    });
  }
}

// comparable to popover
export const disclosure = directive(DisclosureDirective);
// comparable to popovertarget
export const disclosureInvokerFor = directive(DisclosureInvokerForDirective);
