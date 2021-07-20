/* eslint-disable max-classes-per-file, import/no-extraneous-dependencies */

import { localize } from '@lion/localize';
import { Unparseable, Validator } from '@lion/form-core';
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
            return import('@lion/input-iban/translations/bg-BG.js');
          case 'bg':
            return import('@lion/input-iban/translations/bg.js');
          case 'cs-CZ':
            return import('@lion/input-iban/translations/cs-CZ.js');
          case 'cs':
            return import('@lion/input-iban/translations/cs.js');
          case 'de-DE':
            return import('@lion/input-iban/translations/de-DE.js');
          case 'de':
            return import('@lion/input-iban/translations/de.js');
          case 'en-AU':
            return import('@lion/input-iban/translations/en-AU.js');
          case 'en-GB':
            return import('@lion/input-iban/translations/en-GB.js');
          case 'en-US':
            return import('@lion/input-iban/translations/en-US.js');
          case 'en-PH':
          case 'en':
            return import('@lion/input-iban/translations/en.js');
          case 'es-ES':
            return import('@lion/input-iban/translations/es-ES.js');
          case 'es':
            return import('@lion/input-iban/translations/es.js');
          case 'fr-FR':
            return import('@lion/input-iban/translations/fr-FR.js');
          case 'fr-BE':
            return import('@lion/input-iban/translations/fr-BE.js');
          case 'fr':
            return import('@lion/input-iban/translations/fr.js');
          case 'hu-HU':
            return import('@lion/input-iban/translations/hu-HU.js');
          case 'hu':
            return import('@lion/input-iban/translations/hu.js');
          case 'it-IT':
            return import('@lion/input-iban/translations/it-IT.js');
          case 'it':
            return import('@lion/input-iban/translations/it.js');
          case 'nl-BE':
            return import('@lion/input-iban/translations/nl-BE.js');
          case 'nl-NL':
            return import('@lion/input-iban/translations/nl-NL.js');
          case 'nl':
            return import('@lion/input-iban/translations/nl.js');
          case 'pl-PL':
            return import('@lion/input-iban/translations/pl-PL.js');
          case 'pl':
            return import('@lion/input-iban/translations/pl.js');
          case 'ro-RO':
            return import('@lion/input-iban/translations/ro-RO.js');
          case 'ro':
            return import('@lion/input-iban/translations/ro.js');
          case 'ru-RU':
            return import('@lion/input-iban/translations/ru-RU.js');
          case 'ru':
            return import('@lion/input-iban/translations/ru.js');
          case 'sk-SK':
            return import('@lion/input-iban/translations/sk-SK.js');
          case 'sk':
            return import('@lion/input-iban/translations/sk.js');
          case 'uk-UA':
            return import('@lion/input-iban/translations/uk-UA.js');
          case 'uk':
            return import('@lion/input-iban/translations/uk.js');
          case 'zh-CN':
          case 'zh':
            return import('@lion/input-iban/translations/zh.js');
          default:
            return import('@lion/input-iban/translations/en.js');
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
   * @param {string} modelValue
   * @returns {Boolean}
   */
  execute(modelValue) {
    let isInvalid = false;
    const notIBAN = super.execute(modelValue);
    if (typeof this.param === 'string') {
      if (String(modelValue.slice(0, 2)) !== this.param.toUpperCase()) {
        isInvalid = true;
      }
    } else if (Array.isArray(this.param)) {
      isInvalid = !this.param.some(
        country => String(modelValue.slice(0, 2)) === country.toUpperCase(),
      );
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
    // If modelValue is Unparseable, the IsIBAN message is the more appropriate feedback
    return data?.modelValue instanceof Unparseable
      ? localize.msg('lion-validate+iban:error.IsIBAN', data)
      : localize.msg('lion-validate+iban:error.IsCountryIBAN', data);
  }
}

export class IsNotCountryIBAN extends IsIBAN {
  static get validatorName() {
    return 'IsNotCountryIBAN';
  }

  /**
   * @param {string} modelValue
   * @returns {Boolean}
   */
  execute(modelValue) {
    let isInvalid = false;
    const notIBAN = super.execute(modelValue);
    if (typeof this.param === 'string') {
      if (String(modelValue.slice(0, 2)) === this.param.toUpperCase()) {
        isInvalid = true;
      }
    } else if (Array.isArray(this.param)) {
      isInvalid = this.param.some(
        country => String(modelValue.slice(0, 2)) === country.toUpperCase(),
      );
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
        typeof data?.modelValue === 'string' ? data?.modelValue.slice(0, 2) : '',
    };
    // If modelValue is Unparseable, the IsIBAN message is the more appropriate feedback
    return data?.modelValue instanceof Unparseable
      ? localize.msg('lion-validate+iban:error.IsIBAN', _data)
      : localize.msg('lion-validate+iban:error.IsNotCountryIBAN', _data);
  }
}
