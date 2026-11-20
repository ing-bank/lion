/**
 * Per session observations of what the screen reader spoke, recorded by the
 * plugin through `sr-observe` and printed by the reporter.
 *
 * @typedef {import('../types/index.js').SrObservation} SrObservation
 */

/** @type {Map<string, SrObservation[]>} */
const transcripts = new Map();

/**
 * @param {string} sessionId
 */
export function resetObservations(sessionId) {
  transcripts.set(sessionId, []);
}

/**
 * @param {string} sessionId
 * @param {SrObservation} observation
 */
export function recordObservation(sessionId, observation) {
  const observations = transcripts.get(sessionId) ?? [];
  observations.push(observation);
  transcripts.set(sessionId, observations);
}

/**
 * @param {string} sessionId
 * @returns {SrObservation[]}
 */
export function getObservations(sessionId) {
  return transcripts.get(sessionId) ?? [];
}
