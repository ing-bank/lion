export default {
  error: {
    IsIBAN: 'Моля, въведете валидна стойност за {fieldName}.',
    IsCountryIBAN:
      'Моля, въведете валидна стойност за {fieldName} от {params, select,\n' +
      'AT {Австрия}\n' +
      'BE {Белгия}\n' +
      'CZ {Чехия}\n' +
      'DE {Германия}\n' +
      'ES {Испания}\n' +
      'FR {Франция}\n' +
      'HU {Унгария}\n' +
      'IT {Италия}\n' +
      'NL {Нидерландия}\n' +
      'PL {Полша}\n' +
      'RO {Румъния}\n' +
      'other {{params}}\n' +
      '}.',
    IsNotCountryIBAN:
      'Стойност за {fieldName} от {userSuppliedCountryCode, select,\n' +
      'AT {Австрия}\n' +
      'BE {Белгия}\n' +
      'CZ {Чехия}\n' +
      'DE {Германия}\n' +
      'ES {Испания}\n' +
      'FR {Франция}\n' +
      'HU {Унгария}\n' +
      'IT {Италия}\n' +
      'NL {Нидерландия}\n' +
      'PL {Полша}\n' +
      'RO {Румъния}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      '} не е позволена.',
  },
};
