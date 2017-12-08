'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class BuilderProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/Schema:Build', () => require('../commands/Build'))
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Schema:Build')
  }
}

module.exports = BuilderProvider
