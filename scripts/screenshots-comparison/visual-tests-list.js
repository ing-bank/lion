/**
 * This is a manual copy of all generated visual tests that are created by `scripts/screenshots-comparison/generate-demo-visual-tests.js`.
 * The reaason for having this list is to be able easily exclude buggy tests and include only a subset.
 * The time for running all tests might be too high at generated the moment
 */

export const generatedTestsPaths = [
  // '.tmp/generated-visual-tests/accordion--overview.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/accordion--use-cases.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/account-selector--overview.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/account-selector--web.generated.visual.test.js', // ok
  // '.tmp/generated-visual-tests/action-menu--web.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/amount-view--web.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/blob--overview.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/blob--use-cases.generated.visual.test.js', // ok
  // '.tmp/generated-visual-tests/bottom-sheet--web.generated.visual.test.js', // ok
  `.tmp/generated-visual-tests/button--web.generated.visual.test.js`, // ok
  // '.tmp/generated-visual-tests/calendar--overview.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/calendar--use-cases.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/card--overview.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/card--use-cases.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/checkbox-group--overview.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/checkbox-group--web.generated.visual.test.js', // to fails
  // '.tmp/generated-visual-tests/chip-choice--overview.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/chip-choice--web.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/chip-filter--web.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/chip-input--web.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/collapsible--overview.generated.visual.test.js', // todo no states?
  // '.tmp/generated-visual-tests/collapsible--use-cases.generated.visual.test.js', // fails
  // '.tmp/generated-visual-tests/combobox--web.generated.visual.test.js', // todo add open?
  // `.tmp/generated-visual-tests/dialog--overview.generated.visual.test.js`, // ok
  // '.tmp/generated-visual-tests/dialog--web.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/drawer--web.generated.visual.test.js', // ok. Todo: disable animation for checkbox. "menu" case
  // '.tmp/generated-visual-tests/fieldset--overview.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/fieldset--use-cases.generated.visual.test.js', //ok
  // '.tmp/generated-visual-tests/file-upload--web.generated.visual.test.js', // run fails
  // '.tmp/generated-visual-tests/form--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/form--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/headline--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/headline--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/icon--accessibility.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/icon--catalog.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/icon--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/icon-button--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/illustration--catalog.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/image--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/image--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/inline-notification--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/inline-notification--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-amount--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-amount--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-amount-dropdown--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-amount-dropdown--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-date--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-date--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-datepicker--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-datepicker--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-email--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-email--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-iban--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-iban--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-stepper--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-stepper--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-telephone--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/input-telephone--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/link--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/link--use-cases.generated.visual.test.js', // run fails
  // '.tmp/generated-visual-tests/link-list--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/link-list--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/list-checkmark--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/list-checkmark--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/list-ordered--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/list-ordered--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/list-unordered--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/list-unordered--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/loading-spinner--overview.generated.visual.test.js', // run ok . note: skip. Animation only
  // '.tmp/generated-visual-tests/loading-spinner--use-cases.generated.visual.test.js', // run ok . note: skip. Animation only
  // '.tmp/generated-visual-tests/logo--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/notification-badge--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/notification-badge--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/pagination--web.generated.visual.test.js', // run fails
  // '.tmp/generated-visual-tests/paragraph--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/paragraph--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/popover-sheet--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/popover-sheet--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/progress-bar--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/radio-group--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/radio-group--web.generated.visual.test.js', // run fails
  // '.tmp/generated-visual-tests/segmented-control--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/segmented-control--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/select--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/select--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/slider--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/slider--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/snackbar--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/snackbar--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/step-navigator--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/steps--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/steps--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/switch--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/switch--web.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/table--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/table--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/tabs--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/tabs--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/textarea--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/textarea--use-cases.generated.visual.test.js', // run fails
  // '.tmp/generated-visual-tests/tooltip--overview.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/tooltip--use-cases.generated.visual.test.js', // run ok
  // '.tmp/generated-visual-tests/video-player--overview.generated.visual.test.js', // run ok. Note: skip. nothing useful to screenshot
  // '.tmp/generated-visual-tests/video-player--use-cases.generated.visual.test.js', // run ok. Note: skip. nothing useful to screenshot
];
