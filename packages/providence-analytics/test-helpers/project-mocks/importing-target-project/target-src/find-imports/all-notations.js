/* eslint-disable */
// ImportDeclaration without specifiers
import 'imported/source';
// ImportDeclaration with default specifier
import a from 'imported/source-a';
// ImportDeclaration with named specifier
import { b } from 'imported/source-b';
// ImportDeclaration with multiple named specifiers
import { c, d } from 'imported/source-c';
// ImportDeclaration with default and named specifiers
import e, { f, g } from 'imported/source-d';

// Internal file import
import '../match-imports/deep-imports'; // Notice extension is missing, will be auto resolved

// Dynamic import
import('my/source-e');

// Dynamic import with variables. TODO: how to handle?
const variable = 'f';
import(`my/source${variable}`);

// namespaced
import * as all from 'imported/source-g';
