'use strict'

const { validate } = use('Validator')
const Database = use('Database')
const Orders = use('App/Models/Order')
const Cart = use('App/Models/Cart')
const Books = use('App/Models/Book')

class OrderController {
    async index({ response }){
        const order = await Orders.all()

        return response.json({
            message: order.count ? "order found" : "no order found",
            status: 200,
            data: order
        });
    }

    async show ({ params, response }) {
        const order = await Orders.find(params.id)

        if (!order) {
            return response.json({
                message: "order not found",
                status: 404,
                data: null
              });
        }

        return response.json({
            message: "order found",
            status: 200,
            data: order
        });
    }

    async store ({ request, response, session }) {
        const rules = {
            order_no: 'required',
            book_id: 'required',
            user_id: 'required',
            price: 'required',
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

        const { order_no, book_id, user_id, price, quantity, cart_id } = request.only([
            'order_no',
            'book_id',
            'user_id',
            'price',
            'quantity',
            'cart_id'
        ])

        const cart = await Cart.find(cart_id)
        await cart.delete()

        const order = await Orders.create({
            order_no,
            book_id,
            user_id,
            price,
            quantity
        })

        return response.json({
            message: "order added",
            status: 201,
            data: order
        });
    }

    async destroy ({ params, request, response }) {
        const order = await Orders.find(params.id)

        // update books quantity
        const books = await Books.find(order.book_id)
        books.quantity = books.quantity + order.quantity
        await books.save()

        await order.delete()

        return response.json({
            message: "Book deleted from order",
            status: 'success',
            data: null
        });
    }

    async update ({ params, request, response }) {
        const order = await Orders.find(params.id)

        if (!order) {
            return response.status(404).json(null)
        }

        const rules = {
            price: 'required',
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

        const orderInfo = request.only(['price','quantity'])

        order.price = orderInfo.price
        order.quantity = orderInfo.quantity

        await order.save()

        return response.json({
            message: "order updated",
            status: 200,
            data: order
        });

    }

    async getOrderCode ({ params, auth, view, response })
    {
        let order_no = params.orderCode
        let orders = await Orders.query().with('book').where('user_id',auth.user.id).where('order_no',params.orderCode).fetch()

        orders = orders.toJSON()

        let total = orders.reduce(function (sum, ord) {
            return sum + (ord.quantity * ord.price) ;
        }, 0);

        let cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        cart = cart.toJSON()

        if (orders.length == 0)
        {
            return view.render('pages.error404')
        }
        else
        {
            return view.render('pages.user.checkout', { order_no, orders, total, cart })
        }

    }

    async management ({ auth, view, response }) {
      // get my books
      const myBooks = await Database.from('books').where('created_by',auth.user.id).pluck('id')
      let orders = await Orders.query().with('book').whereNot('user_id',auth.user.id).whereIn('book_id',myBooks).fetch()
      orders = orders.toJSON()

      let total = orders.reduce(function (sum, ord) {
          return sum + (ord.quantity * ord.price) ;
      }, 0);

      let cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
      cart = cart.toJSON()

      return view.render('management.orders', { orders, total, cart })
    }

    async paid ({ params, response }) {
      const order = await Orders.find(params.id)

      if (!order) {
          return response.status(404).json(null)
      }
      var today = new Date();
      order.completed_at = today
      await order.save()

      return response.json({
          message: "order updated",
          status: 200,
          data: order
      });

  }
}

module.exports = OrderController
