'use strict'

/* eslint-disable no-unused-expressions */

const chai = require('chai')
const expect = chai.expect
const SchemaParser = require('../src/SchemaParser')

describe('Knex string builder', () => {
  it('Create a text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').notNullable()`)
  })

  it('Create a tiny text field', () => {
    const column = {
      name: 'myColumn',
      type: 'tinyText'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn', 'tinytext').notNullable()`)
  })

  it('Create a medium text field', () => {
    const column = {
      name: 'myColumn',
      type: 'mediumText'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn', 'mediumtext').notNullable()`)
  })

  it('Create a long text field', () => {
    const column = {
      name: 'myColumn',
      type: 'longText'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn', 'longtext').notNullable()`)
  })

  it('Create a string field', () => {
    const column = {
      name: 'myColumn',
      type: 'string'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.string('myColumn').notNullable()`)
  })

  it('Create a integer field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myColumn').notNullable()`)
  })

  it('Create a bigInteger field', () => {
    const column = {
      name: 'myColumn',
      type: 'bigInteger'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.bigInteger('myColumn').notNullable()`)
  })

  it('Create a tinyInteger field', () => {
    const column = {
      name: 'myColumn',
      type: 'tinyInteger'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myColumn').notNullable()`)
  })

  it('Create a date field', () => {
    const column = {
      name: 'myColumn',
      type: 'date'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.date('myColumn').notNullable()`)
  })

  it('Create a dateTime field', () => {
    const column = {
      name: 'myColumn',
      type: 'dateTime'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.dateTime('myColumn').notNullable()`)
  })

  it('Create a timestamp field', () => {
    const column = {
      name: 'myColumn',
      type: 'timestamp'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.timestamp('myColumn').notNullable()`)
  })

  it('Create a time field', () => {
    const column = {
      name: 'myColumn',
      type: 'time'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.time('myColumn').notNullable()`)
  })

  it('Create a float field', () => {
    const column = {
      name: 'myColumn',
      type: 'float'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.float('myColumn').notNullable()`)
  })

  it('Create a decimal field', () => {
    const column = {
      name: 'myColumn',
      type: 'decimal'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.decimal('myColumn').notNullable()`)
  })

  it('Create a boolean field', () => {
    const column = {
      name: 'myColumn',
      type: 'boolean'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.boolean('myColumn').notNullable()`)
  })

  it('Create a double field', () => {
    const column = {
      name: 'myColumn',
      type: 'double'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.float('myColumn').notNullable()`)
  })

  it('Create a char field', () => {
    const column = {
      name: 'myColumn',
      type: 'char'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').notNullable()`)
  })

  it('Create a text field with a length', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      length: 50
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.string('myColumn', 50).notNullable()`)
  })

  it('Create a string field with a length', () => {
    const column = {
      name: 'myColumn',
      type: 'string',
      length: 90
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.string('myColumn', 90).notNullable()`)
  })

  it('Create an autoincrement field', () => {
    const column = {
      name: 'id',
      type: 'integer',
      autoInc: true
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.increments('id').notNullable()`)
  })

  it('Create a text field with a default value', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      defValue: 'someValue'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').defaultTo('someValue').notNullable()`)
  })

  it('Create a text field with a comment', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      comment: 'This field is dope'
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').notNullable().comment('This field is dope')`)
  })

  it('Create a nullable text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      nullable: true
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn')`)
  })

  it('Create a unique text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      unique: true
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.text('myColumn').notNullable().unique()`)
  })

  it('Create a unsigned field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer',
      unsigned: true
    }
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myColumn').notNullable().unsigned()`)
  })

  it('Create an indexed field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer',
      index: true
    }
    const knex = new SchemaParser()._columnKnex(column)

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
    const knex = new SchemaParser()._columnKnex(column)

    expect(knex).to.equal(`table.integer('myRelationship').notNullable().references('id').on('otherTable').onDelete('set null')`)
  })
})

