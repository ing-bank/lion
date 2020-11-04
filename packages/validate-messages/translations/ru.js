export default {
  error: {
    Required: 'Введите значение поля {fieldName}.',
    EqualsLength: 'Введите корректное значение поля {fieldName} — ровно {params} симв.',
    MinLength: 'Введите корректное значение поля {fieldName} (не менее {params}).',
    MaxLength: 'Введите корректное значение поля {fieldName} (до {params} симв.).',
    MinMaxLength:
      'Введите корректное значение поля {fieldName} (от {params.min} до {params.max} симв.).',
    Pattern: 'Введите действительное значение поля {fieldName}.',
    IsNumber: 'Введите действительное значение поля {fieldName}.',
    MinNumber: 'Введите значение поля {fieldName}, превышающее {params}.',
    MaxNumber: 'Введите значение поля {fieldName} меньше, чем {params}.',
    MinMaxNumber: 'Введите значение поля {fieldName} от {params.min} до {params.max}.',
    IsDate: 'Введите дату (ДД ММ ГГГГ).',
    MinDate: 'Введите значение поля {fieldName}, превышающее {params, date, YYYYMMDD}.',
    MaxDate: 'Введите значение поля {fieldName} до {params, date, YYYYMMDD}.',
    MinMaxDate:
      'Введите значение поля {fieldName} от {params.min, date, YYYYMMDD} до {params.max, date, YYYYMMDD}.',
    IsDateDisabled: 'Эта дата недоступна, выберите другой вариант.',
    IsEmail: 'Введите действительное значение поля {fieldName} в формате «name@example.com».',
  },
  warning: {
    Required: 'Введите значение поля {fieldName}.',
    EqualsLength: 'Введите корректное значение поля {fieldName} — ровно {paramsn} симв.',
    MinLength: 'Введите корректное значение поля {fieldName} (не менее {params}).',
    MaxLength: 'Введите корректное значение поля {fieldName} (до {params} симв.).',
    MinMaxLength:
      'Введите корректное значение поля {fieldName} (от {params.min} до {params.max} симв.).',
    IsNumber: 'Введите действительное значение поля {fieldName}.',
    MinNumber: 'Введите значение поля {fieldName}, превышающее {params}.',
    MaxNumber: 'Введите значение поля {fieldName} меньше, чем {params}.',
    MinMaxNumber: 'Введите значение поля {fieldName} от {params.min} до {params.max}.',
    IsDate: 'Введите дату (ДД ММ ГГГГ).',
    MinDate: 'Введите значение поля {fieldName}, превышающее {params, date, YYYYMMDD}.',
    MaxDate: 'Введите значение поля {fieldName} до {params, date, YYYYMMDD}.',
    MinMaxDate:
      'Введите значение поля {fieldName} от {params.min, date, YYYYMMDD} до {params.max, date, YYYYMMDD}.',
    IsDateDisabled: 'Эта дата недоступна, выберите другой вариант.',
    IsEmail: 'Введите действительное значение поля {fieldName} в формате «name@example.com».',
  },
  success: {
    DefaultOk: 'OK',
    RandomOk:
      'success.DefaultOk,success.Correct,success.Succeeded,success.Ok,success.ThisIsRight,success.Changed,success.OkCorrect',
    Correct: 'Правильно',
    Succeeded: 'Успешно',
    Ok: 'OK!',
    ThisIsRight: 'Все верно.',
    Changed: 'Изменено!',
    OkCorrect: 'OK, правильно.',
  },
};
