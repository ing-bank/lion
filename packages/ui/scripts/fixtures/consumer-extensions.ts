import { LionCombobox } from '@lion/ui/combobox.js';
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { SlotMixin } from '@lion/ui/core.js';
import { LitElement, css } from 'lit';
import { LionOption } from '@lion/ui/listbox.js';
import { ValidationExtension } from './consumer-mixins.js';
import { Constructor } from '@open-wc/dedupe-mixin';
import { SlotHost } from '@lion/ui/types/core.js';
import { restorePhoneUtilManager } from '@lion/ui/input-tel-test-helpers.js';
import { runComboboxSuite } from '@lion/ui/test-suites/combobox.js';
import { runDialogSuite } from '@lion/ui/test-suites/dialog.js';
import { runInteractionStateMixinSuite } from '@lion/ui/test-suites/form-core.js';
import { runInputRangeSuite } from '@lion/ui/test-suites/input-range.js';
import { runPaginationSuite } from '@lion/ui/test-suites/pagination.js';
import {
  runSelectInvokerSuite,
  runSelectRichInteractionSuite,
  runSelectRichSuite,
} from '@lion/ui/test-suites/select-rich.js';
import { runTooltipSuite } from '@lion/ui/test-suites/tooltip.js';

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

export function configureSharedSuites(): void {
  runComboboxSuite({
    showAllOnEmptyByDefault: true,
    displaysOptionLabel: true,
    opensOnInputClick: true,
    supportsRichOptionContent: false,
    getOptionTextNode: option => option,
  });
  runDialogSuite({ usesHeaderSlotForAccessibleName: true });
  runInteractionStateMixinSuite({ submittedFeedbackTypes: ['error', 'warning'] });
  runInputRangeSuite({
    configureMinMaxLabels: host => {
      host.noMinMaxLabels = false;
    },
  });
  runPaginationSuite({
    assertDisabled: node => {
      node.hasAttribute('aria-disabled');
    },
  });
  runSelectInvokerSuite({
    configureSelectedElement: option => {
      option.dataset.label = 'label';
    },
    assertSelectedContent: invoker => {
      invoker.textContent;
    },
    getAfterElement: invoker => invoker.shadowRoot?.querySelector('span') ?? null,
  });
  runSelectRichInteractionSuite({
    optionValue: value => String(value),
    supportsEmptyOption: false,
  });
  runSelectRichSuite({
    optionValue: value => String(value),
    getInvokerLabel: invoker => invoker.textContent ?? undefined,
    modalOverlay: true,
    invokerUsesModelValue: true,
    hidesOnOutsideClick: false,
    trapsKeyboardFocus: true,
    noSelectionReferenceWidth: 'none',
    selectedReferenceWidth: 'none',
  });
  runTooltipSuite({ arrowWidth: 16, defaultInvokerRelation: 'label' });
  // @ts-expect-error invalid relation
  runTooltipSuite({ defaultInvokerRelation: 'other' });
}
