import { RegionCode } from '../../input-tel/types/index.js';
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
