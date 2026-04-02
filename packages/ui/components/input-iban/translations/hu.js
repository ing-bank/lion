export default {
  error: {
    IsIBAN: 'Kérjük, adjon meg érvényes {fieldName} értéket.',
    IsCountryIBAN:
      'Kérjük, adjon meg érvényes {fieldName} értéket - {params, select,\n' +
      'AT {Ausztria}\n' +
      'BE {Belgium}\n' +
      'CZ {Csehország}\n' +
      'DE {Németország}\n' +
      'ES {Spanyolország}\n' +
      'FR {Franciaország}\n' +
      'HU {Magyarország}\n' +
      'IT {Olaszország}\n' +
      'NL {Hollandia}\n' +
      'PL {Lengyelország}\n' +
      'RO {Románia}\n' +
      'other {{params}}\n' +
      '}.',
    IsNotCountryIBAN:
      '{fieldName} értéke - {userSuppliedCountryCode, select,\n' +
      'AT {Ausztria}\n' +
      'BE {Belgium}\n' +
      'CZ {Csehország}\n' +
      'DE {Németország}\n' +
      'ES {Spanyolország}\n' +
      'FR {Franciaország}\n' +
      'HU {Magyarország}\n' +
      'IT {Olaszország}\n' +
      'NL {Hollandia}\n' +
      'PL {Lengyelország}\n' +
      'RO {Románia}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      '} - nem engedélyezett.',
  },
};
