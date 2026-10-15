async function checkPhoneSources() {
  const { verifySources } = await import('@lion/awesome-phonenumber/scripts/verify-sources.js');
  const provenance = await verifySources();
  console.log(
    `[lint:phone-number-up-to-date] Verified locally maintained ${provenance.name}@${provenance.version} sources (${provenance.libphonenumberVersion}). Registry freshness is not checked; see packages-node/awesome-phonenumber/README.md for upstream review and removal.`,
  );
}

checkPhoneSources().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
