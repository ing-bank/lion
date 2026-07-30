export default {
  error: {
    IsIBAN: 'Kérjük, adjon meg érvényes {fieldName} értéket.',
    IsCountryIBAN:
      'Kérjük, adjon meg érvényes {fieldName} értéket {params, select,\n' +
      'AT {Ausztriából}\n' +
      'BE {Belgiumból}\n' +
      'CZ {Csehországból}\n' +
      'DE {Németországból}\n' +
      'ES {Spanyolországból}\n' +
      'FR {Franciaországból}\n' +
      'HU {Magyarországról}\n' +
      'IT {Olaszországból}\n' +
      'NL {Hollandiából}\n' +
      'PL {Lengyelországból}\n' +
      'RO {Romániából}\n' +
      'other {{params}}\n' +
      '}.',
    IsNotCountryIBAN:
      '{userSuppliedCountryCode, select,\n' +
      'AT {Ausztriából}\n' +
      'BE {Belgiumból}\n' +
      'CZ {Csehországból}\n' +
      'DE {Németországból}\n' +
      'ES {Spanyolországból}\n' +
      'FR {Franciaországból}\n' +
      'HU {Magyarországról}\n' +
      'IT {Olaszországból}\n' +
      'NL {Hollandiából}\n' +
      'PL {Lengyelországból}\n' +
      'RO {Romániából}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      '} származó {fieldName} érték nem engedélyezett.',
  },
};
