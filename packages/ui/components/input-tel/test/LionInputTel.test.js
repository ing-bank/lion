import { runInputTelSuite } from '@lion/ui/test-suites/input-tel.js';
import { LionInputTel } from '@lion/ui/input-tel.js';

runInputTelSuite();
runInputTelSuite({ classes: { host: LionInputTel }, hasParentheses: true });
