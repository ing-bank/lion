export default {
  error: {
    IsIBAN: 'Zadejte platné {fieldName}.',
    IsCountryIBAN:
      'Zadejte platnou {params, select,\n' +
      'AT {Rakušan}\n' +
      'BE {Belgičan}\n' +
      'CZ {Čech}\n' +
      'DE {Němec}\n' +
      'ES {Španěl}\n' +
      'FR {Francouz}\n' +
      'HU {Maďar}\n' +
      'IT {Ital}\n' +
      'NL {Holanďan}\n' +
      'PL {Polák}\n' +
      'RO {Rumun}\n' +
      'other {{params}}\n' +
      '} {fieldName}.',
    IsNotCountryIBAN:
      '{userSuppliedCountryCode, select,\n' +
      'AT {Rakušan}\n' +
      'BE {Belgičan}\n' +
      'CZ {Čech}\n' +
      'DE {Němec}\n' +
      'ES {Španěl}\n' +
      'FR {Francouz}\n' +
      'HU {Maďar}\n' +
      'IT {Ital}\n' +
      'NL {Holanďan}\n' +
      'PL {Polák}\n' +
      'RO {Rumun}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      '} {fieldName} není povoleno.',
  },
};
