import { html, nothing } from 'lit';
import { UIBaseElement } from '../components/shared/UIBaseElement.js';
import { UIPartDirective } from '../components/shared/UIPartDirective.js';
import { assertPresentation } from '../components/shared/element-assertions.js';

export class UILoginPagePartDirective extends UIPartDirective {
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

/**
 */
export class UILoginPage extends UIBaseElement {
  static _partDirective = UILoginPagePartDirective;

  static tagName = 'ui-login-page';

  /** @type {any} */
  static properties = {};
}
