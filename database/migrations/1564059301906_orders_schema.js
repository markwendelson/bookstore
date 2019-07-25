'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      table.string('order_no').after('id').nullable()
      table.timestamp('completed_at').after('updated_at').nullable()
    })
  }

  down () {
    this.table('orders', (table) => {
      // reverse alternations
    })
  }
}

module.exports = OrdersSchema
