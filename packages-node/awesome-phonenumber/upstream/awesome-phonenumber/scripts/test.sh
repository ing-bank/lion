#!/bin/bash

rm -rf test
cp -r test.in test

node_modules/.bin/tsc -p . --declaration false
