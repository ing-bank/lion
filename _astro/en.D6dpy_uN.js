const n={error:{IsIBAN:"Please enter a valid {fieldName}.",IsCountryIBAN:`Please enter a valid {params, select,
AT {Austrian}
BE {Belgian}
CZ {Czech}
DE {German}
ES {Spanish}
FR {French}
HU {Hungarian}
IT {Italian}
NL {Dutch}
PL {Polish}
RO {Romanian}
other {{params}}
} {fieldName}.`,IsNotCountryIBAN:`{userSuppliedCountryCode, select,
AT {Austrian}
BE {Belgian}
CZ {Czech}
DE {German}
ES {Spanish}
FR {French}
HU {Hungarian}
IT {Italian}
NL {Dutch}
PL {Polish}
RO {Romanian}
other {{userSuppliedCountryCode}}
} {fieldName} is not allowed.`}};export{n as default};
