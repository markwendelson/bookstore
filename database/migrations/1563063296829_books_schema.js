'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BooksDiscountSchema extends Schema {
  up () {
    this.table('books', (table) => {
      // alter table
      table.decimal('discount', 10, 4).after('price').defaultTo(0)
    })
  }

  down () {
    this.table('books', (table) => {
      // reverse alternations
    })
  }
}

module.exports = BooksDiscountSchema
