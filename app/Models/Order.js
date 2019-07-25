'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
    book () {
        return this.hasOne('App/Models/Book', 'book_id', 'id')
    }

    users () {
        return this.belongsToMany('App/Models/User', 'user_id', 'id')
    }
}

module.exports = Order
