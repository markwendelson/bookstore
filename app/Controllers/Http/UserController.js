'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Cart = use('App/Models/Cart')
const Orders = use('App/Models/Order')
var randomstring = require("randomstring")

class UserController {
    async show ({ params, response }) {
        // if (auth.user.id !== Number(params.id)) {
        //   return "You cannot see someone else's profile"
        // }

        const user = await User.findOrFail(params.id)
        if (!user) {
            return response.status(404).json(null)
        }
        return response.status(200).json(user)
    }

    async index ({ response }) {      
        const users = await User.all()
        return response.status(200).json(users)
    }

    async destroy ({ params, request, response }) {
        const user = await User.find(params.id)
        if (!user) {
            return response.status(404).json(null)
          }
          await user.delete()
          return response.status(204).json(null)
    }

    async update ({ params, request, response }) {
        const rules = {
            firstname: 'required',
            middlename: 'required',
            lastname: 'required',
            email: 'required|email|unique:users'
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

        const userInfo = request.only([
            'firstname',
            'middlename',
            'lastname',
            'contact_no',
            'email'
        ])

        const user = await User.find(params.id)
        if (!user) {
            return response.status(404).json(null)
        }
        user.firstname = userInfo.firstname
        user.middlename = userInfo.middlename
        user.lastname = userInfo.lastname
        user.contact_no = userInfo.contact_no
        user.email = userInfo.email
       
        await user.save()

        return response.status(200).json(user)
    }
    
    async userCart ({ view, auth }) {
        let cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        let _cart = cart.toJSON()
        
        let total = _cart.reduce(function (sum, crt) {
            return sum + (crt.quantity * (crt.book.price - (crt.book.price * (crt.book.discount/100)))) ;
        }, 0);

        return view.render('pages.user.cart', { cart, total })
    }

    async userOrders ({ view, auth }) {
        let orders = await Orders.query().with('book').where('user_id',auth.user.id).fetch()
        orders = orders.toJSON()
        
        let total = orders.reduce(function (sum, ord) {
            return sum + (ord.quantity * ord.price) ;
        }, 0);
        return view.render('pages.user.orders', { orders, total })
    }

    async userCheckout ({ request, view, auth }) {
        let orders = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        const order_number = randomstring.generate(10);
        return view.render('pages.user.checkout', { orders, order_number })
    }

    async userAccount ({ view }) {
        return view.render('pages.user.account')
    }

}

module.exports = UserController
