import { InputDataService } from '#core/InputDataService.js';
import { QueryService } from '#core/QueryService.js';
import { restoreMockedProjects } from '#test-helpers/mock-project-helpers.js';
import {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} from '#test-helpers/mock-log-service-helpers.js';
import { memoize } from '#utils/memoize.js';

/**
 * @typedef {import('#types/index.js').QueryResult} QueryResult
 */

let hasRunBefore = false;

export function setupAnalyzerTest() {
  if (hasRunBefore) {
    return;
  }

  const originalReferenceProjectPaths = InputDataService.referenceProjectPaths;
  const cacheDisabledQInitialValue = QueryService.cacheDisabled;
  const cacheEnabledIInitialValue = memoize.isCacheEnabled;

  before(() => {
    QueryService.cacheDisabled = true;
    memoize.disableCaching();
    suppressNonCriticalLogs();
  });

  after(() => {
    QueryService.cacheDisabled = cacheDisabledQInitialValue;
    memoize.restoreCaching(cacheEnabledIInitialValue);
    restoreSuppressNonCriticalLogs();
  });

  beforeEach(() => {
    InputDataService.referenceProjectPaths = [];
  });

  afterEach(() => {
    InputDataService.referenceProjectPaths = originalReferenceProjectPaths;
    restoreMockedProjects();
  });

  hasRunBefore = true;
}
