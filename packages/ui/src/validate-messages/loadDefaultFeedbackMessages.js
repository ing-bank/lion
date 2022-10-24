/* eslint-disable import/no-extraneous-dependencies */
import { localize } from '@lion/ui/localize.js';
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
} from '@lion/ui/form-core.js';
import { PhoneNumber } from '@lion/ui/input-tel.js';

/**
 * @typedef {import('@lion/form-core/types').FeedbackMessageData} FeedbackMessageData
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
              return import('@lion/ui/validate-messages-translations/bg-BG.js');
            case 'bg':
              return import('@lion/ui/validate-messages-translations/bg.js');
            case 'cs-CZ':
              return import('@lion/ui/validate-messages-translations/cs-CZ.js');
            case 'cs':
              return import('@lion/ui/validate-messages-translations/cs.js');
            case 'de-DE':
              return import('@lion/ui/validate-messages-translations/de-DE.js');
            case 'de':
              return import('@lion/ui/validate-messages-translations/de.js');
            case 'en-AU':
              return import('@lion/ui/validate-messages-translations/en-AU.js');
            case 'en-GB':
              return import('@lion/ui/validate-messages-translations/en-GB.js');
            case 'en-US':
              return import('@lion/ui/validate-messages-translations/en-US.js');
            case 'en-PH':
              return import('@lion/ui/validate-messages-translations/en-PH.js');
            case 'en':
              return import('@lion/ui/validate-messages-translations/en.js');
            case 'es-ES':
              return import('@lion/ui/validate-messages-translations/es-ES.js');
            case 'es':
              return import('@lion/ui/validate-messages-translations/es.js');
            case 'fr-FR':
              return import('@lion/ui/validate-messages-translations/fr-FR.js');
            case 'fr-BE':
              return import('@lion/ui/validate-messages-translations/fr-BE.js');
            case 'fr':
              return import('@lion/ui/validate-messages-translations/fr.js');
            case 'hu-HU':
              return import('@lion/ui/validate-messages-translations/hu-HU.js');
            case 'hu':
              return import('@lion/ui/validate-messages-translations/hu.js');
            case 'it-IT':
              return import('@lion/ui/validate-messages-translations/it-IT.js');
            case 'it':
              return import('@lion/ui/validate-messages-translations/it.js');
            case 'nl-BE':
              return import('@lion/ui/validate-messages-translations/nl-BE.js');
            case 'nl-NL':
              return import('@lion/ui/validate-messages-translations/nl-NL.js');
            case 'nl':
              return import('@lion/ui/validate-messages-translations/nl.js');
            case 'pl-PL':
              return import('@lion/ui/validate-messages-translations/pl-PL.js');
            case 'pl':
              return import('@lion/ui/validate-messages-translations/pl.js');
            case 'ro-RO':
              return import('@lion/ui/validate-messages-translations/ro-RO.js');
            case 'ro':
              return import('@lion/ui/validate-messages-translations/ro.js');
            case 'ru-RU':
              return import('@lion/ui/validate-messages-translations/ru-RU.js');
            case 'ru':
              return import('@lion/ui/validate-messages-translations/ru.js');
            case 'sk-SK':
              return import('@lion/ui/validate-messages-translations/sk-SK.js');
            case 'sk':
              return import('@lion/ui/validate-messages-translations/sk.js');
            case 'uk-UA':
              return import('@lion/ui/validate-messages-translations/uk-UA.js');
            case 'uk':
              return import('@lion/ui/validate-messages-translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('@lion/ui/validate-messages-translations/zh.js');
            default:
              return import('@lion/ui/validate-messages-translations/en.js');
          }
        },
      },
      { locale: localize.locale },
    );

  /**
   * @param {FeedbackMessageData} data
   * @returns {Promise<string|Element>}
   */
  const getLocalizedMessage = async data => {
    await forMessagesToBeReady();
    if (data) {
      return localize.msg(`lion-validate:${data.type}.${data.name}`, data);
    }
    return '';
  };

  /** @param {FeedbackMessageData} data */
  Required.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  EqualsLength.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MinLength.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MaxLength.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MinMaxLength.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  Pattern.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  IsEmail.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  IsNumber.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MinNumber.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MaxNumber.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MinMaxNumber.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  IsDate.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MinDate.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MaxDate.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  MinMaxDate.getMessage = async data => getLocalizedMessage(data);
  /** @param {FeedbackMessageData} data */
  IsDateDisabled.getMessage = async data => getLocalizedMessage(data);

  DefaultSuccess.getMessage = async data => {
    await forMessagesToBeReady();
    const randomKeys = localize.msg('lion-validate:success.RandomOk').split(',');
    const key = randomKeys[Math.floor(Math.random() * randomKeys.length)].trim();
    return localize.msg(`lion-validate:${key}`, data);
  };

  /** @param {FeedbackMessageData} data */
  // @ts-ignore
  PhoneNumber.getMessage = async data => {
    await forMessagesToBeReady();
    const { type, outcome } = data;
    if (outcome === 'too-long') {
      // TODO: get max-length of country and use MaxLength validator
      return localize.msg(`lion-validate:${type}.Pattern`, data);
    }
    if (outcome === 'too-short') {
      // TODO: get min-length of country and use MinLength validator
      return localize.msg(`lion-validate:${type}.Pattern`, data);
    }
    // TODO: add a more specific message here
    if (outcome === 'invalid-country-code') {
      return localize.msg(`lion-validate:${type}.Pattern`, data);
    }
    return localize.msg(`lion-validate:${type}.Pattern`, data);
  };

  loaded = true;
}
