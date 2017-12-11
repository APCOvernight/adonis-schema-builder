'use strict'

/* eslint-disable no-unused-expressions */

const chai = require('chai')
const expect = chai.expect
const FactoryFormatter = require('../src/FactoryFormatter')
const SchemaParser = require('../src/SchemaParser')

describe('Faker string builder', () => {
  it('Create a text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.sentence(),`)
  })

  it('Create a tiny text field', () => {
    const column = {
      name: 'myColumn',
      type: 'tinyText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.sentence(),`)
  })

  it('Create a medium text field', () => {
    const column = {
      name: 'myColumn',
      type: 'mediumText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.sentence(),`)
  })

  it('Create a long text field', () => {
    const column = {
      name: 'myColumn',
      type: 'longText'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.sentence(),`)
  })

  it('Create a string field', () => {
    const column = {
      name: 'myColumn',
      type: 'string'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.sentence(),`)
  })

  it('Create a integer field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.integer(),`)
  })

  it('Create a bigInteger field', () => {
    const column = {
      name: 'myColumn',
      type: 'bigInteger'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.integer(),`)
  })

  it('Create a tinyInteger field', () => {
    const column = {
      name: 'myColumn',
      type: 'tinyInteger'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.integer(),`)
  })

  it('Create a date field', () => {
    const column = {
      name: 'myColumn',
      type: 'date'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.date({string: true, american: false}),`)
  })

  it('Create a dateTime field', () => {
    const column = {
      name: 'myColumn',
      type: 'dateTime'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.date({string: true, american: false}) + ' ' + faker.hour({twentyfour: true}) + '/' + faker.minute() + '/' + faker.second(),`)
  })

  it('Create a timestamp field', () => {
    const column = {
      name: 'myColumn',
      type: 'timestamp'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.timestamp(),`)
  })

  it('Create a time field', () => {
    const column = {
      name: 'myColumn',
      type: 'time'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.hour({twentyfour: true}) + '/' + faker.minute() + '/' + faker.second(),`)
  })

  it('Create a float field', () => {
    const column = {
      name: 'myColumn',
      type: 'float'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.floating({min: 0}),`)
  })

  it('Create a decimal field', () => {
    const column = {
      name: 'myColumn',
      type: 'decimal'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.floating({min: 0}),`)
  })

  it('Create a boolean field', () => {
    const column = {
      name: 'myColumn',
      type: 'boolean'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.bool(),`)
  })

  it('Create a double field', () => {
    const column = {
      name: 'myColumn',
      type: 'double'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.floating({min: 0}),`)
  })

  it('Create a char field', () => {
    const column = {
      name: 'myColumn',
      type: 'char'
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.sentence(),`)
  })

  it('Create a text field with a length', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      length: 50
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.sentence().substring(0, 50),`)
  })

  it('Create a string field with a length', () => {
    const column = {
      name: 'myColumn',
      type: 'string',
      length: 90
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.sentence().substring(0, 90),`)
  })

  it('Create an autoincrement field', () => {
    const column = {
      name: 'id',
      type: 'integer',
      autoInc: true
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.be.null
  })

  it('Create a nullable text field', () => {
    const column = {
      name: 'myColumn',
      type: 'text',
      nullable: true
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.bool() ? null : faker.sentence(),`)
  })

  it('Create an unsigned field', () => {
    const column = {
      name: 'myColumn',
      type: 'integer',
      unsigned: true
    }

    new SchemaParser()._convertType(column)
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.equal(`myColumn: faker.natural(),`)
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
    const fieldRule = new FactoryFormatter()._generateFieldRule(column)

    expect(fieldRule).to.be.null
  })
})
