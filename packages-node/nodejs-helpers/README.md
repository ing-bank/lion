# Node.js helpers

## Why?

To share the common code we use in our Node.js scripts and products.

## What?

Node.js helpers is a public package, yet will always stay alpha version.
The idea here is to share common code(DRY) and tasks with extenders of lion, like ing-web.
It consists of helpers and utilities, specific to our use cases, and not intended to be general purpose library.

> **Example use case:** Assume package-x extends @lion/ui and package-x wants to bypass the requirement of export/import map support. In that case same bypass must be done at @lion/ui side as well.

## How?

Don't try to predict and write a utility function, in other words, add utilities if and when needed.

Keep the APIs simple, extendable, yet specific to our use cases(KISS), in other words, don't write a generic utility.

Put shared tasks between lion and ing-web(extends lion) here.
