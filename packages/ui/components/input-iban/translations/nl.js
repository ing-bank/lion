export default {
  error: {
    IsIBAN: 'Vul een geldige waarde in voor het veld {fieldName}.',
    IsCountryIBAN:
      'Vul een geldige {params, select,\n' +
      'AT {Oostenrijkse}\n' +
      'BE {Belgische}\n' +
      'CZ {Tsjechische}\n' +
      'DE {Duitse}\n' +
      'ES {Spaanse}\n' +
      'FR {Franse}\n' +
      'HU {Hongaarse}\n' +
      'IT {Italiaanse}\n' +
      'NL {Nederlandse}\n' +
      'PL {Poolse}\n' +
      'RO {Roemeense}\n' +
      'other {{params}}\n' +
      '} waarde in voor het veld {fieldName}.',
    IsNotCountryIBAN:
      '{userSuppliedCountryCode, select,\n' +
      'AT {Oostenrijkse}\n' +
      'BE {Belgische}\n' +
      'CZ {Tsjechische}\n' +
      'DE {Duitse}\n' +
      'ES {Spaanse}\n' +
      'FR {Franse}\n' +
      'HU {Hongaarse}\n' +
      'IT {Italiaanse}\n' +
      'NL {Nederlandse}\n' +
      'PL {Poolse}\n' +
      'RO {Roemeense}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      '} {fieldName} is niet toegestaan.',
  },
};
