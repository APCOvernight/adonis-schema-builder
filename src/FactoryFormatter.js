'use strict'

const Utils = require('./Utils')

class FactoryFormatter {
  format (tables) {
    const factories = Utils.objectToArray(tables, 'name')

    factories.map(factory => {
      factory.columns = Utils.objectToArray(factory.columns, 'name')

      factory.columns.map(column => {
        column.fieldRule = this._generateFieldRule
      })
    })

    return factories
  }

  _generateFieldRule (column) {
    if (column.type === 'increments' || column.foreignKey) {
      return null
    }

    let string = `${column.name}: faker.`

    string += this._fakerType(column)
    string += this._stringLength(column)

    string += ','

    return string
  }

  _fakerType (column) {
    let string = ''

    if (column.nullable) {
      string += `bool() ? null : faker.`
    }

    if (['timestamp'].includes(column.type)) {
      string += `${column.type}()`
    }

    if (['text', 'string'].includes(column.type) || (column.type && column.type.includes('Text'))) {
      string += `sentence()`
    }

    if (['integer', 'bigInteger'].includes(column.type)) {
      if (column.unsigned) {
        string += `natural()`
      } else {
        string += `integer()`
      }
    }

    if (['decimal', 'float'].includes(column.type)) {
      string += `floating({min: 0})`
    }

    if (['date', 'dateTime'].includes(column.type)) {
      string += `date({string: true, american: false})`
    }

    if (column.type === 'dateTime') {
      string += ` + ' ' + faker.`
    }

    if (column.type === 'boolean') {
      string += `bool()`
    }

    if (['time', 'dateTime'].includes(column.type)) {
      string += `hour({twentyfour: true}) + '/' + faker.minute() + '/' + faker.second()`
    }

    return string
  }

  _stringLength (column) {
    let string = ''

    if (column.length && ['text', 'string'].includes(column.type)) {
      string += `.substring(0, ${column.length})`
    }

    return string
  }
}

module.exports = FactoryFormatter
