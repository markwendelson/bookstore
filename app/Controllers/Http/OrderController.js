'use strict'

const { validate } = use('Validator')
const Orders = use('App/Models/Order')
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

        const { order_no, book_id, user_id, price, quantity } = request.only([
            'order_no',
            'book_id',
            'user_id',
            'price',
            'quantity'
        ])

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
        
        await order.delete()

        return response.json({
            message: "order deleted",
            status: 204,
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
}

module.exports = OrderController
