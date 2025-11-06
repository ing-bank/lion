const n={error:{IsIBAN:"Zadejte platné {fieldName}.",IsCountryIBAN:`Zadejte platnou {params, select,
AT {Rakušan}
BE {Belgičan}
CZ {Čech}
DE {Němec}
ES {Španěl}
FR {Francouz}
HU {Maďar}
IT {Ital}
NL {Holanďan}
PL {Polák}
RO {Rumun}
other {{params}}
} {fieldName}.`,IsNotCountryIBAN:`{userSuppliedCountryCode, select,
AT {Rakušan}
BE {Belgičan}
CZ {Čech}
DE {Němec}
ES {Španěl}
FR {Francouz}
HU {Maďar}
IT {Ital}
NL {Holanďan}
PL {Polák}
RO {Rumun}
other {{userSuppliedCountryCode}}
} {fieldName} není povoleno.`}};export{n as default};
