'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

/**
 * Adonis Provider
 * @extends ServiceProvider
 */
class BuilderProvider extends ServiceProvider {
  /**
   * Register build command
   */
  register () {
    this.app.bind('Adonis/Commands/Schema:Build', () => require('../commands/Build'))
  }

  /**
   * Add command to ace
   */
  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Schema:Build')
  }
}

module.exports = BuilderProvider
