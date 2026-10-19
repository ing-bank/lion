import { LionCombobox } from '@lion/ui/combobox.js';
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { SlotMixin } from '@lion/ui/core.js';
import { LitElement, css } from 'lit';
import { LionOption } from '@lion/ui/listbox.js';
import { ValidationExtension } from './consumer-mixins.js';
import { Constructor } from '@open-wc/dedupe-mixin';
import { SlotHost } from '@lion/ui/types/core.js';
import { restorePhoneUtilManager } from '@lion/ui/input-tel-test-helpers.js';

type Assert<T extends true> = T;
type RestoreHelperHasNoParameters = Assert<
  Parameters<typeof restorePhoneUtilManager> extends [] ? true : false
>;

export function focusCombobox(combobox: LionCombobox): void {
  combobox.focus();
  combobox._focusableNode;
}

export class ConsumerCombobox extends LionCombobox {
  override get _focusableNode(): HTMLElement {
    return super._focusableNode;
  }
}

export class ConsumerSlots extends SlotMixin(LitElement) {
  override get slots() {
    return {
      ...super.slots,
      extra: () => document.createElement('span'),
    };
  }
}

// Reapplying the deduped mixin must preserve the existing constructor and accessor.
export const DedupedSlots: typeof ConsumerSlots = SlotMixin(ConsumerSlots);

export function preserveSlots<T extends Constructor<LitElement & SlotHost>>(base: T): T {
  return SlotMixin(base);
}

export function applySlots<T extends Constructor<LitElement>>(base: T) {
  return SlotMixin(base);
}

export class ConsumerGenericSlots extends applySlots(LitElement) {
  override get slots() {
    return { ...super.slots, extra: () => document.createElement('span') };
  }
}

export class ConsumerSelect extends SlotMixin(LionSelectRich) {
  override get slots() {
    return { ...super.slots, extra: () => document.createElement('span') };
  }
}

export class ConsumerOption extends LionOption {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          color: red;
        }
      `,
    ];
  }
}

class ExtensionBase extends LitElement {
  static extraStatic = 'retained';
  extraInstance = 'retained';
}

export class ConsumerValidation extends ValidationExtension(ExtensionBase) {}

export class ConsumerValidationSelect extends ValidationExtension(LionSelectRich) {
  override get slots() {
    return { ...super.slots, extra: () => document.createElement('span') };
  }
}

export const extraStatic: string = ConsumerValidation.extraStatic;
export const extraInstance: string = new ConsumerValidation().extraInstance;

export function genericSlotPrototype<T extends Constructor<LitElement>>(base: T): void {
  const extended = SlotMixin(base);
  extended.prototype.requestUpdate();
  const slots: SlotHost['slots'] = extended.prototype.slots;
  void slots;
}

class ConstructorBase extends LitElement {
  constructor(public label: string) {
    super();
  }
}

const SlottedConstructor = SlotMixin(ConstructorBase);
export const constructorLabel: string = new SlottedConstructor('retained').label;
export const prototypeLabel: string = SlottedConstructor.prototype.label;
