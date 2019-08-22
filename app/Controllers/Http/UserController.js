'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Book = use('App/Models/Book')
const Cart = use('App/Models/Cart')
const Orders = use('App/Models/Order')
const Category = use('App/Models/Category')
const Mail = use('Mail')
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
        return response.json({
            message: "User deleted",
            status: 'success',
            data: null
        }); 
    }

    async update ({ auth, request, response, session }) {
        const rules = {
            firstname: 'required',
            middlename: 'required',
            lastname: 'required',
            contact_no: 'required',
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

        const userInfo = request.only([
            'firstname',
            'middlename',
            'lastname',
            'contact_no',
        ])

        const user = await User.find(auth.user.id)
        if (!user) {
            return response.json({
                message: 'Invalid user.',
                status: 'error',
                data: null
            });
        }
        user.firstname = userInfo.firstname
        user.middlename = userInfo.middlename
        user.lastname = userInfo.lastname
        user.contact_no = userInfo.contact_no
       
        await user.save()

        return response.json({
            message: 'Successfully updated account.',
            status: 'success',
            data: user
        });
    }
    
    async userCart ({ view, auth }) {
        const order_number = randomstring.generate(10);
        let cart = await Cart.query().with('book').where('user_id', auth.user.id).fetch()
        cart = cart.toJSON()
        
        let total = cart.reduce(function (sum, crt) {
            return sum + (crt.quantity * (crt.book.price - (crt.book.price * (crt.book.discount/100)))) ;
        }, 0);

        return view.render('pages.user.cart', { cart, total, order_number })
    }

    async userOrders ({ view, auth }) {
        let orders = await Orders.query().with('book').where('user_id',auth.user.id).fetch()
        orders = orders.toJSON()
        
        let total = orders.reduce(function (sum, ord) {
            return sum + (ord.quantity * ord.price) ;
        }, 0);

        let cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        cart = cart.toJSON()

        return view.render('pages.user.orders', { orders, total, cart })
    }

    async userCheckout ({ request, view, auth, response }) {
        const order = request.collect(['order_no'])
        // return response.json(order)
        let orders = await Orders.query().with('book').where('user_id',auth.user.id).fetch()
        orders = orders.toJSON()

        let cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        cart = cart.toJSON()

        return view.render('pages.user.checkout', { orders, cart })
    }

    async userAccount ({ view, auth }) {
        let cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        cart = cart.toJSON()
        return view.render('pages.user.account', { cart })
    }

    async userGetCheckout ({ auth, response }) {
        let orders = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        return response.json(orders)
    }

    async userBooks ({ view, auth }) {
        let books = await Book.query().with('category').where('created_by',auth.user.id).fetch()
        books = books.toJSON()

        let categories = await Category.all()
        categories = categories.toJSON()

        let cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        cart = cart.toJSON()

        return view.render('management.books', { books, categories, cart })
    }

    async management ({ view }) {
        let users = await User.all()
        users = users.toJSON()

        return view.render('management.users', { users })
    }

    async updateBuyAndSell ({ params, request, response }) {
        const user = await User.find(params.id)
        
        if (!user) {
            return response.json({
                message: 'Invalid user.',
                status: 'error',
                data: null
            });
        }
        const can_buy_and_sell = user.can_buy_and_sell == 1 ? 0 : 1
        user.can_buy_and_sell = can_buy_and_sell

        var msg = can_buy_and_sell == 1 ? 'Successfully updated account. User can now buy and sell' : 'Successfully updated account. User is disabled for buy and sell'
       
        await user.save()

        const accountSid = 'ACac9086c2543bda7a2ead6715680b2923';
        const authToken = '5e3b5032ad5bdf3ff803960950fd979e';
        const client = require('twilio')(accountSid, authToken);
        
        if ((user.can_buy_and_sell) && (user.contact_no) ) {
            client.messages
            .create({
                body: 'Your account was approved for buy and sell.',
                from: '+12017404022',
                to: '+63'+user.contact_no
            })
            .then(message => console.log(message.sid))

            await Mail.send('emails.can_buy_and_sell', user.toJSON(), (message) => {
                message
                .to(user.email)
                .from('admin@essu-bookstore.com')
                .subject('Congratulations')
            })
        }

        return response.json({
            message: msg,
            status: 'success',
            data: user
        });
    }

    async search ({ request, view }) {
        const filter_val = request.get('q')["q"]
        let users = await User.query()
                                .where('firstname',filter_val)
                                .orWhere('middlename',filter_val)
                                .orWhere('lastname',filter_val)
                                .orWhere('email',filter_val)
                                .fetch()
        
        users = users.toJSON()

        return view.render('management.users', { users })
    }

}

module.exports = UserController
