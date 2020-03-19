// eslint-disable-next-line import/no-extraneous-dependencies
import { fixture, aTimeout } from '@open-wc/testing';

export async function formFixture(...args) {
  const el = await fixture(...args);
  if (el.registrationComplete) {
    await el.registrationComplete;
    await aTimeout();
  }
  return el;
}
