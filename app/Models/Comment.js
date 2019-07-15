'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {
    user () {
        return this.belongsTo('App/Models/User', 'user_id', 'id')
    }

    book () {
        return this.belongsToMany('App/Models/Book')
    }
}

module.exports = Comment
