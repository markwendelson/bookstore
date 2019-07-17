'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')

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
    
    async userCart ({ view }) {
        return view.render('pages.user.cart')
    }

    async userOrders ({ view }) {
        return view.render('pages.user.orders')
    }

    async userAccount ({ view }) {
        return view.render('pages.user.account')
    }

}

module.exports = UserController
