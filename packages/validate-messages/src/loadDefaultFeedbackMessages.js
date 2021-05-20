/* eslint-disable import/no-extraneous-dependencies */
import { localize } from '@lion/localize';
import {
  DefaultSuccess,
  IsDate,
  IsDateDisabled,
  MaxDate,
  MinDate,
  MinMaxDate,
  IsNumber,
  MaxNumber,
  MinMaxNumber,
  MinNumber,
  Required,
  EqualsLength,
  IsEmail,
  MaxLength,
  MinLength,
  MinMaxLength,
  Pattern,
} from '@lion/form-core';

/**
 * @typedef {object} MessageData
 * @property {*} [MessageData.modelValue]
 * @property {string} [MessageData.fieldName]
 * @property {*} [MessageData.formControl]
 * @property {string} [MessageData.type]
 * @property {Object.<string,?>} [MessageData.config]
 * @property {string} [MessageData.name]
 */

let loaded = false;

export function loadDefaultFeedbackMessages() {
  if (loaded === true) {
    return;
  }

  const forMessagesToBeReady = () =>
    localize.loadNamespace(
      {
        'lion-validate': /** @param {string} locale */ locale => {
          switch (locale) {
            case 'bg-BG':
              return import('@lion/validate-messages/translations/bg-BG.js');
            case 'bg':
              return import('@lion/validate-messages/translations/bg.js');
            case 'cs-CZ':
              return import('@lion/validate-messages/translations/cs-CZ.js');
            case 'cs':
              return import('@lion/validate-messages/translations/cs.js');
            case 'de-DE':
              return import('@lion/validate-messages/translations/de-DE.js');
            case 'de':
              return import('@lion/validate-messages/translations/de.js');
            case 'en-AU':
              return import('@lion/validate-messages/translations/en-AU.js');
            case 'en-GB':
              return import('@lion/validate-messages/translations/en-GB.js');
            case 'en-US':
              return import('@lion/validate-messages/translations/en-US.js');
            case 'en-PH':
            case 'en':
              return import('@lion/validate-messages/translations/en.js');
            case 'es-ES':
              return import('@lion/validate-messages/translations/es-ES.js');
            case 'es':
              return import('@lion/validate-messages/translations/es.js');
            case 'fr-FR':
              return import('@lion/validate-messages/translations/fr-FR.js');
            case 'fr-BE':
              return import('@lion/validate-messages/translations/fr-BE.js');
            case 'fr':
              return import('@lion/validate-messages/translations/fr.js');
            case 'hu-HU':
              return import('@lion/validate-messages/translations/hu-HU.js');
            case 'hu':
              return import('@lion/validate-messages/translations/hu.js');
            case 'it-IT':
              return import('@lion/validate-messages/translations/it-IT.js');
            case 'it':
              return import('@lion/validate-messages/translations/it.js');
            case 'nl-BE':
              return import('@lion/validate-messages/translations/nl-BE.js');
            case 'nl-NL':
              return import('@lion/validate-messages/translations/nl-NL.js');
            case 'nl':
              return import('@lion/validate-messages/translations/nl.js');
            case 'pl-PL':
              return import('@lion/validate-messages/translations/pl-PL.js');
            case 'pl':
              return import('@lion/validate-messages/translations/pl.js');
            case 'ro-RO':
              return import('@lion/validate-messages/translations/ro-RO.js');
            case 'ro':
              return import('@lion/validate-messages/translations/ro.js');
            case 'ru-RU':
              return import('@lion/validate-messages/translations/ru-RU.js');
            case 'ru':
              return import('@lion/validate-messages/translations/ru.js');
            case 'sk-SK':
              return import('@lion/validate-messages/translations/sk-SK.js');
            case 'sk':
              return import('@lion/validate-messages/translations/sk.js');
            case 'uk-UA':
              return import('@lion/validate-messages/translations/uk-UA.js');
            case 'uk':
              return import('@lion/validate-messages/translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('@lion/validate-messages/translations/zh.js');
            default:
              return import('@lion/validate-messages/translations/en.js');
          }
        },
      },
      { locale: localize.locale },
    );

  /**
   * @param {MessageData} data
   * @returns {Promise<string|Node>}
   */
  const getLocalizedMessage = async data => {
    await forMessagesToBeReady();
    if (data) {
      return localize.msg(`lion-validate:${data.type}.${data.name}`, data);
    }
    return '';
  };

  /** @param {MessageData} data */
  Required.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  EqualsLength.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MinLength.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MaxLength.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MinMaxLength.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  Pattern.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  IsEmail.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  IsNumber.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MinNumber.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MaxNumber.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MinMaxNumber.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  IsDate.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MinDate.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MaxDate.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  MinMaxDate.getMessage = async data => getLocalizedMessage(data);
  /** @param {MessageData} data */
  IsDateDisabled.getMessage = async data => getLocalizedMessage(data);

  DefaultSuccess.getMessage = async data => {
    await forMessagesToBeReady();
    const randomKeys = localize.msg('lion-validate:success.RandomOk').split(',');
    const key = randomKeys[Math.floor(Math.random() * randomKeys.length)].trim();
    return localize.msg(`lion-validate:${key}`, data);
  };

  loaded = true;
}
