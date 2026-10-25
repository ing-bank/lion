/* eslint-disable no-console */
/**
 * Diagnostic: does the screen reader stay alive on its own, outside of the test
 * run and without a browser? Prints the phrase log once a second, so a reader
 * that starts and then goes away ("NVDA is not running") is visible per second
 * instead of as a timeout halfway through a test.
 *
 * Usage: node scripts/screenreader-smoke.js nvda|voiceover [seconds]
 */
const readerName = process.argv[2] ?? 'nvda';
const seconds = Number(process.argv[3] ?? 10);

const log = (...args) => {
  console.log(`[smoke ${readerName}]`, ...args);
};

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const guidepupModule = '@guidepup/guidepup';
const module = await import(guidepupModule);
// The readers are named 'voiceover'/'nvda' in this flow and `voiceOver`/`nvda`
// in guidepup.
const reader = module[readerName === 'voiceover' ? 'voiceOver' : readerName];

if (!reader) {
  log(`no such reader in @guidepup/guidepup: ${readerName}`);
  process.exit(1);
}

log('detect:', typeof reader.detect === 'function' ? reader.detect() : 'n/a');

try {
  await reader.start();
  log('started');
} catch (error) {
  log('start failed:', error.message);
  process.exit(1);
}

for (let second = 1; second <= seconds; second += 1) {
  await sleep(1000);
  try {
    const phraseLog = await reader.spokenPhraseLog();
    log(`t+${second}s ok, ${Array.isArray(phraseLog) ? phraseLog.length : '?'} phrase(s)`);
  } catch (error) {
    log(`t+${second}s FAILED: ${error.message}`);
  }
}

try {
  await reader.stop();
  log('stopped');
} catch (error) {
  log('stop failed:', error.message);
}
