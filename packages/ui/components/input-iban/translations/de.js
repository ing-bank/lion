export default {
  error: {
    IsIBAN: 'Geben Sie einen gültigen Wert für {fieldName} ein.',
    IsCountryIBAN:
      'Geben Sie für {fieldName} einen gültigen Wert aus {params, select,\n' +
      'AT {Österreich}\n' +
      'BE {Belgien}\n' +
      'CZ {Tschechien}\n' +
      'DE {Deutschland}\n' +
      'ES {Spanien}\n' +
      'FR {Frankreich}\n' +
      'HU {Ungarn}\n' +
      'IT {Italien}\n' +
      'NL {den Niederlanden}\n' +
      'PL {Polen}\n' +
      'RO {Rumänien}\n' +
      'other {{params}}\n' +
      '} ein.',
    IsNotCountryIBAN:
      'Ein Wert aus {userSuppliedCountryCode, select,\n' +
      'AT {Österreich}\n' +
      'BE {Belgien}\n' +
      'CZ {Tschechien}\n' +
      'DE {Deutschland}\n' +
      'ES {Spanien}\n' +
      'FR {Frankreich}\n' +
      'HU {Ungarn}\n' +
      'IT {Italien}\n' +
      'NL {den Niederlanden}\n' +
      'PL {Polen}\n' +
      'RO {Rumänien}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      '} ist für {fieldName} nicht zulässig.',
  },
};
