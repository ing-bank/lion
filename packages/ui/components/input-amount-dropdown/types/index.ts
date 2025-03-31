import { LionSelectRich } from '@lion/ui/select-rich.js';
import { LionCombobox } from '@lion/ui/combobox.js';
import { OverlayController } from '../../overlays/src/OverlayController.js';

type RefTemplateData = {
  ref?: { value?: HTMLElement };
  props?: { [key: string]: any };
  listeners?: { [key: string]: any };
  labels?: { [key: string]: any };
};

export type RegionMeta = {
  currencyCode: CurrencyCode;
};

export type OnDropdownChangeEvent = Event & {
  target: { value?: string; modelValue?: string; _overlayCtrl?: OverlayController };
  detail?: { initialize: boolean };
};

export type DropdownRef = { value: HTMLSelectElement | LionSelectRich | LionCombobox | undefined };

export type TemplateDataForDropdownInputAmount = {
  refs: {
    dropdown: RefTemplateData & {
      ref: DropdownRef;
      props: { style: string };
      listeners: {
        change: (event: OnDropdownChangeEvent) => void;
        'model-value-changed': (event: OnDropdownChangeEvent) => void;
      };
      labels: { selectCountry: string };
    };
    input: HTMLInputElement;
  };
  data: {
    currency: string | undefined;
    regionMetaList: RegionMeta[];
    regionMetaListPreferred: RegionMeta[];
  };
};

/**
 * All currency codes according to i18n
 */
export type CurrencyCode =
  | 'EUR'
  | 'AED'
  | 'AFN'
  | 'XCD'
  | 'ALL'
  | 'AMD'
  | 'AOA'
  | 'ARS'
  | 'USD'
  | 'AUD'
  | 'AWG'
  | 'AZN'
  | 'BAM'
  | 'BBD'
  | 'BDT'
  | 'XOF'
  | 'BGN'
  | 'BHD'
  | 'BIF'
  | 'BMD'
  | 'BND'
  | 'BOB'
  | 'BRL'
  | 'BSD'
  | 'BTN'
  | 'NOK'
  | 'BWP'
  | 'BYN'
  | 'BZD'
  | 'CAD'
  | 'CDF'
  | 'XAF'
  | 'CHF'
  | 'NZD'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'CRC'
  | 'CUP'
  | 'CVE'
  | 'ANG'
  | 'CZK'
  | 'DJF'
  | 'DKK'
  | 'DOP'
  | 'DZD'
  | 'EGP'
  | 'MAD'
  | 'ERN'
  | 'ETB'
  | 'FJD'
  | 'FKP'
  | 'GBP'
  | 'GEL'
  | 'GHS'
  | 'GIP'
  | 'GMD'
  | 'GNF'
  | 'GTQ'
  | 'GYD'
  | 'HKD'
  | 'HNL'
  | 'HTG'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'IQD'
  | 'IRR'
  | 'ISK'
  | 'JMD'
  | 'JOD'
  | 'JPY'
  | 'KES'
  | 'KGS'
  | 'KHR'
  | 'KMF'
  | 'KPW'
  | 'KRW'
  | 'KWD'
  | 'KYD'
  | 'KZT'
  | 'LAK'
  | 'LBP'
  | 'LKR'
  | 'LRD'
  | 'LSL'
  | 'LYD'
  | 'MDL'
  | 'MGA'
  | 'MKD'
  | 'MMK'
  | 'MNT'
  | 'MOP'
  | 'MRU'
  | 'MUR'
  | 'MVR'
  | 'MWK'
  | 'MXN'
  | 'MYR'
  | 'MZN'
  | 'NAD'
  | 'XPF'
  | 'NGN'
  | 'NIO'
  | 'NPR'
  | 'OMR'
  | 'PAB'
  | 'PEN'
  | 'PGK'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'PYG'
  | 'QAR'
  | 'RON'
  | 'RSD'
  | 'RUB'
  | 'RWF'
  | 'SAR'
  | 'SBD'
  | 'SCR'
  | 'SDG'
  | 'SEK'
  | 'SGD'
  | 'SHP'
  | 'SLE'
  | 'SOS'
  | 'SRD'
  | 'SSP'
  | 'STN'
  | 'SVC'
  | 'SYP'
  | 'SZL'
  | 'THB'
  | 'TJS'
  | 'TMT'
  | 'TND'
  | 'TOP'
  | 'TRY'
  | 'TTD'
  | 'TWD'
  | 'TZS'
  | 'UAH'
  | 'UGX'
  | 'UYU'
  | 'UZS'
  | 'VED'
  | 'VND'
  | 'VUV'
  | 'WST'
  | 'YER'
  | 'ZAR'
  | 'ZMW'
  | 'ZWG';
