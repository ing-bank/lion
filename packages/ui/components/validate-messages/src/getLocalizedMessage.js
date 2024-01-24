/**
 * @typedef {import('../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 * @typedef {import('@lion/ui/localize.js').LocalizeManager} LocalizeManager
 */

/** @type {Promise<void | object>} */
let pendingPromise;

/**
 * @param {string} string
 */
const capitalize = string => (string && string[0].toUpperCase() + string.slice(1)) || '';

/**
 * @param {{localize: LocalizeManager}} opts
 */
export async function loadValidateNamespace({ localize }) {
  if (pendingPromise) {
    return pendingPromise;
  }

  pendingPromise = localize.loadNamespace(
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

  return pendingPromise;
}

/**
 * @param {{data:FeedbackMessageData; localize: LocalizeManager}} opts
 * @returns {Promise<string|Element>}
 */
export const getLocalizedMessage = async ({ data, localize }) => {
  await loadValidateNamespace({ localize });
  if (data) {
    const operationMode =
      data.formControl?.operationMode !== 'enter' && data.name === 'Required'
        ? capitalize(data.formControl?.operationMode)
        : undefined;
    const validatorName = operationMode ? `_${data.name}${operationMode}` : data.name;

    return localize.msg(`lion-validate:${data.type}.${validatorName}`, data);
  }
  return '';
};
