'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.table('comments', (table) => {
      table.string('posted_by').after('user_id').nullable()
    })
  }

  down () {
    this.table('comments', (table) => {
      // reverse alternations
    })
  }
}

module.exports = CommentsSchema
