import { LionCombobox } from '@lion/ui/combobox.js';
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { SlotMixin } from '@lion/ui/core.js';
import { LitElement } from 'lit';
import { Constructor } from '@open-wc/dedupe-mixin';
import { SlotHost } from '@lion/ui/types/core.js';

export function focusCombobox(combobox: LionCombobox): void {
  combobox.focus();
  // @ts-expect-error The focusable node is a protected subclass extension point.
  combobox._focusableNode;
}

export class ConsumerCombobox extends LionCombobox {
  protected override get _focusableNode(): HTMLElement {
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
