/**
 * @typedef {import('@web/test-runner-core').Reporter} Reporter
 */

import { getObservations } from './transcripts.js';

const CHECK_MARK = '✓';
const CROSS_MARK = '✗';

/**
 * Prints, per test file, what the screen reader spoke for every sr.expect()
 * call. The failure message of a test already carries the mismatch; this is
 * there to see the full transcript of a run, including the runs that passed.
 *
 * @returns {Reporter}
 */
export function screenreaderReporter() {
  return {
    reportTestFileResults({ logger, sessionsForTestFile, testFile }) {
      for (const session of sessionsForTestFile) {
        const observations = getObservations(session.id);
        if (observations.length === 0) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const header = `screen reader transcripts — ${session.browser.name} — ${testFile}`;
        const lines = [header, '-'.repeat(header.length)];
        observations.forEach((observation, index) => {
          const mark = observation.ok ? CHECK_MARK : CROSS_MARK;
          lines.push(
            `${mark} #${index + 1} ${observation.reader} (${observation.mode}) spoke ${
              observation.heard.length
            } phrase(s)`,
          );
          lines.push(`    heard: ${observation.heard.map(phrase => `"${phrase}"`).join(' | ')}`);
        });
        logger.log(lines.join('\n'));
      }
    },
  };
}