describe('Object manipulation helpers', () => {
  it('Get table name by id', () => {
    const schema = new SchemaParser()
    schema.tableIds.id123 = 'myTable'
    schema.tableIds.id333 = 'anotherTable'

    expect(schema._getTableName('id123')).to.equal('myTable')
  })

  it('Get table id from name', () => {
    const schema = new SchemaParser()
    schema.tableIds.id123 = 'myTable'
    schema.tableIds.id333 = 'anotherTable'

    expect(schema._getTableId('anotherTable')).to.equal('id333')

    expect(schema._getTableId('fakeTable')).to.be.undefined
  })

  it('Get column name by id', () => {
    const schema = new SchemaParser()
    schema.columnIds.id123 = {
      name: 'myField',
      table: 'myTable'
    }
    schema.columnIds.id333 = {
      name: 'anotherField',
      table: 'anotherTable'
    }

    expect(schema._getColumnName('id123')).to.equal('myField')
  })

  it('Get column table by id', () => {
    const schema = new SchemaParser()
    schema.columnIds.id123 = {
      name: 'myField',
      table: 'myTable'
    }
    schema.columnIds.id333 = {
      name: 'anotherField',
      table: 'anotherTable'
    }

    expect(schema._getColumnTable('id333')).to.equal('anotherTable')
  })

  it('Get column id by name and table', () => {
    const schema = new SchemaParser()
    schema.columnIds.id222 = {
      name: 'myField',
      table: 'AnotherTable'
    }
    schema.columnIds.id123 = {
      name: 'myField',
      table: 'myTable'
    }
    schema.columnIds.id333 = {
      name: 'anotherField',
      table: 'anotherTable'
    }

    expect(schema._getColumnId('myField', 'myTable')).to.equal('id123')

    expect(schema._getColumnId('myField', 'nonExistentTable')).to.be.undefined
  })

  it('Convert basic object to array', () => {
    const object = {
      firstKey: 'val',
      nextKey: 'anotherVal'
    }
    const array = new SchemaParser()._objectToArray(object)

    expect(array).to.deep.equal(['val', 'anotherVal'])
  })

  it('Convert nested object to array', () => {
    const object = {
      firstKey: {
        attr1: 'val',
        attr2: 'someVal'
      },
      nextKey: {
        attr1: 'anotherVal',
        attr2: 'thisVal'
      }
    }
    const array = new SchemaParser()._objectToArray(object)

    expect(array).to.deep.equal([{
      attr1: 'val',
      attr2: 'someVal',
      key: 'firstKey'
    }, {
      attr1: 'anotherVal',
      attr2: 'thisVal',
      key: 'nextKey'
    }])
  })

  it('Convert nested object to array with specified key field', () => {
    const object = {
      firstKey: {
        attr1: 'val',
        attr2: 'someVal'
      },
      nextKey: {
        attr1: 'anotherVal',
        attr2: 'thisVal'
      }
    }
    const array = new SchemaParser()._objectToArray(object, 'name')

    expect(array).to.deep.equal([{
      attr1: 'val',
      attr2: 'someVal',
      name: 'firstKey'
    }, {
      attr1: 'anotherVal',
      attr2: 'thisVal',
      name: 'nextKey'
    }])
  })
})

let rawColumns
let rawTables

