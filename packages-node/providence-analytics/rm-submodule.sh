#!/usr/bin/env bash

# See https://gist.github.com/myusuf3/7f645819ded92bda6677

if [ -z "$1" ]; then
    echo "Please define 'path/to/submodule'";
    exit;
fi

# Remove the submodule entry from .git/config
git submodule deinit -f $1

# Remove the submodule directory from the superproject's .git/modules directory
rm -rf .git/modules/$1

# Remove the entry in .gitmodules and remove the submodule directory located at path/to/submodule
git rm -rf $1
