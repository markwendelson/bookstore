'use strict'

const User = use('App/Models/User')
const Category = use('App/Models/Category')
const Books = use('App/Models/Book')

class PageController {
    async index ({ view, request }) {
        const currentPage = request.get().page || 1
        const perPage = 2
        let categories = await Category.all()
        let books = await Books.query().paginate(currentPage,perPage)
        books = books.toJSON()
        categories = categories.toJSON()
        
        return view.render('pages.index', { categories, books })
    }
}

module.exports = PageController