describe('Format tables', () => {
  beforeEach(() => {
    rawTables = [
      {
        id: '2h3q39',
        name: 'posts'
      },
      {
        id: 'sq0v8',
        name: 'comments'
      },
      {
        id: 'myv42i',
        name: 'users'
      }
    ]

    rawColumns = {
      '2h3q39': [
        { id: 'a10qir', name: 'id' },
        { id: '85aef', name: 'title' },
        { id: '6fpfw9', name: 'slug' },
        { id: 'ip3sf6', name: 'userid' }
      ],
      sq0v8: [
        { id: '0gc1h', name: 'id' },
        { id: 'ip197', name: 'message' },
        { id: 'oqje0f', name: 'userid' }
      ],
      myv42i: [
        { id: 'z8st7', name: 'name' },
        { id: '79km0sf', name: 'email' },
        { id: 'b0y62p', name: 'id' }
      ]
    }
  })

  it('Tables object should be indexed by name', () => {
    const tables = new SchemaParser()._setupTables(rawTables)
    expect(tables).to.be.an('object')
    expect(tables.users).to.be.an('object')
    expect(tables.users.softDelete).to.be.false
    expect(tables.users.timestamp).to.be.false
  })

  it('Tables object should include softDelete and timeStamp options', () => {
    rawTables[2].softDelete = true
    rawTables[2].timeStamp = true
    const tables = new SchemaParser()._setupTables(rawTables)
    expect(tables).to.be.an('object')
    expect(tables.users).to.be.an('object')
    expect(tables.users.softDelete).to.be.true
    expect(tables.users.timestamp).to.be.true
  })

  it('Columns object should be indexed by name', () => {
    const schema = new SchemaParser()
    const tables = schema._setupTables(rawTables)
    schema._mergeColumns(rawColumns, tables)
    expect(tables).to.be.an('object')
    expect(tables.users.columns).to.be.an('object')
    expect(tables.users.columns.email).to.be.an('object')
    expect(tables.users.columns.email.foreignKey).to.be.null
  })

  it('Columns foreignKey should be included', () => {
    rawColumns.myv42i[1].foreignKey = {
      references: {
        id: 'someId'
      },
      on: {
        id: 'anotherId'
      }
    }

    const schema = new SchemaParser()
    const tables = schema._setupTables(rawTables)
    schema._mergeColumns(rawColumns, tables)
    expect(tables).to.be.an('object')
    expect(tables.users.columns).to.be.an('object')
    expect(tables.users.columns.email).to.be.an('object')
    expect(tables.users.columns.email.foreignKey).to.be.an('object')
  })

  it('Columns should be merged into tables', () => {
    const tables = new SchemaParser()._formatTables(rawTables, rawColumns)
    expect(tables).to.be.an('object')
    expect(tables.users).to.be.an('object')
    expect(tables.users.columns).to.be.an('object')
  })
})

let schema

describe('Output formatted objects and arrays', () => {
  beforeEach(() => {
    schema = {
      tables: [
        {
          id: '2h3q39',
          name: 'posts'
        },
        {
          id: 'sq0v8',
          name: 'comments'
        },
        {
          id: 'myv42i',
          name: 'users'
        }
      ],
      columns: {
        '2h3q39': [
          { id: 'a10qir', name: 'id' },
          { id: '85aef', name: 'title' },
          { id: '6fpfw9', name: 'slug' },
          { id: 'ip3sf6', name: 'userid' }
        ],
        sq0v8: [
          { id: '0gc1h', name: 'id' },
          { id: 'ip197', name: 'message' },
          { id: 'oqje0f', name: 'userid' }
        ],
        myv42i: [
          { id: 'z8st7', name: 'name' },
          { id: '79km0sf', name: 'email' },
          { id: 'b0y62p', name: 'id' }
        ]
      }
    }
  })

  it('Migrations array is returned', () => {
    const { migrations } = new SchemaParser(schema).convert()
    expect(migrations).to.be.an('array')
    expect(migrations[0].columns).to.be.an('array')
  })

  it('Models array is returned', () => {
    const { models } = new SchemaParser(schema).convert()
    expect(models).to.be.an('array')
    // expect(models[0].fields).to.be.an('array')
  })

  it('Tests array is returned', () => {
    const { tests } = new SchemaParser(schema).convert()
    expect(tests).to.be.an('array')
    // expect(models[0].fields).to.be.an('array')
  })

  it('Seeds array is returned', () => {
    const { seeds } = new SchemaParser(schema).convert()
    expect(seeds).to.be.an('array')
    // expect(models[0].fields).to.be.an('array')
  })
})
