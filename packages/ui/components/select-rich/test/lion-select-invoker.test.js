import { html } from 'lit';
import { expect } from '@open-wc/testing';
import { LionSelectInvoker } from '@lion/ui/select-rich.js';
import { runSelectInvokerSuite } from '../test-suites/lion-select-invoker.suite.js';

runSelectInvokerSuite();

class CustomSelectInvoker extends LionSelectInvoker {
  _contentTemplate() {
    return this.selectedElement?.dataset.testLabel || '';
  }

  _afterTemplate() {
    return html`${!this.singleOption ? html`<span id="custom-after"></span>` : ''}`;
  }
}

runSelectInvokerSuite({
  classes: { host: CustomSelectInvoker },
  configureSelectedElement(option, scenario) {
    Object.assign(option.dataset, {
      testLabel: scenario === 'children' ? 'Complex label' : 'Plain label',
    });
  },
  assertSelectedContent(invoker, scenario) {
    expect(invoker._contentWrapperNode?.textContent).to.equal(
      scenario === 'children' ? 'Complex label' : 'Plain label',
    );
  },
  getAfterElement(invoker) {
    return invoker.shadowRoot?.querySelector('#custom-after') ?? null;
  },
});
