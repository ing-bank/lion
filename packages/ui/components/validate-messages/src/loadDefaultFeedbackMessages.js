/* eslint-disable import/no-extraneous-dependencies */
import { localize } from '@lion/ui/localize.js';
import { loadDefaultFeedbackMessagesNoSideEffects } from './loadDefaultFeedbackMessagesNoSideEffects.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 */

export function loadDefaultFeedbackMessages() {
  return loadDefaultFeedbackMessagesNoSideEffects({ localize });
}
