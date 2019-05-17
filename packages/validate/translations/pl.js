export default {
  error: {
    required: 'Proszę również podać wartość {fieldName}.',
    equalsLength:
      'Wprowadź prawidłową wartość w polu {fieldName} (maks. liczba znaków: {validatorParams}).',
    minLength:
      'Proszę podać prawidłową wartość {fieldName} (co najmniej {validatorParams} znaków).',
    maxLength: 'Proszę podać prawidłową wartość {fieldName} (maks. {validatorParams} znaków).',
    minMaxLength:
      'Proszę podać prawidłową wartość {fieldName} (od {validatorParams.min} do {validatorParams.max} znaków).',
    isNumber: 'Wprowadź prawidłową wartość w polu {fieldName}.',
    minNumber: 'Proszę podać wartość {fieldName} większą niż {validatorParams}.',
    maxNumber: 'Proszę podać wartość {fieldName} mniejszą niż {validatorParams}.',
    minMaxNumber:
      'Proszę podać wartość {fieldName} o długości od {validatorParams.min} do {validatorParams.max}.',
    isDate: 'Wprowadź datę (DD MM RRRR).',
    minDate: 'Proszę podać wartość {fieldName} przypadającą po {validatorParams, date, YYYYMMDD}.',
    maxDate:
      'Proszę podać wartość {fieldName} przypadającą przed {validatorParams, date, YYYYMMDD}.',
    minMaxDate:
      'Proszę podać wartość {fieldName} między {validatorParams.min, date, YYYYMMDD} a {validatorParams.max, date, YYYYMMDD}.',
    isDateDisabled: 'Ta data jest niedostępna, wybierz inną.',
    isEmail: 'Proszę podać prawidłowy {fieldName} w formacie „nazwa@example.com”.',
  },
  warning: {
    required: 'Proszę również podać wartość {fieldName}.',
    equalsLength:
      'Wprowadź prawidłową wartość w polu {fieldName} (maks. liczba znaków: {validatorParams}).',
    minLength:
      'Proszę podać prawidłową wartość {fieldName} (co najmniej {validatorParams} znaków).',
    maxLength: 'Proszę podać prawidłową wartość {fieldName} (maks. {validatorParams} znaków).',
    minMaxLength:
      'Proszę podać prawidłową wartość {fieldName} (od {validatorParams.min} do {validatorParams.max} znaków).',
    isNumber: 'Wprowadź prawidłową wartość w polu {fieldName}.',
    minNumber: 'Proszę podać wartość {fieldName} większą niż {validatorParams}.',
    maxNumber: 'Proszę podać wartość {fieldName} mniejszą niż {validatorParams}.',
    minMaxNumber:
      'Proszę podać wartość {fieldName} o długości od {validatorParams.min} do {validatorParams.max}.',
    isDate: 'Wprowadź datę (DD MM RRRR).',
    minDate: 'Proszę podać wartość {fieldName} przypadającą po {validatorParams, date, YYYYMMDD}.',
    maxDate:
      'Proszę podać wartość {fieldName} przypadającą przed {validatorParams, date, YYYYMMDD}.',
    minMaxDate:
      'Proszę podać wartość {fieldName} między {validatorParams.min, date, YYYYMMDD} a {validatorParams.max, date, YYYYMMDD}.',
    isDateDisabled: 'Ta data jest niedostępna, wybierz inną.',
    isEmail: 'Proszę podać prawidłowy {fieldName} w formacie „nazwa@example.com”.',
  },
  success: {
    defaultOk: 'Ok',
    randomOk:
      'success.defaultOk,success.correct,success.succeeded,success.ok,success.thisIsRight,success.changed,success.okCorrect',
    correct: 'Prawidłowo',
    succeeded: 'Zakończone pomyślnie',
    ok: 'Ok!',
    thisIsRight: 'Zgadza się.',
    changed: 'Zmieniono!',
    okCorrect: 'Tak, zgadza się.',
  },
};
