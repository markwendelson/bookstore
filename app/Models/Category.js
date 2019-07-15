'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
    book () {
        return this.belongsToMany('App/Models/Book')
    }
}

module.exports = Category
