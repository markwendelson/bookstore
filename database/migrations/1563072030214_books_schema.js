'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BooksSchema extends Schema {
  up () {
    this.raw("ALTER TABLE `books` ALTER `category_id` DROP DEFAULT;")
    this.raw("ALTER TABLE `books` CHANGE COLUMN `category_id` `category_id` INT(11) NULL AFTER `author`;")
  }

  down () {
    this.table('books', (table) => {
      // reverse alternations
    })
  }
}

module.exports = BooksSchema
