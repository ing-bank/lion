export default {
  error: {
    IsIBAN: 'Введите действительное значение поля {fieldName}.',
    IsCountryIBAN:
      'Введите действительное значение поля {fieldName} из {params, select,\n' +
      'AT {Австрии}\n' +
      'BE {Бельгии}\n' +
      'CZ {Чехии}\n' +
      'DE {Германии}\n' +
      'ES {Испании}\n' +
      'FR {Франции}\n' +
      'HU {Венгрии}\n' +
      'IT {Италии}\n' +
      'NL {Нидерландов}\n' +
      'PL {Польши}\n' +
      'RO {Румынии}\n' +
      'other {{params}}\n' +
      '}.',
    IsNotCountryIBAN:
      'Значение поля {fieldName} из {userSuppliedCountryCode, select,\n' +
      'AT {Австрии}\n' +
      'BE {Бельгии}\n' +
      'CZ {Чехии}\n' +
      'DE {Германии}\n' +
      'ES {Испании}\n' +
      'FR {Франции}\n' +
      'HU {Венгрии}\n' +
      'IT {Италии}\n' +
      'NL {Нидерландов}\n' +
      'PL {Польши}\n' +
      'RO {Румынии}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      '} не допускается.',
  },
};
