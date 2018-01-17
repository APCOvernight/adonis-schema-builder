# Adonis Schema Builder

[![NPM Package](https://img.shields.io/npm/v/adonis-schema-builder.svg?maxAge=2592000)](https://npmjs.com/package/adonis-schema-builder) ![License](https://img.shields.io/npm/l/adonis-schema-builder.svg) [![Build Status](https://travis-ci.org/APCOvernight/adonis-schema-builder.svg?branch=master)](https://travis-ci.org/APCOvernight/adonis-schema-builder) [![Coverage Status](https://coveralls.io/repos/github/APCOvernight/adonis-schema-builder/badge.svg?branch=master)](https://coveralls.io/github/APCOvernight/adonis-schema-builder?branch=master) [![Maintainability](	https://img.shields.io/codeclimate/maintainability/APCOvernight/adonis-schema-builder.svg)](https://codeclimate.com/github/APCOvernight/adonis-schema-builder/maintainability) 
[![Dependencies](https://img.shields.io/david/APCOvernight/adonis-schema-builder.svg)](https://david-dm.org/APCOvernight/adonis-schema-builder) [![Greenkeeper badge](https://badges.greenkeeper.io/APCOvernight/adonis-schema-builder.svg)](https://greenkeeper.io/)

Build adonis migrations, factories and models with pre-configured relationships from Database Schema.

Based on a [schema-builder for laravel](https://github.com/Agontuk/schema-builder) and using the same schema format as [schema-builder](https://agontuk.github.io/schema-designer/).

## Installation

This package works with AdonisJS v4. In your project directory you'll need ace, fold and cli installed:

```
npm install --save @adonisjs/ace @adonisjs/cli @adonisjs/fold
```

These are all peer dependencies so you will get a warning from NPM if they're not installed first. Then install adonis-schema-builder:

```
npm install --save adonis-schema-builder
```

Add the following to your `aceProviders` array in `start/app.js`:

```js
'adonis-schema-builder/providers/BuilderProvider'
```

You should now see the `schema:build` option when running `adonis` or `ace`.

## How to use

### Creating a Schema

Use the [schema-builder GUI](https://agontuk.github.io/schema-designer/) to design your schema, and export as JSON. All of the table and column options in the schema builder are supported, although some column types might be substituted to supported Knex types.

### Importing the Schema

Run `adonis schema:build <path to schema file>` in your project root to import the schema file and generate source files. You will be asked to confirm before overwriting any existing files.

### Generated files

- A create table migration for each table.
- A model for each table (except link tables) including validator and sanitisation rules and relationships.
- A factory js file, with a blueprint for each model.

### Caveats

- Link tables - link tables (tables that exist only to join other models) must be denoted with an underscore (i.e. posts_categories).
- Soft Deletes - Currently not supported in V4, but should be added soon.

## Upcoming features

- Validator message - Messages corresponding to validator rules
- Seeds - use the factories to create a seed file that creates entities that follow the relationship rules.
- Tests - generate integration tests to check that models and factories are set up correctly and are compatible with adonis-lucid.
