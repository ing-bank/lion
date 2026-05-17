export default {
  error: {
    IsIBAN: 'Inserire un valore valido per {fieldName}.',
    IsCountryIBAN:
      'Inserire un valore valido {params, select,\n' +
      "AT {dall'Austria}\n" +
      'BE {dal Belgio}\n' +
      'CZ {dalla Cechia}\n' +
      'DE {dalla Germania}\n' +
      'ES {dalla Spagna}\n' +
      'FR {dalla Francia}\n' +
      "HU {dall'Ungheria}\n" +
      "IT {dall'Italia}\n" +
      'NL {dai Paesi Bassi}\n' +
      'PL {dalla Polonia}\n' +
      'RO {dalla Romania}\n' +
      'other {{params}}\n' +
      '} per {fieldName}.',
    IsNotCountryIBAN:
      'Un valore {userSuppliedCountryCode, select,\n' +
      "AT {dall'Austria}\n" +
      'BE {dal Belgio}\n' +
      'CZ {dalla Cechia}\n' +
      'DE {dalla Germania}\n' +
      'ES {dalla Spagna}\n' +
      'FR {dalla Francia}\n' +
      "HU {dall'Ungheria}\n" +
      "IT {dall'Italia}\n" +
      'NL {dai Paesi Bassi}\n' +
      'PL {dalla Polonia}\n' +
      'RO {dalla Romania}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      '} non è permesso per {fieldName}.',
  },
};
