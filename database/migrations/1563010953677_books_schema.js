'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BooksSchema extends Schema {
  up () {
    this.create('books', (table) => {
      table.increments()
      table.string('book_name', 254).notNullable()
      table.string('description', 254).notNullable()
      table.string('author', 254).notNullable()
      table.integer('category_id', 254).notNullable()
      table.decimal('price', 10, 4).notNullable()
      table.integer('stock').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('books')
  }
}

module.exports = BooksSchema
