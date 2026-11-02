import { runInputTelSuite } from '@lion/ui/input-tel-test-suites.js';
import { LionInputTel } from '@lion/ui/input-tel.js';

runInputTelSuite();
runInputTelSuite({ classes: { host: LionInputTel }, hasParentheses: true });
