export default {
  error: {
    required: '{fieldName} muss ausgefüllt werden.',
    equalsLength:
      'Geben Sie einen korrekten Wert für {fieldName} mit exakt {validatorParams} Zeichen ein.',
    minLength: 'Du musst mindestens {validatorParams} Zeichen eingeben.',
    maxLength: 'Du kannst maximal {validatorParams} Zeichen eingeben.',
    minMaxLength:
      'Du musst zwischen {validatorParams.min} und {validatorParams.max} Zeichen eingeben.',
    isNumber: 'Geben Sie ein gültiges {fieldName} ein.',
    minNumber: 'Geben Sie für {fieldName} einen Wert über {validatorParams} ein.',
    maxNumber: 'Geben Sie für {fieldName} einen Wert unter {validatorParams} ein.',
    minMaxNumber:
      'Geben Sie für {fieldName} einen Wert zwischen {validatorParams.min} und {validatorParams.max} ein.',
    isDate: 'Bitte geben Sie ein gültiges Datum ein (TT.MM.JJJJ).',
    minDate:
      'Geben Sie für {fieldName} einen Wert ein, der nach {validatorParams, date, YYYYMMDD} liegt.',
    maxDate:
      'Geben Sie für {fieldName} einen Wert ein, der vor {validatorParams, date, YYYYMMDD} liegt.',
    minMaxDate:
      'Geben Sie für {fieldName} einen Wert zwischen {validatorParams.min, date, YYYYMMDD} und {validatorParams.max, date, YYYYMMDD} ein.',
    isDateDisabled: 'Dieses Datum ist nicht verfügbar, bitte wählen Sie ein anderes Datum.',
    isEmail: 'Geben Sie einen gültige {fieldName} im Format „name@example.com“ ein.',
  },
  warning: {
    required: '{fieldName} sollte ausgefüllt werden.',
    equalsLength:
      'Geben Sie einen korrekten Wert für {fieldName} mit exakt {validatorParams} Zeichen ein.',
    minLength: 'Du solltest mindestens {validatorParams} Zeichen eingeben.',
    maxLength: 'Du kannst maximal {validatorParams} Zeichen eingeben.',
    minMaxLength:
      'Du solltest zwischen {validatorParams.min} und {validatorParams.max} Zeichen eingeben.',
    isNumber: 'Geben Sie ein gültiges {fieldName} ein.',
    minNumber: 'Geben Sie für {fieldName} einen Wert über {validatorParams} ein.',
    maxNumber: 'Geben Sie für {fieldName} einen Wert unter {validatorParams} ein.',
    minMaxNumber:
      'Geben Sie für {fieldName} einen Wert zwischen {validatorParams.min} und {validatorParams.max} ein.',
    isDate: 'Bitte geben Sie ein gültiges Datum ein (TT.MM.JJJJ).',
    minDate:
      'Geben Sie für {fieldName} einen Wert ein, der nach {validatorParams, date, YYYYMMDD} liegt.',
    maxDate:
      'Geben Sie für {fieldName} einen Wert ein, der vor {validatorParams, date, YYYYMMDD} liegt.',
    minMaxDate:
      'Geben Sie für {fieldName} einen Wert zwischen {validatorParams.min, date, YYYYMMDD} und {validatorParams.max, date, YYYYMMDD} ein.',
    isDateDisabled: 'Dieses Datum ist nicht verfügbar, bitte wählen Sie ein anderes Datum.',
    isEmail: 'Geben Sie einen gültige {fieldName} im Format „name@example.com“ ein.',
  },
  success: {
    defaultOk: 'OK',
    randomOk:
      'success.defaultOk,success.correct,success.succeeded,success.ok,success.thisIsRight,success.changed,success.okCorrect',
    correct: 'Richtig',
    succeeded: 'Erfolgreich',
    ok: 'OK!',
    thisIsRight: 'Das ist richtig.',
    changed: 'Geändert',
    okCorrect: 'OK, richtig.',
  },
};
