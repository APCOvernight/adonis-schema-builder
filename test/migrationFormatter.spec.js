'use strict'

/* eslint-disable no-unused-expressions */

const chai = require('chai')
const expect = chai.expect
const MigrationFormatter = require('../src/MigrationFormatter')
const SchemaParser = require('../src/SchemaParser')

describe('Knex string builder', () => {
  it('Create a text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').notNullable()`)
  })

  it('Create a tiny text field', () => {
    const column = {
      name: 'myColumn',
      type: 'tinyText'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn', 'tinytext').notNullable()`)
  })

  it('Create a medium text field', () => {
    const column = {
      name: 'myColumn',
      type: 'mediumText'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn', 'mediumtext').notNullable()`)
  })

  it('Create a long text field', () => {
    const column = {
      name: 'myColumn',
      type: 'longText'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn', 'longtext').notNullable()`)
  })

  it('Create a string field', () => {
    const column = {
      name: 'myColumn',
      type: 'string'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.string('myColumn').notNullable()`)
  })

  it('Create a integer field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myColumn').notNullable()`)
  })

  it('Create a bigInteger field', () => {
    const column = {
      name: 'myColumn',
      type: 'bigInteger'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.bigInteger('myColumn').notNullable()`)
  })

  it('Create a tinyInteger field', () => {
    const column = {
      name: 'myColumn',
      type: 'tinyInteger'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myColumn').notNullable()`)
  })

  it('Create a date field', () => {
    const column = {
      name: 'myColumn',
      type: 'date'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.date('myColumn').notNullable()`)
  })

  it('Create a dateTime field', () => {
    const column = {
      name: 'myColumn',
      type: 'dateTime'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.dateTime('myColumn').notNullable()`)
  })

  it('Create a timestamp field', () => {
    const column = {
      name: 'myColumn',
      type: 'timestamp'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.timestamp('myColumn').notNullable()`)
  })

  it('Create a time field', () => {
    const column = {
      name: 'myColumn',
      type: 'time'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.time('myColumn').notNullable()`)
  })

  it('Create a float field', () => {
    const column = {
      name: 'myColumn',
      type: 'float'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.float('myColumn').notNullable()`)
  })

  it('Create a decimal field', () => {
    const column = {
      name: 'myColumn',
      type: 'decimal'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.decimal('myColumn').notNullable()`)
  })

  it('Create a boolean field', () => {
    const column = {
      name: 'myColumn',
      type: 'boolean'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.boolean('myColumn').notNullable()`)
  })

  it('Create a double field', () => {
    const column = {
      name: 'myColumn',
      type: 'double'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.float('myColumn').notNullable()`)
  })

  it('Create a char field', () => {
    const column = {
      name: 'myColumn',
      type: 'char'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').notNullable()`)
  })

  it('Create a text field with a length', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      length: 50
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.string('myColumn', 50).notNullable()`)
  })

  it('Create a string field with a length', () => {
    const column = {
      name: 'myColumn',
      type: 'string',
      length: 90
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.string('myColumn', 90).notNullable()`)
  })

  it('Create an autoincrement field', () => {
    const column = {
      name: 'id',
      type: 'integer',
      autoInc: true
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.increments('id').notNullable()`)
  })

  it('Create a text field with a default value', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      defValue: 'someValue'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').defaultTo('someValue').notNullable()`)
  })

  it('Create a text field with a comment', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      comment: 'This field is dope'
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').notNullable().comment('This field is dope')`)
  })

  it('Create a nullable text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      nullable: true
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn')`)
  })

  it('Create a unique text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      unique: true
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').notNullable().unique()`)
  })

  it('Create a unsigned field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer',
      unsigned: true
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myColumn').notNullable().unsigned()`)
  })

  it('Create an indexed field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer',
      index: true
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myColumn').notNullable().index()`)
  })

  it('Create a foreign key', () => {
    const column = {
      name: 'myRelationship',
      type: 'integer',
      foreignKey: {
        references: {
          name: 'id'
        },
        on: {
          name: 'otherTable'
        }
      }
    }

    new SchemaParser()._convertType(column)
    const knex = new MigrationFormatter()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myRelationship').notNullable().references('id').on('otherTable').onDelete('set null')`)
  })
})
