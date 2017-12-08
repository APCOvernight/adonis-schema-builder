'use strict'

const Utils = require('./Utils')

class MigrationFormatter {
  format (tables) {
    const migrations = Utils.objectToArray(tables, 'name')

    migrations.map(migration => {
      migration.columns = Utils.objectToArray(migration.columns, 'name')

      migration.columns.map(column => {
        column.knexString = this._columnKnex
      })
    })

    return migrations
  }

  _columnKnex (column) {
    let string = 'table.'

    string += this._knexType(column)
    string += this._knexChain(column)
    string += this._knexRelationships(column)

    return string
  }

  _knexChain (column) {
    let chainString = ''

    if (column.defValue) {
      chainString += `.defaultTo('${column.defValue}')`
    }

    if (!column.nullable) {
      chainString += `.notNullable()`
    }

    if (column.unique) {
      chainString += `.unique()`
    }

    if (column.index) {
      chainString += `.index()`
    }

    if (column.unsigned) {
      chainString += `.unsigned()`
    }

    if (column.comment) {
      chainString += `.comment('${column.comment}')`
    }

    return chainString
  }

  _knexType (column) {
    let typeString = ''

    if (['text', 'string', 'integer', 'bigInteger', 'date', 'dateTime', 'timestamp', 'time', 'float', 'decimal', 'boolean', 'increments'].includes(column.type)) {
      typeString += `${column.type}('${column.name}'`
    }

    if (column.type && column.type.includes('Text')) {
      typeString += `text('${column.name}', '${column.type.replace('Text', '')}text'`
    }

    if (column.length) {
      typeString += `, ${column.length}`
    }

    typeString += `)`

    return typeString
  }

  _knexRelationships (column) {
    let relationshipString = ''

    if (column.foreignKey) {
      relationshipString = `.references('${column.foreignKey.references.name}').on('${column.foreignKey.on.name}').onDelete('set null')`
    }

    return relationshipString
  }
}

module.exports = MigrationFormatter
