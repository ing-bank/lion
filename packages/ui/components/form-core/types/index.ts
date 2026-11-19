import { LionField } from '../src/LionField.js';
import { LionValidationFeedback } from '../src/validate/LionValidationFeedback.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-field': LionField;
    'lion-validation-feedback': LionValidationFeedback;
  }
}

export * from './FocusMixinTypes.js';
export * from './FormatMixinTypes.js';
export * from './FormControlMixinTypes.js';
export * from './InteractionStateMixinTypes.js';
export * from './NativeTextFieldMixinTypes.js';
export * from './choice-group/index.js';
export * from './form-group/index.js';
export * from './registration/index.js';
export * from './utils/index.js';
export * from './validate/index.js';
export { LionField, LionValidationFeedback };
