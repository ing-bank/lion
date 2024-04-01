/* eslint-disable max-classes-per-file */
/**
 * @typedef {import('@lion/ui/localize.js').LocalizeManager} LocalizeManager
 * @typedef {import('../../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 */

import { Unparseable } from '@lion/ui/form-core.js';
import { IsIBAN, IsCountryIBAN, IsNotCountryIBAN } from '@lion/ui/input-iban.js';
import { loadValidateNamespace } from '../getLocalizedMessage.js';

let isLoaded = false;

/**
 * @param {{localize: LocalizeManager}} opts allow multiple lion/extension lib versions to provide their deduped instance of LocalizeManager
 */
export function loadInputIBANMessagesNoSideEffects({ localize }) {
  if (isLoaded === true) return;

  /* @param {FeedbackMessageData} data */

  IsIBAN.getMessage = async data => {
    await loadValidateNamespace({ localize });
    return localize.msg('lion-validate+iban:error.IsIBAN', data);
  };
  IsCountryIBAN.getMessage = async data => {
    await loadValidateNamespace({ localize });
    // If modelValue is Unparseable, the IsIBAN message is the more appropriate feedback
    return data?.modelValue instanceof Unparseable
      ? localize.msg('lion-validate+iban:error.IsIBAN', data)
      : localize.msg('lion-validate+iban:error.IsCountryIBAN', data);
  };
  IsNotCountryIBAN.getMessage = async data => {
    await loadValidateNamespace({ localize });
    const _data = {
      ...data,
      userSuppliedCountryCode:
        typeof data?.modelValue === 'string' ? data?.modelValue.slice(0, 2) : '',
    };
    // If modelValue is Unparseable, the IsIBAN message is the more appropriate feedback
    return data?.modelValue instanceof Unparseable
      ? localize.msg('lion-validate+iban:error.IsIBAN', _data)
      : localize.msg('lion-validate+iban:error.IsNotCountryIBAN', _data);
  };

  isLoaded = true;
}
