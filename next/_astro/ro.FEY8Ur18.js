const n={error:{IsIBAN:"Vă rugăm să introduceți un/o {fieldName} valid(ă).",IsCountryIBAN:`Vă rugăm să introduceți un/o {fieldName} {params, select,
AT {austriac}
BE {belgian}
CZ {ceh}
DE {german}
ES {spaniol}
FR {francez}
HU {maghiar}
IT {italian}
NL {olandez}
PL {polonez}
RO {românesc}
other {{params}}
} valid(ă).`,IsNotCountryIBAN:`{fieldName} {userSuppliedCountryCode, select,
AT {austriac}
BE {belgian}
CZ {ceh}
DE {german}
ES {spaniol}
FR {francez}
HU {maghiar}
IT {italian}
NL {olandez}
PL {polonez}
RO {românesc}
other {{userSuppliedCountryCode}}
} nu este permis.`}};export{n as default};
