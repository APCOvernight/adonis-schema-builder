'use strict'

const Utils = require('./Utils')

class MigrationFormatter {
  /**
   * Format migrations array before sending to writer
   * @param  {Object} tables Tables schema
   * @return {Array}
   */
  format (tables) {
    const migrations = Utils.objectToArray(tables, 'name')

    migrations.map(migration => {
      migration.columnsArray = Utils.objectToArray(migration.columns, 'name')

      migration.columnsArray.map(column => {
        column.knexString = this._columnKnex(column)
      })
    })

    return migrations
  }

  /**
   * Generate a knex schema definition string
   * @param  {Object} column Column schema
   * @return {String}
   */
  _columnKnex (column) {
    let string = 'table.'

    string += this._knexType(column)
    string += this._knexChain(column)
    string += this._knexRelationships(column)

    return string
  }

  /**
   * Add chainable methods to the knex string
   * @param  {Object} column Column schema
   * @return {String}
   */
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

  /**
   * Start Knex string with field type method call
   * @param  {Object} column Column schema
   * @return {String}
   */
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

  /**
   * Add foreign key to knex string
   * @param  {Object} column Column schema
   * @return {String}
   */
  _knexRelationships (column) {
    let relationshipString = ''

    if (column.foreignKey) {
      relationshipString = `.references('${column.foreignKey.references.name}').on('${column.foreignKey.on.name}').onDelete('set null')`
    }

    return relationshipString
  }
}

module.exports = MigrationFormatter
