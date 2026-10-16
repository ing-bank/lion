const n={error:{IsIBAN:"Введіть правильні дані {fieldName}.",IsCountryIBAN:`Введіть правильні дані {params, select,
AT {австрійський}
BE {бельгійський}
CZ {чеський}
DE {німецький}
ES {іспанський}
FR {французький}
HU {угорський}
IT {італійський}
NL {голландський}
PL {польський}
RO {румунська}
other {{params}}
} {fieldName}.`,IsNotCountryIBAN:`{userSuppliedCountryCode, select,
AT {Австрійський}
BE {Бельгійський}
CZ {Чеський}
DE {Німецький}
ES {Iспанський}
FR {Французький}
HU {Угорський}
IT {Iталійський}
NL {Голландський}
PL {Польський}
RO {Румунська}
other {{userSuppliedCountryCode}}
} {fieldName} не дозволено.`}};export{n as default};
