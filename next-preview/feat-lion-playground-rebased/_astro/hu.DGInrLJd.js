const n={error:{IsIBAN:"Kérjük, adjon meg érvényes {fieldName} értéket.",IsCountryIBAN:`Kérjük, adjon meg érvényes {params, select,
AT {Osztrák}
BE {Belga}
CZ {Cseh}
DE {Német}
ES {Spanyol}
FR {Francia}
HU {Magyar}
IT {Olasz}
NL {Holland}
PL {Lengyel}
RO {Román}
other {{params}}
} {fieldName} értéket.`,IsNotCountryIBAN:`{userSuppliedCountryCode, select,
AT {Osztrák}
BE {Belga}
CZ {Cseh}
DE {Német}
ES {Spanyol}
FR {Francia}
HU {Magyar}
IT {Olasz}
NL {Holland}
PL {Lengyel}
RO {Román}
other {{userSuppliedCountryCode}}
} {fieldName} nem engedélyezett.`}};export{n as default};
