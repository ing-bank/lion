import { ResultValidator } from '../ResultValidator.js';

export class DefaultSuccess extends ResultValidator {
  constructor(...args) {
    super(...args);
    this.type = 'success';
  }

  // eslint-disable-next-line class-methods-use-this
  executeOnResults({ regularValidationResult, prevValidationResult }) {
    const errorOrWarning = v => v.type === 'error' || v.type === 'warning';
    const hasErrorOrWarning = !!regularValidationResult.filter(errorOrWarning).length;
    const prevHadErrorOrWarning = !!prevValidationResult.filter(errorOrWarning).length;
    return !hasErrorOrWarning && prevHadErrorOrWarning;
  }
}
