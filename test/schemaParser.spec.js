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
      column: 'myField',
      table: 'myTable'
    }
    schema.columnIds.id333 = {
      column: 'anotherField',
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
          name: 'categories'
        },
        {
          id: '8wraw',
          name: 'posts_categories'
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
      },
      relations: []
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

describe('Decorate relationships to tables', () => {
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
          name: 'categories'
        },
        {
          id: '8wra3w',
          name: 'posts_categories',
          timeStamp: false
        }
      ],
      columns: {
        '2h3q39': [
          { id: 'a10qir', name: 'id', autoInc: true },
          { id: '85aef', name: 'title' },
          { id: '6fpfw9', name: 'slug' },
          { id: 'ip3sf6', name: 'user_id' }
        ],
        sq0v8: [
          { id: '0gc1h', name: 'id', autoInc: true },
          { id: 'ip197', name: 'message' },
          { id: 'oqje0f', name: 'user_id' }
        ],
        myv42i: [
          { id: 'b0y62p', name: 'id', autoInc: true },
          { id: 'z8st7', name: 'name' },
          { id: '79km0sf', name: 'email' }
        ],
        '4rsea1': [
          { id: 'f4sge3', name: 'id', autoInc: true },
          { id: '5afa4e', name: 'name' },
          { id: 'fatnw2', name: 'description' },
          { id: '4afasd', name: 'parent_id' }
        ],
        '8wra3w': [
          { id: '8wh3kr', name: 'id', autoInc: true },
          { id: '5namkk', name: 'post_id' },
          { id: 'lk32as', name: 'category_id' }
        ]
      },
      relations: [
        {
          source: {
            columnId: 'ip3sf6',
            tableId: '2h3q39'
          },
          target: {
            columnId: 'b0y62p',
            tableId: 'myv42i'
          }
        },
        {
          source: {
            columnId: 'lk32as',
            tableId: '8wra3w'
          },
          target: {
            columnId: 'f4sge3',
            tableId: '4rsea1'
          }
        },
        {
          source: {
            columnId: '5namkk',
            tableId: '8wra3w'
          },
          target: {
            columnId: 'a10qir',
            tableId: '2h3q39'
          }
        }
      ]
    }
  })

  it('Add a belongsTo relation', () => {
    const { tables } = new SchemaParser(schema).convert()
    expect(tables.posts.relations).to.be.an('object')
    expect(tables.posts.modelName).to.equal('Post')
    expect(tables.posts.relations.user).to.be.an('object')
    expect(tables.posts.relations.user.type).equals('belongsTo')
    expect(tables.posts.relations.user.relatedModel).equals('User')
    expect(tables.posts.relations.user.primaryKey).equals('id')
    expect(tables.posts.relations.user.foreignKey).equals('user_id')
  })

  it('Add a belongsTo relation on self', () => {
    schema.relations.push({
      source: { columnId: '4afasd', tableId: '4rsea1' },
      target: { columnId: 'f4sge3', tableId: '4rsea1' }
    })
    const { tables } = new SchemaParser(schema).convert()
    expect(tables.categories.relations.parentCategory).to.be.an('object')
    expect(tables.categories.relations.parentCategory.type).equals('belongsTo')
    expect(tables.categories.relations.parentCategory.relatedModel).equals('Category')
    expect(tables.categories.relations.parentCategory.primaryKey).equals('id')
    expect(tables.categories.relations.parentCategory.foreignKey).equals('parent_id')
  })

  it('Add a hasMany relation', () => {
    const { tables } = new SchemaParser(schema).convert()
    expect(tables.users.relations).to.be.an('object')
    expect(tables.users.modelName).to.equal('User')
    expect(tables.users.relations.posts).to.be.an('object')
    expect(tables.users.relations.posts.type).equals('hasMany')
    expect(tables.users.relations.posts.relatedModel).equals('Post')
    expect(tables.users.relations.posts.primaryKey).equals('id')
    expect(tables.users.relations.posts.foreignKey).equals('user_id')
  })

  it('Add a hasOne relation', () => {
    schema.columns['2h3q39'][3].unique = true
    const { tables } = new SchemaParser(schema).convert()
    expect(tables.users.relations).to.be.an('object')
    expect(tables.users.modelName).to.equal('User')
    expect(tables.users.relations.post).to.be.an('object')
    expect(tables.users.relations.post.type).equals('hasOne')
    expect(tables.users.relations.post.relatedModel).equals('Post')
    expect(tables.users.relations.post.primaryKey).equals('id')
    expect(tables.users.relations.post.foreignKey).equals('user_id')
  })

  it('Add a 2 way belongsToMany relation', () => {
    const { tables } = new SchemaParser(schema).convert()
    expect(tables['posts_categories'].isLink).to.be.true
    expect(tables.posts.relations).to.be.an('object')
    expect(tables.posts.modelName).to.equal('Post')
    expect(tables.posts.relations.categories).to.be.an('object')
    expect(tables.posts.relations.categories.type).equals('belongsToMany')
    expect(tables.posts.relations.categories.relatedModel).equals('Category')
    expect(tables.posts.relations.categories.foreignKey).equals('post_id')
    expect(tables.posts.relations.categories.relatedForeignKey).equals('category_id')
    expect(tables.posts.relations.categories.primaryKey).equals('id')
    expect(tables.posts.relations.categories.relatedPrimaryKey).equals('id')
    expect(tables.posts.relations.categories.pivotTable).equals('posts_categories')

    expect(tables.posts.relations.categories.withTimestamps).to.be.false

    expect(tables.categories.relations).to.be.an('object')
    expect(tables.categories.modelName).to.equal('Category')
    expect(tables.categories.relations.posts).to.be.an('object')
    expect(tables.categories.relations.posts.type).equals('belongsToMany')
    expect(tables.categories.relations.posts.relatedModel).equals('Post')
    expect(tables.categories.relations.posts.foreignKey).equals('category_id')
    expect(tables.categories.relations.posts.relatedForeignKey).equals('post_id')
    expect(tables.categories.relations.posts.primaryKey).equals('id')
    expect(tables.categories.relations.posts.relatedPrimaryKey).equals('id')
    expect(tables.categories.relations.posts.pivotTable).equals('posts_categories')
    expect(tables.categories.relations.posts.withTimestamps).to.be.false
  })

  it('Set timestamps on pivot table', () => {
    schema.tables[4].timeStamp = true
    const { tables } = new SchemaParser(schema).convert()
    expect(tables.posts.relations.categories.withTimestamps).to.be.true
    expect(tables.categories.relations.posts.withTimestamps).to.be.true
  })

  it('Add a 3 way belongsToMany relation', () => {
    schema = {
      'tables': [
        {
          'id': '4taxn',
          'name': 'users',
          'softDelete': false
        },
        {
          'id': '1slu3',
          'name': 'companies',
          'softDelete': false
        },
        {
          'id': '9s2ral',
          'name': 'roles',
          'softDelete': false
        },
        {
          'id': 'lpzrg',
          'name': 'users_companies_roles',
          'softDelete': false
        }
      ],
      'columns': {
        '4taxn': [
          {
            'id': '4328t',
            'name': 'id'
          }
        ],
        '1slu3': [
          {
            'id': 'eognag',
            'name': 'id'
          }
        ],
        '9s2ral': [
          {
            'id': '8qjulx',
            'name': 'id'
          }
        ],
        'lpzrg': [
          {
            'id': '1xmq2r',
            'name': 'id'
          },
          {
            'id': '4apmgc',
            'name': 'user_id'
          },
          {
            'id': 'hjgd5',
            'name': 'company_id'
          },
          {
            'id': '16rvwx',
            'name': 'role_id'
          }
        ]
      },
      'relations': [
        {
          'source': {
            'columnId': '4apmgc',
            'tableId': 'lpzrg'
          },
          'target': {
            'columnId': '4328t',
            'tableId': '4taxn'
          }
        },
        {
          'source': {
            'columnId': 'hjgd5',
            'tableId': 'lpzrg'
          },
          'target': {
            'columnId': 'eognag',
            'tableId': '1slu3'
          }
        },
        {
          'source': {
            'columnId': '16rvwx',
            'tableId': 'lpzrg'
          },
          'target': {
            'columnId': '8qjulx',
            'tableId': '9s2ral'
          }
        }
      ]
    }

    const { tables } = new SchemaParser(schema).convert()
    expect(tables['users_companies_roles'].isLink).to.be.true

    expect(tables.users.relations).to.be.an('object')
    expect(tables.users.modelName).to.equal('User')

    expect(tables.users.relations.roles).to.be.an('object')
    expect(tables.users.relations.roles.type).equals('belongsToMany')
    expect(tables.users.relations.roles.relatedModel).equals('Role')
    expect(tables.users.relations.roles.foreignKey).equals('user_id')
    expect(tables.users.relations.roles.relatedForeignKey).equals('role_id')
    expect(tables.users.relations.roles.primaryKey).equals('id')
    expect(tables.users.relations.roles.relatedPrimaryKey).equals('id')
    expect(tables.users.relations.roles.pivotTable).equals('users_companies_roles')
    expect(tables.users.relations.roles.withTimestamps).to.be.false

    expect(tables.users.relations.companies).to.be.an('object')
    expect(tables.users.relations.companies.type).equals('belongsToMany')
    expect(tables.users.relations.companies.relatedModel).equals('Company')
    expect(tables.users.relations.companies.foreignKey).equals('user_id')
    expect(tables.users.relations.companies.relatedForeignKey).equals('company_id')
    expect(tables.users.relations.companies.primaryKey).equals('id')
    expect(tables.users.relations.companies.relatedPrimaryKey).equals('id')
    expect(tables.users.relations.companies.pivotTable).equals('users_companies_roles')
    expect(tables.users.relations.companies.withTimestamps).to.be.false

    expect(tables.companies.relations).to.be.an('object')
    expect(tables.companies.modelName).to.equal('Company')

    expect(tables.companies.relations.roles).to.be.an('object')
    expect(tables.companies.relations.roles.type).equals('belongsToMany')
    expect(tables.companies.relations.roles.relatedModel).equals('Role')
    expect(tables.companies.relations.roles.foreignKey).equals('company_id')
    expect(tables.companies.relations.roles.relatedForeignKey).equals('role_id')
    expect(tables.companies.relations.roles.primaryKey).equals('id')
    expect(tables.companies.relations.roles.relatedPrimaryKey).equals('id')
    expect(tables.companies.relations.roles.pivotTable).equals('users_companies_roles')
    expect(tables.companies.relations.roles.withTimestamps).to.be.false

    expect(tables.companies.relations.users).to.be.an('object')
    expect(tables.companies.relations.users.type).equals('belongsToMany')
    expect(tables.companies.relations.users.relatedModel).equals('User')
    expect(tables.companies.relations.users.foreignKey).equals('company_id')
    expect(tables.companies.relations.users.relatedForeignKey).equals('user_id')
    expect(tables.companies.relations.users.primaryKey).equals('id')
    expect(tables.companies.relations.users.relatedPrimaryKey).equals('id')
    expect(tables.companies.relations.users.pivotTable).equals('users_companies_roles')
    expect(tables.companies.relations.users.withTimestamps).to.be.false

    expect(tables.roles.relations).to.be.an('object')
    expect(tables.roles.modelName).to.equal('Role')

    expect(tables.roles.relations.companies).to.be.an('object')
    expect(tables.roles.relations.companies.type).equals('belongsToMany')
    expect(tables.roles.relations.companies.relatedModel).equals('Company')
    expect(tables.roles.relations.companies.foreignKey).equals('role_id')
    expect(tables.roles.relations.companies.relatedForeignKey).equals('company_id')
    expect(tables.roles.relations.companies.primaryKey).equals('id')
    expect(tables.roles.relations.companies.relatedPrimaryKey).equals('id')
    expect(tables.roles.relations.companies.pivotTable).equals('users_companies_roles')
    expect(tables.roles.relations.companies.withTimestamps).to.be.false

    expect(tables.roles.relations.users).to.be.an('object')
    expect(tables.roles.relations.users.type).equals('belongsToMany')
    expect(tables.roles.relations.users.relatedModel).equals('User')
    expect(tables.roles.relations.users.foreignKey).equals('role_id')
    expect(tables.roles.relations.users.relatedForeignKey).equals('user_id')
    expect(tables.roles.relations.users.primaryKey).equals('id')
    expect(tables.roles.relations.users.relatedPrimaryKey).equals('id')
    expect(tables.roles.relations.users.pivotTable).equals('users_companies_roles')
    expect(tables.roles.relations.users.withTimestamps).to.be.false
  })

  it('hasManyThrough relationship', () => {
    schema = {
      'tables': [
        {
          'id': '4taxn',
          'name': 'users'
        },
        {
          'id': '1slu3',
          'name': 'companies'
        },
        {
          'id': 'lpzrg',
          'name': 'users_companies_roles'
        },
        {
          'id': 'nephs',
          'name': 'comments'
        }
      ],
      'columns': {
        '4taxn': [
          {
            'id': '4328t',
            'name': 'id'
          }
        ],
        '1slu3': [
          {
            'id': 'eognag',
            'name': 'id'
          }
        ],
        'lpzrg': [
          {
            'id': '1xmq2r',
            'name': 'id'
          },
          {
            'id': '4apmgc',
            'name': 'user_id'
          },
          {
            'id': 'hjgd5',
            'name': 'company_id'
          }
        ],
        'nephs': [
          {
            'id': 'twawj',
            'name': 'id'
          },
          {
            'id': '12fab9',
            'name': 'user_id'
          }
        ]
      },
      'relations': [
        {
          'source': {
            'columnId': '4apmgc',
            'tableId': 'lpzrg'
          },
          'target': {
            'columnId': '4328t',
            'tableId': '4taxn'
          }
        },
        {
          'source': {
            'columnId': 'hjgd5',
            'tableId': 'lpzrg'
          },
          'target': {
            'columnId': 'eognag',
            'tableId': '1slu3'
          }
        },
        {
          'source': {
            'columnId': '12fab9',
            'tableId': 'nephs'
          },
          'target': {
            'columnId': '4328t',
            'tableId': '4taxn'
          }
        }
      ]
    }

    const { tables } = new SchemaParser(schema).convert()
    expect(tables['users_companies_roles'].isLink).to.be.true

    expect(tables.users.relations).to.be.an('object')
    expect(tables.users.modelName).to.equal('User')

    expect(tables.users.relations.companies).to.be.an('object')
    expect(tables.users.relations.companies.type).equals('belongsToMany')
    expect(tables.users.relations.companies.relatedModel).equals('Company')
    expect(tables.users.relations.companies.foreignKey).equals('user_id')
    expect(tables.users.relations.companies.relatedForeignKey).equals('company_id')
    expect(tables.users.relations.companies.primaryKey).equals('id')
    expect(tables.users.relations.companies.relatedPrimaryKey).equals('id')
    expect(tables.users.relations.companies.pivotTable).equals('users_companies_roles')
    expect(tables.users.relations.companies.withTimestamps).to.be.false

    expect(tables.comments.relations.user).to.be.an('object')
    expect(tables.comments.relations.user.type).equals('belongsTo')
    expect(tables.comments.relations.user.relatedModel).equals('User')
    expect(tables.comments.relations.user.foreignKey).equals('user_id')
    expect(tables.comments.relations.user.primaryKey).equals('id')

    expect(tables.users.relations.comments).to.be.an('object')
    expect(tables.users.relations.comments.type).equals('hasMany')
    expect(tables.users.relations.comments.relatedModel).equals('Comment')
    expect(tables.users.relations.comments.foreignKey).equals('user_id')
    expect(tables.users.relations.comments.primaryKey).equals('id')

    expect(tables.companies.relations.users).to.be.an('object')
    expect(tables.companies.relations.users.type).equals('belongsToMany')
    expect(tables.companies.relations.users.relatedModel).equals('User')

    expect(tables.companies.relations.comments).to.be.an('object')
    expect(tables.companies.relations.comments.type).equals('hasManyThrough')
    expect(tables.companies.relations.comments.relatedModel).equals('User')
    expect(tables.companies.relations.comments.relatedMethod).equals('comments')
    expect(tables.companies.relations.comments.primaryKey).equals('id')
    expect(tables.companies.relations.comments.foreignKey).equals('company_id')

    // Don't join users back onto users
    expect(tables.users.relations.users).to.be.undefined
  })
})
