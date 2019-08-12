'use strict'

const { validate } = use('Validator')
const Cart = use('App/Models/Cart')

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

        const user_id = auth.user.id

        const cart = await Cart.create({ 
            book_id, 
            user_id, 
            quantity
        })

        return response.json({
            message: "Book added to cart",
            status: 'success',
            data: cart
        });
    }

    async destroy ({ params, response }) {
        const cart = await Cart.find(params.id)
        
        await cart.delete()

        return response.json({
            message: "Book deleted from cart",
            status: 'success',
            data: null
        });
    }

    async update ({ params, request, response, session }) {
        const cart = await Cart.find(params.id)
       
        if (!cart) {
            return response.status(404).json(null)
        }

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

        cart.quantity = cartInfo.quantity
       
        await cart.save()

        return response.json({
            message: "cart updated",
            status: 200,
            data: cart
        });
    
    }
}

module.exports = CartController
