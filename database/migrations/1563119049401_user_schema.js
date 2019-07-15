'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.boolean('can_buy_and_sell').after('password').defaultTo(0)
      table.boolean('is_admin').after('can_buy_and_sell').defaultTo(0)
      table.string('contact_no', 254).nullable().alter()
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserSchema
