'use strict'

const User = use('App/Models/User')
const Category = use('App/Models/Category')
const Books = use('App/Models/Book')

class PageController {
    async index ({ view, request, response }) {
        const currentPage = request.get().page || 1
        const perPage = 10
        let categories = await Category.query().with('book').fetch()
        let books = await Books.query().paginate(currentPage,perPage)
        books = books.toJSON()
        categories = categories.toJSON()
        return view.render('pages.index', { categories, books })
    }

    async pageNotFound ({ view }) {
        return view.render('pages.error404')
    }
}

module.exports = PageController
