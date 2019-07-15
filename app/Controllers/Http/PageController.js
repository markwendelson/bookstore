'use strict'

const User = use('App/Models/User')
const Category = use('App/Models/Category')

class PageController {
   async index ({ view }) {
        let categories = await Category.all()
        categories = categories.toJSON()
        
        return view.render('pages.index', { categories })
    }

    async login ({ view }) {
        return view.render('auth.login')
    }

    async register ({ view }) {
        return view.render('auth.register')
    }

    async forgotPassword ({ view }) {
        return view.render('auth.forgotpassword')
    }
}

module.exports = PageController
