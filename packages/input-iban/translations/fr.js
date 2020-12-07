export default {
  error: {
    IsIBAN: 'Indiquez un(e) {fieldName} valide.',
    IsCountryIBAN:
      'Veuillez saisir un(e) {fieldName} {params, select,\n' +
      'AT {autrichien}\n' +
      'BE {belge}\n' +
      'CZ {tchèque}\n' +
      'DE {allemand}\n' +
      'ES {espagnol}\n' +
      'FR {français}\n' +
      'HU {hongrois}\n' +
      'IT {italien}\n' +
      'NL {néerlandais}\n' +
      'PL {polonais}\n' +
      'RO {roumain}\n' +
      'other {{params}}\n' +
      '} valide.',
    IsNotCountryIBAN:
      '{fieldName} {userSuppliedCountryCode, select,\n' +
      'AT {autrichien}\n' +
      'BE {belge}\n' +
      'CZ {tchèque}\n' +
      'DE {allemand}\n' +
      'ES {espagnol}\n' +
      'FR {français}\n' +
      'HU {hongrois}\n' +
      'IT {italien}\n' +
      'NL {néerlandais}\n' +
      'PL {polonais}\n' +
      'RO {roumain}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      "} n'est pas autorisé.",
  },
};
