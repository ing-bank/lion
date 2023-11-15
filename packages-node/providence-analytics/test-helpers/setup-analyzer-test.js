import { InputDataService } from '../src/program/core/InputDataService.js';
import { QueryService } from '../src/program/core/QueryService.js';
import { restoreMockedProjects } from './mock-project-helpers.js';
import {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} from './mock-log-service-helpers.js';
import { memoizeConfig } from '../src/program/utils/memoize.js';

/**
 * @typedef {import('../types/index.js').QueryResult} QueryResult
 */

let hasRunBefore = false;

export function setupAnalyzerTest() {
  if (hasRunBefore) {
    return;
  }

  const originalReferenceProjectPaths = InputDataService.referenceProjectPaths;
  const cacheDisabledQInitialValue = QueryService.cacheDisabled;
  const cacheDisabledIInitialValue = memoizeConfig.isCacheDisabled;

  before(() => {
    QueryService.cacheDisabled = true;
    memoizeConfig.isCacheDisabled = true;
    suppressNonCriticalLogs();
  });

  after(() => {
    QueryService.cacheDisabled = cacheDisabledQInitialValue;
    memoizeConfig.isCacheDisabled = cacheDisabledIInitialValue;
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
