const i={error:{IsIBAN:"Wprowadź prawidłową wartość w polu {fieldName}.",IsCountryIBAN:`Wprowadź prawidłową wartość w polu {params, select,
AT {Austriacki}
BE {Belgijski}
CZ {Czeski}
DE {Niemiecki}
ES {Hiszpański}
FR {Francuski}
HU {Węgierski}
IT {Włoski}
NL {Holenderski}
PL {Polski}
RO {Rumuński}
other {{params}}
} {fieldName}.`,IsNotCountryIBAN:`{userSuppliedCountryCode, select,
AT {Austriacki}
BE {Belgijski}
CZ {Czeski}
DE {Niemiecki}
ES {Hiszpański}
FR {Francuski}
HU {Węgierski}
IT {Włoski}
NL {Holenderski}
PL {Polski}
RO {Rumuński}
other {{userSuppliedCountryCode}}
} {fieldName} nie jest dozwolone.`}};export{i as default};
