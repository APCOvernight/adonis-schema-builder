'use strict'

const path = require('path')
const BaseGenerators = require('@adonisjs/cli/src/Generators')

const Generators = BaseGenerators

Generators.factory = {
  getFilePath: (name, options) => {
    return path.join(options.appRoot, options.dirs.factory)
  },
  getData: () => {}
}

module.exports = Generators
