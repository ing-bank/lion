/* eslint-disable import/no-extraneous-dependencies */
import { loadComboboxMessagesNoSideEffects } from './per-entrypoint/loadComboboxMessagesNoSideEffects.js';
import { loadFormCoreMessagesNoSideEffects } from './per-entrypoint/loadFormCoreMessagesNoSideEffects.js';
import { loadInputIBANMessagesNoSideEffects } from './per-entrypoint/loadInputIBANMessagesNoSideEffects.js';
import { loadInputTelMessagesNoSideEffects } from './per-entrypoint/loadInputTelMessagesNoSideEffects.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 * @typedef {import('@lion/ui/localize.js').LocalizeManager} LocalizeManager
 */

let isLoaded = false;

/**
 * @param {{localize: LocalizeManager}} opts allow multiple lion/extension lib versions to provide their deduped instance of LocalizeManager
 * @returns
 */
export function loadDefaultFeedbackMessagesNoSideEffects({ localize }) {
  if (isLoaded === true) {
    return;
  }

  loadComboboxMessagesNoSideEffects({ localize });
  loadFormCoreMessagesNoSideEffects({ localize });
  loadInputTelMessagesNoSideEffects({ localize });
  loadInputIBANMessagesNoSideEffects({ localize });

  isLoaded = true;
}
