import { runSelectRichInteractionSuite } from '../test-suites/lion-select-rich-interaction.suite.js';

runSelectRichInteractionSuite();

runSelectRichInteractionSuite({
  optionValue: value => String(value),
  supportsEmptyOption: false,
});
