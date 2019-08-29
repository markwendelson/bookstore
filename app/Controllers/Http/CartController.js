'use strict'

const { validate } = use('Validator')
const Cart = use('App/Models/Cart')
const Books = use('App/Models/Book')

class CartController {
    async index({ response }){
        const cart = await Cart.all()

        return response.json({
            message: cart.count ? "cart found" : "no cart found",
            status: 200,
            data: cart
        });
    }

    async show ({ params, response }) {
        const cart = await Cart.find(params.id)

        if (!cart) {
            return response.json({
                message: "cart not found",
                status: 404,
                data: null
              });
        }

        return response.json({
            message: "cart found",
            status: 200,
            data: cart
        });
    }

    async store ({ request, response, session, auth }) {
        const rules = {
            book_id: 'required',
            quantity: 'required'
        }

        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            session
              .withErrors(validation.messages())

            return response.json({
                message: validation.messages(),
                status: 'error',
                data: null
            });
        }

        const { book_id, quantity } = request.only([
            'book_id',
            'quantity'
        ])

        // check books quantity if has stocks
        const book = await Books.find(book_id)
        if (book.quantity < quantity) {
            return response.json({
                message: "No more available stock.",
                status: 'error',
                data: book
            });
        }

        const user_id = auth.user.id

        // check if exists in cart
        const exist = await Cart.query().where('book_id',book_id).where('user_id',user_id).fetch()
        if(exist.rows.length) {
          return response.json({
            message: "Book already exists in cart",
            status: 'error',
            data: exist
        });
        }

        const cart = await Cart.create({
            book_id,
            user_id,
            quantity
        })

        // update book quantity
        book.quantity = book.quantity - quantity
        await book.save()

        return response.json({
            message: "Book added to cart",
            status: 'success',
            data: cart
        });
    }

    async destroy ({ params, response }) {
        const cart = await Cart.find(params.id)

        // update books quantity
        const books = await Books.find(cart.book_id)
        books.quantity = books.quantity + cart.quantity
        await books.save()

        await cart.delete()

        return response.json({
            message: "Book deleted from cart",
            status: 'success',
            data: null
        });
    }

    async update ({ params, request, response, session }) {
        const cart = await Cart.find(params.id)
        const rules = {
            quantity: 'required'
        }

        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            session
            .withErrors(validation.messages())

            return response.json({
                message: validation.messages(),
                status: 200,
                data: null
            });
        }

        const cartInfo = request.only(['quantity'])

        const book = await Books.find(cart.book_id)
        // check if enough quantity
        if (book.quantity + cart.quantity < cartInfo.quantity) {
            return response.json({
                message: "No more available stock.",
                status: 'error',
                data: null
            });
        }
        // update book quantity
        book.quantity = book.quantity + cart.quantity - cartInfo.quantity
        await book.save()

        cart.quantity = cartInfo.quantity
        await cart.save()

        return response.json({
            message: "Cart has been updated.",
            status: 'success',
            data: cart
        });

    }

    async deleteMultiple ({ request, response }) {
      const ids = request.only(['ids'])

    }
}

module.exports = CartController
