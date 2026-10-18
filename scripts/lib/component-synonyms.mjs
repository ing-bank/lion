/**
 * Per-component user descriptions + synonyms.
 *
 * Single source shared by:
 *  - the skill generator: the synonyms end up in the skill's component index, so a model can route a
 *    prompt that uses any of these words to the right component reference (measured: models guessed
 *    entrypoints; the routing in the index is what prevents that);
 *  - skill-tester's generated prompts: the goal is the user-facing DESCRIPTION only - the synonym list
 *    is routing data, not prompt content.
 */
export const COMPONENT_SYNONYMS = {
  accordion: { description: 'a vertically stacked set of interactive headings, each revealing a section of content', synonyms: ['accordion', 'expandable headings', 'disclosure sections'] },
  button: { description: 'a clickable button', synonyms: ['button', 'action button'] },
  calendar: { description: 'a calendar widget to pick a date', synonyms: ['calendar', 'date grid'] },
  'checkbox-group': { description: 'a group of checkboxes', synonyms: ['checkbox group', 'multiple choices'] },
  collapsible: { description: 'a section that expands and collapses', synonyms: ['collapsible', 'expandable section'] },
  combobox: { description: 'a text input with a dropdown list of suggestions', synonyms: ['combobox', 'autocomplete', 'dropdown input'] },
  dialog: { description: 'a modal window on top of the page', synonyms: ['dialog', 'modal', 'popup'] },
  drawer: { description: 'a panel that slides in from the side', synonyms: ['drawer', 'side panel', 'off-canvas'] },
  fieldset: { description: 'a labelled group of related fields', synonyms: ['fieldset', 'field group'] },
  form: { description: 'a form that manages its fields', synonyms: ['form', 'form wrapper'] },
  input: { description: 'a single-line text input', synonyms: ['input', 'text field'] },
  'input-amount': { description: 'a field for entering a monetary amount', synonyms: ['amount input', 'money field'] },
  'input-amount-dropdown': { description: 'an amount field with a currency selector', synonyms: ['amount with currency', 'currency amount input'] },
  'input-date': { description: 'a date input', synonyms: ['date input', 'date field'] },
  'input-datepicker': { description: 'a date input that opens a calendar picker', synonyms: ['datepicker', 'date picker field'] },
  'input-email': { description: 'an email address input', synonyms: ['email input', 'email field'] },
  'input-file': { description: 'a file upload control', synonyms: ['file input', 'file picker', 'upload'] },
  'input-iban': { description: 'an IBAN account number input', synonyms: ['IBAN field', 'bank account number input'] },
  'input-range': { description: 'a slider to pick a value in a range', synonyms: ['range slider', 'slider'] },
  'input-stepper': { description: 'a number input with increment and decrement buttons', synonyms: ['stepper', 'number stepper'] },
  'input-tel': { description: 'a telephone number input', synonyms: ['phone input', 'tel field'] },
  'input-tel-dropdown': { description: 'a phone input with a country-code selector', synonyms: ['phone with country code', 'tel dropdown'] },
  listbox: { description: 'a list of options with a single selection', synonyms: ['listbox', 'option list'] },
  menu: { description: 'a menu of items with keyboard navigation', synonyms: ['menu', 'dropdown menu'] },
  pagination: { description: 'page navigation controls', synonyms: ['pagination', 'pager', 'page numbers'] },
  'progress-indicator': { description: 'a progress indicator', synonyms: ['progress bar', 'spinner', 'loading indicator'] },
  'radio-group': { description: 'a group of radio buttons', synonyms: ['radio group', 'single choice'] },
  select: { description: 'a dropdown select', synonyms: ['select', 'dropdown'] },
  'select-rich': { description: 'a select with fully custom options', synonyms: ['rich select', 'custom dropdown'] },
  steps: { description: 'a multi-step progress indicator', synonyms: ['steps', 'step indicator', 'wizard steps'] },
  switch: { description: 'an on/off switch', synonyms: ['switch', 'toggle'] },
  tabs: { description: 'a set of tabs with panels', synonyms: ['tabs', 'tab panel'] },
  textarea: { description: 'a multi-line text input', synonyms: ['textarea', 'multi-line input'] },
  tooltip: { description: 'a small popup with extra information', synonyms: ['tooltip', 'hint popup'] },
};
