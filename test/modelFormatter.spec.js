'use strict'

/* eslint-disable no-unused-expressions */

const chai = require('chai')
const expect = chai.expect
const ModelFormatter = require('../src/ModelFormatter')
const SchemaParser = require('../src/SchemaParser')

describe('Validation string builder', () => {
  it('Create a text field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'text'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string',`)
  })

  it('Create a tiny text field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'tinyText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string',`)
  })

  it('Create a medium text field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'mediumText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string',`)
  })

  it('Create a long text field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'longText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string',`)
  })

  it('Create a string field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'string'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string',`)
  })

  it('Create a integer field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'integer'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'integer',`)
  })

  it('Create a bigInteger field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'bigInteger'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'integer',`)
  })

  it('Create a tinyInteger field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'tinyInteger'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'integer',`)
  })

  it('Create a date field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'date'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'date',`)
  })

  it('Create a dateTime field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'dateTime'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'date',`)
  })

  it('Create a timestamp field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'timestamp'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'integer',`)
  })

  it('Create a time field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'time'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'date',`)
  })

  it('Create a float field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'float'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'number',`)
  })

  it('Create a decimal field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'decimal'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'number',`)
  })

  it('Create a boolean field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'boolean'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'boolean',`)
  })

  it('Create a double field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'double'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'number',`)
  })

  it('Create a char field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'char'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string',`)
  })

  it('Create a text field with a length', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'text',
      length: 50
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string|max:50',`)
  })

  it('Create a string field with a length', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'string',
      length: 90
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string|max:90',`)
  })

  it('Create an autoincrement field', () => {
    const column = {
      name: 'id',
      type: 'integer',
      autoInc: true
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.be.null
  })

  it('Create a non-nullable text field', () => {
    const column = {
      name: 'myColumn',
      nullable: false,
      type: 'text'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'string|required',`)
  })

  it('Create an unsigned field', () => {
    const column = {
      name: 'myColumn',
      nullable: true,
      type: 'integer',
      unsigned: true
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'integer|above:0',`)
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
    const fieldRule = new ModelFormatter()._generateValidatorRule(column)

    expect(fieldRule).to.be.null
  })
})

