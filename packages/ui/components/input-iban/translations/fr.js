export default {
  error: {
    IsIBAN: 'Indiquez une valeur valide pour {fieldName}.',
    IsCountryIBAN:
      'Veuillez saisir une valeur {params, select,\n' +
      'AT {autrichienne}\n' +
      'BE {belge}\n' +
      'CZ {tchèque}\n' +
      'DE {allemande}\n' +
      'ES {espagnole}\n' +
      'FR {française}\n' +
      'HU {hongroise}\n' +
      'IT {italienne}\n' +
      'NL {néerlandaise}\n' +
      'PL {polonaise}\n' +
      'RO {roumaine}\n' +
      'other {{params}}\n' +
      '} valide pour {fieldName}.',
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
