import { LionSelectInvoker, LionSelectRich } from '@lion/ui/select-rich.js';
import { withModalDialogConfig } from '@lion/ui/overlays.js';
import { runSelectRichSuite } from '../test-suites/lion-select-rich.suite.js';

runSelectRichSuite();

runSelectRichSuite({ optionValue: value => String(value) });

class ValueSelectInvoker extends LionSelectInvoker {
  _contentTemplate() {
    const value = this.selectedElement?.modelValue?.value;
    if (typeof value !== 'string') {
      return super._contentTemplate();
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}

class ValueSelect extends LionSelectRich {
  static get scopedElements() {
    return { ...super.scopedElements, 'lion-select-invoker': ValueSelectInvoker };
  }
}

runSelectRichSuite({
  classes: { host: ValueSelect },
  invokerUsesModelValue: true,
  getInvokerLabel: invoker =>
    invoker.shadowRoot?.querySelector('#content-wrapper')?.textContent?.trim(),
});

class ModalSelect extends LionSelectRich {
  /** @returns {import('@lion/ui/types/overlays.js').OverlayConfig & {visibilityTriggerFunction: undefined}} */
  _defineOverlayConfig() {
    return {
      ...super._defineOverlayConfig(),
      ...withModalDialogConfig(),
      inheritsReferenceWidth: 'none',
      visibilityTriggerFunction: undefined,
      hidesOnOutsideClick: false,
    };
  }

  _noDefaultSelectedInheritsWidth() {}

  _setupOverlayCtrl() {
    super._setupOverlayCtrl();
    this._overlayCtrl.contentNode.setAttribute('aria-modal', 'true');
  }

  /** @param {import('lit').PropertyValues} changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    this._invokerNode.removeAttribute('aria-expanded');
  }
}

runSelectRichSuite({
  classes: { host: ModalSelect },
  modalOverlay: true,
  trapsKeyboardFocus: true,
  hidesOnOutsideClick: false,
  noSelectionReferenceWidth: 'full',
  selectedReferenceWidth: 'full',
});

class FixedWidthModalSelect extends ModalSelect {
  _noDefaultSelectedInheritsWidth() {
    this._overlayCtrl.updateConfig({ inheritsReferenceWidth: 'none' });
  }
}

runSelectRichSuite({
  classes: { host: FixedWidthModalSelect },
  modalOverlay: true,
  trapsKeyboardFocus: true,
  hidesOnOutsideClick: false,
});
