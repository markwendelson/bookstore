'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
    book () {
        return this.hasMany('App/Models/Book','id', 'category_id')
    }
}

module.exports = Category
