// eslint-disable-next-line import/no-extraneous-dependencies
import { executeServerCommand } from '@web/test-runner-commands';

/**
 * Screen reader commands for use in browser tests.
 * These commands communicate with the WTR plugin via executeServerCommand.
 */
export default {
  // ============ Lifecycle Commands ============
  /**
   * Initialize the screen reader
   * @param {{ screenReader?: 'virtual' | 'voiceover' | 'nvda' }} [options]
   */
  initialize: ({ screenReader = 'virtual' } = {}) =>
    executeServerCommand('sr-initialize', { screenReader }),

  /** Stop the screen reader */
  stop: () => executeServerCommand('sr-stop'),

  // ============ Speech/Phrase Log Commands ============
  /** Get all spoken phrases */
  spokenPhraseLog: () => executeServerCommand('sr-spokenPhraseLog'),

  /** Clear the spoken phrase log */
  clearSpokenPhraseLog: () => executeServerCommand('sr-clearSpokenPhraseLog'),

  /** Get the last spoken phrase */
  lastSpokenPhrase: () => executeServerCommand('sr-lastSpokenPhrase'),

  /** Get current item text */
  itemText: () => executeServerCommand('sr-itemText'),

  /** Get item text log */
  itemTextLog: () => executeServerCommand('sr-itemTextLog'),

  /** Clear item text log */
  clearItemTextLog: () => executeServerCommand('sr-clearItemTextLog'),

  // ============ Navigation Commands ============
  /** Move to next item */
  next: () => executeServerCommand('sr-next'),

  /** Move to previous item */
  previous: () => executeServerCommand('sr-previous'),

  /** Activate current item */
  act: () => executeServerCommand('sr-act'),

  /** Move to top of document */
  moveToTop: () => executeServerCommand('sr-moveToTop'),

  /** Move to bottom of document */
  moveToBottom: () => executeServerCommand('sr-moveToBottom'),

  // ============ Interaction Commands ============
  /**
   * Click
   * @param {{ options?: any }} [payload]
   */
  click: (payload = {}) => executeServerCommand('sr-click', payload),

  /**
   * Press a key
   * @param {string} key
   */
  press: key => executeServerCommand('sr-press', { key }),

  /**
   * Type text
   * @param {string} text
   */
  type: text => executeServerCommand('sr-type', { text }),

  /**
   * Perform a command
   * @param {any} command
   */
  perform: command => executeServerCommand('sr-perform', { command }),

  /** Enter interaction mode */
  interact: () => executeServerCommand('sr-interact'),

  /** Exit interaction mode */
  stopInteracting: () => executeServerCommand('sr-stopInteracting'),

  // ============ Element Navigation Commands ============
  /** Find next button */
  findNextButton: () => executeServerCommand('sr-findNextButton'),

  /** Find previous button */
  findPreviousButton: () => executeServerCommand('sr-findPreviousButton'),

  /** Find next heading */
  findNextHeading: () => executeServerCommand('sr-findNextHeading'),

  /** Find previous heading */
  findPreviousHeading: () => executeServerCommand('sr-findPreviousHeading'),

  /** Find next link */
  findNextLink: () => executeServerCommand('sr-findNextLink'),

  /** Find previous link */
  findPreviousLink: () => executeServerCommand('sr-findPreviousLink'),

  /** Find next form control */
  findNextFormControl: () => executeServerCommand('sr-findNextFormControl'),

  /** Find previous form control */
  findPreviousFormControl: () => executeServerCommand('sr-findPreviousFormControl'),

  /** Find next landmark */
  findNextLandmark: () => executeServerCommand('sr-findNextLandmark'),

  /** Find previous landmark */
  findPreviousLandmark: () => executeServerCommand('sr-findPreviousLandmark'),

  /** Find next list */
  findNextList: () => executeServerCommand('sr-findNextList'),

  /** Find previous list */
  findPreviousList: () => executeServerCommand('sr-findPreviousList'),

  /** Find next table */
  findNextTable: () => executeServerCommand('sr-findNextTable'),

  /** Find previous table */
  findPreviousTable: () => executeServerCommand('sr-findPreviousTable'),

  // ============ Info Commands ============
  /** Get screen reader info (name, version, state) */
  getScreenreaderInfo: () => executeServerCommand('sr-getScreenreaderInfo'),
};
