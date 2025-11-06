const n={error:{IsIBAN:"Введіть правильні дані {fieldName}.",IsCountryIBAN:`Моля, въведете валиден {params, select,
AT {Австрийски}
BE {Белгийски}
CZ {Чешки}
DE {Немски}
ES {Испански}
FR {Френски}
HU {Унгарски}
IT {Италиански}
NL {Нидерландски}
PL {Полски}
RO {Румънски}
other {{params}}
} {fieldName}.`,IsNotCountryIBAN:`{userSuppliedCountryCode, select,
AT {Австрийски}
BE {Белгийски}
CZ {Чешки}
DE {Немски}
ES {Испански}
FR {Френски}
HU {Унгарски}
IT {Италиански}
NL {Нидерландски}
PL {Полски}
RO {Румънски}
other {{userSuppliedCountryCode}}
} {fieldName} не е позволено.`}};export{n as default};
