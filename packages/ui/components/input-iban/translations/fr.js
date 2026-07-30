export default {
  error: {
    IsIBAN: 'Indiquez une valeur valide pour {fieldName}.',
    IsCountryIBAN:
      'Veuillez saisir une valeur valide pour {fieldName} {params, select,\n' +
      "AT {d'Autriche}\n" +
      'BE {de Belgique}\n' +
      'CZ {de Tchéquie}\n' +
      "DE {d'Allemagne}\n" +
      "ES {d'Espagne}\n" +
      'FR {de France}\n' +
      'HU {de Hongrie}\n' +
      "IT {d'Italie}\n" +
      'NL {des Pays-Bas}\n' +
      'PL {de Pologne}\n' +
      'RO {de Roumanie}\n' +
      'other {{params}}\n' +
      '}.',
    IsNotCountryIBAN:
      'Une valeur {userSuppliedCountryCode, select,\n' +
      "AT {d'Autriche}\n" +
      'BE {de Belgique}\n' +
      'CZ {de Tchéquie}\n' +
      "DE {d'Allemagne}\n" +
      "ES {d'Espagne}\n" +
      'FR {de France}\n' +
      'HU {de Hongrie}\n' +
      "IT {d'Italie}\n" +
      'NL {des Pays-Bas}\n' +
      'PL {de Pologne}\n' +
      'RO {de Roumanie}\n' +
      'other {{userSuppliedCountryCode}}\n' +
      "} n'est pas autorisée pour {fieldName}.",
  },
};
