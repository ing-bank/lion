import { FormControlHost } from '../../src/FormControlMixin';
export { ValidationType } from '../../types/ValidateMixinTypes';

/**
 * The name under which validation results get registered. For convience and predictability, this
 * should always be the same as the constructor name (since it will be obfuscated in js builds,
 * we need to provide it separately).
 * @example
 * ```js
 * class MyValidator extends Validator {
 *   static validatorName = 'MyValidator';
 *   // etc...
 * }
 * ```
 */
export type ValidatorName = string;

/**
 * The first argument of the constructor, for instance 3 in `new MinLength(3)`. Will
 * be stored on Validator instance and passed to `execute` function
 */
export type ValidatorParam = any;

/**
 * The second argument of the constructor, for instance
 * `new MinLength(3, {getFeedbackMessage: async () => 'too long'})`.
 * Will be stored on Validator instance and passed to `execute` function
 */
export type ValidatorConfig = {
  getMessage?: (data: Partial<FeedbackMessageData>) => Promise<string | Element>;
  type?: ValidationType;
  node?: FormControlHost;
  fieldName?: string | Promise<string>;
};

/**
 * Output of the `execute` function that returns a validity outcome. When we need to shpw feedback,
 * it should return true, otherwise false. So when an error\info|warning|success message
 * needs to be shown, return true.
 * It's also possible to return an enum. Let's say that a phone number can have multiple
 * states: 'invalid-country-code' | 'too-long' | 'too-short'
 * Those states can be retrieved in the getMessage function.
 */
export type ValidatorOutcome = string | boolean;

/**
 * Data object that will be provided to `getMessage()` method
 */
export type FeedbackMessageData = {
  modelValue: any;
  /** Value configured in FormControl.fieldName. Contributes to accessible error messages */
  fieldName: string;
  name: ValidatorName;
  formControl: FormControlHost;
  type: ValidationType;
  /* Outcome of Validator.execute function. Can be a boolean (true) or enum */
  outcome: ValidatorOutcome;
  config: ValidatorConfig;
  params: ValidatorParam;
};
