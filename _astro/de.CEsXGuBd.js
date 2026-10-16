const e={error:{IsIBAN:"Geben Sie eine gültige {fieldName} ein.",IsCountryIBAN:`Geben Sie eine gültige {params, select,
AT {Österreichisch}
BE {Belgisch}
CZ {Tschechisch}
DE {Deutsch}
ES {Spanisch}
FR {Französisch}
HU {Ungarisch}
IT {Italienisch}
NL {Niederländisch}
PL {Polnisch}
RO {Rumänisch}
other {{params}}
} {fieldName} ein.`,IsNotCountryIBAN:`{userSuppliedCountryCode, select,
AT {Österreichisch}
BE {Belgisch}
CZ {Tschechisch}
DE {Deutsch}
ES {Spanisch}
FR {Französisch}
HU {Ungarisch}
IT {Italienisch}
NL {Niederländisch}
PL {Polnisch}
RO {Rumänisch}
other {{userSuppliedCountryCode}}
} {fieldName} ist nicht erlaubt.`}};export{e as default};
