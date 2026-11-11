/* eslint-disable import/no-extraneous-dependencies */
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { loadDefaultFeedbackMessagesNoSideEffects } from './loadDefaultFeedbackMessagesNoSideEffects.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 */

export function loadDefaultFeedbackMessages() {
  return loadDefaultFeedbackMessagesNoSideEffects({ localize: getLocalizeManager() });
}
