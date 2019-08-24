'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Book extends Model {
    comments () {
        return this.hasMany('App/Models/Comment').orderBy('created_at','desc')
    }

    category () {
        return this.hasOne('App/Models/Category', 'category_id', 'id')
    }

    cart () {
        return this.hasOne('App/Models/Cart', 'id', 'book_id')
    }

    order () {
        return this.hasOne('App/Models/Order', 'id', 'book_id')
    }

    user () {
        return this.belongsTo('App/Models/User', 'created_by', 'id')
    }
}

module.exports = Book
