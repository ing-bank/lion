import type { SrExpectation, SrPhraseList, SrReader } from './index.js';

/** Expect the spoken phrase log to match `phrases` one to one. */
export function exact(...phrases: string[]): Extract<SrPhraseList, { mode: 'exact' }>;

/** Expect `phrases` to appear in the spoken phrase log, in this order. */
export function contains(...phrases: string[]): Extract<SrPhraseList, { mode: 'contains' }>;

export interface ScreenreaderCommands {
  /**
   * Focus the control a component delegates focus to, so the screen reader talks
   * about that control (a real reader follows OS focus).
   */
  focus(selector: string): Promise<void>;
  /** Start the screen reader bound to this run, returns which reader is active. */
  initialize(): Promise<SrReader>;
  /** Stop the screen reader. */
  stop(): Promise<void>;
  /** Clear the spoken phrase log so an expectation only sees this state. */
  reset(): Promise<void>;
  /** Every phrase the screen reader spoke since the last reset. */
  phraseLog(): Promise<string[]>;
  /** The text of the item the screen reader is on. */
  itemText(): Promise<string>;
  /**
   * Wait until `phrase` (case insensitive substring) shows up in the spoken
   * phrase log, so a test never depends on a fixed sleep.
   */
  waitFor(phrase: string, options?: { timeout?: number }): Promise<string[]>;
  /**
   * Assert that the reader speaks what `expectation[reader]` describes, with
   * every reader in `expectation` required.
   */
  expect(expectation: SrExpectation): Promise<void>;
  /** Send a key through the screen reader. */
  press(key: string): Promise<void>;
  /** Type text through the screen reader. */
  type(text: string): Promise<void>;
  /** Move to the next item. */
  next(count?: number): Promise<void>;
  /** Move to the previous item. */
  previous(count?: number): Promise<void>;
  /** Activate the current item. */
  act(): Promise<void>;
  /** Start interacting with the current item. */
  interact(): Promise<void>;
  /** Stop interacting with the current item. */
  stopInteracting(): Promise<void>;
}

declare const sr: ScreenreaderCommands;
export default sr;