describe('Sanitisor string builder', () => {
  it('Create a text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'strip_tags',`)
  })

  it('Create a tiny text field', () => {
    const column = {
      name: 'myColumn',
      type: 'tinyText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'strip_tags',`)
  })

  it('Create a medium text field', () => {
    const column = {
      name: 'myColumn',
      type: 'mediumText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'strip_tags',`)
  })

  it('Create a long text field', () => {
    const column = {
      name: 'myColumn',
      type: 'longText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'strip_tags',`)
  })

  it('Create a string field', () => {
    const column = {
      name: 'myColumn',
      type: 'string'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'strip_tags',`)
  })

  it('Create a integer field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_int',`)
  })

  it('Create a bigInteger field', () => {
    const column = {
      name: 'myColumn',
      type: 'bigInteger'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_int',`)
  })

  it('Create a tinyInteger field', () => {
    const column = {
      name: 'myColumn',
      type: 'tinyInteger'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_int',`)
  })

  it('Create a date field', () => {
    const column = {
      name: 'myColumn',
      type: 'date'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_date',`)
  })

  it('Create a dateTime field', () => {
    const column = {
      name: 'myColumn',
      type: 'dateTime'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_date',`)
  })

  it('Create a timestamp field', () => {
    const column = {
      name: 'myColumn',
      type: 'timestamp'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_int',`)
  })

  it('Create a time field', () => {
    const column = {
      name: 'myColumn',
      type: 'time'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_date',`)
  })

  it('Create a float field', () => {
    const column = {
      name: 'myColumn',
      type: 'float'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_float',`)
  })

  it('Create a decimal field', () => {
    const column = {
      name: 'myColumn',
      type: 'decimal'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_float',`)
  })

  it('Create a boolean field', () => {
    const column = {
      name: 'myColumn',
      type: 'boolean'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_boolean',`)
  })

  it('Create a double field', () => {
    const column = {
      name: 'myColumn',
      type: 'double'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_float',`)
  })

  it('Create a char field', () => {
    const column = {
      name: 'myColumn',
      type: 'char'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'strip_tags',`)
  })

  it('Create an autoincrement field', () => {
    const column = {
      name: 'id',
      type: 'integer',
      autoInc: true
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.be.null
  })

  it('Create an unsigned field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer',
      unsigned: true
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.equal(`myColumn: 'to_int',`)
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
    const fieldRule = new ModelFormatter()._generateSanitisorRule(column)

    expect(fieldRule).to.be.null
  })
})

describe('Model rule declaration strings', () => {
  it('Rule for a belongsTo relationship', () => {
    const relation = {
      type: 'belongsTo',
      table: 'myTable',
      relatedModel: 'User',
      primaryKey: 'id',
      foreignKey: 'user_id'
    }
    const relationDeclaration = new ModelFormatter()._generateRelationDeclaration(relation)

    expect(relationDeclaration).to.equal(`return this.belongsTo('App/Models/User', 'id', 'user_id')`)
  })

  it('Rule for a hasOne relationship', () => {
    const relation = {
      type: 'hasOne',
      table: 'myTable',
      relatedModel: 'Profile',
      primaryKey: 'id',
      foreignKey: 'user_id'
    }
    const relationDeclaration = new ModelFormatter()._generateRelationDeclaration(relation)

    expect(relationDeclaration).to.equal(`return this.hasOne('App/Models/Profile', 'id', 'user_id')`)
  })

  it('Rule for a hasMany relationship', () => {
    const relation = {
      type: 'hasMany',
      table: 'myTable',
      relatedModel: 'Profile',
      primaryKey: 'id',
      foreignKey: 'user_id'
    }
    const relationDeclaration = new ModelFormatter()._generateRelationDeclaration(relation)

    expect(relationDeclaration).to.equal(`return this.hasMany('App/Models/Profile', 'id', 'user_id')`)
  })

  it('Rule for a hasManyThrough relationship', () => {
    const relation = {
      type: 'hasManyThrough',
      table: 'myTable',
      relatedModel: 'User',
      relatedMethod: 'comments',
      primaryKey: 'id',
      foreignKey: 'company_id'
    }
    const relationDeclaration = new ModelFormatter()._generateRelationDeclaration(relation)

    expect(relationDeclaration).to.equal(`return this.hasManyThrough('App/Models/User', 'comments', 'id', 'company_id')`)
  })

  it('Rule for a belongsToMany relationship', () => {
    const relation = {
      type: 'belongsToMany',
      table: 'posts',
      relatedModel: 'Post',
      primaryKey: 'id',
      foreignKey: 'category_id',
      relatedPrimaryKey: 'id',
      relatedForeignKey: 'post_id',
      pivotTable: 'posts_categories',
      withTimestamps: false
    }
    const relationDeclaration = new ModelFormatter()._generateRelationDeclaration(relation)

    expect(relationDeclaration).to.equal(`return this.belongsToMany('App/Models/Post', 'category_id', 'post_id', 'id', 'id').pivotTable('posts_categories')`)
  })

  it('Rule for a belongsToMany relationship with timestamps', () => {
    const relation = {
      type: 'belongsToMany',
      table: 'posts',
      relatedModel: 'Post',
      primaryKey: 'id',
      foreignKey: 'category_id',
      relatedPrimaryKey: 'id',
      relatedForeignKey: 'post_id',
      pivotTable: 'posts_categories',
      withTimestamps: true
    }
    const relationDeclaration = new ModelFormatter()._generateRelationDeclaration(relation)

    expect(relationDeclaration).to.equal(`return this.belongsToMany('App/Models/Post', 'category_id', 'post_id', 'id', 'id').pivotTable('posts_categories').withTimestamps()`)
  })
})
