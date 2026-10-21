#!/bin/bash

BASEDIR=.
CLOSURE_LIBRARY_DIR=${BASEDIR}/node_modules/google-closure-library

COMPILATION_LEVEL=ADVANCED

node_modules/.bin/google-closure-compiler \
  --compilation_level=${COMPILATION_LEVEL} \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/array/array.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/asserts/asserts.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/asserts/dom.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/base.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/debug/error.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/dom/asserts.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/dom/element.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/dom/htmlelement.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/dom/nodetype.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/dom/safe.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/dom/tagname.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/dom/tags.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/flags/flags.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/fs/blob.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/fs/url.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/functions/functions.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/html/safehtml.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/html/safescript.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/html/safestyle.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/html/safestylesheet.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/html/safeurl.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/html/trustedresourceurl.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/html/trustedtypes.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/html/uncheckedconversions.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/i18n/bidi.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/labs/useragent/browser.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/labs/useragent/util.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/labs/useragent/useragent.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/labs/useragent/highentropy/highentropyvalue.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/labs/useragent/highentropy/highentropydata.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/object/object.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/proto2/descriptor.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/proto2/fielddescriptor.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/proto2/lazydeserializer.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/proto2/message.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/proto2/pbliteserializer.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/proto2/serializer.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/string/const.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/string/internal.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/string/string.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/string/stringbuffer.js \
  --js=${CLOSURE_LIBRARY_DIR}/closure/goog/string/typedstring.js \
  --js="build/libphonenumber/javascript/i18n/phonenumbers/**.js" \
  --js="!build/libphonenumber/javascript/i18n/phonenumbers/**_test.js" \
  --js="!build/libphonenumber/javascript/i18n/phonenumbers/demo*.js" \
  --js="!build/libphonenumber/javascript/i18n/phonenumbers/metadatafortesting.js" \
  --js="!build/libphonenumber/javascript/i18n/phonenumbers/metadatalite.js" \
  --js="!build/libphonenumber/javascript/i18n/phonenumbers/regioncodefortesting.js" \
  --js=src/index.js \
  --rewrite_polyfills=no \
  --emit_use_strict=no \
  --assume_function_wrapper \
  --output_wrapper_file=src/output-wrapper.js \
  --language_out=ECMASCRIPT_2015 \
  --chunk_output_type=GLOBAL_NAMESPACE \
  --module_resolution=NODE \
  --js_output_file=lib/index.js
