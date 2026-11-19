const e={error:{IsIBAN:"Inserire un valore valido per {fieldName}.",IsCountryIBAN:`Inserire un valore valido per {fieldName} {params, select,
AT {Austriaco}
BE {Belga}
CZ {Ceco}
DE {Tedesco}
ES {Spagnolo}
FR {Francese}
HU {Ungherese}
IT {Italiano}
NL {Olandese}
PL {Polacco}
RO {Rumeno}
other {{params}}
}.`,IsNotCountryIBAN:`{fieldName} {userSuppliedCountryCode, select,
AT {Austriaco}
BE {Belga}
CZ {Ceco}
DE {Tedesco}
ES {Spagnolo}
FR {Francese}
HU {Ungherese}
IT {Italiano}
NL {Olandese}
PL {Polacco}
RO {Rumeno}
other {{userSuppliedCountryCode}}
} non è permesso.`}};export{e as default};
