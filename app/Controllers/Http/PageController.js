'use strict'

const Cart = use('App/Models/Cart')
const Category = use('App/Models/Category')
const Books = use('App/Models/Book')

class PageController {
    async index ({ view, request, response, auth }) {
        const currentPage = request.get().page || 1
        const perPage = 10
        let categories = await Category.query().with('book').fetch()
        let books = await Books.query().paginate(currentPage,perPage)
        let cart = await Cart.all()
        // let cart = await Cart.query().where('user_id',id).fetch()
        books = books.toJSON()
        categories = categories.toJSON()
        cart = cart.toJSON()
        return view.render('pages.index', { categories, books, cart })
    }

    async singleItem ({ params, view, response }) {
        let categories = await Category.query().with('book').fetch()
        let book = await Books.find(params.id)
        await book.load('category')
        await book.load('comments')
        book = book.toJSON()
        categories = categories.toJSON()
        return view.render('pages.single-item', { categories, book })
    }

    async pageNotFound ({ view }) {
        return view.render('pages.error404')
    }
}

module.exports = PageController
