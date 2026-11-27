import { html } from 'lit';
import { LionCombobox } from '@lion/ui/combobox.js';
import { LionOption } from '@lion/ui/listbox.js';
import { runComboboxSuite } from '../test-suites/lion-combobox.suite.js';

runComboboxSuite();

class ShowAllCombobox extends LionCombobox {
  constructor() {
    super();
    this.showAllOnEmpty = true;
  }
}

runComboboxSuite({
  classes: { host: ShowAllCombobox },
  showAllOnEmptyByDefault: true,
  opensOnInputClick: true,
});

class LabelCombobox extends LionCombobox {
  /** @param {import('@lion/ui/listbox.js').LionOption} option */
  _getTextboxValueFromOption(option) {
    return option?.textContent?.trim() || super._getTextboxValueFromOption(option);
  }
}

runComboboxSuite({
  classes: { host: LabelCombobox },
  displaysOptionLabel: true,
});

class PlainLabelOption extends LionOption {
  static get properties() {
    return { ...super.properties, displayLabel: { type: String } };
  }

  constructor() {
    super();
    this.displayLabel = '';
  }

  render() {
    return html`${super.render()}<span id="option-label">${this.displayLabel}</span>`;
  }
}

/** @param {LionOption} option */
function optionLabel(option) {
  const label = option.shadowRoot?.querySelector('#option-label');
  if (!(label instanceof HTMLElement)) {
    throw new Error('Option label not found.');
  }
  return label;
}

class PlainLabelCombobox extends LionCombobox {
  /** @param {Element} option */
  _unhighlightMatchedOption(option) {
    super._unhighlightMatchedOption(option instanceof LionOption ? optionLabel(option) : option);
  }

  /** @param {LionOption} option @param {string} matchingString */
  _onFilterMatch(option, matchingString) {
    this._highlightMatchedOption(optionLabel(option), matchingString);
    Object.assign(option.style, { display: '' });
  }

  /** @param {LionOption} option */
  _onFilterUnmatch(option) {
    this._unhighlightMatchedOption(optionLabel(option));
    Object.assign(option.style, { display: 'none' });
  }
}

runComboboxSuite({
  classes: { host: PlainLabelCombobox, option: PlainLabelOption },
  supportsRichOptionContent: false,
  configureOption(option, label) {
    if (!(option instanceof PlainLabelOption)) {
      throw new Error('Expected a plain-label option.');
    }
    Object.assign(option, { displayLabel: label });
  },
  getOptionTextNode: optionLabel,
});
