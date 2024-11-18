const { nvda } = require('@guidepup/guidepup');

(async () => {
  // Start NVDA.
  await nvda.start();

  // Move to the next item.
  await nvda.next();

  // Stop NVDA.
  await nvda.stop();
})();
