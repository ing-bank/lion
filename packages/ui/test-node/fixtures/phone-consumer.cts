import phone = require('#awesome-phonenumber');

const format: phone.PhoneNumberFormat = 'e164';
const parsed = phone.parsePhoneNumber('+594890123456');
const number: string | undefined = parsed.number?.[format];
void number;
