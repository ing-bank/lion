/* eslint-disable max-classes-per-file  */

import { isValidIBAN } from 'ibantools';
import { Validator } from '@lion/validate';
import { localize } from '@lion/localize';

let loaded = false;
const loadTranslations = async () => {
  if (loaded) {
    return;
  }
  await localize.loadNamespace(
    {
      'lion-validate+iban': locale => import(`../translations/${locale}.js`),
    },
    { locale: localize.localize },
  );
  loaded = true;
};

export class IsIBAN extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'IsIBAN';
  }

  // eslint-disable-next-line class-methods-use-this
  execute(value) {
    return !isValidIBAN(value);
  }

  static async getMessage(data) {
    await loadTranslations();
    return localize.msg('lion-validate+iban:error.IsIBAN', data);
  }
}

export class IsCountryIBAN extends IsIBAN {
  constructor(...args) {
    super(...args);
    this.name = 'IsCountryIBAN';
  }

  execute(value) {
    const notIBAN = super.execute(value);
    if (value.slice(0, 2) !== this.param) {
      return true;
    }
    if (notIBAN) {
      return true;
    }
    return false;
  }

  static async getMessage(data) {
    await loadTranslations();
    return localize.msg('lion-validate+iban:error.IsCountryIBAN', data);
  }
}
