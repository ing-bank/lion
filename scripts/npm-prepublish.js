#!/usr/bin/env node

// insert headers in README.md
require('./insert-header.js');

// rewrite relative markdown documentation links to absolute Github links
require('./rewrite-links.js')();
