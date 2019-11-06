export default {
  error: {
    required: 'Please enter a(n) {fieldName}.',
    equalsLength: 'Please enter a correct {fieldName} of exactly {validatorParams} characters.',
    minLength: 'Please enter a correct {fieldName} (at least {validatorParams} characters).',
    maxLength: 'Please enter a correct {fieldName} (up to {validatorParams} characters).',
    minMaxLength:
      'Please enter a correct {fieldName} (between {validatorParams.min} and {validatorParams.max} characters).',
    isNumber: 'Please enter a valid {fieldName}.',
    minNumber: 'Please enter a(n) {fieldName} higher than {validatorParams}.',
    maxNumber: 'Please enter a(n) {fieldName} lower than {validatorParams}.',
    minMaxNumber:
      'Please enter a(n) {fieldName} between {validatorParams.min} and {validatorParams.max}.',
    isDate: 'Please enter a valid date (DD/MM/YYYY).',
    minDate: 'Please enter a(n) {fieldName} after {validatorParams, date, YYYYMMDD}.',
    maxDate: 'Please enter a(n) {fieldName} before {validatorParams, date, YYYYMMDD}.',
    minMaxDate:
      'Please enter a {fieldName} between {validatorParams.min, date, YYYYMMDD} and {validatorParams.max, date, YYYYMMDD}.',
    isDateDisabled: 'This date is unavailable, please choose another one.',
    isEmail: 'Please enter a valid {fieldName} in the format "name@example.com".',
  },
  warning: {
    required: 'Please enter a(n) {fieldName}.',
    equalsLength: 'Please enter a correct {fieldName} of exactly {validatorParams} characters.',
    minLength: 'Please enter a correct {fieldName} (at least {validatorParams}).',
    maxLength: 'Please enter a correct {fieldName} (up to {validatorParams} characters).',
    minMaxLength:
      'Please enter a correct {fieldName} (between {validatorParams.min} and {validatorParams.max} characters).',
    isNumber: 'Please enter a valid {fieldName}.',
    minNumber: 'Please enter a(n) {fieldName} higher than {validatorParams}.',
    maxNumber: 'Please enter a(n) {fieldName} lower than {validatorParams}.',
    minMaxNumber:
      'Please enter a(n) {fieldName} between {validatorParams.min} and {validatorParams.max}.',
    isDate: 'lease enter a valid date (DD/MM/YYYY).',
    minDate: 'Please enter a(n) {fieldName} after {validatorParams, date, YYYYMMDD}.',
    maxDate: 'Please enter a(n) {fieldName} before {validatorParams, date, YYYYMMDD}.',
    minMaxDate:
      'Please enter a {fieldName} between {validatorParams.min, date, YYYYMMDD} and {validatorParams.max, date, YYYYMMDD}.',
    isDateDisabled: 'This date is unavailable, please choose another one.',
    isEmail: 'Please enter a valid {fieldName} in the format "name@example.com".',
  },
  success: {
    defaultOk: 'Okay',
    randomOk:
      'success.defaultOk,success.correct,success.succeeded,success.ok,success.thisIsRight,success.changed,success.okCorrect',
    correct: 'Correct',
    succeeded: 'Succeeded',
    ok: 'Ok!',
    thisIsRight: 'This is right.',
    changed: 'Changed!',
    okCorrect: 'Ok, correct.',
  },
};
