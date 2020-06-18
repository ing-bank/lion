/**
 * @typedef {Object} Feature
 * @property {string} [name] the name of the feature. For instance 'size'
 * @property {string} [value] the value of the feature. For instance 'xl'
 * @property {string} [memberOf] the name of the object this feature belongs to.
 *
 * @property {string} [tag] the HTML element it belongs to. Will be used in html
 * queries. This option will take precedence over 'memberOf' when configured
 * @property {boolean} [isAttribute] useful for HTML queries explicitly looking for attribute
 * name instead of property name. When false(default), query searches for properties
 * @property {boolean} [usesValueContains] when the attribute value is not an exact match
 * @property {boolean} [usesValuePartialMatch] when looking for a partial match:
 * div[class*=foo*] -> <div class="baz foo-bar">
 * @property {boolean} [usesTagPartialMatch] when looking for an exact match inside a space
 * separated list within an attr: div[class*=foo] -> <div class="baz foo bar">
 */

/**
 * @typedef {Object} QueryResult result of a query. For all projects and files, gives the
 * result of the query.
 * @property {Object} QueryResult.meta
 * @property {'ast'|'grep'} QueryResult.meta.searchType
 * @property {QueryConfig} QueryResult.meta.query
 * @property {Object[]} QueryResult.results
 * @property {string} QueryResult.queryOutput[].project project name as determined by InputDataService (based on folder name)
 * @property {number} QueryResult.queryOutput[].count
 * @property {Object[]} [QueryResult.queryOutput[].files]
 * @property {string} QueryResult.queryOutput[].files[].file
 * @property {number} QueryResult.queryOutput[].files[].line
 * @property {string} QueryResult.queryOutput[].files[].match
 */

/**
 * @typedef {object} QueryConfig an object containing keys name, value, term, tag
 * @property {string} QueryConfig.type the type of the tag we are searching for.
 * A certain type has an additional property with more detailed information about the type
 * @property {Feature} feature query details for a feature search
 */

/**
 * @typedef {Object} InputDataProject - all files found that are queryable
 * @property {string} InputDataProject.project -  the project name
 * @property {string} InputDataProject.path - the path to the project
 * @property {string[]} InputDataProject.entries - array of paths that are found within 'project' that
 * comply to the rules as configured in 'gatherFilesConfig'
 */

/**
 * @typedef {InputDataProject[]} InputData - all files found that are queryable
 */

/**
 * @typedef {Object} GatherFilesConfig
 * @property {string[]} [extensions] file extension like ['.js', '.html']
 * @property {string[]} [excludeFiles] file names filtered out
 * @property {string[]} [excludeFolders] folder names filtered outs
 */
