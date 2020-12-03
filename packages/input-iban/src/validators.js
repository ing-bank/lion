/* eslint-disable max-classes-per-file  */

import { localize } from '@lion/localize';
import { Validator } from '@lion/form-core';
import { isValidIBAN } from 'ibantools';

let loaded = false;
const loadTranslations = async () => {
  if (loaded) {
    return;
  }
  await localize.loadNamespace(
    {
      'lion-validate+iban': /** @param {string} locale */ locale => {
        switch (locale) {
          case 'bg-BG':
            return import('../translations/bg-BG.js');
          case 'bg':
            return import('../translations/bg.js');
          case 'cs-CZ':
            return import('../translations/cs-CZ.js');
          case 'cs':
            return import('../translations/cs.js');
          case 'de-DE':
            return import('../translations/de-DE.js');
          case 'de':
            return import('../translations/de.js');
          case 'en-AU':
            return import('../translations/en-AU.js');
          case 'en-GB':
            return import('../translations/en-GB.js');
          case 'en-US':
            return import('../translations/en-US.js');
          case 'en-PH':
          case 'en':
            return import('../translations/en.js');
          case 'es-ES':
            return import('../translations/es-ES.js');
          case 'es':
            return import('../translations/es.js');
          case 'fr-FR':
            return import('../translations/fr-FR.js');
          case 'fr-BE':
            return import('../translations/fr-BE.js');
          case 'fr':
            return import('../translations/fr.js');
          case 'hu-HU':
            return import('../translations/hu-HU.js');
          case 'hu':
            return import('../translations/hu.js');
          case 'it-IT':
            return import('../translations/it-IT.js');
          case 'it':
            return import('../translations/it.js');
          case 'nl-BE':
            return import('../translations/nl-BE.js');
          case 'nl-NL':
            return import('../translations/nl-NL.js');
          case 'nl':
            return import('../translations/nl.js');
          case 'pl-PL':
            return import('../translations/pl-PL.js');
          case 'pl':
            return import('../translations/pl.js');
          case 'ro-RO':
            return import('../translations/ro-RO.js');
          case 'ro':
            return import('../translations/ro.js');
          case 'ru-RU':
            return import('../translations/ru-RU.js');
          case 'ru':
            return import('../translations/ru.js');
          case 'sk-SK':
            return import('../translations/sk-SK.js');
          case 'sk':
            return import('../translations/sk.js');
          case 'uk-UA':
            return import('../translations/uk-UA.js');
          case 'uk':
            return import('../translations/uk.js');
          case 'zh-CN':
          case 'zh':
            return import('../translations/zh.js');
          default:
            return import('../translations/en.js');
        }
      },
    },
    { locale: localize.locale },
  );
  loaded = true;
};

export class IsIBAN extends Validator {
  static get validatorName() {
    return 'IsIBAN';
  }

  /** @param {string} value */
  // eslint-disable-next-line class-methods-use-this
  execute(value) {
    return !isValidIBAN(value);
  }

  /**
   * @param {object} [data]
   * @param {*} [data.modelValue]
   * @param {string} [data.fieldName]
   * @param {*} [data.params]
   * @param {string} [data.type]
   * @param {Object.<string,?>} [data.config]
   * @param {string} [data.name]
   * @returns {Promise<string|Node>}
   */
  static async getMessage(data) {
    await loadTranslations();
    return localize.msg('lion-validate+iban:error.IsIBAN', data);
  }
}

export class IsCountryIBAN extends IsIBAN {
  static get validatorName() {
    return 'IsCountryIBAN';
  }

  /**
   * @param {string} value
   * @returns {Boolean}
   */
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

  /**
   * @param {object} [data]
   * @param {*} [data.modelValue]
   * @param {string} [data.fieldName]
   * @param {*} [data.params]
   * @param {string} [data.type]
   * @param {Object.<string,?>} [data.config]
   * @param {string} [data.name]
   * @returns {Promise<string|Node>}
   */
  static async getMessage(data) {
    await loadTranslations();
    return localize.msg('lion-validate+iban:error.IsCountryIBAN', data);
  }
}

export class IsNotCountryIBAN extends IsIBAN {
  static get validatorName() {
    return 'IsNotCountryIBAN';
  }

  /**
   * @param {string} value
   * @returns {Boolean}
   */
  execute(value) {
    let isInvalid = false;
    const notIBAN = super.execute(value);

    if (typeof this.param === 'string') {
      if (value.slice(0, 2) === this.param) {
        isInvalid = true;
      }
    } else if (Array.isArray(this.param)) {
      isInvalid = this.param.some(country => value.slice(0, 2) === country);
    }

    if (notIBAN) {
      isInvalid = true;
    }
    return isInvalid;
  }

  /**
   * @param {object} [data]
   * @param {*} [data.modelValue]
   * @param {string} [data.fieldName]
   * @param {*} [data.params]
   * @param {string} [data.type]
   * @param {Object.<string,?>} [data.config]
   * @param {string} [data.name]
   * @returns {Promise<string|Node>}
   */
  static async getMessage(data) {
    await loadTranslations();
    const _data = {
      ...data,
      userSuppliedCountryCode:
        typeof data?.modelValue === 'string'
          ? data?.modelValue.slice(0, 2)
          : data?.modelValue.viewValue.slice(0, 2),
    };
    return localize.msg('lion-validate+iban:error.IsNotCountryIBAN', _data);
  }
}
