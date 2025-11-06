const n={error:{IsIBAN:"Indiquez un(e) {fieldName} valide.",IsCountryIBAN:`Veuillez saisir un(e) {fieldName} {params, select,
AT {autrichien}
BE {belge}
CZ {tchèque}
DE {allemand}
ES {espagnol}
FR {français}
HU {hongrois}
IT {italien}
NL {néerlandais}
PL {polonais}
RO {roumain}
other {{params}}
} valide.`,IsNotCountryIBAN:`{fieldName} {userSuppliedCountryCode, select,
AT {autrichien}
BE {belge}
CZ {tchèque}
DE {allemand}
ES {espagnol}
FR {français}
HU {hongrois}
IT {italien}
NL {néerlandais}
PL {polonais}
RO {roumain}
other {{userSuppliedCountryCode}}
} n'est pas autorisé.`}};export{n as default};
