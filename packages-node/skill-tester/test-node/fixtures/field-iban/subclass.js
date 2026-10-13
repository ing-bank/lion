// ACCEPTED. The subclass shape, taken verbatim from a real failing artifact (deepseek-v4-flash
// sample 4) — it satisfies the prompt, and a probe proved it in a browser: an upgraded LionInputIban
// carrying the label and the prefill. It was failed by the over-strict check, which is the bug this
// fixture exists to prevent recurring.
import { LionInputIban } from '@lion/ui/input-iban.js';

export class MyIbanField extends LionInputIban {
  constructor() {
    super();
    this.label = 'Account';
    this.modelValue = 'NL17INGB0002822608';
  }
}
