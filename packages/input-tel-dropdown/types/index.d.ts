import { RegionCode } from '@lion/input-tel/types';
import { LionSelectRich } from '@lion/select-rich';
import { LionCombobox } from '@lion/combobox';

type RefTemplateData = {
  ref?: { value?: HTMLElement };
  props?: { [key: string]: any };
  listeners?: { [key: string]: any };
  labels?: { [key: string]: any };
};

export type RegionMeta = {
  countryCode: number;
  regionCode: RegionCode;
  nameForRegion?: string;
  nameForLocale?: string;
  flagSymbol: string;
};

export type OnDropdownChangeEvent = Event & {
  target: { value?: string; modelValue?: string; _overlayCtrl?: OverlayController };
  detail?: { initialize: boolean };
};

export type DropdownRef = { value: HTMLSelectElement | LionSelectRich | LionCombobox | undefined };

export type TemplateDataForDropdownInputTel = {
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
  };
  data: {
    activeRegion: string | undefined;
    regionMetaList: RegionMeta[];
    regionMetaListPreferred: RegionMeta[];
  };
};
