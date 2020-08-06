export default {
  error: {
    Required: 'Please enter a(n) {fieldName}.',
    EqualsLength: 'Please enter a correct {fieldName} of exactly {params} characters.',
    MinLength: 'Please enter a correct {fieldName} (at least {params} characters).',
    MaxLength: 'Please enter a correct {fieldName} (up to {params} characters).',
    MinMaxLength:
      'Please enter a correct {fieldName} (between {params.min} and {params.max} characters).',
    Pattern: 'Please enter a valid {fieldName}',
    IsNumber: 'Please enter a valid {fieldName}.',
    MinNumber: 'Please enter a(n) {fieldName} higher than {params}.',
    MaxNumber: 'Please enter a(n) {fieldName} lower than {params}.',
    MinMaxNumber: 'Please enter a(n) {fieldName} between {params.min} and {params.max}.',
    IsDate: 'Please enter a valid date (DD/MM/YYYY).',
    MinDate: 'Please enter a(n) {fieldName} after {params, date, YYYYMMDD}.',
    MaxDate: 'Please enter a(n) {fieldName} before {params, date, YYYYMMDD}.',
    MinMaxDate:
      'Please enter a {fieldName} between {params.min, date, YYYYMMDD} and {params.max, date, YYYYMMDD}.',
    IsDateDisabled: 'This date is unavailable, please choose another one.',
    IsEmail: 'Please enter a valid {fieldName} in the format "name@example.com".',
  },
  warning: {
    Required: 'Please enter a(n) {fieldName}.',
    EqualsLength: 'Please enter a correct {fieldName} of exactly {params} characters.',
    MinLength: 'Please enter a correct {fieldName} (at least {params}).',
    MaxLength: 'Please enter a correct {fieldName} (up to {params} characters).',
    MinMaxLength:
      'Please enter a correct {fieldName} (between {params.min} and {params.max} characters).',
    IsNumber: 'Please enter a valid {fieldName}.',
    MinNumber: 'Please enter a(n) {fieldName} higher than {params}.',
    MaxNumber: 'Please enter a(n) {fieldName} lower than {params}.',
    MinMaxNumber: 'Please enter a(n) {fieldName} between {params.min} and {params.max}.',
    IsDate: 'lease enter a valid date (DD/MM/YYYY).',
    MinDate: 'Please enter a(n) {fieldName} after {params, date, YYYYMMDD}.',
    MaxDate: 'Please enter a(n) {fieldName} before {params, date, YYYYMMDD}.',
    MinMaxDate:
      'Please enter a {fieldName} between {params.min, date, YYYYMMDD} and {params.max, date, YYYYMMDD}.',
    IsDateDisabled: 'This date is unavailable, please choose another one.',
    IsEmail: 'Please enter a valid {fieldName} in the format "name@example.com".',
  },
  success: {
    DefaultOk: 'Okay',
    RandomOk:
      'success.DefaultOk,success.Correct,success.Succeeded,success.Ok,success.ThisIsRight,success.Changed,success.OkCorrect',
    Correct: 'Correct',
    Succeeded: 'Succeeded',
    Ok: 'Ok!',
    ThisIsRight: 'This is right.',
    Changed: 'Changed!',
    OkCorrect: 'Ok, correct.',
  },
  defaultSubject: {
    fieldName: 'value',
    article: 'a',
  },
  defaultNeutralArticle: 'a(n)',
};
