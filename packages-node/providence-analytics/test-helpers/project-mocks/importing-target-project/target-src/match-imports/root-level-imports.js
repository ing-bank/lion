/* eslint-disable */

// named import (indirect, needs transitivity check)
import { RefClass } from 'exporting-ref-project';

// renamed import (indirect, needs transitivity check)
import { RefRenamedClass } from 'exporting-ref-project';

// default (indirect, needs transitivity check)
import refConstImported from 'exporting-ref-project';

// should not be found
import { nonMatched } from 'unknown-project';
