import { parsePhoneNumber, type PhoneNumberFormat } from '#awesome-phonenumber';
import type { PhoneNumberFormat as EmittedPhoneNumberFormat } from './dist-types/components/input-tel/src/formatters.js';

const format: PhoneNumberFormat = 'e164';
const parsed = parsePhoneNumber('+594890123456');
const number: string | undefined = parsed.number?.[format];
void number;
const phoneFormat: EmittedPhoneNumberFormat = format;
void phoneFormat;
