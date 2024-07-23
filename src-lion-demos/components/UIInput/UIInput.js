import { html, nothing } from 'lit';
import { UIField } from '../UIField/UIField.js';

import {
  InteractionStateMixin,
  FormControlMixin,
  ValidateMixin,
  FormatMixin,
  FocusMixin,
} from '@lion/ui/form-core.js';

export class UIInputDirective extends UIPartDirective {
  setup(part, [context, name, localContext]) {
    const ctor = this.constructor;
    switch (name) {
      case 'root':
        ctor._setupRoot(part, { context, localContext });
        break;
      default:
        throw new Error(`Unknown part ${name}`);
    }
  }

  static _setupRoot({ element }, { context, localContext }) {
    assertPresentation(element);
    element.setAttribute('data-part', 'root');
    context.registerRef('root', element);
  }
}

export class UIInput extends UIField(
  InteractionStateMixin(FocusMixin(FormatMixin(ValidateMixin(SlotMixin(UIBaseElement))))),
) {
  static _partDirective = UIInputDirective;
  static tagName = 'ui-input';
}
