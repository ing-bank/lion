import { Constructor } from '@open-wc/dedupe-mixin';
import { TemplateResult, LitElement } from 'lit';

export { Constructor };

export type SlotItem = { name: string; template: () => TemplateResult; host?: HTMLElement };

export declare class LightRenderHost {
  /**
   * All slots that should be rendered to light dom instead of shadow dom
   */
  public slots: SlotItem[];

  /**
   * Useful to decide if a given slot should be manipulated depending on if it was auto generated
   * or not.
   *
   * @param {string} slotName Name of the slot
   * @returns {boolean} true if given slot name been created by SlotMixin
   */
  protected _isPrivateSlot(slotName: string): boolean;
}


// declare function LightRenderMixinImplementation<T extends Constructor<LitElement>>(
//   superclass: T,
// ): T &
//   Constructor<LightRenderHost> &
//   Pick<typeof LightRenderHost, keyof typeof LightRenderHost> &
//   Pick<typeof LitElement, keyof typeof LitElement>;

// export type LightRenderMixin = typeof LightRenderMixinImplementation;