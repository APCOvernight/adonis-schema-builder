'use strict'

/* eslint-disable no-unused-expressions */

const chai = require('chai')
const expect = chai.expect
const SchemaParser = require('../src/SchemaParser')
const Utils = require('../src/Utils')

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
    const array = Utils.objectToArray(object)

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
    const array = Utils.objectToArray(object)

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
    const array = Utils.objectToArray(object, 'name')

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
        },
        {
          id: '4rsea1',
          name: 'test'
        },
        {
          id: '8wraw',
          name: 'users_posts'
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
        ],
        '4rsea1': [
          { id: 'f4sge3', name: 'id', autoInc: true }
        ],
        '8wraw': [

        ]
      }
    }
  })

  it('Migrations array is returned', () => {
    const { migrations } = new SchemaParser(schema).convert()
    expect(migrations).to.be.an('array')
    expect(migrations[0].columnsArray).to.be.an('array')
    expect(migrations[0].columnsArray[0]).to.be.an('object')
    expect(migrations[0].columnsArray[0].knexString).to.not.be.undefined
  })

  it('Factories array is returned', () => {
    const { factories } = new SchemaParser(schema).convert()
    expect(factories).to.be.an('array')
    expect(factories[0].columnsArray).to.be.an('array')
    expect(factories[0].columnsArray[0]).to.be.an('object')
    expect(factories[0].columnsArray[0].fieldRule).to.not.be.undefined

    expect(factories[2].columnsArray[1].fieldRule).to.equal('email: faker.,')
    expect(factories[2].columnsArray[2].fieldRule).to.equal('id: faker.')
  })

  it('Factories aren\'t created for link tables (denomintated by underscore)', () => {
    const { factories } = new SchemaParser(schema).convert()
    expect(factories).to.be.an('array')
    expect(factories.length).to.equal(4)
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
