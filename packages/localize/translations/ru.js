export default {
  error: {
    required: 'Введите значение поля {fieldName}.',
    equalsLength: 'Введите корректное значение поля {fieldName} — ровно {validatorParams} симв.',
    minLength: 'Введите корректное значение поля {fieldName} (не менее {validatorParams}).',
    maxLength: 'Введите корректное значение поля {fieldName} (до {validatorParams} симв.).',
    minMaxLength:
      'Введите корректное значение поля {fieldName} (от {validatorParams.min} до {validatorParams.max} симв.).',
    isNumber: 'Введите действительное значение поля {fieldName}.',
    minNumber: 'Введите значение поля {fieldName}, превышающее {validatorParams}.',
    maxNumber: 'Введите значение поля {fieldName} меньше, чем {validatorParams}.',
    minMaxNumber:
      'Введите значение поля {fieldName} от {validatorParams.min} до {validatorParams.max}.',
    isDate: 'Введите дату (ДД ММ ГГГГ).',
    minDate: 'Введите значение поля {fieldName}, превышающее {validatorParams, date, YYYYMMDD}.',
    maxDate: 'Введите значение поля {fieldName} до {validatorParams, date, YYYYMMDD}.',
    minMaxDate:
      'Введите значение поля {fieldName} от {validatorParams.min, date, YYYYMMDD} до {validatorParams.max, date, YYYYMMDD}.',
    isDisabledDate: 'Эта дата недоступна, выберите другой вариант.',
    isEmail: 'Введите действительное значение поля {fieldName} в формате «name@example.com».',
  },
  warning: {
    required: 'Введите значение поля {fieldName}.',
    equalsLength: 'Введите корректное значение поля {fieldName} — ровно {validatorParams} симв.',
    minLength: 'Введите корректное значение поля {fieldName} (не менее {validatorParams}).',
    maxLength: 'Введите корректное значение поля {fieldName} (до {validatorParams} симв.).',
    minMaxLength:
      'Введите корректное значение поля {fieldName} (от {validatorParams.min} до {validatorParams.max} симв.).',
    isNumber: 'Введите действительное значение поля {fieldName}.',
    minNumber: 'Введите значение поля {fieldName}, превышающее {validatorParams}.',
    maxNumber: 'Введите значение поля {fieldName} меньше, чем {validatorParams}.',
    minMaxNumber:
      'Введите значение поля {fieldName} от {validatorParams.min} до {validatorParams.max}.',
    isDate: 'Введите дату (ДД ММ ГГГГ).',
    minDate: 'Введите значение поля {fieldName}, превышающее {validatorParams, date, YYYYMMDD}.',
    maxDate: 'Введите значение поля {fieldName} до {validatorParams, date, YYYYMMDD}.',
    minMaxDate:
      'Введите значение поля {fieldName} от {validatorParams.min, date, YYYYMMDD} до {validatorParams.max, date, YYYYMMDD}.',
    isDisabledDate: 'Эта дата недоступна, выберите другой вариант.',
    isEmail: 'Введите действительное значение поля {fieldName} в формате «name@example.com».',
  },
  success: {
    defaultOk: 'OK',
    randomOk:
      'success.defaultOk,success.correct,success.succeeded,success.ok,success.thisIsRight,success.changed,success.okCorrect',
    correct: 'Правильно',
    succeeded: 'Успешно',
    ok: 'OK!',
    thisIsRight: 'Все верно.',
    changed: 'Изменено!',
    okCorrect: 'OK, правильно.',
  },
};
