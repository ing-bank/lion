const n={error:{IsIBAN:"Introduzca un/a {fieldName} válido/a.",IsCountryIBAN:`Introduzca un/a {fieldName} válido/a de {params, select,
AT {Austriaco}
BE {Belga}
CZ {Checo}
DE {Alemán}
ES {Español}
FR {Francés}
HU {Húngaro}
IT {Italiano}
NL {Neerlandés}
PL {Polaco}
RO {Rumano}
other {{params}}
}.`,IsNotCountryIBAN:`{fieldName} {userSuppliedCountryCode, select,
AT {Austriaco}
BE {Belga}
CZ {Checo}
DE {Alemán}
ES {Español}
FR {Francés}
HU {Húngaro}
IT {Italiano}
NL {Neerlandés}
PL {Polaco}
RO {Rumano}
other {{userSuppliedCountryCode}}
} no se permite.`}};export{n as default};
