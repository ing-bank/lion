/* eslint-disable import/no-extraneous-dependencies */
import { MatchesOption } from '@lion/ui/combobox.js';
import { getLocalizedMessage } from '../getLocalizedMessage.js';

/**
 * @typedef {import('../../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 * @typedef {import('@lion/ui/localize.js').LocalizeManager} LocalizeManager
 */

let isLoaded = false;

/**
 * @param {{localize: LocalizeManager}} opts allow multiple lion/extension lib versions to provide their deduped instance of LocalizeManager
 */
export function loadComboboxMessagesNoSideEffects({ localize }) {
  if (isLoaded === true) return;

  /** @param {FeedbackMessageData} data */
  MatchesOption.getMessage = async data => getLocalizedMessage({ data, localize });

  isLoaded = true;
}
