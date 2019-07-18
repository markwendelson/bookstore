'use strict'

const User = use('App/Models/User')
const Category = use('App/Models/Category')
const Books = use('App/Models/Book')

class PageController {
   async index ({ view }) {
        let categories = await Category.all()
        let books = await Books.all()
        books = books.toJSON()
        categories = categories.toJSON()
        
        return view.render('pages.index', { categories, books })
    }
}

module.exports = PageController
