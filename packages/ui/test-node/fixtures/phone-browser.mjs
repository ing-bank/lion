import { PhoneUtilManager } from './components/input-tel/src/PhoneUtilManager.js';

await PhoneUtilManager.loadComplete;
const parsed = PhoneUtilManager.PhoneUtil.parsePhoneNumber('+594890123456');
if (!parsed.valid || parsed.regionCode !== 'GF' || parsed.type !== 'premium-rate') {
  throw new Error('The browser bundle did not preserve libphonenumber v9.0.41 metadata.');
}
