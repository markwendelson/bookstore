'use strict'

const Cart = use('App/Models/Cart')
const Category = use('App/Models/Category')
const Books = use('App/Models/Book')

class PageController {
    async index ({ view, request, response, auth }) {
        const currentPage = request.get().page || 1
        const perPage = 10
        let categories = await Category.query().with('book').fetch()
        let books, cart = null

        if(auth.user == null)
        {
            books = await Books.query().whereNot('quantity',0).paginate(currentPage,perPage)
        }
        else
        {
            books = await Books.query().whereNot('created_by',auth.user.id).whereNot('quantity',0).paginate(currentPage,perPage)
            cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
            cart = cart.toJSON()
        }
        books = books.toJSON()
        categories = categories.toJSON()
        return view.render('pages.index', { categories, books, cart })
    }

    async singleItem ({ params, view, auth, response }) {
        let categories = await Category.query().with('book').fetch()
        let book = await Books.findOrFail(params.id)
        await book.load('category')
        await book.load('comments')
        book = book.toJSON()
        categories = categories.toJSON()

        let latest, cart = null;
        if (auth.user == null){
            latest = await Books.query().orderBy('created_at', 'DESC').first()
        } else {
            latest = await Books.query().orderBy('created_at', 'DESC').first()
            cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
            cart = cart.toJSON()
        }
        latest = latest.toJSON()

        let relatedProducts = await Books.query().where('category_id', book.category_id || 0).whereNot('id',params.id)
                            .orderBy('created_at', 'DESC')
                            .limit(3)
                            .fetch()
        relatedProducts = relatedProducts.toJSON()
        // return response.json({ relatedProducts })
        return view.render('pages.single-item', { categories, book, latest, cart, relatedProducts })
    }

    async pageNotFound ({ view }) {
        return view.render('pages.error404')
    }

    async search ({ view, request, auth, response }) {
        const filter_val = request.get('q')["q"]
        if(!filter_val) {
            return response.redirect('back')
        }
        const currentPage = request.get().page || 1
        const perPage = 10
        let categories = await Category.query().with('book').fetch()
        let books = await Books.query().where('book_name','LIKE','%'+filter_val+'%').paginate(currentPage,perPage)

        let user_id = 0;
        if(auth == null)
        {
            user_id = auth.user.id
        }
        else
        {
            user_id = 0
        }
        let cart = await Cart.query().with('book').where('user_id',user_id).fetch()
        books = books.toJSON()
        categories = categories.toJSON()
        cart = cart.toJSON()
        return view.render('pages.index', { categories, books, cart })
    }

    async viewByCategory ({ params,view, request, auth, response}) {
        const currentPage = request.get().page || 1
        const perPage = 10
        let categories = await Category.query().with('book').fetch()

        let cart, books = null;
        books = await Books.query().where('category_id',params.id).paginate(currentPage,perPage)

        if(auth.user != null) {
            books = await Books.query().whereNot('created_by',auth.user.id).where('category_id',params.id).paginate(currentPage,perPage)
            cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
            cart = cart.toJSON()
        }
        books = books.toJSON()
        categories = categories.toJSON()
        return view.render('pages.index', { categories, books, cart })
    }

    async checkAvailableQuantity ({ request, response }) {
      const { book_id, quantity, cart_id } = request.only([
        'book_id',
        'quantity',
        'cart_id'
    ])

      const cart = await Cart.findOrFail(cart_id)
      const book = await Books.findOrFail(book_id)

      if(book.quantity + cart.quantity < quantity) {
        return response.json({
              message: "Insufficient stock",
              status: 'error',
              data: book
        })
      }
    }
}

module.exports = PageController
