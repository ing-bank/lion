/**
 * This country to currency list was exported from Java.
 * Java contains a country:currency map according to the i18n spec, but JS does not.
 *
 * @type {import("../types/index.js").countryToCurrencyList}
 *
 * @example
 * // The following Java code can be used to export the countryToCurrencyList
 *
 * import java.util.Currency;
 * import java.util.Locale;
 *
 * public class Main {
 *     public static void main(String[] args) {
 *         // get all ISO countries
 *         String[] ISOCountryCodes = Locale.getISOCountries();
 *
 *         // loop over all the countries.
 *         for (String country : ISOCountryCodes) {
 *             try {
 *                 // get the locale for said country
 *                 Locale locale = new Locale("", country);
 *
 *                 // creates a Currency instance which has a bunch of standardized information.
 *                 // from that class we can get the currency linked to the country.
 *                 String currencyCode = Currency.getInstance(locale).getCurrencyCode();
 *
 *                 // prints to the console, which can be copied to update the map if changes occurred
 *                 String output = country + ": '" + currencyCode + "',\n";
 *                 System.out.print(output);
 *             } catch (Exception e) {
 *             }
 *         }
 *     }
 * }
 */
const countryToCurrencyList = {
  AD: 'EUR',
  AE: 'AED',
  AF: 'AFN',
  AG: 'XCD',
  AI: 'XCD',
  AL: 'ALL',
  AM: 'AMD',
  AO: 'AOA',
  AR: 'ARS',
  AS: 'USD',
  AT: 'EUR',
  AU: 'AUD',
  AW: 'AWG',
  AX: 'EUR',
  AZ: 'AZN',
  BA: 'BAM',
  BB: 'BBD',
  BD: 'BDT',
  BE: 'EUR',
  BF: 'XOF',
  BG: 'BGN',
  BH: 'BHD',
  BI: 'BIF',
  BJ: 'XOF',
  BL: 'EUR',
  BM: 'BMD',
  BN: 'BND',
  BO: 'BOB',
  BQ: 'USD',
  BR: 'BRL',
  BS: 'BSD',
  BT: 'BTN',
  BV: 'NOK',
  BW: 'BWP',
  BY: 'BYN',
  BZ: 'BZD',
  CA: 'CAD',
  CC: 'AUD',
  CD: 'CDF',
  CF: 'XAF',
  CG: 'XAF',
  CH: 'CHF',
  CI: 'XOF',
  CK: 'NZD',
  CL: 'CLP',
  CM: 'XAF',
  CN: 'CNY',
  CO: 'COP',
  CR: 'CRC',
  CU: 'CUP',
  CV: 'CVE',
  CW: 'XCG',
  CX: 'AUD',
  CY: 'EUR',
  CZ: 'CZK',
  DE: 'EUR',
  DJ: 'DJF',
  DK: 'DKK',
  DM: 'XCD',
  DO: 'DOP',
  DZ: 'DZD',
  EC: 'USD',
  EE: 'EUR',
  EG: 'EGP',
  EH: 'MAD',
  ER: 'ERN',
  ES: 'EUR',
  ET: 'ETB',
  FI: 'EUR',
  FJ: 'FJD',
  FK: 'FKP',
  FM: 'USD',
  FO: 'DKK',
  FR: 'EUR',
  GA: 'XAF',
  GB: 'GBP',
  GD: 'XCD',
  GE: 'GEL',
  GF: 'EUR',
  GG: 'GBP',
  GH: 'GHS',
  GI: 'GIP',
  GL: 'DKK',
  GM: 'GMD',
  GN: 'GNF',
  GP: 'EUR',
  GQ: 'XAF',
  GR: 'EUR',
  GS: 'GBP',
  GT: 'GTQ',
  GU: 'USD',
  GW: 'XOF',
  GY: 'GYD',
  HK: 'HKD',
  HM: 'AUD',
  HN: 'HNL',
  HR: 'EUR',
  HT: 'HTG',
  HU: 'HUF',
  ID: 'IDR',
  IE: 'EUR',
  IL: 'ILS',
  IM: 'GBP',
  IN: 'INR',
  IO: 'USD',
  IQ: 'IQD',
  IR: 'IRR',
  IS: 'ISK',
  IT: 'EUR',
  JE: 'GBP',
  JM: 'JMD',
  JO: 'JOD',
  JP: 'JPY',
  KE: 'KES',
  KG: 'KGS',
  KH: 'KHR',
  KI: 'AUD',
  KM: 'KMF',
  KN: 'XCD',
  KP: 'KPW',
  KR: 'KRW',
  KW: 'KWD',
  KY: 'KYD',
  KZ: 'KZT',
  LA: 'LAK',
  LB: 'LBP',
  LC: 'XCD',
  LI: 'CHF',
  LK: 'LKR',
  LR: 'LRD',
  LS: 'LSL',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  LY: 'LYD',
  MA: 'MAD',
  MC: 'EUR',
  MD: 'MDL',
  ME: 'EUR',
  MF: 'EUR',
  MG: 'MGA',
  MH: 'USD',
  MK: 'MKD',
  ML: 'XOF',
  MM: 'MMK',
  MN: 'MNT',
  MO: 'MOP',
  MP: 'USD',
  MQ: 'EUR',
  MR: 'MRU',
  MS: 'XCD',
  MT: 'EUR',
  MU: 'MUR',
  MV: 'MVR',
  MW: 'MWK',
  MX: 'MXN',
  MY: 'MYR',
  MZ: 'MZN',
  NA: 'NAD',
  NC: 'XPF',
  NE: 'XOF',
  NF: 'AUD',
  NG: 'NGN',
  NI: 'NIO',
  NL: 'EUR',
  NO: 'NOK',
  NP: 'NPR',
  NR: 'AUD',
  NU: 'NZD',
  NZ: 'NZD',
  OM: 'OMR',
  PA: 'PAB',
  PE: 'PEN',
  PF: 'XPF',
  PG: 'PGK',
  PH: 'PHP',
  PK: 'PKR',
  PL: 'PLN',
  PM: 'EUR',
  PN: 'NZD',
  PR: 'USD',
  PS: 'ILS',
  PT: 'EUR',
  PW: 'USD',
  PY: 'PYG',
  QA: 'QAR',
  RE: 'EUR',
  RO: 'RON',
  RS: 'RSD',
  RU: 'RUB',
  RW: 'RWF',
  SA: 'SAR',
  SB: 'SBD',
  SC: 'SCR',
  SD: 'SDG',
  SE: 'SEK',
  SG: 'SGD',
  SH: 'SHP',
  SI: 'EUR',
  SJ: 'NOK',
  SK: 'EUR',
  SL: 'SLE',
  SM: 'EUR',
  SN: 'XOF',
  SO: 'SOS',
  SR: 'SRD',
  SS: 'SSP',
  ST: 'STN',
  SV: 'SVC',
  SX: 'XCG',
  SY: 'SYP',
  SZ: 'SZL',
  TC: 'USD',
  TD: 'XAF',
  TF: 'EUR',
  TG: 'XOF',
  TH: 'THB',
  TJ: 'TJS',
  TK: 'NZD',
  TL: 'USD',
  TM: 'TMT',
  TN: 'TND',
  TO: 'TOP',
  TR: 'TRY',
  TT: 'TTD',
  TV: 'AUD',
  TW: 'TWD',
  TZ: 'TZS',
  UA: 'UAH',
  UG: 'UGX',
  UM: 'USD',
  US: 'USD',
  UY: 'UYU',
  UZ: 'UZS',
  VA: 'EUR',
  VC: 'XCD',
  VE: 'VES',
  VG: 'USD',
  VI: 'USD',
  VN: 'VND',
  VU: 'VUV',
  WF: 'XPF',
  WS: 'WST',
  YE: 'YER',
  YT: 'EUR',
  ZA: 'ZAR',
  ZM: 'ZMW',
  ZW: 'ZWG',
};

/**
 * Map containing all countries and its corresponding currency, following the i18n standard.
 * @type {import("../types/index.js").RegionToCurrencyMap}
 */
const countryToCurrencyMap = /** @type {import("../types/index.js").RegionToCurrencyMap} */ (
  new Map(Object.entries(countryToCurrencyList))
);

/**
 * Set with all possible currencies derived from the i18n standard.
 * @type {import("../types/index.js").AllCurrenciesSet}
 */
const allCurrencies = new Set(Object.values(countryToCurrencyList).sort());

/**
 * Matches a currency symbol to a currency code, with a given locale based on Intl.numberFormat.
 * @param {import("./LionInputAmountDropdown.js").CurrencyCode} currency
 * @param {string} locale
 * @returns {string}
 */
const getCurrencySymbol = (currency, locale) => {
  if (!locale || !currency) {
    return '';
  }

  return (
    new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(1)
      .find(x => x.type === 'currency')?.value || ''
  );
};

export const currencyUtil = {
  countryToCurrencyMap,
  allCurrencies,
  getCurrencySymbol,
};
