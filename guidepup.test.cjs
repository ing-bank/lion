const { voiceOver } = require('@guidepup/guidepup');

(async () => {
  // Start VoiceOver.
  await voiceOver.start();

  // Move to the next item.
  await voiceOver.next();

  // Stop VoiceOver.
  await voiceOver.stop();
})();
