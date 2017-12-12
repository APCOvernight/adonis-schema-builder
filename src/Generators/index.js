'use strict'

const path = require('path')
const BaseGenerators = require('@adonisjs/cli/src/Generators')

const Generators = BaseGenerators

Generators.factory = {
  /**
   * Path for factory file
   * @param  {String} name
   * @param  {Object} options FileWriter options
   * @return {String}         File Path
   */
  getFilePath: (name, options) => {
    return path.join(options.appRoot, options.dirs.factory)
  },
  getData: () => {}
}

module.exports = Generators
