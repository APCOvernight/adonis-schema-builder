'use strict'

const _ = require('lodash')
const Utils = require('./Utils')

class ModelFormatter {
  /**
   * Format models array before sending to writer
   * @param  {Object} tables Tables schema
   * @return {Array}
   */
  format (tables) {
    let models = Utils.objectToArray(tables, 'name')

    models = models.filter(model => !model.isLink)

    models.map(model => {
      model.columnsArray = Utils.objectToArray(model.columns, 'name')

      model.columnsArray.map(column => {
        column.validatorRule = this._generateValidatorRule(column)
        // TODO generate validator messages
        column.sanitisorRule = this._generateSanitisorRule(column)
      })

      model.relationsArray = Utils.objectToArray(model.relations, 'name')

      model.relationsArray.map(relation => {
        relation.relationDeclaration = this._generateRelationDeclaration(relation)
      })

      model.disableTimestamp = !model.timestamp
      model.hasRelations = !!model.relationsArray.length

      Utils.removeLastComma(model.columnsArray, 'validatorRule')
      Utils.removeLastComma(model.columnsArray, 'sanitisorRule')
    })

    return models
  }

  /**
   * Generate a validator rule string
   * @param  {Object} column Column schema
   * @return {String}
   */
  _generateValidatorRule (column) {
    if (column.type === 'increments' || column.foreignKey) {
      return null
    }

    let string = `${column.name}: '`

    string += this._validatorType(column)
    string += this._required(column)
    string += this._unique(column)
    string += this._maxLength(column)

    string += `',`

    return string
  }

  /**
   * Add a field/data type rule
   * @param  {Object} column Column schema
   * @return {String}
   */
  _validatorType (column) {
    let string = ''

    if (['timestamp'].includes(column.type)) {
      string = 'integer'
    }

    if (['text', 'string'].includes(column.type) || (column.type && column.type.includes('Text'))) {
      string = 'string'
    }

    if (['integer', 'bigInteger'].includes(column.type)) {
      if (column.unsigned) {
        string = `integer|above:0`
      } else {
        string = `integer`
      }
    }

    if (['decimal', 'float'].includes(column.type)) {
      string = 'number'
    }

    if (['date', 'time', 'dateTime'].includes(column.type)) {
      string = 'date'
    }

    if (column.type === 'boolean') {
      string = 'boolean'
    }

    return string
  }

  /**
   * Mark a field as required
   * @param  {Object} column Column schema
   * @return {String}
   */
  _required (column) {
    return column.nullable ? '' : '|required'
  }

  /**
   * Mark a field as unique
   * @param  {Object} column Column schema
   * @return {String}
   */
  _unique (column) {
    return column.unique ? '|unique' : ''
  }

  /**
   * Mark the max length on a field
   * @param  {Object} column Column schema
   * @return {String}
   */
  _maxLength (column) {
    return column.length ? `|max:${column.length}` : ''
  }

  /**
   * Generate a sanitisation rule string
   * @param  {Object} column Column schema
   * @return {String}
   */
  _generateSanitisorRule (column) {
    if (column.type === 'increments' || column.foreignKey) {
      return null
    }

    let string = `${column.name}: '`

    string += this._sanitisorType(column)

    string += `',`

    return string
  }

  /**
   * Set sanitisor type rule
   * @param  {Object} column Column schema
   * @return {String}
   */
  _sanitisorType (column) {
    let string = ''

    if (['timestamp', 'integer', 'bigInteger'].includes(column.type)) {
      string = 'to_int'
    }

    if (['text', 'string'].includes(column.type) || (column.type && column.type.includes('Text'))) {
      string = 'strip_tags'
    }

    if (['decimal', 'float'].includes(column.type)) {
      string = 'to_float'
    }

    if (['date', 'time', 'dateTime'].includes(column.type)) {
      string = 'to_date'
    }

    if (column.type === 'boolean') {
      string = 'to_boolean'
    }

    return string
  }

  /**
   * Generate a relationship function return string
   * @param  {Object} relation Relation schema
   * @return {String}
   */
  _generateRelationDeclaration (relation) {
    return this[`_generate${_.upperFirst(relation.type)}`](relation)
  }

  /**
   * Generate a relationship function return string for a belongsTo
   * @param  {Object} relation Relation schema
   * @return {String}
   */
  _generateBelongsTo (relation) {
    return `return this.belongsTo('App/Models/${relation.relatedModel}', '${relation.foreignKey}', '${relation.primaryKey}')`
  }

  /**
   * Generate a relationship function return string for a hasOne
   * @param  {Object} relation Relation schema
   * @return {String}
   */
  _generateHasOne (relation) {
    return `return this.hasOne('App/Models/${relation.relatedModel}', '${relation.primaryKey}', '${relation.foreignKey}')`
  }

  /**
   * Generate a relationship function return string for a hasMany
   * @param  {Object} relation Relation schema
   * @return {String}
   */
  _generateHasMany (relation) {
    return `return this.hasMany('App/Models/${relation.relatedModel}', '${relation.primaryKey}', '${relation.foreignKey}')`
  }

  /**
   * Generate a relationship function return string for a hasManyThrough
   * @param  {Object} relation Relation schema
   * @return {String}
   */
  _generateHasManyThrough (relation) {
    return `return this.hasManyThrough('App/Models/${relation.relatedModel}', '${relation.relatedMethod}', '${relation.primaryKey}', '${relation.foreignKey}')`
  }

  /**
   * Generate a relationship function return string for a belongsToMany
   * @param  {Object} relation Relation schema
   * @return {String}
   */
  _generateBelongsToMany (relation) {
    const withTimestamps = relation.withTimestamps ? '.withTimestamps()' : ''

    return `return this.belongsToMany('App/Models/${relation.relatedModel}', '${relation.foreignKey}', '${relation.relatedForeignKey}', '${relation.primaryKey}', '${relation.relatedPrimaryKey}').pivotTable('${relation.pivotTable}')${withTimestamps}`
  }
}

module.exports = ModelFormatter
